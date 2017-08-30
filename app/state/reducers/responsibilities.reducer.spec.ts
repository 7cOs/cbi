import { ActionStatus } from '../../enums/action-status.enum';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { initialState, responsibilitiesReducer } from './responsibilities.reducer';
import { getEntityPeopleResponsibilitiesMock,
         getResponsibilityEntitiesPerformanceMock } from '../../models/entity-responsibilities.model.mock';
import { getRoleGroupsMock } from '../../models/role-groups.model.mock';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';

describe('Responsibilities Reducer', () => {

  it('updates the status when a fetch is dispatched', () => {
    const positionIdMock = 1;
    const performanceFilterStateMock: MyPerformanceFilterState = {
      metricType: MetricTypeValue.PointsOfDistribution,
      dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
      premiseType: PremiseTypeValue.On,
      distributionType: DistributionTypeValue.simple
    };
    const expectedState = {
      status: ActionStatus.Fetching,
      positionId: initialState.positionId,
      responsibilities: initialState.responsibilities,
      performanceTotals: initialState.performanceTotals
    };

    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesAction({
      positionId: positionIdMock,
      filter: performanceFilterStateMock
    }));

    expect(actualState).toEqual(expectedState);
  });

  it('should store the payload when a fetch responsibilities is successful', () => {
    const positionIdMock = 1;
    const mockRoleGroups = getRoleGroupsMock();
    const mockRoleGroupPerformanceTotals = getResponsibilityEntitiesPerformanceMock();

    const mockPayload = {
      positionId: positionIdMock,
      responsibilities: mockRoleGroups,
      performanceTotals: mockRoleGroupPerformanceTotals
    };

    const expectedState = {
      status: ActionStatus.Fetched,
      positionId: positionIdMock,
      responsibilities: mockRoleGroups,
      performanceTotals: mockRoleGroupPerformanceTotals
    };

    const actualState = responsibilitiesReducer(
      initialState,
      new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction(mockPayload)
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
      performanceTotals: initialState.performanceTotals
    };

    const expectedState = {
      status: initialState.status,
      positionId: initialState.positionId,
      responsibilities: {
        [payload]: mockRoleGroups[payload]
      },
      performanceTotals: initialState.performanceTotals
    };

    const actualState = responsibilitiesReducer(stateWithRoleGroups, new ResponsibilitiesActions.GetPeopleByRoleGroupAction(payload));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      positionId: initialState.positionId,
      responsibilities: initialState.responsibilities,
      performanceTotals: initialState.performanceTotals
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
});
