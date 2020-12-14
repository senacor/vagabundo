import { Action } from '@ngrx/store';
import { isDevMode } from '@angular/core';
import { Traveller } from '@api/models';

export enum TravellerActionTypes {
  GetTraveller = '[Traveller] Get traveller',
  GetTravellerSuccess = '[Traveller] Get traveller success'
}

// GetTraveller
export class GetTraveller implements Action {
  readonly type = TravellerActionTypes.GetTraveller;

  constructor(public payload: string) {
    if (isDevMode) {
      console.log(TravellerActionTypes.GetTraveller, payload);
    }
  }
}
export class GetTravellerSuccess implements Action {
  readonly type = TravellerActionTypes.GetTravellerSuccess;

  constructor(public payload: Traveller) {
    if (isDevMode) {
      console.log(TravellerActionTypes.GetTravellerSuccess, payload);
    }
  }
}

export type TravellerActions =
  | GetTraveller
  | GetTravellerSuccess;
