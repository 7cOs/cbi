import { Action } from '@ngrx/store';

import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { PerformanceTotal } from '../../models/performance-total.model';

export const FETCH_PERFORMANCE_TOTAL_ACTION = '[Performance Total] FETCH_PERFORMANCE_TOTAL_ACTION';
export class FetchPerformanceTotalAction implements Action {
  readonly type = FETCH_PERFORMANCE_TOTAL_ACTION;

  constructor(public payload: { positionId: number, filter: MyPerformanceFilterState }) { }
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

export const SET_TABLE_ROW_PERFORMANCE_TOTAL = '[Performance Total] SET_TABLE_ROW_PERFORMANCE_TOTAL';
export class SetTableRowPerformanceTotal implements Action {
  readonly type = SET_TABLE_ROW_PERFORMANCE_TOTAL;

  constructor(public payload: MyPerformanceTableRow) { }
}

export type Action
  = FetchPerformanceTotalAction
  | FetchPerformanceTotalSuccessAction
  | FetchPerformanceTotalFailureAction
  | SetTableRowPerformanceTotal;
