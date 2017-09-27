import { By } from '@angular/platform-browser';
import * as Chance from 'chance';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Observable, Subject } from 'rxjs';
import { Store } from '@ngrx/store';

import { BreadcrumbEntityClickedEvent } from '../../models/breadcrumb-entity-clicked-event.model';
import { DateRange } from '../../models/date-range.model';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { FetchProductMetricsAction } from '../../state/actions/product-metrics.action';
import { FetchResponsibilities, FetchEntityWithPerformance, FetchSubAccountsAction } from '../../state/actions/responsibilities.action';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getMyPerformanceEntitiesDataMock, getMyPerformanceStateMock } from '../../state/reducers/my-performance.state.mock';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { HandleElementClickedParameters, MyPerformanceComponent } from './my-performance.component';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import * as MyPerformanceVersionActions from '../../state/actions/my-performance-version.action';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent } from '../../models/my-performance-filter.model';
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceEntitiesData, MyPerformanceState } from '../../state/reducers/my-performance.reducer';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { MyPerformanceTableRowComponent } from '../../shared/components/my-performance-table-row/my-performance-table-row.component';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { RowType } from '../../enums/row-type.enum';
import { SelectedEntityType } from '../../enums/selected-entity-type.enum';
import { SortIndicatorComponent } from '../../shared/components/sort-indicator/sort-indicator.component';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { UtilService } from '../../services/util.service';
import { ViewType } from '../../enums/view-type.enum';

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
  @Input() currentUserFullName: string[];
  @Input() performanceStateVersions: MyPerformanceEntitiesData[];
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
  @Input() showOpportunities: boolean = true;
  @Input() tableHeaderRow: Array<string>;
  @Input() totalRow: MyPerformanceTableRow;
  @Input() viewType: ViewType;
}

