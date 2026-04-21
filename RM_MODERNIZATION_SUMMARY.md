# Modernization summary

## 1) OAC instead of OAI

One of the most important changes is replacing the old CloudFront **Origin Access Identity (OAI)** model with **Origin Access Control (OAC)**.

Why this matters:

- OAC is the newer CloudFront mechanism for securing access from CloudFront to S3
- it supports the service principal + `AWS:SourceArn` bucket policy pattern
- it aligns better with current AWS guidance for private S3 origins behind CloudFront

In this repo:

- the CloudFront distribution uses `OriginAccessControlId`
- the S3 bucket policy allows `cloudfront.amazonaws.com`
- access is restricted with a condition on the specific distribution ARN

This is a major improvement over the older v0.5-style OAI/canonical-user policy.

## 2) Node.js runtime modernization

The older **v0.5** template used **Node.js 12** in the copy helper components.

This repo upgrades the website-copy layer and function to **Node.js 20**, which makes the helper resources more deployable in a current AWS environment. 

## 3) Response headers policy instead of Lambda@Edge for security headers

In the older **v0.5** implementation, response security headers were attached through a **Lambda@Edge** function.

This repo uses a native **CloudFront ResponseHeadersPolicy** instead.

Benefits:

- less moving infrastructure
- fewer **Lambda@Edge** operational concerns
- clearer configuration directly in CloudFormation
- easier customization of security headers

This repo also goes beyond the minimal upstream policy by providing a **more complete Content-Security-Policy** and other security header settings directly in the CloudFront distribution template.

## 4) Tighter IAM for the S3 copy helper

The older **v0.5** implementation attached broad S3 access to the copy helper role.

This repo scopes IAM permissions more explicitly to the target S3 bucket by granting only the actions needed to upload and manage the static content:

- `s3:GetObject`
- `s3:ListBucket`
- `s3:PutObject`
- `s3:PutObjectAcl`

This is a better least-privilege default.

## 5) Non-public S3 origin with REST endpoint access

This repo keeps the website bucket private and uses CloudFront with the S3 REST origin, rather than relying on an S3 static website endpoint.

This is important because OAC works with a regular S3 bucket origin, not an S3 website endpoint. It also keeps direct bucket access closed off and lets CloudFront handle HTTPS, caching, and access control.

## 6) Better bucket ownership and logging defaults

This repo adds or preserves cleaner S3 defaults such as:

- bucket encryption
- dedicated access logging bucket
- `OwnershipControls` on the logging bucket
- origin access logging from the content bucket to the log bucket

## 7) Optional `apex-domain` support

Compared with the older **v0.5** behavior, this repo adds a **`CreateApex`** option so you can choose whether to create DNS and certificate coverage for the apex `domain` in addition to the `subdomain`.

That makes the template more flexible for either:

- `www.example.com` only, or
- both `www.example.com` and `example.com`

## 8) Explicit naming parameters

This repo adds parameters for naming the key resources, including:

- root bucket name
- logs bucket name
- copy Lambda name
- copy layer name

That makes the stack easier to understand, reuse, and fit into an existing naming strategy.

## 9) Custom cache policy and origin request policy

Beyond the upstream **v0.12** modernization, this repo adds explicit **CloudFront policies** for behavior tuning.

The templates define:

- a custom **OriginRequestPolicy**
- a custom **CachePolicy**

These are configured to:

- support **Brotli** and **gzip**
- forward selected **geolocation-related** CloudFront headers
- keep cookies and query strings tightly controlled

This makes the distribution easier to adapt for geolocation-aware frontend behavior and more deliberate `cache-key` management.

## 10) SPA (Single Page Apps) custom error handling

This repo changes the CloudFront custom error responses so `403` and `404` can return a configured page with **HTTP 200**.

That is a practical choice for many frontend apps, especially single-page applications where client-side routing should still resolve through the main site shell or custom fallback pages.
