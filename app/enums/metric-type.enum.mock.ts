import { sample } from 'lodash';

import { MetricTypeValue } from './metric-type.enum';

const metricTypeValues = Object.keys(MetricTypeValue).map(key => MetricTypeValue[key]);

export function getMetricTypeValueMock(): MetricTypeValue {
  return sample(metricTypeValues);
}
