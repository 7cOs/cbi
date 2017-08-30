export interface PerformanceTotalDTO {
  total: number;
  totalYearAgo: number;
  contributionToVolume?: number;
}

export interface PerformanceTotal {
  total: number;
  totalYearAgo: number;
  totalYearAgoPercent: number;
  contributionToVolume: number;
  name?: string;
}
