import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';

import { ApiService } from '@api/services/api.service';
import { Traveller } from '@api/models';
import { GetTravellerSuccess, TravellerActionTypes } from '@store/actions/traveller.actions';

@Injectable()
export class TravellerEffects {
  constructor(
    private actions$: Actions,
    private service: ApiService) {}

  @Effect()
  getTraveller$: Observable<Action> = this.actions$.pipe(
    ofType(TravellerActionTypes.GetTraveller),
    
    switchMap((action: any) =>
      this.service.getTraveller(action.payload).pipe(
        map((traveller: Traveller) => new GetTravellerSuccess(traveller))
      )
    )
  );
}
