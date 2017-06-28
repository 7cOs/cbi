import * as Chance from 'chance';
let chance = new Chance();

import { PerformanceTotal } from './performance-total.model';

export function performanceTotalMock(): PerformanceTotal { // name: get or no get? We need to make that consistent.
  return {
    total: chance.floating(),
    totalYearAgo: chance.floating(),
    contributionToVolume: chance.floating()
  };
}
