import { Action } from '@ngrx/store';
import { DateRange } from '../../models/date-range.model';

export const FETCH_DATE_RANGES_ACTION = '[Date Ranges] FETCH_DATE_RANGES_ACTION';
export class FetchDateRangesAction implements Action {
  readonly type = FETCH_DATE_RANGES_ACTION;
}

export const FETCH_DATE_RANGES_SUCCESS_ACTION = '[Date Ranges] FETCH_DATE_RANGES_SUCCESS_ACTION';
export class FetchDateRangesSuccessAction implements Action {
  readonly type = FETCH_DATE_RANGES_SUCCESS_ACTION;

  constructor(public payload: DateRange[]) { }
}

export const FETCH_DATE_RANGES_FAILURE_ACTION = '[Date Ranges] FETCH_DATE_RANGES_FAILURE_ACTION';
export class FetchDateRangesFailureAction implements Action {
  readonly type = FETCH_DATE_RANGES_FAILURE_ACTION;

  constructor(public payload: Error) { }
}

export type Action =
  FetchDateRangesAction
  | FetchDateRangesSuccessAction
  | FetchDateRangesFailureAction;
