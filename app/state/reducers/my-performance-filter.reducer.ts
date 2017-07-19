import * as MyPerformanceFilterActions from '../actions/my-performance-filter.action';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { MetricValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilter } from '../../models/my-performance-filter.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';

export interface MyPerformanceFilterState extends MyPerformanceFilter {}

export const initialState: MyPerformanceFilterState = {
  metric: MetricValue.DEPLETIONS,
  timePeriod: DateRangeTimePeriodValue.CYTDBDL,
  premiseType: PremiseTypeValue.ALL,
  distributionType: DistributionTypeValue.SIMPLE
};

export function myPerformanceFilterReducer(
  state: MyPerformanceFilterState = initialState,
  action: MyPerformanceFilterActions.Action
): MyPerformanceFilterState {

  switch (action.type) {

    case MyPerformanceFilterActions.SET_METRIC:
      return Object.assign({}, state, {
        metric: action.payload,
        timePeriod: action.payload === MetricValue.DEPLETIONS ? DateRangeTimePeriodValue.CYTDBDL : DateRangeTimePeriodValue.L90BDL,
        premiseType: action.payload === MetricValue.DEPLETIONS ? PremiseTypeValue.ALL : PremiseTypeValue.OFF,
        distributionType: DistributionTypeValue.SIMPLE
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
