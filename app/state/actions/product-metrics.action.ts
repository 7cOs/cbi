import { Action } from '@ngrx/store';

import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { ProductMetrics } from '../../models/product-metrics.model';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import { EntityType } from '../../enums/entity-responsibilities.enum';

export interface FetchProductMetricsPayload {
  positionId: string;
  contextPositionId?: string;
  entityTypeCode?: string;
  filter: MyPerformanceFilterState;
  selectedEntityType: EntityType;
  selectedBrandCode?: string;
}

export interface FetchProductMetricsSuccessPayload {
  positionId: string;
  products: ProductMetrics;
}

export const FETCH_PRODUCT_METRICS = '[ProductMetrics] FETCH_PRODUCT_METRICS';
export class FetchProductMetrics implements Action {
  readonly type = FETCH_PRODUCT_METRICS;

  constructor(public payload: FetchProductMetricsPayload) { }
}

export const FETCH_PRODUCT_METRICS_SUCCESS = '[ProductMetrics] FETCH_PRODUCT_METRICS_SUCCESS';
export class FetchProductMetricsSuccess implements Action {
  readonly type = FETCH_PRODUCT_METRICS_SUCCESS;

  constructor(public payload: FetchProductMetricsSuccessPayload) { }
}

export const FETCH_PRODUCT_METRICS_FAILURE = '[ProductMetrics] FETCH_PRODUCT_METRICS_FAILURE';
export class FetchProductMetricsFailure implements Action {
  readonly type = FETCH_PRODUCT_METRICS_FAILURE;

  constructor(public payload: Error) { }
}

export const SELECT_BRAND_VALUES = '[ProductMetrics] SELECT_BRAND_VALUES';
export class SelectBrandValues implements Action {
  readonly type = SELECT_BRAND_VALUES;

  constructor(public payload: string) { }
}

export const SET_PRODUCT_METRICS_VIEW_TYPE = '[View Types] SET_PRODUCT_METRICS_VIEW_TYPE';
export class SetProductMetricsViewType implements Action {
  readonly type = SET_PRODUCT_METRICS_VIEW_TYPE;

  constructor(public payload: ProductMetricsViewType) { }
}

export type Action =
  FetchProductMetrics
  | FetchProductMetricsSuccess
  | FetchProductMetricsFailure
  | SelectBrandValues
  | SetProductMetricsViewType;
