import { EntityWithPerformance, EntityWithPerformanceDTO } from '../models/entity-with-performance.model';
import { getPerformanceMock, getPerformanceDTOMock } from '../models/performance.model.mock';

export function getResponsibilityEntitiesPerformanceDTOMock(): EntityWithPerformanceDTO[] {
  return [
    { id: chance.string(), name: chance.string(), positionDescription: chance.string(),
      performance: getPerformanceDTOMock() },
    { id: chance.string(), name: chance.string(), positionDescription: chance.string(),
      performance: getPerformanceDTOMock() },
    { id: chance.string(), name: chance.string(), positionDescription: chance.string(),
      performance: getPerformanceDTOMock() }
  ];
}

export function getEntitiesWithPerformancesMock(): EntityWithPerformance[] {
  return [
    { positionId: chance.string(), name: chance.string(), positionDescription: undefined,
      performance: getPerformanceMock() },
    { positionId: chance.string(), name: chance.string(), positionDescription: undefined,
      performance: getPerformanceMock() },
    { positionId: chance.string(), name: chance.string(), positionDescription: undefined,
      performance: getPerformanceMock() }
  ];
}

export function getEntitiesWithPerformancesOpenPositionMock(): EntityWithPerformance[] {
  return [
    { positionId: chance.string(), name: 'Open',
      positionDescription: chance.string(), performance: getPerformanceMock() },
    { positionId: chance.string(), name: 'Open',
      positionDescription: chance.string(), performance: getPerformanceMock() }
  ];
}
