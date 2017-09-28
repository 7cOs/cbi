import * as Chance from 'chance';

import { Performance, PerformanceDTO } from './performance.model';

const chance = new Chance();

export function getPerformanceDTOMock(): PerformanceDTO {
  return {
    total: chance.floating(),
    totalYearAgo: chance.floating(),
    contributionToVolume: chance.floating()
  };
}

export function getPerformanceMock(): Performance {
  return {
    total: chance.floating(),
    totalYearAgo: chance.floating(),
    totalYearAgoPercent: chance.floating(),
    contributionToVolume: chance.floating(),
    error: false
  };
}
