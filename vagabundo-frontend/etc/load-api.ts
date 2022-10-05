const AWS = require('aws-sdk');
const mkdirp = require('mkdirp');

AWS.config.loadFromPath('etc/aws-build.json');
const apiVersion = process.env.npm_package_config_api;

const s3 = new AWS.S3();
const awsBucket = 'vagabundo.staging.frontend';

mkdirp.sync('api/contracts/');
let apiFile = require('fs')
  .createWriteStream('api/contracts/api.yaml');

console.log('Fetching API Contract version', apiVersion);

s3.getObject({
  Bucket: awsBucket,
  Key: `vagabundo-api/${apiVersion}/api.yaml`
}).createReadStream().pipe(apiFile);
