import { Action } from '@ngrx/store';

import { EntityType } from '../../enums/entity-responsibilities.enum';
import { GroupedOpportunityCounts } from '../../models/opportunity-count.model';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { ProductMetrics } from '../../models/product-metrics.model';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';

export interface FetchProductMetricsPayload {
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

export interface FetchOpportunityCountsPayload {
  positionId: string;
  accountId: string;
  selectedEntityType: EntityType;
  productMetricsViewType: ProductMetricsViewType;
  filter: MyPerformanceFilterState;
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

export const FETCH_OPPORTUNITY_COUNTS = '[ProductMetrics] FETCH_OPPORTUNITY_COUNTS';
export class FetchOpportunityCounts implements Action {
  readonly type = FETCH_OPPORTUNITY_COUNTS;

  constructor(public payload: FetchOpportunityCountsPayload) { }
}

export const FETCH_OPPORTUNITY_COUNTS_SUCCESS = '[ProductMetrics] FETCH_OPPORTUNITY_COUNTS_SUCCESS';
export class FetchOpportunityCountsSuccess implements Action {
  readonly type = FETCH_OPPORTUNITY_COUNTS_SUCCESS;

  constructor(public payload: GroupedOpportunityCounts) { }
}

export const FETCH_OPPORTUNITY_COUNTS_FAILURE = '[ProductMetrics] FETCH_OPPORTUNITY_COUNTS_FAILURE';
export class FetchOpportunityCountsFailure implements Action {
  readonly type = FETCH_OPPORTUNITY_COUNTS_FAILURE;

  constructor(public payload: Error) { }
}

export const SELECT_BRAND_VALUES = '[ProductMetrics] SELECT_BRAND_VALUES';
export class SelectBrandValues implements Action {
  readonly type = SELECT_BRAND_VALUES;

  constructor(public payload: string) { }
}

export const DESELECT_BRAND_VALUES = '[ProductMetrics] DESELECT_BRAND_VALUES';
export class DeselectBrandValues implements Action {
  readonly type = DESELECT_BRAND_VALUES;
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
  | FetchOpportunityCounts
  | FetchOpportunityCountsSuccess
  | FetchOpportunityCountsFailure
  | SelectBrandValues
  | DeselectBrandValues
  | SetProductMetricsViewType;
