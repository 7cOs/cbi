import { Action } from '@ngrx/store';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { ListsActionTypes } from '../../enums/list-action-type.enum';
import { ListBeverageType } from '../../enums/list-beverage-type.enum';
import { ListPerformance } from '../../models/lists/list-performance.model';
import { ListPerformanceType } from '../../enums/list-performance-type.enum';
import { ListsSummary } from '../../models/lists/lists-header.model';
import { StoreDetails } from '../../models/lists/lists-store.model';
import { V3List } from '../../models/lists/lists.model';

export interface FetchStoreDetailsPayload {
  listId: string;
}

export interface FetchHeaderDetailsPayload {
  listId: string;
}

export interface FetchListPerformancePayload {
  listId: string;
  performanceType: ListPerformanceType;
  beverageType: ListBeverageType;
  dateRangeCode: DateRangeTimePeriodValue;
}

export interface FetchOppsForListPayload {
  listId: string;
}

export const FETCH_STORE_DETAILS = ListsActionTypes.FETCH_STORE_DETAILS;
export class FetchStoreDetails implements Action {
  readonly type = FETCH_STORE_DETAILS;

  constructor(public payload: FetchStoreDetailsPayload) { }
}

export const FETCH_STORE_DETAILS_SUCCESS = ListsActionTypes.FETCH_STORE_DETAILS_SUCCESS;
export class FetchStoreDetailsSuccess implements Action {
  readonly type = FETCH_STORE_DETAILS_SUCCESS;

  constructor(public payload: Array<StoreDetails>) { }
}

export const FETCH_STORE_DETAILS_FAILURE = ListsActionTypes.FETCH_STORE_DETAILS_FAILURE;
export class FetchStoreDetailsFailure implements Action {
  readonly type = FETCH_STORE_DETAILS_FAILURE;

  constructor(public payload: Error) { }
}

export const FETCH_HEADER_DETAILS = ListsActionTypes.FETCH_HEADER_DETAILS;
export class FetchHeaderDetails implements Action {
  readonly type = FETCH_HEADER_DETAILS;

  constructor(public payload: FetchHeaderDetailsPayload) { }
}

export const FETCH_HEADER_DETAILS_SUCCESS = ListsActionTypes.FETCH_HEADER_DETAILS_SUCCESS;
export class FetchHeaderDetailsSuccess implements Action {
  readonly type = FETCH_HEADER_DETAILS_SUCCESS;

  constructor(public payload: ListsSummary) { }
}

export const FETCH_HEADER_DETAILS_FAILURE = ListsActionTypes.FETCH_HEADER_DETAILS_FAILURE;
export class FetchHeaderDetailsFailure implements Action {
  readonly type = FETCH_HEADER_DETAILS_FAILURE;

  constructor(public payload: Error) { }
}

export class FetchOppsForList implements Action {
  readonly type = ListsActionTypes.FETCH_OPPS_FOR_LIST;

  constructor(public payload: any) { }
}

export class FetchOppsForListSuccess implements Action {
  readonly type = ListsActionTypes.FETCH_OPPS_FOR_LIST_SUCCESS;

  constructor(public payload: any) { }
}

export class FetchOppsForListFailure implements Action {
  readonly type = ListsActionTypes.FETCH_OPPS_FOR_LIST_FAILURE;

  constructor(public payload: Error) { }
}

export class FetchListPerformanceVolume implements Action {
  readonly type = ListsActionTypes.FETCH_LIST_PERFORMANCE_VOLUME;
  constructor(public payload: FetchListPerformancePayload) { }
}

export class FetchListPerformanceVolumeSuccess implements Action {
  readonly type = ListsActionTypes.FETCH_LIST_PERFORMANCE_VOLUME_SUCCESS;
  constructor(public payload: ListPerformance) { }
}

export class FetchListPerformanceVolumeError implements Action {
  readonly type = ListsActionTypes.FETCH_LIST_PERFORMANCE_VOLUME_ERROR;
  constructor(public payload: Error) { }
}

export class FetchListPerformancePOD implements Action {
  readonly type = ListsActionTypes.FETCH_LIST_PERFORMANCE_POD;
  constructor(public payload: FetchListPerformancePayload) { }
}

export class FetchListPerformancePODSuccess implements Action {
  readonly type = ListsActionTypes.FETCH_LIST_PERFORMANCE_POD_SUCCESS;
  constructor(public payload: ListPerformance) { }
}

export class FetchListPerformancePODError implements Action {
  readonly type = ListsActionTypes.FETCH_LIST_PERFORMANCE_POD_ERROR;
  constructor(public payload: Error) { }
}

export const PATCH_LIST = ListsActionTypes.PATCH_LIST;
export class PatchList implements Action {
  readonly type = PATCH_LIST;

  constructor(public payload: ListsSummary) { }
}

export const PATCH_LIST_SUCCESS = ListsActionTypes.PATCH_LIST_SUCCESS;
export class PatchListSuccess implements Action {
  readonly type = PATCH_LIST_SUCCESS;

  constructor(public payload: ListsSummary) { }
}

export const PATCH_LIST_FAILURE = ListsActionTypes.PATCH_LIST_FAILURE;
export class PatchListFailure implements Action {
  readonly type = PATCH_LIST_FAILURE;

  constructor(public payload: Error) { }
}

export type Action
  = FetchStoreDetails
  | FetchStoreDetailsSuccess
  | FetchStoreDetailsFailure
  | FetchHeaderDetails
  | FetchHeaderDetailsSuccess
  | FetchHeaderDetailsFailure
  | FetchOppsForList
  | FetchOppsForListSuccess
  | FetchOppsForListFailure
  | FetchListPerformanceVolume
  | FetchListPerformanceVolumeSuccess
  | FetchListPerformanceVolumeError
  | FetchListPerformancePOD
  | FetchListPerformancePODSuccess
  | FetchListPerformancePODError
  | PatchList
  | PatchListSuccess
  | PatchListFailure;
