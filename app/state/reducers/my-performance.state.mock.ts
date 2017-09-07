import { ActionStatus } from '../../enums/action-status.enum';
import { getResponsibilityEntitiesPerformanceMock } from '../../models/entity-responsibilities.model.mock';
import { getPerformanceTotalMock } from '../../models/performance-total.model.mock';
import { getRoleGroupsMock } from '../../models/role-groups.model.mock';
// tslint:disable-next-line:no-unused-variable
import { getViewTypeMock } from '../../enums/view-type.enum.mock';
import { MyPerformanceData, MyPerformanceState } from './my-performance.reducer';
import { PerformanceTotalState } from './performance-total.reducer';
import { ResponsibilitiesState } from './responsibilities.reducer';
import { ViewType } from '../../enums/view-type.enum';
import { ViewTypeState } from './view-types.reducer';

export function getPerformanceTotalStateMock(): PerformanceTotalState {
  return {
    status: ActionStatus.Fetched,
    performanceTotal: getPerformanceTotalMock()
  };
}

export function getResponsibilitesStateMock(): ResponsibilitiesState {
  return {
    responsibilities: getRoleGroupsMock(),
    performanceTotals: getResponsibilityEntitiesPerformanceMock(),
    positionId: chance.natural(),
    status: ActionStatus.Fetched
  };
}

export function getViewTypeStateMock(): ViewTypeState {
  return {
    leftTableViewType: ViewType[getViewTypeMock()],
    rightTableViewType: ViewType[getViewTypeMock()]
  };
}

export function getMyPerformanceDataMock(): MyPerformanceData {
  return {
    responsibilities: getResponsibilitesStateMock(),
    performanceTotal: getPerformanceTotalStateMock(),
    viewType: getViewTypeStateMock(),
    selectedEntity: chance.string()
  };
}

export function getMyPerformanceStateMock(): MyPerformanceState  {
  const performanceStateMock = {
    current: getMyPerformanceDataMock(),
    versions: <MyPerformanceData[]>
              Array(chance.natural({min: 0, max: 9}))
              .fill('')
              .map(element => getMyPerformanceDataMock())
  };

  return performanceStateMock;
}
