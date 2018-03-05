import { inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { DateRange } from '../models/date-range.model';
import { DateRangeService } from './date-range.service';
import { dateRangeStateMock } from '../models/date-range-state.model.mock';
import { DateRangeTimePeriod } from '../enums/date-range-time-period.enum';
import { getDateRangeMock } from '../models/date-range.model.mock';

describe('Service: DateRangeService', () => {
  const dateRangeMock: DateRange = getDateRangeMock();

  const storeMock = {
    select: jasmine.createSpy('select').and.returnValue(Observable.of(dateRangeStateMock))
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DateRangeService,
      {
        provide: Store,
        useValue: storeMock
      }
    ]
  }));

  describe('getDateRange', () => {
    let dateRangeService: DateRangeService;
    let store: any;
    beforeEach(inject([ DateRangeService, Store ],
      (_dateRangeService: DateRangeService, _store: any) => {
        dateRangeService = _dateRangeService;
        store = _store;
    }));

    it('should return an observable of a date range from the store', (done) => {
      spyOn(dateRangeService, 'getDateRanges').and.callThrough();
      let result = dateRangeService.getDateRanges();
      expect(dateRangeService.getDateRanges).toHaveBeenCalled();
      expect(store.select).toHaveBeenCalled();
      expect(result).toEqual(Observable.of(dateRangeStateMock));
      done();
    });
  });
});
