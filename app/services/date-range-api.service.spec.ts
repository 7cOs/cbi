import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DateRangeApiService } from './date-range-api.service';
import { dateRangeDTOsMock } from '../models/date-range-dto-collection.model.mock';

describe('Service: DateRangeApiService', () => {
  let dateRangeApiService: DateRangeApiService;
  let mockBackend: MockBackend;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [ MockBackend, BaseRequestOptions ]
        },
       DateRangeApiService
      ]
    });
  });

  beforeEach(inject([DateRangeApiService, MockBackend],
    (_dateRangeApiService: DateRangeApiService,
    _mockBackend: MockBackend) => {
      dateRangeApiService = _dateRangeApiService;
      mockBackend = _mockBackend;
    })
  );

  describe('getDateRanges', () => {

    it('should call the search api and return all Date Ranges', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(dateRangeDTOsMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('/v3/dateRangeCodes');
      });

      dateRangeApiService
        .getDateRanges()
        .subscribe((res) => {
          expect(res).toEqual(dateRangeDTOsMock);
          done();
        });
      });
  });
});
