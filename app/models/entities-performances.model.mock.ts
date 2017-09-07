import { EntitiesPerformances, EntitiesPerformancesDTO } from '../models/entities-performances.model';
import { getEntitiesTotalPerformancesDTOMock, getPerformanceTotalMock } from '../models/entities-total-performances.model.mock'; // TODO: rn

export function getResponsibilityEntitiesPerformanceDTOMock(): EntitiesPerformancesDTO[] {
  return [
    { id: chance.string(), name: chance.string(), performanceTotal: getEntitiesTotalPerformancesDTOMock() },
    { id: chance.string(), name: chance.string(), performanceTotal: getEntitiesTotalPerformancesDTOMock() },
    { id: chance.string(), name: chance.string(), performanceTotal: getEntitiesTotalPerformancesDTOMock() }
  ];
}

export function getEntitiesPerformancesMock(): EntitiesPerformances[] {
  return [
    { positionId: chance.string(), name: chance.string(), performanceTotal: getPerformanceTotalMock() },
    { positionId: chance.string(), name: chance.string(), performanceTotal: getPerformanceTotalMock() },
    { positionId: chance.string(), name: chance.string(), performanceTotal: getPerformanceTotalMock() }
  ];
}
