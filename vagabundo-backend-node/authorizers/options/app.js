/**
 * Handles CORS preflight request when running the application locally using `sam local start-api`.
 * This can't be handled differently at the moment, see https://github.com/awslabs/aws-sam-cli/issues/400
 * for details.
 * 
 * @param {*} event event
 * @param {*} context context
 */
exports.lambdaHandler = async (event, context) => {
  return {
    statusCode: 200,
    headers: { 
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*"
    }
  }
};
