import { Traveller } from '@api/models';
import { TravellerActions, TravellerActionTypes } from '@store/actions/traveller.actions';

export interface State {
  traveller: Traveller;
  loading: boolean;
}

export const initialState: State = {
  traveller: null,
  loading: false
};

export function reducer(state = initialState, action: TravellerActions): State {
  switch (action.type) {

    // Loading actions
    case TravellerActionTypes.GetTraveller: {
      return {
        ...state,
        loading: true
      };
    }

    // Success actions
    case TravellerActionTypes.GetTravellerSuccess: {
      const traveller = action.payload;
      return {
        ...state,
        traveller: traveller,
        loading: false
      };
    }

    default:
      return state;
  }
}
