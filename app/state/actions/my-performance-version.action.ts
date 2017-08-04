import { Action } from '@ngrx/store';

import { MyPerformanceData } from '../reducers/my-performance-version.reducer';

export const SAVE_MY_PERFORMANCE_STATE_ACTION = '[My Performance] SAVE_MY_PERFORMANCE_STATE_ACTION';
export class SaveMyPerformanceStateAction implements Action {
  readonly type = SAVE_MY_PERFORMANCE_STATE_ACTION;

  constructor(public payload: MyPerformanceData) { }
}

export const RESTORE_MY_PERFORMANCE_STATE_ACTION = '[My Performance] RESTORE_MY_PERFORMANCE_STATE_ACTION';
export class RestoreMyPerformanceStateAction implements Action {
  readonly type = RESTORE_MY_PERFORMANCE_STATE_ACTION;
}

export type Action =
  SaveMyPerformanceStateAction
  | RestoreMyPerformanceStateAction;
