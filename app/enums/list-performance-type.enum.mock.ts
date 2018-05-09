import { sample } from 'lodash';

import { ListPerformanceType } from './list-performance-type.enum';

const listPerformanceTypeValues = Object.keys(ListPerformanceType);

export function getListPerformanceTypeMock(): ListPerformanceType {
  return sample(listPerformanceTypeValues) as ListPerformanceType;
}
