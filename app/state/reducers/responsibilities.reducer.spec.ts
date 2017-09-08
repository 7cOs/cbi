import { ActionStatus } from '../../enums/action-status.enum';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { EntitiesPerformances } from '../../models/entities-performances.model';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { FetchResponsibilityEntitiesPerformancePayload } from '../actions/responsibilities.action';
import { initialState, responsibilitiesReducer } from './responsibilities.reducer';
import { getEntityPeopleResponsibilitiesMock } from '../../models/entity-responsibilities.model.mock';
import { getEntitiesPerformancesMock } from '../../models/entities-performances.model.mock';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getEntitiesTotalPerformancesMock } from '../../models/entities-total-performances.model.mock';
import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { EntitiesTotalPerformances } from '../../models/entities-total-performances.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
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
      entitiesPerformances: initialState.entitiesPerformances,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };

    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchResponsibilitiesAction({
      positionId: positionIdMock,
      filter: performanceFilterStateMock
    }));

    expect(actualState).toEqual(expectedState);
  });

  it('should store the payload when a fetch responsibilities is successful', () => {
    const groupedEntitiesMock = getGroupedEntitiesMock();
    const entitiesPerformancesMock = getEntitiesPerformancesMock();

    const payloadMock = {
      positionId: positionIdMock,
      groupedEntities: groupedEntitiesMock,
      entitiesPerformances: entitiesPerformancesMock
    };

    const expectedState = {
      status: ActionStatus.Fetched,
      positionId: positionIdMock,
      groupedEntities: groupedEntitiesMock,
      entitiesPerformances: entitiesPerformancesMock,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };

    const actualState = responsibilitiesReducer(
      initialState,
      new ResponsibilitiesActions.FetchResponsibilitiesSuccessAction(payloadMock)
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
      entitiesPerformances: initialState.entitiesPerformances,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };

    const expectedState = {
      status: initialState.status,
      positionId: initialState.positionId,
      groupedEntities: {
        [payload]: groupedEntitiesMock[payload]
      },
      entitiesPerformances: initialState.entitiesPerformances,
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
      entitiesPerformances: initialState.entitiesPerformances,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
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
      entitiesTotalPerformances: getMyPerformanceTableRowMock(1)[0],
      viewType: ViewType.people
    };
    const expectedState = {
      status: ActionStatus.Fetching,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      entitiesPerformances: initialState.entitiesPerformances,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };
    const actualState = responsibilitiesReducer(
      initialState, new ResponsibilitiesActions.FetchResponsibilityEntityPerformance(payloadMock)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state when a FetchResponsibilityEntityPerformanceSuccess action is received', () => {
    const payloadMock: EntitiesPerformances[] = getEntitiesPerformancesMock();
    const expectedState = {
      status: ActionStatus.Fetched,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      entitiesPerformances: payloadMock,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
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
      groupedEntities: initialState.groupedEntities,
      entitiesPerformances: initialState.entitiesPerformances,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };
    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchPerformanceTotalAction({
      positionId: positionIdMock,
      filter: performanceFilterStateMock
    }));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state status and data when a fetch is successful', () => {
    const payloadMock: EntitiesTotalPerformances = getEntitiesTotalPerformancesMock();
    const expectedState = {
      status: ActionStatus.Fetched,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      entitiesPerformances: initialState.entitiesPerformances,
      entitiesTotalPerformances: payloadMock
    };
    const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.FetchPerformanceTotalSuccessAction(payloadMock));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the performanceTotal data when SetTableRowPerformanceTotal action is received', () => {
    const payloadMock: MyPerformanceTableRow = getMyPerformanceTableRowMock(1)[0];
    const expectedState = {
      status: initialState.status,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      entitiesPerformances: initialState.entitiesPerformances,
      entitiesTotalPerformances: {
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
      groupedEntities: initialState.groupedEntities,
      entitiesPerformances: initialState.entitiesPerformances,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
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
