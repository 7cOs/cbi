// import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilter } from './my-performance-filter.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';

// const chance = new Chance();

export function getMyPerformanceFilterMock(): MyPerformanceFilter {
  return {
    metricType: MetricTypeValue.PointsOfDistribution,
    dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
    premiseType: PremiseTypeValue.On,
    distributionType: DistributionTypeValue.simple
  };
}
