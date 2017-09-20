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

export interface FetchProductMetricsSuccessPayload {
  positionId: string;
  products: ProductMetrics;
}
