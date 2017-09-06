import { Action } from '@ngrx/store';

export const CLEAR_MY_PERFORMANCE_STATE_ACTION = '[My Performance] CLEAR_MY_PERFORMANCE_STATE_ACTION';
export class ClearMyPerformanceStateAction implements Action {
  readonly type = CLEAR_MY_PERFORMANCE_STATE_ACTION;
}

export const SET_MY_PERFORMANCE_SELECTED_ENTITY_ACTION = '[My Performance] SET_MY_PERFORMANCE_SELECTED_ENTITY_ACTION';
export class SetMyPerformanceSelectedEntityAction implements Action {
  readonly type = SET_MY_PERFORMANCE_SELECTED_ENTITY_ACTION;

  constructor(public payload: string) { }
}

export type Action =
  ClearMyPerformanceStateAction
  | SetMyPerformanceSelectedEntityAction;
