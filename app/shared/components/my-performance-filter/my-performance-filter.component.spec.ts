import { Component, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { dateRangeStateMock } from '../../../models/date-range-state.model.mock';
import { MyPerformanceFilterComponent } from './my-performance-filter.component';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';

@Component({
  selector: 'compass-radio',
  template: ''
})
class MockCompassRadioComponent {
  @Output() onRadioClicked = new EventEmitter<string>();

  @Input() displayKey: string;
  @Input() direction: string;
  @Input() model: string;
  @Input() options: Array<any>;
  @Input() valueKey: string;
}

@Component({
  selector: 'compass-select',
  template: ''
})
class MockCompassSelectComponent {
  @Output() onOptionSelected = new EventEmitter<string>();

  @Input() displayKey: string;
  @Input() model: string;
  @Input() options: Array<any>;
  @Input() subDisplayKey?: string;
  @Input() valueKey: string;
}

const initialStateMock: MyPerformanceFilterState = {
  metric: 'DEPLETIONS',
  timePeriod: 'CYTDBDL',
  premiseType: 'ALL',
  distributionType: 'SIMPLE'
};
const updatedStateMock: MyPerformanceFilterState = {
  metric: 'DISTRIBUTION',
  timePeriod: 'L90BDL',
  premiseType: 'OFF-PREMISE',
  distributionType: 'SIMPLE'
};

describe('My Performance Filter Component', () => {
  let fixture: ComponentFixture<MyPerformanceFilterComponent>;
  let componentInstance: MyPerformanceFilterComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ MockCompassRadioComponent, MockCompassSelectComponent, MyPerformanceFilterComponent ]
    });

    fixture = TestBed.createComponent(MyPerformanceFilterComponent);
    componentInstance = fixture.componentInstance;
  });

  describe('component input', () => {
    it('should pass input data to its child components', () => {
      componentInstance.filterState = initialStateMock;
      componentInstance.dateRanges = dateRangeStateMock;
      fixture.detectChanges();

      let mockSelectComponents = fixture.debugElement.queryAll(By.directive(MockCompassSelectComponent));
      let metricCompassSelect = mockSelectComponents[0].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;
      let timePeriodCompassSelect = mockSelectComponents[1].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;

      let mockRadioComponents = fixture.debugElement.queryAll(By.directive(MockCompassRadioComponent));
      let premiseTypeRadio = mockRadioComponents[0].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;

      expect(metricCompassSelect.model).toEqual('DEPLETIONS');
      expect(timePeriodCompassSelect.model).toEqual('CYTDBDL');
      expect(premiseTypeRadio.model).toEqual('ALL');

      componentInstance.filterState = updatedStateMock;
      fixture.detectChanges();

      mockSelectComponents = fixture.debugElement.queryAll(By.directive(MockCompassSelectComponent));
      metricCompassSelect = mockSelectComponents[0].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;
      timePeriodCompassSelect = mockSelectComponents[1].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;

      mockRadioComponents = fixture.debugElement.queryAll(By.directive(MockCompassRadioComponent));
      premiseTypeRadio = mockRadioComponents[0].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;
      const distributionTypeRadio = mockRadioComponents[1].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;

      expect(metricCompassSelect.model).toEqual('DISTRIBUTION');
      expect(timePeriodCompassSelect.model).toEqual('L90BDL');
      expect(premiseTypeRadio.model).toEqual('OFF-PREMISE');
      expect(distributionTypeRadio.model).toEqual('SIMPLE');
    });
  });

  describe('component output', () => {
    it('should emit value outputed by metric child component select dropdown', () => {
      componentInstance.filterState = initialStateMock;
      componentInstance.dateRanges = dateRangeStateMock;
      fixture.detectChanges();

      componentInstance.onFilterChange.subscribe((value: any) => {
        expect(value).toEqual({ filterType: 'metric', filterValue: 'DEPLETIONS' });
      });

      const mockSelectComponents = fixture.debugElement.queryAll(By.directive(MockCompassSelectComponent));
      const metricCompassSelect = mockSelectComponents[0].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;

      metricCompassSelect.onOptionSelected.emit('DEPLETIONS');
    });

    it('should emit value outputed by time period select dropdown child component', () => {
      componentInstance.filterState = initialStateMock;
      componentInstance.dateRanges = dateRangeStateMock;
      fixture.detectChanges();

      componentInstance.onFilterChange.subscribe((value: any) => {
        expect(value).toEqual({ filterType: 'timePeriod', filterValue: 'CYTDBDL' });
      });

      const mockSelectComponents = fixture.debugElement.queryAll(By.directive(MockCompassSelectComponent));
      const timePeriodSelect = mockSelectComponents[1].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;

      timePeriodSelect.onOptionSelected.emit('CYTDBDL');
    });

    it('should emit value outputed by premise type child component radio button', () => {
      componentInstance.filterState = initialStateMock;
      componentInstance.dateRanges = dateRangeStateMock;
      fixture.detectChanges();

      componentInstance.onFilterChange.subscribe((value: any) => {
        expect(value).toEqual({ filterType: 'premiseType', filterValue: 'OFF-PREMISE' });
      });

      const mockRadioComponents = fixture.debugElement.queryAll(By.directive(MockCompassRadioComponent));
      const premiseTypeRadio = mockRadioComponents[0].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;

      premiseTypeRadio.onRadioClicked.emit('OFF-PREMISE');
    });

    it('should emit value outputed by distribution type child component radio button', () => {
      componentInstance.filterState = updatedStateMock;
      componentInstance.dateRanges = dateRangeStateMock;
      fixture.detectChanges();

      componentInstance.onFilterChange.subscribe((value: any) => {
        expect(value).toEqual({ filterType: 'distributionType', filterValue: 'SIMPLE' });
      });

      const mockRadioComponents = fixture.debugElement.queryAll(By.directive(MockCompassRadioComponent));
      const distributionTypeRadio = mockRadioComponents[1].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;

      distributionTypeRadio.onRadioClicked.emit('SIMPLE');
    });
  });
});
