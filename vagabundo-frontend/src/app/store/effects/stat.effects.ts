import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { ApiService } from '@api/services/api.service';
import { Stats } from '@api/models';
import {
  GetStatsByTeamSuccess,
  GetStatsByTravellerSuccess,
  GetStatsSuccess,
  StatActionTypes
} from '@store/actions/stat.actions';

@Injectable()
export class StatEffects {
  constructor(
    private actions$: Actions,
    private service: ApiService) {}

  @Effect()
  getStats$: Observable<Action> = this.actions$.pipe(
    ofType(StatActionTypes.GetStats),

    switchMap((action: any) =>
      this.service.getStats(action.payload).pipe(
        map((stats: Stats) => new GetStatsSuccess(stats))
      )
    )
  );

  @Effect()
  getStatsByTraveller$: Observable<Action> = this.actions$.pipe(
    ofType(StatActionTypes.GetStatsByTraveller),
    
    switchMap((action: any) =>
      this.service.getStatsByTraveller(action.payload).pipe(
        map((stats: Stats) => new GetStatsByTravellerSuccess(stats))
      )
    )
  );

  @Effect()
  getStatsByTeam$: Observable<Action> = this.actions$.pipe(
    ofType(StatActionTypes.GetStatsByTeam),

    switchMap((action: any) =>
      this.service.getStatsByTeam(action.payload).pipe(
        map((stats: Stats) => new GetStatsByTeamSuccess(stats))
      )
    )
  );
}
