import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { EntityPeopleType } from '../enums/entity-responsibilities.enum';
import { MyPerformanceApiService } from './my-performance-api.service';

describe('Service: DateRangeApiService', () => {
  let myPerformanceApiService: MyPerformanceApiService;
  let mockBackend: MockBackend;
  const mockResponsibilitiesResponse: any = {
    people: [
      {
        id: 123,
        name: 'Joe',
        typeDisplayName: 'Market Development Managers',
        peopleType: EntityPeopleType.MDM
      },
      {
        id: 456,
        name: 'Jack',
        typeDisplayName: 'Market Development Managers',
        peopleType: EntityPeopleType.MDM
      },
      {
        id: 789,
        name: 'Janet',
        typeDisplayName: 'Specialists',
        peopleType: EntityPeopleType.Specialist
      }
    ]
  };

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
       MyPerformanceApiService
      ]
    });
  });

  beforeEach(inject([MyPerformanceApiService, MockBackend],
    (_myPerformanceApiService: MyPerformanceApiService,
    _mockBackend: MockBackend) => {
      myPerformanceApiService = _myPerformanceApiService;
      mockBackend = _mockBackend;
    })
  );

  describe('getResponsibilities', () => {

    it('should call the search api and return all Date Ranges', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockResponsibilitiesResponse)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('/v3/people/1/responsibilities');
      });

      myPerformanceApiService
        .getResponsibilities(1)
        .subscribe((res) => {
          expect(res).toEqual(mockResponsibilitiesResponse);
          done();
        });
      });
  });
});
