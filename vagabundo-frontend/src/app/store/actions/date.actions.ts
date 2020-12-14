import { Action } from '@ngrx/store';
import { isDevMode } from '@angular/core';

import { DateModel } from '@store/models/date';

export enum DateActionTypes {
  SetDates = '[Date] Set dates',
  GetDates = '[Date] Get dates',
  GetDatesSuccess = '[Date] Get dates success',
}

// SetDates
export class SetDates implements Action {
  readonly type = DateActionTypes.SetDates;

  constructor(public payload: DateModel) {
    if (isDevMode) {
      console.log(DateActionTypes.SetDates, payload);
    }
  }
}

// GetDates
export class GetDates implements Action {
  readonly type = DateActionTypes.GetDates;

  constructor() {
    if (isDevMode) {
      console.log(DateActionTypes.GetDates);
    }
  }
}
export class GetDatesSuccess implements Action {
  readonly type = DateActionTypes.GetDatesSuccess;

  constructor(public payload: DateModel) {
    if (isDevMode) {
      console.log(DateActionTypes.GetDatesSuccess, payload);
    }
  }
}

// Union type of all action classes
export type DateActions =
  | SetDates
  | GetDates
  | GetDatesSuccess;
