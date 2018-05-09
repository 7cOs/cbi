import * as Chance from 'chance';

import { generateRandomSizedArray } from '../util.model';
import { SalesHierarchyEntityType } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum';
import { SalesHierarchyStoreDTO } from './sales-hierarchy-store-dto.model';

const chance = new Chance();

export function getSalesHierarchyStoreDTOMock(): SalesHierarchyStoreDTO {
  return {
    id: chance.string(),
    name: chance.string(),
    storeNumber: chance.string(),
    storeSourceCode: chance.string(),
    type: SalesHierarchyEntityType.Store
  };
}

export function getSalesHierarchyStoreDTOSMock(): SalesHierarchyStoreDTO[] {
  return generateRandomSizedArray().map(() => getSalesHierarchyStoreDTOMock());
}
