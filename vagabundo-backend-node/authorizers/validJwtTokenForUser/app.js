const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa-promisified');

const iss = 'https://cognito-idp.eu-central-1.amazonaws.com/eu-central-1_jsJkz5UA3';
const jwkUrl = iss + '/.well-known/jwks.json';

const client = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 10,
  jwksUri: jwkUrl
});

exports.lambdaHandler = (event, context, callback) => {    
  console.log('Received event:', JSON.stringify(event, null, 2));

  auth(event)
    .then(result => callback(null, result))
    .catch(err => {
      console.log(err);
      callback(err);
    });
};

/**
 * Authenticates the request based on the authorization JWT token.
 * @param {Object} event 
 */
async function auth(event) {
  if (typeof event.headers.Authorization === 'undefined') {
      throw new Error('Unauthorized');
  }

  const token = event.headers.Authorization;
  const isTokenValid = await validateToken(token, getUsername(event));

  return isTokenValid ? getOutput('Allow', event.methodArn) : new Error('Unauthorized');
}

const getOutput = (effect, resource) => {
  return {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17', // default version
      Statement: [{
          Action: 'execute-api:Invoke', // default action
          Effect: effect,
          Resource: resource,
      }]
    }
  }
}

function getUsername(event) {
  if (typeof event.pathParameters === 'undefined' || typeof event.pathParameters.travellerName === 'undefined') {
      throw new Error('TravellerName is not given');
  }
  return 'AzureADSenacor_' + event.pathParameters.travellerName + '@polaris.senacor.com';
}

/**
 * Returns the signing key.
 * @param {*} kid 
 */
async function getKey(kid) {
  const key = await client.getSigningKeyAsync(kid);
  var signingKey = key.publicKey || key.rsaPublicKey;
  return signingKey;
}

async function validateToken(token, username) {
  var options = {
    issuer: iss,
    // audience: aud,
    ignoreExpiration: true
  };

  const decoded = jwt.decode(token, { complete: true });
  console.log(decoded);
  if (decoded.payload.username !== username) {
    return false;
  }

  try {
    const signingKey = await getKey(decoded.header.kid);
    const payload = jwt.verify(token, signingKey, options);
    console.log("Decoded JWT Token for user " + payload.username);
    return true;
  } catch (err) {
    console.log("JWT Token Authentication error: " + err);
    return false;
  }
}
