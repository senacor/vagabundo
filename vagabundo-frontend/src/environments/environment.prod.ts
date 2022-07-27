import {
  COGNITO_CLIENT_ID_PROD,
  COGNITO_REDIRECT_LOGIN_URI_PROD,
  COGNITO_REDIRECT_LOGOUT_URI_PROD
} from '../variables';

export const environment = {
  production: true,
  API_BASE_PATH: 'BASE_PATH/Prod',
  API_BASE_URL: 'https://BASE_PATH/Prod',
  LOGIN_URL: 'https://10.0.0.1.nip.io:8000/oauth2/authorize' +
    '?redirect_uri=' + COGNITO_REDIRECT_LOGIN_URI_PROD + '&response_type=token&client_id=' + COGNITO_CLIENT_ID_PROD,
  LOGOUT_URL: 'https://BASE_PATH/logout?client_id=' + COGNITO_CLIENT_ID_PROD +
    '&logout_uri=' + COGNITO_REDIRECT_LOGOUT_URI_PROD,
  iss: 'https://IDP_URL'
};

