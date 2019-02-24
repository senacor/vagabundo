var jwt = require('jsonwebtoken');
var request = require('request');
var jwkToPem = require('jwk-to-pem');
var jwksClient = require('jwks-rsa');

var iss = 'https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_jsJkz5UA3';
var jwkUrl = iss + '/.well-known/jwks.json';
var aud = 'd4a0b03d-c602-483b-91d3-829ac7de5175';

exports.handler = function(event, context, callback) {
    validateToken(event, context, callback);
};

function validateToken(event, context, callback) {
    var token = event.authorizationToken;

    var options = {
      issuer: iss,
      audience: aud,
      ignoreExpiration: true
    };
    var client = jwksClient({
      jwksUri: jwkUrl
    });
    function getKey(header, callback){
      client.getSigningKey(header.kid, function(err, key) {
        var signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
      });
    }

    jwt.verify(token, getKey, options, function(err, decoded) {
      console.log(decoded);

      if (err === null || err === undefined) {
        callback(null, generatePolicy('user', 'Allow', event.methodArn));
      } else {
        callback("Unauthorized");   // Return a 401 Unauthorized response
      }
    });
};

// helper function to generate an IAM policy
var generatePolicy = function(principalId, effect, resource) {
    var authResponse = {};
    
    authResponse.principalId = principalId;
    if (effect && resource) {
        var policyDocument = {};
        policyDocument.Version = '2012-10-17'; 
        policyDocument.Statement = [];
        var statementOne = {};
        statementOne.Action = 'execute-api:Invoke'; 
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    
    return authResponse;
}
