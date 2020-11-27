# Vagabundo backend

This is the backend for our vagabundo application webpage. It is build using [AWS SAM](https://aws.amazon.com/serverless/sam/). SAM is a framework to easily build serverless applications. It provides capabilities to run functions locally in itself and behind a web server. It helps during deployment and creates AWS CloudFormation templates.

## Prerequisites

You will need the following to run the project:

 - npm
 - Docker
 - AWS CLI
 - AWS SAM

How to install these for your system is explained at https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html

## Install Node packages

As each folder is a separate node module we have to install the node dependencies for all of them. THis is done the easiest with `recusirve-install`. Install it globally with:

    npm i -g recursive-install

and then run

    npm-recursive-install

in the root folder of the project.

## Structure

The main descriptive file for configuration is `template.yaml`. This file describes how a Lambda function is served and sets up API Gateway to connect to a lambda.

Within the code each folder is a function (lambda). Each folder is a complete npm module with their own `node_modules` and `package.json`. Within each fun ction the file `app.js` contains the lambda function.

## Testing a function

A function can be run locally by using `sam local invoke`. So for example

    sam local invoke -e travellers/event.json TravellersGetFunction

runs the TravellersGetFunctions and uses the `event.json` file to pass in to the lambda. This event is otherwise passed in for a Lambda by the AWS stack.

The function can also be unit tested. This is done using standard npm tooling. So switch to the folder and simply run

    npm run test

Under `travellers/test/unit/test-handler.js` is an example how we can mock the `serverless-mysql` database connection we rely on most of the time.

The function can also be run locally behind a web server using

    sam local start-api -p 10010

This starts the web server at port 10010. Default is 3000, but our project uses 10010.

## Packaging and deployment

The following will package all functions and produce a yaml file intended to be deployed to AWS. As we deploy the functions to an S3 bucket we need different Lambda URIs to call. This translates the URIs automatically.

    am package --output-template-file packaged.yaml --s3-bucket vagabundo.artefacts --s3-prefix vagabundo-backend/<VERSION_NUMBER>

This will upload the packaged artefacts to an S3 bucket.

## Deployment to Staging and Production

After packing we can deploy the packages. For staging this can be done with

    sam deploy --template-file packaged.yaml --stack-name vagabundo-backend-staging --capabilities CAPABILITY_IAM --region eu-central-1

This will create a CloudFormation application stack and seperate lambda functions for all functions we wrote. It will also wire the functions together with an API Gateway and to the AWS RDS Aurora instance we use.

For production we need to override the database connection paramaters to link to the production database. Hence, the deploy will be done like this:

    sam deploy --template-file packaged.yaml --parameter-override DBHostURL=<your-database-url>,DBUser=<your-database-user>,DBPassword=<your-database-password> --stack-name vagabundo-backend-production --capabilities CAPABILITY_IAM --region eu-central-1