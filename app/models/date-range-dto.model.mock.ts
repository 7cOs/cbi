import * as Chance from 'chance';
import { DateRangeDTO } from './date-range-dto.model';
import * as moment from 'moment';

const chance = new Chance();

export function getDateRangeDTOMock(): DateRangeDTO {
  return {
    code: 'FYTM',
    description: chance.sentence(),
    startDate: moment().format('YYYYMMDD'),
    endDate: moment().format('YYYYMMDD')
  };
}
