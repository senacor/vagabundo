Setup for the cloudfront auth check:

AWS-Region:
 only supported in `us-east-1`
 
AWS-Role:
* needs permissions for lambda-edge-executor:
  * Berechtigungsrichtlinie
    ```
    {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                ],
                "Resource": [
                    "arn:aws:logs:*:*:*"
                ]
            }
        ]
    }
    ```
  * Trustsettings
    ```
      {
        "Version": "2012-10-17",
        "Statement": [
          {
            "Effect": "Allow",
            "Principal": {
              "Federated": [
                "cognito-identity.amazonaws.com",
                "cognito-sync.amazonaws.com"
              ],
              "Service": [
                "edgelambda.amazonaws.com",
                "lambda.amazonaws.com"
              ]
            },
            "Action": "sts:AssumeRole"
          }
        ]
      }
    ```

  
