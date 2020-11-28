import { Trip } from '@api/models';
import { TripActions, TripActionTypes } from '@store/actions/trip.actions';

export interface State {
  trips: Trip[];
  loading: boolean;
}

export const initialState: State = {
  trips: [],
  loading: false
};

export function reducer(state = initialState, action: TripActions): State {
  switch (action.type) {

    // Loading actions
    case TripActionTypes.GetTrips:
    case TripActionTypes.GetTripsByTraveller:
    case TripActionTypes.GetTripsByTeam:
    case TripActionTypes.GetTripById: {
      return {
        ...state,
        loading: true
      };
    }

    // Success actions
    case TripActionTypes.GetTripsSuccess:
    case TripActionTypes.GetTripsByTravellerSuccess:
    case TripActionTypes.GetTripsByTeamSuccess: {
      const trips = action.payload;
      return {
        ...state,
        loading: false,
        trips: trips
      };
    }

    case TripActionTypes.GetTripByIdSuccess: {
      const trip = action.payload;
      return {
        ...state,
        loading: false,
        trips: [trip]
      };
    }

    default:
      return state;
  }
}
