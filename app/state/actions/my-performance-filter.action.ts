import { Action } from '@ngrx/store';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { PremiseTypeValue } from '../../enums/premise-type.enum';

export interface SetMetricAndPremiseTypePayload {
  metricType: MetricTypeValue;
  premiseType: PremiseTypeValue;
}

export const SET_METRIC = '[My Performance Filter] SET_METRIC';
export class SetMetric implements Action {
  readonly type = SET_METRIC;
  constructor(public payload: MetricTypeValue) { }
}

export const SET_TIME_PERIOD = '[My Performance Filter] SET_TIME_PERIOD';
export class SetTimePeriod implements Action {
  readonly type = SET_TIME_PERIOD;
  constructor(public payload: DateRangeTimePeriodValue) { }
}

export const SET_PREMISE_TYPE = '[My Performance Filter] SET_PREMISE_TYPE';
export class SetPremiseType implements Action {
  readonly type = SET_PREMISE_TYPE;
  constructor(public payload: PremiseTypeValue) { }
}

export const SET_DISTRIBUTION_TYPE = '[My Performance Filter] SET_DISTRIBUTION_TYPE';
export class SetDistributionType implements Action {
  readonly type = SET_DISTRIBUTION_TYPE;
  constructor(public payload: DistributionTypeValue) { }
}

export const SET_METRIC_AND_PREMISE_TYPE = '[My Performance Filter] SET_METRIC_AND_PREMISE_TYPE';
export class SetMetricAndPremiseType implements Action {
  readonly type = SET_METRIC_AND_PREMISE_TYPE;
  constructor(public payload: SetMetricAndPremiseTypePayload) { }
}

export type Action
  = SetMetric
  | SetTimePeriod
  | SetPremiseType
  | SetDistributionType
  | SetMetricAndPremiseType;
