import { sample } from 'lodash';

import { SalesHierarchyEntityType } from './sales-hierarchy-entity-type.enum';

const salesHierarchyEntityTypeValues = Object.keys(SalesHierarchyEntityType).map(key => SalesHierarchyEntityType[key]);

export function getSalesHierarchyEntityTypeMock(): SalesHierarchyEntityType {
  return sample(salesHierarchyEntityTypeValues);
}
