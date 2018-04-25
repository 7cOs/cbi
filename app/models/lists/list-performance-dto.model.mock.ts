import * as Chance from 'chance';

import { getListStorePerformanceDTOS } from './list-store-performance-dto.model.mock';
import { ListPerformanceDTO } from './list-performance-dto.model';

const chance = new Chance();

export function getListPerformanceDTOMock(): ListPerformanceDTO {
 return {
   current: chance.floating(),
   currentSimple: chance.floating(),
   yearAgo: chance.floating(),
   yearAgoSimple: chance.floating(),
   storePerformance: getListStorePerformanceDTOS()
 };
}
