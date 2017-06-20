import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'rxjs/add/operator/map';

import { DateRange } from '../models/date-range.model';
import { DateRangeDTO } from '../models/date-range-dto.model';

@Injectable()
export class DateRangeTransformerService {
  private defaultDateFormat: string;

  private dateRangeDisplayCodes: any = {
    'MTD': 'MTD',
    'FYTM': 'FYTM',
    'CYTM': 'CYTM',
    'CYTDBDL': 'CYTD',
    'FYTDBDL': 'FYTD',
    'L60BDL': 'L60 Days',
    'L90BDL': 'L90 Days',
    'L120BDL': 'L120 Days',
    'LCM': 'Clo Mth',
    'L3CM': 'L03 Mth'
  };

  private dateRangeV2Codes: any = {
    'MTD': 'MTD',
    'FYTM': 'FYTM',
    'CYTM': 'CYTM',
    'CYTDBDL': 'CYTD',
    'FYTDBDL': 'FYTD',
    'L60BDL': 'L60',
    'L90BDL': 'L90',
    'L120BDL': 'L120',
    'LCM': 'CMTH',
    'L3CM': 'L03'
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
      displayCode: this.mapDateRangeDisplayCode(dateRangeDTO.code),
      v2ApiCode: this.mapDateRangeV2Code(dateRangeDTO.code),
      description: dateRangeDTO.description,
      range: `${this.formatDate(dateRangeDTO.startDate)} - ${this.formatDate(dateRangeDTO.endDate)}`
    };
  }

  private formatDate(date: string, format?: string) {
    const _format = format || this.defaultDateFormat;
    return moment(date).format(_format);
  }

  private mapDateRangeDisplayCode(rawType: string): string {
    return this.dateRangeDisplayCodes[rawType] || rawType;
  }

  private mapDateRangeV2Code(rawType: string): string {
    return this.dateRangeV2Codes[rawType] || rawType;
  }
}
