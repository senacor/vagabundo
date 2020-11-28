import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State as TeamStatState } from '@store/reducers/team-stat.reducer';

export const getTeamStatState = createFeatureSelector<TeamStatState>('teamStat');

export const getTeamStatsLoading = createSelector(
  getTeamStatState,
  state => state.loading
);

export const getTeamStats = createSelector(
  getTeamStatState,
  state => state.teamStats
);
