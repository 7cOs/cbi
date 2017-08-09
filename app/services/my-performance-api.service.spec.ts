import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { StoreModule } from '@ngrx/store';

import { EntityPeopleType } from '../enums/entity-responsibilities.enum';
import { getPerformanceTotalMock } from '../models/performance-total.model.mock';
import { MyPerformanceApiService } from './my-performance-api.service';
import { PerformanceTotal } from '../models/performance-total.model';
import { RoleGroupPerformanceTotal } from '../models/role-groups.model';

describe('Service: DateRangeApiService', () => {
  let myPerformanceApiService: MyPerformanceApiService;
  let mockBackend: MockBackend;
  const mockResponsibilitiesResponse: any = {
    positions: [
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
  const mockPerformanceTotalResponse: PerformanceTotal = getPerformanceTotalMock();

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.provideStore({})
      ],
      providers: [
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [ MockBackend, BaseRequestOptions ]
        },
        BaseRequestOptions,
        MockBackend,
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

    it('should call the responsibilities endpoint and return all responsibilities', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockResponsibilitiesResponse)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('/v3/positions/1/responsibilities');
      });

      myPerformanceApiService
        .getResponsibilities(1)
        .subscribe((res) => {
          expect(res).toEqual(mockResponsibilitiesResponse);
          done();
        });
      });
  });

  describe('getPerformanceTotal', () => {

    it('should call the performanceTotal API and return performance data', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockPerformanceTotalResponse)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('/v3/positions/1/performanceTotal');
      });

      myPerformanceApiService.getPerformanceTotal(1).subscribe((response: PerformanceTotal) => {
        expect(response).toEqual(mockPerformanceTotalResponse);
        done();
      });
    });
  });

  describe('getResponsibilityPerformanceTotal', () => {

    it('should call the responsibility performanceTotal endpoint and return performance data for the responsibility', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockPerformanceTotalResponse)
        });

        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('/v3/positions/1/responsibilities/Specialist/performanceTotal');
      });

      myPerformanceApiService.getResponsibilityPerformanceTotal(1, 'Specialist')
        .subscribe((response: RoleGroupPerformanceTotal) => {
          expect(response).toEqual({ entityType: 'Specialist', performanceTotal: mockPerformanceTotalResponse });
          done();
        });
    });
  });

  describe('getResponsibilitiesPerformanceTotals', () => {

    it('should call the responsibility performanceTotal endpoint for each entity and return an array of performance data', (done) => {
      const entityArray: Array<string> = ['Specialist', 'MDM'];

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockPerformanceTotalResponse)
        });

        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
      });

      myPerformanceApiService.getResponsibilitiesPerformanceTotals(1, entityArray)
        .subscribe((response) => {
          expect(response).toEqual([
            { entityType: 'Specialist', performanceTotal: mockPerformanceTotalResponse },
            { entityType: 'MDM', performanceTotal: mockPerformanceTotalResponse }
          ]);
          done();
        });

      expect(mockBackend.connectionsArray.length).toBe(entityArray.length);

      mockBackend.connectionsArray.forEach((connection: MockConnection, index) => {
        expect(connection.request.url).toEqual(`/v3/positions/1/responsibilities/${ entityArray[index] }/performanceTotal`);
      });
    });
  });
});
