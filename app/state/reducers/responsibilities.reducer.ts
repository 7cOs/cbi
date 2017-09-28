import { ActionStatus, State } from '../../enums/action-status.enum';
import { EntityWithPerformance } from '../../models/entity-with-performance.model';
import { Performance } from '../../models/performance.model';
import { GroupedEntities } from '../../models/grouped-entities.model';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';

export interface ResponsibilitiesState extends State {
  status: ActionStatus;
  positionId: string;
  groupedEntities: GroupedEntities;
  entityWithPerformance: EntityWithPerformance[];
  entitiesTotalPerformances: Performance;
}

export const initialState: ResponsibilitiesState = {
  status: ActionStatus.NotFetched,
  positionId: '0',
  groupedEntities: {},
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
        status: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        positionId: action.payload.positionId,
        groupedEntities: action.payload.groupedEntities,
        entityWithPerformance: action.payload.entityWithPerformance
      });

    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    case ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP_ACTION:
      return Object.assign({}, state, {
        groupedEntities: {
          [action.payload]: state.groupedEntities[action.payload]
        }
      });

    case ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_ENTITIES_PERFORMANCES_SUCCESS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        entityWithPerformance: action.payload
      });

    case ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE_SUCCESS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        entitiesTotalPerformances: action.payload
      });

    case ResponsibilitiesActions.FETCH_TOTAL_PERFORMANCE_FAILURE:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    case ResponsibilitiesActions.SET_TOTAL_PERFORMANCE:
      const selectedEntity = state.entityWithPerformance.find(entity => entity.positionId === action.payload);

      return Object.assign({}, state, {
        entitiesTotalPerformances: selectedEntity.performance
      });

    case ResponsibilitiesActions.FETCH_SUBACCOUNTS_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_SUBACCOUNTS_SUCCESS_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        groupedEntities: action.payload.groupedEntities,
        entityWithPerformance: action.payload.entityWithPerformance
      });

    default:
      return state;
  }
}
