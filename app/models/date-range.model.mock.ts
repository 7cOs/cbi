import * as Chance from 'chance';
import { DateRange } from './date-range.model';

const chance = new Chance();

export function getDateRangeMock(): DateRange {
  return {
    code: chance.string(),
    displayCode: chance.string(),
    displayCodeQuarterDate: chance.string(),
    description: chance.sentence(),
    range: chance.string()
  };
}
