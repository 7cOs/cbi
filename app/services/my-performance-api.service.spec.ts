import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { EntitiesPerformancesDTO } from '../models/entities-performances.model';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { EntitiesTotalPerformances } from '../models/entities-total-performances.model';
import { getEntitiesTotalPerformancesMock } from '../models/entities-total-performances.model.mock';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceApiService } from './my-performance-api.service';
import { PremiseTypeValue } from '../enums/premise-type.enum';

describe('Service: MyPerformanceApiService', () => {
  let myPerformanceApiService: MyPerformanceApiService;
  let mockBackend: MockBackend;

  const mockPerformanceTotalResponse: EntitiesTotalPerformances = getEntitiesTotalPerformancesMock();
  const mockResponsibilitiesResponse: any = {
    positions: [{
      id: '123',
      employeeId: '1231231',
      name: 'Joel Cummins',
      description: 'MARKET DEVELOPMENT MANAGER',
      type: '10',
      hierarchyType: 'SALES_HIER',
    }, {
      id: '456',
      employeeId: '4564561',
      name: 'Andy Farag',
      description: 'MARKET DEVELOPMENT MANAGER',
      type: '20',
      hierarchyType: 'SALES_HIER',
    }, {
      id: '789',
      employeeId: '7897891',
      name: 'Ryan Stasik',
      description: 'Specialist',
      type: '30',
      hierarchyType: 'SALES_HIER',
    }]
  };
  const subAccountsResponseMock: Array<EntitySubAccountDTO> = [{
    accountCode: chance.string(),
    premiseTypeCode: chance.string(),
    subaccountCode: chance.string(),
    subaccountDescription: chance.string()
  }];

  beforeEach(() => {
    TestBed.configureTestingModule({
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
    (_myPerformanceApiService: MyPerformanceApiService, _mockBackend: MockBackend) => {
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
        .getResponsibilities('1')
        .subscribe((res) => {
          expect(res).toEqual(mockResponsibilitiesResponse);
          done();
        });
      });
  });

  describe('getPerformanceTotal', () => {

    it('should call the performanceTotal API and return performance data', (done) => {
      const mockFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockPerformanceTotalResponse)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          '/v3/positions/1/performanceTotal?metricType=volume&dateRangeCode=FYTDBDL&premiseType=On'
        );
      });

      myPerformanceApiService.getPerformanceTotal('1', mockFilter).subscribe((response: EntitiesTotalPerformances) => {
        expect(response).toEqual(mockPerformanceTotalResponse);
        done();
      });
    });
  });

  describe('getResponsibilityPerformanceTotal', () => {

    it('should call the responsibility performanceTotal endpoint and return performance data for the responsibility', (done) => {
      const mockFilter = {
        metricType: MetricTypeValue.velocity,
        dateRangeCode: DateRangeTimePeriodValue.L90BDL,
        premiseType: PremiseTypeValue.All
      };
      const entityMock = {
        name: chance.string(),
        type: chance.string()
      };
      const positionIdMock = chance.string();
      const expectedBaseUrl = `/v3/positions/${ positionIdMock }/responsibilities/${ entityMock.type }/performanceTotal`;
      const expectedUrlParams = '?metricType=velocity&dateRangeCode=L90BDL&premiseType=All';

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockPerformanceTotalResponse)
        });

        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedBaseUrl + expectedUrlParams);
      });

      myPerformanceApiService.getResponsibilityPerformanceTotal(entityMock, mockFilter, positionIdMock)
        .subscribe((response: EntitiesPerformancesDTO) => {
          expect(response).toEqual({
            id: positionIdMock,
            name: entityMock.name,
            performanceTotal: mockPerformanceTotalResponse
          });
          done();
        });
    });
  });

  describe('getSubAccounts', () => {

    it('should call the accounts/subAcccount endpoint and return subAccounts', (done) => {
      const positionIdMock: string = chance.string({pool: '1234567890'});
      const contextPositionIdMock: string = chance.string({pool: '1234567890'});
      const premiseTypeMock: PremiseTypeValue = PremiseTypeValue.All;

      const expectedBaseUrl = `/v3/accounts/${ positionIdMock }/subAccounts`;
      const expectedUrlParams = `?positionId=${ contextPositionIdMock }&premiseType=${ PremiseTypeValue[premiseTypeMock] }`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(subAccountsResponseMock)
        });

        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedBaseUrl + expectedUrlParams);
      });

      myPerformanceApiService.getSubAccounts(positionIdMock, contextPositionIdMock, premiseTypeMock)
        .subscribe((response: Array<EntitySubAccountDTO>) => {
          expect(response).toEqual(subAccountsResponseMock);
          done();
        });
    });
  });
});
