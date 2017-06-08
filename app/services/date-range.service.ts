import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';

import { AppState } from '../state/reducers/root.reducer';
import { DateRange } from '../models/date-range.model';
import { DateRangeDTO } from '../models/date-range-dto.model';

@Injectable()
export class DateRangeService {
  private MTD: Observable<DateRange>;
  private FYTM: Observable<DateRange>;
  private CYTM: Observable<DateRange>;
  private CYTD: Observable<DateRange>;
  private FYTD: Observable<DateRange>;
  private L60: Observable<DateRange>;
  private L90: Observable<DateRange>;
  private L120: Observable<DateRange>;
  private L3CM: Observable<DateRange>;
  private defaultDateFormat: string;

  constructor(private store: Store<AppState>) {
    this.MTD = store.select(state => state.dateRanges.MTD);
    this.FYTM = store.select(state => state.dateRanges.FYTM);
    this.CYTM = store.select(state => state.dateRanges.CYTM);
    this.CYTD = store.select(state => state.dateRanges.CYTD);
    this.FYTD = store.select(state => state.dateRanges.FYTD);
    this.L60 = store.select(state => state.dateRanges.L60);
    this.L90 = store.select(state => state.dateRanges.L90);
    this.L120 = store.select(state => state.dateRanges.L120);
    this.L3CM = store.select(state => state.dateRanges.L3CM);
    this.defaultDateFormat = 'MM/DD/YYYY';
  }

  getDateRange(timePeriod: string): Observable<DateRange> {
    return this[timePeriod];
  }

  transformDateRanges(dateRangeDTOs: DateRangeDTO[]): DateRange[] {
    return dateRangeDTOs.map(dto => this.formatDateRange(dto));
  }

  private formatDateRange(dateRangeDTO: DateRangeDTO): DateRange {
    return {
      code: dateRangeDTO.code,
      displayCode: this.mapDateRangeDisplayCode(dateRangeDTO.code),
      description: dateRangeDTO.description,
      dateRange: `${this.formatDate(dateRangeDTO.startDate)} - ${this.formatDate(dateRangeDTO.endDate)}`
    };
  }

  private formatDate(date: string, format?: string) {
    const _format = format || this.defaultDateFormat;
    return moment(date).format(_format);
  }

  private mapDateRangeDisplayCode(rawType: string): string {
    const dateRangeDisplayCodes: any = {
      'CYTDBDL': 'CYTD',
      'FYTDBDL': 'FYTD',
      'L60BDL': 'L60 Days',
      'L90BDL': 'L90 Days',
      'L120BDL': 'L120 Days',
      'LCM': 'Clo Mth',
      'L3CM': 'L03 Mth'
    };

    return dateRangeDisplayCodes[rawType] || rawType;
  }
}
