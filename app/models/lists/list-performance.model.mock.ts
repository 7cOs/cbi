import * as Chance from 'chance';

import { getListStorePerformanceArrayMock } from './list-store-performance.model.mock';
import { ListPerformance } from './list-performance.model';

const chance = new Chance();

export function getListPerformanceMock(): ListPerformance {
 return {
   current: chance.floating(),
   currentSimple: chance.floating(),
   yearAgo: chance.floating(),
   yearAgoSimple: chance.floating(),
   storePerformance: getListStorePerformanceArrayMock()
 };
}
