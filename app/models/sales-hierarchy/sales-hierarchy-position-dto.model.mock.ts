import * as Chance from 'chance';

import { generateRandomSizedArray } from '../util.model';
import { getSalesHierarchyTypeMock } from '../../enums/sales-hierarchy/sales-hierarchy-type.enum.mock';
import { SalesHierarchyPositionDTO } from './sales-hierarchy-position-dto.model';

const chance = new Chance();

export function getSalesHierarchyPositionDTOMock(): SalesHierarchyPositionDTO {
  return {
    id: chance.string(),
    employeeId: chance.string(),
    type: chance.string(),
    hierarchyType: getSalesHierarchyTypeMock(),
    name: chance.string(),
    description: chance.string(),
    positionDescription: chance.string()
  };
}

export function getSalesHierarchyPositionDTOSMock(): SalesHierarchyPositionDTO[] {
  return generateRandomSizedArray().map(() => getSalesHierarchyPositionDTOMock());
}
