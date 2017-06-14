import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';

import { AppState } from '../state/reducers/root.reducer';
import { DateRange } from '../models/date-range.model';
import { DateRangeTimePeriod } from '../enums/date-range-time-period.enum';

@Injectable()
export class DateRangeService {
  private dateRanges: Array<Observable<DateRange>>;
  private rangeCollection: any = {
    MTD:  '',
    FYTM: '',
    CYTM: '',
    CYTD: '',
    FYTD: '',
    L60:  '',
    L90:  '',
    L120: '',
    L3CM: ''
  };

  constructor(private store: Store<AppState>) {
    this.dateRanges = [
      this.store.select(state => state.dateRanges.MTD),
      this.store.select(state => state.dateRanges.FYTM),
      this.store.select(state => state.dateRanges.CYTM),
      this.store.select(state => state.dateRanges.CYTD),
      this.store.select(state => state.dateRanges.FYTD),
      this.store.select(state => state.dateRanges.L60),
      this.store.select(state => state.dateRanges.L90),
      this.store.select(state => state.dateRanges.L120),
      this.store.select(state => state.dateRanges.L3CM)
    ];

    Object.keys(this.rangeCollection).forEach(dateKey => {
      this.store.select(state => state.dateRanges[dateKey]).subscribe(dateRange => {
        this.rangeCollection[dateKey] = dateRange.range;
      });
    });
  }

  getDateRange(timePeriod: DateRangeTimePeriod): Observable<DateRange> {
    return this.dateRanges[timePeriod];
  }

  getDateRanges(): any {
    return this.rangeCollection;
  }

  getDateRangeString(timePeriod: DateRangeTimePeriod): string {
    return this.rangeCollection[timePeriod];
  }
}
