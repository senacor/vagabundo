// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {COGNITO_CLIENT_ID_DEV, COGNITO_REDIRECT_LOGIN_URI_DEV, COGNITO_REDIRECT_LOGOUT_URI_DEV} from '../variables';

export const environment = {
  production: false,
   API_BASE_PATH: 'localhost:10010',
   API_BASE_URL: 'http://localhost:10010',
//  API_BASE_PATH: 'BASE_PATH/Staging',
//  API_BASE_URL: 'https://BASE_PATH/Staging',
  LOGIN_URL: 'https://oauth.mocklab.io/oauth2/authorize' +
    '?redirect_uri=' + COGNITO_REDIRECT_LOGIN_URI_DEV + '&response_type=token&client_id=' + COGNITO_CLIENT_ID_DEV,

  LOGOUT_URL: 'https://BASE_PATH/logout?client_id=' + COGNITO_CLIENT_ID_DEV +
    '&logout_uri=' + COGNITO_REDIRECT_LOGOUT_URI_DEV,

  iss: 'https://IDP_URL'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
//import 'zone.js/dist/zone-error';  // Included with Angular CLI.
