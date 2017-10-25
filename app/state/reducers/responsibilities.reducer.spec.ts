import { ActionStatus } from '../../enums/action-status.enum';
import { EntityPeopleType, EntityType } from '../../enums/entity-responsibilities.enum';
import { FetchEntityWithPerformancePayload, FetchEntityWithPerformanceSuccessPayload } from '../actions/responsibilities.action';
import { getEntityPeopleResponsibilitiesMock } from '../../models/hierarchy-entity.model.mock';
import { getEntitiesWithPerformancesMock } from '../../models/entity-with-performance.model.mock';
import { getHierarchyGroupMock } from '../../models/hierarchy-group.model.mock';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getPerformanceMock } from '../../models/performance.model.mock';
import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
import { initialState, responsibilitiesReducer } from './responsibilities.reducer';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { Performance } from '../../models/performance.model';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';
import { ResponsibilitiesState } from './responsibilities.reducer';

const positionIdMock = chance.string();
const entityTypeCodeMock = chance.string();
const performanceFilterStateMock: MyPerformanceFilterState = getMyPerformanceFilterMock();

describe('Responsibilities Reducer', () => {
  it('updates the status when a fetch is dispatched', () => {

    const expectedState = {
      status: ActionStatus.Fetching,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      hierarchyGroups: initialState.hierarchyGroups,
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
    const hierarchyGroupsMock = Array(chance.natural({min: 1, max: 9})).fill('').map(() => getHierarchyGroupMock());
    const entityWithPerformanceMock = getEntitiesWithPerformancesMock();

    const payloadMock = {
      positionId: positionIdMock,
      groupedEntities: groupedEntitiesMock,
      hierarchyGroups: hierarchyGroupsMock,
      entityWithPerformance: entityWithPerformanceMock
    };

    const expectedState = {
      status: ActionStatus.Fetched,
      positionId: positionIdMock,
      groupedEntities: groupedEntitiesMock,
      hierarchyGroups: hierarchyGroupsMock,
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
    const payload = EntityPeopleType['Market Development Manager'];

    const stateWithGroupedEntities = {
      status: initialState.status,
      positionId: initialState.positionId,
      groupedEntities: groupedEntitiesMock,
      hierarchyGroups: initialState.hierarchyGroups,
      entityWithPerformance: initialState.entityWithPerformance,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };

    const expectedState = {
      status: initialState.status,
      positionId: initialState.positionId,
      groupedEntities: {
        [payload]: groupedEntitiesMock[payload]
      },
      hierarchyGroups: initialState.hierarchyGroups,
      entityWithPerformance: initialState.entityWithPerformance,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };

    const actualState = responsibilitiesReducer(stateWithGroupedEntities, new ResponsibilitiesActions.GetPeopleByRoleGroup(payload));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      hierarchyGroups: initialState.hierarchyGroups,
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
      entityTypeGroupName: EntityPeopleType['GENERAL MANAGER'],
      entityTypeCode: entityTypeCodeMock,
      entities: [getEntityPeopleResponsibilitiesMock()],
      filter: performanceFilterStateMock,
      positionId: getMyPerformanceTableRowMock(1)[0].metadata.positionId,
      entityType: EntityType.Person
    };
    const expectedState = {
      status: ActionStatus.Fetching,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      hierarchyGroups: initialState.hierarchyGroups,
      entityWithPerformance: initialState.entityWithPerformance,
      entitiesTotalPerformances: initialState.entitiesTotalPerformances
    };
    const actualState = responsibilitiesReducer(
      initialState, new ResponsibilitiesActions.FetchEntityWithPerformance(payloadMock)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state when a FetchEntityWithPerformanceSuccess action is received', () => {
    const payloadMock: FetchEntityWithPerformanceSuccessPayload = {
      entityWithPerformance: getEntitiesWithPerformancesMock(),
      entityTypeCode: entityTypeCodeMock
    };
    const expectedState = {
      status: ActionStatus.Fetched,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      hierarchyGroups: initialState.hierarchyGroups,
      entityWithPerformance: payloadMock.entityWithPerformance,
      entityTypeCode: payloadMock.entityTypeCode,
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
      hierarchyGroups: initialState.hierarchyGroups,
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
      hierarchyGroups: initialState.hierarchyGroups,
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
          name: selectedRowMock.descriptionRow0,
          error: false
        }
      }]
    });

    const expectedState: ResponsibilitiesState = {
      status: mockState.status,
      positionId: mockState.positionId,
      groupedEntities: mockState.groupedEntities,
      hierarchyGroups: mockState.hierarchyGroups,
      entityWithPerformance: mockState.entityWithPerformance,
      entitiesTotalPerformances: {
        total: selectedRowMock.metricColumn0,
        totalYearAgo: selectedRowMock.metricColumn1,
        totalYearAgoPercent: selectedRowMock.metricColumn2,
        contributionToVolume: selectedRowMock.ctv,
        name: selectedRowMock.descriptionRow0,
        error: false
      }
    };
    const actualState = responsibilitiesReducer(mockState, new ResponsibilitiesActions.SetTotalPerformance(payloadMock));

    expect(actualState).toEqual(expectedState);
  });

  it('should update the performance data when SetTotalPerformanceForSelectedRoleGroup action is received', () => {
    const selectedRowMock = getMyPerformanceTableRowMock(1)[0];
    const payloadMock: string = selectedRowMock.metadata.entityTypeCode;
    const mockState: ResponsibilitiesState = Object.assign({}, initialState, {
      entityWithPerformance: [{
        positionId: positionIdMock,
        entityTypeCode: payloadMock,
        name: selectedRowMock.descriptionRow0,
        performance: {
          total: selectedRowMock.metricColumn0,
          totalYearAgo: selectedRowMock.metricColumn1,
          totalYearAgoPercent: selectedRowMock.metricColumn2,
          contributionToVolume: selectedRowMock.ctv,
          name: selectedRowMock.descriptionRow0,
          error: false
        }
      }]
    });

    const expectedState: ResponsibilitiesState = {
      status: mockState.status,
      positionId: mockState.positionId,
      groupedEntities: mockState.groupedEntities,
      hierarchyGroups: mockState.hierarchyGroups,
      entityWithPerformance: mockState.entityWithPerformance,
      entitiesTotalPerformances: {
        total: selectedRowMock.metricColumn0,
        totalYearAgo: selectedRowMock.metricColumn1,
        totalYearAgoPercent: selectedRowMock.metricColumn2,
        contributionToVolume: selectedRowMock.ctv,
        name: selectedRowMock.descriptionRow0,
        error: false
      }
    };
    const actualState = responsibilitiesReducer(
      mockState,
      new ResponsibilitiesActions.SetTotalPerformanceForSelectedRoleGroup(payloadMock)
    );

    expect(actualState).toEqual(expectedState);
  });

  it('should update the state status when a fetch fails', () => {
    const expectedState = {
      status: ActionStatus.Error,
      positionId: initialState.positionId,
      groupedEntities: initialState.groupedEntities,
      hierarchyGroups: initialState.hierarchyGroups,
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

  describe('SetAlternateHierarchyId action is received', () => {
    it('should update the responsibilities state to hold the entry point id for alternate hierarchy', () => {
      const payloadMock: string = chance.string();
      const expectedState: ResponsibilitiesState = {
        status: initialState.status,
        positionId: initialState.positionId,
        alternateHierarchyId: payloadMock,
        groupedEntities: initialState.groupedEntities,
        hierarchyGroups: initialState.hierarchyGroups,
        entityWithPerformance: initialState.entityWithPerformance,
        entitiesTotalPerformances: initialState.entitiesTotalPerformances
      };
      const actualState = responsibilitiesReducer(initialState, new ResponsibilitiesActions.SetAlternateHierarchyId(payloadMock));

      expect(actualState).toEqual(expectedState);
    });
  });
});
