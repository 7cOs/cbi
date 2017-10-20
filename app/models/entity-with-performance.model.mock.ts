import { EntityType } from '../enums/entity-responsibilities.enum';
import { EntityWithPerformance, EntityWithPerformanceDTO } from '../models/entity-with-performance.model';
import { getPerformanceMock, getPerformanceDTOMock } from '../models/performance.model.mock';

const entityTypeValues = Object.keys(EntityType).map(key => EntityType[key]);

export function getResponsibilityEntitiesPerformanceDTOMock(): EntityWithPerformanceDTO[] {
  return [{
    id: chance.string(),
    name: chance.string(),
    entityType: entityTypeValues[chance.integer({min: 0 , max: entityTypeValues.length - 1})],
    entityTypeCode: chance.string(),
    positionDescription: entityTypeValues[chance.integer({min: 0 , max: entityTypeValues.length - 1})],
    performance: getPerformanceDTOMock()
  }, {
    id: chance.string(),
    name: chance.string(),
    entityType: entityTypeValues[chance.integer({min: 0 , max: entityTypeValues.length - 1})],
    entityTypeCode: chance.string(),
    positionDescription: entityTypeValues[chance.integer({min: 0 , max: entityTypeValues.length - 1})],
    performance: getPerformanceDTOMock()
  }, {
    id: chance.string(),
    name: chance.string(),
    entityType: entityTypeValues[chance.integer({min: 0 , max: entityTypeValues.length - 1})],
    entityTypeCode: chance.string(),
    positionDescription: entityTypeValues[chance.integer({min: 0 , max: entityTypeValues.length - 1})],
    performance: getPerformanceDTOMock()
  }];
}

export function getEntitiesWithPerformancesMock(): EntityWithPerformance[] {
  return [{
    positionId: chance.string(),
    contextPositionId: chance.string(),
    name: chance.string(),
    entityTypeCode: chance.string(),
    entityType: entityTypeValues[chance.integer({min: 0 , max: entityTypeValues.length - 1})],
    positionDescription: undefined,
    performance: getPerformanceMock()
  }, {
    positionId: chance.string(),
    contextPositionId: chance.string(),
    name: chance.string(),
    entityTypeCode: chance.string(),
    entityType: entityTypeValues[chance.integer({min: 0 , max: entityTypeValues.length - 1})],
    positionDescription: undefined,
    performance: getPerformanceMock()
  }, {
    positionId: chance.string(),
    contextPositionId: chance.string(),
    name: chance.string(),
    entityTypeCode: chance.string(),
    entityType: entityTypeValues[chance.integer({min: 0 , max: entityTypeValues.length - 1})],
    positionDescription: undefined,
    performance: getPerformanceMock()
  }];
}
