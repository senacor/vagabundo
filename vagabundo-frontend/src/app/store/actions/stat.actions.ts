import { Action } from '@ngrx/store';
import { isDevMode } from '@angular/core';

import { ApiService } from '@api/services/api.service';
import { Stats } from '@api/models';

import GetStatsParams = ApiService.GetStatsParams;
import GetStatsByTravellerParams = ApiService.GetStatsByTravellerParams;
import GetStatsByTeamParams = ApiService.GetStatsByTeamParams;

export enum StatActionTypes {
  GetStats = '[Stat] Get stats',
  GetStatsSuccess = '[Stat] Get stats success',

  GetStatsByTraveller = '[Stat] Get stats by traveller',
  GetStatsByTravellerSuccess = '[Stat] Get stats by traveller success',

  GetStatsByTeam = '[Stat] Get stats by team',
  GetStatsByTeamSuccess = '[Stat] Get stats by team success'
}

// GetStats
export class GetStats implements Action {
  readonly type = StatActionTypes.GetStats;

  constructor(public payload: GetStatsParams) {
    if (isDevMode) {
      console.log(StatActionTypes.GetStats, payload);
    }
  }
}
export class GetStatsSuccess implements Action {
  readonly type = StatActionTypes.GetStatsSuccess;

  constructor(public payload: Stats) {
    if (isDevMode) {
      console.log(StatActionTypes.GetStatsSuccess, payload);
    }
  }
}

// GetStatsByTravellerId
export class GetStatsByTraveller implements Action {
  readonly type = StatActionTypes.GetStatsByTraveller;

  constructor(public payload: GetStatsByTravellerParams) {
    if (isDevMode) {
      console.log(StatActionTypes.GetStatsByTraveller, payload);
    }
  }
}
export class GetStatsByTravellerSuccess implements Action {
  readonly type = StatActionTypes.GetStatsByTravellerSuccess;

  constructor(public payload: Stats) {
    if (isDevMode) {
      console.log(StatActionTypes.GetStatsByTravellerSuccess, payload);
    }
  }
}

// GetStatsByTeam
export class GetStatsByTeam implements Action {
  readonly type = StatActionTypes.GetStatsByTeam;

  constructor(public payload: GetStatsByTeamParams) {
    if (isDevMode) {
      console.log(StatActionTypes.GetStatsByTeam, payload);
    }
  }
}
export class GetStatsByTeamSuccess implements Action {
  readonly type = StatActionTypes.GetStatsByTeamSuccess;

  constructor(public payload: Stats) {
    if (isDevMode) {
      console.log(StatActionTypes.GetStatsByTeamSuccess, payload);
    }
  }
}

export type StatActions =
  | GetStats
  | GetStatsSuccess
  | GetStatsByTraveller
  | GetStatsByTravellerSuccess
  | GetStatsByTeam
  | GetStatsByTeamSuccess;
