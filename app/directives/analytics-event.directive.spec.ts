import * as Chance from 'chance';
import { Component } from '@angular/core';
import { fakeAsync, TestBed } from '@angular/core/testing';

import { AnalyticsEventDirective } from './analytics-event.directive';
import { AnalyticsService } from '../services/analytics.service';

const chance = new Chance();

class TestComponentBase {
  aCategory: string;
  aAction: string;
  aLabel: string;

  constructor() {
    this.aCategory = chance.string();
    this.aAction = chance.string();
    this.aLabel = chance.string();
  }
}

@Component({
  selector: 'test-component-a',
  template: `<a analyticsEvent="click" [category]="aCategory" [action]="aAction" [label]="aLabel"></a>`
})
class TestComponentA extends TestComponentBase {}

@Component({
  selector: 'test-component-b',
  template: `<a analyticsEvent="click" [analyticsIf]="(1===1)" [category]="aCategory" [action]="aAction" [label]="aLabel"></a>`
})
class TestComponentB extends TestComponentBase {}

@Component({
  selector: 'test-component-c',
  template: `<a analyticsEvent="click" [analyticsIf]="sendEvent" [category]="aCategory" [action]="aAction" [label]="aLabel"></a>`
})
class TestComponentC extends TestComponentBase {
  sendEvent = true;
}

@Component({
  selector: 'test-component-e',
  template: `<a analyticsEvent="click" [analyticsIf]="(1===2)" [category]="aCategory" [action]="aAction" [label]="aLabel"></a>`
})
class TestComponentD extends TestComponentBase {}

@Component({
  selector: 'test-component-f',
  template: `<a analyticsEvent="click" [analyticsIf]="sendEvent" [category]="aCategory" [action]="aAction" [label]="aLabel"></a>`
})
class TestComponentE extends TestComponentBase {
  sendEvent = false;
}

describe('analyticsEvent Directive', () => {
  let mockAnalyticsService: any;

  beforeEach(() => {
    mockAnalyticsService = {
      trackEvent: jasmine.createSpy('trackEvent')
    };

    TestBed.configureTestingModule({
      declarations: [
        AnalyticsEventDirective,
        TestComponentA,
        TestComponentB,
        TestComponentC,
        TestComponentD,
        TestComponentE,
      ],
      providers: [
        { provide: AnalyticsService, useValue: mockAnalyticsService }
      ]
    });
  });

  describe('when there is no analyticsIf condition defined', () => {
    it('should call trackEvent when clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(TestComponentA);
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

  describe('when analyticsIf condition evaluates to true', () => {
    it('should call trackEvent when clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(TestComponentB);
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

  describe('when analyticsIf condition class variable evaluates to true', () => {
    it('should call trackEvent when clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(TestComponentC);
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

  describe('when analyticsIf condition evaluates to false', () => {
    it('should call trackEvent when clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(TestComponentD);
      fixture.detectChanges();
      expect(mockAnalyticsService.trackEvent).not.toHaveBeenCalled();

      const compiled = fixture.debugElement.nativeElement.children[0];
      compiled.click();
      fixture.detectChanges();

      expect(mockAnalyticsService.trackEvent).not.toHaveBeenCalled();
    }));
  });

  describe('when analyticsIf condition class variable evaluates to false', () => {
    it('should call trackEvent when clicked', fakeAsync(() => {
      const fixture = TestBed.createComponent(TestComponentE);
      fixture.detectChanges();
      expect(mockAnalyticsService.trackEvent).not.toHaveBeenCalled();

      const compiled = fixture.debugElement.nativeElement.children[0];
      compiled.click();
      fixture.detectChanges();

      expect(mockAnalyticsService.trackEvent).not.toHaveBeenCalled();
    }));
  });
});
