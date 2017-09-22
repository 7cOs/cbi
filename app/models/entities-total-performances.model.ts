export interface EntitiesTotalPerformancesDTO {
  total: number;
  totalYearAgo: number;
  contributionToVolume?: number;
}

export interface EntitiesTotalPerformances {
  contributionToVolume: number;
  total: number;
  totalYearAgo: number;
  totalYearAgoPercent: number;
  name?: string;
}
