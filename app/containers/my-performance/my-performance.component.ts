import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { AccountDashboardStateParameters } from '../../models/account-dashboard-state-parameters.model';
import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { BreadcrumbEntityClickedEvent } from '../../models/breadcrumb-entity-clicked-event.model';
import { ColumnType } from '../../enums/column-type.enum';
import { FetchAlternateHierarchyResponsibilities,
         FetchEntityWithPerformance,
         FetchResponsibilities,
         FetchSubAccountsAction,
         SetAlternateHierarchyId } from '../../state/actions/responsibilities.action';
import { DateRange } from '../../models/date-range.model';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { EntityType } from '../../enums/entity-responsibilities.enum';
import { FetchProductMetricsAction } from '../../state/actions/product-metrics.action';
import { getDateRangeMock } from '../../models/date-range.model.mock';
import { HierarchyEntity } from '../../models/hierarchy-entity.model';
import * as MyPerformanceFilterActions from '../../state/actions/my-performance-filter.action';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent } from '../../models/my-performance-filter.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { MyPerformanceService } from '../../services/my-performance.service';
import { MyPerformanceEntitiesData } from '../../state/reducers/my-performance.reducer';
import * as MyPerformanceVersionActions from '../../state/actions/my-performance-version.action';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { RowType } from '../../enums/row-type.enum';
import { SelectedEntityType } from '../../enums/selected-entity-type.enum';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { ViewType } from '../../enums/view-type.enum';
import { WindowService } from '../../services/window.service';

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
  public showOpportunities: boolean = true;

  private currentState: MyPerformanceEntitiesData;
  private versions: MyPerformanceEntitiesData[];
  private dateRanges$: Observable<DateRangesState>;
  private filterState: MyPerformanceFilterState;
  private filterStateSubscription: Subscription;
  private myPerformanceCurrentSubscription: Subscription;
  private myPerformanceVersionSubscription: Subscription;
  private productMetricsSubscription: Subscription;
  private productPerformance: Array<MyPerformanceTableRow>;
  private salesHierarchy: Array<MyPerformanceTableRow>;
  private salesHierarchyTotal: MyPerformanceTableRow;
  private defaultUserPremiseType: PremiseTypeValue;

  constructor(
    private store: Store<AppState>,
    private myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService,
    @Inject('userService') private userService: any,
    @Inject('$state') private $state: any,
    private myPerformanceService: MyPerformanceService,
    private windowService: WindowService
  ) { }

  ngOnInit() {
    this.currentUserFullName = `${this.userService.model.currentUser.firstName} ${this.userService.model.currentUser.lastName}`;
    this.dateRanges$ = this.store.select(state => state.dateRanges);
    this.performanceStateVersions$ = this.store.select(state => state.myPerformance.versions);

    this.filterStateSubscription = this.store.select(state => state.myPerformanceFilter).subscribe(filterState => {
      this.filterState = filterState;
    });

    this.productMetricsSubscription = this.store
      .select(state => state.myPerformanceProductMetrics)
      .subscribe(productMetrics => {
        if (productMetrics.products && productMetrics.status === ActionStatus.Fetched) {
          this.productPerformance = this.myPerformanceTableDataTransformerService
            .getRightTableData(productMetrics.products);
        }
    });

    this.myPerformanceCurrentSubscription = this.store
      .select(state => state.myPerformance.current)
      .subscribe((current: MyPerformanceEntitiesData) => {
        this.currentState = current;
        this.leftTableViewType = current.viewType.leftTableViewType;

        if (current.responsibilities && current.responsibilities.status === ActionStatus.Fetched) {
          this.salesHierarchy = this.myPerformanceTableDataTransformerService.getLeftTableData(
            current.responsibilities.entityWithPerformance
          );
        }

        if (current.responsibilities.entityWithPerformance) {
          this.salesHierarchyTotal = this.myPerformanceTableDataTransformerService
            .getTotalRowData(current.responsibilities.entitiesTotalPerformances);
        }

    });

    this.myPerformanceVersionSubscription = this.store.select(state => state.myPerformance.versions)
      .subscribe((versions: MyPerformanceEntitiesData[]) => {
        this.versions = versions;
        this.showLeftBackButton = versions.length > 0;
    });

    const currentUserId = this.userService.model.currentUser.positionId || CORPORATE_USER_POSITION_ID;
    this.defaultUserPremiseType = this.myPerformanceService.getUserDefaultPremiseType(
      this.filterState.metricType, this.userService.model.currentUser.srcTypeCd[0]);

    this.store.dispatch(new MyPerformanceFilterActions.SetPremiseType( this.defaultUserPremiseType ));
    this.store.dispatch(new FetchResponsibilities({ positionId: currentUserId, filter: this.filterState }));
    this.store.dispatch(new FetchProductMetricsAction({
      positionId: currentUserId,
      filter: this.filterState,
      selectedEntityType: SelectedEntityType.Position
    }));
  }

  ngOnDestroy() {
    this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceStateAction());
    this.filterStateSubscription.unsubscribe();
    this.myPerformanceCurrentSubscription.unsubscribe();
    this.myPerformanceVersionSubscription.unsubscribe();
    this.productMetricsSubscription.unsubscribe();
  }

  public handleSublineClicked(row: MyPerformanceTableRow): void {
    let accountDashboardStateParams: AccountDashboardStateParameters;
    if (row.metadata.entityType === EntityType.Distributor) {
      accountDashboardStateParams = this.myPerformanceService.accountDashboardStateParameters(this.filterState, row);
    } else if (row.metadata.entityType === EntityType.SubAccount) {
      const accountName = Object.keys(this.currentState.responsibilities.groupedEntities)[0];
      const hierarchyEntity: HierarchyEntity = this.currentState.responsibilities.groupedEntities[accountName]
        .find(groupedEntity => groupedEntity.positionId === row.metadata.positionId);
      let premiseType: PremiseTypeValue;
      if (hierarchyEntity) {
        premiseType = hierarchyEntity.premiseType;
        accountDashboardStateParams = this.myPerformanceService.accountDashboardStateParameters(this.filterState, row, premiseType);
      } else {
        accountDashboardStateParams = this.myPerformanceService.accountDashboardStateParameters(this.filterState, row);
      }

    }

    const accountDashboardUrl = this.$state.href('accounts', accountDashboardStateParams);
    const currentWindow = this.windowService.nativeWindow();
    currentWindow.open(accountDashboardUrl, '_blank');
  }

  public handleSortRows(criteria: SortingCriteria[]): void {
    this.sortingCriteria = criteria;
  }

  public handleElementClicked(parameters: HandleElementClickedParameters): void {
    switch (parameters.type) {
      case RowType.total:
        if (parameters.leftSide) {
          if (this.showLeftBackButton) {
            const previousIndex: number = this.versions.length - 1;
            const previousState = this.versions[previousIndex];
            this.store.dispatch(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());
            this.fetchProductMetricsForPreviousState(previousState);
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
              const entityTypeGroupName = EntityPeopleType[parameters.row.metadata.entityName];

              if (parameters.row.metadata.alternateHierarchyId) {
                this.store.dispatch(new SetAlternateHierarchyId(parameters.row.metadata.alternateHierarchyId));
              }
              this.store.dispatch(new FetchEntityWithPerformance({
                selectedPositionId: parameters.row.metadata.positionId,
                alternateHierarchyId: this.currentState.responsibilities.alternateHierarchyId,
                entityTypeGroupName: entityTypeGroupName,
                entityTypeCode: parameters.row.metadata.entityTypeCode,
                entityType: parameters.row.metadata.entityType,
                entities: this.currentState.responsibilities.groupedEntities[entityTypeGroupName],
                filter: this.filterState
              }));
              this.store.dispatch(new FetchProductMetricsAction({
                positionId: parameters.row.metadata.positionId,
                entityTypeCode: parameters.row.metadata.entityTypeCode,
                filter: this.filterState,
                selectedEntityType: SelectedEntityType.RoleGroup
              }));
              break;
            case ViewType.people:
              if (this.isInsideAlternateHierarchy()) {
                this.store.dispatch(new FetchAlternateHierarchyResponsibilities({
                  positionId: parameters.row.metadata.positionId,
                  alternateHierarchyId: this.currentState.responsibilities.alternateHierarchyId,
                  filter: this.filterState
                }));
              } else {
                this.store.dispatch(new FetchResponsibilities({
                  positionId: parameters.row.metadata.positionId,
                  filter: this.filterState
                }));
              }
              this.store.dispatch(new FetchProductMetricsAction({
                positionId: parameters.row.metadata.positionId,
                filter: this.filterState,
                selectedEntityType: SelectedEntityType.Position
              }));
              break;
            case ViewType.accounts:
              this.store.dispatch(new FetchSubAccountsAction({
                positionId: parameters.row.metadata.positionId,
                contextPositionId: this.currentState.responsibilities.positionId,
                entityTypeAccountName: parameters.row.descriptionRow0,
                selectedPositionId: parameters.row.metadata.positionId,
                filter: this.filterState
              }));
              this.store.dispatch(new FetchProductMetricsAction({
                positionId: parameters.row.metadata.positionId,
                contextPositionId: this.currentState.responsibilities.positionId,
                filter: this.filterState,
                selectedEntityType: SelectedEntityType.Account
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
    const clickedIndex: number = this.versions.length - stepsBack;
    const clickedState = this.versions[clickedIndex];
    if (stepsBack < 1) return;
    this.store.dispatch(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction(stepsBack));
    this.fetchProductMetricsForPreviousState(clickedState);
  }

  public filterOptionSelected(event: MyPerformanceFilterEvent): void {
    switch (event.filterType) {
      case MyPerformanceFilterActionType.Metric:
        this.store.dispatch(new MyPerformanceFilterActions.SetMetric(event.filterValue));
        this.defaultUserPremiseType = this.myPerformanceService.getUserDefaultPremiseType(
          this.filterState.metricType, this.userService.model.currentUser.srcTypeCd[0]);
        this.store.dispatch(new MyPerformanceFilterActions.SetPremiseType(this.defaultUserPremiseType));
        break;
      case MyPerformanceFilterActionType.TimePeriod:
        this.store.dispatch(new MyPerformanceFilterActions.SetTimePeriod(event.filterValue));
        break;
      case MyPerformanceFilterActionType.PremiseType:
        this.store.dispatch(new MyPerformanceFilterActions.SetPremiseType(event.filterValue));
        break;
      case MyPerformanceFilterActionType.DistributionType:
        this.store.dispatch(new MyPerformanceFilterActions.SetDistributionType(event.filterValue));
        break;
      default:
        throw new Error(`My Performance Component: Filtertype of ${event.filterType} does not exist!`);
    }
  }

  private fetchProductMetricsForPreviousState(state: MyPerformanceEntitiesData) {
    if (state.viewType.leftTableViewType === ViewType.roleGroups
      || state.viewType.leftTableViewType === ViewType.accounts) {
      this.store.dispatch(new FetchProductMetricsAction({
        positionId: state.responsibilities.positionId,
        filter: this.filterState,
        selectedEntityType: SelectedEntityType.Position
      }));
    } else if (state.viewType.leftTableViewType === ViewType.people) {
      this.store.dispatch(new FetchProductMetricsAction({
        positionId: state.responsibilities.positionId,
        entityTypeCode: state.responsibilities.entityTypeCode,
        filter: this.filterState,
        selectedEntityType: SelectedEntityType.RoleGroup
      }));
    }
  }

  private isInsideAlternateHierarchy(): boolean {
    return !!this.currentState.responsibilities.alternateHierarchyId;
  }
}
