import * as Chance from 'chance';
let chance = new Chance();

import { SalesHierarchyViewType } from './sales-hierarchy-view-type.enum';

const viewTypeValues = Object.keys(SalesHierarchyViewType).map(key => SalesHierarchyViewType[key]);

export function getSalesHierarchyViewTypeMock(): SalesHierarchyViewType {
  return viewTypeValues[chance.integer({ min: 0, max: viewTypeValues.length - 1})];
}
