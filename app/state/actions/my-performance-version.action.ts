import { Action } from '@ngrx/store';

import { MyPerformanceData } from '../reducers/my-performance.reducer';

export const SAVE_MY_PERFORMANCE_STATE_ACTION = '[My Performance] SAVE_MY_PERFORMANCE_STATE_ACTION';
export class SaveMyPerformanceStateAction implements Action {
  readonly type = SAVE_MY_PERFORMANCE_STATE_ACTION;

  constructor(public payload: MyPerformanceData) { }
}

export const RESTORE_MY_PERFORMANCE_STATE_ACTION = '[My Performance] RESTORE_MY_PERFORMANCE_STATE_ACTION';
export class RestoreMyPerformanceStateAction implements Action {
  readonly type = RESTORE_MY_PERFORMANCE_STATE_ACTION;

  constructor(public payload: number = 1) { }
}

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
  SaveMyPerformanceStateAction
  | RestoreMyPerformanceStateAction
  | ClearMyPerformanceStateAction
  | SetMyPerformanceSelectedEntityAction;
