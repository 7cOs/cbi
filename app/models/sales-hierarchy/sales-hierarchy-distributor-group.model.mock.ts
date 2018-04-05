import * as Chance from 'chance';

import { generateRandomSizedArray } from '../util.model';
import { getPerformanceMock } from '../performance.model.mock';
import { getSalesHierarchyDistributorsMock } from './sales-hierarchy-distributor.model.mock';
import { SalesHierarchyDistributorGroup } from './sales-hierarchy-distributor-group.model';
import { SalesHierarchyEntityType } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum';

const chance = new Chance();

export function getSalesHierarchyDistributorsGroupMock(): SalesHierarchyDistributorGroup {
  return {
    positionId: chance.string(),
    type: SalesHierarchyEntityType.DistributorGroup,
    groupTypeCode: chance.string(),
    name: chance.string(),
    distributors: getSalesHierarchyDistributorsMock(),
    performance: getPerformanceMock()
  };
}

export function getSalesHierarchyDistributorGroupsMock(): SalesHierarchyDistributorGroup[] {
  return generateRandomSizedArray().map(() => getSalesHierarchyDistributorsGroupMock());
}
