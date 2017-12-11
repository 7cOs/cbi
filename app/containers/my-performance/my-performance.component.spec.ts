import { By } from '@angular/platform-browser';
import * as Chance from 'chance';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MdSidenavModule } from '@angular/material';
import { Observable, Subject } from 'rxjs';
import { sample } from 'lodash';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';

import { ActionStatus } from '../../enums/action-status.enum';
import { AnalyticsService } from '../../services/analytics.service';
import { BreadcrumbEntityClickedEvent } from '../../models/breadcrumb-entity-clicked-event.model';
import { DateRange } from '../../models/date-range.model';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { dateRangeStateMock } from '../../models/date-range-state.model.mock';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { EntityPeopleType, EntityType } from '../../enums/entity-responsibilities.enum';
import { FetchProductMetrics,
         SelectBrandValues } from '../../state/actions/product-metrics.action';
import { getEntityPropertyResponsibilitiesMock } from '../../models/hierarchy-entity.model.mock';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getMyPerformanceEntitiesDataMock,
         getMyPerformanceStateMock,
         getResponsibilitesStateMock } from '../../state/reducers/my-performance.state.mock';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getProductMetricsBrandMock,
         getProductMetricsSkuMock,
         getProductMetricsWithSkuValuesMock } from '../../models/product-metrics.model.mock';
import { HandleElementClickedParameters, MyPerformanceComponent } from './my-performance.component';
import { HierarchyEntity } from '../../models/hierarchy-entity.model';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import * as MyPerformanceFilterActions from '../../state/actions/my-performance-filter.action';
import * as MyPerformanceVersionActions from '../../state/actions/my-performance-version.action';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent, MyPerformanceFilter } from '../../models/my-performance-filter.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceEntitiesData, MyPerformanceState } from '../../state/reducers/my-performance.reducer';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceTableRow, TeamPerformanceTableOpportunity } from '../../models/my-performance-table-row.model';
import { MyPerformanceService } from '../../services/my-performance.service';
import { MyPerformanceTableRowComponent } from '../../shared/components/my-performance-table-row/my-performance-table-row.component';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import * as ProductMetricsActions from '../../state/actions/product-metrics.action';
import { ProductMetricHeaderProductType, SalesHierarchyHeaderEntityType } from '../../enums/team-performance-table-header.enum';
import { ProductMetricsState } from '../../state/reducers/product-metrics.reducer';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
import { RowType } from '../../enums/row-type.enum';
import { ClearMyPerformanceSelectedSubaccountCode,
         ClearMyPerformanceSelectedDistributorCode,
         SaveMyPerformanceState,
         SetMyPerformanceSelectedEntityType,
         SetMyPerformanceSelectedSubaccountCode,
         SetMyPerformanceSelectedDistributorCode,
         SkuPackagePayload } from '../../state/actions/my-performance-version.action';
import { SkuPackageType } from '../../enums/sku-package-type.enum';
import { SortIndicatorComponent } from '../../shared/components/sort-indicator/sort-indicator.component';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';
import { WindowService } from '../../services/window.service';

const chance = new Chance();

@Component({
  selector: 'beer-loader',
  template: ''
})
class BeerLoaderComponentMock {
  @Input() showLoader: false;
}

@Component({
  selector: 'my-performance-filter',
  template: ''
})
class MyPerformanceFilterComponentMock {
  @Output() onFilterChange = new EventEmitter<MyPerformanceFilterEvent>();

  @Input() dateRangeState: DateRangesState;
  @Input() filterState: MyPerformanceFilterState;
}

@Component({
  selector: 'my-performance-breadcrumb',
  template: ''
})
class MyPerformanceBreadcrumbComponentMock {
  @Output() breadcrumbEntityClicked = new EventEmitter<BreadcrumbEntityClickedEvent>();
  @Output() backButtonClicked = new EventEmitter();
  @Input() currentPerformanceState: MyPerformanceEntitiesData;
  @Input() performanceStateVersions: MyPerformanceEntitiesData[];
  @Input() showBackButton: boolean;
}

@Component({
  selector: 'my-performance-table',
  template: ''
})
class MyPerformanceTableComponentMock {
  @Input() sortingCriteria: Array<SortingCriteria>;
  @Input() tableData: Array<MyPerformanceTableRow>;
  @Input() dateRange: DateRange;
  @Input() showDateRange: boolean = false;
  @Input() performanceMetric: string;
  @Input() selectedSkuPackageCode: string;
  @Input() showBackButton: boolean = false;
  @Input() showContributionToVolume: boolean = false;
  @Input() showOpportunities: boolean = true;
  @Input() tableHeaderRow: Array<string>;
  @Input() totalRow: MyPerformanceTableRow;
  @Input() dismissableTotalRow: MyPerformanceTableRow;
  @Input() viewType: SalesHierarchyViewType | ProductMetricsViewType;
  @Input() selectedSubaccountCode: string;
  @Input() selectedDistributorCode: string;
}

@Component({
  selector: 'team-performance-opportunities',
  template: ''
})
class TeamPerformanceOpportunitiesComponentMock {
  @Output() onCloseIndicatorClicked = new EventEmitter<any>();
  @Output() onOpportunityCountClicked = new EventEmitter<TeamPerformanceTableOpportunity>();

  @Input() opportunities: Array<TeamPerformanceTableOpportunity>;
  @Input() premiseType: string;
  @Input() productName: string;
  @Input() subtitle: string;
  @Input() total: number;
}

