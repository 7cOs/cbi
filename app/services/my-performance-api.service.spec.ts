import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { EntityDTO } from '../models/entity-dto.model';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { EntityWithPerformanceDTO } from '../models/entity-with-performance.model';
import { PerformanceDTO } from '../models/performance.model';
import { getEntityDTOMock } from '../models/entity-dto.model.mock';
import { getEntitySubAccountDTOMock } from '../models/entity-subaccount-dto.model.mock';
import { getPerformanceDTOMock } from '../models/performance.model.mock';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceApiService } from './my-performance-api.service';
import { PeopleResponsibilitiesDTO } from '../models/people-responsibilities-dto.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { productMetricsBrandDTOMock } from '../models/entity-product-metrics-dto.model.mock';
import { ProductMetricType } from '../enums/product-metrics-type.enum';

describe('Service: MyPerformanceApiService', () => {
  let myPerformanceApiService: MyPerformanceApiService;
  let mockBackend: MockBackend;

  const performanceResponseMock: PerformanceDTO = getPerformanceDTOMock();
  const responsibilitiesResponseMock: PeopleResponsibilitiesDTO = {
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
  const entityDTOMock: Array<EntityDTO> = [getEntityDTOMock(), getEntityDTOMock()];
  const subAccountsDTOMock: Array<EntitySubAccountDTO> = [getEntitySubAccountDTOMock(), getEntitySubAccountDTOMock()];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
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
          body: JSON.stringify(responsibilitiesResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('/v3/positions/1/responsibilities');
      });

      myPerformanceApiService
        .getResponsibilities('1')
        .subscribe((res) => {
          expect(res).toEqual(responsibilitiesResponseMock);
          done();
        });
    });
  });

  describe('getProductMetrics', () => {

    it('should call the getProductMetrics endpoint and return all ProductMetrics', (done) => {
      const filterMock = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsBrandDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          '/v3/positions/1/productMetrics?metricType=volume&dateRangeCode=FYTDBDL&premiseType=On&aggregationLevel=brand');
      });

      myPerformanceApiService
        .getProductMetrics('1', filterMock, ProductMetricType.brand)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsBrandDTOMock);
          done();
        });
    });
  });

  describe('getPerformance', () => {
    it('should call the performance API and return performance data', (done) => {
      const filterMock = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          '/v3/positions/1/performanceTotal?metricType=volume&dateRangeCode=FYTDBDL&premiseType=On'
        );
      });

      myPerformanceApiService.getPerformance('1', filterMock).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(performanceResponseMock);
        done();
      });
    });
  });

  describe('getSubAccountsPerformance', () => {
    it('should call the SubAccountsperformance  API and return performance data', (done) => {
      const myPerformanceFilterState = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      const subAccountIdMock: string = chance.string();
      const contextPositionIdMock: string = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          `/v3/subAccounts/${subAccountIdMock}/` +
          `performanceTotal?metricType=volume&dateRangeCode=FYTDBDL&premiseType=On&positionId=${contextPositionIdMock}`
        );
      });

      myPerformanceApiService.getSubAccountsPerformance(subAccountIdMock, contextPositionIdMock, myPerformanceFilterState)
        .subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(performanceResponseMock);
        done();
      });
    });
  });

  describe('getDistributorPerformance', () => {
    it('should call the distributors performance API and return performance data', (done) => {
      const mockFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          '/v3/distributors/1/performanceTotal?metricType=volume&dateRangeCode=FYTDBDL&premiseType=On&positionId=1'
        );
      });

      const expected = performanceResponseMock;

      myPerformanceApiService.getDistributorPerformance('1', mockFilter, '1').subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expected);
        done();
      });
    });
  });

  describe('getAccountsPerformance', () => {
    it('should call the accounts performance API and return performance data', (done) => {
      const mockFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          '/v3/accounts/1/performanceTotal?metricType=volume&dateRangeCode=FYTDBDL&premiseType=On&positionId=1'
        );
      });

      const expected = performanceResponseMock;

      myPerformanceApiService.getAccountPerformance('1', mockFilter, '1').subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expected);
        done();
      });
    });
  });

  describe('getAccountsDistributors', () => {

    it('should call the responsibilities endpoint and return some entities', (done) => {
      const entityURIMock = chance.string();

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(entityDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3${ entityURIMock }`);
      });

      myPerformanceApiService
        .getAccountsDistributors(entityURIMock)
        .subscribe((res) => {
          expect(res).toEqual(entityDTOMock);
          done();
        });
    });
  });

  describe('getResponsibilityPerformance', () => {

    it('should call the responsibility performance endpoint and return performance data for the responsibility', (done) => {
      const filterMock = {
        metricType: MetricTypeValue.velocity,
        dateRangeCode: DateRangeTimePeriodValue.L90BDL,
        premiseType: PremiseTypeValue.All
      };
      const entityMock = {
        name: chance.string(),
        type: chance.string(),
        positionDescription: chance.string()
      };
      const positionIdMock = chance.string();
      const expectedBaseUrl = `/v3/positions/${ positionIdMock }/responsibilities/${ entityMock.type }/performanceTotal`;
      const expectedUrlParams = '?metricType=velocity&dateRangeCode=L90BDL&premiseType=All';

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceResponseMock)
        });

        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedBaseUrl + expectedUrlParams);
      });

      myPerformanceApiService.getResponsibilityPerformance(entityMock, filterMock, positionIdMock)
        .subscribe((response: EntityWithPerformanceDTO) => {
          expect(response).toEqual({
            id: positionIdMock,
            name: entityMock.name,
            positionDescription: entityMock.positionDescription,
            performance: performanceResponseMock
          });
          done();
      });
    });
  });

  describe('getSubAccounts', () => {

    it('should call the accounts/subAcccount endpoint and return subAccounts', (done) => {
      const positionIdMock: string = chance.string();
      const contextPositionIdMock: string = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#%^&*()[]'
      });
      const premiseTypeMock: PremiseTypeValue = PremiseTypeValue.All;

      const expectedBaseUrl = `/v3/accounts/${ positionIdMock }/subAccounts`;
      const expectedUrlParams =
        `?positionId=${encodeURIComponent(contextPositionIdMock)}&premiseType=${encodeURIComponent(PremiseTypeValue[premiseTypeMock])}`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(subAccountsDTOMock)
        });

        connection.mockRespond(new Response(options));

        expect(connection.request.method).toBe(RequestMethod.Get);
        expect(connection.request.url).toBe(expectedBaseUrl + expectedUrlParams);
      });

      myPerformanceApiService.getSubAccounts(positionIdMock, contextPositionIdMock, premiseTypeMock)
        .subscribe((response: Array<EntitySubAccountDTO>) => {
          expect(response).toEqual(subAccountsDTOMock);
          done();
        });
    });
  });
});
