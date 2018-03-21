import { Action } from '@ngrx/store';

import { EntityType } from '../../enums/entity-responsibilities.enum';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { OpportunitiesGroupedByBrandSkuPackageCode } from '../../models/opportunity-count.model';
import { ProductMetrics } from '../../models/product-metrics.model';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';

export interface FetchStoreDeatilsPayload {
  positionId: string;
  contextPositionId?: string;
  entityTypeCode?: string;
  filter: MyPerformanceFilterState;
  selectedEntityType: EntityType;
  selectedBrandCode?: string;
  isMemberOfExceptionHierarchy?: boolean;
  inAlternateHierarchy?: boolean;
}

export interface FetchProductMetricsSuccessPayload {
  positionId: string;
  products: ProductMetrics;
}

export const FETCH_STORE_DETAILS = '[StoreDetails] FETCH_STORE_DETAILS';
export class FetchStoreDetails implements Action {
  readonly type = FETCH_STORE_DETAILS;

  constructor(public payload: FetchStoreDeatilsPayload) { }
}

export const FETCH_STORE_DETAILS_SUCCESS = '[StoreDetails] FETCH_STORE_DETAILS_SUCCESS';
export class FetchStoreDetailsSuccess implements Action {
  readonly type = FETCH_STORE_DETAILS_SUCCESS;

  constructor(public payload: FetchProductMetricsSuccessPayload) { }
}

export const FETCH_STORE_DETAILS_FAILURE = '[StoreDetails] FETCH_STORE_DETAILS_FAILURE';
export class FetchStoreDetailsFailure implements Action {
  readonly type = FETCH_STORE_DETAILS_FAILURE;

  constructor(public payload: Error) { }
}

export const FETCH_HEADER_DETAILS = '[StoreDetails] FETCH_HEADER_DETAILS';
export class FetchHeaderDetails implements Action {
  readonly type = FETCH_HEADER_DETAILS;

  constructor(public payload: FetchHeaderDetailsPayload) { }
}

export const FETCH_HEADER_DETAILS_SUCCESS = '[StoreDetails] FETCH_HEADER_DETAILS_SUCCESS';
export class FetchHeaderDetailsSuccess implements Action {
  readonly type = FETCH_HEADER_DETAILS_SUCCESS;

  constructor(public payload: FetchHeaderDetailsSuccessPayload) { }
}

export const FETCH_HEADER_DETAILS_FAILURE = '[StoreDetails] FETCH_STORE_DETAILS_FAILURE';
export class FetchHeaderDetailsFailure implements Action {
  readonly type = FETCH_STORE_DETAILS_FAILURE;

  constructor(public payload: Error) { }
}

export type Action =
  FetchStoreDetails
  | FetchStoreDetailsSuccess
  | FetchStoreDetailsFailure
  | FetchHeaderDetails
  | FetchHeaderDetailsSuccess
  | FetchHeaderDetailsFailure;
