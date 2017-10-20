import { By } from '@angular/platform-browser';
import * as Chance from 'chance';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { ActionStatus } from '../../enums/action-status.enum';
import { BreadcrumbEntityClickedEvent } from '../../models/breadcrumb-entity-clicked-event.model';
import { DateRange } from '../../models/date-range.model';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { EntityPeopleType, EntityType } from '../../enums/entity-responsibilities.enum';
import { FetchProductMetricsAction } from '../../state/actions/product-metrics.action';
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
import * as ResponsibilitiesActions from '../../state/actions/responsibilities.action';
import { RowType } from '../../enums/row-type.enum';
import { SaveMyPerformanceStateAction, SetMyPerformanceSelectedEntityAction } from '../../state/actions/my-performance-version.action';
import { SelectedEntityType } from '../../enums/selected-entity-type.enum';
import { SortIndicatorComponent } from '../../shared/components/sort-indicator/sort-indicator.component';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { UtilService } from '../../services/util.service';
import { ViewType } from '../../enums/view-type.enum';
import { WindowService } from '../../services/window.service';

const chance = new Chance();

@Component({
  selector: 'my-performance-filter',
  template: ''
})
class MyPerformanceFilterComponentMock {
  @Output() onFilterChange = new EventEmitter<MyPerformanceFilterEvent>();

  @Input() dateRanges: DateRangesState;
  @Input() filterState: MyPerformanceFilterState;
}

@Component({
  selector: 'my-performance-breadcrumb',
  template: ''
})
class MyPerformanceBreadcrumbComponentMock {
  @Output() breadcrumbEntityClicked = new EventEmitter<BreadcrumbEntityClickedEvent>();
  @Output() backButtonClicked = new EventEmitter();
  @Input() currentUserFullName: string[];
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
  @Input() performanceMetric: string;
  @Input() showBackButton: boolean = false;
  @Input() showContributionToVolume: boolean = false;
  @Input() showOpportunities: boolean = true;
  @Input() tableHeaderRow: Array<string>;
  @Input() totalRow: MyPerformanceTableRow;
  @Input() viewType: ViewType;
}

