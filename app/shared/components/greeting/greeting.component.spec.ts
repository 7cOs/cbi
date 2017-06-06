import { inject, TestBed } from '@angular/core/testing';
import { GreetingComponent } from './greeting.component';
import * as Chance from 'chance';

const chance = new Chance();

describe('GreetingComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ GreetingComponent ]
  }));

  describe('morning greeting', () => {
    beforeEach(inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomMorningHour = chance.integer({min: 0, max: 11});
      const newDate = new Date(2020, 1, 1, randomMorningHour);
      jasmine.clock().mockDate(newDate);
      component.ngOnInit();
    }));

    it('should salutate the user with "Good morning"', inject([ GreetingComponent ], (component: GreetingComponent) => {
      expect(component.salutation).toBe('Good morning');
    }));
  });

  describe('afternoon greeting', () => {
    beforeEach(inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomAfternoonHour = chance.integer({min: 12, max: 16});
      const newDate = new Date(2020, 1, 1, randomAfternoonHour);
      jasmine.clock().mockDate(newDate);
      component.ngOnInit();
    }));

    it('should salutate the user with "Good afternoon"', inject([ GreetingComponent ], (component: GreetingComponent) => {
      expect(component.salutation).toBe('Good afternoon');
    }));
  });

  describe('evening greeting', () => {
    beforeEach(inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomEveningHour = chance.integer({min: 17, max: 23});
      const newDate = new Date(2020, 1, 1, randomEveningHour);
      jasmine.clock().mockDate(newDate);
      component.ngOnInit();
    }));

    it('should salutate the user with "Good evening"', inject([ GreetingComponent ], (component: GreetingComponent) => {
      expect(component.salutation).toBe('Good evening');
    }));
  });
});
