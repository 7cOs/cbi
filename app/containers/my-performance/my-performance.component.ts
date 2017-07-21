import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from '../../state/reducers/root.reducer';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { MyPerformanceFilter } from '../../models/my-performance-filter.model';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent } from '../../models/my-performance-filter.model';
import * as MyPerformanceFilterActions from '../../state/actions/my-performance-filter.action';

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

  private filterOptionSelected(event: MyPerformanceFilterEvent): void { // tslint:disable-line:no-unused-variable
    let actionType;

    switch (event.filterType) {
      case MyPerformanceFilterActionType.Metric:
        actionType = MyPerformanceFilterActions.SET_METRIC;
        break;
      case MyPerformanceFilterActionType.TimePeriod:
        actionType = MyPerformanceFilterActions.SET_TIME_PERIOD;
        break;
      case MyPerformanceFilterActionType.PremiseType:
        actionType = MyPerformanceFilterActions.SET_PREMISE_TYPE;
        break;
      case MyPerformanceFilterActionType.DistributionType:
        actionType = MyPerformanceFilterActions.SET_DISTRIBUTION_TYPE;
        break;
      default:
        throw new Error(`My Performance Component: Filtertype of ${event.filterType} does not exist!`);
    }

    this.store.dispatch({type: actionType, payload: event.filterValue});
  }
}
