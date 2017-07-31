import * as Chance from 'chance';

import { MetricValue } from './metric-type.enum';

let chance = new Chance();
const metricValueValues = Object.keys(MetricValue)
  .map(key => MetricValue[key]);

export function getMetricValue(): MetricValue {
  return metricValueValues[chance.integer({min: 0, max: metricValueValues.length - 1})];
}
