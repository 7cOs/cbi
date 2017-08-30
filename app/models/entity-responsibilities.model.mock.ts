import * as Chance from 'chance';
const chance = new Chance();

import { EntityResponsibilities } from './entity-responsibilities.model';
import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { getPerformanceTotalDTOMock, getPerformanceTotalMock } from '../models/performance-total.model.mock';
import { ResponsibilityEntityPerformance, ResponsibilityEntityPerformanceDTO } from '../models/entity-responsibilities.model';

const entityPeopleTypeValues = Object.keys(EntityPeopleType).map(key => EntityPeopleType[key]);
const entityPropertyTypeValues = Object.keys(EntityPropertyType).map(key => EntityPropertyType[key]);

export function getEntityPeopleResponsibilitiesMock(): EntityResponsibilities {
  return {
    peopleType: entityPeopleTypeValues[chance.integer({min: 0, max: entityPeopleTypeValues.length - 1})],
    id: chance.natural(),
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
    id: chance.natural(),
    employeeId: chance.string(),
    name: chance.string(),
    type: chance.string(),
    hierarchyType: chance.string(),
    description: chance.string()
  };
}

export function getResponsibilityEntitiesPerformanceDTOMock(): ResponsibilityEntityPerformanceDTO[] {
  return [
    { id: chance.natural(), name: chance.string(), performanceTotal: getPerformanceTotalDTOMock() },
    { id: chance.natural(), name: chance.string(), performanceTotal: getPerformanceTotalDTOMock() },
    { id: chance.natural(), name: chance.string(), performanceTotal: getPerformanceTotalDTOMock() }
  ];
}

export function getResponsibilityEntitiesPerformanceMock(): ResponsibilityEntityPerformance[] {
  return [
    { id: chance.natural(), name: chance.string(), performanceTotal: getPerformanceTotalMock() },
    { id: chance.natural(), name: chance.string(), performanceTotal: getPerformanceTotalMock() },
    { id: chance.natural(), name: chance.string(), performanceTotal: getPerformanceTotalMock() }
  ];
}