describe('MyPerformanceComponent', () => {
  let fixture: ComponentFixture<MyPerformanceComponent>;
  let componentInstance: MyPerformanceComponent;
  let componentInstanceCopy: any;
  let userServiceMock: any;
  let myPerformanceTableDataTransformerService: any;
  let myPerformanceServiceMock: any;
  let analyticsServiceMock: any;
  let accountDashboardStateParamMock: any;
  let myPerformanceStateMock: MyPerformanceState = getMyPerformanceStateMock();
  let myPerformanceProductMetricsMock: ProductMetricsState = {
    status: ActionStatus.Fetching,
    products: {},
    productMetricsViewType: ProductMetricsViewType.brands
  };

  function generateMockVersions(min: number, max: number): MyPerformanceEntitiesData[] {
    return Array(chance.natural({min: min, max: max})).fill('').map(() => getMyPerformanceEntitiesDataMock());
  }

  const initialVersionsMock: MyPerformanceEntitiesData[] = generateMockVersions(9, 9).map((version) => {
    version.salesHierarchyViewType.viewType = SalesHierarchyViewType.distributors;
    return version;
  });

  const versionsSubject: Subject<MyPerformanceEntitiesData[]> = new Subject<MyPerformanceEntitiesData[]>();
  const currentSubject: Subject<MyPerformanceEntitiesData> = new Subject<MyPerformanceEntitiesData>();
  const productMetricsSubject: Subject<ProductMetricsState> = new Subject<ProductMetricsState>();
  const filterSubject: Subject<MyPerformanceFilter> = new Subject<MyPerformanceFilter>();

  const windowMock = {
    open: jasmine.createSpy('open')
  };

  const windowServiceMock = {
    nativeWindow: jasmine.createSpy('nativeWindow').and.callFake( () => windowMock )
  };

  const titleMock = {
    setTitle: jasmine.createSpy('setTitle')
  };

  const stateMock = {
    myPerformance: myPerformanceStateMock,
    myPerformanceProductMetrics: myPerformanceProductMetricsMock,
    myPerformanceProductMetricsViewType: chance.string(),
    myPerformanceFilter: getMyPerformanceFilterMock(),
    dateRanges: dateRangeStateMock,
    href: jasmine.createSpy('href'),
    current: {title: chance.string(), exceptionHierarchy: false}
  };

  const storeMock = {
    select: jasmine.createSpy('select.myPerformance').and.callFake((selectFunction: (state: any) => any) => {
      const selectedValue = selectFunction(stateMock);

      if (selectedValue === stateMock.myPerformance.versions) {
        return versionsSubject;
      } else if (selectedValue === stateMock.myPerformance.current) {
        return currentSubject;
      } else if (selectedValue === stateMock.myPerformanceProductMetrics) {
        return productMetricsSubject;
      } else if (selectedValue === stateMock.myPerformanceFilter) {
        return filterSubject;
      } else {
        return Observable.of(selectedValue);
      }
    }),
    dispatch: jasmine.createSpy('dispatch')
  };

  beforeEach(() => {
    myPerformanceTableDataTransformerService = {
      getLeftTableData: jasmine.createSpy('getLeftTableData').and.callThrough(),
      getRightTableData: jasmine.createSpy('getRightTableData').and.callThrough(),
      getTotalRowData: jasmine.createSpy('getTotalRowData').and.callThrough(),
      getProductMetricsSelectedBrandRow: jasmine.createSpy('getProductMetricsSelectedBrandRow').and.callThrough()
    };
    userServiceMock = {
      model: {
        currentUser: {
          positionId: chance.integer().toString(),
          srcTypeCd: [ 'SALES_HIER' ],
          firstName: chance.string(),
          lastName: chance.string()
        }
      }
    };
    accountDashboardStateParamMock = {
      distributorid: chance.string(),
      subaccountid: chance.string()
    };
    myPerformanceServiceMock = {
      getUserDefaultPremiseType: jasmine.createSpy('getUserDefaultPremiseType'),
      getMetricValueName: jasmine.createSpy('getMetricValueName'),
      accountDashboardStateParameters: jasmine.createSpy('accountDashboardStateParameters').and.returnValue(accountDashboardStateParamMock),
      getSalesHierarchyViewTypeLabel: jasmine.createSpy('getSalesHierarchyViewTypeLabel').and.callThrough(),
      getProductMetricsViewTypeLabel: jasmine.createSpy('getProductMetricsViewTypeLabel').and.callThrough(),
      getPremiseTypeStateLabel: jasmine.createSpy('getPremiseTypeStateLabel').and.callThrough()
    };
    analyticsServiceMock = jasmine.createSpyObj(['trackEvent']);

    TestBed.configureTestingModule({
      declarations: [
        BeerLoaderComponentMock,
        MyPerformanceBreadcrumbComponentMock,
        MyPerformanceFilterComponentMock,
        MyPerformanceTableComponentMock,
        MyPerformanceComponent,
        MyPerformanceTableRowComponent,
        SortIndicatorComponent,
        TeamPerformanceOpportunitiesComponentMock
      ],
      imports: [
        MdSidenavModule
      ],
      providers: [
        {
          provide: AnalyticsService,
          useValue: analyticsServiceMock
        },
        {
          provide: MyPerformanceService,
          useValue: myPerformanceServiceMock
        },
        {
          provide: MyPerformanceTableDataTransformerService,
          useValue: myPerformanceTableDataTransformerService
        },
        {
          provide: Store,
          useValue: storeMock
        },
        {
          provide: Title,
          useValue: titleMock
        },
        {
          provide: WindowService,
          useValue: windowServiceMock
        },
        {
          provide: '$state',
          useValue: stateMock
        },
        {
          provide: 'userService',
          useValue: userServiceMock
        }
      ]
    });
    fixture = TestBed.createComponent(MyPerformanceComponent);
    componentInstance = fixture.componentInstance;
    fixture.detectChanges();

    currentSubject.next(myPerformanceStateMock.current);
    productMetricsSubject.next(myPerformanceProductMetricsMock);
    versionsSubject.next(initialVersionsMock);
    filterSubject.next(stateMock.myPerformanceFilter);
    componentInstanceCopy = componentInstance as any;

    storeMock.dispatch.and.callThrough();
    storeMock.dispatch.calls.reset();
  });

  describe('MyPerformanceComponent initialization', () => {
    let userService: any;
    let expectedCurrentUserFullName: string;

    beforeEach(inject([ 'userService' ], (_userService: any) => {
      userService = _userService;
      expectedCurrentUserFullName = userService.model.currentUser.firstName + ' ' + userService.model.currentUser.lastName;

      storeMock.dispatch.and.callThrough();
      storeMock.dispatch.calls.reset();
    }));

    it('should dispatch actions to fetch data for the current user', () => {
      myPerformanceServiceMock.getUserDefaultPremiseType.and.returnValue(PremiseTypeValue.On);
      filterSubject.next(stateMock.myPerformanceFilter);
      componentInstance.ngOnInit();

      expect(storeMock.dispatch.calls.count()).toBe(3);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
        new MyPerformanceFilterActions.SetPremiseType(PremiseTypeValue.On)
      );
      expect(myPerformanceServiceMock.getUserDefaultPremiseType).toHaveBeenCalledWith(
        stateMock.myPerformanceFilter.metricType,
        userService.model.currentUser.srcTypeCd[0]
      );
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new ResponsibilitiesActions.FetchResponsibilities({
        positionId: userServiceMock.model.currentUser.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityDescription: expectedCurrentUserFullName,
        isMemberOfExceptionHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new FetchProductMetrics({
        positionId: userServiceMock.model.currentUser.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: EntityType.Person,
        selectedBrandCode: undefined
      }));
    });

    it('should dispatch actions actions to appropriately handle empty positionId', () => {
      userService.model.currentUser.positionId = '';
      filterSubject.next(stateMock.myPerformanceFilter);
      componentInstance.ngOnInit();

      expect(storeMock.dispatch.calls.count()).toBe(3);
      expect(storeMock.dispatch.calls.argsFor(1)).toEqual([new ResponsibilitiesActions.FetchResponsibilities({
        positionId: '0',
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityDescription: expectedCurrentUserFullName,
        isMemberOfExceptionHierarchy: false
      })]);
    });

    it('should dispatch actions actions to appropriately handle undefined positionId', () => {
      delete userService.model.currentUser.positionId;
      filterSubject.next(stateMock.myPerformanceFilter);
      componentInstance.ngOnInit();

      expect(storeMock.dispatch.calls.count()).toBe(3);
      expect(storeMock.dispatch.calls.argsFor(1)).toEqual([new ResponsibilitiesActions.FetchResponsibilities({
        positionId: '0',
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityDescription: expectedCurrentUserFullName,
        isMemberOfExceptionHierarchy: false
      })]);
    });

    it('should call setTitle', () => {
      fixture = TestBed.createComponent(MyPerformanceComponent);
      fixture.detectChanges();
      expect(titleMock.setTitle).toHaveBeenCalledWith(stateMock.current.title);
    });

    it('should call select with the right arguments', () => {
      storeMock.dispatch.calls.reset();
      storeMock.select.calls.reset();
      filterSubject.next(stateMock.myPerformanceFilter);
      componentInstance.ngOnInit();

      expect(storeMock.select.calls.count()).toBe(5);
      const functionPassToSelectCall0 = storeMock.select.calls.argsFor(0)[0];
      expect(functionPassToSelectCall0(stateMock)).toBe(stateMock.dateRanges);

      const functionPassToSelectCall2 = storeMock.select.calls.argsFor(1)[0];
      expect(functionPassToSelectCall2(stateMock)).toBe(stateMock.myPerformanceFilter);

      const functionPassToSelectCall3 = storeMock.select.calls.argsFor(2)[0];
      expect(functionPassToSelectCall3(stateMock)).toBe(stateMock.myPerformanceProductMetrics);

      const functionPassToSelectCall4 = storeMock.select.calls.argsFor(3)[0];
      expect(functionPassToSelectCall4(stateMock)).toBe(stateMock.myPerformance.current);

      const functionPassToSelectCall6 = storeMock.select.calls.argsFor(4)[0];
      expect(functionPassToSelectCall6(stateMock)).toBe(stateMock.myPerformance.versions);

      fixture.detectChanges();
      const myPerformanceFilterMock = fixture.debugElement.query(By.directive(MyPerformanceFilterComponentMock))
        .injector
        .get(MyPerformanceFilterComponentMock) as MyPerformanceFilterComponentMock;
      myPerformanceFilterMock.dateRangeState = dateRangeStateMock;
      expect(myPerformanceFilterMock.filterState).toEqual(stateMock.myPerformanceFilter as any);
      expect(myPerformanceFilterMock.dateRangeState).toBe(stateMock.dateRanges as any);
    });
  });

  describe('Perform various events when back button is clicked', () => {
    beforeEach(() => {
      storeMock.dispatch.and.callThrough();
      storeMock.dispatch.calls.reset();
    });

    describe('when back button is NOT displayed and not viewing subaccounts', () => {
      it('should NOT dispatch any actions', () => {
        componentInstance.showLeftBackButton = false;
        componentInstance.salesHierarchyViewType = SalesHierarchyViewType.roleGroups;
        const params: HandleElementClickedParameters = { leftSide: true, type: RowType.total, index: 0 };
        componentInstance.handleElementClicked(params);

        expect(storeMock.dispatch.calls.count()).toBe(0);
      });
    });

    describe('when back button is displayed', () => {
      let versionsMock: MyPerformanceEntitiesData[];
      let previousVersionMock: MyPerformanceEntitiesData;

      beforeEach(() => {
        componentInstance.showLeftBackButton = true;
        componentInstanceCopy.selectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;
        componentInstanceCopy.selectedSkuPackageCode = stateMock.myPerformance.current.selectedSkuPackageCode;
        componentInstanceCopy.selectedSkuPackageType = stateMock.myPerformance.current.selectedSkuPackageType;
        versionsMock = generateMockVersions(4, 9);
        previousVersionMock = versionsMock[versionsMock.length - 1];
        previousVersionMock.filter = stateMock.myPerformanceFilter;
        previousVersionMock.selectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;
        previousVersionMock.selectedSkuPackageCode = stateMock.myPerformance.current.selectedSkuPackageCode;
        previousVersionMock.selectedSkuPackageType = stateMock.myPerformance.current.selectedSkuPackageType;
      });

      it('should send analytics event', () => {
        componentInstance.handleBackButtonClicked();
        expect(analyticsServiceMock.trackEvent.calls.argsFor(0)).toEqual([
          'Team Snapshot',
          'Link Click',
          'Back Button'
        ]);
      });

      it('should dispatch RestoreMyPerformanceState and FetchProductMetrics ' +
         'when last version has a salesHierarchyViewType of distributors', () => {
        previousVersionMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.distributors;
        versionsSubject.next(versionsMock);

        const expectedSelectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState());
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new ProductMetricsActions.FetchProductMetrics({
          positionId: previousVersionMock.responsibilities.positionId,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: previousVersionMock.selectedEntityType,
          inAlternateHierarchy: false,
          selectedBrandCode: expectedSelectedBrandCode,
          entityTypeCode: previousVersionMock.responsibilities.entityTypeCode,
          contextPositionId: previousVersionMock.responsibilities.positionId
        }));
      });

      it('should dispatch RestoreMyPerformanceState and FetchProductMetrics ' +
         'when last version has a salesHierarchyViewType of people', () => {
        previousVersionMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.people;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();
        const expectedSelectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState());
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetrics({
          positionId: previousVersionMock.responsibilities.positionId,
          entityTypeCode: previousVersionMock.responsibilities.entityTypeCode,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: previousVersionMock.selectedEntityType,
          selectedBrandCode: expectedSelectedBrandCode,
          inAlternateHierarchy: false,
          contextPositionId: previousVersionMock.responsibilities.positionId
        }));
      });

      it('should dispatch RestoreMyPerformanceState and FetchProductMetrics ' +
         'when last version has a salesHierarchyViewType of subAccounts', () => {
        previousVersionMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.subAccounts;
        versionsSubject.next(versionsMock);

        const expectedSelectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState());
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new ProductMetricsActions.FetchProductMetrics({
          positionId: previousVersionMock.responsibilities.positionId,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: previousVersionMock.selectedEntityType,
          selectedBrandCode: expectedSelectedBrandCode,
          inAlternateHierarchy: false,
          entityTypeCode: previousVersionMock.responsibilities.entityTypeCode,
          contextPositionId: previousVersionMock.responsibilities.positionId
        }));
      });

      it('should dispatch RestoreMyPerformanceState and FetchProductMetrics ' +
         'when last version has a salesHierarchyViewType of roleGroups', () => {
        previousVersionMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.roleGroups;
        versionsSubject.next(versionsMock);
        const expectedSelectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState());
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetrics({
          positionId: previousVersionMock.responsibilities.positionId,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: previousVersionMock.selectedEntityType,
          inAlternateHierarchy: false,
          entityTypeCode: previousVersionMock.responsibilities.entityTypeCode,
          contextPositionId: previousVersionMock.responsibilities.positionId,
          selectedBrandCode: expectedSelectedBrandCode
        }));
      });

      it('should dispatch RestoreMyPerformanceState and FetchProductMetrics ' +
         'when last version has a salesHierarchyViewType of accounts', () => {
        previousVersionMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.accounts;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        const expectedSelectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState());
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetrics({
          positionId: previousVersionMock.responsibilities.positionId,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: previousVersionMock.selectedEntityType,
          selectedBrandCode: expectedSelectedBrandCode,
          inAlternateHierarchy: false,
          entityTypeCode: previousVersionMock.responsibilities.entityTypeCode,
          contextPositionId: previousVersionMock.responsibilities.positionId
        }));
      });

      it('should dispatch the RefreshAllPerformances action when the filter state and previous state`s filter mismatch', () => {
        previousVersionMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.accounts;
        previousVersionMock.filter = getMyPerformanceFilterMock();
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(3);
        expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
          positionId: previousVersionMock.responsibilities.positionId,
          groupedEntities: previousVersionMock.responsibilities.groupedEntities,
          hierarchyGroups: previousVersionMock.responsibilities.hierarchyGroups,
          selectedEntityType: previousVersionMock.selectedEntityType,
          salesHierarchyViewType: previousVersionMock.salesHierarchyViewType.viewType,
          filter: stateMock.myPerformanceFilter,
          brandSkuCode: stateMock.myPerformance.current.selectedSkuPackageCode,
          skuPackageType: stateMock.myPerformance.current.selectedSkuPackageType,
          entityType: previousVersionMock.selectedEntityType,
          alternateHierarchyId: previousVersionMock.responsibilities.alternateHierarchyId,
          accountPositionId: previousVersionMock.responsibilities.accountPositionId,
          isMemberOfExceptionHierarchy: false
        }));
      });

      it('should dispatch the RefreshAllPerformances action'
        + ' when the selectedBrandCode and previous state`s selectedBrandCode mismatch', () => {
        previousVersionMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.accounts;
        previousVersionMock.selectedBrandCode = stateMock.myPerformance.current.selectedBrandCode + 'NOMATCH';
        versionsSubject.next(versionsMock);

        componentInstanceCopy.selectedSkuPackageCode = null;
        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(3);
        expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
          positionId: previousVersionMock.responsibilities.positionId,
          groupedEntities: previousVersionMock.responsibilities.groupedEntities,
          hierarchyGroups: previousVersionMock.responsibilities.hierarchyGroups,
          selectedEntityType: previousVersionMock.selectedEntityType,
          salesHierarchyViewType: previousVersionMock.salesHierarchyViewType.viewType,
          filter: stateMock.myPerformanceFilter,
          brandSkuCode: stateMock.myPerformance.current.selectedBrandCode,
          skuPackageType: stateMock.myPerformance.current.selectedSkuPackageType,
          entityType: previousVersionMock.selectedEntityType,
          alternateHierarchyId: previousVersionMock.responsibilities.alternateHierarchyId,
          accountPositionId: previousVersionMock.responsibilities.accountPositionId,
          isMemberOfExceptionHierarchy: false
        }));
      });

      it('should dispatch the RefreshAllPerformances action'
        + ' when the selectedSkuPackageCode and previous state`s selectedSkuPackageCode mismatch', () => {
        previousVersionMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.accounts;
        previousVersionMock.selectedSkuPackageCode = stateMock.myPerformance.current.selectedSkuPackageCode + 'NOMATCH';
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(3);
        expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
          positionId: previousVersionMock.responsibilities.positionId,
          groupedEntities: previousVersionMock.responsibilities.groupedEntities,
          hierarchyGroups: previousVersionMock.responsibilities.hierarchyGroups,
          selectedEntityType: previousVersionMock.selectedEntityType,
          salesHierarchyViewType: previousVersionMock.salesHierarchyViewType.viewType,
          filter: stateMock.myPerformanceFilter,
          brandSkuCode: stateMock.myPerformance.current.selectedSkuPackageCode,
          entityType: previousVersionMock.selectedEntityType,
          skuPackageType: stateMock.myPerformance.current.selectedSkuPackageType,
          alternateHierarchyId: previousVersionMock.responsibilities.alternateHierarchyId,
          accountPositionId: previousVersionMock.responsibilities.accountPositionId,
          isMemberOfExceptionHierarchy: false
        }));
      });

      it('should close the opportunities table by setting isOpportunityTableExtended to false', () => {
        componentInstanceCopy.isOpportunityTableExtended = false;
        componentInstance.handleBackButtonClicked();

        expect(componentInstanceCopy.isOpportunityTableExtended).toBe(false);

        componentInstanceCopy.isOpportunityTableExtended = true;
        componentInstance.handleBackButtonClicked();

        expect(componentInstanceCopy.isOpportunityTableExtended).toBe(false);
      });
    });
  });

  describe('when left side data row is clicked', () => {
    let rowMock: MyPerformanceTableRow;
    let currentMock: MyPerformanceEntitiesData;
    let expectedSaveMyPerformanceStatePayload: MyPerformanceEntitiesData;

    beforeEach(() => {
      storeMock.dispatch.and.callThrough();
      storeMock.dispatch.calls.reset();
      rowMock = getMyPerformanceTableRowMock(1)[0];
      currentMock = getMyPerformanceEntitiesDataMock();
      expectedSaveMyPerformanceStatePayload = Object.assign({}, stateMock.myPerformance.current, {
        filter: stateMock.myPerformanceFilter
      });
      componentInstanceCopy.selectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;
      componentInstanceCopy.selectedSkuPackageType = stateMock.myPerformance.current.selectedSkuPackageType;
    });

    it('should dispatch the SaveMyPerformanceState action with the payload containing the "current" state but the filter ' +
    'from the filter state', () => {
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.roleGroups;
      rowMock.metadata.entityType = EntityType.RoleGroup;
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SaveMyPerformanceState(expectedSaveMyPerformanceStatePayload));
      expect(storeMock.dispatch.calls.argsFor(0)[0].payload.filter).toEqual(stateMock.myPerformanceFilter);
      expect(storeMock.dispatch.calls.argsFor(0)[0].payload.filter).not.toEqual(stateMock.myPerformance.current.filter);
    });

    it('should trigger appropriate actions when current salesHierarchyViewType is roleGroups and the row metadata ' +
    'does NOT contain alternateHierarchyId', () => {
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.roleGroups;
      rowMock.metadata.entityType = EntityType.RoleGroup;
      rowMock.metadata.exceptionHierarchy = false;
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SaveMyPerformanceState(expectedSaveMyPerformanceStatePayload));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SetMyPerformanceSelectedEntityType(rowMock.metadata.entityType));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchEntityWithPerformance({
        positionId: rowMock.metadata.positionId,
        alternateHierarchyId: undefined,
        isMemberOfExceptionHierarchy: false,
        entityTypeGroupName: EntityPeopleType[rowMock.descriptionRow0],
        entityTypeCode: rowMock.metadata.entityTypeCode,
        entityType: rowMock.metadata.entityType,
        selectedEntityDescription: rowMock.descriptionRow0,
        entities: stateMock.myPerformance.current.responsibilities.groupedEntities[EntityPeopleType[rowMock.descriptionRow0]],
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: stateMock.myPerformance.current.selectedBrandCode,
        skuPackageType: stateMock.myPerformance.current.selectedSkuPackageType
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new FetchProductMetrics({
        positionId: rowMock.metadata.positionId,
        entityTypeCode: rowMock.metadata.entityTypeCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: EntityType.RoleGroup,
        selectedBrandCode: stateMock.myPerformance.current.selectedBrandCode,
        inAlternateHierarchy: false
      }));
    });

    it('should trigger appropriate actions when current salesHierarchyViewType is roleGroups and the row metadata ' +
    'contains an alternateHierarchyId', () => {
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };

      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.roleGroups;
      rowMock.metadata.entityType = EntityType.RoleGroup;
      rowMock.metadata.alternateHierarchyId = chance.string();
      rowMock.metadata.exceptionHierarchy = false;
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(5);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SaveMyPerformanceState(expectedSaveMyPerformanceStatePayload));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SetMyPerformanceSelectedEntityType(rowMock.metadata.entityType));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(
        new ResponsibilitiesActions.SetAlternateHierarchyId(rowMock.metadata.alternateHierarchyId));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ResponsibilitiesActions.FetchEntityWithPerformance({
        positionId: rowMock.metadata.positionId,
        alternateHierarchyId: undefined,
        isMemberOfExceptionHierarchy: false,
        entityTypeGroupName: EntityPeopleType[rowMock.descriptionRow0],
        entityTypeCode: rowMock.metadata.entityTypeCode,
        entityType: rowMock.metadata.entityType,
        selectedEntityDescription: rowMock.descriptionRow0,
        entities: stateMock.myPerformance.current.responsibilities.groupedEntities[EntityPeopleType[rowMock.descriptionRow0]],
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: stateMock.myPerformance.current.selectedBrandCode,
        skuPackageType: stateMock.myPerformance.current.selectedSkuPackageType
      }));
      expect(storeMock.dispatch.calls.argsFor(4)[0]).toEqual(
        new ProductMetricsActions.FetchProductMetrics({
          inAlternateHierarchy: false,
          positionId: rowMock.metadata.positionId,
          entityTypeCode: rowMock.metadata.entityTypeCode,
          filter: stateMock.myPerformanceFilter,
          selectedEntityType: rowMock.metadata.entityType,
          selectedBrandCode: stateMock.myPerformance.current.selectedBrandCode
        })
      );
    });

    it('should trigger appropriate actions when current salesHierarchyViewType is accounts', () => {
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };

      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.accounts;
      componentInstance.handleElementClicked(params);
      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SaveMyPerformanceState(expectedSaveMyPerformanceStatePayload));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SetMyPerformanceSelectedEntityType(rowMock.metadata.entityType));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchSubAccounts({
        positionId: rowMock.metadata.positionId,
        contextPositionId: stateMock.myPerformance.current.responsibilities.positionId,
        entityTypeAccountName: rowMock.descriptionRow0,
        filter: stateMock.myPerformanceFilter as any,
        selectedPositionId: rowMock.metadata.positionId,
        selectedEntityDescription: rowMock.descriptionRow0,
        brandSkuCode: componentInstanceCopy.selectedBrandCode,
        skuPackageType: stateMock.myPerformance.current.selectedSkuPackageType
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new FetchProductMetrics({
        positionId: rowMock.metadata.positionId,
        contextPositionId: stateMock.myPerformance.current.responsibilities.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: EntityType.Account,
        selectedBrandCode: stateMock.myPerformance.current.selectedBrandCode,
        inAlternateHierarchy: false
      }));
    });

    it('should trigger appropriate actions when current salesHierarchyViewType is people and the responsibilitiesState ' +
    'does NOT contain a alternateHierarchyId', () => {
      rowMock.metadata.exceptionHierarchy = false;
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };

      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.people;
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SaveMyPerformanceState(expectedSaveMyPerformanceStatePayload));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SetMyPerformanceSelectedEntityType(rowMock.metadata.entityType));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchResponsibilities({
        positionId: rowMock.metadata.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityDescription: rowMock.descriptionRow0,
        brandSkuCode: stateMock.myPerformance.current.selectedBrandCode,
        skuPackageType: stateMock.myPerformance.current.selectedSkuPackageType,
        isMemberOfExceptionHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new FetchProductMetrics({
        positionId: rowMock.metadata.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: EntityType.Person,
        selectedBrandCode: stateMock.myPerformance.current.selectedBrandCode,
        inAlternateHierarchy: false
      }));
    });

    it('should trigger appropriate actions when current salesHierarchyViewType is people and the responsibilitiesState ' +
    'contains an alternateHierarchyId', () => {
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      const alternateHierarchyIdMock = chance.string();
      componentInstanceCopy.selectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;
      componentInstanceCopy.selectedSkuPackageCode = stateMock.myPerformance.current.selectedSkuPackageCode;
      componentInstanceCopy.selectedSkuPackageType = stateMock.myPerformance.current.selectedSkuPackageType;
      currentMock.selectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;
      currentMock.selectedSkuPackageCode = stateMock.myPerformance.current.selectedSkuPackageCode;
      currentMock.selectedSkuPackageType = stateMock.myPerformance.current.selectedSkuPackageType;

      currentMock.responsibilities.alternateHierarchyId = alternateHierarchyIdMock;
      params.row.metadata.alternateHierarchyId = currentMock.responsibilities.alternateHierarchyId;
      params.row.metadata.entityType = EntityType.Person;
      params.row.metadata.brandCode = chance.string();
      rowMock.metadata.exceptionHierarchy = false;
      currentSubject.next(currentMock);
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.people;
      componentInstance.handleElementClicked(params);

      const expectedSaveMyPerformanceState: MyPerformanceEntitiesData = Object.assign({}, currentMock, {
        filter: stateMock.myPerformanceFilter
      });

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SaveMyPerformanceState(expectedSaveMyPerformanceState));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SetMyPerformanceSelectedEntityType(rowMock.metadata.entityType));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchAlternateHierarchyResponsibilities({
        positionId: rowMock.metadata.positionId,
        alternateHierarchyId: alternateHierarchyIdMock,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityDescription: rowMock.descriptionRow0,
        brandSkuCode: currentMock.selectedSkuPackageCode,
        skuPackageType: currentMock.selectedSkuPackageType,
        isMemberOfExceptionHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(
        new ProductMetricsActions.FetchProductMetrics({
          contextPositionId: currentMock.responsibilities.alternateHierarchyId,
          inAlternateHierarchy: true,
          positionId: rowMock.metadata.positionId,
          entityTypeCode: rowMock.metadata.entityTypeCode,
          filter: stateMock.myPerformanceFilter,
          selectedEntityType: rowMock.metadata.entityType,
          selectedBrandCode: componentInstanceCopy.selectedBrandCode
        })
      );
    });

    it('should dispatch FetchEntityWithPerformance when salesHierarchyViewType is roleGroups', () => {
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.roleGroups;

      const entityTypes: EntityType[] = Object.keys(EntityType)
        .filter((key: EntityType) => {
          return key !== EntityType.ResponsibilitiesGroup;
        })
        .map((key: EntityType) => EntityType[key]);

      rowMock.metadata.entityType = entityTypes[chance.integer({ min: 0, max: entityTypes.length - 1 })];
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchEntityWithPerformance({
        positionId: rowMock.metadata.positionId,
        alternateHierarchyId: undefined,
        isMemberOfExceptionHierarchy: false,
        entityTypeGroupName: EntityPeopleType[rowMock.descriptionRow0],
        entityTypeCode: rowMock.metadata.entityTypeCode,
        entityType: rowMock.metadata.entityType,
        selectedEntityDescription: rowMock.descriptionRow0,
        entities: stateMock.myPerformance.current.responsibilities.groupedEntities[EntityPeopleType[rowMock.descriptionRow0]],
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: stateMock.myPerformance.current.selectedBrandCode,
        skuPackageType: stateMock.myPerformance.current.selectedSkuPackageType
      }));
    });

    it('should dispatch FetchEntityWithPerformance with an alternateHierarchyId when the responsibilitiesState ' +
    'contains an alternateHierarchyId', () => {
      currentMock.responsibilities.alternateHierarchyId = chance.string();
      currentSubject.next(currentMock);
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.roleGroups;
      componentInstanceCopy.selectedBrandCode = currentMock.selectedBrandCode;
      componentInstanceCopy.selectedSkuPackageCode = currentMock.selectedSkuPackageCode;
      componentInstanceCopy.selectedSkuPackageType = currentMock.selectedSkuPackageType;
      currentMock.selectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;

      const entityTypes: EntityType[] = Object.keys(EntityType)
        .filter((key: EntityType) => key !== EntityType.ResponsibilitiesGroup)
        .map((key: EntityType) => EntityType[key]);

      rowMock.metadata.entityType = entityTypes[chance.integer({ min: 0, max: entityTypes.length - 1 })];
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchEntityWithPerformance({
        positionId: rowMock.metadata.positionId,
        alternateHierarchyId: currentMock.responsibilities.alternateHierarchyId,
        isMemberOfExceptionHierarchy: false,
        entityTypeGroupName: EntityPeopleType[rowMock.descriptionRow0],
        entityTypeCode: rowMock.metadata.entityTypeCode,
        entityType: rowMock.metadata.entityType,
        selectedEntityDescription: rowMock.descriptionRow0,
        entities: stateMock.myPerformance.current.responsibilities.groupedEntities[EntityPeopleType[rowMock.descriptionRow0]],
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: currentMock.selectedSkuPackageCode,
        skuPackageType: currentMock.selectedSkuPackageType
      }));
    });

    it('should send analytics event for any viewType', () => {
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      const salesHierarchyViewTypes = Object.keys(SalesHierarchyViewType).map(key => SalesHierarchyViewType[key]);
      componentInstance.salesHierarchyViewType = salesHierarchyViewTypes[chance.integer(
        {min: 0 , max: salesHierarchyViewTypes.length - 1})];
      componentInstance.handleElementClicked(params);
      expect(analyticsServiceMock.trackEvent.calls.argsFor(0)).toEqual([
        'Team Snapshot',
        'Link Click',
        rowMock.descriptionRow0
      ]);
    });

    describe('when viewing subacounts', () => {

      beforeEach(() => {
        componentInstance.salesHierarchyViewType = SalesHierarchyViewType.subAccounts;
      });

      it('should set the subaccount code in the state and refetch product metrics', () => {
        currentSubject.next(currentMock);
        storeMock.dispatch.and.callThrough();
        storeMock.dispatch.calls.reset();
        componentInstance.salesHierarchyViewType = SalesHierarchyViewType.subAccounts;
        const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock};
        componentInstance.handleElementClicked(params);

        expect(storeMock.dispatch.calls.count()).toBe(3);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
          new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(rowMock.metadata.entityType));
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SetMyPerformanceSelectedSubaccountCode(rowMock.metadata.positionId));
        expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ProductMetricsActions.FetchProductMetrics({
          positionId: currentMock.selectedSubaccountCode,
          filter: stateMock.myPerformanceFilter,
          selectedEntityType: currentMock.selectedEntityType,
          selectedBrandCode: stateMock.myPerformance.current.selectedBrandCode,
          inAlternateHierarchy: false,
          isMemberOfExceptionHierarchy: false
        }));
      });
    });

    describe('when viewing distributors', () => {

      beforeEach(() => {
        componentInstance.salesHierarchyViewType = SalesHierarchyViewType.distributors;
      });

      it('should set the distributor code in the state and refetch product metrics', () => {
        currentSubject.next(currentMock);
        storeMock.dispatch.and.callThrough();
        storeMock.dispatch.calls.reset();
        componentInstance.salesHierarchyViewType = SalesHierarchyViewType.distributors;
        const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock};
        componentInstance.handleElementClicked(params);

        expect(storeMock.dispatch.calls.count()).toBe(3);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
          new MyPerformanceVersionActions.SetMyPerformanceSelectedEntityType(rowMock.metadata.entityType));
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SetMyPerformanceSelectedDistributorCode(rowMock.metadata.positionId));
        expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ProductMetricsActions.FetchProductMetrics({
          positionId: currentMock.selectedDistributorCode,
          filter: stateMock.myPerformanceFilter,
          selectedEntityType: currentMock.selectedEntityType,
          selectedBrandCode: stateMock.myPerformance.current.selectedBrandCode,
          inAlternateHierarchy: false,
          isMemberOfExceptionHierarchy: false
        }));
      });
    });
  });

  describe('when right side data row is clicked', () => {
    let rowMock: MyPerformanceTableRow;

    beforeEach(() => {
      storeMock.dispatch.and.callThrough();
      storeMock.dispatch.calls.reset();
      rowMock = getMyPerformanceTableRowMock(1)[0];
      rowMock.metadata.positionId = undefined;
    });

    it('should trigger appropriate actions when current salesHierarchyViewType is roleGroups and ' +
      'when productMetricsViewType is brands', () => {
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.roleGroups;
      componentInstance.productMetricsViewType = ProductMetricsViewType.brands;
      const params: HandleElementClickedParameters = { leftSide: false, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SelectBrandValues(rowMock.metadata.brandCode));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(
        new MyPerformanceVersionActions.SetMyPerformanceSelectedBrandCode(rowMock.metadata.brandCode)
      );

      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new FetchProductMetrics({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        entityTypeCode: componentInstanceCopy.currentState.responsibilities.entityTypeCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        selectedBrandCode: rowMock.metadata.brandCode,
        inAlternateHierarchy: false,
        contextPositionId: componentInstanceCopy.currentState.responsibilities.positionId
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        groupedEntities: stateMock.myPerformance.current.responsibilities.groupedEntities,
        hierarchyGroups: stateMock.myPerformance.current.responsibilities.hierarchyGroups,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: rowMock.metadata.brandCode,
        skuPackageType: null,
        entityType: stateMock.myPerformance.current.selectedEntityType,
        alternateHierarchyId: stateMock.myPerformance.current.responsibilities.alternateHierarchyId,
        accountPositionId: stateMock.myPerformance.current.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
    });

    it('should trigger appropriate actions when current salesHierarchyViewType is accounts and ' +
      'when productMetricsViewType is brands', () => {
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.accounts;
      componentInstance.productMetricsViewType = ProductMetricsViewType.brands;
      const params: HandleElementClickedParameters = { leftSide: false, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SelectBrandValues(rowMock.metadata.brandCode));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(
        new MyPerformanceVersionActions.SetMyPerformanceSelectedBrandCode(rowMock.metadata.brandCode)
      );
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new FetchProductMetrics({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        entityTypeCode: componentInstanceCopy.currentState.responsibilities.entityTypeCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        selectedBrandCode: rowMock.metadata.brandCode,
        contextPositionId: stateMock.myPerformance.current.responsibilities.positionId,
        inAlternateHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        groupedEntities: stateMock.myPerformance.current.responsibilities.groupedEntities,
        hierarchyGroups: stateMock.myPerformance.current.responsibilities.hierarchyGroups,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: rowMock.metadata.brandCode,
        skuPackageType: null,
        entityType: stateMock.myPerformance.current.selectedEntityType,
        alternateHierarchyId: stateMock.myPerformance.current.responsibilities.alternateHierarchyId,
        accountPositionId: stateMock.myPerformance.current.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
    });

    it('should trigger appropriate actions when current salesHierarchyViewType is people and ' +
      'when productMetricsViewType is brands', () => {
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.people;
      componentInstance.productMetricsViewType = ProductMetricsViewType.brands;
      const params: HandleElementClickedParameters = { leftSide: false, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SelectBrandValues(rowMock.metadata.brandCode));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(
        new MyPerformanceVersionActions.SetMyPerformanceSelectedBrandCode(rowMock.metadata.brandCode)
      );
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new FetchProductMetrics({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        selectedBrandCode: rowMock.metadata.brandCode,
        entityTypeCode: stateMock.myPerformance.current.responsibilities.entityTypeCode,
        contextPositionId: stateMock.myPerformance.current.responsibilities.positionId,
        inAlternateHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        groupedEntities: stateMock.myPerformance.current.responsibilities.groupedEntities,
        hierarchyGroups: stateMock.myPerformance.current.responsibilities.hierarchyGroups,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: rowMock.metadata.brandCode,
        skuPackageType: null,
        entityType: stateMock.myPerformance.current.selectedEntityType,
        alternateHierarchyId: stateMock.myPerformance.current.responsibilities.alternateHierarchyId,
        accountPositionId: stateMock.myPerformance.current.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
    });

    it('should trigger appropriate actions when current salesHierarchyViewType is subAccounts and ' +
      'when productMetricsViewType is brands', () => {
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.subAccounts;
      componentInstance.productMetricsViewType = ProductMetricsViewType.brands;
      const params: HandleElementClickedParameters = { leftSide: false, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SelectBrandValues(rowMock.metadata.brandCode));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(
        new MyPerformanceVersionActions.SetMyPerformanceSelectedBrandCode(rowMock.metadata.brandCode)
      );
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new FetchProductMetrics({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        selectedBrandCode: rowMock.metadata.brandCode,
        entityTypeCode: stateMock.myPerformance.current.responsibilities.entityTypeCode,
        contextPositionId: stateMock.myPerformance.current.responsibilities.positionId,
        inAlternateHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        groupedEntities: stateMock.myPerformance.current.responsibilities.groupedEntities,
        hierarchyGroups: stateMock.myPerformance.current.responsibilities.hierarchyGroups,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: rowMock.metadata.brandCode,
        skuPackageType: null,
        entityType: stateMock.myPerformance.current.selectedEntityType,
        alternateHierarchyId: stateMock.myPerformance.current.responsibilities.alternateHierarchyId,
        accountPositionId: stateMock.myPerformance.current.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
    });

    it('should trigger appropriate actions when current salesHierarchyViewType is distributors and ' +
      'when productMetricsViewType is brands', () => {
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.distributors;
      componentInstance.productMetricsViewType = ProductMetricsViewType.brands;
      const params: HandleElementClickedParameters = { leftSide: false, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SelectBrandValues(rowMock.metadata.brandCode));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(
        new MyPerformanceVersionActions.SetMyPerformanceSelectedBrandCode(rowMock.metadata.brandCode)
      );
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new FetchProductMetrics({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        selectedBrandCode: rowMock.metadata.brandCode,
        entityTypeCode: stateMock.myPerformance.current.responsibilities.entityTypeCode,
        contextPositionId: stateMock.myPerformance.current.responsibilities.positionId,
        inAlternateHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        groupedEntities: stateMock.myPerformance.current.responsibilities.groupedEntities,
        hierarchyGroups: stateMock.myPerformance.current.responsibilities.hierarchyGroups,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: rowMock.metadata.brandCode,
        skuPackageType: null,
        entityType: stateMock.myPerformance.current.selectedEntityType,
        alternateHierarchyId: stateMock.myPerformance.current.responsibilities.alternateHierarchyId,
        accountPositionId: stateMock.myPerformance.current.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
    });

    it('should trigger appropriate actions with any salesHierarchyViewType and ' +
      'when productMetricsViewType is skus', () => {
      const salesHierarchyViewTypes = Object.keys(SalesHierarchyViewType).map(key => SalesHierarchyViewType[key]);
      componentInstance.salesHierarchyViewType = salesHierarchyViewTypes[chance.integer(
        {min: 0 , max: salesHierarchyViewTypes.length - 1})];
      componentInstance.productMetricsViewType = ProductMetricsViewType.skus;
      const params: HandleElementClickedParameters = { leftSide: false, type: RowType.data, index: 0, row: rowMock };
      const payLoad: SkuPackagePayload = {skuPackageCode: rowMock.metadata.skuPackageCode,
        skuPackageType: rowMock.metadata.skuPackageType};
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(2);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
        new MyPerformanceVersionActions.SetMyPerformanceSelectedSkuCode(payLoad)
      );
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        groupedEntities: stateMock.myPerformance.current.responsibilities.groupedEntities,
        hierarchyGroups: stateMock.myPerformance.current.responsibilities.hierarchyGroups,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: rowMock.metadata.skuPackageCode,
        skuPackageType: rowMock.metadata.skuPackageType,
        entityType: stateMock.myPerformance.current.selectedEntityType,
        alternateHierarchyId: stateMock.myPerformance.current.responsibilities.alternateHierarchyId,
        accountPositionId: stateMock.myPerformance.current.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
    });

    it('should call the analytics service with the correct params when the rowtype is data', () => {
      const params: HandleElementClickedParameters = { leftSide: false, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);
      expect(analyticsServiceMock.trackEvent.calls.argsFor(0)).toEqual(['Product Snapshot', 'Link Click', rowMock.descriptionRow0]);
    });

    it('should call the analytics service with the correct params when the rowtype is dismissableTotal', () => {
      const params: HandleElementClickedParameters = { leftSide: false, type: RowType.dismissableTotal, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);
      expect(analyticsServiceMock.trackEvent.calls.argsFor(0)).toEqual(['Product Snapshot', 'Link Click', rowMock.descriptionRow0]);
    });
  });

  describe('when left side data row link clicked', () => {
    let rowMock: MyPerformanceTableRow;
    let accountNameMock: string;
    let hierarchyEntityMock: HierarchyEntity;
    let currentMock: MyPerformanceEntitiesData;
    let insideAlternateHierarchyMock: boolean;
    let insideExceptionHierarchyMock: boolean;
    let alternateHierarchyIdMock: string;

    beforeEach(() => {
      rowMock = getMyPerformanceTableRowMock(1)[0];
      accountNameMock = chance.string();
      hierarchyEntityMock = getEntityPropertyResponsibilitiesMock();
      currentMock = getMyPerformanceEntitiesDataMock();
      alternateHierarchyIdMock = chance.string();
      insideExceptionHierarchyMock = chance.bool();
      insideAlternateHierarchyMock = !!alternateHierarchyIdMock;
    });

    describe('when distributor subline link clicked', () => {
      it('should correctly call functions to go to accountDashboard when distributor clicked with correct ' +
        'params within alternate hierarchy', () => {
        rowMock.metadata.entityType = EntityType.Distributor;
        currentMock.responsibilities.alternateHierarchyId = alternateHierarchyIdMock;
        currentMock.responsibilities.exceptionHierarchy = insideExceptionHierarchyMock;
        currentSubject.next(currentMock);
        componentInstance.handleSublineClicked(rowMock);
        expect(myPerformanceServiceMock.accountDashboardStateParameters).toHaveBeenCalledWith
        (insideAlternateHierarchyMock, insideExceptionHierarchyMock, stateMock.myPerformanceFilter, rowMock);
        expect(stateMock.href).toHaveBeenCalledWith(
          'accounts',
          myPerformanceServiceMock.accountDashboardStateParameters(insideAlternateHierarchyMock, stateMock.myPerformanceFilter, rowMock));
        expect(windowServiceMock.nativeWindow).toHaveBeenCalled();
        expect(windowMock.open).toHaveBeenCalled();
        expect(analyticsServiceMock.trackEvent).toHaveBeenCalledWith(
          'Team Performance', 'Go to Account Dashboard', accountDashboardStateParamMock.distributorid);
      });
    });

    describe('when subaccount subline link clicked', () => {
      it('should correctly call functions for accountDashboard when subAccount clicked with matching hierarchy entity within ' +
        'alternate hierarchy', () => {
        delete accountDashboardStateParamMock.distributorid;
        rowMock.metadata.entityType = EntityType.SubAccount;
        currentMock.responsibilities.alternateHierarchyId = alternateHierarchyIdMock;
        currentMock.responsibilities.exceptionHierarchy = insideExceptionHierarchyMock;
        currentSubject.next(currentMock);
        hierarchyEntityMock.positionId = rowMock.metadata.positionId;
        currentMock.responsibilities.groupedEntities = {[accountNameMock]: [hierarchyEntityMock]};
        currentSubject.next(currentMock);
        componentInstance.handleSublineClicked(rowMock);
        expect(myPerformanceServiceMock.accountDashboardStateParameters).toHaveBeenCalledWith(
          insideAlternateHierarchyMock,
          insideExceptionHierarchyMock,
          stateMock.myPerformanceFilter,
          rowMock,
          hierarchyEntityMock.premiseType
        );
        expect(stateMock.href).toHaveBeenCalledWith(
          'accounts',
          myPerformanceServiceMock.accountDashboardStateParameters(insideAlternateHierarchyMock, stateMock.myPerformanceFilter,
            rowMock, hierarchyEntityMock.premiseType));
        expect(windowServiceMock.nativeWindow).toHaveBeenCalled();
        expect(windowMock.open).toHaveBeenCalled();
        expect(analyticsServiceMock.trackEvent).toHaveBeenCalledWith(
          'Team Performance', 'Go to Account Dashboard', accountDashboardStateParamMock.subaccountid);
      });

      it('should correctly call functions for accountDashboard when subAccount clicked but no matching ' +
        'hierarchy entity within alternate hierarchy', () => {
        delete accountDashboardStateParamMock.distributorid;
        rowMock.metadata.entityType = EntityType.SubAccount;
        currentMock.responsibilities.alternateHierarchyId = alternateHierarchyIdMock;
        currentMock.responsibilities.exceptionHierarchy = insideExceptionHierarchyMock;
        currentSubject.next(currentMock);
        hierarchyEntityMock.positionId = rowMock.metadata.positionId + chance.character();
        myPerformanceStateMock.current.responsibilities.groupedEntities[accountNameMock] = [hierarchyEntityMock];
        currentSubject.next(currentMock);
        componentInstance.handleSublineClicked(rowMock);
        expect(myPerformanceServiceMock.accountDashboardStateParameters).toHaveBeenCalledWith
        (insideAlternateHierarchyMock, insideExceptionHierarchyMock, stateMock.myPerformanceFilter, rowMock);
        expect(stateMock.href).toHaveBeenCalledWith(
          'accounts',
          myPerformanceServiceMock.accountDashboardStateParameters(insideAlternateHierarchyMock, stateMock.myPerformanceFilter, rowMock));
        expect(windowServiceMock.nativeWindow).toHaveBeenCalled();
        expect(windowMock.open).toHaveBeenCalled();
        expect(analyticsServiceMock.trackEvent).toHaveBeenCalledWith(
          'Team Performance', 'Go to Account Dashboard', accountDashboardStateParamMock.subaccountid);
      });

      it('should correctly call functions for accountDashboard when subAccount clicked with matching hierarchy entity outside ' +
        'alternate hierarchy', () => {
        delete accountDashboardStateParamMock.distributorid;
        rowMock.metadata.entityType = EntityType.SubAccount;
        currentMock.responsibilities.alternateHierarchyId = null;
        currentMock.responsibilities.exceptionHierarchy = insideExceptionHierarchyMock;
        currentSubject.next(currentMock);
        insideAlternateHierarchyMock = false;
        hierarchyEntityMock.positionId = rowMock.metadata.positionId;
        currentMock.responsibilities.groupedEntities = {[accountNameMock]: [hierarchyEntityMock]};
        currentSubject.next(currentMock);
        componentInstance.handleSublineClicked(rowMock);
        expect(myPerformanceServiceMock.accountDashboardStateParameters).toHaveBeenCalledWith(
          insideAlternateHierarchyMock,
          insideExceptionHierarchyMock,
          stateMock.myPerformanceFilter,
          rowMock,
          hierarchyEntityMock.premiseType
        );
        expect(stateMock.href).toHaveBeenCalledWith(
          'accounts',
          myPerformanceServiceMock.accountDashboardStateParameters(insideAlternateHierarchyMock, stateMock.myPerformanceFilter,
            rowMock, hierarchyEntityMock.premiseType));
        expect(windowServiceMock.nativeWindow).toHaveBeenCalled();
        expect(windowMock.open).toHaveBeenCalled();
        expect(analyticsServiceMock.trackEvent).toHaveBeenCalledWith(
          'Team Performance', 'Go to Account Dashboard', accountDashboardStateParamMock.subaccountid);
      });
    });
  });

  describe('when left side total row is clicked', () => {
    describe('when viewtype is subaccounts', () => {
      it('should clear the selected subaccount, set the entitytype to account,refresh performances and send analytic event', () => {
        componentInstance.salesHierarchyViewType = SalesHierarchyViewType.subAccounts;
        const params: HandleElementClickedParameters = { leftSide: true, type: RowType.total, index: 0};
        componentInstance.handleElementClicked(params);
        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new ClearMyPerformanceSelectedSubaccountCode());
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SetMyPerformanceSelectedEntityType(EntityType.Account));
        expect(analyticsServiceMock.trackEvent.calls.argsFor(0)).toEqual([
          'Team Snapshot',
          'Link Click',
          'TOTAL'
        ]);
      });
    });

    describe('when viewtype is distributors', () => {
      it('should clear the selected distributor, set the entitytype to person,refresh performances and send analytic event', () => {
        componentInstance.salesHierarchyViewType = SalesHierarchyViewType.distributors;
        const params: HandleElementClickedParameters = { leftSide: true, type: RowType.total, index: 0};
        componentInstance.handleElementClicked(params);
        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new ClearMyPerformanceSelectedDistributorCode());
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SetMyPerformanceSelectedEntityType(EntityType.Person));
        expect(analyticsServiceMock.trackEvent.calls.argsFor(0)).toEqual([
          'Team Snapshot',
          'Link Click',
          'TOTAL'
        ]);
      });
    });
  });

  describe('when right side data row is clicked', () => {
    it('should dispatch appropriate actions for clearing the selectedSkuPackageCode', () => {
      storeMock.dispatch.calls.reset();

      let rowMock = getMyPerformanceTableRowMock(1)[0];
      myPerformanceProductMetricsMock = {
        status: ActionStatus.Fetching,
        products: {brandValues: []},
        productMetricsViewType: ProductMetricsViewType.skus
      };
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      componentInstanceCopy.selectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;

      const params: HandleElementClickedParameters = { leftSide: false, type: RowType.dismissableTotal, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);
      expect(storeMock.dispatch.calls.count()).toBe(2);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
        new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        groupedEntities: stateMock.myPerformance.current.responsibilities.groupedEntities,
        hierarchyGroups: stateMock.myPerformance.current.responsibilities.hierarchyGroups,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: stateMock.myPerformance.current.selectedBrandCode,
        skuPackageType: null,
        entityType: stateMock.myPerformance.current.selectedEntityType,
        alternateHierarchyId: stateMock.myPerformance.current.responsibilities.alternateHierarchyId,
        accountPositionId: stateMock.myPerformance.current.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
    });
  });

  describe('handleBreadcrumbEntityClicked', () => {
    describe('when steps back are possible', () => {
      let breadcrumbTrailMock: string[];
      let breadcrumbSelectionIndex: number;
      let expectedStepsBack: number;
      let expectedPositionId: string;
      let expectedEntityTypeCode: string;
      let expectedSelectedBrandCode: string;
      let previousVersion: MyPerformanceEntitiesData;
      let selectedVersion: MyPerformanceEntitiesData;
      let versionsMock: MyPerformanceEntitiesData[];

      function setupVersionAndBreadcrumbMocks(selectedSalesHierarchyViewType: SalesHierarchyViewType) {
        versionsMock = generateMockVersions(4, 9);
        previousVersion = versionsMock[versionsMock.length - 1];
        const breadcrumbTrailLength = versionsMock.length + 1;
        breadcrumbTrailMock = Array(breadcrumbTrailLength).fill('').map(() => chance.string());
        breadcrumbSelectionIndex = chance.natural({max: versionsMock.length - 2});
        expectedStepsBack = breadcrumbTrailMock.length - breadcrumbSelectionIndex - 1;
        versionsMock[breadcrumbSelectionIndex].salesHierarchyViewType.viewType = selectedSalesHierarchyViewType;
        versionsMock[breadcrumbSelectionIndex].filter = stateMock.myPerformanceFilter;
        versionsMock[breadcrumbSelectionIndex].selectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;
        versionsMock[breadcrumbSelectionIndex].selectedSkuPackageCode = stateMock.myPerformance.current.selectedSkuPackageCode;
        versionsMock[breadcrumbSelectionIndex].selectedSkuPackageType = stateMock.myPerformance.current.selectedSkuPackageType;
        selectedVersion = versionsMock[breadcrumbSelectionIndex];
        expectedPositionId = versionsMock[breadcrumbSelectionIndex].responsibilities.positionId;
        expectedEntityTypeCode = versionsMock[breadcrumbSelectionIndex].responsibilities.entityTypeCode;
        expectedSelectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;
        versionsSubject.next(versionsMock);
      }

      beforeEach(() => {
        storeMock.dispatch.and.callThrough();
        storeMock.dispatch.calls.reset();
        componentInstanceCopy.selectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;
        componentInstanceCopy.selectedSkuPackageCode = stateMock.myPerformance.current.selectedSkuPackageCode;
        componentInstanceCopy.selectedSkuPackageType = stateMock.myPerformance.current.selectedSkuPackageType;
      });

      it('should dispatch RestoreMyPerformanceState and FetchProductMetrics ' +
         'when selected step has distributors SalesHierarchyViewType', () => {
        setupVersionAndBreadcrumbMocks(SalesHierarchyViewType.distributors);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entityDescription: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState(
          expectedStepsBack
        ));
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new ProductMetricsActions.FetchProductMetrics({
          positionId: selectedVersion.responsibilities.positionId,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: selectedVersion.selectedEntityType,
          selectedBrandCode: expectedSelectedBrandCode,
          inAlternateHierarchy: false,
          entityTypeCode: selectedVersion.responsibilities.entityTypeCode,
          contextPositionId: selectedVersion.responsibilities.positionId
        }));
      });

      it('should dispatch RestoreMyPerformanceState and FetchProductMetrics ' +
         'when selected step has subAccounts SalesHierarchyViewType', () => {
        setupVersionAndBreadcrumbMocks(SalesHierarchyViewType.subAccounts);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entityDescription: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState(
          expectedStepsBack
        ));
        expect(storeMock.dispatch.calls.argsFor(1)[0].type).toEqual(ProductMetricsActions.FETCH_PRODUCT_METRICS);
      });

      it('should dispatch RestoreMyPerformanceState and FetchProductMetrics ' +
         'when selected step has people SalesHierarchyViewType', () => {
        setupVersionAndBreadcrumbMocks(SalesHierarchyViewType.people);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entityDescription: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState(
          expectedStepsBack
        ));
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetrics({
          positionId: expectedPositionId,
          entityTypeCode: expectedEntityTypeCode,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: selectedVersion.selectedEntityType,
          selectedBrandCode: expectedSelectedBrandCode,
          inAlternateHierarchy: false,
          contextPositionId: selectedVersion.responsibilities.positionId
        }));
      });

      it('should dispatch RestoreMyPerformanceState and FetchProductMetrics ' +
         'when selected step has roleGroups SalesHierarchyViewType', () => {
        setupVersionAndBreadcrumbMocks(SalesHierarchyViewType.roleGroups);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entityDescription: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState(
          expectedStepsBack
        ));
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetrics({
          positionId: expectedPositionId,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: selectedVersion.selectedEntityType,
          entityTypeCode: selectedVersion.responsibilities.entityTypeCode,
          inAlternateHierarchy: false,
          contextPositionId: selectedVersion.responsibilities.positionId,
          selectedBrandCode: expectedSelectedBrandCode
        }));
      });

      it('should dispatch RestoreMyPerformanceState and FetchProductMetrics ' +
         'when selected step has accounts SalesHierarchyViewType', () => {
        setupVersionAndBreadcrumbMocks(SalesHierarchyViewType.accounts);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entityDescription: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState(
          expectedStepsBack
        ));
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetrics({
          positionId: expectedPositionId,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: selectedVersion.selectedEntityType,
          inAlternateHierarchy: false,
          entityTypeCode: selectedVersion.responsibilities.entityTypeCode,
          contextPositionId: selectedVersion.responsibilities.positionId,
          selectedBrandCode: expectedSelectedBrandCode
        }));
      });

      it('should send analytics event for any salesHierarchyViewType', () => {
        const salesHierarchyViewTypes = Object.keys(SalesHierarchyViewType).map(key => SalesHierarchyViewType[key]);
        componentInstance.salesHierarchyViewType = sample(salesHierarchyViewTypes);
        setupVersionAndBreadcrumbMocks(componentInstance.salesHierarchyViewType);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entityDescription: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });
        expect(analyticsServiceMock.trackEvent.calls.argsFor(0)).toEqual([
          'Team Snapshot',
          'Link Click',
          'Breadcrumb'
        ]);
      });

      it('should dispatch the RefreshAllPerformances action when the current filter state and previous state`s filter mismatch', () => {
        setupVersionAndBreadcrumbMocks(SalesHierarchyViewType.people);

        const previousVersionMock = versionsMock[breadcrumbSelectionIndex];

        versionsMock[breadcrumbSelectionIndex].filter = getMyPerformanceFilterMock();
        versionsSubject.next(versionsMock);

        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entityDescription: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
          positionId: previousVersionMock.responsibilities.positionId,
          groupedEntities: previousVersionMock.responsibilities.groupedEntities,
          hierarchyGroups: previousVersionMock.responsibilities.hierarchyGroups,
          selectedEntityType: previousVersionMock.selectedEntityType,
          salesHierarchyViewType: previousVersionMock.salesHierarchyViewType.viewType,
          filter: stateMock.myPerformanceFilter,
          brandSkuCode: stateMock.myPerformance.current.selectedSkuPackageCode,
          skuPackageType: stateMock.myPerformance.current.selectedSkuPackageType,
          entityType: previousVersionMock.selectedEntityType,
          alternateHierarchyId: previousVersionMock.responsibilities.alternateHierarchyId,
          accountPositionId: previousVersionMock.responsibilities.accountPositionId,
          isMemberOfExceptionHierarchy: false
        }));
      });

      it('should dispatch the RefreshAllPerformances action'
        + ' when the current selectedBrandCode and previous state`s selectedBrandCode mismatch', () => {
        setupVersionAndBreadcrumbMocks(SalesHierarchyViewType.people);

        const previousVersionMock = versionsMock[breadcrumbSelectionIndex];
        componentInstanceCopy.selectedSkuPackageCode = null;
        componentInstanceCopy.selectedSkuPackageType = null;

        versionsMock[breadcrumbSelectionIndex].selectedBrandCode = versionsMock[breadcrumbSelectionIndex].selectedBrandCode + 'NOMATCH';
        versionsSubject.next(versionsMock);

        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entityDescription: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
          positionId: previousVersionMock.responsibilities.positionId,
          groupedEntities: previousVersionMock.responsibilities.groupedEntities,
          hierarchyGroups: previousVersionMock.responsibilities.hierarchyGroups,
          selectedEntityType: previousVersionMock.selectedEntityType,
          salesHierarchyViewType: previousVersionMock.salesHierarchyViewType.viewType,
          filter: stateMock.myPerformanceFilter,
          brandSkuCode: stateMock.myPerformance.current.selectedBrandCode,
          skuPackageType: null,
          entityType: previousVersionMock.selectedEntityType,
          alternateHierarchyId: previousVersionMock.responsibilities.alternateHierarchyId,
          accountPositionId: previousVersionMock.responsibilities.accountPositionId,
          isMemberOfExceptionHierarchy: false
        }));
      });

      it('should dispatch the RefreshAllPerformances action'
        + 'when the current selectedSkuPackageCode and previous state`s selectedSkuPackageCode mismatch', () => {
        setupVersionAndBreadcrumbMocks(SalesHierarchyViewType.people);

        const previousVersionMock = versionsMock[breadcrumbSelectionIndex];

        versionsMock[breadcrumbSelectionIndex].selectedSkuPackageCode
          = versionsMock[breadcrumbSelectionIndex].selectedSkuPackageCode + 'NOMATCH';
        versionsSubject.next(versionsMock);

        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entityDescription: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
          positionId: previousVersionMock.responsibilities.positionId,
          groupedEntities: previousVersionMock.responsibilities.groupedEntities,
          hierarchyGroups: previousVersionMock.responsibilities.hierarchyGroups,
          selectedEntityType: previousVersionMock.selectedEntityType,
          salesHierarchyViewType: previousVersionMock.salesHierarchyViewType.viewType,
          filter: stateMock.myPerformanceFilter,
          brandSkuCode: stateMock.myPerformance.current.selectedSkuPackageCode,
          skuPackageType: stateMock.myPerformance.current.selectedSkuPackageType,
          entityType: previousVersionMock.selectedEntityType,
          alternateHierarchyId: previousVersionMock.responsibilities.alternateHierarchyId,
          accountPositionId: previousVersionMock.responsibilities.accountPositionId,
          isMemberOfExceptionHierarchy: false
        }));
      });

      it('should close the opportunities table by setting isOpportunityTableExtended to false', () => {
        componentInstanceCopy.isOpportunityTableExtended = false;
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entityDescription: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(componentInstanceCopy.isOpportunityTableExtended).toBe(false);

        componentInstanceCopy.isOpportunityTableExtended = true;
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entityDescription: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(componentInstanceCopy.isOpportunityTableExtended).toBe(false);
      });
    });

    it('should not dispatch actions when steps back are not possible', () => {
      const breadcrumbLength = chance.natural({max: 9});
      const entityIndex = breadcrumbLength - 1;
      const breadcrumbMock = Array(breadcrumbLength).fill('').map(element => chance.string());
      const entityMock = breadcrumbMock[entityIndex];

      storeMock.dispatch.calls.reset();
      storeMock.select.calls.reset();

      componentInstance.handleBreadcrumbEntityClicked({
        trail: breadcrumbMock,
        entityDescription: entityMock
      });

      expect(storeMock.dispatch.calls.count()).toBe(0);
    });
  });

  describe('when filter option is selected (filterOptionSelected)', () => {
    let userService: any;
    let defaultPremiseTypeMock: PremiseTypeValue = PremiseTypeValue.On;
    let currentFilterMock: MyPerformanceFilter;

    beforeEach(inject(['userService'], (_userService: any) => {
      userService = _userService;
      userService.model.currentUser.srcTypeCd = [chance.string()];
      myPerformanceServiceMock.getUserDefaultPremiseType.and.returnValue(defaultPremiseTypeMock);
      currentFilterMock = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.CYTDBDL,
        premiseType: PremiseTypeValue.All
      };
      filterSubject.next(currentFilterMock);

      // simulate store updating due to dispatches, because analytics event relies on it being up-to-date
      storeMock.dispatch.and.callFake((action: MyPerformanceFilterActions.Action) => {
        switch (action.type) {
          case MyPerformanceFilterActions.SET_METRIC:
            currentFilterMock.metricType = action.payload;
            if (action.payload === MetricTypeValue.PointsOfDistribution) {
              currentFilterMock.distributionType = DistributionTypeValue.simple;
            }
            break;
          case MyPerformanceFilterActions.SET_PREMISE_TYPE:
            currentFilterMock.premiseType = action.payload;
            break;
          case MyPerformanceFilterActions.SET_TIME_PERIOD:
            currentFilterMock.dateRangeCode = action.payload;
            break;
          case MyPerformanceFilterActions.SET_DISTRIBUTION_TYPE:
            currentFilterMock.distributionType = action.payload;
            break;
          default:
            break;
        }
        filterSubject.next(currentFilterMock);
      });
      storeMock.dispatch.calls.reset();
    }));

    afterEach(() => {
      storeMock.dispatch.and.callThrough();
    });

    describe('when Metric Type filter is changed', () => {
      it('should dispatch appropriate actions and send analytics events', () => {
        const filterEventMock = {
          filterType: MyPerformanceFilterActionType.Metric,
          filterValue: MetricTypeValue.velocity
        };
        componentInstance.filterOptionSelected(filterEventMock);

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
          new MyPerformanceFilterActions.SetMetric(filterEventMock.filterValue)
        );
        expect(myPerformanceServiceMock.getUserDefaultPremiseType).toHaveBeenCalledWith(
          filterEventMock.filterValue,
          userService.model.currentUser.srcTypeCd[0]
        );
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(
          new MyPerformanceFilterActions.SetPremiseType(defaultPremiseTypeMock)
        );

        expect(analyticsServiceMock.trackEvent.calls.count()).toBe(3);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(0)).toEqual([
          'Team Performance Filters',
          'Metric',
          componentInstance.performanceMetric
        ]);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(1)).toEqual([
          'Team Performance Filters',
          'Time Period',
          componentInstance.dateRange.displayCode
        ]);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(2)).toEqual([
          'Team Performance Filters',
          'Premise Type',
          PremiseTypeValue[defaultPremiseTypeMock]
        ]);
      });

      it('should dispatch appropriate actions and send 4 analytics events when Metric Type is changed to distribution', () => {
        const filterEventMock = {
          filterType: MyPerformanceFilterActionType.Metric,
          filterValue: MetricTypeValue.PointsOfDistribution
        };
        componentInstance.filterOptionSelected(filterEventMock);

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
          new MyPerformanceFilterActions.SetMetric(filterEventMock.filterValue)
        );
        expect(myPerformanceServiceMock.getUserDefaultPremiseType).toHaveBeenCalledWith(
          filterEventMock.filterValue,
          userService.model.currentUser.srcTypeCd[0]
        );
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(
          new MyPerformanceFilterActions.SetPremiseType(defaultPremiseTypeMock)
        );

        expect(analyticsServiceMock.trackEvent.calls.count()).toBe(4);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(0)).toEqual([
          'Team Performance Filters',
          'Metric',
          componentInstance.performanceMetric
        ]);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(1)).toEqual([
          'Team Performance Filters',
          'Time Period',
          componentInstance.dateRange.displayCode
        ]);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(2)).toEqual([
          'Team Performance Filters',
          'Premise Type',
          PremiseTypeValue[currentFilterMock.premiseType]
        ]);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(3)).toEqual([
          'Team Performance Filters',
          'Distribution Type',
          DistributionTypeValue[currentFilterMock.distributionType]
        ]);
      });

      it('should not dispatch actions or send analytics when change matches current Metric Type', () => {
        const filterEventMock = {
          filterType: MyPerformanceFilterActionType.Metric,
          filterValue: currentFilterMock.metricType
        };
        componentInstance.filterOptionSelected(filterEventMock);
        expect(storeMock.dispatch).not.toHaveBeenCalled();
        expect(analyticsServiceMock.trackEvent).not.toHaveBeenCalled();
      });
    });

    describe('when Time Period filter is changed', () => {
      it('should dispatch appropriate actions and send analytics events', () => {
        const filterEventMock = {
          filterType: MyPerformanceFilterActionType.TimePeriod,
          filterValue: DateRangeTimePeriodValue.FYTM
        };
        componentInstance.filterOptionSelected(filterEventMock);

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
          new MyPerformanceFilterActions.SetTimePeriod(filterEventMock.filterValue)
        );

        expect(analyticsServiceMock.trackEvent.calls.count()).toBe(3);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(0)).toEqual([
          'Team Performance Filters',
          'Metric',
          componentInstance.performanceMetric
        ]);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(1)).toEqual([
          'Team Performance Filters',
          'Time Period',
          componentInstance.dateRange.displayCode
        ]);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(2)).toEqual([
          'Team Performance Filters',
          'Premise Type',
          PremiseTypeValue[currentFilterMock.premiseType]
        ]);
      });

      it('should not dispatch actions or send analytics when change matches current Time Period', () => {
        const filterEventMock = {
          filterType: MyPerformanceFilterActionType.TimePeriod,
          filterValue: currentFilterMock.dateRangeCode
        };
        componentInstance.filterOptionSelected(filterEventMock);
        expect(storeMock.dispatch).not.toHaveBeenCalled();
        expect(analyticsServiceMock.trackEvent).not.toHaveBeenCalled();
      });
    });

    describe('when Premise Type filter is changed', () => {
      it('should dispatch appropriate actions and send analytics events', () => {
        const filterEventMock = {
          filterType: MyPerformanceFilterActionType.PremiseType,
          filterValue: PremiseTypeValue.Off
        };
        componentInstance.filterOptionSelected(filterEventMock);

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
          new MyPerformanceFilterActions.SetPremiseType(filterEventMock.filterValue)
        );

        expect(analyticsServiceMock.trackEvent.calls.count()).toBe(3);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(0)).toEqual([
          'Team Performance Filters',
          'Metric',
          componentInstance.performanceMetric
        ]);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(1)).toEqual([
          'Team Performance Filters',
          'Time Period',
          componentInstance.dateRange.displayCode
        ]);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(2)).toEqual([
          'Team Performance Filters',
          'Premise Type',
          PremiseTypeValue[currentFilterMock.premiseType]
        ]);
      });

      it('should not dispatch actions or send analytics when change matches current Premise Type', () => {
        const filterEventMock = {
          filterType: MyPerformanceFilterActionType.PremiseType,
          filterValue: currentFilterMock.premiseType
        };
        componentInstance.filterOptionSelected(filterEventMock);
        expect(storeMock.dispatch).not.toHaveBeenCalled();
        expect(analyticsServiceMock.trackEvent).not.toHaveBeenCalled();
      });
    });

    describe('when Distribution Type filter is changed', () => {
      beforeEach(() => {
        currentFilterMock = {
          metricType: MetricTypeValue.PointsOfDistribution,
          dateRangeCode: DateRangeTimePeriodValue.CYTDBDL,
          premiseType: PremiseTypeValue.All,
          distributionType: DistributionTypeValue.simple
        };
        filterSubject.next(currentFilterMock);
      });

      it('should dispatch appropriate actions and send analytics events', () => {
        const filterEventMock = {
          filterType: MyPerformanceFilterActionType.DistributionType,
          filterValue: DistributionTypeValue.effective
        };
        componentInstance.filterOptionSelected(filterEventMock);

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
          new MyPerformanceFilterActions.SetDistributionType(filterEventMock.filterValue)
        );

        expect(analyticsServiceMock.trackEvent.calls.count()).toBe(4);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(0)).toEqual([
          'Team Performance Filters',
          'Metric',
          componentInstance.performanceMetric
        ]);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(1)).toEqual([
          'Team Performance Filters',
          'Time Period',
          componentInstance.dateRange.displayCode
        ]);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(2)).toEqual([
          'Team Performance Filters',
          'Premise Type',
          PremiseTypeValue[currentFilterMock.premiseType]
        ]);
        expect(analyticsServiceMock.trackEvent.calls.argsFor(3)).toEqual([
          'Team Performance Filters',
          'Distribution Type',
          DistributionTypeValue[currentFilterMock.distributionType]
        ]);
      });

      it('should not dispatch actions or send analytics when change matches current Distribution Type', () => {
        const filterEventMock = {
          filterType: MyPerformanceFilterActionType.DistributionType,
          filterValue: currentFilterMock.distributionType
        };
        componentInstance.filterOptionSelected(filterEventMock);
        expect(storeMock.dispatch).not.toHaveBeenCalled();
        expect(analyticsServiceMock.trackEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe('getProductMetricsSelectedBrandRow', () => {

    beforeEach(() => {
      myPerformanceTableDataTransformerService.getProductMetricsSelectedBrandRow.calls.reset();
    });

    it('should be called when viewtype is sku and selectedBrandCodeValues is defined', () => {
      myPerformanceProductMetricsMock = {status: ActionStatus.Fetched,
        products: {brandValues: []},
        selectedBrandCodeValues: getProductMetricsSkuMock(SkuPackageType.sku),
        productMetricsViewType: ProductMetricsViewType.skus};
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(myPerformanceTableDataTransformerService.getProductMetricsSelectedBrandRow).toHaveBeenCalledWith(
        myPerformanceProductMetricsMock.selectedBrandCodeValues);
    });

    it('should not be called product metrics are still fetching', () => {
      myPerformanceProductMetricsMock = {status: ActionStatus.Fetching,
        products: {brandValues: []},
        selectedBrandCodeValues: getProductMetricsSkuMock(SkuPackageType.sku),
        productMetricsViewType: ProductMetricsViewType.skus};
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(myPerformanceTableDataTransformerService.getProductMetricsSelectedBrandRow).not.toHaveBeenCalled();
    });

    it('should not be called when viewtype is sku and selectedBrandCodeValues is undefined', () => {
      myPerformanceProductMetricsMock = {status: ActionStatus.Fetched,
        products: {brandValues: []},
        productMetricsViewType: ProductMetricsViewType.skus};
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(myPerformanceTableDataTransformerService.getProductMetricsSelectedBrandRow).not.toHaveBeenCalled();
    });

    it('should not be called when viewtype is brand and selectedBrandCodeValues is defined', () => {
      myPerformanceProductMetricsMock = {status: ActionStatus.Fetched,
        products: {brandValues: []},
        selectedBrandCodeValues: getProductMetricsSkuMock(SkuPackageType.sku),
        productMetricsViewType: ProductMetricsViewType.brands};
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(myPerformanceTableDataTransformerService.getProductMetricsSelectedBrandRow).not.toHaveBeenCalled();
    });
  });

  describe('handleDismissableRowXClicked', () => {
    let currentMock: MyPerformanceEntitiesData;

    beforeEach(() => {
      storeMock.dispatch.and.callThrough();
      storeMock.dispatch.calls.reset();
      currentMock = getMyPerformanceEntitiesDataMock();
      currentMock.responsibilities = getResponsibilitesStateMock();
      myPerformanceTableDataTransformerService.getRightTableData.and.returnValue([getMyPerformanceTableRowMock]);
    });

    it('should dispatch all actions correctly and assign variables correctly and call 4 actions', () => {
      currentMock = getMyPerformanceEntitiesDataMock();
      currentMock.responsibilities.alternateHierarchyId = null;
      currentSubject.next(currentMock);
      componentInstanceCopy.selectedBrandCode = chance.string();
      componentInstance.handleDismissableRowXClicked();
      expect(analyticsServiceMock.trackEvent.calls.argsFor(0)).toEqual([
        'Product Snapshot',
        'Link Click',
        'All Brands'
      ]);
      expect(componentInstanceCopy.selectedBrandCode).toBe(undefined);
      expect(storeMock.dispatch.calls.count()).toBe(5);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new MyPerformanceVersionActions.ClearMyPerformanceSelectedBrandCode());
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ProductMetricsActions.DeselectBrandValues());
      expect(storeMock.dispatch.calls.argsFor(4)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: currentMock.responsibilities.positionId,
        groupedEntities: currentMock.responsibilities.groupedEntities,
        hierarchyGroups: currentMock.responsibilities.hierarchyGroups,
        selectedEntityType: currentMock.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter,
        entityType: currentMock.selectedEntityType,
        alternateHierarchyId: currentMock.responsibilities.alternateHierarchyId,
        accountPositionId: currentMock.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
    });

    it('should not be called when selectedBrandCode is truthy, viewtype is skus, and productMetrics is has values', () => {
      myPerformanceProductMetricsMock.status = ActionStatus.Fetched;
      myPerformanceProductMetricsMock.productMetricsViewType = ProductMetricsViewType.skus;
      myPerformanceProductMetricsMock.products = {skuValues: getProductMetricsWithSkuValuesMock(SkuPackageType.sku).skuValues};
      componentInstanceCopy.selectedBrandCode = myPerformanceProductMetricsMock.products.skuValues[0].brandCode;
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(storeMock.dispatch.calls.count()).toBe(0);
    });

    it('should be called when selectedBrandCode is truthy, viewtype is skus, and productMetrics is empty', () => {
      myPerformanceTableDataTransformerService.getRightTableData.and.returnValue([]);
      myPerformanceProductMetricsMock.status = ActionStatus.Fetched;
      myPerformanceProductMetricsMock.productMetricsViewType = ProductMetricsViewType.skus;
      myPerformanceProductMetricsMock.products = {skuValues: getProductMetricsWithSkuValuesMock(SkuPackageType.sku).skuValues};
      componentInstanceCopy.selectedBrandCode = myPerformanceProductMetricsMock.products.skuValues[0].brandCode;
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(storeMock.dispatch.calls.count()).toBe(5);
    });

    it('should not be called when selectedBrandCode is truthy, viewtype is skus, and productMetrics is undefined', () => {
      myPerformanceTableDataTransformerService.getRightTableData.and.returnValue(undefined);
      myPerformanceProductMetricsMock.status = ActionStatus.Fetched;
      myPerformanceProductMetricsMock.productMetricsViewType = ProductMetricsViewType.skus;
      myPerformanceProductMetricsMock.products = {skuValues: getProductMetricsWithSkuValuesMock(SkuPackageType.sku).skuValues};
      componentInstanceCopy.selectedBrandCode = myPerformanceProductMetricsMock.products.skuValues[0].brandCode;
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(storeMock.dispatch.calls.count()).toBe(0);
    });

    it('should not be called when selectedBrandCode is truthy, viewtype is brands, and productMetrics has values', () => {
      myPerformanceProductMetricsMock.status = ActionStatus.Fetched;
      myPerformanceProductMetricsMock.productMetricsViewType = ProductMetricsViewType.brands;
      myPerformanceProductMetricsMock.products = {skuValues: getProductMetricsWithSkuValuesMock(SkuPackageType.sku).skuValues};
      componentInstanceCopy.selectedBrandCode = myPerformanceProductMetricsMock.products.skuValues[0].brandCode;
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(storeMock.dispatch.calls.count()).toBe(0);
    });

    it('should not be called when selectedBrandCode is falsy, viewtype is skus, and productMetrics has values', () => {
      myPerformanceProductMetricsMock.status = ActionStatus.Fetched;
      myPerformanceProductMetricsMock.productMetricsViewType = ProductMetricsViewType.skus;
      myPerformanceProductMetricsMock.products = {skuValues: getProductMetricsWithSkuValuesMock(SkuPackageType.sku).skuValues};
      componentInstanceCopy.selectedBrandCode = null;
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(storeMock.dispatch.calls.count()).toBe(0);
    });

    it('should not be called when all variables are good but responsibilities is fetching with responsibilitiesStatus is error', () => {
      currentMock.responsibilities.responsibilitiesStatus = ActionStatus.Error;
      currentSubject.next(currentMock);
      myPerformanceTableDataTransformerService.getRightTableData.and.returnValue([]);
      myPerformanceProductMetricsMock.status = ActionStatus.Fetched;
      myPerformanceProductMetricsMock.productMetricsViewType = ProductMetricsViewType.skus;
      myPerformanceProductMetricsMock.products = {skuValues: getProductMetricsWithSkuValuesMock(SkuPackageType.sku).skuValues};
      componentInstanceCopy.selectedBrandCode = myPerformanceProductMetricsMock.products.skuValues[0].brandCode;
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(storeMock.dispatch.calls.count()).toBe(0);
    });

    it('should not be called when all variables are good but responsibilities is fetching with totalPerformanceStatus is error', () => {
      currentMock.responsibilities.totalPerformanceStatus = ActionStatus.Error;
      currentSubject.next(currentMock);
      myPerformanceTableDataTransformerService.getRightTableData.and.returnValue([]);
      myPerformanceProductMetricsMock.status = ActionStatus.Fetched;
      myPerformanceProductMetricsMock.productMetricsViewType = ProductMetricsViewType.skus;
      myPerformanceProductMetricsMock.products = {skuValues: getProductMetricsWithSkuValuesMock(SkuPackageType.sku).skuValues};
      componentInstanceCopy.selectedBrandCode = myPerformanceProductMetricsMock.products.skuValues[0].brandCode;
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(storeMock.dispatch.calls.count()).toBe(0);
    });

    it('should not be called when all variables are good but responsibilities is fetching with entitiesPerformanceStatus is error', () => {
      currentMock.responsibilities.entitiesPerformanceStatus = ActionStatus.Error;
      currentSubject.next(currentMock);
      myPerformanceTableDataTransformerService.getRightTableData.and.returnValue([]);
      myPerformanceProductMetricsMock.status = ActionStatus.Fetched;
      myPerformanceProductMetricsMock.productMetricsViewType = ProductMetricsViewType.skus;
      myPerformanceProductMetricsMock.products = {skuValues: getProductMetricsWithSkuValuesMock(SkuPackageType.sku).skuValues};
      componentInstanceCopy.selectedBrandCode = myPerformanceProductMetricsMock.products.skuValues[0].brandCode;
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(storeMock.dispatch.calls.count()).toBe(0);
    });

    it('should not be called when all variables are good but responsibilities is fetching with subaccountsStatus is error', () => {
      currentMock.responsibilities.subaccountsStatus = ActionStatus.Error;
      currentSubject.next(currentMock);
      myPerformanceTableDataTransformerService.getRightTableData.and.returnValue([]);
      myPerformanceProductMetricsMock.status = ActionStatus.Fetched;
      myPerformanceProductMetricsMock.productMetricsViewType = ProductMetricsViewType.skus;
      myPerformanceProductMetricsMock.products = {skuValues: getProductMetricsWithSkuValuesMock(SkuPackageType.sku).skuValues};
      componentInstanceCopy.selectedBrandCode = myPerformanceProductMetricsMock.products.skuValues[0].brandCode;
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(storeMock.dispatch.calls.count()).toBe(0);
    });
  });

  describe('displayLeftTotalRow() and displayRightTotalRow() functions', () => {
    let rowMock: MyPerformanceTableRow;
    let currentMock: MyPerformanceEntitiesData;
    let expectedSaveMyPerformanceStatePayload: MyPerformanceEntitiesData;

    beforeEach(() => {
      storeMock.dispatch.and.callThrough();
      storeMock.dispatch.calls.reset();
      rowMock = getMyPerformanceTableRowMock(1)[0];
      currentMock = getMyPerformanceEntitiesDataMock();
      expectedSaveMyPerformanceStatePayload = Object.assign({}, stateMock.myPerformance.current, {
        filter: stateMock.myPerformanceFilter
      });
    });

    it('displayLeftTotalRow() should be false when current salesHierarchyViewType is roleGroups and ' +
      'productMetricsViewType is brands, and element is clicked while ProductMetricsViewType is brands', () => {
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.roleGroups;
      expect(componentInstance.displayLeftTotalRow()).toEqual(false);
    });

    it('displayLeftTotalRow() should be true when current salesHierarchyViewType is not roleGroups', () => {
      currentMock.responsibilities.entityWithPerformance[0].entityType = EntityType.Account;
      currentSubject.next(currentMock);
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.accounts;
      expect(componentInstance.displayLeftTotalRow()).toEqual(true);
  });

    it('displayRightTotalRow() should be true when current salesHierarchyViewType is roleGroups and ' +
      'productMetricsViewType is brands, and element is clicked while ProductMetricsViewType is brands', () => {
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.roleGroups;
      componentInstance.productMetricsViewType = ProductMetricsViewType.brands;
      expect(componentInstance.displayRightTotalRow()).toEqual(true);
    });

    it('displayRightTotalRow() should be false when current salesHierarchyViewType is roleGroups and ' +
      'when productMetricsViewType is skus, and element is clicked while ProductMetricsViewType is skus', () => {
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.roleGroups;
      componentInstance.productMetricsViewType = ProductMetricsViewType.skus;
      expect(componentInstance.displayRightTotalRow()).toEqual(false);
    });
  });

  describe('when fetching responsibilities returns an error', () => {
    let currentMock: MyPerformanceEntitiesData;

    beforeEach(() => {
      currentMock = getMyPerformanceEntitiesDataMock();
      currentMock.responsibilities = getResponsibilitesStateMock();
    });

    it('should set fetchResponsibilitiesFailure to false when responsibilities fetched with data', () => {
      currentMock.responsibilities.status = ActionStatus.Fetched;
      currentSubject.next(currentMock);
      expect(componentInstance.fetchResponsibilitiesFailure).toBe(false);
    });

    it('should set fetchResponsibilitiesFailure to true when responsibilities status is error', () => {
      currentMock.responsibilities.status = ActionStatus.Error;
      currentSubject.next(currentMock);
      expect(componentInstance.fetchResponsibilitiesFailure).toBe(true);
    });
  });

  describe('when fetching responsibilities', () => {
    let currentMock: MyPerformanceEntitiesData;

    beforeEach(() => {
      currentMock = getMyPerformanceEntitiesDataMock();
      currentMock.responsibilities = getResponsibilitesStateMock();
    });

    it('should set responsibilitiesFetching to true when responsibilities are currently fetching', () => {
      currentMock.responsibilities.status = ActionStatus.Fetching;
      currentSubject.next(currentMock);
      expect(componentInstance.responsibilitiesFetching).toBe(true);
    });

    it('should set responsibilitiesFetching to false when responsibilities are fetched or not fetching', () => {
      currentMock.responsibilities.status = ActionStatus.Fetched;
      currentSubject.next(currentMock);
      expect(componentInstance.responsibilitiesFetching).toBe(false);
    });
  });

  describe('when fetching productMetrics returns and error', () => {

    it('should set fetchProductMetricsFailure to false when productmetrics status is fetched', () => {
      myPerformanceProductMetricsMock = {
        status: ActionStatus.Fetched,
        products: {brandValues: []},
        productMetricsViewType: ProductMetricsViewType.brands
      };
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(componentInstance.fetchProductMetricsFailure).toBe(false);
    });

    it('should set fetchProductMetricsFailure to true when productmetrics status is error', () => {
      myPerformanceProductMetricsMock = {
        status: ActionStatus.Error,
        products: {brandValues: []},
        productMetricsViewType: ProductMetricsViewType.brands
      };
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(componentInstance.fetchProductMetricsFailure).toBe(true);
    });
  });

  describe('when fetching productMetrics', () => {

    it('should set productMetricsFetching to true when productmetrics status is fetching', () => {
      myPerformanceProductMetricsMock = {status: ActionStatus.Fetching,
        products: {brandValues: []},
        productMetricsViewType: ProductMetricsViewType.skus};
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(componentInstance.productMetricsFetching).toBe(true);
    });

    it('should set productMetricsFetching to false when productmetrics status is notfetched', () => {
      myPerformanceProductMetricsMock = {status: ActionStatus.NotFetched,
        products: {brandValues: []},
        productMetricsViewType: ProductMetricsViewType.brands};
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(componentInstance.productMetricsFetching).toBe(false);
    });
  });

  describe('onDestroy', () => {
    it('should dispatch ClearMyPerformanceState as its final call dispatch', () => {
      componentInstance.ngOnDestroy();
      expect(storeMock.dispatch.calls.mostRecent().args[0].type).toBe(MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_STATE);
    });
  });

  describe('when the filter state is changed', () => {
    let currentMock: MyPerformanceEntitiesData;
    let productMetricsStateMock: ProductMetricsState;

    beforeEach(() => {
      currentMock = getMyPerformanceEntitiesDataMock();
      productMetricsStateMock = {
        status: ActionStatus.Fetched,
        products: {brandValues: []},
        productMetricsViewType: ProductMetricsViewType.brands
      };

      currentMock.filter = getMyPerformanceFilterMock();
      currentMock.responsibilities.status = ActionStatus.Fetched;
      currentSubject.next(currentMock);
      productMetricsStateMock.status = ActionStatus.Fetched;
      productMetricsSubject.next(productMetricsStateMock);
      storeMock.dispatch.and.callThrough();
      storeMock.dispatch.calls.reset();
    });

    it('should dispatch RefreshAllPerformances and FetchProductMetrics actions when in alternate hierarchy ' +
      'and salesHierarchyViewType.viewType is subAccounts with no selected subaccount', () => {
      currentMock.responsibilities.alternateHierarchyId = chance.string();
      currentMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.subAccounts;
      currentMock.selectedSubaccountCode = null;
      currentSubject.next(currentMock);
      filterSubject.next(stateMock.myPerformanceFilter);

      expect(storeMock.dispatch.calls.count()).toBe(10);
      expect(storeMock.dispatch.calls.argsFor(8)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: currentMock.responsibilities.positionId,
        groupedEntities: currentMock.responsibilities.groupedEntities,
        hierarchyGroups: currentMock.responsibilities.hierarchyGroups,
        selectedEntityType: currentMock.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: undefined,
        skuPackageType: undefined,
        entityType: currentMock.selectedEntityType,
        alternateHierarchyId: currentMock.responsibilities.alternateHierarchyId,
        accountPositionId: currentMock.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(9)[0]).toEqual(new FetchProductMetrics({
        positionId: currentMock.selectedDistributorCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: currentMock.selectedEntityType,
        selectedBrandCode: currentMock.selectedBrandCode,
        inAlternateHierarchy: !!currentMock.responsibilities.alternateHierarchyId,
        entityTypeCode: currentMock.responsibilities.entityTypeCode,
        contextPositionId: currentMock.responsibilities.alternateHierarchyId
      }));
    });

    it('should dispatch RefreshAllPerformances and FetchProductMetrics actions when in alternate hierarchy ' +
      'and salesHierarchyViewType.viewType is distributors with no selected distributor', () => {
      currentMock.responsibilities.alternateHierarchyId = chance.string();
      currentMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.distributors;
      currentMock.selectedDistributorCode = null;
      currentSubject.next(currentMock);
      filterSubject.next(stateMock.myPerformanceFilter);

      expect(storeMock.dispatch.calls.count()).toBe(10);
      expect(storeMock.dispatch.calls.argsFor(8)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: currentMock.responsibilities.positionId,
        groupedEntities: currentMock.responsibilities.groupedEntities,
        hierarchyGroups: currentMock.responsibilities.hierarchyGroups,
        selectedEntityType: currentMock.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: undefined,
        skuPackageType: undefined,
        entityType: currentMock.selectedEntityType,
        alternateHierarchyId: currentMock.responsibilities.alternateHierarchyId,
        accountPositionId: currentMock.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(9)[0]).toEqual(new FetchProductMetrics({
        positionId: currentMock.selectedSubaccountCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: currentMock.selectedEntityType,
        selectedBrandCode: currentMock.selectedBrandCode,
        inAlternateHierarchy: !!currentMock.responsibilities.alternateHierarchyId,
        entityTypeCode: currentMock.responsibilities.entityTypeCode,
        contextPositionId: currentMock.responsibilities.alternateHierarchyId
      }));
    });

    it('should dispatch RefreshAllPerformances and FetchProductMetrics actions when in alternate hierarchy' +
      'and salesHierarchyViewType.viewType is not subAccounts or distributors', () => {
      currentMock.responsibilities.alternateHierarchyId = chance.string();
      currentMock.responsibilities.accountPositionId = null;
      currentMock.selectedSubaccountCode = null;
      productMetricsSubject.next(productMetricsStateMock);
      currentSubject.next(currentMock);
      filterSubject.next(stateMock.myPerformanceFilter);

      expect(storeMock.dispatch.calls.count()).toBe(10);
      expect(storeMock.dispatch.calls.argsFor(8)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: currentMock.responsibilities.positionId,
        groupedEntities: currentMock.responsibilities.groupedEntities,
        hierarchyGroups: currentMock.responsibilities.hierarchyGroups,
        selectedEntityType: currentMock.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: undefined,
        skuPackageType: undefined,
        entityType: currentMock.selectedEntityType,
        alternateHierarchyId: currentMock.responsibilities.alternateHierarchyId,
        accountPositionId: currentMock.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(9)[0]).toEqual(new FetchProductMetrics({
        positionId: currentMock.selectedDistributorCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: currentMock.selectedEntityType,
        selectedBrandCode: currentMock.selectedBrandCode,
        inAlternateHierarchy: !!currentMock.responsibilities.alternateHierarchyId,
        entityTypeCode: currentMock.responsibilities.entityTypeCode,
        contextPositionId: currentMock.responsibilities.alternateHierarchyId
      }));
    });

    it('should dispatch RefreshAllPerformances and FetchProductMetrics actions when NOT in alternate hierarchy' +
      'and salesHierarchyViewType.viewType is NOT subAccounts', () => {
      currentMock.responsibilities.alternateHierarchyId = null;
      currentMock.responsibilities.accountPositionId = null;
      currentMock.selectedSubaccountCode = null;
      productMetricsSubject.next(productMetricsStateMock);
      currentSubject.next(currentMock);
      filterSubject.next(stateMock.myPerformanceFilter);

      expect(storeMock.dispatch.calls.count()).toBe(10);
      expect(storeMock.dispatch.calls.argsFor(8)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: currentMock.responsibilities.positionId,
        groupedEntities: currentMock.responsibilities.groupedEntities,
        hierarchyGroups: currentMock.responsibilities.hierarchyGroups,
        selectedEntityType: currentMock.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: undefined,
        skuPackageType: undefined,
        entityType: currentMock.selectedEntityType,
        alternateHierarchyId: null,
        accountPositionId: currentMock.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(9)[0]).toEqual(new FetchProductMetrics({
        positionId: currentMock.selectedDistributorCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: currentMock.selectedEntityType,
        selectedBrandCode: currentMock.selectedBrandCode,
        inAlternateHierarchy: false,
        entityTypeCode: currentMock.responsibilities.entityTypeCode,
        contextPositionId: currentMock.responsibilities.positionId
      }));
    });

    it('should dispatch RefreshAllPerformances and FetchProductMetrics actions when NOT in alternate hierarchy' +
      ' and salesHierarchyViewType.viewType is subAccounts with no selectedsubaccount', () => {
      currentMock.responsibilities.alternateHierarchyId = null;
      currentMock.selectedSubaccountCode = null;
      productMetricsSubject.next(productMetricsStateMock);
      currentSubject.next(currentMock);
      filterSubject.next(stateMock.myPerformanceFilter);

      expect(storeMock.dispatch.calls.count()).toBe(10);
      expect(storeMock.dispatch.calls.argsFor(8)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: currentMock.responsibilities.positionId,
        groupedEntities: currentMock.responsibilities.groupedEntities,
        hierarchyGroups: currentMock.responsibilities.hierarchyGroups,
        selectedEntityType: currentMock.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: undefined,
        skuPackageType: undefined,
        entityType: currentMock.selectedEntityType,
        alternateHierarchyId: null,
        accountPositionId: currentMock.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(9)[0]).toEqual(new FetchProductMetrics({
        positionId: currentMock.selectedDistributorCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: currentMock.selectedEntityType,
        selectedBrandCode: currentMock.selectedBrandCode,
        inAlternateHierarchy: false,
        entityTypeCode: currentMock.responsibilities.entityTypeCode,
        contextPositionId: currentMock.responsibilities.positionId
      }));
    });

    it('should dispatch RefreshAllPerformances and FetchProductMetrics actions when NOT in alternate hierarchy' +
      ' and salesHierarchyViewType.viewType is distributors with no selectedDistributor', () => {
      currentMock.responsibilities.alternateHierarchyId = null;
      currentMock.selectedDistributorCode = null;
      productMetricsSubject.next(productMetricsStateMock);
      currentSubject.next(currentMock);
      filterSubject.next(stateMock.myPerformanceFilter);

      expect(storeMock.dispatch.calls.count()).toBe(10);
      expect(storeMock.dispatch.calls.argsFor(8)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: currentMock.responsibilities.positionId,
        groupedEntities: currentMock.responsibilities.groupedEntities,
        hierarchyGroups: currentMock.responsibilities.hierarchyGroups,
        selectedEntityType: currentMock.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandSkuCode: undefined,
        skuPackageType: undefined,
        entityType: currentMock.selectedEntityType,
        alternateHierarchyId: null,
        accountPositionId: currentMock.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(9)[0]).toEqual(new FetchProductMetrics({
        positionId: currentMock.selectedSubaccountCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: currentMock.selectedEntityType,
        selectedBrandCode: currentMock.selectedBrandCode,
        inAlternateHierarchy: false,
        entityTypeCode: currentMock.responsibilities.entityTypeCode,
        contextPositionId: currentMock.responsibilities.positionId
      }));
    });

    it('should dispatch RefreshAllPerformances and FetchProductMetrics when viewType is subAccounts with no selectedsubaccount', () => {
      currentMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.subAccounts;
      currentMock.selectedSubaccountCode = null;
      productMetricsSubject.next(productMetricsStateMock);
      currentSubject.next(currentMock);
      filterSubject.next(stateMock.myPerformanceFilter);

      expect(storeMock.dispatch.calls.count()).toBe(10);
      expect(storeMock.dispatch.calls.argsFor(8)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: currentMock.responsibilities.positionId,
        groupedEntities: currentMock.responsibilities.groupedEntities,
        hierarchyGroups: currentMock.responsibilities.hierarchyGroups,
        selectedEntityType: currentMock.selectedEntityType,
        salesHierarchyViewType: currentMock.salesHierarchyViewType.viewType,
        filter: stateMock.myPerformanceFilter,
        brandSkuCode: undefined,
        skuPackageType: undefined,
        entityType: currentMock.selectedEntityType,
        alternateHierarchyId: currentMock.responsibilities.alternateHierarchyId,
        accountPositionId: currentMock.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(9)[0]).toEqual(new FetchProductMetrics({
        positionId: currentMock.selectedDistributorCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: currentMock.selectedEntityType,
        selectedBrandCode: currentMock.selectedBrandCode,
        inAlternateHierarchy: false,
        entityTypeCode: currentMock.responsibilities.entityTypeCode,
        contextPositionId: currentMock.responsibilities.positionId
      }));
    });

    it('should dispatch RefreshAllPerformances and FetchProductMetrics when viewType is subAccounts with a selectedsubaccount', () => {
      currentMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.subAccounts;
      productMetricsSubject.next(productMetricsStateMock);
      currentSubject.next(currentMock);
      filterSubject.next(stateMock.myPerformanceFilter);

      expect(storeMock.dispatch.calls.count()).toBe(10);
      expect(storeMock.dispatch.calls.argsFor(8)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: currentMock.responsibilities.positionId,
        groupedEntities: currentMock.responsibilities.groupedEntities,
        hierarchyGroups: currentMock.responsibilities.hierarchyGroups,
        selectedEntityType: currentMock.selectedEntityType,
        salesHierarchyViewType: currentMock.salesHierarchyViewType.viewType,
        filter: stateMock.myPerformanceFilter,
        brandSkuCode: undefined,
        skuPackageType: undefined,
        entityType: currentMock.selectedEntityType,
        alternateHierarchyId: currentMock.responsibilities.alternateHierarchyId,
        accountPositionId: currentMock.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(9)[0]).toEqual(new FetchProductMetrics({
        positionId: currentMock.selectedSubaccountCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: currentMock.selectedEntityType,
        selectedBrandCode: currentMock.selectedBrandCode,
        inAlternateHierarchy: false,
        entityTypeCode: currentMock.responsibilities.entityTypeCode,
        contextPositionId: currentMock.responsibilities.positionId
      }));
    });

    it('should dispatch RefreshAllPerformances and FetchProductMetrics when viewType is distributors with no selectedDistributor', () => {
      currentMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.distributors;
      currentMock.selectedDistributorCode = null;
      productMetricsSubject.next(productMetricsStateMock);
      currentSubject.next(currentMock);
      filterSubject.next(stateMock.myPerformanceFilter);

      expect(storeMock.dispatch.calls.count()).toBe(10);
      expect(storeMock.dispatch.calls.argsFor(8)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: currentMock.responsibilities.positionId,
        groupedEntities: currentMock.responsibilities.groupedEntities,
        hierarchyGroups: currentMock.responsibilities.hierarchyGroups,
        selectedEntityType: currentMock.selectedEntityType,
        salesHierarchyViewType: currentMock.salesHierarchyViewType.viewType,
        filter: stateMock.myPerformanceFilter,
        brandSkuCode: undefined,
        skuPackageType: undefined,
        entityType: currentMock.selectedEntityType,
        alternateHierarchyId: currentMock.responsibilities.alternateHierarchyId,
        accountPositionId: currentMock.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
      expect(storeMock.dispatch.calls.argsFor(9)[0]).toEqual(new FetchProductMetrics({
        positionId: currentMock.selectedSubaccountCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: currentMock.selectedEntityType,
        selectedBrandCode: currentMock.selectedBrandCode,
        inAlternateHierarchy: false,
        entityTypeCode: currentMock.responsibilities.entityTypeCode,
        contextPositionId: currentMock.responsibilities.positionId
      }));
    });

    it('should set isOpportunityTableExtended to false to close the opportunities table', () => {
      componentInstanceCopy.isOpportunityTableExtended = false;
      filterSubject.next(stateMock.myPerformanceFilter);

      expect(componentInstanceCopy.isOpportunityTableExtended).toBe(false);

      componentInstanceCopy.isOpportunityTableExtended = true;
      filterSubject.next(stateMock.myPerformanceFilter);

      expect(componentInstanceCopy.isOpportunityTableExtended).toBe(false);
    });

    it('should reach out to the myPerformanceService to get the display label for the current premise type', () => {
      myPerformanceServiceMock.getPremiseTypeStateLabel.calls.reset();
      expect(myPerformanceServiceMock.getPremiseTypeStateLabel).not.toHaveBeenCalled();

      filterSubject.next(stateMock.myPerformanceFilter);
      expect(myPerformanceServiceMock.getPremiseTypeStateLabel).toHaveBeenCalledWith(stateMock.myPerformanceFilter.premiseType);
    });

  });

  describe('when the filter is updated', () => {
    let previousFilterMock: MyPerformanceFilter;
    let currentFilterMock: MyPerformanceFilter;

    beforeEach(() => {
      previousFilterMock = getMyPerformanceFilterMock();
      currentFilterMock = getMyPerformanceFilterMock();
      componentInstance.selectedSkuPackageType = SkuPackageType.package;
    });

    describe('when going from All premise type to On with a selected SKU', () => {
      it('should deselect the SKU and trigger the correct actions', () => {
        previousFilterMock.premiseType = PremiseTypeValue.All;
        filterSubject.next(previousFilterMock);
        componentInstance.selectedSkuPackageType = SkuPackageType.sku;
        storeMock.dispatch.and.callThrough();
        storeMock.dispatch.calls.reset();
        currentFilterMock.premiseType = PremiseTypeValue.On;
        filterSubject.next(currentFilterMock);
        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
      });
    });

    describe('when going from On premise type to Off with a selected Package', () => {
      it('should deselect the Pacakge and trigger the correct actions', () => {
        previousFilterMock.premiseType = PremiseTypeValue.On;
        filterSubject.next(previousFilterMock);
        componentInstance.selectedSkuPackageType = SkuPackageType.package;
        storeMock.dispatch.and.callThrough();
        storeMock.dispatch.calls.reset();
        currentFilterMock.premiseType = PremiseTypeValue.Off;
        filterSubject.next(currentFilterMock);
        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
      });
    });

    describe('when going from On premise type to On with a selected Package', () => {
      it('should not deselect the Pacakge or trigger any actions', () => {
        componentInstance.selectedSkuPackageType = SkuPackageType.package;
        previousFilterMock.premiseType = PremiseTypeValue.On;
        filterSubject.next(previousFilterMock);
        storeMock.dispatch.and.callThrough();
        storeMock.dispatch.calls.reset();
        currentFilterMock.premiseType = PremiseTypeValue.On;
        filterSubject.next(currentFilterMock);
        expect(storeMock.dispatch.calls.count()).toBe(0);
      });
    });

    describe('when going from On premise type to Off with no selected Package', () => {
      it('should not deselect the Pacakge or trigger any actions', () => {
        componentInstance.selectedSkuPackageType = null;
        previousFilterMock.premiseType = PremiseTypeValue.On;
        filterSubject.next(previousFilterMock);
        storeMock.dispatch.and.callThrough();
        storeMock.dispatch.calls.reset();
        currentFilterMock.premiseType = PremiseTypeValue.Off;
        filterSubject.next(currentFilterMock);
        expect(storeMock.dispatch.calls.count()).toBe(0);
      });
    });
  });

  describe('my performance dynamic name table header', () => {
    let tableComponentsMock: any;

    beforeEach(() => {
      tableComponentsMock = fixture.debugElement.queryAll(By.directive(MyPerformanceTableComponentMock));
    });

    describe('sales hierarchy table header', () => {
      let currentMock: MyPerformanceEntitiesData;
      let salesHierarchyTableMock: any;

      beforeEach(() => {
        currentMock = getMyPerformanceEntitiesDataMock();
        salesHierarchyTableMock = tableComponentsMock[0].injector.get(MyPerformanceTableComponentMock) as MyPerformanceTableComponentMock;
      });

      it('should be `Group` when the sales hierarchy view type is roleGroups', () => {
        myPerformanceServiceMock.getSalesHierarchyViewTypeLabel.and.returnValue(SalesHierarchyHeaderEntityType.Group);

        currentMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.roleGroups;
        currentSubject.next(currentMock);

        expect(myPerformanceServiceMock.getSalesHierarchyViewTypeLabel).toHaveBeenCalledWith(currentMock.salesHierarchyViewType.viewType);
        expect(salesHierarchyTableMock.tableHeaderRow[0]).toBe(SalesHierarchyHeaderEntityType.Group);
      });

      it('should be `Person` when the sales hierarchy view type is people', () => {
        myPerformanceServiceMock.getSalesHierarchyViewTypeLabel.and.returnValue(SalesHierarchyHeaderEntityType.Person);

        currentMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.people;
        currentSubject.next(currentMock);

        expect(myPerformanceServiceMock.getSalesHierarchyViewTypeLabel).toHaveBeenCalledWith(currentMock.salesHierarchyViewType.viewType);
        expect(salesHierarchyTableMock.tableHeaderRow[0]).toBe(SalesHierarchyHeaderEntityType.Person);
      });

      it('should be `Distributor` when the sales hierarchy view type is distributors', () => {
        myPerformanceServiceMock.getSalesHierarchyViewTypeLabel.and.returnValue(SalesHierarchyHeaderEntityType.Distributor);

        currentMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.distributors;
        currentSubject.next(currentMock);

        expect(myPerformanceServiceMock.getSalesHierarchyViewTypeLabel).toHaveBeenCalledWith(currentMock.salesHierarchyViewType.viewType);
        expect(salesHierarchyTableMock.tableHeaderRow[0]).toBe(SalesHierarchyHeaderEntityType.Distributor);
      });

      it('should be `Account` when the sales hierarchy view type is accounts', () => {
        myPerformanceServiceMock.getSalesHierarchyViewTypeLabel.and.returnValue(SalesHierarchyHeaderEntityType.Account);

        currentMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.accounts;
        currentSubject.next(currentMock);

        expect(myPerformanceServiceMock.getSalesHierarchyViewTypeLabel).toHaveBeenCalledWith(currentMock.salesHierarchyViewType.viewType);
        expect(salesHierarchyTableMock.tableHeaderRow[0]).toBe(SalesHierarchyHeaderEntityType.Account);
      });

      it('should be `Sub-Account` when the sales hierarchy view type is subAccounts', () => {
        myPerformanceServiceMock.getSalesHierarchyViewTypeLabel.and.returnValue(SalesHierarchyHeaderEntityType.SubAccount);

        currentMock.salesHierarchyViewType.viewType = SalesHierarchyViewType.subAccounts;
        currentSubject.next(currentMock);

        expect(myPerformanceServiceMock.getSalesHierarchyViewTypeLabel).toHaveBeenCalledWith(currentMock.salesHierarchyViewType.viewType);
        expect(salesHierarchyTableMock.tableHeaderRow[0]).toBe(SalesHierarchyHeaderEntityType.SubAccount);
      });
    });

    describe('product metrics table header', () => {
      let productMetricsStateMock: ProductMetricsState;
      let productMetricsTableMock: any;

      beforeEach(() => {
        productMetricsStateMock = {
          status: ActionStatus.Fetched,
          products: {
            brandValues: [],
            skuValues: []
          },
          productMetricsViewType: ProductMetricsViewType.brands,
          selectedBrandCodeValues: getProductMetricsBrandMock()
        };
        productMetricsTableMock = tableComponentsMock[1].injector.get(MyPerformanceTableComponentMock) as MyPerformanceTableComponentMock;
      });

      it('should be `Brand` when the product metrics view type is brands', () => {
        myPerformanceServiceMock.getProductMetricsViewTypeLabel.and.returnValue(ProductMetricHeaderProductType.Brand);

        productMetricsStateMock.productMetricsViewType = ProductMetricsViewType.brands;
        productMetricsSubject.next(productMetricsStateMock);

        expect(myPerformanceServiceMock.getProductMetricsViewTypeLabel)
          .toHaveBeenCalledWith(productMetricsStateMock.productMetricsViewType);
        expect(productMetricsTableMock.tableHeaderRow[0]).toBe(ProductMetricHeaderProductType.Brand);
      });

      it('should be `SKU` when the product metrics view type is skus', () => {
        myPerformanceServiceMock.getProductMetricsViewTypeLabel.and.returnValue(ProductMetricHeaderProductType.SKU);

        productMetricsStateMock.productMetricsViewType = ProductMetricsViewType.skus;
        productMetricsSubject.next(productMetricsStateMock);

        expect(myPerformanceServiceMock.getProductMetricsViewTypeLabel)
          .toHaveBeenCalledWith(productMetricsStateMock.productMetricsViewType);
        expect(productMetricsTableMock.tableHeaderRow[0]).toBe(ProductMetricHeaderProductType.SKU);
      });

      it('should be `Package` when the product metrics view type is packages', () => {
        myPerformanceServiceMock.getProductMetricsViewTypeLabel.and.returnValue(ProductMetricHeaderProductType.Package);

        productMetricsStateMock.productMetricsViewType = ProductMetricsViewType.packages;
        productMetricsSubject.next(productMetricsStateMock);

        expect(myPerformanceServiceMock.getProductMetricsViewTypeLabel)
          .toHaveBeenCalledWith(productMetricsStateMock.productMetricsViewType);
        expect(productMetricsTableMock.tableHeaderRow[0]).toBe(ProductMetricHeaderProductType.Package);
      });
    });
  });

  describe('when a refresh is required after a store update', () => {
    let currentMock: MyPerformanceEntitiesData;
    let productMetricsStateMock: ProductMetricsState;

    beforeEach(() => {
      currentMock = getMyPerformanceEntitiesDataMock();
      productMetricsStateMock = {
        status: ActionStatus.Fetched,
        products: {brandValues: []},
        productMetricsViewType: ProductMetricsViewType.skus
      };

      currentMock.filter = getMyPerformanceFilterMock();
      storeMock.dispatch.and.callThrough();
      storeMock.dispatch.calls.reset();
    });

    it('call deselectBrandValue when fetch of product metrics for brands returned successfully but with 0 results', () => {
      myPerformanceTableDataTransformerService.getRightTableData.and.returnValue([]);
      productMetricsSubject.next(productMetricsStateMock);

      componentInstanceCopy.selectedBrandCode = chance.string();
      componentInstanceCopy.selectedSkuPackageCode = null;
      componentInstanceCopy.selectedSkuPackageType = null;

      currentMock = getMyPerformanceEntitiesDataMock();
      currentMock.responsibilities.alternateHierarchyId = chance.string();
      currentSubject.next(currentMock);

      expect(componentInstanceCopy.selectedBrandCode).toBe(undefined);
      expect(componentInstanceCopy.selectedSkuPackageCode).toBe(null);
      expect(componentInstanceCopy.selectedSkuPackageType).toBe(null);
      expect(storeMock.dispatch.calls.count()).toBe(5);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new MyPerformanceVersionActions.ClearMyPerformanceSelectedBrandCode());
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ProductMetricsActions.DeselectBrandValues());
      expect(storeMock.dispatch.calls.argsFor(4)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: currentMock.responsibilities.positionId,
        groupedEntities: currentMock.responsibilities.groupedEntities,
        hierarchyGroups: currentMock.responsibilities.hierarchyGroups,
        selectedEntityType: currentMock.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter,
        entityType: currentMock.selectedEntityType,
        alternateHierarchyId: currentMock.responsibilities.alternateHierarchyId,
        accountPositionId: currentMock.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
    });

    it('deselect skuPackageCode and skuPackageType when fetch of product metrics for skus returned successfully but with 0 results', () => {
      const selectedBrandCodeMock = chance.string();
      const selectedSkuPackageCodeMock = chance.string();

      myPerformanceTableDataTransformerService.getRightTableData.and.returnValue([
          {
            metadata: {
              skuPackageCode: selectedSkuPackageCodeMock
            }
          }
      ]);
      productMetricsSubject.next(productMetricsStateMock);

      componentInstanceCopy.selectedBrandCode = selectedBrandCodeMock;
      componentInstanceCopy.selectedSkuPackageCode = chance.string();
      componentInstanceCopy.selectedSkuPackageType = chance.string();

      currentMock = getMyPerformanceEntitiesDataMock();
      currentMock.responsibilities.alternateHierarchyId = chance.string();
      currentSubject.next(currentMock);

      expect(componentInstanceCopy.selectedBrandCode).toBe(selectedBrandCodeMock);
      expect(componentInstanceCopy.selectedSkuPackageCode).toBe(null);
      expect(componentInstanceCopy.selectedSkuPackageType).toBe(null);
      expect(storeMock.dispatch.calls.count()).toBe(2);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: currentMock.responsibilities.positionId,
        groupedEntities: currentMock.responsibilities.groupedEntities,
        hierarchyGroups: currentMock.responsibilities.hierarchyGroups,
        selectedEntityType: currentMock.selectedEntityType,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter,
        brandSkuCode: selectedBrandCodeMock,
        skuPackageType: null,
        entityType: currentMock.selectedEntityType,
        alternateHierarchyId: currentMock.responsibilities.alternateHierarchyId,
        accountPositionId: currentMock.responsibilities.accountPositionId,
        isMemberOfExceptionHierarchy: false
      }));
    });
  });

  describe('toggleOpportunityTable', () => {
    it('should set the isOpportunityTableExtended to its inverse', () => {
      componentInstanceCopy.isOpportunityTableExtended = false;
      componentInstance.toggleOpportunityTable();

      expect(componentInstanceCopy.isOpportunityTableExtended).toBe(true);

      componentInstance.toggleOpportunityTable();

      expect(componentInstanceCopy.isOpportunityTableExtended).toBe(false);
    });
  });
});
