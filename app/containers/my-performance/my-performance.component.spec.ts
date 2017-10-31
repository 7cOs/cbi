import { By } from '@angular/platform-browser';
import * as Chance from 'chance';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { Title } from '@angular/platform-browser';

import { ActionStatus } from '../../enums/action-status.enum';
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
import { HandleElementClickedParameters, MyPerformanceComponent } from './my-performance.component';
import { HierarchyEntity } from '../../models/hierarchy-entity.model';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import * as MyPerformanceFilterActions from '../../state/actions/my-performance-filter.action';
import * as MyPerformanceVersionActions from '../../state/actions/my-performance-version.action';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent } from '../../models/my-performance-filter.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceEntitiesData, MyPerformanceState } from '../../state/reducers/my-performance.reducer';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { MyPerformanceService } from '../../services/my-performance.service';
import { MyPerformanceTableRowComponent } from '../../shared/components/my-performance-table-row/my-performance-table-row.component';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { ProductMetricsState } from '../../state/reducers/product-metrics.reducer';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
import { RowType } from '../../enums/row-type.enum';
import {
         SaveMyPerformanceState,
         SetMyPerformanceSelectedEntityType,
         SkuPackagePayload
       } from '../../state/actions/my-performance-version.action';
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
}

describe('MyPerformanceComponent', () => {
  let fixture: ComponentFixture<MyPerformanceComponent>;
  let componentInstance: MyPerformanceComponent;
  let userServiceMock: any;
  let myPerformanceServiceMock: any;
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
    current: {title: chance.string()}
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
      } else {
        return Observable.of(selectedValue);
      }
    }),
    dispatch: jasmine.createSpy('dispatch')
  };

  beforeEach(() => {
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

    myPerformanceServiceMock = {
      getUserDefaultPremiseType: jasmine.createSpy('getUserDefaultPremiseType'),
      getMetricValueName: jasmine.createSpy('getMetricValueName'),
      accountDashboardStateParameters: jasmine.createSpy('accountDashboardStateParameters').and.callThrough()
    };

    TestBed.configureTestingModule({
      declarations: [
        BeerLoaderComponentMock,
        MyPerformanceBreadcrumbComponentMock,
        MyPerformanceFilterComponentMock,
        MyPerformanceTableComponentMock,
        MyPerformanceComponent,
        MyPerformanceTableRowComponent,
        SortIndicatorComponent
      ],
      providers: [
        MyPerformanceTableDataTransformerService,
        {
          provide: MyPerformanceService,
          useValue: myPerformanceServiceMock
        },
        {
          provide: Store,
          useValue: storeMock
        },
        {
          provide: 'userService',
          useValue: userServiceMock
        },
        {
          provide: '$state',
          useValue: stateMock
        },
        {
          provide: WindowService,
          useValue: windowServiceMock
        },
        {
          provide: Title,
          useValue: titleMock
        }
      ]
    });
    fixture = TestBed.createComponent(MyPerformanceComponent);
    componentInstance = fixture.componentInstance;
    fixture.detectChanges();

    currentSubject.next(myPerformanceStateMock.current);
    productMetricsSubject.next(myPerformanceProductMetricsMock);
    versionsSubject.next(initialVersionsMock);
  });

  describe('MyPerformanceComponent various events', () => {
    let userService: any;
    let expectedCurrentUserFullName: string;

    beforeEach(inject([ 'userService' ], (_userService: any) => {
      userService = _userService;
      expectedCurrentUserFullName = userService.model.currentUser.firstName + ' ' + userService.model.currentUser.lastName;

      storeMock.dispatch.and.callThrough();
      storeMock.dispatch.calls.reset();
    }));

    it('should dispatch actions on init', () => {
      myPerformanceServiceMock.getUserDefaultPremiseType.and.returnValue(PremiseTypeValue.On);
      fixture = TestBed.createComponent(MyPerformanceComponent);
      fixture.detectChanges();

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
        selectedEntityDescription: expectedCurrentUserFullName
      }));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new FetchProductMetrics({
        positionId: userServiceMock.model.currentUser.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: EntityType.Person,
        selectedBrandCode: undefined
      }));
    });

    it('should dispatch actions on init and handle empty positionId', () => {
      userService.model.currentUser.positionId = '';
      fixture = TestBed.createComponent(MyPerformanceComponent);
      fixture.detectChanges();

      expect(storeMock.dispatch.calls.count()).toBe(3);
      expect(storeMock.dispatch.calls.argsFor(1)).toEqual([new ResponsibilitiesActions.FetchResponsibilities({
        positionId: '0',
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityDescription: expectedCurrentUserFullName
      })]);
    });

    it('should dispatch actions on init and handle undefined positionId', () => {
      delete userService.model.currentUser.positionId;
      fixture = TestBed.createComponent(MyPerformanceComponent);
      fixture.detectChanges();

      expect(storeMock.dispatch.calls.count()).toBe(3);
      expect(storeMock.dispatch.calls.argsFor(1)).toEqual([new ResponsibilitiesActions.FetchResponsibilities({
        positionId: '0',
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityDescription: expectedCurrentUserFullName
      })]);
    });

    it('should call setTitle on init', () => {
      fixture = TestBed.createComponent(MyPerformanceComponent);
      fixture.detectChanges();
      expect(titleMock.setTitle).toHaveBeenCalledWith(stateMock.current.title);
    });

    it('should trigger appropriate actions when the filter component emits an event', () => {
      userService.model.currentUser.srcTypeCd = Array(chance.natural({max: 2})).fill('').map(() => chance.string());
      myPerformanceServiceMock.getUserDefaultPremiseType.and.returnValue(PremiseTypeValue.On);

      const mockMyPerformanceFilter = fixture.debugElement.query(By.directive(MyPerformanceFilterComponentMock));
      const mockFilterElement = mockMyPerformanceFilter
        .injector
        .get(MyPerformanceFilterComponentMock) as MyPerformanceFilterComponentMock;

      mockFilterElement.onFilterChange.emit({
        filterType: MyPerformanceFilterActionType.Metric,
        filterValue: MetricTypeValue.volume
      });
      mockFilterElement.onFilterChange.emit({
        filterType: MyPerformanceFilterActionType.TimePeriod,
        filterValue: DateRangeTimePeriodValue.L90BDL
      });
      mockFilterElement.onFilterChange.emit({
        filterType: MyPerformanceFilterActionType.PremiseType,
        filterValue: PremiseTypeValue.Off
      });
      mockFilterElement.onFilterChange.emit({
        filterType: MyPerformanceFilterActionType.DistributionType,
        filterValue: DistributionTypeValue.simple
      });

      expect(storeMock.dispatch.calls.count()).toBe(5);

      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
        new MyPerformanceFilterActions.SetMetric(MetricTypeValue.volume)
      );
      expect(myPerformanceServiceMock.getUserDefaultPremiseType).toHaveBeenCalledWith(
        stateMock.myPerformanceFilter.metricType,
        userService.model.currentUser.srcTypeCd[0]
      );
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(
        new MyPerformanceFilterActions.SetPremiseType(PremiseTypeValue.On)
      );
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(
        new MyPerformanceFilterActions.SetTimePeriod(DateRangeTimePeriodValue.L90BDL)
      );
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(
        new MyPerformanceFilterActions.SetPremiseType(PremiseTypeValue.Off)
      );
      expect(storeMock.dispatch.calls.argsFor(4)[0]).toEqual(
        new MyPerformanceFilterActions.SetDistributionType(DistributionTypeValue.simple)
      );
    });

    it('should call select with the right arguments', () => {
      storeMock.dispatch.calls.reset();
      storeMock.select.calls.reset();
      fixture = TestBed.createComponent(MyPerformanceComponent);
      fixture.detectChanges();

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

  describe('when left side total row is clicked', () => {
    let versionsMock: MyPerformanceEntitiesData[];

    beforeEach(() => {
      storeMock.dispatch.and.callThrough();
      storeMock.dispatch.calls.reset();

      versionsMock = generateMockVersions(4, 9);
    });

    describe('when back button is NOT displayed', () => {
      it('should NOT dispatch any actions', () => {
        componentInstance.showLeftBackButton = false;
        const params: HandleElementClickedParameters = { leftSide: true, type: RowType.total, index: 0 };
        componentInstance.handleElementClicked(params);

        expect(storeMock.dispatch.calls.count()).toBe(0);
      });
    });

    describe('when back button is displayed', () => {
      beforeEach(() => {
        componentInstance.showLeftBackButton = true;
      });

      it('should dispatch RestoreMyPerformanceState when last version has a salesHierarchyViewType of distributors', () => {
        versionsMock[versionsMock.length - 1].salesHierarchyViewType.viewType = SalesHierarchyViewType.distributors;
        versionsMock[versionsMock.length - 1].filter = stateMock.myPerformanceFilter;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState());
      });

      it('should dispatch RestoreMyPerformanceState and FetchProductMetrics ' +
        'when last version has a salesHierarchyViewType of people', () => {
        versionsMock[versionsMock.length - 1].salesHierarchyViewType.viewType = SalesHierarchyViewType.people;
        versionsMock[versionsMock.length - 1].filter = stateMock.myPerformanceFilter;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        const expectedSelectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState());
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetrics({
          positionId: versionsMock[versionsMock.length - 1].responsibilities.positionId,
          entityTypeCode: versionsMock[versionsMock.length - 1].responsibilities.entityTypeCode,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: EntityType.RoleGroup,
          selectedBrandCode: expectedSelectedBrandCode
        }));
      });

      it('should dispatch RestoreMyPerformanceState when last version has a salesHierarchyViewType of subAccounts', () => {
        versionsMock[versionsMock.length - 1].salesHierarchyViewType.viewType = SalesHierarchyViewType.subAccounts;
        versionsMock[versionsMock.length - 1].filter = stateMock.myPerformanceFilter;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState());
      });

      it('should dispatch RestoreMyPerformanceState and FetchProductMetrics ' +
        'when last version has a salesHierarchyViewType of roleGroups', () => {
        versionsMock[versionsMock.length - 1].salesHierarchyViewType.viewType = SalesHierarchyViewType.roleGroups;
        versionsMock[versionsMock.length - 1].filter = stateMock.myPerformanceFilter;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        const expectedSelectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState());
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetrics({
          positionId: versionsMock[versionsMock.length - 1].responsibilities.positionId,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: EntityType.Person,
          selectedBrandCode: expectedSelectedBrandCode
        }));
      });

      it('should dispatch RestoreMyPerformanceState and FetchProductMetrics ' +
        'when last version has a salesHierarchyViewType of accounts', () => {
        versionsMock[versionsMock.length - 1].salesHierarchyViewType.viewType = SalesHierarchyViewType.accounts;
        versionsMock[versionsMock.length - 1].filter = stateMock.myPerformanceFilter;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        const expectedSelectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState());
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetrics({
          positionId: versionsMock[versionsMock.length - 1].responsibilities.positionId,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: EntityType.Person,
          selectedBrandCode: expectedSelectedBrandCode
        }));
      });

      it('should dispatch the RefreshAllPerformances action when the filter state and previous state`s filter mismatch', () => {
        const previousVersionMock = versionsMock[versionsMock.length - 1];

        versionsMock[versionsMock.length - 1].salesHierarchyViewType.viewType = SalesHierarchyViewType.accounts;
        versionsMock[versionsMock.length - 1].filter = getMyPerformanceFilterMock();
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(3);
        expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
          positionId: previousVersionMock.responsibilities.positionId,
          groupedEntities: previousVersionMock.responsibilities.groupedEntities,
          hierarchyGroups: previousVersionMock.responsibilities.hierarchyGroups,
          selectedEntityType: previousVersionMock.selectedEntityType,
          selectedEntityTypeCode: previousVersionMock.responsibilities.entityTypeCode,
          salesHierarchyViewType: previousVersionMock.salesHierarchyViewType.viewType,
          filter: stateMock.myPerformanceFilter,
          brandCode: previousVersionMock.selectedBrandCode,
          entityType: previousVersionMock.selectedEntityType,
          alternateHierarchyId: previousVersionMock.responsibilities.alternateHierarchyId,
          accountPositionId: previousVersionMock.responsibilities.accountPositionId
        }));
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
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SaveMyPerformanceState(expectedSaveMyPerformanceStatePayload));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SetMyPerformanceSelectedEntityType(rowMock.metadata.entityType));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchEntityWithPerformance({
        positionId: rowMock.metadata.positionId,
        alternateHierarchyId: undefined,
        entityTypeGroupName: EntityPeopleType[rowMock.descriptionRow0],
        entityTypeCode: rowMock.metadata.entityTypeCode,
        entityType: rowMock.metadata.entityType,
        selectedEntityDescription: rowMock.descriptionRow0,
        entities: stateMock.myPerformance.current.responsibilities.groupedEntities[EntityPeopleType[rowMock.descriptionRow0]],
        filter: stateMock.myPerformanceFilter as any,
        brandCode: stateMock.myPerformance.current.selectedBrandCode
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new FetchProductMetrics({
        positionId: rowMock.metadata.positionId,
        entityTypeCode: rowMock.metadata.entityTypeCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: EntityType.RoleGroup,
        selectedBrandCode: stateMock.myPerformance.current.selectedBrandCode
      }));
    });

    it('should trigger appropriate actions when current salesHierarchyViewType is roleGroups and the row metadata ' +
    'contains a alternateHierarchyId', () => {
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };

      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.roleGroups;
      rowMock.metadata.entityType = EntityType.RoleGroup;
      rowMock.metadata.alternateHierarchyId = chance.string();
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SaveMyPerformanceState(expectedSaveMyPerformanceStatePayload));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SetMyPerformanceSelectedEntityType(rowMock.metadata.entityType));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(
        new ResponsibilitiesActions.SetAlternateHierarchyId(rowMock.metadata.alternateHierarchyId));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ResponsibilitiesActions.FetchEntityWithPerformance({
        positionId: rowMock.metadata.positionId,
        alternateHierarchyId: undefined,
        entityTypeGroupName: EntityPeopleType[rowMock.descriptionRow0],
        entityTypeCode: rowMock.metadata.entityTypeCode,
        entityType: rowMock.metadata.entityType,
        selectedEntityDescription: rowMock.descriptionRow0,
        entities: stateMock.myPerformance.current.responsibilities.groupedEntities[EntityPeopleType[rowMock.descriptionRow0]],
        filter: stateMock.myPerformanceFilter as any,
        brandCode: stateMock.myPerformance.current.selectedBrandCode
      }));
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
        brandCode: stateMock.myPerformance.current.selectedBrandCode
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new FetchProductMetrics({
        positionId: rowMock.metadata.positionId,
        contextPositionId: stateMock.myPerformance.current.responsibilities.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: EntityType.Account,
        selectedBrandCode: stateMock.myPerformance.current.selectedBrandCode
      }));
    });

    it('should trigger appropriate actions when current salesHierarchyViewType is people and the responsibilitiesState ' +
    'does NOT contain a alternateHierarchyId', () => {
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
        brandCode: stateMock.myPerformance.current.selectedBrandCode
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new FetchProductMetrics({
        positionId: rowMock.metadata.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: EntityType.Person,
        selectedBrandCode: stateMock.myPerformance.current.selectedBrandCode
      }));
    });

    it('should trigger appropriate actions when current salesHierarchyViewType is people and the responsibilitiesState ' +
    'contains an alternateHierarchyId', () => {
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      const alternateHierarchyIdMock = chance.string();

      currentMock.responsibilities.alternateHierarchyId = alternateHierarchyIdMock;
      currentSubject.next(currentMock);
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.people;
      componentInstance.handleElementClicked(params);

      const expectedSaveMyPerformanceState: MyPerformanceEntitiesData = Object.assign({}, currentMock, {
        filter: stateMock.myPerformanceFilter
      });

      expect(storeMock.dispatch.calls.count()).toBe(3);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SaveMyPerformanceState(expectedSaveMyPerformanceState));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SetMyPerformanceSelectedEntityType(rowMock.metadata.entityType));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchAlternateHierarchyResponsibilities({
        positionId: rowMock.metadata.positionId,
        alternateHierarchyId: alternateHierarchyIdMock,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityDescription: rowMock.descriptionRow0,
        brandCode: currentMock.selectedBrandCode
      }));
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
        entityTypeGroupName: EntityPeopleType[rowMock.descriptionRow0],
        entityTypeCode: rowMock.metadata.entityTypeCode,
        entityType: rowMock.metadata.entityType,
        selectedEntityDescription: rowMock.descriptionRow0,
        entities: stateMock.myPerformance.current.responsibilities.groupedEntities[EntityPeopleType[rowMock.descriptionRow0]],
        filter: stateMock.myPerformanceFilter as any,
        brandCode: stateMock.myPerformance.current.selectedBrandCode
      }));
    });

    it('should dispatch FetchEntityWithPerformance with an alternateHierarchyId when the responsibilitiesState ' +
    'contains an alternateHierarchyId', () => {
      currentMock.responsibilities.alternateHierarchyId = chance.string();
      currentSubject.next(currentMock);
      componentInstance.salesHierarchyViewType = SalesHierarchyViewType.roleGroups;

      const entityTypes: EntityType[] = Object.keys(EntityType)
        .filter((key: EntityType) => key !== EntityType.ResponsibilitiesGroup)
        .map((key: EntityType) => EntityType[key]);

      rowMock.metadata.entityType = entityTypes[chance.integer({ min: 0, max: entityTypes.length - 1 })];
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchEntityWithPerformance({
        positionId: rowMock.metadata.positionId,
        alternateHierarchyId: currentMock.responsibilities.alternateHierarchyId,
        entityTypeGroupName: EntityPeopleType[rowMock.descriptionRow0],
        entityTypeCode: rowMock.metadata.entityTypeCode,
        entityType: rowMock.metadata.entityType,
        selectedEntityDescription: rowMock.descriptionRow0,
        entities: stateMock.myPerformance.current.responsibilities.groupedEntities[EntityPeopleType[rowMock.descriptionRow0]],
        filter: stateMock.myPerformanceFilter as any,
        brandCode: currentMock.selectedBrandCode
      }));
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
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        selectedBrandCode: rowMock.metadata.brandCode
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        groupedEntities: stateMock.myPerformance.current.responsibilities.groupedEntities,
        hierarchyGroups: stateMock.myPerformance.current.responsibilities.hierarchyGroups,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        selectedEntityTypeCode: stateMock.myPerformance.current.responsibilities.entityTypeCode,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandCode: rowMock.metadata.brandCode,
        entityType: stateMock.myPerformance.current.selectedEntityType,
        alternateHierarchyId: stateMock.myPerformance.current.responsibilities.alternateHierarchyId,
        accountPositionId: stateMock.myPerformance.current.responsibilities.accountPositionId
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
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        selectedBrandCode: rowMock.metadata.brandCode,
        contextPositionId: stateMock.myPerformance.current.responsibilities.positionId
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        groupedEntities: stateMock.myPerformance.current.responsibilities.groupedEntities,
        hierarchyGroups: stateMock.myPerformance.current.responsibilities.hierarchyGroups,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        selectedEntityTypeCode: stateMock.myPerformance.current.responsibilities.entityTypeCode,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandCode: rowMock.metadata.brandCode,
        entityType: stateMock.myPerformance.current.selectedEntityType,
        alternateHierarchyId: stateMock.myPerformance.current.responsibilities.alternateHierarchyId,
        accountPositionId: stateMock.myPerformance.current.responsibilities.accountPositionId
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
        entityTypeCode: stateMock.myPerformance.current.responsibilities.entityTypeCode
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        groupedEntities: stateMock.myPerformance.current.responsibilities.groupedEntities,
        hierarchyGroups: stateMock.myPerformance.current.responsibilities.hierarchyGroups,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        selectedEntityTypeCode: stateMock.myPerformance.current.responsibilities.entityTypeCode,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandCode: rowMock.metadata.brandCode,
        entityType: stateMock.myPerformance.current.selectedEntityType,
        alternateHierarchyId: stateMock.myPerformance.current.responsibilities.alternateHierarchyId,
        accountPositionId: stateMock.myPerformance.current.responsibilities.accountPositionId
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
        positionId: stateMock.myPerformance.current.responsibilities.accountPositionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        selectedBrandCode: rowMock.metadata.brandCode
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ResponsibilitiesActions.RefreshAllPerformances({
        positionId: stateMock.myPerformance.current.responsibilities.positionId,
        groupedEntities: stateMock.myPerformance.current.responsibilities.groupedEntities,
        hierarchyGroups: stateMock.myPerformance.current.responsibilities.hierarchyGroups,
        selectedEntityType: stateMock.myPerformance.current.selectedEntityType,
        selectedEntityTypeCode: stateMock.myPerformance.current.responsibilities.entityTypeCode,
        salesHierarchyViewType: componentInstance.salesHierarchyViewType,
        filter: stateMock.myPerformanceFilter as any,
        brandCode: rowMock.metadata.brandCode,
        entityType: stateMock.myPerformance.current.selectedEntityType,
        alternateHierarchyId: stateMock.myPerformance.current.responsibilities.alternateHierarchyId,
        accountPositionId: stateMock.myPerformance.current.responsibilities.accountPositionId
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

      expect(storeMock.dispatch.calls.count()).toBe(1);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
        new MyPerformanceVersionActions.SetMyPerformanceSelectedSkuCode(payLoad)
      );
    });
  });

  describe('when left side data row link clicked', () => {
    let rowMock: MyPerformanceTableRow;
    let accountNameMock: string;
    let hierarchyEntityMock: HierarchyEntity;
    let currentMock: MyPerformanceEntitiesData;
    let insideAlternateHierarchyMock: boolean;
    let alternateHierarchyIdMock: string;

    beforeEach(() => {
      rowMock = getMyPerformanceTableRowMock(1)[0];
      accountNameMock = chance.string();
      hierarchyEntityMock = getEntityPropertyResponsibilitiesMock();
      currentMock = getMyPerformanceEntitiesDataMock();
      alternateHierarchyIdMock = chance.string();
      insideAlternateHierarchyMock = !!alternateHierarchyIdMock;
    });

    describe('when distributor subline link clicked', () => {
      it('should correctly call functions to go to account dashboard when distributor clicked with correct ' +
        'params within alternate hierarchy', () => {
        rowMock.metadata.entityType = EntityType.Distributor;
        currentMock.responsibilities.alternateHierarchyId = alternateHierarchyIdMock;
        currentSubject.next(currentMock);
        componentInstance.handleSublineClicked(rowMock);
        expect(myPerformanceServiceMock.accountDashboardStateParameters).toHaveBeenCalledWith
        (insideAlternateHierarchyMock, stateMock.myPerformanceFilter, rowMock);
        expect(stateMock.href).toHaveBeenCalledWith(
          'accounts',
          myPerformanceServiceMock.accountDashboardStateParameters(insideAlternateHierarchyMock, stateMock.myPerformanceFilter, rowMock));
        expect(windowServiceMock.nativeWindow).toHaveBeenCalled();
        expect(windowMock.open).toHaveBeenCalled();
      });
    });

    describe('when subaccount subline link clicked', () => {
      it('should correctly call functions for accountDashboard when subAccount clicked with matching hierarchy entity within ' +
        'alternate hierarchy', () => {
        rowMock.metadata.entityType = EntityType.SubAccount;
        currentMock.responsibilities.alternateHierarchyId = alternateHierarchyIdMock;
        currentSubject.next(currentMock);
        hierarchyEntityMock.positionId = rowMock.metadata.positionId;
        currentMock.responsibilities.groupedEntities = {[accountNameMock]: [hierarchyEntityMock]};
        currentSubject.next(currentMock);
        componentInstance.handleSublineClicked(rowMock);
        expect(myPerformanceServiceMock.accountDashboardStateParameters).toHaveBeenCalledWith(
          insideAlternateHierarchyMock,
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
      });

      it('should correctly call functions for accountDashboard when subAccount clicked but no matching ' +
        'hierarchy entity within alternate hierarchy', () => {
        rowMock.metadata.entityType = EntityType.SubAccount;
        currentMock.responsibilities.alternateHierarchyId = alternateHierarchyIdMock;
        currentSubject.next(currentMock);
        hierarchyEntityMock.positionId = rowMock.metadata.positionId + chance.character();
        myPerformanceStateMock.current.responsibilities.groupedEntities[accountNameMock] = [hierarchyEntityMock];
        currentSubject.next(currentMock);
        componentInstance.handleSublineClicked(rowMock);
        expect(myPerformanceServiceMock.accountDashboardStateParameters).toHaveBeenCalledWith
        (insideAlternateHierarchyMock, stateMock.myPerformanceFilter, rowMock);
        expect(stateMock.href).toHaveBeenCalledWith(
          'accounts',
          myPerformanceServiceMock.accountDashboardStateParameters(insideAlternateHierarchyMock, stateMock.myPerformanceFilter, rowMock));
        expect(windowServiceMock.nativeWindow).toHaveBeenCalled();
        expect(windowMock.open).toHaveBeenCalled();
      });

      it('should correctly call functions for accountDashboard when subAccount clicked with matching hierarchy entity outside ' +
        'alternate hierarchy', () => {
        rowMock.metadata.entityType = EntityType.SubAccount;
        currentMock.responsibilities.alternateHierarchyId = null;
        currentSubject.next(currentMock);
        insideAlternateHierarchyMock = false;
        hierarchyEntityMock.positionId = rowMock.metadata.positionId;
        currentMock.responsibilities.groupedEntities = {[accountNameMock]: [hierarchyEntityMock]};
        currentSubject.next(currentMock);
        componentInstance.handleSublineClicked(rowMock);
        expect(myPerformanceServiceMock.accountDashboardStateParameters).toHaveBeenCalledWith(
          insideAlternateHierarchyMock,
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
      });
    });
  });

  describe('when right side data row is clicked', () => {
    it('should dispatch appropriate actions for clearing the selectedSkuPackageCode', () => {
      storeMock.dispatch.calls.reset();

      myPerformanceProductMetricsMock = {
        status: ActionStatus.Fetching,
        products: {brandValues: []},
        productMetricsViewType: ProductMetricsViewType.skus
      };
      productMetricsSubject.next(myPerformanceProductMetricsMock);

      const params: HandleElementClickedParameters = { leftSide: false, type: RowType.data, index: 0 };
      componentInstance.handleElementClicked(params);
      expect(storeMock.dispatch.calls.count()).toBe(1);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(
        new MyPerformanceVersionActions.ClearMyPerformanceSelectedSkuCode());
    });
  });

  describe('handleBreadcrumbEntityClicked', () => {
    describe('when steps back are possible', () => {
      let versionsMock: MyPerformanceEntitiesData[];
      let breadcrumbTrailMock: string[];
      let breadcrumbSelectionIndex: number;
      let expectedStepsBack: number;
      let expectedPositionId: string;
      let expectedEntityTypeCode: string;
      let expectedSelectedBrandCode: string;

      function setupVersionAndBreadcrumbMocks(selectedSalesHierarchyViewType: SalesHierarchyViewType) {
        versionsMock = generateMockVersions(4, 9);
        const breadcrumbTrailLength = versionsMock.length + 1;
        breadcrumbTrailMock = Array(breadcrumbTrailLength).fill('').map(() => chance.string());
        breadcrumbSelectionIndex = chance.natural({max: versionsMock.length - 2});
        expectedStepsBack = breadcrumbTrailMock.length - breadcrumbSelectionIndex - 1;
        versionsMock[breadcrumbSelectionIndex].salesHierarchyViewType.viewType = selectedSalesHierarchyViewType;
        versionsMock[breadcrumbSelectionIndex].filter = stateMock.myPerformanceFilter;
        expectedPositionId = versionsMock[breadcrumbSelectionIndex].responsibilities.positionId;
        expectedEntityTypeCode = versionsMock[breadcrumbSelectionIndex].responsibilities.entityTypeCode;
        expectedSelectedBrandCode = stateMock.myPerformance.current.selectedBrandCode;
        versionsSubject.next(versionsMock);
      }

      beforeEach(() => {
        storeMock.dispatch.and.callThrough();
        storeMock.dispatch.calls.reset();
      });

      it('should dispatch RestoreMyPerformanceState when selected step has distributors SalesHierarchyViewType', () => {
        setupVersionAndBreadcrumbMocks(SalesHierarchyViewType.distributors);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entityDescription: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState(
          expectedStepsBack
        ));
      });

      it('should dispatch RestoreMyPerformanceState when selected step has subAccounts SalesHierarchyViewType', () => {
        setupVersionAndBreadcrumbMocks(SalesHierarchyViewType.subAccounts);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entityDescription: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceState(
          expectedStepsBack
        ));
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
          selectedEntityType: EntityType.RoleGroup,
          selectedBrandCode: expectedSelectedBrandCode
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
          selectedEntityType: EntityType.Person,
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
          selectedEntityType: EntityType.Person,
          selectedBrandCode: expectedSelectedBrandCode
        }));
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
          selectedEntityTypeCode: previousVersionMock.responsibilities.entityTypeCode,
          salesHierarchyViewType: previousVersionMock.salesHierarchyViewType.viewType,
          filter: stateMock.myPerformanceFilter,
          brandCode: previousVersionMock.selectedBrandCode,
          entityType: previousVersionMock.selectedEntityType,
          alternateHierarchyId: previousVersionMock.responsibilities.alternateHierarchyId,
          accountPositionId: previousVersionMock.responsibilities.accountPositionId
        }));
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
});
