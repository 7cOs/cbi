import * as Chance from 'chance';

import { generateRandomSizedArray } from '../util.model';
import { getSalesHierarchyEntityTypeMock } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum.mock';
import { SalesHierarchyAccountDTO } from './sales-hierarchy-account-dto.model';

const chance = new Chance();

export function getSalesHierarchyAccountDTOMock(): SalesHierarchyAccountDTO {
  return {
    id: chance.string(),
    name: chance.string(),
    type: getSalesHierarchyEntityTypeMock()
  };
}

export function getSalesHierarchyAccountDTOSMock(): SalesHierarchyAccountDTO[] {
  return generateRandomSizedArray().map(() => getSalesHierarchyAccountDTOMock());
}
