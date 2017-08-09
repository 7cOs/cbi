import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { ColumnType } from '../../enums/column-type.enum';
import { DateRange } from '../../models/date-range.model';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { FetchResponsibilitiesAction } from '../../state/actions/responsibilities.action';
import { getDateRangeMock } from '../../models/date-range.model.mock';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent } from '../../models/my-performance-filter.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { PerformanceTotalState } from '../../state/reducers/performance-total.reducer';
import { ResponsibilitiesState } from '../../state/reducers/responsibilities.reducer';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { ViewType } from '../../enums/view-type.enum';
import * as MyPerformanceFilterActions from '../../state/actions/my-performance-filter.action';

// mocks
import {
  myPerformanceTableData,
  myPerformanceRightTableData
} from '../../models/my-performance-table-data.model.mock';

@Component({
  selector: 'my-performance',
  template: require('./my-performance.component.pug'),
  styles: [require('./my-performance.component.scss')]
})
export class MyPerformanceComponent implements OnInit, OnDestroy {

  public roleGroups: Observable<ResponsibilitiesState>;
  public viewType = ViewType;

  // mocks
  public tableHeaderRowLeft: Array<string> = ['PEOPLE', 'DEPLETIONS', 'CTV'];
  public tableHeaderRowRight: Array<string> = ['BRAND', 'DEPLETIONS', 'CTV'];
  public performanceMetric: string = 'Depletions';
  public dateRange: DateRange = getDateRangeMock();
  public tableData: MyPerformanceTableRow[] = myPerformanceTableData;
  public rightTableData: MyPerformanceTableRow[] = myPerformanceRightTableData;
  public totalRowData: MyPerformanceTableRow;
  public showOpportunities: boolean = true;
  public sortingCriteria: Array<SortingCriteria> = [{
    columnType: ColumnType.metricColumn0,
    ascending: false
  }];

  private dateRanges$: Observable<DateRangesState>;
  private filterState$: Observable<MyPerformanceFilterState>;
  private performanceTotalSubscription: Subscription;
  private responsibilitiesSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService
  ) { }

  ngOnInit() {
    this.dateRanges$ = this.store.select(state => state.dateRanges);
    this.filterState$ = this.store.select(state => state.myPerformanceFilter);

    this.responsibilitiesSubscription = this.store.select(state => state.responsibilities)
      .subscribe((responsibilitiesState: ResponsibilitiesState) => {
        if (responsibilitiesState && responsibilitiesState.responsibilities) {
          this.tableData = this.myPerformanceTableDataTransformerService.getRoleGroupPerformanceTableData(
            responsibilitiesState.responsibilitiesPerformanceTotals
          );
        }
    });

    this.performanceTotalSubscription = this.store.select(state => state.performanceTotal)
      .subscribe((performanceTotalData: PerformanceTotalState) => {
        if (performanceTotalData && performanceTotalData.status === ActionStatus.Fetched) {
          this.totalRowData = this.myPerformanceTableDataTransformerService.getTotalRowDisplayData(performanceTotalData.performanceTotal);
        }
    });

    // stub current user for now
    const currentUserId = 1;
    this.store.dispatch(new FetchResponsibilitiesAction(currentUserId));
  }

  ngOnDestroy() {
    this.performanceTotalSubscription.unsubscribe();
    this.responsibilitiesSubscription.unsubscribe();
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
