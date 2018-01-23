import { sample } from 'lodash';

import { DateRangeTimePeriodValue } from './date-range-time-period.enum';

const dateRangeTimePeriodValues = Object.keys(DateRangeTimePeriodValue).map(key => DateRangeTimePeriodValue[key]);

export function getDateRangeTimePeriodValueMock(): DateRangeTimePeriodValue {
  return sample(dateRangeTimePeriodValues);
}
