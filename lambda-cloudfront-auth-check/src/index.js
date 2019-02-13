'use strict';
const AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    AWS.config.apiVersions = {
        cognitoidentity: '2014-06-30',
        // other service API versions
    };
    // Amazon Cognito-Anmeldeinformationenanbieter initialisieren
    AWS.config.region = 'eu-central-1'; // Region

    console.log("Event: ", event);
    console.log("Context: ", context);

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'eu-central-1:ecde0e66-17f1-4206-8b20-30fb4b5acd11',
    });


    var params = {
        IdentityPoolId: 'eu-central-1:ecde0e66-17f1-4206-8b20-30fb4b5acd11' /* required */
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
        IdentityId: 'eu-central-1:4cf6185c-f929-4fa7-98c6-cfefab3c70d9', /* required */
        CustomRoleArn: 'arn:aws:iam::604370441254:role/Cognito_vagabundo_identitiesAuth_Role',
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
                    value: "https://vagabundo.auth.eu-central-1.amazoncognito.com/login?response_type=token&client_id=6fofh67mv67uq7ud0ms6jau4h2&redirect_uri=https://d3gvc5fnyopyis.cloudfront.net"
                }]
            }
        };
        callback(null, response);
    }

    callback(null, request);
};
