import * as MyPerformanceFilterActions from '../actions/my-performance-filter.action';
import { MyPerformanceFilter } from '../../models/my-performance-filter.model';

export interface MyPerformanceFilterState extends MyPerformanceFilter {}

export const initialState: MyPerformanceFilterState = {
  metric: 'DEPLETIONS',
  timePeriod: 'CYTDBDL',
  premiseType: 'ALL',
  distributionType: 'SIMPLE'
};

export function myPerformanceFilterReducer(
  state: MyPerformanceFilterState = initialState,
  action: MyPerformanceFilterActions.Action
): MyPerformanceFilterState {

  switch (action.type) {

    case MyPerformanceFilterActions.SET_METRIC:
      return Object.assign({}, state, {
        metric: action.payload,
        timePeriod: action.payload === 'DEPLETIONS' ? 'CYTDBDL' : 'L90BDL'
      });

    case MyPerformanceFilterActions.SET_TIME_PERIOD:
      return Object.assign({}, state, {
        timePeriod: action.payload
      });

    case MyPerformanceFilterActions.SET_PREMISE_TYPE:
      return Object.assign({}, state, {
        premiseType: action.payload
      });

    case MyPerformanceFilterActions.SET_DISTRIBUTION_TYPE:
      return Object.assign({}, state, {
        distributionType: action.payload
      });

    default:
      return state;
  }
}
