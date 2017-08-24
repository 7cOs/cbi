import * as Chance from 'chance';
import { Component } from '@angular/core';
import { fakeAsync, TestBed } from '@angular/core/testing';

import { AnalyticsEventDirective } from './analytics-event.directive';
import { AnalyticsService } from '../services/analytics.service';

const chance = new Chance();
const mockAnalyticsService = {
  trackEvent: jasmine.createSpy('trackEvent')
};

@Component({
  selector: 'test-component',
  template: `<a analyticsEvent="click" [category]="aCategory" [action]="aAction" [label]="aLabel"></a>`
})
class TestComponent {
  aCategory: string;
  aAction: string;
  aLabel: string;

  constructor() {
    this.aCategory = chance.string();
    this.aAction = chance.string();
    this.aLabel = chance.string();
  }
}

describe('analyticsEvent Directive', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AnalyticsEventDirective,
        TestComponent
      ],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService }
      ]
    });
  });

  it('should call trackEvent when clicked', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestComponent);
    const componentInstance = fixture.componentInstance;
    fixture.detectChanges();
    expect(mockAnalyticsService.trackEvent).not.toHaveBeenCalled();

    const compiled = fixture.debugElement.nativeElement.children[0];
    compiled.click();
    fixture.detectChanges();

    expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith(
      componentInstance.aCategory,
      componentInstance.aAction,
      componentInstance.aLabel
    );
  }));
});
