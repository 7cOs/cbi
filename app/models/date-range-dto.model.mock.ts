import * as Chance from 'chance';
import { DateRangeDTO } from './date-range-dto.model';

const chance = new Chance();

export function getDateRangeDTOMock(): DateRangeDTO {
  return {
    code: 'FYTM',
    description: chance.sentence(),
    startDate: '20170301',
    endDate: '20170531'
  };
}
