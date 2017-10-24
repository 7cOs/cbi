import * as Chance from 'chance';
let chance = new Chance();

import { EntityType } from './entity-responsibilities.enum';

const entityTypesValues = Object.keys(EntityType).map(key => EntityType[key]);

export function getEntityTypeMock(): EntityType {
  return entityTypesValues[chance.integer({ min: 0, max: entityTypesValues.length - 1})];
}
