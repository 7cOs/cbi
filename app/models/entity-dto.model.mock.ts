import * as Chance from 'chance';

import { EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { EntityDTO } from './entity-dto.model';

const chance = new Chance();
const entityPropertyTypeValues = Object.keys(EntityPropertyType).map(key => EntityPropertyType[key]);

export function getEntityDTOMock() {
  return {
    type: entityPropertyTypeValues[chance.integer({min: 0, max: entityPropertyTypeValues.length - 1})],
    id: chance.string(),
    name: chance.string()
  };
}

export function getDistributorEntityDTOMock (): EntityDTO {
  return {
    type: EntityPropertyType.Distributor,
    id: chance.string(),
    name: chance.string()
  };
}

export function getAccountEntityDTOMock (): EntityDTO {
  return {
    type: EntityPropertyType.Account,
    id: chance.string(),
    name: chance.string()
  };
}