describe('MyPerformanceComponent', () => {
  let fixture: ComponentFixture<MyPerformanceComponent>;
  let componentInstance: MyPerformanceComponent;
  let userServiceMock: any;
  let myPerformanceServiceMock: any;
  let myPerformanceStateMock: MyPerformanceState = getMyPerformanceStateMock();
  let myPerformanceProductMetricsMock: ProductMetricsState = {status: ActionStatus.Fetching, products: {}};

  function generateMockVersions(min: number, max: number): MyPerformanceEntitiesData[] {
    return Array(chance.natural({min: min, max: max})).fill('').map(() => getMyPerformanceEntitiesDataMock());
  }

  const initialVersionsMock: MyPerformanceEntitiesData[] = generateMockVersions(9, 9).map((version) => {
    version.viewType.leftTableViewType = ViewType.distributors;
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

  const stateMock = {
    myPerformance: myPerformanceStateMock,
    myPerformanceProductMetrics: myPerformanceProductMetricsMock,
    myPerformanceFilter: getMyPerformanceFilterMock(),
    dateRanges: chance.string(),
    viewTypes: chance.string(),
    href: jasmine.createSpy('href')
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
          srcTypeCd: [ 'SALES_HIER' ]
        }
      }
    };

    myPerformanceServiceMock = {
      getUserDefaultPremiseType: jasmine.createSpy('getUserDefaultPremiseType'),
      accountDashboardStateParameters: jasmine.createSpy('accountDashboardStateParameters').and.callThrough()
    };

    TestBed.configureTestingModule({
      declarations: [
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
        UtilService
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

    beforeEach(inject([ 'userService' ], (_userService: any) => {
      userService = _userService;
      userService.model.currentUser.firstName = chance.string();
      userService.model.currentUser.lastName = chance.string();

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
        filter: stateMock.myPerformanceFilter as any
      }));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new FetchProductMetricsAction({
        positionId: userServiceMock.model.currentUser.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: SelectedEntityType.Position
      }));
    });

    it('should dispatch actions on init and handle empty positionId', () => {
      userService.model.currentUser.positionId = '';
      fixture = TestBed.createComponent(MyPerformanceComponent);
      fixture.detectChanges();

      expect(storeMock.dispatch.calls.count()).toBe(3);
      expect(storeMock.dispatch.calls.argsFor(1)).toEqual([new ResponsibilitiesActions.FetchResponsibilities({
        positionId: '0',
        filter: stateMock.myPerformanceFilter as any
      })]);
    });

    it('should dispatch actions on init and handle undefined positionId', () => {
      delete userService.model.currentUser.positionId;
      fixture = TestBed.createComponent(MyPerformanceComponent);
      fixture.detectChanges();

      expect(storeMock.dispatch.calls.count()).toBe(3);
      expect(storeMock.dispatch.calls.argsFor(1)).toEqual([new ResponsibilitiesActions.FetchResponsibilities({
        positionId: '0',
        filter: stateMock.myPerformanceFilter as any
      })]);
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

      expect(storeMock.select.calls.count()).toBe(6);
      const functionPassToSelectCall0 = storeMock.select.calls.argsFor(0)[0];
      expect(functionPassToSelectCall0(stateMock)).toBe(stateMock.dateRanges);

      const functionPassToSelectCall1 = storeMock.select.calls.argsFor(1)[0];
      expect(functionPassToSelectCall1(stateMock)).toBe(stateMock.myPerformance.versions);

      const functionPassToSelectCall2 = storeMock.select.calls.argsFor(2)[0];
      expect(functionPassToSelectCall2(stateMock)).toBe(stateMock.myPerformanceFilter);

      const functionPassToSelectCall3 = storeMock.select.calls.argsFor(3)[0];
      expect(functionPassToSelectCall3(stateMock)).toBe(stateMock.myPerformanceProductMetrics);

      const functionPassToSelectCall4 = storeMock.select.calls.argsFor(4)[0];
      expect(functionPassToSelectCall4(stateMock)).toBe(stateMock.myPerformance.current);

      const functionPassToSelectCall5 = storeMock.select.calls.argsFor(5)[0];
      expect(functionPassToSelectCall5(stateMock)).toBe(stateMock.myPerformance.versions);

      fixture.detectChanges();
      const myPerformanceFilterMock = fixture.debugElement.query(By.directive(MyPerformanceFilterComponentMock))
        .injector
        .get(MyPerformanceFilterComponentMock) as MyPerformanceFilterComponentMock;
      expect(myPerformanceFilterMock.filterState).toEqual(stateMock.myPerformanceFilter as any);
      expect(myPerformanceFilterMock.dateRanges).toBe(stateMock.dateRanges as any);
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

      it('should dispatch RestoreMyPerformanceStateAction when last version has a leftTableViewType of distributors', () => {
        versionsMock[versionsMock.length - 1].viewType.leftTableViewType = ViewType.distributors;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());
      });

      it('should dispatch RestoreMyPerformanceStateAction and FetchProductMetricsAction ' +
        'when last version has a leftTableViewType of people', () => {
        versionsMock[versionsMock.length - 1].viewType.leftTableViewType = ViewType.people;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetricsAction({
          positionId: versionsMock[versionsMock.length - 1].responsibilities.positionId,
          entityTypeCode: versionsMock[versionsMock.length - 1].responsibilities.entityTypeCode,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: SelectedEntityType.RoleGroup
        }));
      });

      it('should dispatch RestoreMyPerformanceStateAction when last version has a leftTableViewType of subAccounts', () => {
        versionsMock[versionsMock.length - 1].viewType.leftTableViewType = ViewType.subAccounts;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());
      });

      it('should dispatch RestoreMyPerformanceStateAction and FetchProductMetricsAction ' +
        'when last version has a leftTableViewType of roleGroups', () => {
        versionsMock[versionsMock.length - 1].viewType.leftTableViewType = ViewType.roleGroups;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetricsAction({
          positionId: versionsMock[versionsMock.length - 1].responsibilities.positionId,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: SelectedEntityType.Position
        }));
      });

      it('should dispatch RestoreMyPerformanceStateAction and FetchProductMetricsAction ' +
        'when last version has a leftTableViewType of accounts', () => {
        versionsMock[versionsMock.length - 1].viewType.leftTableViewType = ViewType.accounts;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        componentInstance.handleBackButtonClicked();

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetricsAction({
          positionId: versionsMock[versionsMock.length - 1].responsibilities.positionId,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: SelectedEntityType.Position
        }));
      });
    });
  });

  describe('when left side data row is clicked', () => {
    let rowMock: MyPerformanceTableRow;
    let currentMock: MyPerformanceEntitiesData;

    beforeEach(() => {
      storeMock.dispatch.and.callThrough();
      storeMock.dispatch.calls.reset();
      rowMock = getMyPerformanceTableRowMock(1)[0];
      currentMock = getMyPerformanceEntitiesDataMock();
    });

    it('should trigger appropriate actions when current ViewType is roleGroups and the row metadata ' +
    'does NOT contain alternateHierarchyId', () => {
      componentInstance.leftTableViewType = ViewType.roleGroups;
      rowMock.metadata.entityType = EntityType.RoleGroup;
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SetMyPerformanceSelectedEntityAction(rowMock.descriptionRow0));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SaveMyPerformanceStateAction(stateMock.myPerformance.current));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchEntityWithPerformance({
        selectedPositionId: rowMock.metadata.positionId,
        entityTypeGroupName: EntityPeopleType[rowMock.descriptionRow0],
        entityTypeCode: rowMock.metadata.entityTypeCode,
        entityType: rowMock.metadata.entityType,
        entities: stateMock.myPerformance.current.responsibilities.groupedEntities[EntityPeopleType[rowMock.descriptionRow0]],
        filter: stateMock.myPerformanceFilter as any
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new FetchProductMetricsAction({
        positionId: rowMock.metadata.positionId,
        entityTypeCode: rowMock.metadata.entityTypeCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: SelectedEntityType.RoleGroup
      }));
    });

    it('should trigger appropriate actions when current ViewType is roleGroups and the row metadata ' +
    'contains a alternateHierarchyId', () => {
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };

      componentInstance.leftTableViewType = ViewType.roleGroups;
      rowMock.metadata.entityType = EntityType.RoleGroup;
      rowMock.metadata.alternateHierarchyId = chance.string();
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SetMyPerformanceSelectedEntityAction(rowMock.descriptionRow0));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SaveMyPerformanceStateAction(stateMock.myPerformance.current));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(
        new ResponsibilitiesActions.SetAlternateHierarchyId(rowMock.metadata.alternateHierarchyId));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new ResponsibilitiesActions.FetchEntityWithPerformance({
        selectedPositionId: rowMock.metadata.positionId,
        entityTypeGroupName: EntityPeopleType[rowMock.descriptionRow0],
        entityTypeCode: rowMock.metadata.entityTypeCode,
        entityType: rowMock.metadata.entityType,
        entities: stateMock.myPerformance.current.responsibilities.groupedEntities[EntityPeopleType[rowMock.descriptionRow0]],
        filter: stateMock.myPerformanceFilter as any
      }));
    });

    it('should trigger appropriate actions when current ViewType is accounts', () => {
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };

      componentInstance.leftTableViewType = ViewType.accounts;
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SetMyPerformanceSelectedEntityAction(rowMock.descriptionRow0));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SaveMyPerformanceStateAction(stateMock.myPerformance.current));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchSubAccountsAction({
        positionId: rowMock.metadata.positionId,
        contextPositionId: stateMock.myPerformance.current.responsibilities.positionId,
        entityTypeAccountName: rowMock.descriptionRow0,
        filter: stateMock.myPerformanceFilter as any,
        selectedPositionId: rowMock.metadata.positionId,
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new FetchProductMetricsAction({
        positionId: rowMock.metadata.positionId,
        contextPositionId: stateMock.myPerformance.current.responsibilities.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: SelectedEntityType.Account
      }));
    });

    it('should trigger appropriate actions when current ViewType is people and the responsibilitiesState ' +
    'does NOT contain a alternateHierarchyId', () => {
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };

      componentInstance.leftTableViewType = ViewType.people;
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SetMyPerformanceSelectedEntityAction(rowMock.descriptionRow0));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SaveMyPerformanceStateAction(stateMock.myPerformance.current));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchResponsibilities({
        positionId: rowMock.metadata.positionId,
        filter: stateMock.myPerformanceFilter as any
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new FetchProductMetricsAction({
        positionId: rowMock.metadata.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: SelectedEntityType.Position
      }));
    });

    it('should trigger appropriate actions when current ViewType is people and the responsibilitiesState ' +
    'contains an alternateHierarchyId', () => {
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      const alternateHierarchyIdMock = chance.string();

      currentMock.responsibilities.alternateHierarchyId = alternateHierarchyIdMock;
      currentSubject.next(currentMock);
      componentInstance.leftTableViewType = ViewType.people;
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.count()).toBe(3);
      expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new SetMyPerformanceSelectedEntityAction(rowMock.descriptionRow0));
      expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new SaveMyPerformanceStateAction(currentMock));
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchAlternateHierarchyResponsibilities({
        positionId: rowMock.metadata.positionId,
        alternateHierarchyId: alternateHierarchyIdMock,
        filter: stateMock.myPerformanceFilter as any
      }));
    });

    it('should dispatch FetchEntityWithPerformance when ViewType is roleGroups', () => {
      componentInstance.leftTableViewType = ViewType.roleGroups;

      const entityTypes: EntityType[] = Object.keys(EntityType)
        .filter((key: EntityType) => {
          return key !== EntityType.ResponsibilitiesGroup;
        })
        .map((key: EntityType) => EntityType[key]);

      rowMock.metadata.entityType = entityTypes[chance.integer({ min: 0, max: entityTypes.length - 1 })];
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);

      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new ResponsibilitiesActions.FetchEntityWithPerformance({
        selectedPositionId: rowMock.metadata.positionId,
        entityTypeGroupName: EntityPeopleType[rowMock.descriptionRow0],
        entityTypeCode: rowMock.metadata.entityTypeCode,
        entityType: rowMock.metadata.entityType,
        entities: stateMock.myPerformance.current.responsibilities.groupedEntities[EntityPeopleType[rowMock.descriptionRow0]],
        filter: stateMock.myPerformanceFilter as any
      }));
    });
  });

  describe('when left side data row link clicked', () => {
    let rowMock: MyPerformanceTableRow;
    let accountNameMock: string;
    let hierarchyEntityMock: HierarchyEntity;
    let currentMock: MyPerformanceEntitiesData;

    beforeEach(() => {
      rowMock = getMyPerformanceTableRowMock(1)[0];
      accountNameMock = chance.string();
      hierarchyEntityMock = getEntityPropertyResponsibilitiesMock();
      currentMock = getMyPerformanceEntitiesDataMock();
    });

    describe('when distributor subline link clicked', () => {
      it('should correctly call functions to go to account dashboard when distributor clicked with correct params', () => {
        rowMock.metadata.entityType = EntityType.Distributor;
        componentInstance.handleSublineClicked(rowMock);
        expect(myPerformanceServiceMock.accountDashboardStateParameters).toHaveBeenCalledWith(stateMock.myPerformanceFilter, rowMock);
        expect(stateMock.href).toHaveBeenCalledWith(
          'accounts',
          myPerformanceServiceMock.accountDashboardStateParameters(stateMock.myPerformanceFilter, rowMock));
        expect(windowServiceMock.nativeWindow).toHaveBeenCalled();
        expect(windowMock.open).toHaveBeenCalled();
      });
    });

    describe('when subaccount subline link clicked', () => {
      it('should correctly call functions for accountDashboard when subAccount clicked with matching hierarchy enity', () => {
        rowMock.metadata.entityType = EntityType.SubAccount;
        hierarchyEntityMock.positionId = rowMock.metadata.positionId;
        currentMock.responsibilities.groupedEntities = {[accountNameMock]: [hierarchyEntityMock]};
        currentSubject.next(currentMock);
        componentInstance.handleSublineClicked(rowMock);
        expect(myPerformanceServiceMock.accountDashboardStateParameters).toHaveBeenCalledWith(stateMock.myPerformanceFilter,
                                                                                              rowMock,
                                                                                              hierarchyEntityMock.premiseType);
        expect(stateMock.href).toHaveBeenCalledWith(
          'accounts',
          myPerformanceServiceMock.accountDashboardStateParameters(stateMock.myPerformanceFilter,
                                                                  rowMock,
                                                                  hierarchyEntityMock.premiseType));
        expect(windowServiceMock.nativeWindow).toHaveBeenCalled();
        expect(windowMock.open).toHaveBeenCalled();
      });

      it('should correctly call functions for accountDashboard when subAccount clicked but no matching hierarchy entity', () => {
        rowMock.metadata.entityType = EntityType.SubAccount;
        hierarchyEntityMock.positionId = rowMock.metadata.positionId + chance.character();
        myPerformanceStateMock.current.responsibilities.groupedEntities[accountNameMock] = [hierarchyEntityMock];
        currentSubject.next(currentMock);
        componentInstance.handleSublineClicked(rowMock);
        expect(myPerformanceServiceMock.accountDashboardStateParameters).toHaveBeenCalledWith(stateMock.myPerformanceFilter, rowMock);
        expect(stateMock.href).toHaveBeenCalledWith(
          'accounts',
          myPerformanceServiceMock.accountDashboardStateParameters(stateMock.myPerformanceFilter, rowMock));
        expect(windowServiceMock.nativeWindow).toHaveBeenCalled();
        expect(windowMock.open).toHaveBeenCalled();
      });
    });
  });

  describe('when right side data row is clicked', () => {
    it('should not dispatch any actions', () => {
      storeMock.dispatch.calls.reset();
      const params: HandleElementClickedParameters = { leftSide: false, type: RowType.data, index: 0 };
      componentInstance.handleElementClicked(params);
      expect(storeMock.dispatch.calls.count()).toBe(0);
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

      function setupVersionAndBreadcrumbMocks(selectedStateViewType: ViewType) {
        versionsMock = generateMockVersions(4, 9);
        const breadcrumbTrailLength = versionsMock.length + 1;
        breadcrumbTrailMock = Array(breadcrumbTrailLength).fill('').map(() => chance.string());
        breadcrumbSelectionIndex = chance.natural({max: versionsMock.length - 2});
        expectedStepsBack = breadcrumbTrailMock.length - breadcrumbSelectionIndex - 1;
        versionsMock[breadcrumbSelectionIndex].viewType.leftTableViewType = selectedStateViewType;
        expectedPositionId = versionsMock[breadcrumbSelectionIndex].responsibilities.positionId;
        expectedEntityTypeCode = versionsMock[breadcrumbSelectionIndex].responsibilities.entityTypeCode;
        versionsSubject.next(versionsMock);
      }

      beforeEach(() => {
        storeMock.dispatch.and.callThrough();
        storeMock.dispatch.calls.reset();
      });

      it('should dispatch RestoreMyPerformanceStateAction when selected step has distributors view type', () => {
        setupVersionAndBreadcrumbMocks(ViewType.distributors);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entity: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction(
          expectedStepsBack
        ));
      });

      it('should dispatch RestoreMyPerformanceStateAction when selected step has subAccounts view type', () => {
        setupVersionAndBreadcrumbMocks(ViewType.subAccounts);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entity: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction(
          expectedStepsBack
        ));
      });

      it('should dispatch RestoreMyPerformanceStateAction and FetchProductMetricsAction ' +
        'when selected step has people view type', () => {
        setupVersionAndBreadcrumbMocks(ViewType.people);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entity: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction(
          expectedStepsBack
        ));
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetricsAction({
          positionId: expectedPositionId,
          entityTypeCode: expectedEntityTypeCode,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: SelectedEntityType.RoleGroup
        }));
      });

      it('should dispatch RestoreMyPerformanceStateAction and FetchProductMetricsAction ' +
        'when selected step has roleGroups view type', () => {
        setupVersionAndBreadcrumbMocks(ViewType.roleGroups);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entity: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction(
          expectedStepsBack
        ));
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetricsAction({
          positionId: expectedPositionId,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: SelectedEntityType.Position
        }));
      });

      it('should dispatch RestoreMyPerformanceStateAction and FetchProductMetricsAction ' +
        'when selected step has accounts view type', () => {
        setupVersionAndBreadcrumbMocks(ViewType.accounts);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entity: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.count()).toBe(2);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction(
          expectedStepsBack
        ));
        expect(storeMock.dispatch.calls.argsFor(1)[0]).toEqual(new FetchProductMetricsAction({
          positionId: expectedPositionId,
          filter: stateMock.myPerformanceFilter as any,
          selectedEntityType: SelectedEntityType.Position
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
        entity: entityMock
      });

      expect(storeMock.dispatch.calls.count()).toBe(0);
    });
  });

  describe('when error for responsibilities', () => {
    let currentMock: MyPerformanceEntitiesData;

    beforeEach(() => {
      currentMock = getMyPerformanceEntitiesDataMock();
    });

    it('should set variable to false when responsibilities fetched with data', () => {
      currentMock.responsibilities = getResponsibilitesStateMock();
      currentMock.responsibilities.status = ActionStatus.Fetched;
      currentSubject.next(currentMock);
      expect(componentInstance.fetchResponsibilitiesFailure).toBe(false);
    });

    it('should set variable to true when responsibilities status is error', () => {
      currentMock.responsibilities = getResponsibilitesStateMock();
      currentMock.responsibilities.status = ActionStatus.Error;
      currentSubject.next(currentMock);
      expect(componentInstance.fetchResponsibilitiesFailure).toBe(true);
    });

    it('should set variable to true when responsibilities.groupedEntities is empty', () => {
      currentMock.responsibilities = getResponsibilitesStateMock();
      currentMock.responsibilities.status = ActionStatus.Error;
      currentMock.responsibilities.groupedEntities = {};
      currentSubject.next(currentMock);
      expect(componentInstance.fetchResponsibilitiesFailure).toBe(true);
    });
  });

  describe('when error for product metrics', () => {

    it('should set variable to false when productmetrics status is fetched', () => {
      myPerformanceProductMetricsMock = {status: ActionStatus.Fetched, products: {brand: []}};
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(componentInstance.fetchProductMetricsFailure).toBe(false);
    });

    it('should set variable to true when productmetrics status is error', () => {
      myPerformanceProductMetricsMock = {status: ActionStatus.Error, products: undefined};
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(componentInstance.fetchProductMetricsFailure).toBe(true);
    });

    it('should set variable to true when productmetrics.products is empty', () => {
      myPerformanceProductMetricsMock = {status: ActionStatus.Fetched, products: {}};
      productMetricsSubject.next(myPerformanceProductMetricsMock);
      expect(componentInstance.fetchProductMetricsFailure).toBe(true);
    });
  });

  describe('onDestroy', () => {
    it('should dispatch ClearMyPerformanceStateAction as its final call dispatch', () => {
      componentInstance.ngOnDestroy();
      expect(storeMock.dispatch.calls.mostRecent().args[0].type).toBe(MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_STATE_ACTION);
    });
  });
});
