import { inject, TestBed } from '@angular/core/testing';
import { GreetingComponent } from './greeting.component';
import * as moment from 'moment';

describe('GreetingComponent', () => {

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ GreetingComponent ]
  }));

  describe('ngOnInit', () => {

    beforeEach(inject([ GreetingComponent ], (component: GreetingComponent) => {
      component.ngOnInit();
    }));

    it('morning', inject([ GreetingComponent ], (component: GreetingComponent) => {
      expect(component.salutation).toBe('Good morning');
    }));
  });
});
