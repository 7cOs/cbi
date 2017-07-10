import { Action } from '@ngrx/store';
import { DistributionTypeValue, MetricValue, PremiseTypeValue, TimePeriodValue } from '../../models/my-performance-filter.model';

export const SET_METRIC =             '[My Performance Filter] SET_METRIC';
export const SET_TIME_PERIOD =        '[My Performance Filter] SET_TIME_PERIOD';
export const SET_PREMISE_TYPE =       '[My Performance Filter] SET_PREMISE_TYPE';
export const SET_DISTRIBUTION_TYPE =  '[My Performance Filter] SET_DISTRIBUTION_TYPE';

export class SetMetric implements Action {
  readonly type = SET_METRIC;
  constructor(public payload: MetricValue) { }
}

export class SetTimePeriod implements Action {
  readonly type = SET_TIME_PERIOD;
  constructor(public payload: TimePeriodValue) { }
}

export class SetPremiseType implements Action {
  readonly type = SET_PREMISE_TYPE;
  constructor(public payload: PremiseTypeValue) { }
}

export class SetDistributionType implements Action {
  readonly type = SET_DISTRIBUTION_TYPE;
  constructor(public payload: DistributionTypeValue) { }
}

export type Action
  = SetMetric
  | SetTimePeriod
  | SetPremiseType
  | SetDistributionType;
