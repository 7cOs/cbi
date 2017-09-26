import * as Chance from 'chance';
let chance = new Chance();

import { getHierarchyEntityDTO } from './hierarchy-entity.model.mock';
import { PeopleResponsibilitiesDTO } from './people-responsibilities-dto.model';

export function getPeopleResponsibilitiesDTOMock(): PeopleResponsibilitiesDTO {
  return {
    positions: [getHierarchyEntityDTO(), getHierarchyEntityDTO()],
    entityURIs: [chance.string()]
  };
}
