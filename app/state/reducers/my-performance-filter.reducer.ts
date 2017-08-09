import * as MyPerformanceFilterActions from '../actions/my-performance-filter.action';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { MetricValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilter } from '../../models/my-performance-filter.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';

export interface MyPerformanceFilterState extends MyPerformanceFilter {}

export const initialState: MyPerformanceFilterState = {
  metricType: MetricValue.DEPLETIONS,
  dateRangeCode: DateRangeTimePeriodValue.CYTDBDL,
  premiseType: PremiseTypeValue.ALL
};

export function myPerformanceFilterReducer(
  state: MyPerformanceFilterState = initialState,
  action: MyPerformanceFilterActions.Action
): MyPerformanceFilterState {

  switch (action.type) {

    case MyPerformanceFilterActions.SET_METRIC:
      const newState = {
        metricType: action.payload,
        dateRangeCode: action.payload === MetricValue.DEPLETIONS ? DateRangeTimePeriodValue.CYTDBDL : DateRangeTimePeriodValue.L90BDL,
        premiseType: action.payload === MetricValue.DEPLETIONS ? PremiseTypeValue.ALL : PremiseTypeValue.OFF
      };

      if (action.payload === MetricValue.DISTRIBUTION) newState['distributionType'] = DistributionTypeValue.SIMPLE;

      return newState;

    case MyPerformanceFilterActions.SET_TIME_PERIOD:
      return Object.assign({}, state, {
        dateRangeCode: action.payload
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
