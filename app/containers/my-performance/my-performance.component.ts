import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { includes, isEqual } from 'lodash';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { Title } from '@angular/platform-browser';

import { AccountDashboardStateParameters } from '../../models/account-dashboard-state-parameters.model';
import { ActionStatus } from '../../enums/action-status.enum';
import { AnalyticsService } from '../../services/analytics.service';
import { AppState } from '../../state/reducers/root.reducer';
import { BreadcrumbEntityClickedEvent } from '../../models/breadcrumb-entity-clicked-event.model';
import { ColumnType } from '../../enums/column-type.enum';
import { DateRange } from '../../models/date-range.model';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { DrillStatus } from '../../enums/drill-status.enum';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { EntityType } from '../../enums/entity-responsibilities.enum';
import { getTeamPerformanceTableOpportunitiesMock } from '../../models/my-performance-table-row.model.mock';
import { HierarchyEntity } from '../../models/hierarchy-entity.model';
import { LoadingState } from '../../enums/loading-state.enum';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import * as MyPerformanceFilterActions from '../../state/actions/my-performance-filter.action';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent } from '../../models/my-performance-filter.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceTableRow, TeamPerformanceTableOpportunity } from '../../models/my-performance-table-row.model';
import { MyPerformanceService } from '../../services/my-performance.service';
import { MyPerformanceEntitiesData } from '../../state/reducers/my-performance.reducer';
import * as MyPerformanceVersionActions from '../../state/actions/my-performance-version.action';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import * as ProductMetricsActions from '../../state/actions/product-metrics.action';
import { ProductMetricsState } from '../../state/reducers/product-metrics.reducer';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import { ResponsibilitiesState } from '../../state/reducers/responsibilities.reducer';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
import { RowType } from '../../enums/row-type.enum';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';
import { SkuPackageType } from '../../enums/sku-package-type.enum';
import { SortingCriteria } from '../../models/sorting-criteria.model';
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
  public fetchResponsibilitiesFailure: boolean = false;
  public fetchProductMetricsFailure: boolean = false;
  public productMetricsFetching: boolean;
  public productMetricsViewType: ProductMetricsViewType;
  public responsibilitiesFetching: boolean;
  public selectedSkuPackageType: SkuPackageType;
  public salesHierarchyViewType: SalesHierarchyViewType;
  public salesHierarchyLoadingState: LoadingState = LoadingState.Loaded;
  public productMetricsLoadingState: LoadingState = LoadingState.Loaded;
  public showLeftBackButton = false;
  public showProductMetricsContributionToVolume: boolean = true;
  public showProductMetricsOpportunities: boolean = false;
  public showSalesContributionToVolume: boolean = false;
  public sortingCriteria: Array<SortingCriteria> = [{
    columnType: ColumnType.metricColumn0,
    ascending: false
  }];
  public totalRowData: MyPerformanceTableRow;
  public dateRange: DateRange;
  public dateRangeState: DateRangesState;
  public performanceMetric: string;

  // Mocks
  public teamPerformanceTableOpportunitiesMock: Array<TeamPerformanceTableOpportunity> = getTeamPerformanceTableOpportunitiesMock();
  public selectedProductNameMock: string = chance.string({ length: 20 });
  public selectedEntityNameMock: string = chance.string({ length: 20 });
  public selectedOpportunitiesTotal: number = chance.natural({ max: 999999999999 });

  private currentState: MyPerformanceEntitiesData;
  private currentUserId: string;
  private entityType: EntityType;
  private filterState: MyPerformanceFilterState;
  private dateRangeSubscription: Subscription;
  private filterStateSubscription: Subscription;
  private myPerformanceCurrentSubscription: Subscription;
  private myPerformanceVersionSubscription: Subscription;
  private productMetrics: Array<MyPerformanceTableRow>;
  private productMetricsState: ProductMetricsState;
  private productMetricsSelectedBrandRow: MyPerformanceTableRow;
  private productMetricsSubscription: Subscription;
  private responsibilitiesStatus: ActionStatus = ActionStatus.NotFetched;
  private salesHierarchy: Array<MyPerformanceTableRow>;
  private selectedBrandCode: string;
  private selectedSkuPackageCode: string;
  private selectedSubaccountCode: string;
  private selectedDistributorCode: string;
  private tableHeaderRowLeft: Array<string> = [
    this.myPerformanceService.getSalesHierarchyViewTypeLabel(SalesHierarchyViewType.roleGroups),
    'DEPLETIONS',
    'CTV'
  ];
  private tableHeaderRowRight: Array<string> = [
    this.myPerformanceService.getProductMetricsViewTypeLabel(ProductMetricsViewType.brands),
    'DEPLETIONS',
    'CTV'
  ];
  private versions: MyPerformanceEntitiesData[];
  private isOpportunityTableExtended: boolean = false;
  private currentPremiseTypeLabel: string;
  private drillStatus: DrillStatus;

  constructor(
    private store: Store<AppState>,
    private myPerformanceTableDataTransformerService: MyPerformanceTableDataTransformerService,
    @Inject('userService') private userService: any,
    @Inject('$state') private $state: any,
    private myPerformanceService: MyPerformanceService,
    private titleService: Title,
    private windowService: WindowService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    this.currentUserId = this.userService.model.currentUser.positionId || CORPORATE_USER_POSITION_ID;

    const currentUserFullName = `${this.userService.model.currentUser.firstName} ${this.userService.model.currentUser.lastName}`;
    const currentUserIsMemberOfExceptionHierarchy: boolean =
      includes(this.userService.model.currentUser.srcTypeCd, 'EXCPN_HIER');

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
        this.deselectSkuPackageIfNeeded(this.filterState, filterState);
        this.filterState = filterState;
        const currentMetricName = this.myPerformanceService.getMetricValueName(filterState.metricType);
        this.currentPremiseTypeLabel = this.myPerformanceService.getPremiseTypeStateLabel(filterState.premiseType);
        this.showSalesContributionToVolume = this.getShowSalesContributionToVolume();
        this.showProductMetricsContributionToVolume = this.getShowProductMetricsContributionToVolume();
        this.showProductMetricsOpportunities = this.shouldShowProductMetricsOpportunities();
        this.performanceMetric = currentMetricName;
        this.tableHeaderRowLeft[1] = currentMetricName;
        this.tableHeaderRowRight[1] = currentMetricName;
        this.isOpportunityTableExtended = false;
        this.setSelectedDateRangeValues();
        this.handleTeamPerformanceDataRefresh();

        if (this.currentState) {
          this.handleOpportunityCountFetch(
            this.currentState.selectedDistributorCode,
            this.currentState.selectedSubaccountCode,
            this.currentState.responsibilities.exceptionHierarchy);
        }
    });

    this.productMetricsSubscription = this.store
      .select(state => state.myPerformanceProductMetrics)
      .subscribe((productMetrics: ProductMetricsState) => {
        this.productMetricsState = productMetrics;
        this.fetchProductMetricsFailure = productMetrics && productMetrics.status === ActionStatus.Error;
        this.productMetricsFetching = this.isFetchingProductMetrics();
        this.updateLoaderStatus();
        this.productMetricsViewType = productMetrics.productMetricsViewType;
        this.tableHeaderRowRight[0] = this.myPerformanceService.getProductMetricsViewTypeLabel(productMetrics.productMetricsViewType);

        if (productMetrics.status === ActionStatus.Fetched && !this.fetchProductMetricsFailure) {
          this.productMetrics = this.myPerformanceTableDataTransformerService.getRightTableData(
            productMetrics.products,
            productMetrics.opportunityCounts,
            this.productMetricsViewType
          );

          if (this.productMetricsViewType !== ProductMetricsViewType.brands && productMetrics.selectedBrandCodeValues) {
            this.productMetricsSelectedBrandRow = this.myPerformanceTableDataTransformerService.getProductMetricsSelectedBrandRow(
              productMetrics.selectedBrandCodeValues, productMetrics.opportunityCounts);
          } else {
            this.productMetricsSelectedBrandRow = null;
          }

          this.handleDataRefreshAndDeselectionIfNeeded();
        }
      });

    this.myPerformanceCurrentSubscription = this.store
      .select(state => state.myPerformance.current)
      .subscribe((current: MyPerformanceEntitiesData) => {
        this.currentState = current;
        this.responsibilitiesFetching = this.isFetchingResponsibilities();
        this.updateLoaderStatus();
        this.salesHierarchyViewType = current.salesHierarchyViewType.viewType;
        this.tableHeaderRowLeft[0] = this.myPerformanceService.getSalesHierarchyViewTypeLabel(current.salesHierarchyViewType.viewType);

        this.responsibilitiesStatus = this.getResponsibilityStatus(current.responsibilities);
        this.showSalesContributionToVolume = this.getShowSalesContributionToVolume();
        this.showProductMetricsOpportunities = this.shouldShowProductMetricsOpportunities();

        this.fetchResponsibilitiesFailure = current.responsibilities && current.responsibilities.status === ActionStatus.Error;

        if (current.responsibilities && current.responsibilities.status === ActionStatus.Fetched && !this.fetchResponsibilitiesFailure) {
          this.salesHierarchy = this.myPerformanceTableDataTransformerService.getLeftTableData(
            current.responsibilities.entityWithPerformance,
            current.responsibilities.alternateHierarchyId
          );
        }

        if (current.responsibilities.entityWithPerformance.length) {
          this.entityType = current.responsibilities.entityWithPerformance[0].entityType;
        }

        if (current.responsibilities.entityWithPerformance && !this.fetchProductMetricsFailure) {
          this.totalRowData = this.myPerformanceTableDataTransformerService
            .getTotalRowData(current.responsibilities.entitiesTotalPerformances);
        }

        this.handleDataRefreshAndDeselectionIfNeeded();
    });

    this.myPerformanceVersionSubscription = this.store.select(state => state.myPerformance.versions)
      .subscribe((versions: MyPerformanceEntitiesData[]) => {
        this.versions = versions;
        this.showLeftBackButton = versions.length > 0;
    });

    if (this.filterState) {
      const defaultUserPremiseType = this.myPerformanceService.getUserDefaultPremiseType(
        MetricTypeValue.volume, this.userService.model.currentUser.srcTypeCd[0]);

      this.store.dispatch(new MyPerformanceFilterActions.SetMetricAndPremiseType({
        metricType: MetricTypeValue.volume,
        premiseType: defaultUserPremiseType
      }));
      this.store.dispatch(new ResponsibilitiesActions.FetchResponsibilities({
        positionId: this.currentUserId,
        filter: this.filterState,
        selectedEntityDescription: currentUserFullName,
        isMemberOfExceptionHierarchy: currentUserIsMemberOfExceptionHierarchy
      }));
      this.store.dispatch(new ProductMetricsActions.FetchProductMetrics({
        positionId: this.currentUserId,
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
        this.myPerformanceService.accountDashboardStateParameters(
          this.isInsideAlternateHierarchy(),
          this.currentState.responsibilities.exceptionHierarchy,
          this.filterState,
          row);
    } else if (row.metadata.entityType === EntityType.SubAccount) {
      const accountName = Object.keys(this.currentState.responsibilities.groupedEntities)[0];
      const hierarchyEntity: HierarchyEntity = this.currentState.responsibilities.groupedEntities[accountName]
        .find(groupedEntity => groupedEntity.positionId === row.metadata.positionId);
      let premiseType: PremiseTypeValue;
      if (hierarchyEntity) {
        premiseType = hierarchyEntity.premiseType;
        accountDashboardStateParams = this.myPerformanceService.accountDashboardStateParameters(
          this.isInsideAlternateHierarchy(),
          this.currentState.responsibilities.exceptionHierarchy,
          this.filterState,
          row,
          premiseType);
      } else {
        accountDashboardStateParams = this.myPerformanceService.accountDashboardStateParameters(
          this.isInsideAlternateHierarchy(),
          this.currentState.responsibilities.exceptionHierarchy,
          this.filterState,
          row);
      }
    }

    this.analyticsService.trackEvent('Team Performance', 'Go to Account Dashboard',
      accountDashboardStateParams.distributorid || accountDashboardStateParams.subaccountid);

    const accountDashboardUrl = this.$state.href('accounts', accountDashboardStateParams);
    const currentWindow = this.windowService.nativeWindow();
    currentWindow.open(accountDashboardUrl, '_blank');
  }

  public handleSortRows(criteria: SortingCriteria[]): void {
    this.sortingCriteria = criteria;
  }

  public handleElementClicked(parameters: HandleElementClickedParameters): void {
    switch (parameters.type) {
      case RowType.data:
      case RowType.dismissableTotal:
        if (parameters.leftSide) {
          this.handleLeftRowDataElementClicked(parameters);
        } else {
          this.handleRightRowElementClicked(parameters);
        }
        break;
      case RowType.total:
        this.drillStatus = DrillStatus.Inactive;
        this.handleTotalRowClicked(parameters);
        break;
      default:
        break;
    }
  }

  public handleBackButtonClicked(): void {
    this.drillStatus = DrillStatus.Up;
    this.isOpportunityTableExtended = false;
    this.analyticsService.trackEvent('Team Snapshot', 'Link Click', 'Back Button');

    const previousIndex: number = this.versions.length - 1;
    const previousState: MyPerformanceEntitiesData = this.versions[previousIndex];

    this.handlePreviousStateVersion(previousState, 1);
  }

  public handleBreadcrumbEntityClicked(event: BreadcrumbEntityClickedEvent): void {
    this.analyticsService.trackEvent('Team Snapshot', 'Link Click', 'Breadcrumb');
    const { trail, entityDescription } = event;
    const indexOffset: number = 1;
    const stepsBack: number = trail.length - indexOffset - trail.indexOf(entityDescription);
    const clickedIndex: number = this.versions.length - stepsBack;
    const clickedState: MyPerformanceEntitiesData = this.versions[clickedIndex];
    if (stepsBack < 1) return;

    this.drillStatus = DrillStatus.Up;
    this.isOpportunityTableExtended = false;
    this.handlePreviousStateVersion(clickedState, stepsBack);
  }

  public handleDismissableRowXClicked(): void {
    this.analyticsService.trackEvent('Product Snapshot', 'Link Click', 'All Brands');
    this.deselectAllProductMetrics();
  }

  public filterOptionSelected(event: MyPerformanceFilterEvent): void {
    switch (event.filterType) {
      case MyPerformanceFilterActionType.Metric:
        if (event.filterValue !== this.filterState.metricType) {
          const defaultUserPremiseType = this.myPerformanceService.getUserDefaultPremiseType(
            event.filterValue, this.userService.model.currentUser.srcTypeCd[0]);

          this.store.dispatch(new MyPerformanceFilterActions.SetMetricAndPremiseType({
            metricType: event.filterValue,
            premiseType: defaultUserPremiseType
          }));
          this.sendFilterAnalyticsEvent();
        }
        break;
      case MyPerformanceFilterActionType.TimePeriod:
        if (event.filterValue !== this.filterState.dateRangeCode) {
          this.store.dispatch(new MyPerformanceFilterActions.SetTimePeriod(event.filterValue));
          this.sendFilterAnalyticsEvent();
        }
        break;
      case MyPerformanceFilterActionType.PremiseType:
        if (event.filterValue !== this.filterState.premiseType) {
          this.store.dispatch(new MyPerformanceFilterActions.SetPremiseType(event.filterValue));
          this.sendFilterAnalyticsEvent();
        }
        break;
      case MyPerformanceFilterActionType.DistributionType:
        if (event.filterValue !== this.filterState.distributionType) {
          this.store.dispatch(new MyPerformanceFilterActions.SetDistributionType(event.filterValue));
          this.sendFilterAnalyticsEvent();
        }
        break;
      default:
        throw new Error(`My Performance Component: Filtertype of ${event.filterType} does not exist!`);
    }
  }

  public displayLeftTotalRow(): boolean {
    return !this.isShowingRoleGroups();
  }

  public displayRightTotalRow(): boolean {
    return this.isShowingRoleGroups() && this.productMetricsViewType === ProductMetricsViewType.brands;
  }

  public toggleOpportunityTable(): void {
    this.isOpportunityTableExtended = !this.isOpportunityTableExtended;
  }

  public handleOpportunityClicked(opportunity: TeamPerformanceTableOpportunity): void {
    console.log('Opportunity Clicked: ', opportunity);
  }

  private sendFilterAnalyticsEvent(): void {
    const category = 'Team Performance Filters';
    this.analyticsService.trackEvent(category, 'Metric', this.performanceMetric);
    this.analyticsService.trackEvent(category, 'Time Period', this.dateRange.displayCode);
    this.analyticsService.trackEvent(category, 'Premise Type', PremiseTypeValue[this.filterState.premiseType]);
    if (this.filterState.metricType === MetricTypeValue.PointsOfDistribution) {
      this.analyticsService.trackEvent(category, 'Distribution Type',
        DistributionTypeValue[this.filterState.distributionType]);
    }
  }

  private isShowingRoleGroups(): boolean {
    return this.salesHierarchyViewType === SalesHierarchyViewType.roleGroups
      || this.entityType === EntityType.RoleGroup
      || this.entityType === EntityType.DistributorGroup;
  }

  private handleLeftRowDataElementClicked(parameters: HandleElementClickedParameters): void {
    this.analyticsService.trackEvent('Team Snapshot', 'Link Click', parameters.row.descriptionRow0);
    if (this.salesHierarchyViewType !== SalesHierarchyViewType.subAccounts &&
        this.salesHierarchyViewType !== SalesHierarchyViewType.distributors) {
      this.drillStatus = DrillStatus.Down;
      this.store.dispatch(new MyPerformanceVersionActions.SaveMyPerformanceState(Object.assign({}, this.currentState, {
        filter: this.filterState
      })));
    } else {
      this.drillStatus = DrillStatus.Inactive;
    }
    this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(parameters.row.metadata.entityType));

    const isMemberOfExceptionHierarchy: boolean = this.selectedEntityIsMemberOfExceptionHierarchy(parameters);

    switch (this.salesHierarchyViewType) {

      case SalesHierarchyViewType.roleGroups:
        const entityTypeGroupName = EntityPeopleType[parameters.row.metadata.entityName];

        if (parameters.row.metadata.alternateHierarchyId) {
          this.store.dispatch(new ResponsibilitiesActions.SetAlternateHierarchyId(parameters.row.metadata.alternateHierarchyId));

          if (parameters.row.metadata.exceptionHierarchy) {
            this.store.dispatch(new ResponsibilitiesActions.SetExceptionHierarchy());
          }
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
          brandSkuCode: this.selectedSkuPackageCode || this.selectedBrandCode,
          skuPackageType: this.selectedSkuPackageType,
          isMemberOfExceptionHierarchy: isMemberOfExceptionHierarchy
        }));

        this.fetchProductMetricsWhenClick(parameters);
        break;
      case SalesHierarchyViewType.people:
        if (this.isInsideAlternateHierarchy()) {
          this.store.dispatch(new ResponsibilitiesActions.FetchAlternateHierarchyResponsibilities({
            positionId: parameters.row.metadata.positionId,
            alternateHierarchyId: this.currentState.responsibilities.alternateHierarchyId,
            filter: this.filterState,
            selectedEntityDescription: parameters.row.descriptionRow0,
            brandSkuCode: this.selectedSkuPackageCode || this.selectedBrandCode,
            skuPackageType: this.selectedSkuPackageType,
            isMemberOfExceptionHierarchy: isMemberOfExceptionHierarchy
          }));
        } else {
          this.store.dispatch(new ResponsibilitiesActions.FetchResponsibilities({
            positionId: parameters.row.metadata.positionId,
            filter: this.filterState,
            selectedEntityDescription: parameters.row.descriptionRow0,
            brandSkuCode: this.selectedSkuPackageCode || this.selectedBrandCode,
            skuPackageType: this.selectedSkuPackageType,
            isMemberOfExceptionHierarchy: isMemberOfExceptionHierarchy
          }));
        }
        this.fetchProductMetricsWhenClick(parameters);
        break;
      case SalesHierarchyViewType.accounts:
        this.store.dispatch(new ResponsibilitiesActions.FetchSubAccounts({
          positionId: parameters.row.metadata.positionId,
          contextPositionId: this.currentState.responsibilities.positionId,
          entityTypeAccountName: parameters.row.descriptionRow0,
          selectedPositionId: parameters.row.metadata.positionId,
          filter: this.filterState,
          selectedEntityDescription: parameters.row.descriptionRow0,
          brandSkuCode: this.selectedSkuPackageCode || this.selectedBrandCode,
          skuPackageType: this.selectedSkuPackageType
        }));
        if (!this.isInsideAlternateHierarchy()) {
          this.fetchProductMetricsWhenClick(parameters);
        }
        break;
      case SalesHierarchyViewType.subAccounts:
        this.selectedSubaccountCode = parameters.row.metadata.positionId;
        if (this.selectedSubaccountCode !== this.currentState.selectedSubaccountCode) {
          this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedSubaccountCode(parameters.row.metadata.positionId));
          this.fetchProductMetricsWhenClick(parameters);
          this.handleOpportunityCountFetch(
            this.currentState.selectedDistributorCode,
            this.selectedSubaccountCode,
            isMemberOfExceptionHierarchy);
        } else if (this.selectedSubaccountCode === parameters.row.metadata.positionId) {
          this.selectedSubaccountCode = null;
          this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSubaccountCode());
          this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(EntityType.Account));
          this.handleTeamPerformanceDataRefresh();
        }
        break;
      case SalesHierarchyViewType.distributors:
        this.selectedDistributorCode = parameters.row.metadata.positionId;
        if (this.selectedDistributorCode !== this.currentState.selectedDistributorCode) {
          this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedDistributorCode(parameters.row.metadata.positionId));
          this.fetchProductMetricsWhenClick(parameters);
          this.handleOpportunityCountFetch(
            this.selectedDistributorCode,
            this.currentState.selectedSubaccountCode,
            isMemberOfExceptionHierarchy);
        } else if (this.selectedDistributorCode === parameters.row.metadata.positionId) {
          this.selectedDistributorCode = null;
          this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceSelectedDistributorCode());
          this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(EntityType.Person));
          this.handleTeamPerformanceDataRefresh();
        }
        break;
      default:
        break;
    }
  }

  private handleRightRowElementClicked(parameters: HandleElementClickedParameters): void {
    this.analyticsService.trackEvent('Product Snapshot', 'Link Click', parameters.row.descriptionRow0);
    switch (this.productMetricsViewType) {
      case ProductMetricsViewType.brands:
        this.drillStatus = DrillStatus.BrandSelected;
        this.selectedBrandCode = parameters.row.metadata.brandCode;
        this.store.dispatch(new ProductMetricsActions.SelectBrandValues(parameters.row.metadata.brandCode));
        this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedBrandCode(parameters.row.metadata.brandCode));

        this.fetchProductMetricsWhenClick(parameters);

        if (parameters.row.metadata.brandCode) {
          this.dispatchRefreshAllPerformance(parameters.row.metadata.brandCode, null);
        }
        break;
      case ProductMetricsViewType.skus:
      case ProductMetricsViewType.packages:
        if (this.selectedBrandCode === parameters.row.metadata.brandCode) {
          this.handleProductMetricDeselect();
        } else if (this.selectedSkuPackageCode === parameters.row.metadata.skuPackageCode) {
          this.deselectSkuPackage();
        } else if (parameters.type === RowType.data) {
          this.drillStatus = DrillStatus.Inactive;
          this.selectedSkuPackageType = parameters.row.metadata.skuPackageType;
          this.selectedSkuPackageCode = parameters.row.metadata.skuPackageCode;
          this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedSkuCode({
            skuPackageCode: parameters.row.metadata.skuPackageCode,
            skuPackageType: parameters.row.metadata.skuPackageType
          }));
          if (parameters.row.metadata.skuPackageCode) {
            this.dispatchRefreshAllPerformance(parameters.row.metadata.skuPackageCode,
              parameters.row.metadata.skuPackageType);
          }
        } else {
          this.deselectSkuPackage();
        }
        break;
      default:
        break;
    }
  }

  // TODO: refactor this method so that #handleTeamPerformanceDataRefresh isn't called every time the
  // total row is clicked, and so the intent of this method is clarified based on the conditions of the
  // 'if' statement (or perhaps move the logic of this check outside this method)
  private handleTotalRowClicked(parameters: HandleElementClickedParameters) {
    this.analyticsService.trackEvent('Team Snapshot', 'Link Click', 'TOTAL');
    if (parameters.leftSide) {
      if (this.salesHierarchyViewType === SalesHierarchyViewType.subAccounts) {
        this.selectedSubaccountCode = null;
        this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSubaccountCode());
        this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(EntityType.Account));
      } else if (this.salesHierarchyViewType === SalesHierarchyViewType.distributors) {
        this.selectedDistributorCode = null;
        this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceSelectedDistributorCode());
        this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(EntityType.Person));
      }
      this.handleTeamPerformanceDataRefresh();
    }
  }

  private fetchProductMetricsForPreviousState(state: MyPerformanceEntitiesData) {
    let actionPayload: ProductMetricsActions.FetchProductMetricsPayload = {
      positionId: state.responsibilities.positionId,
      filter: this.filterState,
      selectedEntityType: state.selectedEntityType,
      selectedBrandCode: this.selectedBrandCode,
      inAlternateHierarchy: !!state.responsibilities.alternateHierarchyId,
      entityTypeCode: state.responsibilities.entityTypeCode,
      contextPositionId: state.responsibilities.alternateHierarchyId || state.responsibilities.positionId
    };

    this.store.dispatch(new ProductMetricsActions.FetchProductMetrics(actionPayload));
  }

  private fetchProductMetricsWhenClick(parameters: HandleElementClickedParameters) {
    const actionPayload: ProductMetricsActions.FetchProductMetricsPayload = {
      positionId: parameters.row
        ? parameters.row.metadata.positionId || this.currentState.responsibilities.positionId
        : this.currentState.responsibilities.positionId,
      filter: this.filterState,
      selectedEntityType: this.currentState.selectedEntityType,
      selectedBrandCode: this.selectedBrandCode,
      inAlternateHierarchy: this.isInsideAlternateHierarchy()
    };

    if (parameters.leftSide) {
      if (actionPayload.inAlternateHierarchy) {
        actionPayload.entityTypeCode = parameters.row.metadata.entityTypeCode;
        actionPayload.contextPositionId = parameters.row.metadata.alternateHierarchyId
                                          || this.currentState.responsibilities.alternateHierarchyId;
      }

      switch (this.salesHierarchyViewType) {
        case SalesHierarchyViewType.roleGroups:
          actionPayload.entityTypeCode = parameters.row.metadata.entityTypeCode;
          actionPayload.selectedEntityType = EntityType.RoleGroup;
          break;

        case SalesHierarchyViewType.accounts:
          actionPayload.contextPositionId = this.currentState.responsibilities.positionId;
          actionPayload.selectedEntityType = EntityType.Account;
          break;

        case SalesHierarchyViewType.people:
          actionPayload.selectedEntityType = EntityType.Person;
          break;

        case SalesHierarchyViewType.subAccounts:
          actionPayload.isMemberOfExceptionHierarchy = this.selectedEntityIsMemberOfExceptionHierarchy(parameters);
          break;

        case SalesHierarchyViewType.distributors:
          actionPayload.isMemberOfExceptionHierarchy = this.selectedEntityIsMemberOfExceptionHierarchy(parameters);
          break;

        default:
          break;
        }
    } else {
      actionPayload.entityTypeCode = this.currentState.responsibilities.entityTypeCode;
      actionPayload.contextPositionId = this.currentState.responsibilities.alternateHierarchyId
                                        || this.currentState.responsibilities.positionId;

      if (this.salesHierarchyViewType === SalesHierarchyViewType.subAccounts) {
        actionPayload.positionId = this.currentState.selectedSubaccountCode || this.currentState.responsibilities.accountPositionId;
      }

      if (this.salesHierarchyViewType === SalesHierarchyViewType.distributors) {
        actionPayload.positionId = this.currentState.selectedDistributorCode || this.currentState.responsibilities.positionId;
        actionPayload.isMemberOfExceptionHierarchy = this.selectedEntityIsMemberOfExceptionHierarchy(parameters);
      }
    }

    this.store.dispatch(new ProductMetricsActions.FetchProductMetrics(actionPayload));
  }

  private selectedEntityIsMemberOfExceptionHierarchy(parameters?: HandleElementClickedParameters): boolean {
    return !!(this.currentState.responsibilities.exceptionHierarchy ||
      (parameters && parameters.row && parameters.row.metadata.exceptionHierarchy));
  }

  private getShowSalesContributionToVolume(): boolean {
    return this.salesHierarchyViewType && this.salesHierarchyViewType !== SalesHierarchyViewType.roleGroups
           && this.filterState && this.filterState.metricType === MetricTypeValue.volume;
  }

  private dispatchRefreshAllPerformance(brandSkuCode: string, skuPackageType?: SkuPackageType) {
    this.store.dispatch(new ResponsibilitiesActions.RefreshAllPerformances({
      positionId: this.currentState.responsibilities.positionId,
      groupedEntities: this.currentState.responsibilities.groupedEntities,
      hierarchyGroups: this.currentState.responsibilities.hierarchyGroups,
      selectedEntityType: this.currentState.selectedEntityType,
      salesHierarchyViewType: this.salesHierarchyViewType,
      filter: this.filterState,
      brandSkuCode: brandSkuCode,
      skuPackageType: skuPackageType,
      entityType: this.currentState.selectedEntityType,
      alternateHierarchyId: this.currentState.responsibilities.alternateHierarchyId,
      accountPositionId: this.currentState.responsibilities.accountPositionId,
      isMemberOfExceptionHierarchy: this.selectedEntityIsMemberOfExceptionHierarchy()
    }));
  }

  private getShowProductMetricsContributionToVolume(): boolean {
    return this.filterState && this.filterState.metricType === MetricTypeValue.volume;
  }

  private shouldShowProductMetricsOpportunities(): boolean {
    return this.currentState
      && (!!this.currentState.selectedSubaccountCode || !!this.currentState.selectedDistributorCode)
      && this.filterState
      && this.filterState.premiseType !== PremiseTypeValue.All;
  }

  private isInsideAlternateHierarchy(): boolean {
    return !!this.currentState.responsibilities.alternateHierarchyId;
  }

  private isFetchingResponsibilities(): boolean {
    return this.currentState.responsibilities &&
    (this.currentState.responsibilities.status === ActionStatus.Fetching
      || this.currentState.responsibilities.responsibilitiesStatus === ActionStatus.Fetching
      || this.currentState.responsibilities.entitiesPerformanceStatus === ActionStatus.Fetching
      || this.currentState.responsibilities.totalPerformanceStatus === ActionStatus.Fetching
      || this.currentState.responsibilities.subaccountsStatus === ActionStatus.Fetching);
  }

  private isFetchingProductMetrics(): boolean {
    return this.productMetricsState.status === ActionStatus.Fetching
    || this.productMetricsState.opportunityCountsStatus === ActionStatus.Fetching;
  }

  private handlePreviousStateVersion(previousState: MyPerformanceEntitiesData, versionStepsBack: number): void {
    this.selectedSubaccountCode = null;
    this.selectedDistributorCode = null;
    this.store.dispatch(new MyPerformanceVersionActions.RestoreMyPerformanceState(versionStepsBack));
    this.fetchProductMetricsForPreviousState(previousState);

    if (!isEqual(this.filterState, previousState.filter)
      || this.selectedBrandCode !== previousState.selectedBrandCode
      || this.selectedSkuPackageCode !== previousState.selectedSkuPackageCode) {
      this.store.dispatch(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: previousState.responsibilities.positionId,
        groupedEntities: previousState.responsibilities.groupedEntities,
        hierarchyGroups: previousState.responsibilities.hierarchyGroups,
        selectedEntityType: previousState.selectedEntityType,
        salesHierarchyViewType: previousState.salesHierarchyViewType.viewType,
        filter: this.filterState,
        brandSkuCode: this.selectedSkuPackageCode || this.selectedBrandCode,
        skuPackageType: this.selectedSkuPackageType,
        entityType: previousState.selectedEntityType,
        alternateHierarchyId: previousState.responsibilities.alternateHierarchyId,
        accountPositionId: previousState.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: this.selectedEntityIsMemberOfExceptionHierarchy()
      }));
    }
  }

  private setSelectedDateRangeValues(): void {
    if (this.dateRangeState && this.filterState) {
      this.dateRange = this.dateRangeState[DateRangeTimePeriodValue[this.filterState.dateRangeCode]];
    }
  }

  private getResponsibilityStatus(responsibilitiesState: ResponsibilitiesState): ActionStatus {
    return ((responsibilitiesState.responsibilitiesStatus === ActionStatus.Fetched
        || responsibilitiesState.responsibilitiesStatus === ActionStatus.NotFetched)
      && (responsibilitiesState.entitiesPerformanceStatus === ActionStatus.Fetched
        || responsibilitiesState.entitiesPerformanceStatus === ActionStatus.NotFetched)
      && (responsibilitiesState.totalPerformanceStatus === ActionStatus.Fetched
        || responsibilitiesState.totalPerformanceStatus === ActionStatus.NotFetched)
      && (responsibilitiesState.subaccountsStatus === ActionStatus.Fetched
        || responsibilitiesState.subaccountsStatus === ActionStatus.NotFetched))
        ? ActionStatus.Fetched
        : ActionStatus.NotFetched;
  }

  private deselectSkuPackageIfNeeded(previousFilter: MyPerformanceFilterState, currentFilter: MyPerformanceFilterState) {
    if ((currentFilter && previousFilter && this.selectedSkuPackageType && currentFilter.premiseType !== previousFilter.premiseType)
      && (currentFilter.premiseType === PremiseTypeValue.On || previousFilter.premiseType === PremiseTypeValue.On)) {
      this.selectedSkuPackageCode = null;
      this.selectedSkuPackageType = null;
      this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
    }
  }

  private deselectSkuPackage(): void {
    this.drillStatus = DrillStatus.Inactive;
    this.selectedSkuPackageCode = null;
    this.selectedSkuPackageType = null;
    this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
    this.dispatchRefreshAllPerformance(this.selectedBrandCode, null);
  }

  private deselectBrandValue(): void {
    delete this.selectedBrandCode;
    this.drillStatus = DrillStatus.BrandDeselected;

    this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceSelectedBrandCode());
    this.store.dispatch(new ProductMetricsActions.DeselectBrandValues());
    this.fetchProductMetricsWhenClick({leftSide: false, type: RowType.dismissableTotal, index: 0});

    this.store.dispatch(new ResponsibilitiesActions.RefreshAllPerformances({
      positionId: this.currentState.responsibilities.positionId,
      groupedEntities: this.currentState.responsibilities.groupedEntities,
      hierarchyGroups: this.currentState.responsibilities.hierarchyGroups,
      selectedEntityType: this.currentState.selectedEntityType,
      salesHierarchyViewType: this.salesHierarchyViewType,
      filter: this.filterState,
      entityType: this.currentState.selectedEntityType,
      alternateHierarchyId: this.currentState.responsibilities.alternateHierarchyId,
      accountPositionId: this.currentState.responsibilities.accountPositionId,
      isMemberOfExceptionHierarchy: this.selectedEntityIsMemberOfExceptionHierarchy()
    }));
  }

  private handleProductMetricDeselect(): void {
    if (this.selectedSkuPackageCode) {
      this.deselectSkuPackage();
    } else {
      this.deselectBrandValue();
    }
  }

  private deselectAllProductMetrics(): void {
    this.selectedSkuPackageCode = null;
    this.selectedSkuPackageType = null;
    this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
    this.deselectBrandValue();
  }

  private updateLoaderStatus() {
    if (this.productMetricsFetching || this.responsibilitiesFetching) {
      this.salesHierarchyLoadingState = LoadingState.Loading;
      this.productMetricsLoadingState = LoadingState.Loading;
    } else {
      switch (this.drillStatus) {
        case DrillStatus.Down:
          this.salesHierarchyLoadingState = LoadingState.LoadedWithSlideLeftAnimation;
          this.productMetricsLoadingState = LoadingState.LoadedWithSlideLeftAnimation;
          break;

        case DrillStatus.Up:
          this.salesHierarchyLoadingState = LoadingState.LoadedWithSlideRightAnimation;
          this.productMetricsLoadingState = LoadingState.LoadedWithSlideRightAnimation;
          break;

        case DrillStatus.BrandSelected:
          this.salesHierarchyLoadingState = LoadingState.Loaded;
          this.productMetricsLoadingState = LoadingState.LoadedWithSlideUpAnimation;
          break;

        case DrillStatus.BrandDeselected:
          this.salesHierarchyLoadingState = LoadingState.Loaded;
          this.productMetricsLoadingState = LoadingState.LoadedWithSlideDownAnimation;
          break;

        case DrillStatus.Inactive:
        default:
          this.salesHierarchyLoadingState = LoadingState.Loaded;
          this.productMetricsLoadingState = LoadingState.Loaded;
          break;
      }
    }
  }

  private handleDataRefreshAndDeselectionIfNeeded(): void {
    if (this.productMetricsState
      && this.productMetricsState.status === ActionStatus.Fetched
      && this.responsibilitiesStatus === ActionStatus.Fetched
      && this.selectedSkuPackageCode
      && this.productMetricsState.productMetricsViewType !== ProductMetricsViewType.brands
      && this.productMetrics
      && !this.productMetrics.filter(
        (row: MyPerformanceTableRow) => row.metadata.skuPackageCode === this.selectedSkuPackageCode).length) {
        this.selectedSkuPackageCode = null;
        this.selectedSkuPackageType = null;
        this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
        this.dispatchRefreshAllPerformance(this.selectedBrandCode, null);
    } else if (this.productMetricsState
      && this.productMetricsState.status === ActionStatus.Fetched
      && this.responsibilitiesStatus === ActionStatus.Fetched
      && this.selectedBrandCode
      && this.productMetricsViewType !== ProductMetricsViewType.brands
      && this.productMetrics
      && this.productMetrics.length === 0) {
      this.handleProductMetricDeselect();
    }
  }

  private handleTeamPerformanceDataRefresh(): void {
    if (this.currentState && this.productMetricsState) {
      this.store.dispatch(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: this.currentState.responsibilities.positionId === CORPORATE_USER_POSITION_ID
                    ? this.currentUserId
                    : this.currentState.responsibilities.positionId,
        groupedEntities: this.currentState.responsibilities.groupedEntities,
        hierarchyGroups: this.currentState.responsibilities.hierarchyGroups,
        selectedEntityType: this.currentState.selectedEntityType,
        salesHierarchyViewType: this.salesHierarchyViewType,
        filter: this.filterState,
        brandSkuCode: this.selectedSkuPackageCode || this.selectedBrandCode,
        skuPackageType: this.selectedSkuPackageType,
        entityType: this.currentState.selectedEntityType,
        alternateHierarchyId: this.currentState.responsibilities.alternateHierarchyId,
        accountPositionId: this.currentState.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: this.selectedEntityIsMemberOfExceptionHierarchy()
      }));
      this.store.dispatch(new ProductMetricsActions.FetchProductMetrics({
        positionId: this.currentState.selectedSubaccountCode
          || this.currentState.selectedDistributorCode
          || this.currentState.responsibilities.accountPositionId
          || this.currentState.responsibilities.positionId
          || this.currentUserId,
        filter: this.filterState,
        selectedEntityType: this.currentState.selectedEntityType,
        selectedBrandCode: this.currentState.selectedBrandCode,
        inAlternateHierarchy: this.isInsideAlternateHierarchy(),
        entityTypeCode: this.currentState.responsibilities.entityTypeCode,
        contextPositionId: this.currentState.responsibilities.alternateHierarchyId || this.currentState.responsibilities.positionId,
        isMemberOfExceptionHierarchy: this.selectedEntityIsMemberOfExceptionHierarchy()
      }));
    }
  }

  private handleOpportunityCountFetch(distributorId: string, subAccountId: string, isMemberOfExceptionHierarchy: boolean): void {
    if (this.filterState.premiseType !== PremiseTypeValue.All && (!!distributorId || !!subAccountId)) {
      this.store.dispatch(new ProductMetricsActions.FetchOpportunityCounts({
        positionId: this.currentState.responsibilities.positionId,
        alternateHierarchyId: this.currentState.responsibilities.alternateHierarchyId,
        distributorId: distributorId,
        subAccountId: subAccountId,
        isMemberOfExceptionHierarchy: isMemberOfExceptionHierarchy,
        selectedEntityType: this.currentState.selectedEntityType,
        productMetricsViewType: this.productMetricsState.productMetricsViewType,
        filter: this.filterState
      }));
    }
  }
}
