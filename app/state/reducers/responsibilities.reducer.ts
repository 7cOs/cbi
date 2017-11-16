import { ActionStatus, State } from '../../enums/action-status.enum';
import { EntityWithPerformance } from '../../models/entity-with-performance.model';
import { GroupedEntities } from '../../models/grouped-entities.model';
import { HierarchyGroup } from '../../models/hierarchy-group.model';
import { Performance } from '../../models/performance.model';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';

export interface ResponsibilitiesState extends State {
  status: ActionStatus;
  responsibilitiesStatus: ActionStatus;
  entitiesPerformanceStatus: ActionStatus;
  totalPerformanceStatus: ActionStatus;
  subaccountsStatus: ActionStatus;
  positionId: string;
  accountPositionId?: string;
  alternateHierarchyId?: string;
  exceptionHierarchy?: boolean;
  entityTypeCode?: string;
  groupedEntities: GroupedEntities;
  hierarchyGroups: Array<HierarchyGroup>;
  entityWithPerformance: EntityWithPerformance[];
  entitiesTotalPerformances: Performance;
}

export const initialState: ResponsibilitiesState = {
  status: ActionStatus.NotFetched,
  responsibilitiesStatus: ActionStatus.NotFetched,
  entitiesPerformanceStatus: ActionStatus.NotFetched,
  totalPerformanceStatus: ActionStatus.NotFetched,
  subaccountsStatus: ActionStatus.NotFetched,
  exceptionHierarchy: false,
  positionId: '0',
  groupedEntities: {},
  hierarchyGroups: [],
  entityWithPerformance: [],
  entitiesTotalPerformances: {
    total: 0,
    totalYearAgo: 0,
    totalYearAgoPercent: 0,
    contributionToVolume: 0,
    error: false
  }
};

export function responsibilitiesReducer(
  state: ResponsibilitiesState = initialState,
  action: ResponsibilitiesActions.Action
): ResponsibilitiesState {

  switch (action.type) {
    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching,
        responsibilitiesStatus: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        responsibilitiesStatus: ActionStatus.Fetched,
        positionId: action.payload.positionId,
        groupedEntities: action.payload.groupedEntities,
        hierarchyGroups: action.payload.hierarchyGroups,
        entityWithPerformance: action.payload.entityWithPerformance
      });

    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE:
      return Object.assign({}, state, {
        status: ActionStatus.Error,
        responsibilitiesStatus: ActionStatus.Error
      });

    case ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP:
      return Object.assign({}, state, {
        groupedEntities: {
          [action.payload]: state.groupedEntities[action.payload]
        }
      });

    case ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching,
        entitiesPerformanceStatus: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES_SUCCESS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        entitiesPerformanceStatus: ActionStatus.Fetched,
        entityWithPerformance: action.payload.entityWithPerformance,
        entityTypeCode: action.payload.entityTypeCode
      });

    case ResponsibilitiesActions.REFRESH_ALL_PERFORMANCES:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching,
        responsibilitiesStatus: ActionStatus.Fetching,
        totalPerformanceStatus: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching,
        totalPerformanceStatus: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE_SUCCESS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        totalPerformanceStatus: ActionStatus.Fetched,
        entitiesTotalPerformances: action.payload
      });

    case ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE_FAILURE:
      return Object.assign({}, state, {
        status: ActionStatus.Error,
        totalPerformanceStatus: ActionStatus.Error
      });

    case ResponsibilitiesActions.SET_TOTAL_PERFORMANCE:
      const selectedEntity = state.entityWithPerformance.find(entity => entity.positionId === action.payload);

      return Object.assign({}, state, {
        entitiesTotalPerformances: selectedEntity.performance
      });

    case ResponsibilitiesActions.SET_TOTAL_PERFORMANCE_FOR_SELECTED_ROLE_GROUP:
      const selectedRoleGroup = state.entityWithPerformance.find(
        (entity: EntityWithPerformance) => entity.entityTypeCode === action.payload);

      return Object.assign({}, state, {
        entitiesTotalPerformances: selectedRoleGroup.performance
      });

    case ResponsibilitiesActions.FETCH_SUBACCOUNTS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching,
        subaccountsStatus: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_SUBACCOUNTS_SUCCESS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        subaccountsStatus: ActionStatus.Fetched,
        groupedEntities: action.payload.groupedEntities,
        entityWithPerformance: action.payload.entityWithPerformance
      });

    case ResponsibilitiesActions.SET_ACCOUNT_POSITION_ID:
      return Object.assign({}, state, {
        accountPositionId: action.payload
      });

    case ResponsibilitiesActions.SET_ALTERNATE_HIERARCHY_ID:
      return Object.assign({}, state, {
        alternateHierarchyId: action.payload
      });

    case ResponsibilitiesActions.SET_EXCEPTION_HIERARCHY:
      return Object.assign({}, state, {
        exceptionHierarchy: true
      });

    case ResponsibilitiesActions.FETCH_ALTERNATE_HIERARCHY_RESPONSIBILITIES:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    default:
      return state;
  }
}
