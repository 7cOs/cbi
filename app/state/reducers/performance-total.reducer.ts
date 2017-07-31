import { ActionStatus, State } from '../../enums/action-status.enum';
import { PerformanceTotal } from '../../models/performance-total.model';
import * as PerformanceTotalActions from '../actions/performance-total.action';

export interface PerformanceTotalState extends State {
  status: ActionStatus;
  performanceTotal: PerformanceTotal;
}

export const initialState: PerformanceTotalState = {
  status: ActionStatus.NotFetched,
  performanceTotal: {}
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
        performanceTotal: action.payload
      };

    case PerformanceTotalActions.FETCH_PERFORMANCE_TOTAL_FAILURE_ACTION:
      return Object.assign({}, state, {
        status: ActionStatus.Error
      });

    default:
      return state;
  }
}
