import * as Chance from 'chance';

import { generateRandomSizedArray } from '../util.model';
import { getSalesHierarchyTypeMock } from '../../enums/sales-hierarchy/sales-hierarchy-type.enum.mock';
import { getPerformanceMock } from '../performance.model.mock';
import { SalesHierarchyEntityType } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum';
import { SalesHierarchyPosition } from './sales-hierarchy-position.model';

const chance = new Chance();

export function getSalesHierarchyPositionMock(): SalesHierarchyPosition {
  return {
    id: chance.string(),
    employeeId: chance.string(),
    type: SalesHierarchyEntityType.Person,
    salesHierarchyType: getSalesHierarchyTypeMock(),
    name: chance.string(),
    positionRoleGroup: chance.string(),
    positionLocation: chance.string(),
    isOpenPosition: false,
    performance: getPerformanceMock()
  };
}

export function getSalesHierarchyPositionsMock(): SalesHierarchyPosition[] {
  return generateRandomSizedArray().map(() => getSalesHierarchyPositionMock());
}
