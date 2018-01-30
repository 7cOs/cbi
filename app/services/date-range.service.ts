import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';

import { AppState } from '../state/reducers/root.reducer';
import { DateRange } from '../models/date-range.model'; // tslint:disable-line:no-unused-variable
import { DateRangeTimePeriod } from '../enums/date-range-time-period.enum';
import { DateRangesState } from '../state/reducers/date-ranges.reducer'; // tslint:disable-line:no-unused-variable

@Injectable()
export class DateRangeService {
  private dateRanges: Observable<DateRangesState>;
  private dateRangesArray: Array<Observable<DateRange>>;

  constructor(private store: Store<AppState>) {
    this.dateRanges = this.store.select(state => state.dateRanges);

    this.dateRangesArray = [
      this.store.select(state => state.dateRanges.FYTM),
      this.store.select(state => state.dateRanges.CYTM),
      this.store.select(state => state.dateRanges.CQTD),
      this.store.select(state => state.dateRanges.CYTDBDL),
      this.store.select(state => state.dateRanges.FYTDBDL),
      this.store.select(state => state.dateRanges.FQTD),
      this.store.select(state => state.dateRanges.CCQTD),
      this.store.select(state => state.dateRanges.FCQTD),
      this.store.select(state => state.dateRanges.L60BDL),
      this.store.select(state => state.dateRanges.L90BDL),
      this.store.select(state => state.dateRanges.L120BDL),
      this.store.select(state => state.dateRanges.L3CM),
      this.store.select(state => state.dateRanges.LCM),
      this.store.select(state => state.dateRanges.CMIPBDL)
    ];
  }

  getDateRange(timePeriod: DateRangeTimePeriod): Observable<DateRange> {
    return this.dateRangesArray[timePeriod];
  }

  getDateRanges(): Observable<DateRangesState> {
    return this.dateRanges;
  }
}
