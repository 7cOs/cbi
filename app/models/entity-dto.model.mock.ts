import * as Chance from 'chance';

import { EntityDTO } from './entity-dto.model';
import { EntityType } from '../enums/entity-responsibilities.enum';

const chance = new Chance();
const entityTypeValues: Array<EntityType> = [EntityType.Distributor, EntityType.Account, EntityType.SubAccount];

export function getEntityDTOMock(): EntityDTO {
  return {
    id: chance.string(),
    name: chance.string(),
    type: entityTypeValues[chance.integer({min: 0, max: entityTypeValues.length - 1})]
  };
}
