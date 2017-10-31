import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { getProductMetricsBrandDTOMock } from '../models/product-metrics.model.mock';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilter } from '../models/my-performance-filter.model';
import { ProductMetricsApiService } from './product-metrics-api.service';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ProductMetricsAggregationType } from '../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../models/product-metrics.model';

describe('Service: ProductMetricsApiService', () => {
  let productMetricsApiService: ProductMetricsApiService;
  let mockBackend: MockBackend;
  let productMetricsDTOMock: ProductMetricsDTO;
  let chanceStringOptions: any = {pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'};

  beforeEach(() => {
    productMetricsDTOMock = getProductMetricsBrandDTOMock();

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
        ProductMetricsApiService
      ]
    });
  });

  beforeEach(inject([ProductMetricsApiService, MockBackend],
    (_productMetricsApiService: ProductMetricsApiService, _mockBackend: MockBackend) => {
      productMetricsApiService = _productMetricsApiService;
      mockBackend = _mockBackend;
    })
  );

  describe('getPositionProductMetrics', () => {

    it('should call the getPositionProductMetrics endpoint and return all ProductMetrics', (done) => {
      const filterMock: MyPerformanceFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      const expectedPositionId = chance.string(chanceStringOptions);

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/positions/${expectedPositionId}/productMetrics`
          + '?type=volume&dateRangeCode=FYTDBDL&premiseType=On&aggregationLevel=brand');
      });

      productMetricsApiService
        .getPositionProductMetrics(expectedPositionId, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsDTOMock);
          done();
        });
    });
  });

  describe('getAccountProductMetrics', () => {

    it('should call the getAccountProductMetrics endpoint and return all ProductMetrics', (done) => {
      const filterMock = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      const expectedAccountId = chance.string(chanceStringOptions);
      const expectedPositionId = chance.string(chanceStringOptions);

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/accounts/${expectedAccountId}/productMetrics`
          + `?type=volume&dateRangeCode=FYTDBDL&premiseType=On&aggregationLevel=brand&positionId=${expectedPositionId}`);
      });

      productMetricsApiService
        .getAccountProductMetrics(expectedAccountId, expectedPositionId, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsDTOMock);
          done();
        });
    });
  });

  describe('getRoleGroupProductMetrics', () => {

    it('should call the getRoleGroupProductMetrics endpoint and return all ProductMetrics', (done) => {
      const filterMock = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      const expectedPositionId = chance.string(chanceStringOptions);
      const expectedEntityType = chance.string(chanceStringOptions);

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/positions/${expectedPositionId}/responsibilities/${expectedEntityType}/productMetrics`
          + `?type=volume&dateRangeCode=FYTDBDL&premiseType=On&aggregationLevel=brand`);
      });

      productMetricsApiService
        .getRoleGroupProductMetrics(expectedPositionId, expectedEntityType, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsDTOMock);
          done();
        });
    });
  });

  describe('getAlternateHierarchyProductMetrics', () => {

    it('should call the getAlternateHierarchyProductMetrics endpoint and return all ProductMetrics', (done) => {
      const filterMock: MyPerformanceFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      const expectedPositionId: string = chance.string(chanceStringOptions);
      const expectedEntityType: string = chance.string(chanceStringOptions);
      const expectedContextPositionId: string = chance.string(chanceStringOptions);

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/positions/${expectedPositionId}/alternateHierarchy/${expectedEntityType}/productMetrics`
          + `?type=volume&dateRangeCode=FYTDBDL&premiseType=On&aggregationLevel=brand`
          + `&contextPositionId=${expectedContextPositionId}`);
      });

      productMetricsApiService
        .getAlternateHierarchyProductMetrics(
          expectedPositionId,
          expectedEntityType,
          filterMock,
          ProductMetricsAggregationType.brand,
          expectedContextPositionId)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsDTOMock);
          done();
        });
    });
  });

  describe('getAlternateHierarchyProductMetricsForPosition', () => {

    it('should call the getAlternateHierarchyProductMetrics endpoint and return all ProductMetrics', (done) => {
      const filterMock: MyPerformanceFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      const expectedPositionId: string = chance.string(chanceStringOptions);
      const contextPositionIdMock: string = chance.string(chanceStringOptions);

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/positions/${expectedPositionId}/alternateHierarchyProductMetrics`
          + `?type=volume&dateRangeCode=FYTDBDL&premiseType=On&aggregationLevel=brand`
          + `&contextPositionId=${contextPositionIdMock}`);
      });

      productMetricsApiService
        .getAlternateHierarchyProductMetricsForPosition(
          expectedPositionId,
          filterMock,
          ProductMetricsAggregationType.brand,
          contextPositionIdMock)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsDTOMock);
          done();
        });
    });
  });
});
