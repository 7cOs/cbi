import { DateRangeDTO } from './date-range-dto.model';
import * as Chance from 'chance';
let chance = new Chance();

export function dateRangeDTOMock(): DateRangeDTO {
  return {
    code: chance.string(),
    description: chance.sentence(),
    startDate: chance.string(),
    endDate: chance.string()
  };
}
