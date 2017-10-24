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
         FetchSubAccounts,
         SetAlternateHierarchyId } from '../../state/actions/responsibilities.action';
import { DateRange } from '../../models/date-range.model';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { EntityType } from '../../enums/entity-responsibilities.enum';
import { getDateRangeMock } from '../../models/date-range.model.mock';
import { HierarchyEntity } from '../../models/hierarchy-entity.model';
import { MetricTypeValue } from '../../enums/metric-type.enum';
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
import * as ProductMetricsActions from '../../state/actions/product-metrics.action';
import { ProductMetricsState } from '../../state/reducers/product-metrics.reducer';
import { RowType } from '../../enums/row-type.enum';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
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
  public fetchResponsibilitiesFailure: boolean = false;
  public fetchProductMetricsFailure: boolean = false;
  public performanceStateVersions$: Observable<MyPerformanceEntitiesData[]>;
  public productMetricsFetching: boolean;
  public productMetricsViewType: ProductMetricsViewType;
  public responsibilitiesFetching: boolean;
  public salesHierarchyViewType: SalesHierarchyViewType;
  public showLeftBackButton = false;
  public showProductMetricsContributionToVolume: boolean = true;
  public showSalesContributionToVolume: boolean = false;
  public sortingCriteria: Array<SortingCriteria> = [{
    columnType: ColumnType.metricColumn0,
    ascending: false
  }];
  public totalRowData: MyPerformanceTableRow;

  // mocks
  public dateRange: DateRange = getDateRangeMock();
  public performanceMetric: string = 'Depletions';
  public tableHeaderRowLeft: Array<string> = ['PEOPLE', 'DEPLETIONS', 'CTV'];
  public tableHeaderRowRight: Array<string> = ['BRAND', 'DEPLETIONS', 'CTV'];

  private currentState: MyPerformanceEntitiesData;
  private dateRanges$: Observable<DateRangesState>;
  private defaultUserPremiseType: PremiseTypeValue;
  private entityType: EntityType;
  private filterState: MyPerformanceFilterState;
  private filterStateSubscription: Subscription;
  private myPerformanceCurrentSubscription: Subscription;
  private myPerformanceVersionSubscription: Subscription;
  private productMetrics: Array<MyPerformanceTableRow>;
  private productMetricsSelectedBrandRow: MyPerformanceTableRow;
  private productMetricsSubscription: Subscription;
  private salesHierarchy: Array<MyPerformanceTableRow>;
  private selectedBrandCode: string;
  private versions: MyPerformanceEntitiesData[];

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
      this.showSalesContributionToVolume = this.getShowSalesContributionToVolume();
      this.showProductMetricsContributionToVolume = this.getShowProductMetricsContributionToVolume();
    });

    this.productMetricsSubscription = this.store
      .select(state => state.myPerformanceProductMetrics)
      .subscribe((productMetrics: ProductMetricsState) => {
        this.productMetricsFetching = productMetrics.status === ActionStatus.Fetching;
        this.productMetricsViewType = productMetrics.productMetricsViewType;

        this.fetchProductMetricsFailure = productMetrics.status === ActionStatus.Error
          || (productMetrics.products && Object.keys(productMetrics.products).length === 0);

        if (productMetrics.status === ActionStatus.Fetched && !this.fetchProductMetricsFailure) {
          this.productMetrics = this.myPerformanceTableDataTransformerService.getRightTableData(productMetrics.products);
          this.productMetricsSelectedBrandRow = this.productMetricsViewType === ProductMetricsViewType.skus
            ? this.myPerformanceTableDataTransformerService.getProductMetricsSelectedBrandRow(productMetrics.selectedBrandCodeValues)
            : null;
        }
      });

    this.myPerformanceCurrentSubscription = this.store
      .select(state => state.myPerformance.current)
      .subscribe((current: MyPerformanceEntitiesData) => {
        this.responsibilitiesFetching = current.responsibilities &&
        (current.responsibilities.status === ActionStatus.Fetching ||
        current.responsibilities.responsibilitiesStatus === ActionStatus.Fetching ||
        current.responsibilities.entitiesPerformanceStatus === ActionStatus.Fetching ||
        current.responsibilities.totalPerformanceStatus === ActionStatus.Fetching ||
        current.responsibilities.subaccountsStatus === ActionStatus.Fetching);
        this.currentState = current;
        this.salesHierarchyViewType = current.salesHierarchyViewType.viewType;

         // TODO: compare both selected brands to trigger or not a refresh
        this.selectedBrandCode = current.selectedBrandCode || this.selectedBrandCode;

        this.showSalesContributionToVolume = this.getShowSalesContributionToVolume();

        this.fetchResponsibilitiesFailure = current.responsibilities &&
            (current.responsibilities.status === ActionStatus.Error ||
             current.responsibilities.groupedEntities && Object.keys(current.responsibilities.groupedEntities).length === 0);

        if (current.responsibilities && current.responsibilities.status === ActionStatus.Fetched && !this.fetchResponsibilitiesFailure) {
          this.salesHierarchy = this.myPerformanceTableDataTransformerService.getLeftTableData(
            current.responsibilities.entityWithPerformance, this.isInsideAlternateHierarchy()
          );
        }

        if (current.responsibilities.entityWithPerformance.length) {
          this.entityType = current.responsibilities.entityWithPerformance[0].entityType;
        }

        if (current.responsibilities.entityWithPerformance && !this.fetchProductMetricsFailure) {
          this.totalRowData = this.myPerformanceTableDataTransformerService
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
    this.store.dispatch(new ProductMetricsActions.FetchProductMetrics({
      positionId: currentUserId,
      filter: this.filterState,
      selectedEntityType: EntityType.Person,
      selectedBrandCode: this.selectedBrandCode
    }));
  }

  ngOnDestroy() {
    this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceState());
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
          console.log(`clicked on cell ${parameters.index} from the left side`);
        } else {
          console.log(`clicked on cell ${parameters.index} from the right side`);
        }
        break;

      case RowType.data:
      default:
        if (parameters.leftSide) {
          this.handleLeftRowDataElementClicked(parameters);
        } else {
          this.handleRightRowDataElementClicked(parameters);
      }
    }
  }

  public handleBackButtonClicked(): void {
    const previousIndex: number = this.versions.length - 1;
    const previousState = this.versions[previousIndex];
    this.store.dispatch(new MyPerformanceVersionActions.RestoreMyPerformanceState());
    this.fetchProductMetricsForPreviousState(previousState);
  }

  public handleBreadcrumbEntityClicked(event: BreadcrumbEntityClickedEvent): void {
    const { trail, entity } = event;
    const indexOffset = 1;
    const stepsBack = trail.length - indexOffset - trail.indexOf(entity);
    const clickedIndex: number = this.versions.length - stepsBack;
    const clickedState = this.versions[clickedIndex];
    if (stepsBack < 1) return;
    this.store.dispatch(new MyPerformanceVersionActions.RestoreMyPerformanceState(stepsBack));
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

  public displayRightTotalRow(): boolean {
    return this.salesHierarchyViewType === SalesHierarchyViewType.roleGroups
        || this.entityType === EntityType.RoleGroup
        || this.entityType === EntityType.DistributorGroup;
  }

  private handleLeftRowDataElementClicked(parameters: HandleElementClickedParameters): void {
    this.store.dispatch(new MyPerformanceVersionActions.SaveMyPerformanceState(this.currentState));
    this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedEntity(parameters.row.descriptionRow0));
    this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(parameters.row.metadata.entityType));

    switch (this.salesHierarchyViewType) {
      case SalesHierarchyViewType.roleGroups:
        const entityTypeGroupName = EntityPeopleType[parameters.row.metadata.entityName];

        if (parameters.row.metadata.alternateHierarchyId) {
          this.store.dispatch(new SetAlternateHierarchyId(parameters.row.metadata.alternateHierarchyId));
        }
        this.store.dispatch(new FetchEntityWithPerformance({
          selectedPositionId: parameters.row.metadata.positionId,
          entityTypeGroupName: entityTypeGroupName,
          entityTypeCode: parameters.row.metadata.entityTypeCode,
          entityType: parameters.row.metadata.entityType,
          entities: this.currentState.responsibilities.groupedEntities[entityTypeGroupName],
          filter: this.filterState
        }));
        // Product metrics call not ready when clicking on accounts group, so second condition can be removed when ready
        if (!parameters.row.metadata.alternateHierarchyId && parameters.row.descriptionRow0 !== 'ACCOUNTS') {
          this.fetchProductMetricsWhenClick(parameters);
        }
        break;
      case SalesHierarchyViewType.people:
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
          this.fetchProductMetricsWhenClick(parameters);
        }
        break;
      case SalesHierarchyViewType.accounts:
        this.store.dispatch(new FetchSubAccounts({
          positionId: parameters.row.metadata.positionId,
          contextPositionId: this.currentState.responsibilities.positionId,
          entityTypeAccountName: parameters.row.descriptionRow0,
          selectedPositionId: parameters.row.metadata.positionId,
          filter: this.filterState
        }));
        if (!this.isInsideAlternateHierarchy()) {
          this.fetchProductMetricsWhenClick(parameters);
        }
        break;
      default:
        console.log('clicked on left row:', parameters.row);
    }
  }

  private handleRightRowDataElementClicked(parameters: HandleElementClickedParameters): void {
    switch (this.productMetricsViewType) {
      case ProductMetricsViewType.brands:
        this.selectedBrandCode = parameters.row.metadata.brandCode;
        this.store.dispatch(new ProductMetricsActions.SelectBrandValues(parameters.row.metadata.brandCode));
        this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedBrandCode(parameters.row.metadata.brandCode));
        this.fetchProductMetricsWhenClick(parameters);
        break;
      default:
        console.log('clicked on right row:', parameters.row);
    }
  }

  private fetchProductMetricsForPreviousState(state: MyPerformanceEntitiesData) {
    if (state.salesHierarchyViewType.viewType === SalesHierarchyViewType.roleGroups
      || state.salesHierarchyViewType.viewType === SalesHierarchyViewType.accounts) {
      this.store.dispatch(new ProductMetricsActions.FetchProductMetrics({
        positionId: state.responsibilities.positionId,
        filter: this.filterState,
        selectedEntityType: EntityType.Person,
        selectedBrandCode: this.selectedBrandCode
      }));
    } else if (state.salesHierarchyViewType.viewType === SalesHierarchyViewType.people) {
      this.store.dispatch(new ProductMetricsActions.FetchProductMetrics({
        positionId: state.responsibilities.positionId,
        entityTypeCode: state.responsibilities.entityTypeCode,
        filter: this.filterState,
        selectedEntityType: EntityType.RoleGroup,
        selectedBrandCode: this.selectedBrandCode
      }));
    }
  }

  private fetchProductMetricsWhenClick(parameters: HandleElementClickedParameters) {
    let actionParameters: ProductMetricsActions.FetchProductMetricsPayload = {
      positionId: parameters.row.metadata.positionId || this.currentState.responsibilities.positionId,
      filter: this.filterState,
      selectedEntityType: this.currentState.selectedEntityType,
      selectedBrandCode: this.selectedBrandCode
    };

    if (parameters.leftSide) {
      switch (this.salesHierarchyViewType) {
        case SalesHierarchyViewType.roleGroups:
          actionParameters.entityTypeCode = parameters.row.metadata.entityTypeCode;
          actionParameters.selectedEntityType = EntityType.RoleGroup;
          break;
        case SalesHierarchyViewType.accounts:
          actionParameters.contextPositionId = this.currentState.responsibilities.positionId;
          actionParameters.selectedEntityType = EntityType.Account;
          break;
        case SalesHierarchyViewType.people:
          actionParameters.selectedEntityType = EntityType.Person;
          break;
        default:
          break;
        }
    } else {
      switch (this.salesHierarchyViewType) {
        case SalesHierarchyViewType.accounts:
          actionParameters.contextPositionId = this.currentState.responsibilities.positionId;
          break;
        case SalesHierarchyViewType.people:
          actionParameters.entityTypeCode = this.currentState.responsibilities.entityTypeCode;
          break;

        case SalesHierarchyViewType.roleGroups:
        default:
          break;
        }
    }

      this.store.dispatch(new ProductMetricsActions.FetchProductMetrics(actionParameters));
  }

  private getShowSalesContributionToVolume(): boolean {
    return this.salesHierarchyViewType && this.salesHierarchyViewType !== SalesHierarchyViewType.roleGroups
           && this.filterState && this.filterState.metricType === MetricTypeValue.volume;
  }

  private getShowProductMetricsContributionToVolume(): boolean {
    return this.filterState && this.filterState.metricType === MetricTypeValue.volume;
  }

  private isInsideAlternateHierarchy(): boolean {
    return !!this.currentState.responsibilities.alternateHierarchyId;
  }
}
