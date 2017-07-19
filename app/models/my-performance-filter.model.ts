import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { MetricValue } from '../enums/metric-type.enum';
import { PremiseTypeValue } from '../enums/premise-type.enum';

export interface MyPerformanceFilter {
  metric: MetricValue;
  timePeriod: DateRangeTimePeriodValue;
  premiseType: PremiseTypeValue;
  distributionType: DistributionTypeValue;
}

export const metricOptionsModel: Array<{ metricName: string, metricValue: MetricValue }> = [
  {
    metricName: 'Depletions',
    metricValue: MetricValue.DEPLETIONS
  }, {
    metricName: 'Distribution',
    metricValue: MetricValue.DISTRIBUTION
  }, {
    metricName: 'Velocity',
    metricValue: MetricValue.VELOCITY
  }
];

export const depletionsPremiseOptionsModel: Array<{ premiseType: string, premiseTypeValue: PremiseTypeValue }> = [
  {
    premiseType: 'All',
    premiseTypeValue: PremiseTypeValue.ALL
  }, {
    premiseType: 'Off-Premise',
    premiseTypeValue: PremiseTypeValue.OFF
  }, {
    premiseType: 'On-Premise',
    premiseTypeValue: PremiseTypeValue.ON
  }
];

export const distributionPremiseOptionsModel: Array<{ premiseType: string, premiseTypeValue: PremiseTypeValue }> = [
  {
    premiseType: 'Off-Premise',
    premiseTypeValue: PremiseTypeValue.OFF
  }, {
    premiseType: 'On-Premise',
    premiseTypeValue: PremiseTypeValue.ON
  }
];

export const distributionOptionsModel: Array<{ distributionType: string, distributionTypeValue: DistributionTypeValue} > = [
  {
    distributionType: 'Simple',
    distributionTypeValue: DistributionTypeValue.SIMPLE
  }, {
    distributionType: 'Effective',
    distributionTypeValue: DistributionTypeValue.EFFECTIVE
  }
];
