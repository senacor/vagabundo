import { TeamStats } from '@api/models/team-stats';
import { TeamStatActions, TeamStatActionTypes } from '@store/actions/team-stat.actions';

export interface State {
  teamStats: TeamStats[];
  loading: boolean;
}

export const initialState: State = {
  teamStats: [],
  loading: false
};

export function reducer(state = initialState, action: TeamStatActions): State {
  switch (action.type) {
    // Loading actions
    case TeamStatActionTypes.GetTeamStats: {
      return {
        ...state,
        loading: true
      };
    }

    // Success actions
    case TeamStatActionTypes.GetTeamStatsSuccess: {
      const teamStats = action.payload;
      return {
        ...state,
        loading: false,
        teamStats: teamStats
      };
    }

    default:
      return state;
  }
}
