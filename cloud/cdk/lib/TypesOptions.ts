import { StackProps } from "aws-cdk-lib";
import { IHostedZone } from "aws-cdk-lib/aws-route53";
import { DomainName, HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { Md5 } from "ts-md5";
import envConfig from "../env.json";

export type StagesConfigType = keyof typeof envConfig.stages;

export interface RealtimeNotification {
  hostname: string;
  httpPort: number;
  httpsPort: number;
  containerPort: number;
  containerMemory: number;
}

export class StageAppOptions {
  region: string;
  apiName: string;
  apiDescription: string;
  apiHostname: string;
  apiVersion: string;
  databaseTTL: { messages: string; connections: string };
  fullApiDomainName: DomainName;
  appHostname: string;
  appVersion: string;
  domainName: DomainName;
  fullDomainName: string;
  fullApiHostname: string;
  fullAppHostname: string;
  realtimeNotification: RealtimeNotification;
  fullRealtimeNotificationHostname: string;

  constructor(...args: any[]) {
    if (args.length === 11) {
      this.region = args[0]; //region
      this.apiName = args[1]; //apiName
      this.apiDescription = args[2]; //apiDescription
      this.apiHostname = args[3]; //apiHostname
      this.apiVersion = args[4]; //apiVersion
      this.fullDomainName = args[5]; //fullDomainName
      this.fullApiHostname = `${this.apiHostname}.${args[5]}`; //fullDomain
      this.appHostname = args[6]; //appHostname
      this.fullAppHostname = `${this.appHostname}.${args[5]}`; //fullDomain
      this.appVersion = args[7]; //appVersion
      this.realtimeNotification = args[8]; //realtimeNotification
      this.fullRealtimeNotificationHostname = `${this.realtimeNotification.hostname}.${args[5]}`; //domain
    } else {
      throw new Error(
        "Invalid number of arguments on env.json. Expected 11, received " +
          args.length,
      );
    }
  }
}

export class ApplicationProps {
  accountId: string;
  region: string;
  zoneId: string;
  domain: string;
  subdomain: string;
  fullDomain: string;
  stack: StackProps;
  zone: IHostedZone;
  stages: Map<string, StageAppOptions> = new Map<string, StageAppOptions>();
  usEastCertificate?: ICertificate;
  regionalCertificate?: ICertificate;
  httpApi?: HttpApi;
  apiVersion: string;

  constructor(
    accountId: string,
    region: string,
    zoneId: string,
    domain: string,
    subdomain: string,
    fullDomain: string,
    stack: StackProps,
  ) {
    this.accountId = accountId;
    this.region = region;
    this.zoneId = zoneId;
    this.domain = domain;
    this.subdomain = subdomain;
    this.fullDomain = fullDomain;
    this.stack = stack;
  }

  static defineLogicalId(name: string, stageName?: string) {
    if (stageName == undefined) stageName = "UnknownStage";
    const logicalId =
      stageName + "-" + Md5.hashAsciiStr(`${name}-${stageName}`);
    console.log(`  --> Logical id: ${logicalId} | Name: ${name}`);
    return logicalId;
  }

  static definePhysicalName(name: string, stackName: string) {
    return stackName + "-" + name;
  }

  getStage(stageName?: string) {
    return this.stages?.get(stageName!);
  }

  getStack() {
    return this.stack.stackName!;
  }
}
