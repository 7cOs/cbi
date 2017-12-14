import * as MyPerformanceFilterActions from '../actions/my-performance-filter.action';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceFilter } from '../../models/my-performance-filter.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';

export interface MyPerformanceFilterState extends MyPerformanceFilter {}

export const initialState: MyPerformanceFilterState = {
  metricType: MetricTypeValue.volume,
  dateRangeCode: DateRangeTimePeriodValue.CYTDBDL,
  premiseType: PremiseTypeValue.All
};

export function myPerformanceFilterReducer(
  state: MyPerformanceFilterState = initialState,
  action: MyPerformanceFilterActions.Action
): MyPerformanceFilterState {

  switch (action.type) {

    case MyPerformanceFilterActions.SET_METRIC:
      const newState: MyPerformanceFilterState = {
        metricType: action.payload,
        dateRangeCode: action.payload === MetricTypeValue.volume ? DateRangeTimePeriodValue.CYTDBDL : DateRangeTimePeriodValue.L90BDL,
        premiseType: action.payload === MetricTypeValue.volume ? PremiseTypeValue.All : PremiseTypeValue.Off
      };

      if (action.payload === MetricTypeValue.PointsOfDistribution) newState.distributionType = DistributionTypeValue.simple;

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

    case MyPerformanceFilterActions.SET_METRIC_AND_PREMISE_TYPE:
      const filterState: MyPerformanceFilterState = {
        metricType: action.payload.metricType,
        dateRangeCode: action.payload.metricType === MetricTypeValue.volume
          ? DateRangeTimePeriodValue.CYTDBDL
          : DateRangeTimePeriodValue.L90BDL,
        premiseType: action.payload.premiseType
      };

      if (action.payload.metricType === MetricTypeValue.PointsOfDistribution) filterState.distributionType = DistributionTypeValue.simple;

      return filterState;

    default:
      return state;
  }
}
