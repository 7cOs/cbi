import { ActionStatus, State } from '../../enums/action-status.enum';
import { PerformanceTotal } from '../../models/performance-total.model';
import * as PerformanceTotalActions from '../actions/performance-total.action';

export interface PerformanceTotalState extends State {
  status: ActionStatus;
  performanceTotal: PerformanceTotal;
}

export const initialState: PerformanceTotalState = {
  status: ActionStatus.NotFetched,
  performanceTotal: {
    total: 0,
    totalYearAgo: 0,
    totalYearAgoPercent: 0,
    contributionToVolume: 0
  }
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

    case PerformanceTotalActions.SET_TABLE_ROW_PERFORMANCE_TOTAL:
      console.log('SET TABLE ROW REDUCER', action.payload);
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
