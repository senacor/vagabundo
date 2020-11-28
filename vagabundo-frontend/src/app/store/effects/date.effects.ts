import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action, Store } from '@ngrx/store';

import { DateActionTypes, GetDatesSuccess } from '@store/actions/date.actions';
import { State } from '@app/store/reducers';
import { getAllDates, getDatesAndTraveller } from '@store/selectors/date.selectors';
import { DateModel } from '@store/models/date';
import { GetStats, GetStatsByTeam, GetStatsByTraveller } from '@store/actions/stat.actions';

@Injectable()
export class DateEffects {
  constructor(private actions$: Actions,
              private store$: Store<State>) {}

  @Effect()
  getDates$: Observable<Action> = this.actions$.pipe(
    ofType(DateActionTypes.GetDates),

    switchMap(() => {
      return this.store$.select(getAllDates).pipe(
        map((dates: DateModel) => new GetDatesSuccess(dates))
      );
    })
  );

  @Effect()
  setDates$: Observable<Action> = this.actions$.pipe(
    ofType(DateActionTypes.SetDates),

    switchMap(() =>
      this.store$.select(getDatesAndTraveller).pipe(
        mergeMap((payload) => [
          new GetStats(payload.dates),
          new GetStatsByTeam({
            team: payload.traveller.team,
            fromDate: payload.dates.fromDate,
            toDate: payload.dates.toDate
          }),
          new GetStatsByTraveller({
            travellerBK: payload.traveller.bk,
            fromDate: payload.dates.fromDate,
            toDate: payload.dates.toDate
          })
        ])
      )
    )
  );
}
