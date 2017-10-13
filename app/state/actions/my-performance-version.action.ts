import { Action } from '@ngrx/store';

import { MyPerformanceEntitiesData } from '../reducers/my-performance.reducer';

export const SAVE_MY_PERFORMANCE_STATE = '[My Performance] SAVE_MY_PERFORMANCE_STATE';
export class SaveMyPerformanceStateAction implements Action {
  readonly type = SAVE_MY_PERFORMANCE_STATE;

  constructor(public payload: MyPerformanceEntitiesData) { }
}

export const RESTORE_MY_PERFORMANCE_STATE = '[My Performance] RESTORE_MY_PERFORMANCE_STATE';
export class RestoreMyPerformanceStateAction implements Action {
  readonly type = RESTORE_MY_PERFORMANCE_STATE;

  constructor(public payload: number = 1) { }
}

export const CLEAR_MY_PERFORMANCE_STATE = '[My Performance] CLEAR_MY_PERFORMANCE_STATE';
export class ClearMyPerformanceStateAction implements Action {
  readonly type = CLEAR_MY_PERFORMANCE_STATE;
}

export const SET_MY_PERFORMANCE_SELECTED_ENTITY = '[My Performance] SET_MY_PERFORMANCE_SELECTED_ENTITY';
export class SetMyPerformanceSelectedEntityAction implements Action {
  readonly type = SET_MY_PERFORMANCE_SELECTED_ENTITY;

  constructor(public payload: string) { }
}

export const SET_MY_PERFORMANCE_SELECTED_BRAND = '[My Performance]  SET_MY_PERFORMANCE_SELECTED_BRAND';
export class SetMyPerformanceSelectedBrand implements Action {
  readonly type = SET_MY_PERFORMANCE_SELECTED_BRAND;

constructor(public payload: string) { }
}

export type Action =
  SaveMyPerformanceStateAction
  | RestoreMyPerformanceStateAction
  | ClearMyPerformanceStateAction
  | SetMyPerformanceSelectedEntityAction
  | SetMyPerformanceSelectedBrand;
