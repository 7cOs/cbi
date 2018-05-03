import * as Chance from 'chance';
import * as moment from 'moment';

import { generateRandomSizedArray } from '../util.model';
import { ListStorePerformance } from './list-store-performance.model';

const chance = new Chance();

export function getListStorePerformanceMock(): ListStorePerformance {
  return {
    unversionedStoreId: chance.string(),
    current: chance.floating(),
    currentSimple: chance.floating(),
    yearAgo: chance.floating(),
    yearAgoSimple: chance.floating(),
    lastSoldDate: moment().format('YYYYMMDD')
  };
}

export function getListStorePerformanceArrayMock(): ListStorePerformance[] {
  return generateRandomSizedArray().map(() => getListStorePerformanceMock());
}
