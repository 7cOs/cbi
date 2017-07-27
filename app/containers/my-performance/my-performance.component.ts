import { Component, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AppState } from '../../state/reducers/root.reducer';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { MyPerformanceFilter } from '../../models/my-performance-filter.model';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent } from '../../models/my-performance-filter.model';
import * as MyPerformanceFilterActions from '../../state/actions/my-performance-filter.action';

import { ColumnType } from '../../enums/column-type.enum';
import { DateRange } from '../../models/date-range.model';
import { getDateRangeMock } from '../../models/date-range.model.mock';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { ViewType } from '../../enums/view-type.enum';

// mocks
import { myPerformanceTableData,
         myPerformanceTotalRowData,
         myPerformanceRightTableData,
         myPerformanceSkusData,
         myPerformanceSkuTotalData,
         myPerformanceTotalPeopleData,
         myPerformancePeopleData,
         myPerformanceAccountData,
         myPerformanceTotalAccountData } from '../../models/my-performance-table-data.model.mock';

@Component({
  selector: 'my-performance',
  template: require('./my-performance.component.pug'),
  styles: [require('./my-performance.component.scss')]
})
export class MyPerformanceComponent implements OnDestroy {
  public viewType = ViewType;

  // mocks
  public tableHeaderRowLeft: Array<string> = ['PEOPLE', 'DEPLETIONS', 'CTV'];
  public tableHeaderRowRight: Array<string> = ['BRAND', 'DEPLETIONS', 'CTV'];
  public performanceMetric: string = 'Depletions';
  public dateRange: DateRange = getDateRangeMock();
  public tableData: MyPerformanceTableRow[] = myPerformanceTableData;
  public rightTableData: MyPerformanceTableRow[] = myPerformanceRightTableData;
  public totalRowData: MyPerformanceTableRow = myPerformanceTotalRowData;
  public showOpportunities: boolean = true;
  public skusData = myPerformanceSkusData;
  public skuTotalData = myPerformanceSkuTotalData;
  public peopleData = myPerformancePeopleData;
  public peopleTotalData = myPerformanceTotalPeopleData;
  public accountData = myPerformanceAccountData;
  public accountTotalData = myPerformanceTotalAccountData;
  public sortingCriteria: Array<SortingCriteria> = [
    {
      columnType: ColumnType.metricColumn0,
      ascending: false
    }
  ];

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

  public handleSortRows(criteria: SortingCriteria[]): void {
    this.sortingCriteria = criteria;
  }

  public handleElementClicked(row: MyPerformanceTableRow, index: number): void {
    console.log(row);
    console.log(index);
  }

  public filterOptionSelected(event: MyPerformanceFilterEvent): void {
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
