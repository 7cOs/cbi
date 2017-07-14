import { Component, EventEmitter, Input, Output } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import * as Chance from 'chance';

import { MyPerformanceFilterComponent } from './my-performance-filter.component';

@Component({
  selector: 'compass-radio',
  template: ''
})
class MockCompassRadioComponent {
  @Output() onRadioClicked = new EventEmitter<any>();

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
  @Output() onOptionSelected = new EventEmitter<any>();

  @Input() displayKey: string;
  @Input() model: string;
  @Input() options: Array<any>;
  @Input() subDisplayKey?: string;
  @Input() valueKey: string;
}

const chance = new Chance();
const dateRangesMock = {
  L90: {
    code: chance.string(),
    displayCode: chance.string(),
    description: chance.sentence(),
    range: chance.string()
  }
};
const stateMock = {
  metric: 'DISTRIBUTION',
  timePeriod: 'L90BDL',
  premiseTypeRadio: 'OFF-PREMISE',
  distributionRadio: 'SIMPLE'
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

  describe('component init', () => {
    it('it should pass input data to its child components', fakeAsync(() => {
      componentInstance.filterState = stateMock;
      componentInstance.dateRanges = dateRangesMock;
      tick();

      const mockSelectComponents = fixture.debugElement.queryAll(By.directive(MockCompassSelectComponent));

      const metricCompassSelect = mockSelectComponents[0].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;
      // const timePeriodCompassSelect = mockSelectComponents[1].injector.get(MockCompassSelectComponent) as MockCompassSelectComponent;

      fixture.detectChanges();

      expect(metricCompassSelect.model).toEqual('DISTRIBUTION');
      // expect(timePeriodCompassSelect.model).toEqual('L90BDL');

      // console.log('\n\n\nmetricCompassSelect', metricCompassSelect);

      // const mockRadioComponents = fixture.debugElement.queryAll(By.directive(MockCompassRadioComponent));
      // const premiseTypeRadio = mockRadioComponents[0].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;
      // const distributionTypeRadio = mockRadioComponents[1].injector.get(MockCompassRadioComponent) as MockCompassRadioComponent;

      // expect(premiseTypeRadio.model).toEqual('OFF-PREMISE');
      // expect(distributionTypeRadio.model).toEqual('SIMPLE');
    }));
  });
});
