import * as Chance from 'chance';
const chance = new Chance();

import { EntityPropertyType } from '../enums/entity-responsibilities.enum';

const entityPropertyTypeValues = Object.keys(EntityPropertyType).map(key => EntityPropertyType[key]);

export function getEntityDTOMock() {
  return {
    type: entityPropertyTypeValues[chance.integer({min: 0, max: entityPropertyTypeValues.length - 1})],
    id: chance.string(),
    name: chance.string()
  };
}
