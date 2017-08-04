import { Action } from '@ngrx/store';

import { RoleGroups, RoleGroupPerformanceTotal } from '../../models/role-groups.model';

export const FETCH_RESPONSIBILITIES_ACTION = '[Responsibilities] FETCH_RESPONSIBILITIES_ACTION';
export class FetchResponsibilitiesAction implements Action {
  readonly type = FETCH_RESPONSIBILITIES_ACTION;

  constructor(public payload: number) { }
}

export const FETCH_RESPONSIBILITIES_SUCCESS_ACTION = '[Responsibilities] FETCH_RESPONSIBILITIES_SUCCESS_ACTION';
export class FetchResponsibilitiesSuccessAction implements Action {
  readonly type = FETCH_RESPONSIBILITIES_SUCCESS_ACTION;

  constructor(public payload: { positionId: number, responsibilities: RoleGroups }) { }
}

export const FETCH_RESPONSIBILITIES_FAILURE_ACTION = '[Responsibilities] FETCH_RESPONSIBILITIES_FAILURE_ACTION';
export class FetchResponsibilitiesFailureAction implements Action {
  readonly type = FETCH_RESPONSIBILITIES_FAILURE_ACTION;

  constructor(public payload: Error) { }
}

export const FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS = '[Responsibilities] FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS';
export class FetchResponsibilitiesPerformanceTotals implements Action {
  readonly type = FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS;

  constructor(public payload: { positionId: number, responsibilities: RoleGroups }) { }
}

export const FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS_SUCCESS = '[Responsibilities] FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS_SUCCESS';
export class FetchResponsibilitiesPerformanceTotalsSuccess implements Action {
  readonly type = FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS_SUCCESS;

  constructor(public payload: Array<RoleGroupPerformanceTotal>) { }
}

export const FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS_ERROR = '[Responsibilities] FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS_ERROR';
export class FetchResponsibilitiesPerformanceTotalsError implements Action {
  readonly type = FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS_ERROR;

  constructor(public payload: Error) { }
}

export type Action =
  FetchResponsibilitiesAction
  | FetchResponsibilitiesSuccessAction
  | FetchResponsibilitiesFailureAction
  | FetchResponsibilitiesPerformanceTotals
  | FetchResponsibilitiesPerformanceTotalsSuccess
  | FetchResponsibilitiesPerformanceTotalsError;
