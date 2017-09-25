import { ActionStatus } from '../../enums/action-status.enum';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { EntityWithPerformance } from '../../models/entities-performances.model';
import { Performance } from '../../models/performance.model';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { FetchEntityWithPerformancePayload } from '../actions/responsibilities.action';
import { initialState, responsibilitiesReducer } from './responsibilities.reducer';
import { getEntityPeopleResponsibilitiesMock } from '../../models/hierarchy-entity.model.mock';
import { getEntitiesWithPerformancesMock } from '../../models/entities-performances.model.mock';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getPerformanceMock } from '../../models/performance.model.mock';
import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { ResponsibilitiesState } from './responsibilities.reducer';
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
      groupedEntities: initialState.groupedEntities,
      entityWithPerformance: initialState.entityWithPerformance,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };

    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchResponsibilities({
      positionId: positionIdMock,
      filter: performanceFilterStateMock
    }));

    expect(actualState).toEqual(expectedState);
  });

  it('should store the payload when a fetch responsibilities is successful', () => {
    const groupedEntitiesMock = getGroupedEntitiesMock();
    const entityWithPerformanceMock = getEntitiesWithPerformancesMock();

    const payloadMock = {
      positionId: positionIdMock,
      groupedEntities: groupedEntitiesMock,
      entityWithPerformance: entityWithPerformanceMock
    };

    const expectedState = {
      status: ActionStatus.Fetched,
      positionId: positionIdMock,
      groupedEntities: groupedEntitiesMock,
      entityWithPerformance: entityWithPerformanceMock,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };

    const actualState = responsibilitiesReducer(
      initialState,
      new ResponsibilitiesActions.FetchResponsibilitiesSuccess(payloadMock)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update responsibilities with the selected role group\'s positions', () => {
    const groupedEntitiesMock = getGroupedEntitiesMock();
    const payload = getEntityPeopleResponsibilitiesMock().peopleType;

    const stateWithGroupedEntities = {
      status: initialState.status,
      positionId: initialState.positionId,
      groupedEntities: groupedEntitiesMock,
      entityWithPerformance: initialState.entityWithPerformance,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };

    const expectedState = {
      status: initialState.status,
      positionId: initialState.positionId,
      groupedEntities: {
        [payload]: groupedEntitiesMock[payload]
      },
      entityWithPerformance: initialState.entityWithPerformance,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };

    const actualState = responsibilitiesReducer(stateWithGroupedEntities, new ResponsibilitiesActions.GetPeopleByRoleGroupAction(payload));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      entityWithPerformance: initialState.entityWithPerformance,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };

    const actualState = responsibilitiesReducer(
      initialState,
      new ResponsibilitiesActions.FetchResponsibilitiesFailure(new Error())
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should return current state when an unknown action is dispatched', () => {
    expect(responsibilitiesReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });

  it('should update the status when a FetchEntityWithPerformance action is received', () => {
    const payloadMock: FetchEntityWithPerformancePayload = {
      entityType: EntityPeopleType['GENERAL MANAGER'],
      entities: [getEntityPeopleResponsibilitiesMock()],
      filter: performanceFilterStateMock,
      selectedPositionId: getMyPerformanceTableRowMock(1)[0].metadata.positionId,
      viewType: ViewType.people
    };
    const expectedState = {
      status: ActionStatus.Fetching,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      entityWithPerformance: initialState.entityWithPerformance,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };
    const actualState = responsibilitiesReducer(
      initialState, new ResponsibilitiesActions.FetchEntityWithPerformance(payloadMock)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state when a FetchEntityWithPerformanceSuccess action is received', () => {
    const payloadMock: EntityWithPerformance[] = getEntitiesWithPerformancesMock();
    const expectedState = {
      status: ActionStatus.Fetched,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      entityWithPerformance: payloadMock,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };
    const actualState = responsibilitiesReducer(
      initialState, new ResponsibilitiesActions.FetchEntityWithPerformanceSuccess(payloadMock)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update its status when a fetch action is dispatched', () => {
    const expectedState = {
      status: ActionStatus.Fetching,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      entityWithPerformance: initialState.entityWithPerformance,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };
    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchTotalPerformance({
      positionId: positionIdMock,
      filter: performanceFilterStateMock
    }));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state status and data when a fetch is successful', () => {
    const payloadMock: Performance = getPerformanceMock();
    const expectedState = {
      status: ActionStatus.Fetched,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      entityWithPerformance: initialState.entityWithPerformance,
      entitiesTotalPerformances: payloadMock
    };
    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchTotalPerformanceSuccess(payloadMock));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the performance data when SetTotalPerformance action is received', () => {
    const selectedRowMock = getMyPerformanceTableRowMock(1)[0];
    const payloadMock: string = selectedRowMock.metadata.positionId;
    const mockState: ResponsibilitiesState = Object.assign({}, initialState, {
      entityWithPerformance: [{
        positionId: payloadMock,
        name: selectedRowMock.descriptionRow0,
        performance: {
          total: selectedRowMock.metricColumn0,
          totalYearAgo: selectedRowMock.metricColumn1,
          totalYearAgoPercent: selectedRowMock.metricColumn2,
          contributionToVolume: selectedRowMock.ctv,
          name: selectedRowMock.descriptionRow0
        }
      }]
    });

    const expectedState: ResponsibilitiesState = {
      status: mockState.status,
      positionId: mockState.positionId,
      groupedEntities: mockState.groupedEntities,
      entityWithPerformance: mockState.entityWithPerformance,
      entitiesTotalPerformances: {
        total: selectedRowMock.metricColumn0,
        totalYearAgo: selectedRowMock.metricColumn1,
        totalYearAgoPercent: selectedRowMock.metricColumn2,
        contributionToVolume: selectedRowMock.ctv,
        name: selectedRowMock.descriptionRow0
      }
    };
    const actualState = responsibilitiesReducer(mockState, new ResponsibilitiesActions.SetTotalPerformance(payloadMock));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      entityWithPerformance: initialState.entityWithPerformance,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };
    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchTotalPerformanceFailure(new Error()));

    expect(actualState).toEqual(expectedState);
  });

  it('should return the current state when an unknown action is dispatched', () => {
    expect(responsibilitiesReducer(
      initialState,
      { type: 'UNKNOWN_ACTION' } as any
    )).toBe(initialState);
  });
});
