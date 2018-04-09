import * as Chance from 'chance';

import { generateRandomSizedArray } from '../util.model';
import { getSalesHierarchyEntityTypeMock } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum.mock';
import { SalesHierarchyDistributorDTO } from './sales-hierarchy-distributor-dto.model';

const chance = new Chance();

export function getSalesHierarchyDistributorDTOMock(): SalesHierarchyDistributorDTO {
  return {
    id: chance.string(),
    name: chance.string(),
    type: getSalesHierarchyEntityTypeMock()
  };
}

export function getSalesHierarchyDistributorDTOSMock(): SalesHierarchyDistributorDTO[] {
  return generateRandomSizedArray().map(() => getSalesHierarchyDistributorDTOMock());
}
