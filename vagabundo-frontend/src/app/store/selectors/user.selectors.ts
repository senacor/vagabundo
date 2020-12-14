import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State as UserState } from '@store/reducers/user.reducer';

export const getUserState = createFeatureSelector<UserState>('user');

export const getUserLoggedIn = createSelector(
  getUserState,
  state => state.loggedIn
);

export const getUserLoggedOut = createSelector(
  getUserState,
  state => !state.loggedIn
);
