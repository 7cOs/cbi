import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/map';

import { AppState } from '../state/reducers/root.reducer';
import { DateRangesState } from '../state/reducers/date-ranges.reducer';

@Injectable()
export class DateRangeService {
  private dateRanges: Observable<DateRangesState>;

  constructor(private store: Store<AppState>) {
    this.dateRanges = this.store.select(state => state.dateRanges);
  }

  getDateRanges(): Observable<DateRangesState> {
    return this.dateRanges;
  }
}
