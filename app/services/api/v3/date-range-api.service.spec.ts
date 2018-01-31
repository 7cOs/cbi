import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { DateRangeApiService } from './date-range-api.service';
import { DateRangeDTO } from '../../../models/date-range-dto.model';
import { dateRangeDTOsMock } from '../../../models/date-range-dto-collection.model.mock';

describe('DateRangeApiService', () => {
  let testBed: TestBed;
  let http: HttpTestingController;
  let dateRangeApiService: DateRangeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ DateRangeApiService ]
    });

    testBed = getTestBed();
    http = testBed.get(HttpTestingController);
    dateRangeApiService = testBed.get(DateRangeApiService);
  });

  afterEach(() => {
    http.verify();
  });

  describe('getDateRanges', () => {
    it('should call the dateRangeCodes endpoint and return DateRangeDTO[] data', () => {
      dateRangeApiService.getDateRanges().subscribe((response: DateRangeDTO[]) => {
        expect(response).toEqual(dateRangeDTOsMock);
      });

      const req: TestRequest = http.expectOne('/v3/dateRangeCodes');
      req.flush(dateRangeDTOsMock);

      expect(req.request.method).toBe('GET');
    });
  });
});
