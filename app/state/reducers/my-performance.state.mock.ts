import { ActionStatus } from '../../enums/action-status.enum';
import { getEntitiesWithPerformancesMock } from '../../models/entity-with-performance.model.mock';
import { getEntityTypeMock } from '../../enums/entity-responsibilities.enum.mock';
import { getHierarchyGroupMock } from '../../models/hierarchy-group.model.mock';
import { getPerformanceMock } from '../../models/performance.model.mock';
import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
import { getSalesHierarchyViewTypeMock } from '../../enums/sales-hierarchy-view-type.enum.mock';
import { MyPerformanceEntitiesData, MyPerformanceState } from './my-performance.reducer';
import { ResponsibilitiesState } from './responsibilities.reducer';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';
import { SalesHierarchyViewTypeState } from './sales-hierarchy-view-type.reducer';

export function getResponsibilitesStateMock(): ResponsibilitiesState {
  return {
    groupedEntities: getGroupedEntitiesMock(),
    hierarchyGroups: Array(chance.natural({min: 1, max: 9})).fill('').map(() => getHierarchyGroupMock()),
    entityWithPerformance: getEntitiesWithPerformancesMock(),
    entitiesTotalPerformances: getPerformanceMock(),
    positionId: chance.string(),
    status: ActionStatus.Fetched
  };
}

export function getViewTypeStateMock(): SalesHierarchyViewTypeState {
  return {
    viewType: SalesHierarchyViewType[getSalesHierarchyViewTypeMock()]
  };
}

export function getMyPerformanceEntitiesDataMock(): MyPerformanceEntitiesData {
  return {
    responsibilities: getResponsibilitesStateMock(),
    salesHierarchyViewType: getViewTypeStateMock(),
    selectedEntityDescription: chance.string(),
    selectedEntityType: getEntityTypeMock(),
    selectedBrandCode: chance.string()
  };
}

export function getMyPerformanceStateMock(): MyPerformanceState  {
  const performanceStateMock = {
    current: getMyPerformanceEntitiesDataMock(),
    versions: <MyPerformanceEntitiesData[]>
              Array(chance.natural({min: 0, max: 9}))
              .fill('')
              .map(element => getMyPerformanceEntitiesDataMock())
  };

  return performanceStateMock;
}
