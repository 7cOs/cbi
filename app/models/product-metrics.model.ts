export interface ProductMetricsValues {
  brandDescription: string;
  current: number;
  yearAgo: number;
  collectionMethod: string;
  yearAgoPercent: number;
  brandCode: string;
  beerId?: {
    masterPackageSKUDescription?: string;
    masterSKUDescription?: string;
  };
}

export interface ProductMetrics {
  brandValues?: ProductMetricsValues[];
  skuValues?: ProductMetricsValues[];
}

export interface ProductMetricsValuesDTO {
  values: [
    {
      current: number;
      yearAgo: number;
      collectionMethod: string;
    }
  ];
  beerId?: {
    masterPackageSKUCode: string;
    masterPackageSKUDescription: string;
    masterSKUCode?: string;
    masterSKUDescription?: string;
  };
  operatingCompanyCode: string;
  operatingCompanyDescription: string;
  beverageTypeCode: string;
  beverageTypeDescription: string;
  brandCode: string;
  brandDescription: string;
  varietalCode: string;
  varietalDescription: string;
  subBrandCode?: string;
  subBrandDescription?: string;
}

export interface ProductMetricsDTO {
  brandValues?: ProductMetricsValuesDTO[];
  skuValues?: ProductMetricsValuesDTO[];
  type: string;
}
