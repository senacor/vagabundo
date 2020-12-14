import { Action } from '@ngrx/store';
import { isDevMode } from '@angular/core';

import { ApiService } from '@api/services/api.service';
import { Trip } from '@api/models';

import GetTripsParams = ApiService.GetTripsParams;
import GetTripsByTravellerParams = ApiService.GetTripsByTravellerParams;
import GetTripsByTeamParams = ApiService.GetTripsByTeamParams;

export enum TripActionTypes {
  GetTrips = '[Trip] Get trips',
  GetTripsSuccess = '[Trip] Get trips success',

  GetTripsByTraveller = '[Trip] Get trips by traveller',
  GetTripsByTravellerSuccess = '[Trip] Get trips by traveller success',

  GetTripsByTeam = '[Trip] Get trips by team',
  GetTripsByTeamSuccess = '[Trip] Get trips by team success',

  GetTripById = '[Trip] Get trips by id',
  GetTripByIdSuccess = '[Trip] Get trips by id success'
}

// GetTrips
export class GetTrips implements Action {
  readonly type = TripActionTypes.GetTrips;

  constructor(public payload: GetTripsParams) {
    if (isDevMode) {
      console.log(TripActionTypes.GetTrips, payload);
    }
  }
}
export class GetTripsSuccess implements Action {
  readonly type = TripActionTypes.GetTripsSuccess;

  constructor(public payload: Trip[]) {
    if (isDevMode) {
      console.log(TripActionTypes.GetTripsSuccess, payload);
    }
  }
}

// GetTripsByTraveller
export class GetTripsByTraveller implements Action {
  readonly type = TripActionTypes.GetTripsByTraveller;

  constructor(public payload: GetTripsByTravellerParams) {
    if (isDevMode) {
      console.log(TripActionTypes.GetTripsByTraveller, payload);
    }
  }
}
export class GetTripsByTravellerSuccess implements Action {
  readonly type = TripActionTypes.GetTripsByTravellerSuccess;

  constructor(public payload: Trip[]) {
    if (isDevMode) {
      console.log(TripActionTypes.GetTripsByTravellerSuccess, payload);
    }
  }
}

// GetTripsByTeam
export class GetTripsByTeam implements Action {
  readonly type = TripActionTypes.GetTripsByTeam;

  constructor(public payload: GetTripsByTeamParams) {
    if (isDevMode) {
      console.log(TripActionTypes.GetTripsByTeam, payload);
    }
  }
}
export class GetTripsByTeamSuccess implements Action {
  readonly type = TripActionTypes.GetTripsByTeamSuccess;

  constructor(public payload: Trip[]) {
    if (isDevMode) {
      console.log(TripActionTypes.GetTripsByTeamSuccess, payload);
    }
  }
}

// GetTripById
export class GetTripById implements Action {
  readonly type = TripActionTypes.GetTripById;

  constructor(public payload: number) {
    if (isDevMode) {
      console.log(TripActionTypes.GetTripById, payload);
    }
  }
}
export class GetTripByIdSuccess implements Action {
  readonly type = TripActionTypes.GetTripByIdSuccess;

  constructor(public payload: Trip) {
    if (isDevMode) {
      console.log(TripActionTypes.GetTripByIdSuccess, payload);
    }
  }
}

export type TripActions =
  | GetTrips
  | GetTripsSuccess
  | GetTripsByTraveller
  | GetTripsByTravellerSuccess
  | GetTripsByTeam
  | GetTripsByTeamSuccess
  | GetTripById
  | GetTripByIdSuccess;
