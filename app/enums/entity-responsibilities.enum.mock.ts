import { sample } from 'lodash';

import { EntityPeopleType, EntityType } from './entity-responsibilities.enum';

const entityPeopleTypeValues = Object.keys(EntityPeopleType).map(key => EntityPeopleType[key]);
const entityTypesValues = Object.keys(EntityType).map(key => EntityType[key]);

export function getEntityPeopleTypeMock(): EntityPeopleType {
  return sample(entityPeopleTypeValues);
}

export function getEntityTypeMock(): EntityType {
  return sample(entityTypesValues);
}
