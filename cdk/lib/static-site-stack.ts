import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as iam from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import * as path from "path";

export interface StaticSiteStackProps extends cdk.StackProps {
  environment: "dev" | "prod";
  /** Optional: domain name for prod (e.g. piggiespages.com) */
  domainName?: string;
}

export class StaticSiteStack extends cdk.Stack {
  public readonly distributionUrl: cdk.CfnOutput;
  public readonly bucketName: cdk.CfnOutput;
  public readonly distributionId: cdk.CfnOutput;

  constructor(scope: Construct, id: string, props: StaticSiteStackProps) {
    super(scope, id, props);

    const envPrefix = props.environment;

    // S3 bucket for static site files
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      bucketName: `piggies-pages-${envPrefix}-${this.account}-${this.region}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy:
        props.environment === "dev"
          ? cdk.RemovalPolicy.DESTROY
          : cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: props.environment === "dev",
    });

    // S3 bucket for video assets (separate to manage independently)
    const videoBucket = new s3.Bucket(this, "VideoBucket", {
      bucketName: `piggies-pages-video-${envPrefix}-${this.account}-${this.region}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy:
        props.environment === "dev"
          ? cdk.RemovalPolicy.DESTROY
          : cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: props.environment === "dev",
    });

    // Origin Access Control for CloudFront -> S3
    const oac = new cloudfront.S3OriginAccessControl(this, "OAC", {
      signing: cloudfront.Signing.SIGV4_ALWAYS,
    });

    // CloudFront distribution
    const siteOrigin = origins.S3BucketOrigin.withOriginAccessControl(siteBucket, {
      originAccessControl: oac,
    });

    const videoOrigin = origins.S3BucketOrigin.withOriginAccessControl(videoBucket, {
      originAccessControl: oac,
      originPath: "/",
    });

    const distribution = new cloudfront.Distribution(this, "Distribution", {
      defaultBehavior: {
        origin: siteOrigin,
        viewerProtocolPolicy:
          cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        "/video/*": {
          origin: videoOrigin,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
      },
      defaultRootObject: "index.html",
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(5),
        },
      ],
    });

    // Outputs
    this.distributionUrl = new cdk.CfnOutput(this, "DistributionURL", {
      value: `https://${distribution.distributionDomainName}`,
      description: `${envPrefix} CloudFront URL`,
    });

    this.bucketName = new cdk.CfnOutput(this, "SiteBucketName", {
      value: siteBucket.bucketName,
      description: `${envPrefix} S3 site bucket name`,
    });

    this.distributionId = new cdk.CfnOutput(this, "DistributionId", {
      value: distribution.distributionId,
      description: `${envPrefix} CloudFront distribution ID`,
    });

    new cdk.CfnOutput(this, "VideoBucketName", {
      value: videoBucket.bucketName,
      description: `${envPrefix} S3 video bucket name`,
    });
  }
}
