import { sample } from 'lodash';

import { SalesHierarchyType } from './sales-hierarchy-type.enum';

const salesHierarchyTypeValues = Object.keys(SalesHierarchyType).map(key => SalesHierarchyType[key]);

export function getSalesHierarchyTypeMock(): SalesHierarchyType {
  return sample(salesHierarchyTypeValues);
}
