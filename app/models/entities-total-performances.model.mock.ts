import * as Chance from 'chance';

import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from './entities-total-performances.model';

const chance = new Chance();

export function getEntitiesTotalPerformancesDTOMock(): EntitiesTotalPerformancesDTO {
  return {
    total: chance.floating(),
    totalYearAgo: chance.floating(),
    contributionToVolume: chance.floating()
  };
}

export function getPerformanceTotalMock(): EntitiesTotalPerformances {
  return {
    total: chance.floating(),
    totalYearAgo: chance.floating(),
    totalYearAgoPercent: chance.floating(),
    contributionToVolume: chance.floating()
  };
}
