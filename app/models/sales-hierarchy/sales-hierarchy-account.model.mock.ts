import * as Chance from 'chance';

import { generateRandomSizedArray } from '../util.model';
import { getPerformanceMock } from '../performance.model.mock';
import { SalesHierarchyAccount } from './sales-hierarchy-account.model';
import { SalesHierarchyEntityType } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum';

const chance = new Chance();

export function getSalesHierarchyAccountMock(): SalesHierarchyAccount {
  return {
    id: chance.string(),
    positionId: chance.string(),
    name: chance.string(),
    type: SalesHierarchyEntityType.Account,
    performance: getPerformanceMock()
  };
}

export function getSalesHierarchyAccountsMock(): SalesHierarchyAccount[] {
  return generateRandomSizedArray().map(() => getSalesHierarchyAccountMock());
}
