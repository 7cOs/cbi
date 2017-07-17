import { Component, Input, Output } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { MyPerformanceComponent } from './my-performance.component';

const mockFilterState = {
  metric: 'DEPLETIONS',
  timePeriod: 'CYTDBDL',
  premiseType: 'ALL',
  distributionType: 'SIMPLE'
};

const mockStore = {
  select: jasmine.createSpy('select').and.returnValue(Observable.of(mockFilterState))
};

@Component({
  selector: 'my-performance-filter',
  template: ''
})
class MockMyPerformanceFilterComponent {
  @Output() onFilterChange: any;
  @Input() dateRanges: any;
  @Input() filterState: any;
}

describe('My Performance Component', () => {
  let fixture: ComponentFixture<MyPerformanceComponent>;
  let componentInstance: MyPerformanceComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MockMyPerformanceFilterComponent, MyPerformanceComponent ],
      providers: [{
        provide: Store,
        useValue: mockStore
      }]
    });

    fixture = TestBed.createComponent(MyPerformanceComponent);
    componentInstance = fixture.componentInstance;
  });

  describe('component init', () => {
    let store: any;

    beforeEach(inject([ Store ], (_store: any) => {
      store = _store;
    }));

    it('should query the store for my performance filter state', () => {
      fixture.detectChanges();
      expect(store.select).toHaveBeenCalled();
    });
  });
});
