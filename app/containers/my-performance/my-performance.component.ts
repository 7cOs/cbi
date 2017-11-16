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
  private currentState: MyPerformanceEntitiesData;
  private defaultUserPremiseType: PremiseTypeValue;
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
        this.showSalesContributionToVolume = this.getShowSalesContributionToVolume();
        this.showProductMetricsContributionToVolume = this.getShowProductMetricsContributionToVolume();
        this.performanceMetric = currentMetricName;
        this.tableHeaderRowLeft[1] = currentMetricName;
        this.tableHeaderRowRight[1] = currentMetricName;
        this.setSelectedDateRangeValues();
        this.handleTeamPerformanceDataRefresh();
    });

    this.productMetricsSubscription = this.store
      .select(state => state.myPerformanceProductMetrics)
      .subscribe((productMetrics: ProductMetricsState) => {
        this.productMetricsState = productMetrics;
        this.fetchProductMetricsFailure = productMetrics && productMetrics.status === ActionStatus.Error;
        this.productMetricsFetching = productMetrics.status === ActionStatus.Fetching;
        this.productMetricsViewType = productMetrics.productMetricsViewType;
        this.tableHeaderRowRight[0] = this.myPerformanceService.getProductMetricsViewTypeLabel(productMetrics.productMetricsViewType);

        if (productMetrics.status === ActionStatus.Fetched && !this.fetchProductMetricsFailure) {
          this.productMetrics = this.myPerformanceTableDataTransformerService.getRightTableData(
            productMetrics.products,
            this.productMetricsViewType
          );

          this.productMetricsSelectedBrandRow = this.productMetricsViewType !== ProductMetricsViewType.brands
            && productMetrics.selectedBrandCodeValues
              ? this.myPerformanceTableDataTransformerService.getProductMetricsSelectedBrandRow(productMetrics.selectedBrandCodeValues)
              : null;

          this.handleDataRefreshAndDeselectionIfNeeded();
        }
      });

    this.myPerformanceCurrentSubscription = this.store
      .select(state => state.myPerformance.current)
      .subscribe((current: MyPerformanceEntitiesData) => {
        this.currentState = current;
        this.responsibilitiesFetching = this.isFetchingResponsibilities();
        this.salesHierarchyViewType = current.salesHierarchyViewType.viewType;
        this.tableHeaderRowLeft[0] = this.myPerformanceService.getSalesHierarchyViewTypeLabel(current.salesHierarchyViewType.viewType);

        this.responsibilitiesStatus = this.getResponsibilityStatus(current.responsibilities);

        this.showSalesContributionToVolume = this.getShowSalesContributionToVolume();

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

    const currentUserId = this.userService.model.currentUser.positionId || CORPORATE_USER_POSITION_ID;
    const currentUserFullName = `${this.userService.model.currentUser.firstName} ${this.userService.model.currentUser.lastName}`;
    const currentUserIsMemberOfExceptionHierarchy: boolean =
      includes(this.userService.model.currentUser.srcTypeCd, 'EXCPN_HIER');

    if (this.filterState) {
      this.defaultUserPremiseType = this.myPerformanceService.getUserDefaultPremiseType(
        this.filterState.metricType, this.userService.model.currentUser.srcTypeCd[0]);

      this.store.dispatch(new MyPerformanceFilterActions.SetPremiseType( this.defaultUserPremiseType ));
      this.store.dispatch(new ResponsibilitiesActions.FetchResponsibilities({
        positionId: currentUserId,
        filter: this.filterState,
        selectedEntityDescription: currentUserFullName,
        isMemberOfExceptionHierarchy: currentUserIsMemberOfExceptionHierarchy
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
    if (parameters.leftSide) {
      this.handleLeftRowDataElementClicked(parameters);
    } else {
      this.handleRightRowElementClicked(parameters);
    }
  }

  public handleBackButtonClicked(): void {
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

    this.handlePreviousStateVersion(clickedState, stepsBack);
  }

  public handleDismissableRowXClicked(): void {
    this.analyticsService.trackEvent('Product Snapshot', 'Link Click', 'All Brands');
    this.deselectBrandValue();
  }

  public filterOptionSelected(event: MyPerformanceFilterEvent): void {
    switch (event.filterType) {
      case MyPerformanceFilterActionType.Metric:
        if (event.filterValue !== this.filterState.metricType) {
          this.store.dispatch(new MyPerformanceFilterActions.SetMetric(event.filterValue));
          this.defaultUserPremiseType = this.myPerformanceService.getUserDefaultPremiseType(
            event.filterValue, this.userService.model.currentUser.srcTypeCd[0]);
          this.store.dispatch(new MyPerformanceFilterActions.SetPremiseType(this.defaultUserPremiseType));
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
    if (parameters.type === RowType.data || parameters.type === RowType.dismissableTotal) {
      this.analyticsService.trackEvent('Team Snapshot', 'Link Click', parameters.row.descriptionRow0); // GA on click total/subaccount row?
      if (this.salesHierarchyViewType !== SalesHierarchyViewType.subAccounts) {
        this.store.dispatch(new MyPerformanceVersionActions.SaveMyPerformanceState(Object.assign({}, this.currentState, {
          filter: this.filterState
        })));
      }
      this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(parameters.row.metadata.entityType));

      const isMemberOfExceptionHierarchy: boolean =
        !!(this.currentState.responsibilities.exceptionHierarchy || parameters.row.metadata.exceptionHierarchy);

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
              skuPackageType: this.selectedSkuPackageType
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
            skuPackageType: this.selectedSkuPackageType,
          }));
          if (!this.isInsideAlternateHierarchy()) {
            this.fetchProductMetricsWhenClick(parameters);
          }
          break;
        case SalesHierarchyViewType.subAccounts:
          this.selectedSubaccountCode = parameters.row.metadata.positionId;
          this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedSubaccountCode(parameters.row.metadata.positionId));
          this.store.dispatch(new ProductMetricsActions.FetchProductMetrics({
            positionId: parameters.row.metadata.positionId,
            filter: this.filterState,
            selectedEntityType: this.currentState.selectedEntityType,
            selectedBrandCode: this.currentState.selectedBrandCode,
            inAlternateHierarchy: this.isInsideAlternateHierarchy(),
            entityTypeCode: this.currentState.responsibilities.entityTypeCode,
            contextPositionId: this.currentState.responsibilities.positionId
          }));
          break;
        default:
          break;
      }
    } else if (parameters.type === RowType.total && this.salesHierarchyViewType === SalesHierarchyViewType.subAccounts) {
      this.selectedSubaccountCode = null;
      this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSubaccountCode());
      this.store.dispatch(new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(EntityType.Account));
      this.handleTeamPerformanceDataRefresh();
    }
  }

  private handleRightRowElementClicked(parameters: HandleElementClickedParameters): void {
    if (parameters.type === RowType.data || parameters.type === RowType.dismissableTotal) {
      this.analyticsService.trackEvent('Product Snapshot', 'Link Click', parameters.row.descriptionRow0);
      switch (this.productMetricsViewType) {
        case ProductMetricsViewType.brands:
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
          if (parameters.type === RowType.data) {
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
            this.selectedSkuPackageCode = null;
            this.selectedSkuPackageType = null;
            this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
            this.dispatchRefreshAllPerformance(this.selectedBrandCode, null);
          }
          break;
        default:
          break;
      }
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

        default:
          break;
        }
    } else {
      actionPayload.entityTypeCode = this.currentState.responsibilities.entityTypeCode;
      actionPayload.contextPositionId = this.currentState.responsibilities.alternateHierarchyId
                                        || this.currentState.responsibilities.positionId;

      if (this.salesHierarchyViewType === SalesHierarchyViewType.subAccounts) {
        actionPayload.positionId = this.currentState.responsibilities.accountPositionId;
      }
    }

    this.store.dispatch(new ProductMetricsActions.FetchProductMetrics(actionPayload));
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
      isMemberOfExceptionHierarchy: this.currentState.responsibilities.exceptionHierarchy
    }));
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
        isMemberOfExceptionHierarchy: this.currentState.responsibilities.exceptionHierarchy
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

  private deselectBrandValue(): void {
    delete this.selectedBrandCode;
    this.selectedSkuPackageCode = null;
    this.selectedSkuPackageType = null;
    this.store.dispatch(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
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
      isMemberOfExceptionHierarchy: this.currentState.responsibilities.exceptionHierarchy
    }));
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
      this.deselectBrandValue();
    }
  }

  private handleTeamPerformanceDataRefresh(): void {
    if (this.currentState
      && this.currentState.responsibilities.status === ActionStatus.Fetched
      && this.productMetricsState
      && this.productMetricsState.status === ActionStatus.Fetched) {
      this.store.dispatch(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: this.currentState.responsibilities.positionId,
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
        isMemberOfExceptionHierarchy: this.currentState.responsibilities.exceptionHierarchy
      }));
      this.store.dispatch(new ProductMetricsActions.FetchProductMetrics({
        positionId: this.currentState.responsibilities.accountPositionId || this.currentState.responsibilities.positionId,
        filter: this.filterState,
        selectedEntityType: this.currentState.selectedEntityType,
        selectedBrandCode: this.currentState.selectedBrandCode,
        inAlternateHierarchy: this.isInsideAlternateHierarchy(),
        entityTypeCode: this.currentState.responsibilities.entityTypeCode,
        contextPositionId: this.currentState.responsibilities.alternateHierarchyId || this.currentState.responsibilities.positionId
      }));
    }
  }
}
