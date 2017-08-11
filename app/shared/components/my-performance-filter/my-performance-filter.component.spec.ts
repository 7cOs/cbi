import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { dateRangeStateMock } from '../../../models/date-range-state.model.mock';
import { DateRangeTimePeriodValue } from '../../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../../enums/distribution-type.enum';
import { MetricValue } from '../../../enums/metric-type.enum';
import { MockCompassRadioComponent } from '../compass-radio/compass-radio.component.mock';
import { MockCompassSelectComponent } from '../compass-select/compass-select.component.mock';
import { MyPerformanceFilterActionType } from '../../../enums/my-performance-filter.enum';
import { MyPerformanceFilterComponent } from './my-performance-filter.component';
import { MyPerformanceFilterEvent } from '../../../models/my-performance-filter.model';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { PremiseTypeValue } from '../../../enums/premise-type.enum';

const initialStateMock: MyPerformanceFilterState = {
  metricType: MetricValue.volume,
  dateRangeCode: DateRangeTimePeriodValue.CYTDBDL,
  premiseType: PremiseTypeValue.All,
  distributionType: DistributionTypeValue.simple
};
const updatedStateMock: MyPerformanceFilterState = {
  metricType: MetricValue.PointsOfDistribution,
  dateRangeCode: DateRangeTimePeriodValue.L90BDL,
  premiseType: PremiseTypeValue.Off,
  distributionType: DistributionTypeValue.simple
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

      expect(metricCompassSelect.model).toEqual(MetricValue.volume);
      expect(timePeriodCompassSelect.model).toEqual(DateRangeTimePeriodValue.CYTDBDL);
      expect(premiseTypeRadio.model).toEqual(PremiseTypeValue.All);

      componentInstance.filterState = updatedStateMock;
      fixture.detectChanges();

      mockSelectComponents = fixture.debugElement.queryAll(By.directive(MockCompassSelectComponent));
      metricCompassSelect = mockSelectComponents[0].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;
      timePeriodCompassSelect = mockSelectComponents[1].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;

      mockRadioComponents = fixture.debugElement.queryAll(By.directive(MockCompassRadioComponent));
      premiseTypeRadio = mockRadioComponents[0].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;
      const distributionTypeRadio = mockRadioComponents[1].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;

      expect(metricCompassSelect.model).toEqual(MetricValue.PointsOfDistribution);
      expect(timePeriodCompassSelect.model).toEqual(DateRangeTimePeriodValue.L90BDL);
      expect(premiseTypeRadio.model).toEqual(PremiseTypeValue.Off);
      expect(distributionTypeRadio.model).toEqual(DistributionTypeValue.simple);
    });
  });

  describe('component output', () => {
    it('should emit value outputed by metric child component select dropdown', () => {
      componentInstance.filterState = initialStateMock;
      componentInstance.dateRanges = dateRangeStateMock;

      componentInstance.onFilterChange.subscribe((value: MyPerformanceFilterEvent) => {
        expect(value).toEqual({ filterType: MyPerformanceFilterActionType.Metric, filterValue: MetricValue.volume });
      });

      const mockSelectComponents = fixture.debugElement.queryAll(By.directive(MockCompassSelectComponent));
      const metricCompassSelect = mockSelectComponents[0].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;

      metricCompassSelect.onOptionSelected.emit(MetricValue.volume);
    });

    it('should emit value outputed by time period select dropdown child component', () => {
      componentInstance.filterState = initialStateMock;
      componentInstance.dateRanges = dateRangeStateMock;
      fixture.detectChanges();

      componentInstance.onFilterChange.subscribe((value: MyPerformanceFilterEvent) => {
        expect(value).toEqual({ filterType: MyPerformanceFilterActionType.TimePeriod, filterValue: DateRangeTimePeriodValue.CYTDBDL });
      });

      const mockSelectComponents = fixture.debugElement.queryAll(By.directive(MockCompassSelectComponent));
      const timePeriodSelect = mockSelectComponents[1].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;

      timePeriodSelect.onOptionSelected.emit(DateRangeTimePeriodValue.CYTDBDL);
    });

    it('should emit value outputed by premise type child component radio button', () => {
      componentInstance.filterState = initialStateMock;
      componentInstance.dateRanges = dateRangeStateMock;
      fixture.detectChanges();

      componentInstance.onFilterChange.subscribe((value: MyPerformanceFilterEvent) => {
        expect(value).toEqual({ filterType: MyPerformanceFilterActionType.PremiseType, filterValue: PremiseTypeValue.Off });
      });

      const mockRadioComponents = fixture.debugElement.queryAll(By.directive(MockCompassRadioComponent));
      const premiseTypeRadio = mockRadioComponents[0].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;

      premiseTypeRadio.onRadioClicked.emit(PremiseTypeValue.Off);
    });

    it('should emit value outputed by distribution type child component radio button', () => {
      componentInstance.filterState = updatedStateMock;
      componentInstance.dateRanges = dateRangeStateMock;
      fixture.detectChanges();

      componentInstance.onFilterChange.subscribe((value: MyPerformanceFilterEvent) => {
        expect(value).toEqual({ filterType: MyPerformanceFilterActionType.DistributionType, filterValue: DistributionTypeValue.simple });
      });

      const mockRadioComponents = fixture.debugElement.queryAll(By.directive(MockCompassRadioComponent));
      const distributionTypeRadio = mockRadioComponents[1].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;

      distributionTypeRadio.onRadioClicked.emit(DistributionTypeValue.simple);
    });
  });
});
