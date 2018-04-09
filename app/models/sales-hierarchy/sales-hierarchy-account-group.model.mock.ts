import * as Chance from 'chance';

import { generateRandomSizedArray } from '../util.model';
import { getPerformanceMock } from '../performance.model.mock';
import { getSalesHierarchyAccountsMock } from './sales-hierarchy-account.model.mock';
import { SalesHierarchyAccountGroup } from './sales-hierarchy-account-group.model';
import { SalesHierarchyEntityType } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum';

const chance = new Chance();

export function getSalesHierarchyAccountGroupMock(): SalesHierarchyAccountGroup {
  return {
    positionId: chance.string(),
    type: SalesHierarchyEntityType.AccountGroup,
    groupTypeCode: chance.string(),
    name: chance.string(),
    accounts: getSalesHierarchyAccountsMock(),
    performance: getPerformanceMock()
  };
}

export function getSalesHierarchyAccountGroupsMock(): SalesHierarchyAccountGroup[] {
  return generateRandomSizedArray().map(() => getSalesHierarchyAccountGroupMock());
}
