import { By } from '@angular/platform-browser';
import * as Chance from 'chance';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { BreadcrumbEntityClickedEvent } from '../../models/breadcrumb-entity-clicked-event.model'; // tslint:disable-line:no-unused-variable
import { DateRange } from '../../models/date-range.model';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { FetchResponsibilitiesAction } from '../../state/actions/responsibilities.action';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import * as MyPerformanceVersionActions from '../../state/actions/my-performance-version.action';
import { MyPerformanceComponent } from './my-performance.component';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent } from '../../models/my-performance-filter.model'; // tslint:disable-line:no-unused-variable
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceState, initialState } from '../../state/reducers/my-performance.reducer';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { MyPerformanceTableRowComponent } from '../../shared/components/my-performance-table-row/my-performance-table-row.component';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { RowType } from '../../enums/row-type.enum';
import { SetRightMyPerformanceTableViewType } from '../../state/actions/view-types.action';
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
  @Input() performanceState: MyPerformanceState;
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

  const stateMock = {
      myPerformanceFilter: chance.string(),
      dateRanges: chance.string(),
      responsibilities: chance.string(),
      viewTypes: chance.string(),
      performanceTotal: chance.string(),
      myPerformance: initialState
  };

  const storeMock = {
    select: jasmine.createSpy('select.myPerformance').and.callFake((selectFunction: (state: any) => any) => {
      return Observable.of(selectFunction(stateMock));
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
  });

  it('should dispatch actions on init', inject([ 'userService' ], (userService: any) => {
    userService.model.currentUser.firstName = chance.string();
    userService.model.currentUser.lastName = chance.string();
    storeMock.dispatch.and.callThrough();
    storeMock.dispatch.calls.reset();

    fixture = TestBed.createComponent(MyPerformanceComponent);
    fixture.detectChanges();

    expect(storeMock.dispatch.calls.count()).toBe(2);
    expect(storeMock.dispatch.calls.argsFor(0)).toEqual([new FetchResponsibilitiesAction({
      positionId: parseInt(userServiceMock.model.currentUser.positionId, 0),
      filter: stateMock.myPerformanceFilter as any
    })]);

    // this will change once right table is built
    expect(storeMock.dispatch.calls.argsFor(1)).toEqual([new SetRightMyPerformanceTableViewType(ViewType.brands)]);
  }));

  it('should dispatch actions on init and handle empty positionId', inject([ 'userService' ], (userService: any) => {
    userService.model.currentUser.positionId = '';
    storeMock.dispatch.and.callThrough();
    storeMock.dispatch.calls.reset();

    fixture = TestBed.createComponent(MyPerformanceComponent);
    fixture.detectChanges();

    expect(storeMock.dispatch.calls.count()).toBe(2);
    expect(storeMock.dispatch.calls.argsFor(0)).toEqual([new FetchResponsibilitiesAction({
      positionId: 0,
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
    expect(storeMock.dispatch.calls.argsFor(0)).toEqual([new FetchResponsibilitiesAction({
      positionId: 0,
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

  it('should trigger appropriate actions when receiving events from elements clicked', () => {
    storeMock.dispatch.and.callThrough();
    storeMock.dispatch.calls.reset();
    const rowMock = getMyPerformanceTableRowMock(1)[0];

    componentInstance.showLeftBackButton = false;
    componentInstance.handleElementClicked({leftSide: true, type: RowType.total, index: 0});
    expect(storeMock.dispatch.calls.count()).toEqual(0);

    storeMock.dispatch.calls.reset();
    componentInstance.showLeftBackButton = true;
    componentInstance.handleElementClicked({leftSide: true, type: RowType.total, index: 0});
    expect(storeMock.dispatch.calls.count()).toEqual(1);

    storeMock.dispatch.calls.reset();
    componentInstance.leftTableViewType = ViewType.roleGroups;
    componentInstance.handleElementClicked({leftSide: true, type: RowType.data, index: 0, row: rowMock});
    expect(storeMock.dispatch.calls.count()).toEqual(3);

    storeMock.dispatch.calls.reset();
    componentInstance.leftTableViewType = ViewType.accounts;
    componentInstance.handleElementClicked({leftSide: true, type: RowType.data, index: 0, row: rowMock});
    expect(storeMock.dispatch.calls.count()).toEqual(2);

    storeMock.dispatch.calls.reset();
    componentInstance.handleElementClicked({leftSide: false, type: RowType.data, index: 0});
    expect(storeMock.dispatch.calls.count()).toEqual(0);
  });

  it('should call select with the right arguments', () => {
    storeMock.dispatch.calls.reset();
    storeMock.select.calls.reset();
    fixture = TestBed.createComponent(MyPerformanceComponent);
    fixture.detectChanges();

    expect(storeMock.select.calls.count()).toBe(5);
    const functionPassToSelectCall0 = storeMock.select.calls.argsFor(0)[0];
    expect(functionPassToSelectCall0(stateMock)).toBe(stateMock.dateRanges);

    const functionPassToSelectCall1 = storeMock.select.calls.argsFor(1)[0];
    expect(functionPassToSelectCall1(stateMock)).toBe(stateMock.myPerformance);

    const functionPassToSelectCall2 = storeMock.select.calls.argsFor(2)[0];
    expect(functionPassToSelectCall2(stateMock)).toBe(stateMock.myPerformanceFilter);

    const functionPassToSelectCall3 = storeMock.select.calls.argsFor(3)[0];
    expect(functionPassToSelectCall3(stateMock)).toBe(stateMock.myPerformance.current);

    const functionPassToSelectCall7 = storeMock.select.calls.argsFor(4)[0];
    expect(functionPassToSelectCall7(stateMock)).toBe(stateMock.myPerformance.versions);

    fixture.detectChanges();
    const myPerformanceFilterMock = fixture.debugElement.query(By.directive(MyPerformanceFilterComponentMock))
    .injector
    .get(MyPerformanceFilterComponentMock) as MyPerformanceFilterComponentMock;
    expect(myPerformanceFilterMock.filterState).toEqual(stateMock.myPerformanceFilter as any);
    expect(myPerformanceFilterMock.dateRanges).toBe(stateMock.dateRanges as any);
  });

  describe('handleBreadcrumbEntityClicked', () => {
    it('should dispatch RestoreMyPerformanceStateAction when steps back are possible', () => {
      const breadcrumbLength = chance.natural({min: 4, max: 9});
      const entityIndex = chance.natural({max: breadcrumbLength - 2});
      const breadcrumbMock = Array(breadcrumbLength)
                             .fill('')
                             .map(element => chance.string());
      const entityMock = breadcrumbMock[entityIndex];
      const indexOffset = 1;

      storeMock.dispatch.calls.reset();
      storeMock.select.calls.reset();

      componentInstance.handleBreadcrumbEntityClicked({
        trail: breadcrumbMock,
        entity: entityMock
      });

      const actionDispatched = storeMock.dispatch.calls.argsFor(0)[0];

      expect(actionDispatched.type).toBe(MyPerformanceVersionActions.RESTORE_MY_PERFORMANCE_STATE_ACTION);
      expect(actionDispatched.payload).toBe(breadcrumbLength - entityIndex - indexOffset);
    });

    it('should not dispatch RestoreMyPerformanceStateAction when steps back are not possible', () => {
      const breadcrumbLength = chance.natural({max: 9});
      const entityIndex = breadcrumbLength - 1;
      const breadcrumbMock = Array(breadcrumbLength)
                             .fill('')
                             .map(element => chance.string());
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
