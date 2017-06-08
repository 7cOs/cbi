import * as DateRangesActions from '../actions/date-ranges.action';
import { ActionStatus, State } from '../../enums/action-status.enum';
import { DateRangeDTO } from '../../models/date-range-dto.model';
import { DateRange } from '../../models/date-range.model';

export interface DateRangesState extends State {
  status: ActionStatus;
  MTD: DateRange;
  FYTM: DateRange;
  CYTM: DateRange;
  CYTD: DateRange;
  FYTD: DateRange;
  L60: DateRange;
  L90: DateRange;
  L120: DateRange;
  LCM: DateRange;
  L3CM: DateRange;
}

const initialDateRangeState: DateRange = {
  code: '',
  displayCode: '',
  dateRange: '',
  description: ''
};

export const initialState: DateRangesState = {
  status: ActionStatus.NotFetched,
  MTD: initialDateRangeState,
  FYTM: initialDateRangeState,
  CYTM: initialDateRangeState,
  CYTD: initialDateRangeState,
  FYTD: initialDateRangeState,
  L60: initialDateRangeState,
  L90: initialDateRangeState,
  L120: initialDateRangeState,
  LCM: initialDateRangeState,
  L3CM: initialDateRangeState
};

export function dateRangesReducer(
  state: DateRangesState = initialState,
  action: DateRangesActions.Action
): DateRangesState {
  switch (action.type) {

    case DateRangesActions.FETCH_DATE_RANGES_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case DateRangesActions.FETCH_DATE_RANGES_SUCCESS_ACTION:
      return {
        status: ActionStatus.Fetched,
        MTD: action.payload.find(dateRange => dateRange.code === 'MTD'),
        FYTM: action.payload.find(dateRange => dateRange.code === 'FYTM'),
        CYTM: action.payload.find(dateRange => dateRange.code === 'CYTM'),
        CYTD: action.payload.find(dateRange => dateRange.code === 'CYTDBDL'),
        FYTD: action.payload.find(dateRange => dateRange.code === 'FYTDBDL'),
        L60: action.payload.find(dateRange => dateRange.code === 'L60BDL'),
        L90: action.payload.find(dateRange => dateRange.code === 'L90BDL'),
        L120: action.payload.find(dateRange => dateRange.code === 'L120BDL'),
        LCM: action.payload.find(dateRange => dateRange.code === 'LCM'),
        L3CM: action.payload.find(dateRange => dateRange.code === 'L3CM')
      };

    case DateRangesActions.FETCH_DATE_RANGES_FAILURE_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    default:
      return state;
  }
}
