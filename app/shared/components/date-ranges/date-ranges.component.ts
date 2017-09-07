import { ActionStatus } from '../../../enums/action-status.enum';
import { AppState } from '../../../state/reducers/root.reducer';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DateRangesState } from '../../../state/reducers/date-ranges.reducer';
import { DateRangeTimePeriod } from '../../../enums/date-range-time-period.enum';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'date-ranges',
  template: require('./date-ranges.component.pug'),
  styles: [require('./date-ranges.component.scss')]
})

export class DateRangeComponent implements OnInit, OnDestroy {

  @Input() dateRange: DateRangeTimePeriod;

  private dateRangeDisplay: string;
  private dateRangeSubscription: Subscription;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.dateRangeSubscription = this.store.select(state => state.dateRanges).subscribe(dateRanges => {
      if (dateRanges.status === ActionStatus.Fetched && dateRanges[DateRangeTimePeriod[this.dateRange]]) {
        this.dateRangeDisplay = dateRanges[DateRangeTimePeriod[this.dateRange]].range;
      }
    });
  }

  ngOnDestroy() {
    this.dateRangeSubscription.unsubscribe();
  }
}
