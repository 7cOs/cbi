import * as Chance from 'chance';
let chance = new Chance();

import { getEntityResponsibilitiesDTO } from './entity-responsibilities.model.mock';
import { PeopleResponsibilitiesDTO } from './people-responsibilities-dto.model';

export function getPeopleResponsibilitiesDTOMock(): PeopleResponsibilitiesDTO {
  return {
    positions: [getEntityResponsibilitiesDTO(), getEntityResponsibilitiesDTO()],
    entityURIs: [chance.string()]
  };
}
