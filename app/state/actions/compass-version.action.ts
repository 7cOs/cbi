import { Action } from '@ngrx/store';
import { AppVersion } from '../../models/app-version.model';

export const FETCH_VERSION_ACTION = '[App Version] FETCH_VERSION_ACTION';
export class FetchVersionAction implements Action {
  readonly type = FETCH_VERSION_ACTION;
}

export const FETCH_VERSION_SUCCESS_ACTION = '[App Version] FETCH_VERSION_SUCCESS_ACTION';
export class FetchVersionSuccessAction implements Action {
  readonly type = FETCH_VERSION_SUCCESS_ACTION;

  constructor(public payload: AppVersion) { }
}

export const FETCH_VERSION_FAILURE_ACTION = '[App Version] FETCH_VERSION_FAILURE_ACTION';
export class FetchVersionFailureAction implements Action {
  readonly type = FETCH_VERSION_FAILURE_ACTION;

  constructor(public payload: Error) { }
}

export type Action =
  FetchVersionAction
  | FetchVersionSuccessAction
  | FetchVersionFailureAction;
