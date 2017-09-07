import * as Chance from 'chance';

import { PerformanceTotal, PerformanceTotalDTO } from './performance-total.model';

const chance = new Chance();

export function getPerformanceTotalDTOMock(): PerformanceTotalDTO {
  return {
    total: chance.floating(),
    totalYearAgo: chance.floating(),
    contributionToVolume: chance.floating()
  };
}

export function getPerformanceTotalMock(): PerformanceTotal {
  return {
    total: chance.floating(),
    totalYearAgo: chance.floating(),
    totalYearAgoPercent: chance.floating(),
    contributionToVolume: chance.floating()
  };
}
