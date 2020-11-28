import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State as StatState } from '@store/reducers/stat.reducer';

export const getStatState = createFeatureSelector<StatState>('stat');

export const getStatsLoading = createSelector(
  getStatState,
  state => state.loading
);

export const getCompanyStats = createSelector(
  getStatState,
  state => state.companyStats
);

export const getTeamStats = createSelector(
  getStatState,
  state => state.teamStats
);

export const getTravellerStats = createSelector(
  getStatState,
  state => state.travellerStats
);
