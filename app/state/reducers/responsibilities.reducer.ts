import { ActionStatus, State } from '../../enums/action-status.enum';
import { RoleGroups, RoleGroupPerformanceTotal } from '../../models/role-groups.model';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';

export interface ResponsibilitiesState extends State {
  status: ActionStatus;
  positionId: string;
  responsibilities: RoleGroups;
  performanceTotals: Array<RoleGroupPerformanceTotal>;
}

export const initialState: ResponsibilitiesState = {
  status: ActionStatus.NotFetched,
  positionId: '0',
  responsibilities: {},
  performanceTotals: []
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

    default:
      return state;
  }
}
