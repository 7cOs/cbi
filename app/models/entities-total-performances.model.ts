export interface EntitiesTotalPerformancesDTO {
  total: number;
  totalYearAgo: number;
  contributionToVolume?: number;
}

export interface EntitiesTotalPerformances {
  total: number;
  totalYearAgo: number;
  totalYearAgoPercent: number;
  contributionToVolume: number;
  name?: string;
}
