import * as Chance from 'chance';
const chance = new Chance();

import { EntityResponsibilities } from './entity-responsibilities.model';
import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { EntityResponsibilitiesDTO } from './entity-responsibilities.model';
import { GroupedEntities } from './grouped-entities.model';

const entityPeopleTypeValues = Object.keys(EntityPeopleType).map(key => EntityPeopleType[key]);
const entityPropertyTypeValues = Object.keys(EntityPropertyType).map(key => EntityPropertyType[key]);

export function getEntityPeopleResponsibilitiesMock(): EntityResponsibilities {
  return {
    peopleType: entityPeopleTypeValues[chance.integer({min: 0, max: entityPeopleTypeValues.length - 1})],
    positionId: chance.string(),
    employeeId: chance.string(),
    name: chance.string(),
    type: chance.string(),
    hierarchyType: chance.string(),
    description: chance.string()
  };
}

export function getEntityPropertyResponsibilitiesMock(): EntityResponsibilities {
  return {
    propertyType: entityPropertyTypeValues[chance.integer({min: 0, max: entityPropertyTypeValues.length - 1})],
    positionId: chance.string(),
    employeeId: chance.string(),
    name: chance.string(),
    type: chance.string(),
    hierarchyType: chance.string(),
    description: chance.string()
  };
}

export function getEntityPeopleResponsibilitiesOpenPositionMock(): EntityResponsibilities {
  return {
    peopleType: entityPeopleTypeValues[chance.integer({min: 0, max: entityPeopleTypeValues.length - 1})],
    positionId: '1',
    employeeId: null,
    name: 'Open',
    subName: 'Best job on earth',
    type: chance.string(),
    hierarchyType: chance.string(),
    description: chance.string()
  };
}

export function getGroupEntityPeopleResponsibilitiesMock(): GroupedEntities {
  return {
   'CORPORATE': [getEntityPeopleResponsibilitiesOpenPositionMock()]
  };
}

export const mockEntityResponsibilitiesDTOCollection: EntityResponsibilitiesDTO[] = [
  {
    id: '123',
    employeeId: '1231231',
    name: 'Joel Cummins',
    description: 'MARKET DEVELOPMENT MANAGER',
    type: '10',
    hierarchyType: 'SALES_HIER'
  },
  {
    id: '456',
    employeeId: '4564561',
    name: 'Andy Farag',
    description: 'MARKET DEVELOPMENT MANAGER',
    type: '20',
    hierarchyType: 'SALES_HIER'
  },
  {
    id: '789',
    employeeId: '7897891',
    name: 'Ryan Stasik',
    description: 'GENERAL MANAGER',
    type: '30',
    hierarchyType: 'SALES_HIER'
  }
];
