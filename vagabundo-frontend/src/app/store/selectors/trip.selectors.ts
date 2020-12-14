import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State as TripState } from '@store/reducers/trip.reducer';

export const getTripState = createFeatureSelector<TripState>('trip');

export const getTripsLoading = createSelector(
  getTripState,
  state => state.loading
);

export const getTrips = createSelector(
  getTripState,
  state => state.trips
);
