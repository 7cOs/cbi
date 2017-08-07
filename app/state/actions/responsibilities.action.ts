import { Action } from '@ngrx/store';

import { FetchResponsibilitiesSuccessPayload, RoleGroupPerformanceTotal } from '../../models/role-groups.model';

export const FETCH_RESPONSIBILITIES_ACTION = '[Responsibilities] FETCH_RESPONSIBILITIES_ACTION';
export class FetchResponsibilitiesAction implements Action {
  readonly type = FETCH_RESPONSIBILITIES_ACTION;

  constructor(public payload: number) { }
}

export const FETCH_RESPONSIBILITIES_SUCCESS_ACTION = '[Responsibilities] FETCH_RESPONSIBILITIES_SUCCESS_ACTION';
export class FetchResponsibilitiesSuccessAction implements Action {
  readonly type = FETCH_RESPONSIBILITIES_SUCCESS_ACTION;

  constructor(public payload: FetchResponsibilitiesSuccessPayload) { }
}

export const FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS_SUCCESS = '[Responsibilities] FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS_SUCCESS';
export class FetchResponsibilitiesPerformanceTotalsSuccess implements Action {
  readonly type = FETCH_RESPONSIBILITIES_PERFORMANCE_TOTALS_SUCCESS;

  constructor(public payload: Array<RoleGroupPerformanceTotal>) { }
}

export const FETCH_RESPONSIBILITIES_FAILURE_ACTION = '[Responsibilities] FETCH_RESPONSIBILITIES_FAILURE_ACTION';
export class FetchResponsibilitiesFailureAction implements Action {
  readonly type = FETCH_RESPONSIBILITIES_FAILURE_ACTION;

  constructor(public payload: Error) { }
}

export type Action =
  FetchResponsibilitiesAction
  | FetchResponsibilitiesSuccessAction
  | FetchResponsibilitiesPerformanceTotalsSuccess
  | FetchResponsibilitiesFailureAction;
