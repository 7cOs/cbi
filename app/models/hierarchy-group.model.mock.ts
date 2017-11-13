import * as Chance from 'chance';

import { getEntityTypeMock } from '../enums/entity-responsibilities.enum.mock';
import { HierarchyGroup } from './hierarchy-group.model';

const chance = new Chance();

export function getHierarchyGroupMock(): HierarchyGroup {
  return {
    name: chance.string(),
    type: chance.string(),
    entityType: getEntityTypeMock(),
    positionId: chance.string(),
    positionDescription: chance.string()
  };
}
