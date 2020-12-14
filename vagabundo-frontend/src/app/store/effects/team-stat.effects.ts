import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { ApiService } from '@api/services/api.service';
import { TeamStats } from '@api/models';
import { GetTeamStatsSuccess, TeamStatActionTypes } from '@store/actions/team-stat.actions';

@Injectable()
export class TeamStatEffects {
  constructor(
    private actions$: Actions,
    private service: ApiService
  ) {}

  @Effect()
  getTeamStats$: Observable<Action> = this.actions$.pipe(
    ofType(TeamStatActionTypes.GetTeamStats),

    switchMap((action: any) =>
      this.service.getTeamStats(action.payload).pipe(
        map((teamStats: TeamStats[]) => new GetTeamStatsSuccess(teamStats))
      )
    )
  );
}
