import { ActionStatus, State } from '../../enums/action-status.enum';
import { RoleGroups } from '../../models/role-groups.model';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';

export interface ResponsibilitiesState extends State {
  status: ActionStatus;
  responsibilities: RoleGroups;
}

export const initialState: ResponsibilitiesState = {
  status: ActionStatus.NotFetched,
  responsibilities: {}
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
      return {
        status: ActionStatus.Fetched,
        responsibilities: action.payload
      };

    case ResponsibilitiesActions.FETCH_RESPONSIBILITIES_FAILURE_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    default:
      return state;
  }
}
