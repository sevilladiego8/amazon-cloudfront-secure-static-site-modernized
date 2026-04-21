# Deploying The Static Site to AWS

1. Run the following to validate and then package the build artifact:

   ```bash
   # should generate a json or throw errors if the yaml has issues
   aws cloudformation validate-template --template-body file://templates/main.yaml
   ```

   ```bash
   make package-static
   ```

   \*\* delete `package.template` if exists

2. Create bucket to store cloudformation artifacts

   ```bash
   aws s3 mb s3://customdomain.com.cf-artifacts --region us-east-1
   ```

3. Run the following AWS CLI command to package the CloudFormation template. The template uses the [AWS Serverless Application Model](https://aws.amazon.com/about-aws/whats-new/2016/11/introducing-the-aws-serverless-application-model/), so it must be transformed before you can deploy it.

   ```bash
   aws --region us-east-1 cloudformation package \
       --template-file templates/main.yaml \
       --s3-bucket customdomain.com.cf-artifacts \
       --output-template-file packaged.template
   ```

4. Run the following command to deploy the packaged CloudFormation template to a CloudFormation stack. To optionally deploy the stack with a domain apex skip this section and proceed to [Step 5] below.

   > You MUST specify `CreateApex = yes` in `custom-params.json`

   ```bash
   aws --region us-east-1 cloudformation deploy \
      --stack-name customdomaincom-cf-stack \
      --template-file packaged.template \
      --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
      --parameter-overrides file://config/custom-params.json
      --debug
   ```

5. [Optional] Run the following command to deploy the packaged CloudFormation template to a CloudFormation stack with a domain apex.

   > You MUST specify `CreateApex = no` in `custom-params.json`

   ```bash
   aws --region us-east-1 cloudformation deploy \
       --stack-name customdomaincom-cf-stack \
       --template-file packaged.template \
       --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
       --parameter-overrides file://config/custom-params.json
       --debug
   ```

6. Go to [Cloudformation Console](https://us-east-1.console.aws.amazon.com/cloudformation/home) to see the logs of your cloudformation stack and wait until its nested stacks are completed

> In case of errors, double check the logs of the stack and nested stacks. After understanding the error, perform necessary adjustments, delete the stack and finally re-run the previous command.

7. Go checkout your website address `customdomain.com`

# Uploading Assets to S3 (Vite+React)

1. Navigate to your frontend project and build your site locally with Vite

   ```bash
   vite build
   ```

2. Preview your deployed website locally

3. Run custom upload script (after build output is ready) to upload `dist/` contents
   ```bash
   node upload-to-s3.js
   ```

# Useful Commands

### Cloud front

1. Run this to invalidate new contents added to the S3BucketRoot that hosts the website contents behind the cloudfront distribution

   ```shell
   aws cloudfront create-invalidation \
      --distribution-id YOUR_DISTRIBUTION_ID \
      --paths "/*"
   ```