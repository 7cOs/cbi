import { DateRangeDTO } from './date-range-dto.model';
import * as Chance from 'chance';
import * as moment from 'moment';
let chance = new Chance();

export function dateRangeDTOMock(): DateRangeDTO {
  return {
    code: chance.word(),
    description: chance.sentence(),
    startDate: moment(chance.date()).format('MM-DD-YYYY'),
    endDate: moment(chance.date()).format('MM-DD-YYYY')
  };
}
