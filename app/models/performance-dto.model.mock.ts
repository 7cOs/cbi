import * as Chance from 'chance';

import { PerformanceDTO } from './performance-dto.model';

const chance = new Chance();

export function getPerformanceDTOMock(): PerformanceDTO {
  return {
    total: chance.floating(),
    totalYearAgo: chance.floating(),
    contributionToVolume: chance.floating()
  };
}
