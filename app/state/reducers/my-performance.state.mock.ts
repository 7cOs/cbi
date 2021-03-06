import { ActionStatus } from '../../enums/action-status.enum';
import { getEntitiesWithPerformancesMock } from '../../models/entity-with-performance.model.mock';
import { getEntityTypeMock } from '../../enums/entity-responsibilities.enum.mock';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getHierarchyGroupMock } from '../../models/hierarchy-group.model.mock';
import { getPerformanceMock } from '../../models/performance.model.mock';
import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
import { getSalesHierarchyViewTypeMock } from '../../enums/sales-hierarchy-view-type.enum.mock';
import { getSkuPackageTypeMock } from '../../enums/sku-package-type.enum.mock';
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
    accountPositionId: chance.string(),
    exceptionHierarchy: false,
    status: ActionStatus.Fetched,
    responsibilitiesStatus: ActionStatus.Fetched,
    entitiesPerformanceStatus: ActionStatus.Fetched,
    totalPerformanceStatus: ActionStatus.Fetched,
    subaccountsStatus: ActionStatus.Fetched
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
    selectedBrandCode: chance.string(),
    selectedSkuPackageCode: chance.string(),
    selectedSkuPackageType: getSkuPackageTypeMock(),
    selectedSubaccountCode: chance.string(),
    selectedDistributorCode: chance.string(),
    filter: getMyPerformanceFilterMock()
  };
}

export function getMyPerformanceStateMock(): MyPerformanceState  {
  return {
    current: getMyPerformanceEntitiesDataMock(),
    versions: <MyPerformanceEntitiesData[]>
              Array(chance.natural({min: 0, max: 9}))
              .fill('')
              .map(element => getMyPerformanceEntitiesDataMock())
  };
}
