import { EntitiesPerformances, EntitiesPerformancesDTO } from '../models/entities-performances.model';
import { getEntitiesTotalPerformancesMock, getEntitiesTotalPerformancesDTOMock } from '../models/entities-total-performances.model.mock';

export function getResponsibilityEntitiesPerformanceDTOMock(): EntitiesPerformancesDTO[] {
  return [
    { id: chance.string(), name: chance.string(), performanceTotal: getEntitiesTotalPerformancesDTOMock() },
    { id: chance.string(), name: chance.string(), performanceTotal: getEntitiesTotalPerformancesDTOMock() },
    { id: chance.string(), name: chance.string(), performanceTotal: getEntitiesTotalPerformancesDTOMock() }
  ];
}

export function getEntitiesPerformancesMock(): EntitiesPerformances[] {
  return [
    { positionId: chance.string(), name: chance.string(), performanceTotal: getEntitiesTotalPerformancesMock() },
    { positionId: chance.string(), name: chance.string(), performanceTotal: getEntitiesTotalPerformancesMock() },
    { positionId: chance.string(), name: chance.string(), performanceTotal: getEntitiesTotalPerformancesMock() }
  ];
}