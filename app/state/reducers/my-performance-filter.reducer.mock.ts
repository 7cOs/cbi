import { MyPerformanceFilterState } from './my-performance-filter.reducer';
import { getDateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum.mock';
import { getMetricValue } from '../../enums/metric-type.enum.mock';
import { getPremiseTypeValue } from '../../enums/premise-type.enum.mock';
import { getDistributionTypeValue } from '../../enums/distribution-type.enum.mock';

export function getMyPerformanceFilterStateMock(): MyPerformanceFilterState {
  return {
    metric: getMetricValue(),
    timePeriod: getDateRangeTimePeriodValue(),
    premiseType: getPremiseTypeValue(),
    distributionType: getDistributionTypeValue()
  };
}
