import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { SelectedEntityType } from '../enums/selected-entity-type.enum';

export interface ProductMetricsBrandValue {
  brandDescription: string;
  current: number;
  yearAgo: number;
  collectionMethod: string;
  yearAgoPercent: number;
}

export interface ProductMetrics {
  brand?: ProductMetricsBrandValue[];
}

export interface FetchProductMetricsPayload {
  positionId: string;
  contextPositionId?: string;
  entityTypeCode?: string;
  filter: MyPerformanceFilterState;
  selectedEntityType: SelectedEntityType;
}

export interface FetchProductMetricsSuccessPayload {
  positionId: string;
  products: ProductMetrics;
}
