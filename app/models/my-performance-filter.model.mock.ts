import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilter } from './my-performance-filter.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';

const chance = new Chance();
const metricTypeValues = Object.keys(MetricTypeValue).map(key => MetricTypeValue[key]);
const dateRangeTimePeriodValues = Object.keys(DateRangeTimePeriodValue).map(key => DateRangeTimePeriodValue[key]);
const premiseTypeValues = Object.keys(PremiseTypeValue).map(key => PremiseTypeValue[key]);
const distributionTypeValues = Object.keys(DistributionTypeValue).map(key => DistributionTypeValue[key]);

export function getMyPerformanceFilterMock(): MyPerformanceFilter {
  return {
    metricType: metricTypeValues[chance.integer({min: 0, max: metricTypeValues.length - 1})],
    dateRangeCode: dateRangeTimePeriodValues[chance.integer({min: 0, max: dateRangeTimePeriodValues.length - 1})],
    premiseType: premiseTypeValues[chance.integer({min: 0, max: premiseTypeValues.length - 1})],
    distributionType: distributionTypeValues[chance.integer({min: 0, max: distributionTypeValues.length - 1})]
  };
}
