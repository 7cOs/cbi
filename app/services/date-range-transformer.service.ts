import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'rxjs/add/operator/map';

import { DateRange } from '../models/date-range.model';
import { DateRangeDTO } from '../models/date-range-dto.model';

@Injectable()
export class DateRangeTransformerService {
  private defaultDateFormat: string;

  private dateRangeDisplayCodes: any = {
    'FYTM': 'FYTM',
    'CYTM': 'CYTM',
    'CQTD': 'CQTD',
    'CYTDBDL': 'CYTD',
    'FYTDBDL': 'FYTD',
    'FQTD': 'FQTD',
    'CCQTD': 'Clo Cal Qtr',
    'FCQTD': 'Clo Fiscal Qtr',
    'L60BDL': 'L60 Days',
    'L90BDL': 'L90 Days',
    'L120BDL': 'L120 Days',
    'LCM': 'Clo Mth',
    'L3CM': 'L03 Mth',
    'CMIPBDL': 'MTD'
  };

  constructor() {
    this.defaultDateFormat = 'MM/DD/YY';
  }

  public transformDateRanges(dateRangeDTOs: DateRangeDTO[]): DateRange[] {
    return dateRangeDTOs.filter(dto => !!this.dateRangeDisplayCodes[dto.code])
                        .map(dto => this.formatDateRange(dto));
  }

  private formatDateRange(dateRangeDTO: DateRangeDTO): DateRange {
    return {
      code: dateRangeDTO.code,
      displayCode: this.mapDateRangeDisplayCode(dateRangeDTO),
      description: dateRangeDTO.description,
      range: `${this.formatDate(dateRangeDTO.startDate)} - ${this.formatDate(dateRangeDTO.endDate)}`
    };
  }

  private formatDate(date: string, format?: string) {
    const _format = format || this.defaultDateFormat;
    return moment(date).format(_format);
  }

  private mapDateRangeDisplayCode(dateRangeDTO: DateRangeDTO): string {
    if (!this.dateRangeDisplayCodes[dateRangeDTO.code]) return dateRangeDTO.code;

    if (dateRangeDTO.extendedName) {
      const formattedQuarterLabel: string = dateRangeDTO.extendedName.replace(' ', `'`);
      return `${ this.dateRangeDisplayCodes[dateRangeDTO.code] } (${ formattedQuarterLabel })`;
    } else {
      return this.dateRangeDisplayCodes[dateRangeDTO.code];
    }
  }
}
