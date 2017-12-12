export interface OpportunityCount {
  name: string;
  count: number;
}

export interface GroupedOpportunityCounts {
  [key: string]: {
    total: number;
  };
}
