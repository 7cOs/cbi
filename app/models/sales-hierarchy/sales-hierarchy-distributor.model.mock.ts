import * as Chance from 'chance';

import { generateRandomSizedArray } from '../util.model';
import { getPerformanceMock } from '../performance.model.mock';
import { SalesHierarchyDistributor } from './sales-hierarchy-distributor.model';
import { SalesHierarchyEntityType } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum';

const chance = new Chance();

export function getSalesHierarchyDistributorMock(): SalesHierarchyDistributor {
  return {
    id: chance.string(),
    positionId: chance.string(),
    name: chance.string(),
    type: SalesHierarchyEntityType.Distributor,
    performance: getPerformanceMock()
  };
}

export function getSalesHierarchyDistributorsMock(): SalesHierarchyDistributor[] {
  return generateRandomSizedArray().map(() => getSalesHierarchyDistributorMock());
}
