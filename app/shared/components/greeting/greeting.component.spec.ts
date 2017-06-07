import { inject, TestBed } from '@angular/core/testing';
import { GreetingComponent } from './greeting.component';
import * as Chance from 'chance';
import * as moment from 'moment';

const chance = new Chance();

describe('GreetingComponent', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ GreetingComponent ]
  }));

  it('should salutate the user with "Good morning" during morning hours',
    inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomMorningHour = chance.integer({min: 0, max: 11});
      jasmine.clock().mockDate(moment().hour(randomMorningHour).toDate());
      component.ngOnInit();
      expect(component.salutation).toBe('Good morning');
    })
  );

  it('should NOT salutate the user with "Good morning" during non-morning hours',
    inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomNonMorningHour = chance.integer({min: 12, max: 23});
      jasmine.clock().mockDate(moment().hour(randomNonMorningHour).toDate());
      component.ngOnInit();
      expect(component.salutation).not.toBe('Good morning');
    })
  );

  it('should salutate the user with "Good afternoon" during afternoon hours',
    inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomAfternoonHour = chance.integer({min: 12, max: 16});
      jasmine.clock().mockDate(moment().hour(randomAfternoonHour).toDate());
      component.ngOnInit();
      expect(component.salutation).toBe('Good afternoon');
    })
  );

  it('should NOT salutate the user with "Good afternoon" during non-afternoon hours',
    inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomNonAfternoonHour = Math.random() > 0.5
          ? chance.integer({min: 0, max: 11})
          : chance.integer({min: 17, max: 23});

      jasmine.clock().mockDate(moment().hour(randomNonAfternoonHour).toDate());
      component.ngOnInit();
      expect(component.salutation).not.toBe('Good afternoon');
    })
  );

  it('should salutate the user with "Good evening" during evening hours',
    inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomEveningHour = chance.integer({min: 17, max: 23});
      jasmine.clock().mockDate(moment().hour(randomEveningHour).toDate());
      component.ngOnInit();
      expect(component.salutation).toBe('Good evening');
    })
  );

  it('should NOT salutate the user with "Good evening" during non-evening hours',
    inject([ GreetingComponent ], (component: GreetingComponent) => {
      const randomNonEveningHour = chance.integer({min: 0, max: 16});
      jasmine.clock().mockDate(moment().hour(randomNonEveningHour).toDate());
      component.ngOnInit();
      expect(component.salutation).not.toBe('Good evening');
    })
  );
});
