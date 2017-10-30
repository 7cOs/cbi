import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { ProductMetricsApiService } from './product-metrics-api.service';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { productMetricsBrandDTOMock } from '../models/product-metrics.model.mock';
import { ProductMetricsAggregationType } from '../enums/product-metrics-aggregation-type.enum';

describe('Service: ProductMetricsApiService', () => {
  let productMetricsApiService: ProductMetricsApiService;
  let mockBackend: MockBackend;

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
      const filterMock = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      const expectedPositionId = chance.string({pool: '0123456789'});

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsBrandDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/positions/${expectedPositionId}/productMetrics`
          + '?type=volume&dateRangeCode=FYTDBDL&premiseType=On&aggregationLevel=brand');
      });

      productMetricsApiService
        .getPositionProductMetrics(expectedPositionId, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsBrandDTOMock);
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
      const expectedAccountId = chance.string({pool: '0123456789'});
      const expectedPositionId = chance.string({pool: '0123456789'});

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsBrandDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/accounts/${expectedAccountId}/productMetrics`
          + `?type=volume&dateRangeCode=FYTDBDL&premiseType=On&aggregationLevel=brand&positionId=${expectedPositionId}`);
      });

      productMetricsApiService
        .getAccountProductMetrics(expectedAccountId, expectedPositionId, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsBrandDTOMock);
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
      const expectedPositionId = chance.string({pool: '0123456789'});
      const expectedEntityType = chance.string({pool: '0123456789'});

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsBrandDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/positions/${expectedPositionId}/responsibilities/${expectedEntityType}/productMetrics`
          + `?type=volume&dateRangeCode=FYTDBDL&premiseType=On&aggregationLevel=brand`);
      });

      productMetricsApiService
        .getRoleGroupProductMetrics(expectedPositionId, expectedEntityType, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsBrandDTOMock);
          done();
        });
    });
  });

  describe('getAlternateHierarchyProductMetrics', () => {

    it('should call the getAlternateHierarchyProductMetrics endpoint and return all ProductMetrics', (done: any) => {
      const filterMock = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      const expectedPositionId = chance.string({pool: '0123456789'});
      const expectedEntityType = chance.string({pool: '0123456789'});
      const contextPositionIdMock = chance.string({pool: '0123456789'});

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsBrandDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/positions/${expectedPositionId}/alternateHierarchy/${expectedEntityType}/productMetrics`
          + `?type=volume&dateRangeCode=FYTDBDL&premiseType=On&aggregationLevel=brand`
          + `&contextPositionId=${contextPositionIdMock}`);
      });

      productMetricsApiService
        .getAlternateHierarchyProductMetrics(
          expectedPositionId,
          expectedEntityType,
          filterMock,
          ProductMetricsAggregationType.brand,
          contextPositionIdMock)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsBrandDTOMock);
          done();
        });
    });
  });

  describe('getAlternateHierarchyProductMetricsForPosition', () => {

    it('should call the getAlternateHierarchyProductMetrics endpoint and return all ProductMetrics', (done: any) => {
      const filterMock = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      const expectedPositionId = chance.string({pool: '0123456789'});
      const contextPositionIdMock = chance.string({pool: '0123456789'});

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsBrandDTOMock)
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
          expect(res).toEqual(productMetricsBrandDTOMock);
          done();
        });
    });
  });
});
