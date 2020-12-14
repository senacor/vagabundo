import { UserActions, UserActionTypes } from '@store/actions/user.actions';

export interface State {
  loggedIn: boolean;
}

export const initialState: State = {
  loggedIn: false
};

export function reducer(state = initialState, action: UserActions): State {
  switch (action.type) {

    case UserActionTypes.LoggedIn: {
      return {
        ...state,
        loggedIn: true
      };
    }
    case UserActionTypes.LoggedOut: {
      return {
        ...state,
        loggedIn: false
      };
    }
    default:
      return state;
  }
}
