import { inject, TestBed } from '@angular/core/testing';

import { DateRangeTransformerService } from './date-range-transformer.service';
import { dateRangeCollectionMock } from '../models/date-range-collection.mock.model';
import { mockDateRangeDTOs } from '../models/date-range-dto-collection.mock.model';

describe('Service: DateRangeTransformerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DateRangeTransformerService
    ]
  }));

  describe('transformDateRanges', () => {
    let dateRangeTransformerService: DateRangeTransformerService;
    let store: any;
    beforeEach(inject([ DateRangeTransformerService ],
      (_dateRangeTransformerService: DateRangeTransformerService, _store: any) => {
        dateRangeTransformerService = _dateRangeTransformerService;
        store = _store;
    }));

    it('should return a collection of formatted DateRanges from a collection of DateRangeDTOs', (done) => {
      spyOn(dateRangeTransformerService, 'transformDateRanges').and.callThrough();
      const transformedDateRanges = dateRangeTransformerService.transformDateRanges(mockDateRangeDTOs);
      expect(transformedDateRanges).toEqual(dateRangeCollectionMock);
      done();
    });
  });
});
