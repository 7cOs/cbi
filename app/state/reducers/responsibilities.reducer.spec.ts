import { ActionStatus } from '../../enums/action-status.enum';
import { EntitiesPerformances } from '../../models/entities-performances.model';
import { EntitiesTotalPerformances } from '../../models/entities-total-performances.model';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { FetchResponsibilityEntitiesPerformancePayload } from '../actions/responsibilities.action';
import { initialState, responsibilitiesReducer } from './responsibilities.reducer';
import { getEntityPeopleResponsibilitiesMock } from '../../models/entity-responsibilities.model.mock';
import { getEntitiesPerformancesMock } from '../../models/entities-performances.model.mock';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getEntitiesTotalPerformancesMock } from '../../models/entities-total-performances.model.mock';
import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { ResponsibilitiesState } from './responsibilities.reducer';
import { ViewType } from '../../enums/view-type.enum';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';

const positionIdMock = chance.string();
const performanceFilterStateMock: MyPerformanceFilterState = getMyPerformanceFilterMock();

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
      selectedPositionId: getMyPerformanceTableRowMock(1)[0].metadata.positionId,
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
    const selectedRowMock = getMyPerformanceTableRowMock(1)[0];
    const payloadMock: string = selectedRowMock.metadata.positionId;
    const mockState: ResponsibilitiesState = Object.assign({}, initialState, {
      entitiesPerformances: [{
        positionId: payloadMock,
        name: selectedRowMock.descriptionRow0,
        performanceTotal: {
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
      entitiesPerformances: mockState.entitiesPerformances,
      entitiesTotalPerformances: {
        total: selectedRowMock.metricColumn0,
        totalYearAgo: selectedRowMock.metricColumn1,
        totalYearAgoPercent: selectedRowMock.metricColumn2,
        contributionToVolume: selectedRowMock.ctv,
        name: selectedRowMock.descriptionRow0
      }
    };
    const actualState = responsibilitiesReducer(mockState, new ResponsibilitiesActions.SetTableRowPerformanceTotal(payloadMock));

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
