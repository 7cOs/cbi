import * as Chance from 'chance';
let chance = new Chance();

import { PerformanceTotal } from './performance-total.model';

export function getPerformanceTotalMock(): PerformanceTotal {
  return {
    total: chance.floating(),
    totalYearAgo: chance.floating(),
    contributionToVolume: chance.floating()
  };
}
