import { ActionStatus } from '../../enums/action-status.enum';
// tslint:disable-next-line:no-unused-variable
import { Performance } from '../../models/performance.model';
import { getEntitiesWithPerformancesMock } from '../../models/entities-performances.model.mock';
import { getPerformanceMock } from '../../models/performance.model.mock';
import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
// tslint:disable-next-line:no-unused-variable
import { getViewTypeMock } from '../../enums/view-type.enum.mock';
import { MyPerformanceEntitiesData, MyPerformanceState } from './my-performance.reducer';
import { ResponsibilitiesState } from './responsibilities.reducer';
import { ViewType } from '../../enums/view-type.enum';
import { ViewTypeState } from './view-types.reducer';

export function getResponsibilitesStateMock(): ResponsibilitiesState {
  return {
    groupedEntities: getGroupedEntitiesMock(),
    entityWithPerformance: getEntitiesWithPerformancesMock(),
    entitiesTotalPerformances: getPerformanceMock(),
    positionId: chance.string(),
    status: ActionStatus.Fetched
  };
}

export function getViewTypeStateMock(): ViewTypeState {
  return {
    leftTableViewType: ViewType[getViewTypeMock()],
    rightTableViewType: ViewType[getViewTypeMock()]
  };
}

export function getMyPerformanceEntitiesDataMock(): MyPerformanceEntitiesData {
  return {
    responsibilities: getResponsibilitesStateMock(),
    viewType: getViewTypeStateMock(),
    selectedEntity: chance.string()
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
