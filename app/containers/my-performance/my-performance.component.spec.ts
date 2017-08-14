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
import { MetricValue } from '../../enums/metric-type.enum';
import { MockStore } from '../../state/mock-store';
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
class MockMyPerformanceFilterComponent {
  @Output() onFilterChange = new EventEmitter<MyPerformanceFilterEvent>();

  @Input() dateRanges: DateRangesState;
  @Input() filterState: MyPerformanceFilterState;
}

@Component({
  selector: 'my-performance-table',
  template: ''
})
class MockMyPerformanceTableComponent {
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
  let store: any = new MockStore(initialState);

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockMyPerformanceFilterComponent,
        MockMyPerformanceTableComponent,
        MyPerformanceComponent,
        MyPerformanceTableRowComponent,
        SortIndicatorComponent
      ],
      providers: [
        MyPerformanceTableDataTransformerService,
        {
          provide: Store,
          useValue: store
        },
        UtilService
      ]
    });

    fixture = TestBed.createComponent(MyPerformanceComponent);
    componentInstance = fixture.componentInstance;
    store = fixture.debugElement.injector.get(Store);
  });

  it('should dispatch actions on init', () => {
    spyOn(store, 'dispatch');
    componentInstance.ngOnInit();
    expect(store.dispatch.calls.count()).toBe(2);
    expect(store.dispatch.calls.argsFor(0)).toEqual([new FetchResponsibilitiesAction(1)]);

    // this will change once right table is built
    expect(store.dispatch.calls.argsFor(1)).toEqual([new SetRightMyPerformanceTableViewType(ViewType.brands)]);
  });

  it('should trigger appropriate actions when the filter component emits an event', () => {
    spyOn(store, 'dispatch');
    const mockMyPerformanceFilter = fixture.debugElement.query(By.directive(MockMyPerformanceFilterComponent));
    const mockFilterElement = mockMyPerformanceFilter
    .injector
    .get(MockMyPerformanceFilterComponent) as MockMyPerformanceFilterComponent;

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

    expect(store.dispatch.calls.count()).toBe(4);
    expect(store.dispatch.calls.argsFor(0)).toEqual([{
      payload: MetricValue.DEPLETIONS,
      type: '[My Performance Filter] SET_METRIC'
    }]);
    expect(store.dispatch.calls.argsFor(1)).toEqual([{
      payload: DateRangeTimePeriodValue.L90BDL,
      type: '[My Performance Filter] SET_TIME_PERIOD'
    }]);
    expect(store.dispatch.calls.argsFor(2)).toEqual([{
      payload: PremiseTypeValue.OFF,
      type: '[My Performance Filter] SET_PREMISE_TYPE'
    }]);
    expect(store.dispatch.calls.argsFor(3)).toEqual([{
      payload: DistributionTypeValue.SIMPLE,
      type: '[My Performance Filter] SET_DISTRIBUTION_TYPE'
    }]);
  });

  it('should trigger appropriate actions when receiving events from elements clicked', () => {
    spyOn(store, 'dispatch');

    componentInstance.showLeftBackButton = false;
    componentInstance.handleElementClicked(true, RowType.total, 0);
    expect(store.dispatch.calls.count()).toEqual(0);

    componentInstance.showLeftBackButton = true;
    componentInstance.handleElementClicked(true, RowType.total, 0);
    expect(store.dispatch.calls.count()).toEqual(1);

    componentInstance.showLeftBackButton = false;
    componentInstance.handleElementClicked(true, RowType.data, 0);
    expect(store.dispatch.calls.count()).toEqual(2);

    componentInstance.showLeftBackButton = true;
    componentInstance.handleElementClicked(true, RowType.data, 0);
    expect(store.dispatch.calls.count()).toEqual(3);
  });

  it('should call select with the right arguments', () => {
    const mockState = {
        myPerformanceFilter: chance.string(),
        dateRanges: chance.string()
    };

    spyOn(store, 'select').and.callFake((elem: any) => {
      const selectFunction = elem as ((state: any) => any);
      return Observable.of(selectFunction(mockState));
    });
    fixture = TestBed.createComponent(MyPerformanceComponent);

    expect(store.select.calls.count()).toBe(4);
    const functionPassToSelectCall1 = store.select.calls.argsFor(0)[0];
    expect(functionPassToSelectCall1(mockState)).toBe(mockState.myPerformanceFilter);

    const functionPassToSelectCall2 = store.select.calls.argsFor(1)[0];
    expect(functionPassToSelectCall2(mockState)).toBe(mockState.dateRanges);

    fixture.detectChanges();
    const mockMyPerformanceFilter = fixture.debugElement.query(By.directive(MockMyPerformanceFilterComponent))
    .injector
    .get(MockMyPerformanceFilterComponent) as MockMyPerformanceFilterComponent;
    expect(mockMyPerformanceFilter.filterState).toEqual(mockState.myPerformanceFilter as any);
    expect(mockMyPerformanceFilter.dateRanges).toBe(mockState.dateRanges as any);
  });
});
