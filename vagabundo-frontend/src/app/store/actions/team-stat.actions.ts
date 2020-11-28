import { Action } from '@ngrx/store';
import { isDevMode } from '@angular/core';

import { ApiService } from '@api/services/api.service';
import { TeamStats } from '@api/models/team-stats';

import GetTeamStatsParams = ApiService.GetTeamStatsParams;

export enum TeamStatActionTypes {
  GetTeamStats = '[TeamStat] Get team stats',
  GetTeamStatsSuccess = '[TeamStat] Get team stats success'
}

// GetTeamStats
export class GetTeamStats implements Action {
  readonly type = TeamStatActionTypes.GetTeamStats;
  
  constructor(public payload: GetTeamStatsParams) {
    if (isDevMode) {
      console.log(TeamStatActionTypes.GetTeamStats, payload);
    }
  }
}
export class GetTeamStatsSuccess implements Action {
  readonly type = TeamStatActionTypes.GetTeamStatsSuccess;

  constructor(public payload: TeamStats[]) {
    if (isDevMode) {
      console.log(TeamStatActionTypes.GetTeamStatsSuccess, payload);
    }
  }
}

export type TeamStatActions =
  | GetTeamStats
  | GetTeamStatsSuccess;
