import * as DateRangesActions from '../actions/date-ranges.action';
import { ActionStatus, State } from '../../enums/action-status.enum';
import { DateRange } from '../../models/date-range.model';

export interface DateRangesState extends State {
  status: ActionStatus;
  FYTM: DateRange;
  CYTM: DateRange;
  CYTDBDL: DateRange;
  FYTDBDL: DateRange;
  L60BDL: DateRange;
  L90BDL: DateRange;
  L120BDL: DateRange;
  LCM: DateRange;
  L3CM: DateRange;
  CMIPBDL: DateRange;
}

const initialDateRangeState: DateRange = {
  code: '',
  displayCode: '',
  range: '',
  description: ''
};

export const initialState: DateRangesState = {
  status: ActionStatus.NotFetched,
  FYTM: initialDateRangeState,
  CYTM: initialDateRangeState,
  CYTDBDL: initialDateRangeState,
  FYTDBDL: initialDateRangeState,
  L60BDL: initialDateRangeState,
  L90BDL: initialDateRangeState,
  L120BDL: initialDateRangeState,
  LCM: initialDateRangeState,
  L3CM: initialDateRangeState,
  CMIPBDL: initialDateRangeState
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
        FYTM: action.payload.find(dateRange => dateRange.code === 'FYTM'),
        CYTM: action.payload.find(dateRange => dateRange.code === 'CYTM'),
        CYTDBDL: action.payload.find(dateRange => dateRange.code === 'CYTDBDL'),
        FYTDBDL: action.payload.find(dateRange => dateRange.code === 'FYTDBDL'),
        L60BDL: action.payload.find(dateRange => dateRange.code === 'L60BDL'),
        L90BDL: action.payload.find(dateRange => dateRange.code === 'L90BDL'),
        L120BDL: action.payload.find(dateRange => dateRange.code === 'L120BDL'),
        LCM: action.payload.find(dateRange => dateRange.code === 'LCM'),
        L3CM: action.payload.find(dateRange => dateRange.code === 'L3CM'),
        CMIPBDL: action.payload.find(dateRange => dateRange.code === 'CMIPBDL')
      };

    case DateRangesActions.FETCH_DATE_RANGES_FAILURE_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    default:
      return state;
  }
}
