import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';

import { AppState } from '../state/reducers/root.reducer';
import { DateRange } from '../models/date-range.model';
import { DateRangeTimePeriod } from '../enums/date-range-time-period.enum';

@Injectable()
export class DateRangeService {
  private dateRanges: Object;
  private dateRangesArray: Array<Observable<DateRange>>;

  constructor(private store: Store<AppState>) {
    this.dateRanges = this.store.select(state => state.dateRanges);

    this.dateRangesArray = [
      this.store.select(state => state.dateRanges.MTD),
      this.store.select(state => state.dateRanges.FYTM),
      this.store.select(state => state.dateRanges.CYTM),
      this.store.select(state => state.dateRanges.CYTD),
      this.store.select(state => state.dateRanges.FYTD),
      this.store.select(state => state.dateRanges.L60),
      this.store.select(state => state.dateRanges.L90),
      this.store.select(state => state.dateRanges.L120),
      this.store.select(state => state.dateRanges.L3CM),
      this.store.select(state => state.dateRanges.LCM),
      this.store.select(state => state.dateRanges.CMIPBDL)
    ];
  }

  getDateRange(timePeriod: DateRangeTimePeriod): Observable<DateRange> {
    return this.dateRangesArray[timePeriod];
  }

  getDateRanges(): Object {
    return this.dateRanges;
  }
}
