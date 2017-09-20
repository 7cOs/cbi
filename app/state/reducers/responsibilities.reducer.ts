import { ActionStatus, State } from '../../enums/action-status.enum';
import { EntitiesPerformances } from '../../models/entities-performances.model';
import { EntitiesTotalPerformances } from '../../models/entities-total-performances.model';
import { GroupedEntities } from '../../models/grouped-entities.model';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';

export interface ResponsibilitiesState extends State {
  status: ActionStatus;
  positionId: string;
  groupedEntities: GroupedEntities;
  entitiesPerformances: EntitiesPerformances[];
  entitiesTotalPerformances: EntitiesTotalPerformances;
}

export const initialState: ResponsibilitiesState = {
  status: ActionStatus.NotFetched,
  positionId: '0',
  groupedEntities: {},
  entitiesPerformances: [],
  entitiesTotalPerformances: {
    total: 0,
    totalYearAgo: 0,
    totalYearAgoPercent: 0,
    contributionToVolume: 0
  }
};

export function responsibilitiesReducer(
  state: ResponsibilitiesState = initialState,
  action: ResponsibilitiesActions.Action
): ResponsibilitiesState {

  switch (action.type) {
    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_SUCCESS_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        positionId: action.payload.positionId,
        groupedEntities: action.payload.groupedEntities,
        entitiesPerformances: action.payload.entitiesPerformances
      });

    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    case ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP_ACTION:
      return Object.assign({}, state, {
        groupedEntities: {
          [action.payload]: state.groupedEntities[action.payload]
        }
      });

    case ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE_SUCCESS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        entitiesPerformances: action.payload
      });

    case ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        entitiesTotalPerformances: action.payload
      });

    case ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    case ResponsibilitiesActions.SET_TABLE_ROW_PERFORMANCE_TOTAL:
      const selectedEntity = state.entitiesPerformances.filter(entity => entity.positionId === action.payload)[0];

      return Object.assign({}, state, {
        entitiesTotalPerformances: selectedEntity.performanceTotal
      });

    default:
      return state;
  }
}
