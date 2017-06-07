import { inject, TestBed } from '@angular/core/testing';
import { GreetingComponent } from './greeting.component';
import * as Chance from 'chance';
import * as moment from 'moment';

const chance = new Chance();

describe('GreetingComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ GreetingComponent ]
  }));

  describe('morning greeting', () => {
    beforeEach(inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomMorningHour = chance.integer({min: 0, max: 11});
      jasmine.clock().mockDate(moment().hour(randomMorningHour).toDate());
      component.ngOnInit();
    }));

    it('should salutate the user with "Good morning"', inject([ GreetingComponent ], (component: GreetingComponent) => {
      expect(component.salutation).toBe('Good morning');
    }));
  });

  describe('morning greeting inverse', () => {
    beforeEach(inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomNonMorningHour = chance.integer({min: 12, max: 23});
      jasmine.clock().mockDate(moment().hour(randomNonMorningHour).toDate());
      component.ngOnInit();
    }));

    it('should NOT salutate the user with "Good morning"', inject([ GreetingComponent ], (component: GreetingComponent) => {
      expect(component.salutation).not.toBe('Good morning');
    }));
  });

  describe('afternoon greeting', () => {
    beforeEach(inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomAfternoonHour = chance.integer({min: 12, max: 16});
      jasmine.clock().mockDate(moment().hour(randomAfternoonHour).toDate());
      component.ngOnInit();
    }));

    it('should salutate the user with "Good afternoon"', inject([ GreetingComponent ], (component: GreetingComponent) => {
      expect(component.salutation).toBe('Good afternoon');
    }));
  });

  describe('afternoon greeting inverse', () => {
    beforeEach(inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomNonAfternoonHour = Math.random() > 0.5
        ? chance.integer({min: 0, max: 11})
        : chance.integer({min: 17, max: 23});

      jasmine.clock().mockDate(moment().hour(randomNonAfternoonHour).toDate());
      component.ngOnInit();
    }));

    it('should NOT salutate the user with "Good afternoon"', inject([ GreetingComponent ], (component: GreetingComponent) => {
      expect(component.salutation).not.toBe('Good afternoon');
    }));
  });

  describe('evening greeting', () => {
    beforeEach(inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomEveningHour = chance.integer({min: 17, max: 23});
      jasmine.clock().mockDate(moment().hour(randomEveningHour).toDate());
      component.ngOnInit();
    }));

    it('should salutate the user with "Good evening"', inject([ GreetingComponent ], (component: GreetingComponent) => {
      expect(component.salutation).toBe('Good evening');
    }));
  });

  describe('evening greeting inverse', () => {
    beforeEach(inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomNonEveningHour = chance.integer({min: 0, max: 16});
      jasmine.clock().mockDate(moment().hour(randomNonEveningHour).toDate());
      component.ngOnInit();
    }));

    it('should NOT salutate the user with "Good evening"', inject([ GreetingComponent ], (component: GreetingComponent) => {
      expect(component.salutation).not.toBe('Good evening');
    }));
  });
});
