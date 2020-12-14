import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State as DateState } from '@store/reducers/date.reducer';
import { State as TravellerState } from '@store/reducers/traveller.reducer';
import { DateModel } from '@store/models/date';
import { Traveller } from '@api/models/traveller';

export const getDateState = createFeatureSelector<DateState>('date');
export const getTravellerState = createFeatureSelector<TravellerState>('traveller');

export const getAllDates = createSelector(
  getDateState,
    state => state.dates
);

export const getTraveller = createSelector(
  getTravellerState,
  state => state.traveller
);

export const getDatesAndTraveller = createSelector(
  getAllDates,
  getTraveller,
  (dates: DateModel, traveller: Traveller) => {
    return {dates, traveller};
  }
);