describe('MyPerformanceComponent', () => {
  let fixture: ComponentFixture<MyPerformanceComponent>;
  let componentInstance: MyPerformanceComponent;
  let userServiceMock: any;
  let myPerformanceStateMock: MyPerformanceState = getMyPerformanceStateMock();

  function generateMockVersions(min: number, max: number): MyPerformanceEntitiesData[] {
    return Array(chance.natural({min: min, max: max})).fill('').map(() => getMyPerformanceEntitiesDataMock());
  }

  const initialVersionsMock: MyPerformanceEntitiesData[] = generateMockVersions(9, 9).map((version) => {
    version.viewType.leftTableViewType = ViewType.distributors;
    return version;
  });

  const versionsSubject: Subject<MyPerformanceEntitiesData[]> = new Subject<MyPerformanceEntitiesData[]>();

  const stateMock = {
    myPerformance: myPerformanceStateMock,
    myPerformanceProductMetrics: chance.string(),
    myPerformanceFilter: getMyPerformanceFilterMock(),
    dateRanges: chance.string(),
    viewTypes: chance.string()
  };

  const storeMock = {
    select: jasmine.createSpy('select.myPerformance').and.callFake((selectFunction: (state: any) => any) => {
      const selectedValue = selectFunction(stateMock);

      if (selectedValue === stateMock.myPerformance.versions) {
        return versionsSubject;
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
          positionId: chance.integer().toString()
        }
      }
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
          provide: Store,
          useValue: storeMock
        },
        {
          provide: 'userService',
          useValue: userServiceMock
        },
        UtilService
      ]
    });

    fixture = TestBed.createComponent(MyPerformanceComponent);
    componentInstance = fixture.componentInstance;
    fixture.detectChanges();

    versionsSubject.next(initialVersionsMock);
  });

  it('should dispatch actions on init', inject([ 'userService' ], (userService: any) => {
    userService.model.currentUser.firstName = chance.string();
    userService.model.currentUser.lastName = chance.string();
    storeMock.dispatch.and.callThrough();
    storeMock.dispatch.calls.reset();

    fixture = TestBed.createComponent(MyPerformanceComponent);
    fixture.detectChanges();

    expect(storeMock.dispatch.calls.count()).toBe(2);
    expect(storeMock.dispatch.calls.argsFor(0)).toEqual([new FetchResponsibilities({
      positionId: userServiceMock.model.currentUser.positionId,
      filter: stateMock.myPerformanceFilter as any
    })]);

    expect(storeMock.dispatch.calls.argsFor(1)).toEqual([new FetchProductMetricsAction({
      positionId: userServiceMock.model.currentUser.positionId,
      filter: stateMock.myPerformanceFilter as any,
      selectedEntityType: SelectedEntityType.Position
    })]);
  }));

  it('should dispatch actions on init and handle empty positionId', inject([ 'userService' ], (userService: any) => {
    userService.model.currentUser.positionId = '';
    storeMock.dispatch.and.callThrough();
    storeMock.dispatch.calls.reset();

    fixture = TestBed.createComponent(MyPerformanceComponent);
    fixture.detectChanges();

    expect(storeMock.dispatch.calls.count()).toBe(2);
    expect(storeMock.dispatch.calls.argsFor(0)).toEqual([new FetchResponsibilities({
      positionId: '0',
      filter: stateMock.myPerformanceFilter as any
    })]);
  }));

  it('should dispatch actions on init and handle undefined positionId', inject([ 'userService' ], (userService: any) => {
    delete userService.model.currentUser.positionId;
    storeMock.dispatch.and.callThrough();
    storeMock.dispatch.calls.reset();

    fixture = TestBed.createComponent(MyPerformanceComponent);
    fixture.detectChanges();

    expect(storeMock.dispatch.calls.count()).toBe(2);
    expect(storeMock.dispatch.calls.argsFor(0)).toEqual([new FetchResponsibilities({
      positionId: '0',
      filter: stateMock.myPerformanceFilter as any
    })]);
  }));

  it('should trigger appropriate actions when the filter component emits an event', () => {
    storeMock.dispatch.and.callThrough();
    storeMock.dispatch.calls.reset();

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

    expect(storeMock.dispatch.calls.count()).toBe(4);
    expect(storeMock.dispatch.calls.argsFor(0)).toEqual([{
      payload: MetricTypeValue.volume,
      type: '[My Performance Filter] SET_METRIC'
    }]);
    expect(storeMock.dispatch.calls.argsFor(1)).toEqual([{
      payload: DateRangeTimePeriodValue.L90BDL,
      type: '[My Performance Filter] SET_TIME_PERIOD'
    }]);
    expect(storeMock.dispatch.calls.argsFor(2)).toEqual([{
      payload: PremiseTypeValue.Off,
      type: '[My Performance Filter] SET_PREMISE_TYPE'
    }]);
    expect(storeMock.dispatch.calls.argsFor(3)).toEqual([{
      payload: DistributionTypeValue.simple,
      type: '[My Performance Filter] SET_DISTRIBUTION_TYPE'
    }]);
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
        const params: HandleElementClickedParameters = { leftSide: true, type: RowType.total, index: 0 };
        componentInstance.handleElementClicked(params);

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());
      });

      it('should dispatch RestoreMyPerformanceStateAction when last version has a leftTableViewType of people', () => {
        versionsMock[versionsMock.length - 1].viewType.leftTableViewType = ViewType.people;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        const params: HandleElementClickedParameters = { leftSide: true, type: RowType.total, index: 0 };
        componentInstance.handleElementClicked(params);

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());
      });

      it('should dispatch RestoreMyPerformanceStateAction when last version has a leftTableViewType of subAccounts', () => {
        versionsMock[versionsMock.length - 1].viewType.leftTableViewType = ViewType.subAccounts;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        const params: HandleElementClickedParameters = { leftSide: true, type: RowType.total, index: 0 };
        componentInstance.handleElementClicked(params);

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction());
      });

      it('should dispatch RestoreMyPerformanceStateAction and FetchProductMetricsAction ' +
        'when last version has a leftTableViewType of roleGroups', () => {
        versionsMock[versionsMock.length - 1].viewType.leftTableViewType = ViewType.roleGroups;
        versionsSubject.next(versionsMock);

        storeMock.dispatch.calls.reset();
        const params: HandleElementClickedParameters = { leftSide: true, type: RowType.total, index: 0 };
        componentInstance.handleElementClicked(params);

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
        const params: HandleElementClickedParameters = { leftSide: true, type: RowType.total, index: 0 };
        componentInstance.handleElementClicked(params);

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

    beforeEach(() => {
      storeMock.dispatch.and.callThrough();
      storeMock.dispatch.calls.reset();
      rowMock = getMyPerformanceTableRowMock(1)[0];
    });

    it('should trigger appropriate actions when current ViewType is roleGroups', () => {
      componentInstance.leftTableViewType = ViewType.roleGroups;
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);
      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new FetchEntityWithPerformance({
        entityTypeGroupName: EntityPeopleType[rowMock.descriptionRow0],
        entityTypeCode: rowMock.metadata.entityTypeCode,
        entities: stateMock.myPerformance.current.responsibilities.groupedEntities[EntityPeopleType[rowMock.descriptionRow0]],
        filter: stateMock.myPerformanceFilter as any,
        selectedPositionId: rowMock.metadata.positionId,
        viewType: ViewType.people
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new FetchProductMetricsAction({
        positionId: rowMock.metadata.positionId,
        entityTypeCode: rowMock.metadata.entityTypeCode,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: SelectedEntityType.RoleGroup
      }));
    });

    it('should trigger appropriate actions when current ViewType is accounts', () => {
      componentInstance.leftTableViewType = ViewType.accounts;
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);
      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new FetchSubAccountsAction({
        positionId: rowMock.metadata.positionId,
        contextPositionId: stateMock.myPerformance.current.responsibilities.positionId,
        entityTypeAccountName: rowMock.descriptionRow0,
        selectedPositionId: rowMock.metadata.positionId,
        premiseType: stateMock.myPerformanceFilter.premiseType
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new FetchProductMetricsAction({
        positionId: rowMock.metadata.positionId,
        contextPositionId: stateMock.myPerformance.current.responsibilities.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: SelectedEntityType.Account
      }));
    });

    it('should trigger appropriate actions when current ViewType is people', () => {
      componentInstance.leftTableViewType = ViewType.people;
      const params: HandleElementClickedParameters = { leftSide: true, type: RowType.data, index: 0, row: rowMock };
      componentInstance.handleElementClicked(params);
      expect(storeMock.dispatch.calls.count()).toBe(4);
      expect(storeMock.dispatch.calls.argsFor(2)[0]).toEqual(new FetchResponsibilities({
        positionId: rowMock.metadata.positionId,
        filter: stateMock.myPerformanceFilter as any
      }));
      expect(storeMock.dispatch.calls.argsFor(3)[0]).toEqual(new FetchProductMetricsAction({
        positionId: rowMock.metadata.positionId,
        filter: stateMock.myPerformanceFilter as any,
        selectedEntityType: SelectedEntityType.Position
      }));
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

    const functionPassToSelectCall7 = storeMock.select.calls.argsFor(5)[0];
    expect(functionPassToSelectCall7(stateMock)).toBe(stateMock.myPerformance.versions);

    fixture.detectChanges();
    const myPerformanceFilterMock = fixture.debugElement.query(By.directive(MyPerformanceFilterComponentMock))
    .injector
    .get(MyPerformanceFilterComponentMock) as MyPerformanceFilterComponentMock;
    expect(myPerformanceFilterMock.filterState).toEqual(stateMock.myPerformanceFilter as any);
    expect(myPerformanceFilterMock.dateRanges).toBe(stateMock.dateRanges as any);
  });

  describe('handleBreadcrumbEntityClicked', () => {
    describe('when steps back are possible', () => {
      let versionsMock: MyPerformanceEntitiesData[];
      let breadcrumbTrailMock: string[];
      let breadcrumbSelectionIndex: number;
      let expectedStepsBack: number;
      let expectedPositionId: string;

      function setupVersionAndBreadcrumbMocks(selectedStateViewType: ViewType) {
        versionsMock = generateMockVersions(4, 9);
        const breadcrumbTrailLength = versionsMock.length + 1;
        breadcrumbTrailMock = Array(breadcrumbTrailLength).fill('').map(() => chance.string());
        breadcrumbSelectionIndex = chance.natural({max: versionsMock.length - 2});
        expectedStepsBack = breadcrumbTrailMock.length - breadcrumbSelectionIndex - 1;
        versionsMock[breadcrumbSelectionIndex].viewType.leftTableViewType = selectedStateViewType;
        expectedPositionId = versionsMock[breadcrumbSelectionIndex].responsibilities.positionId;
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

      it('should dispatch RestoreMyPerformanceStateAction when selected step has people view type', () => {
        setupVersionAndBreadcrumbMocks(ViewType.people);
        componentInstance.handleBreadcrumbEntityClicked({
          trail: breadcrumbTrailMock,
          entity: breadcrumbTrailMock[breadcrumbSelectionIndex]
        });

        expect(storeMock.dispatch.calls.count()).toBe(1);
        expect(storeMock.dispatch.calls.argsFor(0)[0]).toEqual(new MyPerformanceVersionActions.RestoreMyPerformanceStateAction(
          expectedStepsBack
        ));
      });

      it('should dispatch multiple actions when steps back are possible and selected step has roleGroups view type', () => {
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

      it('should dispatch multiple actions when steps back are possible and selected step has accounts view type', () => {
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

  describe('onDestroy', () => {
    it('should dispatch ClearMyPerformanceStateAction as its final call dispatch', () => {
      componentInstance.ngOnDestroy();
      expect(storeMock.dispatch.calls.mostRecent().args[0].type).toBe(MyPerformanceVersionActions.CLEAR_MY_PERFORMANCE_STATE_ACTION);
    });
  });
});
