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
import { FetchResponsibilitiesAction, FetchResponsibilityEntityDataAction } from '../../state/actions/responsibilities.action';
import { getDateRangeMock } from '../../models/date-range.model.mock';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent } from '../../models/my-performance-filter.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { ResponsibilitiesState } from '../../state/reducers/responsibilities.reducer';
import { MyPerformanceState, MyPerformanceData } from '../../state/reducers/my-performance.reducer';
import { RowType } from '../../enums/row-type.enum';
import { SetRightMyPerformanceTableViewType } from '../../state/actions/view-types.action';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { ViewType } from '../../enums/view-type.enum';
import * as MyPerformanceFilterActions from '../../state/actions/my-performance-filter.action';
import * as MyPerformanceVersionActions from '../../state/actions/my-performance-version.action';

// mocks
import { myPerformanceRightTableData } from '../../models/my-performance-table-data.model.mock';

export interface HandleElementClickedParameters {
  leftSide: boolean;
  type: RowType;
  index: number;
  row?: MyPerformanceTableRow;
}

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
  public showLeftBackButton = false;

  // mocks
  public tableHeaderRowLeft: Array<string> = ['PEOPLE', 'DEPLETIONS', 'CTV'];
  public tableHeaderRowRight: Array<string> = ['BRAND', 'DEPLETIONS', 'CTV'];
  public performanceMetric: string = 'Depletions';
  public dateRange: DateRange = getDateRangeMock();
  public tableData: Array<MyPerformanceTableRow>;
  public rightTableData: MyPerformanceTableRow[] = myPerformanceRightTableData;
  public totalRowData: MyPerformanceTableRow;
  public showOpportunities: boolean = true;

  private currentState: MyPerformanceData;
  private dateRanges$: Observable<DateRangesState>;
  private filterState: MyPerformanceFilterState;
  private filterStateSubscription: Subscription;
  private myPerformanceCurrentSubscription: Subscription;
  private myPerformanceVersionSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService
  ) { }

  ngOnInit() {
    this.dateRanges$ = this.store.select(state => state.dateRanges);

    this.filterStateSubscription = this.store.select(state => state.myPerformanceFilter).subscribe(filterState => {
      this.filterState = filterState;
    });

    this.myPerformanceCurrentSubscription = this.store
      .select(state => state.myPerformance.current)
      .subscribe((current: MyPerformanceData) => {
        this.currentState = current;
        this.leftTableViewType = current.viewType.leftTableViewType;

        if (current.responsibilities && current.responsibilities.status === ActionStatus.Fetched) {
          this.tableData = this.myPerformanceTableDataTransformerService.getTableData(this.leftTableViewType, current.responsibilities);
        }

        if (current.performanceTotal && current.performanceTotal.status === ActionStatus.Fetched) {
          this.totalRowData = this.myPerformanceTableDataTransformerService
            .getTotalRowDisplayData(current.performanceTotal.performanceTotal);
        }
    });

    this.myPerformanceVersionSubscription = this.store.select(state => state.myPerformance.versions)
      .subscribe((versions: Array<MyPerformanceState>) => {
        this.showLeftBackButton = versions.length > 0;
    });

    // stub current user for now
    const currentUserId = 3843;
    this.store.dispatch(new FetchResponsibilitiesAction({ positionId: currentUserId, filter: this.filterState }));

    // setting ViewType for right side here for now
    this.store.dispatch(new SetRightMyPerformanceTableViewType(ViewType.brands));
  }

  ngOnDestroy() {
    this.filterStateSubscription.unsubscribe();
    this.myPerformanceCurrentSubscription.unsubscribe();
    this.myPerformanceVersionSubscription.unsubscribe();
  }

  public handleSortRows(criteria: SortingCriteria[]): void {
    this.sortingCriteria = criteria;
  }

  public handleElementClicked(parameters: HandleElementClickedParameters): void {
    switch (parameters.type) {
      case RowType.total:
        if (parameters.leftSide) {
          if (this.showLeftBackButton) {
            this.store.dispatch(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());
          }
          console.log(`clicked on cell ${parameters.index} from the left side`);
        } else {
          console.log(`clicked on cell ${parameters.index} from the right side`);
        }
        break;

      case RowType.data:
      default:
        if (parameters.leftSide) {
          console.log('clicked on left row:', parameters.row);
          this.store.dispatch(new MyPerformanceVersionActions.SaveMyPerformanceStateAction(this.currentState));

          if (this.leftTableViewType === ViewType.roleGroups) {
            this.store.dispatch(new FetchResponsibilityEntityDataAction({
              entityType: EntityPeopleType[parameters.row.descriptionRow0.slice(0, -1)],
              entities: this.currentState.responsibilities.responsibilities[EntityPeopleType[parameters.row.descriptionRow0.slice(0, -1)]],
              filter: this.filterState,
              performanceTotal: parameters.row,
              viewType: ViewType.people
            }));
          }
        } else {
          console.log('clicked on right row:', parameters.row);
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
