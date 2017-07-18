import { Component, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';

import { MockStore } from '../../state/mock-store';
import { MyPerformanceComponent } from './my-performance.component';

@Component({
  selector: 'my-performance-filter',
  template: ''
})
class MockMyPerformanceFilterComponent {
  @Output() onFilterChange = new EventEmitter<any>();

  @Input() dateRanges: any;
  @Input() filterState: any;
}

describe('MyPerformanceComponent', () => {
  let fixture: ComponentFixture<MyPerformanceComponent>;
  let store: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MockMyPerformanceFilterComponent, MyPerformanceComponent ],
      providers: [{
        provide: Store,
        useValue: new MockStore({})
      }]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyPerformanceComponent);
    store = fixture.debugElement.injector.get(Store);
  });

  it('should trigger appropriate actions when the filter component emits an event', () => {
    spyOn(store, 'dispatch');

    const mockMyPerformanceFilter = fixture.debugElement.query(By.directive(MockMyPerformanceFilterComponent));
    const mockFilterElement = mockMyPerformanceFilter.injector.get(MockMyPerformanceFilterComponent) as MockMyPerformanceFilterComponent;

    mockFilterElement.onFilterChange.emit({ filterType: 'metric', filterValue: 'DEPLETIONS' });
    mockFilterElement.onFilterChange.emit({ filterType: 'timePeriod', filterValue: 'L90BDL' });
    mockFilterElement.onFilterChange.emit({ filterType: 'premiseType', filterValue: 'OFF-PREMISE' });
    mockFilterElement.onFilterChange.emit({ filterType: 'distributionType', filterValue: 'SIMPLE' });

    expect(store.dispatch.calls.count()).toEqual(4);
    expect(store.dispatch.calls.argsFor(0)).toEqual([{ payload: 'DEPLETIONS', type: '[My Performance Filter] SET_METRIC' }]);
    expect(store.dispatch.calls.argsFor(1)).toEqual([{ payload: 'L90BDL', type: '[My Performance Filter] SET_TIME_PERIOD' }]);
    expect(store.dispatch.calls.argsFor(2)).toEqual([{ payload: 'OFF-PREMISE', type: '[My Performance Filter] SET_PREMISE_TYPE' }]);
    expect(store.dispatch.calls.argsFor(3)).toEqual([{ payload: 'SIMPLE', type: '[My Performance Filter] SET_DISTRIBUTION_TYPE' }]);
  });
});
