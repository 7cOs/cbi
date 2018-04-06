import * as Chance from 'chance';

import { generateRandomSizedArray } from '../util.model';
import { getPerformanceMock } from '../performance.model.mock';
import { getPremiseTypeValueMock } from '../../enums/premise-type.enum.mock';
import { SalesHierarchyEntityType } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum';
import { SalesHierarchySubAccount } from './sales-hierarchy-subaccount.model';

const chance = new Chance();

export function getSalesHierarchySubAccountMock(): SalesHierarchySubAccount {
  return {
    id: chance.string(),
    name: chance.string(),
    type: SalesHierarchyEntityType.SubAccount,
    premiseType: getPremiseTypeValueMock(),
    performance: getPerformanceMock()
  };
}

export function getSalesHierarchySubAccountsMock(): SalesHierarchySubAccount[] {
  return generateRandomSizedArray().map(() => getSalesHierarchySubAccountMock());
}
