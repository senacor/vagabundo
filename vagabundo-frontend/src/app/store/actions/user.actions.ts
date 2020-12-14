import { Action } from '@ngrx/store';
import { isDevMode } from '@angular/core';

export enum UserActionTypes {
  LoggedIn = '[User] Logged In',
  LoggedOut = '[User] Logged Out'
}

export class LoggedIn implements Action {
  readonly type = UserActionTypes.LoggedIn;

  constructor() {
    if (isDevMode) {
      console.log(UserActionTypes.LoggedIn);
    }
  }
}

export class LoggedOut implements Action {
  readonly type = UserActionTypes.LoggedOut;

  constructor() {
    if (isDevMode) {
      console.log(UserActionTypes.LoggedOut);
    }
  }
}

// Union type of all action classes
export type UserActions =
  | LoggedIn
  | LoggedOut;

