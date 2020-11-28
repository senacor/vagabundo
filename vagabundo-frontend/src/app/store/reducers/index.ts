import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '@environments/environment';

import * as fromDate from './date.reducer';
import * as fromTrip from './trip.reducer';
import * as fromStat from './stat.reducer';
import * as fromTeamStat from './team-stat.reducer';
import * as fromTraveller from './traveller.reducer';
import * as fromUser from './user.reducer';

export interface State {
  date: fromDate.State;
  trip: fromTrip.State;
  stat: fromStat.State;
  teamStat: fromTeamStat.State;
  traveller: fromTraveller.State;
  user:  fromUser.State;
}

export const reducers: ActionReducerMap<State> = {
  date: fromDate.reducer,
  trip: fromTrip.reducer,
  stat: fromStat.reducer,
  teamStat: fromTeamStat.reducer,
  traveller: fromTraveller.reducer,
  user:  fromUser.reducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
