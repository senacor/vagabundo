import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State as TravellerState } from '@store/reducers/traveller.reducer';

export const getTravellerState = createFeatureSelector<TravellerState>('traveller');

export const getTravellerLoading = createSelector(
  getTravellerState,
  state => state.loading
);

export const getTraveller = createSelector(
  getTravellerState,
  state => state.traveller
);
