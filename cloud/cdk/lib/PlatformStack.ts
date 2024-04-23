import { Construct } from "constructs";
import { HostedZone, NsRecord } from "aws-cdk-lib/aws-route53";
import { AbstractStack } from "./AbstractStack";
import { ApplicationProps } from "./TypesOptions";
import { Route53Service } from "./dns/route53";
import { ApiService } from "./api/api-service";
import { AppService } from "./app/app-service";
import { ACMService } from "./certificate/acm";
import { DynamoDBService } from "./database/dynamodb";
import { RealtimeNotificationService } from "./app/appService";

export class PlatformStack extends AbstractStack {
  constructor(
    scope: Construct,
    id: string,
    stageName: string,
    props: ApplicationProps,
  ) {
    super(scope, id, props);

    console.log(
      `===> Loading stage "${stageName}" of/for stack ${props.stack.stackName}`,
    );

    new Route53Service(
      this,
      `${ApplicationProps.defineLogicalId("Route53", stageName)}`,
      stageName,
      this.props,
    );

    new ACMService(
      this,
      `${ApplicationProps.defineLogicalId("ACM", stageName)}`,
      stageName,
      this.props,
    );

    const realtimeNotificationService = new RealtimeNotificationService(
      this,
      `${ApplicationProps.defineLogicalId(`RealtimeNotification`, stageName)}`,
      stageName,
      this.props,
      Cognito.userPool.userPoolArn,
    );

    new AppService(
      this,
      `${ApplicationProps.defineLogicalId("App", stageName)}`,
      stageName,
      this.props,
    );

    new APIServices(
      this,
      `${ApplicationProps.defineLogicalId("API", stageName)}`,
      stageName,
      this.props,
      Cognito,
      DynamoDBs,
      IoTs,
    );
  }
}
