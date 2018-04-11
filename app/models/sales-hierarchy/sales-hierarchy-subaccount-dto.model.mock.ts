import * as Chance from 'chance';

import { generateRandomSizedArray } from '../util.model';
import { getPremiseTypeValueMock } from '../../enums/premise-type.enum.mock';
import { SalesHierarchySubAccountDTO } from './sales-hierarchy-subaccount-dto.model';

const chance = new Chance();

export function getSalesHierarchySubAccountDTOMock(): SalesHierarchySubAccountDTO {
  return {
    id: chance.string(),
    name: chance.string(),
    premiseTypes: [getPremiseTypeValueMock()]
  };
}

export function getSalesHierarchySubAccountDTOSMock(): SalesHierarchySubAccountDTO[] {
  return generateRandomSizedArray().map(() => getSalesHierarchySubAccountDTOMock());
}
