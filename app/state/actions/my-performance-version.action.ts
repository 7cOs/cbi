import { Action } from '@ngrx/store';

import { EntityType } from '../../enums/entity-responsibilities.enum';
import { MyPerformanceEntitiesData } from '../reducers/my-performance.reducer';
import { SkuPackageType  } from '../../enums/sku-package-type.enum';

export interface SkuPackagePayload {
  skuPackageCode: string;
  skuPackageType: SkuPackageType ;
}

export const SAVE_MY_PERFORMANCE_STATE = '[My Performance] SAVE_MY_PERFORMANCE_STATE';
export class SaveMyPerformanceState implements Action {
  readonly type = SAVE_MY_PERFORMANCE_STATE;

  constructor(public payload: MyPerformanceEntitiesData) { }
}

export const RESTORE_MY_PERFORMANCE_STATE = '[My Performance] RESTORE_MY_PERFORMANCE_STATE';
export class RestoreMyPerformanceState implements Action {
  readonly type = RESTORE_MY_PERFORMANCE_STATE;

  constructor(public payload: number = 1) { }
}

export const CLEAR_MY_PERFORMANCE_STATE = '[My Performance] CLEAR_MY_PERFORMANCE_STATE';
export class ClearMyPerformanceState implements Action {
  readonly type = CLEAR_MY_PERFORMANCE_STATE;
}

export const SET_MY_PERFORMANCE_SELECTED_ENTITY = '[My Performance] SET_MY_PERFORMANCE_SELECTED_ENTITY';
export class SetMyPerformanceSelectedEntity implements Action {
  readonly type = SET_MY_PERFORMANCE_SELECTED_ENTITY;

  constructor(public payload: string) { }
}

export const SET_MY_PERFORMANCE_SELECTED_ENTITY_TYPE = '[My Performance] SET_MY_PERFORMANCE_SELECTED_ENTITY_TYPE';
export class SetMyPerformanceSelectedEntityType implements Action {
  readonly type = SET_MY_PERFORMANCE_SELECTED_ENTITY_TYPE;

  constructor(public payload: EntityType) { }
}

export const SET_MY_PERFORMANCE_SELECTED_BRAND = '[My Performance] SET_MY_PERFORMANCE_SELECTED_BRAND';
export class SetMyPerformanceSelectedBrandCode implements Action {
  readonly type = SET_MY_PERFORMANCE_SELECTED_BRAND;

  constructor(public payload: string) { }
}

export const SET_MY_PERFORMANCE_SELECTED_SKU = '[My Performance] SET_MY_PERFORMANCE_SELECTED_SKU';
export class SetMyPerformanceSelectedSkuCode implements Action {
  readonly type = SET_MY_PERFORMANCE_SELECTED_SKU;

  constructor(public payload: SkuPackagePayload) { }
}

export const CLEAR_MY_PERFORMANCE_SELECTED_SKU = '[My Performance] CLEAR_MY_PERFORMANCE_SELECTED_SKU';
export class ClearMyPerformanceSelectedSkuCode implements Action {
  readonly type = CLEAR_MY_PERFORMANCE_SELECTED_SKU;
}

export const CLEAR_MY_PERFORMANCE_SELECTED_BRAND = '[My Performance] CLEAR_MY_PERFORMANCE_SELECTED_BRAND';
export class ClearMyPerformanceSelectedBrandCode implements Action {
  readonly type = CLEAR_MY_PERFORMANCE_SELECTED_BRAND;
}

export type Action =
  SaveMyPerformanceState
  | RestoreMyPerformanceState
  | ClearMyPerformanceState
  | SetMyPerformanceSelectedEntity
  | SetMyPerformanceSelectedEntityType
  | ClearMyPerformanceSelectedSkuCode
  | SetMyPerformanceSelectedBrandCode
  | SetMyPerformanceSelectedSkuCode
  | ClearMyPerformanceSelectedBrandCode;
