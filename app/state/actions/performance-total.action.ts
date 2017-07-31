import { Action } from '@ngrx/store';

import { PerformanceTotal } from '../../models/performance-total.model';

export const FETCH_PERFORMANCE_TOTAL_ACTION = '[Performance Total] FETCH_PERFORMANCE_TOTAL_ACTION';
export class FetchPerformanceTotalAction implements Action {
  readonly type = FETCH_PERFORMANCE_TOTAL_ACTION;

  constructor(public payload: number) { }
}

export const FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION = '[Performance Total] FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION';
export class FetchPerformanceTotalSuccessAction implements Action {
  readonly type = FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION;

  constructor(public payload: PerformanceTotal) { }
}

export const FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION = '[Performance Total] FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION';
export class FetchPerformanceTotalFailureAction implements Action {
  readonly type = FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION;

  constructor(public payload: Error) { }
}

export type Action
  = FetchPerformanceTotalAction
  | FetchPerformanceTotalSuccessAction
  | FetchPerformanceTotalFailureAction;
