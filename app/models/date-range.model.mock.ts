import { DateRange } from './date-range.model';
import * as Chance from 'chance';
let chance = new Chance();

export function dateRangeMock(): DateRange {
  return {
    code: chance.string(),
    displayCode: chance.string(),
    description: chance.sentence(),
    dateRange: chance.string()
  };
}
