import { ActionStatus, State } from '../../enums/action-status.enum';
import * as PerformanceTotalActions from '../actions/performance-total.action';

export interface PerformanceTotalState extends State {
  status: ActionStatus;
  total: number;
  totalYearAgo: number;
  contributionToVolume: number;
}

export const initialState: PerformanceTotalState = {
  status: ActionStatus.NotFetched,
  total: 0,
  totalYearAgo: 0,
  contributionToVolume: 0
};

export function performanceTotalReducer(
  state: PerformanceTotalState = initialState,
  action: PerformanceTotalActions.Action
): PerformanceTotalState {

  switch (action.type) {
    case PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Fetching
      });

    case PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_SUCCESS_ACTION:
      return {
        status: ActionStatus.Fetched,
        total: action.payload.total,
        totalYearAgo: action.payload.totalYearAgo,
        contributionToVolume: action.payload.contributionToVolume
      };

    case PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    default:
      return state;
  }
}
