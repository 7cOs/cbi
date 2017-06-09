import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';

import { AppState } from '../state/reducers/root.reducer';
import { DateRange } from '../models/date-range.model';

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
  }

  getDateRange(timePeriod: string): Observable<DateRange> {
    return this[timePeriod];
  }
}
