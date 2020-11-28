import { Stats } from '@api/models';
import { StatActions, StatActionTypes } from '@store/actions/stat.actions';

export interface State {
  companyStats: Stats;
  teamStats: Stats;
  travellerStats: Stats;
  loading: boolean;
}

export const initialState: State = {
  companyStats: null,
  teamStats: null,
  travellerStats: null,
  loading: false
};

export function reducer(state = initialState, action: StatActions): State {
  switch (action.type) {
    case StatActionTypes.GetStats: {
      return {
        ...state,
        loading: true
      };
    }

    case StatActionTypes.GetStatsByTeam: {
      return {
        ...state,
        loading: true
      };
    }

    case StatActionTypes.GetStatsByTraveller: {
     return {
       ...state,
       loading: true
     };
    }

    case StatActionTypes.GetStatsSuccess: {
      const stats = action.payload;
      return {
        ...state,
        companyStats: stats,
        loading: false
      };
    }

    case StatActionTypes.GetStatsByTeamSuccess: {
      const stats = action.payload;
      return {
        ...state,
        teamStats: stats,
        loading: false
      };
    }

    case StatActionTypes.GetStatsByTravellerSuccess: {
      const stats = action.payload;
      return {
        ...state,
        travellerStats: stats,
        loading: false,
      };
    }

    default:
      return state;
  }
}
