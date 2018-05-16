import * as Chance from 'chance';

import { EntityDTO } from './entity-dto.model';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { generateRandomSizedArray } from './util.model';

const chance = new Chance();
const entityTypeValues: Array<EntityType> = [EntityType.Distributor, EntityType.Account, EntityType.SubAccount];

export function getEntityDTOMock(): EntityDTO {
  return {
    id: chance.string(),
    name: chance.string(),
    type: entityTypeValues[chance.integer({min: 0, max: entityTypeValues.length - 1})]
  };
}

export function getStoreEntityDTOMock(): EntityDTO {
  return {
    id: chance.string(),
    storeSourceCode: chance.string(),
    storeNumber: chance.string(),
    type: EntityType.Store,
    name: chance.string()
  };
}

export function getStoreEntityDTOArrayMock(): EntityDTO[] {
  return generateRandomSizedArray().map(() => getStoreEntityDTOMock());
}
