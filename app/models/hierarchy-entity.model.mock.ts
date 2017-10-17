import * as Chance from 'chance';
const chance = new Chance();

import { HierarchyEntity } from './hierarchy-entity.model';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { HierarchyEntityDTO } from './hierarchy-entity.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';

const entityTypeValues = Object.keys(EntityType).map(key => EntityType[key]);
const premiseTypeValues = Object.keys(PremiseTypeValue).map(key => PremiseTypeValue[key]);

export function getEntityPeopleResponsibilitiesMock(): HierarchyEntity {
  return {
    positionId: chance.string(),
    employeeId: chance.string(),
    name: chance.string(),
    positionDescription: chance.string(),
    type: chance.string(),
    hierarchyType: chance.string(),
    description: chance.string(),
    entityType: entityTypeValues[chance.integer({min: 0 , max: entityTypeValues.length - 1})]
  };
}
export function getEntityPeopleResponsibilitiesWithOutPositionDescriptionMock(): HierarchyEntity {
  return {
    positionId: chance.string(),
    employeeId: chance.string(),
    name: chance.string(),
    type: chance.string(),
    hierarchyType: chance.string(),
    description: chance.string(),
    entityType: entityTypeValues[chance.integer({min: 0, max: entityTypeValues.length - 1})]
  };
}

export function getEntityPropertyResponsibilitiesMock(): HierarchyEntity {
  return {
    positionId: chance.string(),
    employeeId: chance.string(),
    name: chance.string(),
    positionDescription: chance.string(),
    type: chance.string(),
    hierarchyType: chance.string(),
    description: chance.string(),
    entityType: entityTypeValues[chance.integer({min: 0, max: entityTypeValues.length - 1})],
    premiseType: premiseTypeValues[chance.integer({min: 0, max: premiseTypeValues.length - 1})]
  };
}

export function getHierarchyEntityDTO(): HierarchyEntityDTO {
  return {
    id: chance.string(),
    employeeId: chance.string(),
    name: chance.string(),
    description: chance.string(),
    type: chance.string(),
    hierarchyType: chance.string()
  };
}

export const mockHierarchyEntityDTOCollection: HierarchyEntityDTO[] = [
  {
    id: '123',
    employeeId: '1231231',
    name: 'Joel Cummins',
    description: 'MARKET DEVELOPMENT MANAGER',
    positionDescription: 'Director of Personnel',
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
  },
  {
    id: '987',
    employeeId: '2225687',
    name: 'Tom Brady',
    description: 'GENERAL MANAGER',
    type: '14',
    hierarchyType: 'SALES_HIER'
  }
];
