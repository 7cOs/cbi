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
  }

  getDateRanges(): Observable<DateRangesState> {
    return this.dateRanges;
  }
}
