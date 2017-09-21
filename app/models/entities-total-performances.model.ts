export interface EntitiesTotalPerformancesDTO {
  total: number;
  totalYearAgo: number;
  contributionToVolume?: number;
  entityId?: string;
}

export interface EntitiesTotalPerformances {
  contributionToVolume: number;
  total: number;
  totalYearAgo: number;
  totalYearAgoPercent: number;
  name?: string;
}
