import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { ColumnType } from '../../enums/column-type.enum';
import { DateRange } from '../../models/date-range.model';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { FetchResponsibilitiesAction } from '../../state/actions/responsibilities.action';
import { getDateRangeMock } from '../../models/date-range.model.mock';
import { GetPeopleByRoleGroupAction } from '../../state/actions/responsibilities.action';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent } from '../../models/my-performance-filter.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { PerformanceTotalState } from '../../state/reducers/performance-total.reducer';
import { ResponsibilitiesState } from '../../state/reducers/responsibilities.reducer';
import { RowType } from '../../enums/row-type.enum';
import { SetLeftMyPerformanceTableViewType, SetRightMyPerformanceTableViewType } from '../../state/actions/view-types.action';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { ViewType } from '../../enums/view-type.enum';
import { ViewTypeState } from '../../state/reducers/view-types.reducer';
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
  public leftTableViewType: ViewType;
  public roleGroups: Observable<ResponsibilitiesState>;
  public sortingCriteria: Array<SortingCriteria> = [{
    columnType: ColumnType.metricColumn0,
    ascending: false
  }];
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

    this.store.select(state => state.responsibilities).subscribe((responsibilitiesState: ResponsibilitiesState) => {
      if (responsibilitiesState && responsibilitiesState.responsibilities) {
        let { tableData, totalRowData } =
          this.myPerformanceTableDataTransformerService.getTableData(this.leftTableViewType, responsibilitiesState.responsibilities);
        this.tableData = tableData;
        this.totalRowData = totalRowData || this.totalRowData;
      }
    });

    this.store.select(state => state.viewTypes).subscribe((viewTypeState: ViewTypeState) => {
      if (viewTypeState && viewTypeState.leftTableViewType) this.leftTableViewType = viewTypeState.leftTableViewType;
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

  public handleElementClicked(leftSide: boolean, type: RowType, index: number, row?: MyPerformanceTableRow): void {
    switch (type) {
      case RowType.total:
        if (leftSide) {
          console.log(`clicked on cell ${index} from the left side`);
        } else {
          console.log(`clicked on cell ${index} from the right side`);
        }
        break;

      case RowType.data:
      default:
        if (leftSide) {
          console.log('clicked on left row:', row);
          if (this.leftTableViewType === ViewType.roleGroups) {
            this.store.dispatch(new SetLeftMyPerformanceTableViewType(ViewType.people));
            this.store.dispatch(new GetPeopleByRoleGroupAction(EntityPeopleType[row.descriptionRow0]));
          }
        } else {
          console.log('clicked on right row:', row);
        }
    }
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
