import { Component, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { dateRangeStateMock } from '../../../models/date-range-state.model.mock';
import { MyPerformanceFilterComponent } from './my-performance-filter.component';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';

import { DateRangeTimePeriodValue } from '../../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../../enums/distribution-type.enum';
import { MetricValue } from '../../../enums/metric-type.enum';
import { PremiseTypeValue } from '../../../enums/premise-type.enum';

@Component({
  selector: 'compass-radio',
  template: ''
})
class MockCompassRadioComponent {
  @Output() onRadioClicked = new EventEmitter<number>();

  @Input() displayKey: string;
  @Input() direction: string;
  @Input() model: any;
  @Input() options: Array<any>;
  @Input() valueKey: string;
}

@Component({
  selector: 'compass-select',
  template: ''
})
class MockCompassSelectComponent {
  @Output() onOptionSelected = new EventEmitter<number>();

  @Input() displayKey: string;
  @Input() model: any;
  @Input() options: Array<any>;
  @Input() subDisplayKey?: string;
  @Input() valueKey: string;
}

const initialStateMock: MyPerformanceFilterState = {
  metric: MetricValue.DEPLETIONS,
  timePeriod: DateRangeTimePeriodValue.CYTDBDL,
  premiseType: PremiseTypeValue.ALL,
  distributionType: DistributionTypeValue.SIMPLE
};
const updatedStateMock: MyPerformanceFilterState = {
  metric: MetricValue.DISTRIBUTION,
  timePeriod: DateRangeTimePeriodValue.L90BDL,
  premiseType: PremiseTypeValue.OFF,
  distributionType: DistributionTypeValue.SIMPLE
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

      expect(metricCompassSelect.model).toEqual(MetricValue.DEPLETIONS);
      expect(timePeriodCompassSelect.model).toEqual(DateRangeTimePeriodValue.CYTDBDL);
      expect(premiseTypeRadio.model).toEqual(PremiseTypeValue.ALL);

      componentInstance.filterState = updatedStateMock;
      fixture.detectChanges();

      mockSelectComponents = fixture.debugElement.queryAll(By.directive(MockCompassSelectComponent));
      metricCompassSelect = mockSelectComponents[0].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;
      timePeriodCompassSelect = mockSelectComponents[1].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;

      mockRadioComponents = fixture.debugElement.queryAll(By.directive(MockCompassRadioComponent));
      premiseTypeRadio = mockRadioComponents[0].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;
      const distributionTypeRadio = mockRadioComponents[1].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;

      expect(metricCompassSelect.model).toEqual(MetricValue.DISTRIBUTION);
      expect(timePeriodCompassSelect.model).toEqual(DateRangeTimePeriodValue.L90BDL);
      expect(premiseTypeRadio.model).toEqual(PremiseTypeValue.OFF);
      expect(distributionTypeRadio.model).toEqual(DistributionTypeValue.SIMPLE);
    });
  });

  describe('component output', () => {
    it('should emit value outputed by metric child component select dropdown', () => {
      componentInstance.filterState = initialStateMock;
      componentInstance.dateRanges = dateRangeStateMock;

      componentInstance.onFilterChange.subscribe((value: { filterType: string, filterValue: MetricValue }) => {
        expect(value).toEqual({ filterType: 'metric', filterValue: MetricValue.DEPLETIONS });
      });

      const mockSelectComponents = fixture.debugElement.queryAll(By.directive(MockCompassSelectComponent));
      const metricCompassSelect = mockSelectComponents[0].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;

      metricCompassSelect.onOptionSelected.emit(MetricValue.DEPLETIONS);
    });

    it('should emit value outputed by time period select dropdown child component', () => {
      componentInstance.filterState = initialStateMock;
      componentInstance.dateRanges = dateRangeStateMock;
      fixture.detectChanges();

      componentInstance.onFilterChange.subscribe((value: { filterType: string, filterValue: DateRangeTimePeriodValue }) => {
        expect(value).toEqual({ filterType: 'timePeriod', filterValue: DateRangeTimePeriodValue.CYTDBDL });
      });

      const mockSelectComponents = fixture.debugElement.queryAll(By.directive(MockCompassSelectComponent));
      const timePeriodSelect = mockSelectComponents[1].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;

      timePeriodSelect.onOptionSelected.emit(DateRangeTimePeriodValue.CYTDBDL);
    });

    it('should emit value outputed by premise type child component radio button', () => {
      componentInstance.filterState = initialStateMock;
      componentInstance.dateRanges = dateRangeStateMock;
      fixture.detectChanges();

      componentInstance.onFilterChange.subscribe((value: { filterType: string, filterValue: PremiseTypeValue }) => {
        expect(value).toEqual({ filterType: 'premiseType', filterValue: PremiseTypeValue.OFF });
      });

      const mockRadioComponents = fixture.debugElement.queryAll(By.directive(MockCompassRadioComponent));
      const premiseTypeRadio = mockRadioComponents[0].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;

      premiseTypeRadio.onRadioClicked.emit(PremiseTypeValue.OFF);
    });

    it('should emit value outputed by distribution type child component radio button', () => {
      componentInstance.filterState = updatedStateMock;
      componentInstance.dateRanges = dateRangeStateMock;
      fixture.detectChanges();

      componentInstance.onFilterChange.subscribe((value: { filterType: string, filterValue: DistributionTypeValue }) => {
        expect(value).toEqual({ filterType: 'distributionType', filterValue: DistributionTypeValue.SIMPLE });
      });

      const mockRadioComponents = fixture.debugElement.queryAll(By.directive(MockCompassRadioComponent));
      const distributionTypeRadio = mockRadioComponents[1].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;

      distributionTypeRadio.onRadioClicked.emit(DistributionTypeValue.SIMPLE);
    });
  });
});
