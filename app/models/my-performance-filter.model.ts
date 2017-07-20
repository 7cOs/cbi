import { CompassSelectOption } from './compass-select-component.model';
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

export const metricOptionsModel: Array<CompassSelectOption> = [
  {
    display: 'Depletions',
    subDisplay: '',
    value: MetricValue.DEPLETIONS
  }, {
    display: 'Distribution',
    subDisplay: '',
    value: MetricValue.DISTRIBUTION
  }, {
    display: 'Velocity',
    subDisplay: '',
    value: MetricValue.VELOCITY
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
