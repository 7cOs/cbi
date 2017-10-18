import { Action } from '@ngrx/store';

import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { ProductMetrics } from '../../models/product-metrics.model';
import { EntityType } from '../../enums/entity-responsibilities.enum';

export interface FetchProductMetricsPayload {
  positionId: string;
  contextPositionId?: string;
  entityTypeCode?: string;
  filter: MyPerformanceFilterState;
  selectedEntityType: EntityType;
  selectedBrand?: string;
}

export interface FetchProductMetricsSuccessPayload {
  positionId: string;
  products: ProductMetrics;
}

export const FETCH_PRODUCT_METRICS_ACTION = '[ProductMetrics] FETCH_PRODUCT_METRICS_ACTION';
export class FetchProductMetricsAction implements Action {
  readonly type = FETCH_PRODUCT_METRICS_ACTION;

  constructor(public payload: FetchProductMetricsPayload) { }
}

export const FETCH_PRODUCT_METRICS_SUCCESS_ACTION = '[ProductMetrics] FETCH_PRODUCT_METRICS_SUCCESS_ACTION';
export class FetchProductMetricsSuccessAction implements Action {
  readonly type = FETCH_PRODUCT_METRICS_SUCCESS_ACTION;

  constructor(public payload: FetchProductMetricsSuccessPayload) { }
}

export const FETCH_PRODUCT_METRICS_FAILURE_ACTION = '[ProductMetrics] FETCH_PRODUCT_METRICS_FAILURE_ACTION';
export class FetchProductMetricsFailureAction implements Action {
  readonly type = FETCH_PRODUCT_METRICS_FAILURE_ACTION;

  constructor(public payload: Error) { }
}

export type Action =
  FetchProductMetricsAction
  | FetchProductMetricsSuccessAction
  | FetchProductMetricsFailureAction;
