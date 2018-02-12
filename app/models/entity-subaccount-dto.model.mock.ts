import * as Chance from 'chance';
const chance = new Chance();

import { EntitySubAccountDTO } from './entity-subaccount-dto.model';

export function getEntitySubAccountDTOMock(): EntitySubAccountDTO {
  return {
    id: chance.string(),
    name: chance.string(),
    premiseTypes: [chance.string()]
  };
}

export function getEntitySubAccountMultiPremiseTypesDTOMock(): EntitySubAccountDTO {
  return {
    id: chance.string(),
    name: chance.string(),
    premiseTypes: [chance.string(), chance.string()]
  };
}
