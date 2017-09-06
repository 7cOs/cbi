import { ActionStatus } from '../../enums/action-status.enum';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { FetchResponsibilityEntitiesPerformancePayload } from '../actions/responsibilities.action';
import { initialState, responsibilitiesReducer } from './responsibilities.reducer';
import { getEntityPeopleResponsibilitiesMock,
         getResponsibilityEntitiesPerformanceMock } from '../../models/entity-responsibilities.model.mock';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getPerformanceTotalMock } from '../../models/performance-total.model.mock';
import { getRoleGroupsMock } from '../../models/role-groups.model.mock';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { PerformanceTotal } from '../../models/performance-total.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { ResponsibilityEntityPerformance } from '../../models/entity-responsibilities.model';
import { ViewType } from '../../enums/view-type.enum';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';

const positionIdMock = chance.string();
const performanceFilterStateMock: MyPerformanceFilterState = {
  metricType: MetricTypeValue.PointsOfDistribution,
  dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
  premiseType: PremiseTypeValue.On,
  distributionType: DistributionTypeValue.simple
};

describe('Responsibilities Reducer', () => {
  it('updates the status when a fetch is dispatched', () => {

    const expectedState = {
      status: ActionStatus.Fetching,
      positionId: initialState.positionId,
      responsibilities: initialState.responsibilities,
      performanceTotals: initialState.performanceTotals,
      performanceTotal: initialState.performanceTotal
    };

    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesAction({
      positionId: positionIdMock,
      filter: performanceFilterStateMock
    }));

    expect(actualState).toEqual(expectedState);
  });

  it('should store the payload when a fetch responsibilities is successful', () => {
    const roleGroupsMock = getRoleGroupsMock();
    const roleGroupPerformanceTotalsMock = getResponsibilityEntitiesPerformanceMock();

    const payloadMock = {
      positionId: positionIdMock,
      responsibilities: roleGroupsMock,
      performanceTotals: roleGroupPerformanceTotalsMock
    };

    const expectedState = {
      status: ActionStatus.Fetched,
      positionId: positionIdMock,
      responsibilities: roleGroupsMock,
      performanceTotals: roleGroupPerformanceTotalsMock,
      performanceTotal: initialState.performanceTotal
    };

    const actualState = responsibilitiesReducer(
      initialState,
      new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction(payloadMock)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update responsibilities with the selected role group\'s positions', () => {
    const mockRoleGroups = getRoleGroupsMock();
    const payload = getEntityPeopleResponsibilitiesMock().peopleType;

    const stateWithRoleGroups = {
      status: initialState.status,
      positionId: initialState.positionId,
      responsibilities: mockRoleGroups,
      performanceTotals: initialState.performanceTotals,
      performanceTotal: initialState.performanceTotal
    };

    const expectedState = {
      status: initialState.status,
      positionId: initialState.positionId,
      responsibilities: {
        [payload]: mockRoleGroups[payload]
      },
      performanceTotals: initialState.performanceTotals,
      performanceTotal: initialState.performanceTotal
    };

    const actualState = responsibilitiesReducer(stateWithRoleGroups, new ResponsibilitiesActions.GetPeopleByRoleGroupAction(payload));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      positionId: initialState.positionId,
      responsibilities: initialState.responsibilities,
      performanceTotals: initialState.performanceTotals,
      performanceTotal: initialState.performanceTotal
    };

    const actualState = responsibilitiesReducer(
      initialState,
      new ResponsibilitiesActions.FetchResponsibilitiesFailureAction(new Error())
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(responsibilitiesReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });

  it('should update the status when a FetchResponsibilityEntityPerformance action is received', () => {
    const payloadMock: FetchResponsibilityEntitiesPerformancePayload = {
      entityType: EntityPeopleType['GENERAL MANAGER'],
      entities: [getEntityPeopleResponsibilitiesMock()],
      filter: performanceFilterStateMock,
      performanceTotal: getMyPerformanceTableRowMock(1)[0],
      viewType: ViewType.people
    };
    const expectedState = {
      status: ActionStatus.Fetching,
      positionId: initialState.positionId,
      responsibilities: initialState.responsibilities,
      performanceTotals: initialState.performanceTotals,
      performanceTotal: initialState.performanceTotal
    };
    const actualState = responsibilitiesReducer(
      initialState, new ResponsibilitiesActions.FetchResponsibilityEntityPerformance(payloadMock)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state when a FetchResponsibilityEntityPerformanceSuccess action is received', () => {
    const payloadMock: ResponsibilityEntityPerformance[] = getResponsibilityEntitiesPerformanceMock();
    const expectedState = {
      status: ActionStatus.Fetched,
      positionId: initialState.positionId,
      responsibilities: initialState.responsibilities,
      performanceTotals: payloadMock,
      performanceTotal: initialState.performanceTotal
    };
    const actualState = responsibilitiesReducer(
      initialState, new ResponsibilitiesActions.FetchResponsibilityEntityPerformanceSuccess(payloadMock)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update its status when a fetch action is dispatched', () => {
    const expectedState = {
      status: ActionStatus.Fetching,
      positionId: initialState.positionId,
      responsibilities: initialState.responsibilities,
      performanceTotals: initialState.performanceTotals,
      performanceTotal: initialState.performanceTotal
    };
    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchPerformanceTotalAction({
      positionId: positionIdMock,
      filter: performanceFilterStateMock
    }));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state status and data when a fetch is successful', () => {
    const payloadMock: PerformanceTotal = getPerformanceTotalMock();
    const expectedState = {
      status: ActionStatus.Fetched,
      positionId: initialState.positionId,
      responsibilities: initialState.responsibilities,
      performanceTotals: initialState.performanceTotals,
      performanceTotal: payloadMock
    };
    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchPerformanceTotalSuccessAction(payloadMock));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the performanceTotal data when SetTableRowPerformanceTotal action is received', () => {
    const payloadMock: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
    const expectedState = {
      status: initialState.status,
      positionId: initialState.positionId,
      responsibilities: initialState.responsibilities,
      performanceTotals: initialState.performanceTotals,
      performanceTotal: {
        total: payloadMock.metricColumn0,
        totalYearAgo: payloadMock.metricColumn1,
        totalYearAgoPercent: payloadMock.metricColumn2,
        contributionToVolume: payloadMock.ctv,
        entityType: payloadMock.descriptionRow0
      }
    };
    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.SetTableRowPerformanceTotal(payloadMock));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      positionId: initialState.positionId,
      responsibilities: initialState.responsibilities,
      performanceTotals: initialState.performanceTotals,
      performanceTotal: initialState.performanceTotal
    };
    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchPerformanceTotalFailureAction(new Error()));

    expect(actualState).toEqual(expectedState);
  });

  it('should return the current state when an unknown action is dispatched', () => {
    expect(responsibilitiesReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
