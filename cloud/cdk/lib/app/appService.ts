import { Construct } from "constructs";
import { ApplicationProps } from "../TypesOptions";
import { AbstractService } from "../AbstractService";
import path from "path";
import * as cdk from "aws-cdk-lib";
import * as ecs from "aws-cdk-lib/aws-ecs";
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as iam from "aws-cdk-lib/aws-iam";
import { ARecord, RecordTarget } from "aws-cdk-lib/aws-route53";
import { LoadBalancerTarget } from "aws-cdk-lib/aws-route53-targets";
import * as logs from "aws-cdk-lib/aws-logs";

export class AppService extends AbstractService {
  public readonly realtimeNotificationQueue: sqs.Queue;

  constructor(
    scope: Construct,
    id: string,
    stageName: string,
    props: ApplicationProps,
    cognitoUserPoolArn: string,
  ) {
    super(scope, id, stageName, props);

    let stack = this.props.getStack();
    let stage = this.getStage();

    const httpPort = stage.realtimeNotification.httpPort;
    const httpsPort = stage.realtimeNotification.httpsPort;
    const containerPort = stage.realtimeNotification.containerPort;
    const containerMemory = stage.realtimeNotification.containerMemory;
    const recordName = `${stage.realtimeNotification.hostname}.${this.props.subdomain}`;

    const baseLogicalName = "HTMIoTCloud-RTN-";

    let name = `/ecs/${baseLogicalName}-${stageName}`;
    let resId = this.defineLogicalId(`${baseLogicalName}LG`);
    const logGroup = new logs.LogGroup(this, resId, {
      logGroupName: name,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      retention: logs.RetentionDays.ONE_WEEK,
    });

    let resName = `${baseLogicalName}Cluster`;
    resId = this.defineLogicalId(resName);
    name = `${resName}-${stageName}`;
    const cluster = new ecs.Cluster(this, resId, {
      clusterName: name,
    });

    cluster.enableFargateCapacityProviders();

    resName = `${baseLogicalName}ALB`;
    resId = this.defineLogicalId(resName);
    name = `${resName}-${stageName}`;
    const webSocketLoadBalancer = new elbv2.ApplicationLoadBalancer(
      this,
      resId,
      {
        loadBalancerName: name,
        vpc: cluster.vpc,
        internetFacing: true,
      },
    );

    resId = this.defineLogicalId(`${baseLogicalName}HL`);
    const httpsListener = webSocketLoadBalancer.addListener(resId, {
      port: httpsPort,
      open: true,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      certificates: [props.regionalCertificate!],
    });

    webSocketLoadBalancer.addRedirect({
      sourceProtocol: elbv2.ApplicationProtocol.HTTP,
      sourcePort: httpPort,
      targetProtocol: elbv2.ApplicationProtocol.HTTPS,
      targetPort: httpsPort,
    });

    resId = this.defineLogicalId(`${baseLogicalName}DI`);
    const dockerImageAsset = new DockerImageAsset(this, resId, {
      directory: path.join(
        __dirname,
        `../../../services/app/${this.getStage().apiVersion}`,
      ),
    });

    resId = this.defineLogicalId(`${baseLogicalName}TR`);
    const taskRole = new iam.Role(this, resId, {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    const cognitoPolicyStatement = new iam.PolicyStatement({
      actions: ["cognito-idp:GetUser"],
      resources: [cognitoUserPoolArn],
    });
    taskRole.addToPolicy(cognitoPolicyStatement);

    resId = this.defineLogicalId(`${baseLogicalName}TD`);
    const taskDefinition = new ecs.FargateTaskDefinition(this, resId, {
      memoryLimitMiB: containerMemory,
      taskRole: taskRole,
      runtimePlatform: {
        cpuArchitecture: ecs.CpuArchitecture.of("X86_64"),
        operatingSystemFamily: ecs.OperatingSystemFamily.of("LINUX"),
      },
    });

    resName = `${baseLogicalName}SQS`;
    resId = this.defineLogicalId(resName);
    name = `${resName}-${stageName}`;
    this.realtimeNotificationQueue = new sqs.Queue(this, resId, {
      queueName: name,
      receiveMessageWaitTime: cdk.Duration.seconds(10), // TODO: env this
    });

    resId = this.defineLogicalId(`${baseLogicalName}TDCA`);
    taskDefinition.addContainer(resId, {
      image: ecs.ContainerImage.fromDockerImageAsset(dockerImageAsset),
      environment: {
        REALTIME_NOTIFICATION_QUEUE_URL:
          this.realtimeNotificationQueue.queueUrl,
        HTM_WS_HOSTNAME: stage.fullRealtimeNotificationHostname,
        PORT: `${containerPort}`,
        REGION: stage.region,
      },
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: this.defineLogicalId(`${baseLogicalName}Container`),
        logGroup: logGroup,
      }),
      portMappings: [{ containerPort: containerPort }],
    });

    this.realtimeNotificationQueue.grantConsumeMessages(
      taskDefinition.taskRole,
    );

    resId = this.defineLogicalId(`${baseLogicalName}SG`);
    const securityGroup = new ec2.SecurityGroup(this, resId, {
      vpc: cluster.vpc,
      description: `Security group for ${baseLogicalName} device.`,
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(containerPort),
      `Allow inbound traffic on port ${containerPort} for ${baseLogicalName} service`,
    );

    resId = this.defineLogicalId(`${baseLogicalName}FS`);
    const fargateService = new ecs.FargateService(this, resId, {
      cluster,
      taskDefinition,
      capacityProviderStrategies: [
        {
          capacityProvider: "FARGATE_SPOT",
          weight: 2,
        },
        {
          capacityProvider: "FARGATE",
          weight: 1,
        },
      ],
      assignPublicIp: true,
      serviceName: resId,
      securityGroups: [securityGroup],
    });

    resName = `${baseLogicalName}TG`;
    name = `${resName}-${stageName}`;
    resId = this.defineLogicalId(resName);
    httpsListener.addTargets(resId, {
      targetGroupName: name,
      targets: [fargateService],
      port: containerPort,
      protocol: elbv2.ApplicationProtocol.HTTP,
      healthCheck: {
        protocol: elbv2.Protocol.HTTP,
        port: `${containerPort}`,
        path: "/health",
        interval: cdk.Duration.seconds(90),
        timeout: cdk.Duration.seconds(60),
        healthyHttpCodes: "200-299",
        unhealthyThresholdCount: 4,
        healthyThresholdCount: 2,
      },
    });

    const alias = RecordTarget.fromAlias(
      new LoadBalancerTarget(webSocketLoadBalancer),
    );
    resId = this.defineLogicalId(`${baseLogicalName}R53H`);
    new ARecord(this, resId, {
      zone: props.zone!,
      recordName: recordName,
      target: alias,
    });
  }
}
