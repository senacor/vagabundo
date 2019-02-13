'use strict';
const AWS = require('aws-sdk');

var apiVersion = '2014-06-30';
var targetRegion = 'eu-central-1';
var identityPoolId = 'eu-central-1:ecde0e66-17f1-4206-8b20-30fb4b5acd11'; // [region:GUID]
var identityId = 'eu-central-1:4cf6185c-f929-4fa7-98c6-cfefab3c70d9'; // [region:GUID]
var authRoleArn = 'arn:aws:iam::604370441254:role/Cognito_vagabundo_identitiesAuth_Role'; // [ARN]
var loginRedirectUrl = 'https://vagabundo.auth.eu-central-1.amazoncognito.com/login?response_type=token&client_id=6fofh67mv67uq7ud0ms6jau4h2&redirect_uri=https://d3gvc5fnyopyis.cloudfront.net';

exports.handler = (event, context, callback) => {

    console.log("Event: ", event);
    console.log("Context: ", context);
    
    AWS.config.apiVersions = {
        cognitoidentity: apiVersion,
        // other service API versions
    };
    // Amazon Cognito-Anmeldeinformationenanbieter initialisieren
    AWS.config.region = targetRegion;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: identityPoolId,
    });

    var params = {
        IdentityPoolId: identityPoolId
    };

    var cognitoidentity = new AWS.CognitoIdentity();
    cognitoidentity.getIdentityPoolRoles(params, function(err, data) {
        if (err) {
            console.log(err, err.stack); // an error occurred
        }
        else {
            console.log("Pool found.")
            console.log(data);           // successful response
        }
    });
    
    var params = {
        IdentityId: identityId, /* required */
        CustomRoleArn: authRoleArn,
        Logins: {
            'AzureADTest': 'AZUREAD'
        }
    };
    cognitoidentity.getCredentialsForIdentity(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
    });

    // Continue request processing if authentication passed
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    // Require Basic authentication
    if (typeof headers.authorization == 'undefined' || headers.authorization[0].value == null) {
        const response = {
            body: "Unauthorized",
            status: 301,
            headers: {
                'location': [{
                    key: 'Location',
                    value: loginRedirectUrl
                }]
            }
        };
        callback(null, response);
    }

    callback(null, request);
};
