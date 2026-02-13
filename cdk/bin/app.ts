#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StaticSiteStack } from "../lib/static-site-stack";

const app = new cdk.App();
const readDomainConfig = (envPrefix: "DEV" | "PROD") => {
  const domainName = process.env[`${envPrefix}_DOMAIN_NAME`];
  const certificateArn = process.env[`${envPrefix}_CERTIFICATE_ARN`];

  if ((domainName && !certificateArn) || (!domainName && certificateArn)) {
    throw new Error(
      `Set both ${envPrefix}_DOMAIN_NAME and ${envPrefix}_CERTIFICATE_ARN together, or leave both unset.`
    );
  }

  return { domainName, certificateArn };
};

const devConfig = readDomainConfig("DEV");
const prodConfig = readDomainConfig("PROD");

// Dev environment
new StaticSiteStack(app, "PiggiesPagesDev", {
  environment: "dev",
  domainName: devConfig.domainName,
  includeWwwAlias: false,
  certificateArn: devConfig.certificateArn,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-west-2",
  },
});

// Prod environment
new StaticSiteStack(app, "PiggiesPagesProd", {
  environment: "prod",
  domainName: prodConfig.domainName,
  includeWwwAlias: true,
  certificateArn: prodConfig.certificateArn,
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-west-2",
  },
});

app.synth();
