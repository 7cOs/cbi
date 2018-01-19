export interface OpportunityCount {
  name: string;
  count: number;
}

export interface OpportunitiesGroupedByBrandSkuPackageCode {
  [brandSkuPackageCode: string]: {
    brandSkuPackageOpportunityCountTotal: number;
    opportunityCounts: OpportunityCount[];
  };
}

export interface OpportunitiesGroupedBySkuPackageCode {
  skuPackageOpportunityCountTotal: number;
  opportunitiesGroupedBySkuPackageCode: OpportunitiesGroupedByBrandSkuPackageCode;
  brandOpportunityCounts: OpportunityCount[];
}
