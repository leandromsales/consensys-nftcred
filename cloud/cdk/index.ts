#!/usr/bin/env node

import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { StackProps } from "aws-cdk-lib";
import { PlatformStack } from "./lib/PlatformStack";
import {
  ApplicationProps,
  StageAppOptions,
  StagesConfigType,
} from "./lib/TypesOptions";
import envConfig from "./env.json";

function throwExpression(errorMessage: string): never {
  throw new Error(errorMessage);
}

const stackName =
  envConfig.baseStackName ??
  throwExpression("Missing required env config: baseStackName.");
const accountId =
  envConfig.accountId ??
  throwExpression("Missing required env config: accountId.");
console.log(`   - Account Id: ${accountId}`);

const zoneId =
  envConfig.hostzoneId ??
  throwExpression("Missing required env config: hostzoneId.");
console.log(`   - Zone Id: ${zoneId}`);

const domain =
  envConfig.domain ?? throwExpression("Missing required env config: domain.");
console.log(`   - Domain: ${domain}`);

const subdomain =
  envConfig.subdomain ??
  throwExpression("Missing required env config: subdomain.");
console.log(`   - SubDomain: ${subdomain}`);

const fullDomain =
  subdomain && subdomain.length > 0 ? `${subdomain}.${domain}` : `${domain}`; // Define the full domain

const stages =
  envConfig.stages ?? throwExpression("At least one stage must be provided.");
console.log(`   - Stages: ${stages}`);

const app = new cdk.App();

Object.keys(envConfig.stages).forEach((stageName) => {
  let stageNameKey = stageName as StagesConfigType;

  const stackRegion =
    envConfig.stages[stageNameKey]!.region ??
    throwExpression("Missing required env config: region.");
  console.log(`   - Region: ${stackRegion}`);

  let stackProps: StackProps = {
    stackName: `${stackName}${stageName.charAt(0).toUpperCase()}${stageName
      .substring(1)
      .toLowerCase()}`,
    terminationProtection: true, // Must be set to false to destroy the stack

    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */

    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    env: { account: accountId, region: stackRegion },

    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  };

  console.log(`===> Creating or updating stack ${stackProps.stackName}...`);
  let props = new ApplicationProps(
    accountId,
    stackRegion,
    zoneId,
    domain,
    subdomain,
    fullDomain,
    stackProps,
  );

  // TODO: validate these parameters
  let sao = new StageAppOptions(
    envConfig.stages[stageNameKey]!.region,
    envConfig.stages[stageNameKey]!.apiName,
    envConfig.stages[stageNameKey]!.apiDescription,
    envConfig.stages[stageNameKey]!.apiHostname,
    envConfig.stages[stageNameKey]!.apiVersion,
    fullDomain,
    envConfig.stages[stageNameKey]!.appHostname,
    envConfig.stages[stageNameKey]!.appVersion,
    envConfig.stages[stageNameKey]!.realtimeNotification,
  );
  props.stages.set(stageName, sao);
  new PlatformStack(app, stackProps.stackName as string, stageName, props);
});
