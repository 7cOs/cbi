import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DateRangeApiService } from './date-range-api.service';
import { mockDateRangeDTOs } from '../models/date-range-dto-collection.mock.model';

describe('Service: DateRangeApiService', () => {
  let service: DateRangeApiService;
  let backend: MockBackend;

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
    (dateRangeApiService: DateRangeApiService,
    mockBackend: MockBackend) => {
      service = dateRangeApiService;
      backend = mockBackend;
    })
  );

  describe('getDateRanges', () => {

    it('should call the search api and return all Date Ranges', (done) => {
      backend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockDateRangeDTOs)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('/v3/dateRangeCodes');
      });

      service
        .getDateRanges()
        .subscribe((res) => {
          expect(res).toEqual(mockDateRangeDTOs);
          done();
        });
      });
  });
});
