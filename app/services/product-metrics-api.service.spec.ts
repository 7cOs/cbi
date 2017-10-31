import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions, ResponseType } from '@angular/http';
import * as Chance from 'chance';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { getProductMetricsBrandDTOMock } from '../models/product-metrics.model.mock';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MockApiError } from '../models/mock-api-error.model';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { ProductMetricsApiService } from './product-metrics-api.service';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ProductMetricsAggregationType } from '../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../models/product-metrics.model';

const chance = new Chance();

describe('Service: ProductMetricsApiService', () => {
  let productMetricsApiService: ProductMetricsApiService;
  let mockBackend: MockBackend;
  let productMetricsDTOMock: ProductMetricsDTO;

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
    let filterMock: MyPerformanceFilterState;
    let expectedPositionId: string;

    beforeEach(() => {
      filterMock = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      expectedPositionId = chance.string({pool: '0123456789'});
    });

    it('should call the getPositionProductMetrics endpoint and return all ProductMetrics when response is successful', (done) => {
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

    it('should call the getPositionProductMetrics endpoint and return empty brandValues when '
    + 'brand aggregation response is 404', (done: any) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new MockApiError(options));
      });

      productMetricsApiService
        .getPositionProductMetrics(expectedPositionId, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toBeDefined();
          expect(res.brandValues).toEqual([]);
          expect(res.type).toEqual('volume');
          done();
        });
    });

    it('should call the getPositionProductMetrics endpoint and return empty skuValues when sku aggregation response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new MockApiError(options));
      });

      productMetricsApiService
        .getPositionProductMetrics(expectedPositionId, filterMock, ProductMetricsAggregationType.sku)
        .subscribe((res) => {
          expect(res).toBeDefined();
          expect(res.skuValues).toEqual([]);
          expect(res.type).toEqual('volume');
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
      const expectedPositionId = chance.string({pool: '0123456789'});
      const expectedEntityType = chance.string({pool: '0123456789'});

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
});
