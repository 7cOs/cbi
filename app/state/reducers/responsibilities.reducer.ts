import { ActionStatus, State } from '../../enums/action-status.enum';
import { PerformanceTotal } from '../../models/performance-total.model';
import { ResponsibilityEntityPerformance } from '../../models/entity-responsibilities.model';
import { RoleGroups } from '../../models/role-groups.model';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';

export interface ResponsibilitiesState extends State {
  status: ActionStatus;
  positionId: string;
  responsibilities: RoleGroups;
  performanceTotals: ResponsibilityEntityPerformance[];
  performanceTotal: PerformanceTotal;
}

export const initialState: ResponsibilitiesState = {
  status: ActionStatus.NotFetched,
  positionId: '0',
  responsibilities: {},
  performanceTotals: [],
  performanceTotal: {
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
        responsibilities: action.payload.responsibilities,
        performanceTotals: action.payload.performanceTotals
      });

    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    case ResponsibilitiesActions.GET_PEOPLE_BY_ROLE_GROUP_ACTION:
      return Object.assign({}, state, {
        responsibilities: {
          [action.payload]: state.responsibilities[action.payload]
        }
      });

    case ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_RESPONSIBILITY_ENTITY_PERFORMANCE_SUCCESS:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        performanceTotals: action.payload
      });

    case ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Fetched,
        performanceTotal: action.payload
      }); // TODO: Make sure that we are setting the flag to fetched only when we should. Maybe that should be a different action? YEAH!

    case ResponsibilitiesActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    case ResponsibilitiesActions.SET_TABLE_ROW_PERFORMANCE_TOTAL:
      return Object.assign({}, state, {
        performanceTotal: {
          total: action.payload.metricColumn0,
          totalYearAgo: action.payload.metricColumn1,
          totalYearAgoPercent: action.payload.metricColumn2,
          contributionToVolume: action.payload.ctv,
          entityType: action.payload.descriptionRow0
        }
      });

    default:
      return state;
  }
}
