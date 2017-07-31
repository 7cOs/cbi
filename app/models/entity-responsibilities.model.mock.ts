import * as Chance from 'chance';
let chance = new Chance();

import { EntityResponsibilities, EntityPeopleType, EntityPropertyType } from './entity-responsibilities.model';

const entityPeopleTypeValues = Object.keys(EntityPeopleType).map(key => EntityPeopleType[key]);
const entityPropertyTypeValues = Object.keys(EntityPropertyType).map(key => EntityPropertyType[key]);

export function entityPeopleResponsibilitiesMock(): EntityResponsibilities {
  return {
    peopleType: entityPeopleTypeValues[chance.integer({min: 0, max: entityPeopleTypeValues.length - 1})],
    id: chance.natural(),
    name: chance.string(),
    typeDisplayName: chance.string()
  };
}

export function entityPropertyResponsibilitiesMock(): EntityResponsibilities {
  return {
    propertyType: entityPropertyTypeValues[chance.integer({min: 0, max: entityPropertyTypeValues.length - 1})],
    id: chance.natural(),
    name: chance.string(),
    typeDisplayName: chance.string()
  };
}
