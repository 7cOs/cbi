import * as Chance from 'chance';
import * as moment from 'moment';

import { generateRandomSizedArray } from '../util.model';
import { ListStorePerformanceDTO } from './list-store-performance-dto.model';

const chance = new Chance();

export function getListStorePerformanceDTO(): ListStorePerformanceDTO {
  return {
    storeSourceCode: chance.string(),
    current: chance.floating(),
    currentSimple: chance.floating(),
    yearAgo: chance.floating(),
    yearAgoSimple: chance.floating(),
    lastSoldDate: moment().format('YYYYMMDD')
  };
}

export function getListStorePerformanceDTOS(): ListStorePerformanceDTO[] {
  return generateRandomSizedArray().map(() => getListStorePerformanceDTO());
}
