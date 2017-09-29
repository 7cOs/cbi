import { Action } from '@ngrx/store';

import { FetchProductMetricsSuccessPayload, FetchProductMetricsPayload } from '../../models/product-metrics.model';

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
