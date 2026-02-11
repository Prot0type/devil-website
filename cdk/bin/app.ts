#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { StaticSiteStack } from "../lib/static-site-stack";

const app = new cdk.App();

// Dev environment
new StaticSiteStack(app, "PiggiesPagesDev", {
  environment: "dev",
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-west-2",
  },
});

// Prod environment
new StaticSiteStack(app, "PiggiesPagesProd", {
  environment: "prod",
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-west-2",
  },
});

app.synth();
