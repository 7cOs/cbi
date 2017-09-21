import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { getEntitiesTotalPerformancesMock } from '../models/entities-total-performances.model.mock';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceApiService } from './my-performance-api.service';
import { EntitiesTotalPerformances } from '../models/entities-total-performances.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ProductMetricType } from '../enums/product-metrics-type.enum';
import { productMetricsBrandDTOMock } from '../models/entity-product-metrics-dto.model.mock';
import { EntitiesPerformancesDTO } from '../models/entities-performances.model';

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

  describe('getProductMetrics', () => {

    it('should call the getProductMetrics endpoint and return all ProductMetrics', (done) => {
      const mockFilter = {
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
        .getProductMetrics('1', mockFilter, ProductMetricType.brand)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsBrandDTOMock);
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
          body: JSON.stringify(mockPerformanceTotalResponse)
        });

        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedBaseUrl + expectedUrlParams);
      });

      myPerformanceApiService.getResponsibilityPerformanceTotal(entityMock, filterMock, positionIdMock)
        .subscribe((response: EntitiesPerformancesDTO) => {
          expect(response).toEqual({
            id: positionIdMock,
            name: entityMock.name,
            positionDescription: entityMock.positionDescription,
            performanceTotal: mockPerformanceTotalResponse
          });
          done();
        });
    });
  });

  describe('getResponsibilitiesPerformanceTotals', () => {

    it('should call the responsibility performanceTotal endpoint for each entity and return an array of performance data', (done) => {
      const filterMock = {
        metricType: MetricTypeValue.PointsOfDistribution,
        dateRangeCode: DateRangeTimePeriodValue.LCM,
        premiseType: PremiseTypeValue.On,
        distributionType: DistributionTypeValue.simple
      };
      const entityArrayMock = [
        { positionId: chance.string(), name: chance.string(), positionDescription: chance.string(), type: chance.string() },
        { positionId: chance.string(), name: chance.string(), positionDescription: chance.string(), type: chance.string() }
      ];
      const expectedUrlParams = '?metricType=simplePointsOfDistribution&dateRangeCode=LCM&premiseType=On';

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(mockPerformanceTotalResponse)
        });

        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
      });

      myPerformanceApiService.getResponsibilitiesPerformanceTotals(entityArrayMock, filterMock)
        .subscribe((response) => {
          expect(response).toEqual([
            {
              id: entityArrayMock[0].positionId,
              name: entityArrayMock[0].name,
              positionDescription: entityArrayMock[0].positionDescription,
              performanceTotal: mockPerformanceTotalResponse
            }, {
              id: entityArrayMock[1].positionId,
              name: entityArrayMock[1].name,
              positionDescription: entityArrayMock[1].positionDescription,
              performanceTotal: mockPerformanceTotalResponse
            }
          ]);
          done();
        });

      expect(mockBackend.connectionsArray.length).toBe(entityArrayMock.length);

      mockBackend.connectionsArray.forEach((connection: MockConnection, index) => {
        expect(connection.request.url)
        .toEqual(
          `/v3/positions/${ entityArrayMock[index].positionId }/responsibilities/${ entityArrayMock[index].type }/performanceTotal`
          + expectedUrlParams
        );
      });
    });
  });
});
