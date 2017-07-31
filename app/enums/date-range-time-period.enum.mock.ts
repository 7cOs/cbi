import * as Chance from 'chance';

import { DateRangeTimePeriod, DateRangeTimePeriodValue } from './date-range-time-period.enum';

let chance = new Chance();
const dateRangeTimePeriodValues = Object.keys(DateRangeTimePeriod)
  .map(key => DateRangeTimePeriod[key]);

const dateRangeTimePeriodValueValues = Object.keys(DateRangeTimePeriodValue)
  .map(key => DateRangeTimePeriodValue[key]);

export function getDateRangeTimePeriod(): DateRangeTimePeriod {
  return dateRangeTimePeriodValues[chance.integer({min: 0, max: dateRangeTimePeriodValues.length - 1})];
}

export function getDateRangeTimePeriodValue(): DateRangeTimePeriodValue {
  return dateRangeTimePeriodValueValues[chance.integer({min: 0, max: dateRangeTimePeriodValueValues.length - 1})];
}
