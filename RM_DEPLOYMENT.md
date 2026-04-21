# Deploying The Static Site to AWS

1. Run the following to validate and then package the build artifact:

   ```bash
   # should generate a json or throw errors if the yaml has issues
   aws cloudformation validate-template --template-body file://templates/main.yaml
   ```
   ```bash
   make package-static
   ```

   ** delete `package.template` if exists

2. Create bucket to store cloudformation artifacts

    ```bash
    aws s3 mb s3://diegosevilla.com.cf-artifacts --region us-east-1
    ```

3. Run the following AWS CLI command to package the CloudFormation template. The template uses the [AWS Serverless Application Model](https://aws.amazon.com/about-aws/whats-new/2016/11/introducing-the-aws-serverless-application-model/), so it must be transformed before you can deploy it.

   ```bash
   aws --region us-east-1 cloudformation package \
       --template-file templates/main.yaml \
       --s3-bucket diegosevilla.com.cf-artifacts \
       --output-template-file packaged.template
       --debug
   ```

   If everything is successfull this output will appear: 
   ```
      > Execute the following command to deploy the packaged template
      > aws cloudformation deploy --template-file /path/amazon-cloudfront-secure-static-site-modernized/packaged.template --stack-name <YOUR STACK NAME>
   ```

4. [Optional] Run the following command to deploy the packaged CloudFormation template to a CloudFormation stack with a domain apex.

   ```bash
   aws --region us-east-1 cloudformation deploy \
       --stack-name diegosevillacom-cf-stack \
       --template-file packaged.template \
       --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND \
       --parameter-overrides file://config/custom-params.json
       --debug
   ```

    > \*\* IMPORTANT!! Double check `custom-params.json` to see the parameter-overrides structure

5. Go to [Cloudformation Console](https://us-east-1.console.aws.amazon.com/cloudformation/home) to see the logs of your cloudformation stack and wait until its nested stacks are completed

> In case of errors, double check the logs of the stack and nested stacks. After understanding the error, perform necessary adjustments, delete the stack and finally re-run the previous command.

6. Go checkout your website address `diegosevilla.com`


# Uploading Assets to S3 (Vite+React)

1. Create infrastructure with CloudFormation

   ```bash
   aws cloudformation deploy --template-file cloudformation.yaml --stack-name diegosevillacom-cf-stack
   ```

2. Build your site locally with Vite

   ```bash
   vite build
   ```

3. Run custom upload script (after build output is ready)
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