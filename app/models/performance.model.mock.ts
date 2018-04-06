import * as Chance from 'chance';

import { Performance } from './performance.model';

const chance = new Chance();

export function getPerformanceMock(): Performance {
  return {
    total: chance.floating(),
    totalYearAgo: chance.floating(),
    totalYearAgoPercent: chance.floating(),
    contributionToVolume: chance.floating(),
    error: false
  };
}
