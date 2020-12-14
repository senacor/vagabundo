import {
  COGNITO_CLIENT_ID_STAGING,
  COGNITO_REDIRECT_LOGIN_URI_STAGING,
  COGNITO_REDIRECT_LOGOUT_URI_STAGING
} from '../variables';

export const environment = {
  production: true,
  API_BASE_PATH: 'BASE_PATH/Staging',
  API_BASE_URL: 'https://BASE_PATH/Staging',
  LOGIN_URL: 'https://BASE_PATH/oauth2/authorize' +
    '?redirect_uri=' + COGNITO_REDIRECT_LOGIN_URI_STAGING + '&response_type=token&client_id=' + COGNITO_CLIENT_ID_STAGING,
  LOGOUT_URL: 'https://BASE_PATH/logout?client_id=' + COGNITO_CLIENT_ID_STAGING +
    '&logout_uri=' + COGNITO_REDIRECT_LOGOUT_URI_STAGING,
  iss: 'https://IDP_URL'
};
