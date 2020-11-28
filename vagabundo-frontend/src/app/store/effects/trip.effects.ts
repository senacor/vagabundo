import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { ApiService } from '@api/services/api.service';
import { Trip } from '@api/models';
import {
  GetTripByIdSuccess,
  GetTripsByTeamSuccess,
  GetTripsByTravellerSuccess,
  GetTripsSuccess,
  TripActionTypes
} from '@store/actions/trip.actions';

@Injectable()
export class TripEffects {
  constructor(
    private actions$: Actions,
    private service: ApiService) {}

  @Effect()
  getTrips$: Observable<Action> = this.actions$.pipe(
    ofType(TripActionTypes.GetTrips),

    switchMap((action: any) =>
      this.service.getTrips(action.payload).pipe(
        map((trips: Trip[]) => new GetTripsSuccess(trips))
      )
    )
  );

  @Effect()
  getTripsByTraveller$: Observable<Action> = this.actions$.pipe(
    ofType(TripActionTypes.GetTripsByTraveller),

    switchMap((action: any) =>
      this.service.getTripsByTraveller(action.payload).pipe(
        map((trips: Trip[]) => new GetTripsByTravellerSuccess(trips))
      )
    )
  );

  @Effect()
  getTripsByTeam$: Observable<Action> = this.actions$.pipe(
    ofType(TripActionTypes.GetTripsByTeam),

    switchMap((action: any) =>
      this.service.getTripsByTeam(action.payload).pipe(
        map((trips: Trip[]) => new GetTripsByTeamSuccess(trips))
      )
    )
  );

  @Effect()
  getTripById$: Observable<Action> = this.actions$.pipe(
    ofType(TripActionTypes.GetTripById),

    switchMap((action: any) =>
      this.service.getTripById(action.payload).pipe(
        map((trip: Trip) => new GetTripByIdSuccess(trip))
      )
    )
  );
}
