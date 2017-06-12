import { inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { DateRange } from '../models/date-range.model';
import { dateRangeMock } from '../models/date-range.model.mock';
import { DateRangeService } from './date-range.service';

describe('Service: DateRangeService', () => {
  const mockDateRange: DateRange = dateRangeMock();
  const mockStore = {
    select: jasmine.createSpy('select').and.returnValue(Observable.of(mockDateRange))
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DateRangeService,
      {
        provide: Store,
        useValue: mockStore
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

    it('should return a date range from the store', (done) => {
      spyOn(dateRangeService, 'getDateRange').and.callThrough();
      dateRangeService.getDateRange('MTD');
      expect(store.select).toHaveBeenCalled();
      done();
    });
  });
});
