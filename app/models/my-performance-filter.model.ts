import { CompassRadioOption } from './compass-radio-component.model';
import { CompassSelectOption } from './compass-select-component.model';
import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { MyPerformanceFilterActionType } from '../enums/my-performance-filter.enum';
import { MetricValue } from '../enums/metric-type.enum';
import { PremiseTypeValue } from '../enums/premise-type.enum';

export interface MyPerformanceFilter {
  metricType: MetricValue;
  dateRangeCode: DateRangeTimePeriodValue;
  premiseType: PremiseTypeValue;
  distributionType?: DistributionTypeValue;
}

export interface MyPerformanceFilterEvent {
  filterType: MyPerformanceFilterActionType;
  filterValue: any;
}

export const metricOptionsModel: Array<CompassSelectOption> = [{
  display: 'Depletions',
  value: MetricValue.DEPLETIONS
}, {
  display: 'Distribution',
  value: MetricValue.DISTRIBUTION
}, {
  display: 'Velocity',
  value: MetricValue.VELOCITY
}];

export const depletionsPremiseOptionsModel: Array<CompassRadioOption> = [{
  display: 'All',
  value: PremiseTypeValue.ALL
}, {
  display: 'Off-Premise',
  value: PremiseTypeValue.OFF
}, {
  display: 'On-Premise',
  value: PremiseTypeValue.ON
}];

export const distributionPremiseOptionsModel: Array<CompassRadioOption> = [{
  display: 'Off-Premise',
  value: PremiseTypeValue.OFF
}, {
  display: 'On-Premise',
  value: PremiseTypeValue.ON
}];

export const distributionOptionsModel: Array<CompassRadioOption> = [{
  display: 'Simple',
  value: DistributionTypeValue.SIMPLE
}, {
  display: 'Effective',
  value: DistributionTypeValue.EFFECTIVE
}];
