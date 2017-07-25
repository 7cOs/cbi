import { Action } from '@ngrx/store';

export const FETCH_ROLE_GROUPS_ACTION = '[Role Groups] FETCH_ROLE_GROUPS_ACTION';
export class FetchRoleGroupsAction implements Action {
  readonly type = FETCH_ROLE_GROUPS_ACTION;
}

export const FETCH_ROLE_GROUPS_SUCCESS_ACTION = '[Role Groups] FETCH_ROLE_GROUPS_SUCCESS_ACTION';
export class FetchRoleGroupsSuccessAction implements Action {
  readonly type = FETCH_ROLE_GROUPS_SUCCESS_ACTION;

  constructor(public payload: any) { }
}

export const FETCH_ROLE_GROUPS_FAILURE_ACTION = '[Role Groups] FETCH_ROLE_GROUPS_FAILURE_ACTION';
export class FetchRoleGroupsFailureAction implements Action {
  readonly type = FETCH_ROLE_GROUPS_FAILURE_ACTION;

  constructor(public payload: Error) { }
}

export type Action =
  FetchRoleGroupsAction
  | FetchRoleGroupsSuccessAction
  | FetchRoleGroupsFailureAction;
