import * as DateRangesActions from '../actions/date-ranges.action';
import { ActionStatus, State } from '../../enums/action-status.enum';
import { DateRange } from '../../models/date-range.model';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';

export interface DateRangesState extends State {
  status: ActionStatus;
  FYTM: DateRange;
  CYTM: DateRange;
  CCQTD: DateRange;
  FCQTD: DateRange;
  CQTD: DateRange;
  CYTDBDL: DateRange;
  FYTDBDL: DateRange;
  FQTD: DateRange;
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
  displayCodeQuarterDate: '',
  range: '',
  description: ''
};

export const initialState: DateRangesState = {
  status: ActionStatus.NotFetched,
  FYTM: initialDateRangeState,
  CYTM: initialDateRangeState,
  CCQTD: initialDateRangeState,
  FCQTD: initialDateRangeState,
  CYTDBDL: initialDateRangeState,
  FYTDBDL: initialDateRangeState,
  CQTD: initialDateRangeState,
  L60BDL: initialDateRangeState,
  L90BDL: initialDateRangeState,
  L120BDL: initialDateRangeState,
  LCM: initialDateRangeState,
  L3CM: initialDateRangeState,
  CMIPBDL: initialDateRangeState,
  FQTD: initialDateRangeState
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
        FYTM: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.FYTM),
        CYTM: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.CYTM),
        CCQTD: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.CCQTD),
        FCQTD: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.FCQTD),
        CYTDBDL: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.CYTDBDL),
        FYTDBDL: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.FYTDBDL),
        CQTD: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.CQTD),
        L60BDL: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.L60BDL),
        L90BDL: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.L90BDL),
        L120BDL: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.L120BDL),
        LCM: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.LCM),
        L3CM: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.L3CM),
        CMIPBDL: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.CMIPBDL),
        FQTD: action.payload.find(dateRange => dateRange.code === DateRangeTimePeriodValue.FQTD)
      };

    case DateRangesActions.FETCH_DATE_RANGES_FAILURE_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    default:
      return state;
  }
}
