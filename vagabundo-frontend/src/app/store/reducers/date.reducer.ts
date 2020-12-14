import { DateActions, DateActionTypes } from '@store/actions/date.actions';
import { DateModel } from '@store/models/date';
import { DateService } from '@dateservice/date.service';

export interface State {
  dates: DateModel;
}

const initialState: State = {
  dates: {
    fromDate: DateService.getStartOfLastMonth(),
    toDate: DateService.getEndOfLastMonth(),
  }
};

export function reducer(state = initialState, action: DateActions): State {
  switch (action.type) {

    case DateActionTypes.GetDates: {
      return {
        ...state
      };
    }

    case DateActionTypes.SetDates:
    case DateActionTypes.GetDatesSuccess: {
      const dates = action.payload;
      return {
        ...state,
        dates: dates
      };
    }

    default:
      return state;
  }
}
