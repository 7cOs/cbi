import { DateRange } from './date-range.model';
import * as Chance from 'chance';
let chance = new Chance();

export function getDateRangeMock(): DateRange {
  return {
    code: chance.string(),
    displayCode: chance.string(),
    description: chance.sentence(),
    range: chance.string()
  };
}
