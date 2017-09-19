export interface ProductMetricsBrandValueDTO {
  values: [
    {
      current: number;
      yearAgo: number;
      collectionMethod: string;
    }
    ];
  operatingCompanyCode: string;
  operatingCompanyDescription: string;
  beverageTypeCode: string;
  beverageTypeDescription: string;
  brandCode: string;
  brandDescription: string;
  varietalCode: string;
  varietalDescription: string;
}

export interface ProductMetricsDTO {
  brandValues: ProductMetricsBrandValueDTO[];
  type: string;
}
