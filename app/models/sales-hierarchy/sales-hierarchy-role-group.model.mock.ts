import * as Chance from 'chance';

import { generateRandomSizedArray } from '../util.model';
import { getPerformanceMock } from '../performance.model.mock';
import { getSalesHierarchyPositionsMock } from './sales-hierarchy-position.model.mock';
import { SalesHierarchyEntityType } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum';
import { SalesHierarchyRoleGroup } from './sales-hierarchy-role-group.model';

const chance = new Chance();

export function getSalesHierarchyRoleGroupMock(): SalesHierarchyRoleGroup {
  return {
    positionId: chance.string(),
    type: SalesHierarchyEntityType.RoleGroup,
    groupTypeCode: chance.string(),
    name: chance.string(),
    positions: getSalesHierarchyPositionsMock(),
    performance: getPerformanceMock()
  };
}

export function getSalesHierarchyRoleGroupsMock(): SalesHierarchyRoleGroup[] {
  return generateRandomSizedArray().map(() => getSalesHierarchyRoleGroupMock());
}
