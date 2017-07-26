import * as Chance from 'chance';
let chance = new Chance();

import { EntityResponsibilities } from './entity-responsibilities.model';
import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';

const entityPeopleTypeValues = Object.keys(EntityPeopleType).map(key => EntityPeopleType[key]);
const entityPropertyTypeValues = Object.keys(EntityPropertyType).map(key => EntityPropertyType[key]);

export function entityPeopleResponsibilitiesMock(): EntityResponsibilities {
  return {
    peopleType: entityPeopleTypeValues[chance.integer({min: 0, max: entityPeopleTypeValues.length - 1})],
    id: chance.string(),
    name: chance.string()
  };
}

export function entityPropertyResponsibilitiesMock(): EntityResponsibilities {
  return {
    propertyType: entityPropertyTypeValues[chance.integer({min: 0, max: entityPropertyTypeValues.length - 1})],
    id: chance.string(),
    name: chance.string()
  };
}
