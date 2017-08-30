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

export type Action =
  SaveMyPerformanceStateAction
  | RestoreMyPerformanceStateAction;
