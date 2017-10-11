import * as Chance from 'chance';

import { EntityDTO } from './entity-dto.model';

const chance = new Chance();

export function getEntityDTOMock(): EntityDTO {
  return {
    id: chance.string(),
    name: chance.string(),
    type: chance.string()
  };
}
