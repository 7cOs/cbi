export interface PerformanceDTO {
  total: number;
  totalYearAgo: number;
  contributionToVolume?: number;
}

export interface Performance {
  contributionToVolume: number;
  total: number;
  totalYearAgo: number;
  totalYearAgoPercent: number;
  name?: string;
}
