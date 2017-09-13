import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { BreadcrumbEntityClickedEvent } from '../../models/breadcrumb-entity-clicked-event.model';
import { ColumnType } from '../../enums/column-type.enum';
import { DateRange } from '../../models/date-range.model';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { FetchResponsibilitiesAction,
         FetchResponsibilityEntityPerformance,
         FetchSubAccountsAction } from '../../state/actions/responsibilities.action';
import { getDateRangeMock } from '../../models/date-range.model.mock';
import * as MyPerformanceFilterActions from '../../state/actions/my-performance-filter.action';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent } from '../../models/my-performance-filter.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { MyPerformanceEntitiesData } from '../../state/reducers/my-performance.reducer';
import * as MyPerformanceVersionActions from '../../state/actions/my-performance-version.action';
import { ResponsibilitiesState } from '../../state/reducers/responsibilities.reducer';
import { RowType } from '../../enums/row-type.enum';
import { SetRightMyPerformanceTableViewType } from '../../state/actions/view-types.action';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { ViewType } from '../../enums/view-type.enum';

// mocks
import { myPerformanceRightTableData } from '../../models/my-performance-table-data.model.mock';

const CORPORATE_USER_POSITION_ID = '0';

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
  public currentUserFullName: string;
  public leftTableViewType: ViewType;
  public performanceStateVersions$: Observable<MyPerformanceEntitiesData[]>;
  public roleGroups: Observable<ResponsibilitiesState>;
  public showLeftBackButton = false;
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
  public tableData: Array<MyPerformanceTableRow>;
  public rightTableData: MyPerformanceTableRow[] = myPerformanceRightTableData;
  public totalRowData: MyPerformanceTableRow;
  public showOpportunities: boolean = true;

  private currentState: MyPerformanceEntitiesData;
  private dateRanges$: Observable<DateRangesState>;
  private filterState: MyPerformanceFilterState;
  private filterStateSubscription: Subscription;
  private myPerformanceCurrentSubscription: Subscription;
  private myPerformanceVersionSubscription: Subscription;

  constructor(
    private store: Store<AppState>,
    private myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService,
    @Inject('userService') private userService: any
  ) { }

  ngOnInit() {
    this.currentUserFullName = `${this.userService.model.currentUser.firstName} ${this.userService.model.currentUser.lastName}`;
    this.dateRanges$ = this.store.select(state => state.dateRanges);
    this.performanceStateVersions$ = this.store.select(state => state.myPerformance.versions);

    this.filterStateSubscription = this.store.select(state => state.myPerformanceFilter).subscribe(filterState => {
      this.filterState = filterState;
    });

    this.myPerformanceCurrentSubscription = this.store
      .select(state => state.myPerformance.current)
      .subscribe((current: MyPerformanceEntitiesData) => {
        this.currentState = current;
        this.leftTableViewType = current.viewType.leftTableViewType;

        if (current.responsibilities && current.responsibilities.status === ActionStatus.Fetched) {
          this.tableData = this.myPerformanceTableDataTransformerService.getLeftTableData(
            current.responsibilities.entitiesPerformances
          );

          if (current.responsibilities.entitiesPerformances) {
            this.totalRowData = this.myPerformanceTableDataTransformerService
              .getTotalRowData(current.responsibilities.entitiesTotalPerformances);
          }
        }
    });

    this.myPerformanceVersionSubscription = this.store.select(state => state.myPerformance.versions)
      .subscribe((versions: MyPerformanceEntitiesData[]) => {
        this.showLeftBackButton = versions.length > 0;
    });

    const currentUserId = this.userService.model.currentUser.positionId || CORPORATE_USER_POSITION_ID;
    this.store.dispatch(new FetchResponsibilitiesAction({ positionId: currentUserId, filter: this.filterState }));

    // setting ViewType for right side here for now
    this.store.dispatch(new SetRightMyPerformanceTableViewType(ViewType.brands));
  }

  ngOnDestroy() {
    this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceStateAction());
    if (this.filterStateSubscription) this.filterStateSubscription.unsubscribe();
    if (this.myPerformanceCurrentSubscription) this.myPerformanceCurrentSubscription.unsubscribe();
    if (this.myPerformanceVersionSubscription) this.myPerformanceVersionSubscription.unsubscribe();
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
          this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityAction(parameters.row.descriptionRow0));
          this.store.dispatch(new MyPerformanceVersionActions.SaveMyPerformanceStateAction(this.currentState));

          switch (this.leftTableViewType) {
            case ViewType.roleGroups:
              this.store.dispatch(new FetchResponsibilityEntityPerformance({
                entityType: EntityPeopleType[parameters.row.descriptionRow0],
                entities: this.currentState.responsibilities.groupedEntities[EntityPeopleType[parameters.row.descriptionRow0]],
                filter: this.filterState,
                entitiesTotalPerformances: parameters.row,
                viewType: ViewType.people
              }));
              break;
            case ViewType.people:
              this.store.dispatch(new FetchResponsibilitiesAction({
                positionId: parameters.row.metadata.positionId,
                filter: this.filterState
              }));
              break;
            case ViewType.accounts:
              this.store.dispatch(new FetchSubAccountsAction({
                accountId: parameters.row.metadata.positionId,
                positionId: this.currentState.responsibilities.positionId,
                premiseType: this.filterState.premiseType
              }));
              break;
            default:
              console.log('clicked on left row:', parameters.row);
        }
      }
    }
  }

  public handleBreadcrumbEntityClicked(event: BreadcrumbEntityClickedEvent): void {
    const { trail, entity } = event;
    const indexOffset = 1;
    const stepsBack = trail.length - indexOffset - trail.indexOf(entity);
    if (stepsBack < 1) return;
    this.store.dispatch(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction(stepsBack));
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
