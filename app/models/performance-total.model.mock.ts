import * as Chance from 'chance';

import { PerformanceTotal } from './performance-total.model';

const chance = new Chance();

export function performanceTotalMock(): PerformanceTotal {
  return {
    total: chance.floating(),
    totalYearAgo: chance.floating(),
    contributionToVolume: chance.floating()
  };
}
