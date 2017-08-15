import { By } from '@angular/platform-browser';
import * as Chance from 'chance';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { DateRange } from '../../models/date-range.model';
import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { FetchResponsibilitiesAction } from '../../state/actions/responsibilities.action';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { MetricValue } from '../../enums/metric-type.enum';
import { MyPerformanceComponent } from './my-performance.component';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent } from '../../models/my-performance-filter.model'; // tslint:disable-line:no-unused-variable
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { MyPerformanceTableRowComponent } from '../../shared/components/my-performance-table-row/my-performance-table-row.component';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { RowType } from '../../enums/row-type.enum';
import { SetRightMyPerformanceTableViewType } from '../../state/actions/view-types.action';
import { SortIndicatorComponent } from '../../shared/components/sort-indicator/sort-indicator.component';
import { SortingCriteria } from '../../models/sorting-criteria.model';
import { UtilService } from '../../services/util.service';
import { initialState } from '../../state/reducers/my-performance.reducer';
import { ViewType } from '../../enums/view-type.enum';

let chance = new Chance();

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
  selector: 'my-performance-table',
  template: ''
})
class MyPerformanceTableComponentMock {
  @Output() onElementClicked = new EventEmitter<{type: RowType, index: number, row?: MyPerformanceTableRow}>();
  @Output() onSortingCriteriaChanged = new EventEmitter<Array<SortingCriteria>>();

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

  const stateMock = {
      myPerformanceFilter: chance.string(),
      dateRanges: chance.string(),
      myPerformance: initialState
  };

  const storeMock = {
    select: jasmine.createSpy('select.myPerformance').and.callFake((selectFunction: (state: any) => any) => {
      return Observable.of(selectFunction(stateMock));
    }),
    dispatch: jasmine.createSpy('dispatch')
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
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
        UtilService
      ]
    });

    fixture = TestBed.createComponent(MyPerformanceComponent);
    componentInstance = fixture.componentInstance;
  });

  it('should dispatch actions on init', () => {
    storeMock.dispatch.and.callThrough();
    storeMock.dispatch.calls.reset();

    componentInstance.ngOnInit();
    expect(storeMock.dispatch.calls.count()).toBe(2);
    expect(storeMock.dispatch.calls.argsFor(0)).toEqual([new FetchResponsibilitiesAction(1)]);

    // this will change once right table is built
    expect(storeMock.dispatch.calls.argsFor(1)).toEqual([new SetRightMyPerformanceTableViewType(ViewType.brands)]);
  });

  it('should trigger appropriate actions when the filter component emits an event', () => {
    storeMock.dispatch.and.callThrough();
    storeMock.dispatch.calls.reset();

    const mockMyPerformanceFilter = fixture.debugElement.query(By.directive(MyPerformanceFilterComponentMock));
    const mockFilterElement = mockMyPerformanceFilter
    .injector
    .get(MyPerformanceFilterComponentMock) as MyPerformanceFilterComponentMock;

    mockFilterElement.onFilterChange.emit({
      filterType: MyPerformanceFilterActionType.Metric,
      filterValue: MetricValue.DEPLETIONS
    });
    mockFilterElement.onFilterChange.emit({
      filterType: MyPerformanceFilterActionType.TimePeriod,
      filterValue: DateRangeTimePeriodValue.L90BDL
    });
    mockFilterElement.onFilterChange.emit({
      filterType: MyPerformanceFilterActionType.PremiseType,
      filterValue: PremiseTypeValue.OFF
    });
    mockFilterElement.onFilterChange.emit({
      filterType: MyPerformanceFilterActionType.DistributionType,
      filterValue: DistributionTypeValue.SIMPLE
    });

    expect(storeMock.dispatch.calls.count()).toBe(4);
    expect(storeMock.dispatch.calls.argsFor(0)).toEqual([{
      payload: MetricValue.DEPLETIONS,
      type: '[My Performance Filter] SET_METRIC'
    }]);
    expect(storeMock.dispatch.calls.argsFor(1)).toEqual([{
      payload: DateRangeTimePeriodValue.L90BDL,
      type: '[My Performance Filter] SET_TIME_PERIOD'
    }]);
    expect(storeMock.dispatch.calls.argsFor(2)).toEqual([{
      payload: PremiseTypeValue.OFF,
      type: '[My Performance Filter] SET_PREMISE_TYPE'
    }]);
    expect(storeMock.dispatch.calls.argsFor(3)).toEqual([{
      payload: DistributionTypeValue.SIMPLE,
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
    expect(storeMock.dispatch.calls.count()).toEqual(1);

    storeMock.dispatch.calls.reset();
    componentInstance.handleElementClicked({leftSide: false, type: RowType.data, index: 0});
    expect(storeMock.dispatch.calls.count()).toEqual(0);
  });

  it('should call select with the right arguments', () => {
    storeMock.dispatch.calls.reset();
    storeMock.select.calls.reset();
    fixture = TestBed.createComponent(MyPerformanceComponent);

    expect(storeMock.select.calls.count()).toBe(6);
    const functionPassToSelectCall1 = storeMock.select.calls.argsFor(0)[0];
    expect(functionPassToSelectCall1(stateMock)).toBe(stateMock.myPerformanceFilter);

    const functionPassToSelectCall2 = storeMock.select.calls.argsFor(1)[0];
    expect(functionPassToSelectCall2(stateMock)).toBe(stateMock.dateRanges);

    fixture.detectChanges();
    const mockMyPerformanceFilter = fixture.debugElement.query(By.directive(MyPerformanceFilterComponentMock))
    .injector
    .get(MyPerformanceFilterComponentMock) as MyPerformanceFilterComponentMock;
    expect(mockMyPerformanceFilter.filterState).toEqual(stateMock.myPerformanceFilter as any);
    expect(mockMyPerformanceFilter.dateRanges).toBe(stateMock.dateRanges as any);
  });
});
