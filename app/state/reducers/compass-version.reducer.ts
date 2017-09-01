import * as CompassVersionActions from '../actions/compass-version.action';
import { ActionStatus, State } from '../../enums/action-status.enum';
import { AppVersion } from '../../models/app-version.model';

export interface CompassVersionState extends State {
  version: AppVersion;
}

export const initialState: CompassVersionState = {
  status: ActionStatus.NotFetched,
  version: {
    hash: '-',
    version: '0.0.0'
  }
};

export function compassVersionReducer(
  state: CompassVersionState = initialState,
  action: CompassVersionActions.Action
): CompassVersionState {
  switch (action.type) {

    case CompassVersionActions.FETCH_VERSION_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case CompassVersionActions.FETCH_VERSION_SUCCESS_ACTION:
      return {
        status: ActionStatus.Fetched,
        version: action.payload
      };

    case CompassVersionActions.FETCH_VERSION_FAILURE_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    default:
      return state;
  }
}
