import { inject, TestBed } from '@angular/core/testing';

import { DateRangeTransformerService } from './date-range-transformer.service';
import { dateRangeCollectionMock } from '../models/date-range-collection.model.mock';
import { dateRangeDTOsMock } from '../models/date-range-dto-collection.model.mock';

describe('Service: DateRangeTransformerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      DateRangeTransformerService
    ]
  }));

  describe('transformDateRanges', () => {
    let dateRangeTransformerService: DateRangeTransformerService;
    beforeEach(inject([ DateRangeTransformerService ],
      (_dateRangeTransformerService: DateRangeTransformerService) => {
        dateRangeTransformerService = _dateRangeTransformerService;
    }));

    it('should return a collection of formatted DateRanges from a collection of DateRangeDTOs', () => {
      spyOn(dateRangeTransformerService, 'transformDateRanges').and.callThrough();
      const transformedDateRanges = dateRangeTransformerService.transformDateRanges(dateRangeDTOsMock);
      expect(transformedDateRanges).toEqual(dateRangeCollectionMock);
    });
  });
});
