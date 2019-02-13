var AWS = require('aws-sdk');
var s3 = new AWS.S3({
    signatureVersion: 'v4',
});


exports.handler = (event, context, callback) => {
    const url = s3.getSignedUrl('putObject', {
        Bucket: '**\com.senacor.vagabundo.staging.upload**',
        Key: 'mykey',
        Expires: 10,
    });


    callback(null, url);
};