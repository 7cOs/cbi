export interface OpportunityCount {
  name: string;
  count: number;
}

export interface OpportunitiesGroupedByBrandSkuPackageCode {
  [brandSkuPackageCode: string]: {
    brandSkuPackageOpportunityCount: number;
  };
}

export interface OpportunitiesGroupedBySkuPackageCode {
  skuPackageOpportunityCount: number;
  opportunitiesGroupedBySkuPackageCode: OpportunitiesGroupedByBrandSkuPackageCode;
}
