import { By } from '@angular/platform-browser';
import * as Chance from 'chance';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { DateRangesState } from '../../state/reducers/date-ranges.reducer';
import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { FetchResponsibilitiesAction } from '../../state/actions/responsibilities.action';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MockStore } from '../../state/mock-store';
import { MyPerformanceComponent } from './my-performance.component';
import { MyPerformanceFilterActionType } from '../../enums/my-performance-filter.enum';
import { MyPerformanceFilterEvent } from '../../models/my-performance-filter.model'; // tslint:disable-line:no-unused-variable
import { MyPerformanceFilterState } from '../../state/reducers/my-performance-filter.reducer';
import { MyPerformanceTableComponent } from '../../shared/components/my-performance-table/my-performance-table.component';
import { MyPerformanceTableDataTransformerService } from '../../services/my-performance-table-data-transformer.service';
import { MyPerformanceTableRowComponent } from '../../shared/components/my-performance-table-row/my-performance-table-row.component';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { SetRightMyPerformanceTableViewType } from '../../state/actions/view-types.action';
import { SortIndicatorComponent } from '../../shared/components/sort-indicator/sort-indicator.component';
import { UtilService } from '../../services/util.service';
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

describe('MyPerformanceComponent', () => {
  let fixture: ComponentFixture<MyPerformanceComponent>;
  let componentInstance: MyPerformanceComponent;
  let store: any = new MockStore({});

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        MockMyPerformanceFilterComponent,
        MyPerformanceComponent,
        MyPerformanceTableComponent,
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
    fixture.detectChanges();
  });

  it('should dispatch actions on init', () => {
    const mockState = {
      myPerformanceFilter: {
        metricType: MetricTypeValue.PointsOfDistribution,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On,
        distributionType: DistributionTypeValue.simple,
      },
      dateRanges: chance.string(),
      responsibilities: chance.string(),
      viewTypes: chance.string(),
      performanceTotal: chance.natural()
    };

    spyOn(store, 'select').and.callFake((elem: any) => {
      const selectFunction = elem as ((state: any) => any);
      return Observable.of(selectFunction(mockState));
    });
    spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(MyPerformanceComponent);
    fixture.detectChanges();

    expect(store.dispatch.calls.count()).toBe(2);
    expect(store.dispatch.calls.argsFor(0)).toEqual([new FetchResponsibilitiesAction({
      positionId: 1,
      filter: mockState.myPerformanceFilter
    })]);

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

    expect(store.dispatch.calls.count()).toBe(4);
    expect(store.dispatch.calls.argsFor(0)).toEqual([{
      payload: MetricTypeValue.volume,
      type: '[My Performance Filter] SET_METRIC'
    }]);
    expect(store.dispatch.calls.argsFor(1)).toEqual([{
      payload: DateRangeTimePeriodValue.L90BDL,
      type: '[My Performance Filter] SET_TIME_PERIOD'
    }]);
    expect(store.dispatch.calls.argsFor(2)).toEqual([{
      payload: PremiseTypeValue.Off,
      type: '[My Performance Filter] SET_PREMISE_TYPE'
    }]);
    expect(store.dispatch.calls.argsFor(3)).toEqual([{
      payload: DistributionTypeValue.simple,
      type: '[My Performance Filter] SET_DISTRIBUTION_TYPE'
    }]);
  });

  it('should call select with the right arguments', () => {
    const mockState = {
      myPerformanceFilter: 'mockPerformanceFilterState',
      dateRanges: 'mockDateRangesState',
      responsibilities: 'mockResponsibilitiesState',
      viewTypes: 'mockViewTypesState',
      performanceTotal: 'mockPerformanceTotalState'
    };

    spyOn(store, 'select').and.callFake((elem: any) => {
      const selectFunction = elem as ((state: any) => any);
      return Observable.of(selectFunction(mockState));
    });
    fixture = TestBed.createComponent(MyPerformanceComponent);
    fixture.detectChanges();

    expect(store.select.calls.count()).toBe(5);
    const functionPassToSelectCall1 = store.select.calls.argsFor(0)[0];
    expect(functionPassToSelectCall1(mockState)).toBe(mockState.dateRanges);

    const functionPassToSelectCall2 = store.select.calls.argsFor(1)[0];
    expect(functionPassToSelectCall2(mockState)).toBe(mockState.myPerformanceFilter);

    const functionPassToSelectCall3 = store.select.calls.argsFor(2)[0];
    expect(functionPassToSelectCall3(mockState)).toBe(mockState.responsibilities);

    const functionPassToSelectCall4 = store.select.calls.argsFor(3)[0];
    expect(functionPassToSelectCall4(mockState)).toBe(mockState.viewTypes);

    const functionPassToSelectCall5 = store.select.calls.argsFor(4)[0];
    expect(functionPassToSelectCall5(mockState)).toBe(mockState.performanceTotal);

    fixture.detectChanges();
    const mockMyPerformanceFilter = fixture.debugElement.query(By.directive(MockMyPerformanceFilterComponent))
    .injector
    .get(MockMyPerformanceFilterComponent) as MockMyPerformanceFilterComponent;
    expect(mockMyPerformanceFilter.filterState).toEqual(mockState.myPerformanceFilter as any);
    expect(mockMyPerformanceFilter.dateRanges).toBe(mockState.dateRanges as any);
  });
});
