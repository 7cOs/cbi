import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from '../../state/reducers/root.reducer';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { MyPerformanceFilter } from '../../models/my-performance-filter.model';
import { SET_DISTRIBUTION_TYPE, SET_PREMISE_TYPE, SET_METRIC, SET_TIME_PERIOD } from '../../state/actions/my-performance-filter.action';

@Component({
  selector: 'myPerformance',
  template: require('./my-performance.component.pug')
})

export class MyPerformanceComponent implements OnDestroy {
  private dateRanges: DateRangesState;
  private dateRangeSubscription: Subscription;
  private filterState: MyPerformanceFilter;
  private filterStateSubscription: Subscription;

  constructor(private store: Store<AppState>) {
    this.filterStateSubscription = this.store.select(state => state.myPerformanceFilter).subscribe(filterState => {
      this.filterState = filterState;
    });

    this.dateRangeSubscription = this.store.select(state => state.dateRanges).subscribe(dateRanges => {
      this.dateRanges = dateRanges;
    });
  }

  ngOnDestroy() {
    this.filterStateSubscription.unsubscribe();
    this.dateRangeSubscription.unsubscribe();
  }

  private filterOptionSelected(event: any) { // tslint:disable-line:no-unused-variable
    switch (event.filterType) {
      case 'metric':
        this.store.dispatch({type: SET_METRIC, payload: event.filterValue});
        break;
      case 'timePeriod':
        this.store.dispatch({type: SET_TIME_PERIOD, payload: event.filterValue});
        break;
      case 'premiseType':
        this.store.dispatch({type: SET_PREMISE_TYPE, payload: event.filterValue});
        break;
      case 'distributionType':
        this.store.dispatch({type: SET_DISTRIBUTION_TYPE, payload: event.filterValue});
        break;
      default:
        throw new Error(`My Performance Component: Filtertype of ${event.filterType} does not exist!`);
    }
  }
}
