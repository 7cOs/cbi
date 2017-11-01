import { Component, OnDestroy, OnInit, Inject } from '@angular/core';

import { isEqual } from 'lodash';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';

import { AccountDashboardStateParameters } from '../../models/account-dashboard-state-parameters.model';
import { ActionStatus } from '../../enums/action-status.enum';
import { AppState } from '../../state/reducers/root.reducer';
import { BreadcrumbEntityClickedEvent } from '../../models/breadcrumb-entity-clicked-event.model';
import { ColumnType } from '../../enums/column-type.enum';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
import { DateRange } from '../../models/date-range.model';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { EntityType } from '../../enums/entity-responsibilities.enum';
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
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import { RowType } from '../../enums/row-type.enum';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';
import { WindowService } from '../../services/window.service';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';

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
  public fetchResponsibilitiesFailure: boolean = false;
  public fetchProductMetricsFailure: boolean = false;
  public productMetricsFetching: boolean;
  public productMetricsViewType: ProductMetricsViewType;
  public responsibilitiesFetching: boolean;
  public salesHierarchyViewType: SalesHierarchyViewType;
  public selectedBrandCode: string;
  public showLeftBackButton = false;
  public showProductMetricsContributionToVolume: boolean = true;
  public showSalesContributionToVolume: boolean = false;
  public sortingCriteria: Array<SortingCriteria> = [{
    columnType: ColumnType.metricColumn0,
    ascending: false
  }];
  public totalRowData: MyPerformanceTableRow;
  public dateRange: DateRange;
  public dateRangeState: DateRangesState;
  public performanceMetric: string;
  public tableHeaderRowLeft: Array<string> = ['PEOPLE', 'DEPLETIONS', 'CTV'];
  public tableHeaderRowRight: Array<string> = ['BRAND', 'DEPLETIONS', 'CTV'];

  private currentState: MyPerformanceEntitiesData;
  private defaultUserPremiseType: PremiseTypeValue;
  private entityType: EntityType;
  private filterState: MyPerformanceFilterState;
  private dateRangeSubscription: Subscription;
  private filterStateSubscription: Subscription;
  private myPerformanceCurrentSubscription: Subscription;
  private myPerformanceVersionSubscription: Subscription;
  private productMetrics: Array<MyPerformanceTableRow>;
  private productMetricsSelectedBrandRow: MyPerformanceTableRow;
  private productMetricsSubscription: Subscription;
  private salesHierarchy: Array<MyPerformanceTableRow>;
  private selectedSkuPackageCode: string;
  private versions: MyPerformanceEntitiesData[];

  constructor(
    private store: Store<AppState>,
    private myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService,
    @Inject('userService') private userService: any,
    @Inject('$state') private $state: any,
    private myPerformanceService: MyPerformanceService,
    private titleService: Title,
    private windowService: WindowService
  ) { }

  ngOnInit() {
    this.titleService.setTitle(this.$state.current.title);
    this.dateRangeSubscription = this.store
      .select(state => state.dateRanges)
      .subscribe((dateRangeState: DateRangesState)  => {
        if (dateRangeState.status === ActionStatus.Fetched) {
          this.dateRangeState = dateRangeState;
          this.setSelectedDateRangeValues();
        }
    });

    this.filterStateSubscription = this.store
      .select(state => state.myPerformanceFilter)
      .subscribe((filterState: MyPerformanceFilterState)  => {
        this.filterState = filterState;
        const currentMetricName = this.myPerformanceService.getMetricValueName(filterState.metricType);
        this.showSalesContributionToVolume = this.getShowSalesContributionToVolume();
        this.showProductMetricsContributionToVolume = this.getShowProductMetricsContributionToVolume();
        this.performanceMetric = currentMetricName;
        this.tableHeaderRowLeft[1] = currentMetricName;
        this.tableHeaderRowRight[1] = currentMetricName;
        this.setSelectedDateRangeValues();
    });

    this.productMetricsSubscription = this.store
      .select(state => state.myPerformanceProductMetrics)
      .subscribe((productMetrics: ProductMetricsState) => {
        this.fetchProductMetricsFailure = productMetrics && productMetrics.status === ActionStatus.Error;
        this.productMetricsFetching = productMetrics.status === ActionStatus.Fetching;
        this.productMetricsViewType = productMetrics.productMetricsViewType;

        if (productMetrics.status === ActionStatus.Fetched && !this.fetchProductMetricsFailure) {
          this.productMetrics = this.myPerformanceTableDataTransformerService.getRightTableData(
            productMetrics.products,
            this.productMetricsViewType
          );
          this.productMetricsSelectedBrandRow =
            (this.productMetricsViewType === ProductMetricsViewType.skus && productMetrics.selectedBrandCodeValues)
            ? this.myPerformanceTableDataTransformerService.getProductMetricsSelectedBrandRow(productMetrics.selectedBrandCodeValues)
            : null;
        }

        if (this.selectedBrandCode
          && productMetrics.productMetricsViewType === ProductMetricsViewType.skus
          && this.productMetrics
          && this.productMetrics.length === 0) {
          this.deselectBrandValue();
        }
      });

    this.myPerformanceCurrentSubscription = this.store
      .select(state => state.myPerformance.current)
      .subscribe((current: MyPerformanceEntitiesData) => {
        this.currentState = current;
        this.responsibilitiesFetching = this.isFetchingResponsibilities();
        this.salesHierarchyViewType = current.salesHierarchyViewType.viewType;

         // TODO: compare both selected brands to trigger or not a refresh
        this.selectedBrandCode = current.selectedBrandCode || this.selectedBrandCode;

        this.showSalesContributionToVolume = this.getShowSalesContributionToVolume();

        this.fetchResponsibilitiesFailure = current.responsibilities && current.responsibilities.status === ActionStatus.Error;

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
    const currentUserFullName = `${this.userService.model.currentUser.firstName} ${this.userService.model.currentUser.lastName}`;

    if (this.filterState) {
      this.defaultUserPremiseType = this.myPerformanceService.getUserDefaultPremiseType(
        this.filterState.metricType, this.userService.model.currentUser.srcTypeCd[0]);

      this.store.dispatch(new MyPerformanceFilterActions.SetPremiseType( this.defaultUserPremiseType ));
      this.store.dispatch(new ResponsibilitiesActions.FetchResponsibilities({
        positionId: currentUserId,
        filter: this.filterState,
        selectedEntityDescription: currentUserFullName
      }));
      this.store.dispatch(new ProductMetricsActions.FetchProductMetrics({
        positionId: currentUserId,
        filter: this.filterState,
        selectedEntityType: EntityType.Person,
        selectedBrandCode: this.selectedBrandCode
      }));
    }
  }

  ngOnDestroy() {
    this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceState());
    this.filterStateSubscription.unsubscribe();
    this.myPerformanceCurrentSubscription.unsubscribe();
    this.myPerformanceVersionSubscription.unsubscribe();
    this.productMetricsSubscription.unsubscribe();
    this.dateRangeSubscription.unsubscribe();
  }

  public handleSublineClicked(row: MyPerformanceTableRow): void {
    let accountDashboardStateParams: AccountDashboardStateParameters;
    if (row.metadata.entityType === EntityType.Distributor) {
      accountDashboardStateParams =
        this.myPerformanceService.accountDashboardStateParameters(this.isInsideAlternateHierarchy(), this.filterState, row);
    } else if (row.metadata.entityType === EntityType.SubAccount) {
      const accountName = Object.keys(this.currentState.responsibilities.groupedEntities)[0];
      const hierarchyEntity: HierarchyEntity = this.currentState.responsibilities.groupedEntities[accountName]
        .find(groupedEntity => groupedEntity.positionId === row.metadata.positionId);
      let premiseType: PremiseTypeValue;
      if (hierarchyEntity) {
        premiseType = hierarchyEntity.premiseType;
        accountDashboardStateParams = this.myPerformanceService.accountDashboardStateParameters(this.isInsideAlternateHierarchy(),
          this.filterState, row, premiseType);
      } else {
        accountDashboardStateParams = this.myPerformanceService.accountDashboardStateParameters(this.isInsideAlternateHierarchy(),
          this.filterState, row);
      }
    }

    const accountDashboardUrl = this.$state.href('accounts', accountDashboardStateParams);
    const currentWindow = this.windowService.nativeWindow();
    currentWindow.open(accountDashboardUrl, '_blank');
  }

  public deselectBrandValue(): void {
    this.selectedBrandCode = null;
    this.store.dispatch(new MyPerformanceVersionActions.RemoveMyPerformanceSelectedBrandCode());
    this.store.dispatch(new ProductMetricsActions.DeselectBrandValues());
    if (!this.isInsideAlternateHierarchy()) {
      this.fetchProductMetricsWhenClick({leftSide: false, type: RowType.dismissableTotal, index: 0});
    }

    this.store.dispatch(new ResponsibilitiesActions.RefreshAllPerformances({ // TODO: Make so this sets to fetching, so loader appears
      positionId: this.currentState.responsibilities.positionId,
      groupedEntities: this.currentState.responsibilities.groupedEntities,
      hierarchyGroups: this.currentState.responsibilities.hierarchyGroups,
      selectedEntityType: this.currentState.selectedEntityType,
      selectedEntityTypeCode: this.currentState.responsibilities.entityTypeCode, // TODO: Is this correct?
      salesHierarchyViewType: this.salesHierarchyViewType,
      filter: this.filterState,
      entityType: this.currentState.selectedEntityType,
      alternateHierarchyId: this.currentState.responsibilities.alternateHierarchyId,
      accountPositionId: this.currentState.responsibilities.accountPositionId
    }));
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
    const previousState: MyPerformanceEntitiesData = this.versions[previousIndex];

    this.handlePreviousStateVersion(previousState, 1);
  }

  public handleBreadcrumbEntityClicked(event: BreadcrumbEntityClickedEvent): void {
    const { trail, entityDescription } = event;
    const indexOffset: number = 1;
    const stepsBack: number = trail.length - indexOffset - trail.indexOf(entityDescription);
    const clickedIndex: number = this.versions.length - stepsBack;
    const clickedState: MyPerformanceEntitiesData = this.versions[clickedIndex];
    if (stepsBack < 1) return;

    this.handlePreviousStateVersion(clickedState, stepsBack);
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
    this.store.dispatch(new MyPerformanceVersionActions.SaveMyPerformanceState(Object.assign({}, this.currentState, {
      filter: this.filterState
    })));
    this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(parameters.row.metadata.entityType));

    switch (this.salesHierarchyViewType) {
      case SalesHierarchyViewType.roleGroups:
        const entityTypeGroupName = EntityPeopleType[parameters.row.metadata.entityName];

        if (parameters.row.metadata.alternateHierarchyId) {
          this.store.dispatch(new ResponsibilitiesActions.SetAlternateHierarchyId(parameters.row.metadata.alternateHierarchyId));
        }

        this.store.dispatch(new ResponsibilitiesActions.FetchEntityWithPerformance({
          positionId: parameters.row.metadata.positionId,
          alternateHierarchyId: this.currentState.responsibilities.alternateHierarchyId,
          entityTypeGroupName: entityTypeGroupName,
          entityTypeCode: parameters.row.metadata.entityTypeCode,
          entityType: parameters.row.metadata.entityType,
          entities: this.currentState.responsibilities.groupedEntities[entityTypeGroupName],
          filter: this.filterState,
          selectedEntityDescription: parameters.row.descriptionRow0,
          brandCode: this.selectedBrandCode
        }));

        // Product metrics call not ready when clicking on accounts group, so second condition can be removed when ready
        if (!parameters.row.metadata.alternateHierarchyId && parameters.row.descriptionRow0 !== 'ACCOUNTS') {
          this.fetchProductMetricsWhenClick(parameters);
        }
        break;
      case SalesHierarchyViewType.people:
        if (this.isInsideAlternateHierarchy()) {
          this.store.dispatch(new ResponsibilitiesActions.FetchAlternateHierarchyResponsibilities({
            positionId: parameters.row.metadata.positionId,
            alternateHierarchyId: this.currentState.responsibilities.alternateHierarchyId,
            filter: this.filterState,
            selectedEntityDescription: parameters.row.descriptionRow0,
            brandCode: this.selectedBrandCode
          }));
        } else {
          this.store.dispatch(new ResponsibilitiesActions.FetchResponsibilities({
            positionId: parameters.row.metadata.positionId,
            filter: this.filterState,
            selectedEntityDescription: parameters.row.descriptionRow0,
            brandCode: this.selectedBrandCode
          }));
          this.fetchProductMetricsWhenClick(parameters);
        }
        break;
      case SalesHierarchyViewType.accounts:
        this.store.dispatch(new ResponsibilitiesActions.FetchSubAccounts({
          positionId: parameters.row.metadata.positionId,
          contextPositionId: this.currentState.responsibilities.positionId,
          entityTypeAccountName: parameters.row.descriptionRow0,
          selectedPositionId: parameters.row.metadata.positionId,
          filter: this.filterState,
          selectedEntityDescription: parameters.row.descriptionRow0,
          brandCode: this.currentState.selectedBrandCode
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
        if (!this.isInsideAlternateHierarchy()) {
          this.fetchProductMetricsWhenClick(parameters);
        }

        if (parameters.row.metadata.brandCode) {
          this.store.dispatch(new ResponsibilitiesActions.RefreshAllPerformances({
            positionId: this.currentState.responsibilities.positionId,
            groupedEntities: this.currentState.responsibilities.groupedEntities,
            hierarchyGroups: this.currentState.responsibilities.hierarchyGroups,
            selectedEntityType: this.currentState.selectedEntityType,
            selectedEntityTypeCode: this.currentState.responsibilities.entityTypeCode, // TODO: Is this correct?
            salesHierarchyViewType: this.salesHierarchyViewType,
            filter: this.filterState,
            brandCode: parameters.row.metadata.brandCode,
            entityType: this.currentState.selectedEntityType,
            alternateHierarchyId: this.currentState.responsibilities.alternateHierarchyId,
            accountPositionId: this.currentState.responsibilities.accountPositionId
          }));
        }
        break;
      case ProductMetricsViewType.skus:
        if (parameters.row) {
          this.selectedSkuPackageCode = parameters.row.metadata.skuPackageCode;
          this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedSkuCode({
            skuPackageCode: parameters.row.metadata.skuPackageCode,
            skuPackageType: parameters.row.metadata.skuPackageType
          }));
        } else {
          this.selectedSkuPackageCode = null;
          this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
        }
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
    const actionParameters: ProductMetricsActions.FetchProductMetricsPayload = {
      positionId: parameters.row
        ? parameters.row.metadata.positionId || this.currentState.responsibilities.positionId
        : this.currentState.responsibilities.positionId,
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

        case SalesHierarchyViewType.subAccounts:
          actionParameters.positionId = this.currentState.responsibilities.accountPositionId;
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

  private isFetchingResponsibilities(): boolean {
    return this.currentState.responsibilities &&
    (this.currentState.responsibilities.status === ActionStatus.Fetching ||
      this.currentState.responsibilities.responsibilitiesStatus === ActionStatus.Fetching ||
      this.currentState.responsibilities.entitiesPerformanceStatus === ActionStatus.Fetching ||
      this.currentState.responsibilities.totalPerformanceStatus === ActionStatus.Fetching ||
      this.currentState.responsibilities.subaccountsStatus === ActionStatus.Fetching);
  }

  private handlePreviousStateVersion(previousState: MyPerformanceEntitiesData, versionStepsBack: number): void {
    if (isEqual(this.filterState, previousState.filter)) {
      this.store.dispatch(new MyPerformanceVersionActions.RestoreMyPerformanceState(versionStepsBack));
    } else {
      // Todo: dispatch action to trigger data refresh
      // Todo: This is temporary just to keep things working as they are, remove once actual refresh is do-able
      this.store.dispatch(new MyPerformanceVersionActions.RestoreMyPerformanceState(versionStepsBack));
    }

    this.fetchProductMetricsForPreviousState(previousState);
  }

  private setSelectedDateRangeValues(): void {
    if (this.dateRangeState && this.filterState) {
      this.dateRange = this.dateRangeState[DateRangeTimePeriodValue[this.filterState.dateRangeCode]];
    }
  }
}
