import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions, ResponseType } from '@angular/http';
import * as Chance from 'chance';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { getProductMetricsBrandDTOMock } from '../models/product-metrics.model.mock';
import { MetricTypeValue } from '../enums/metric-type.enum';
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
    let filterMock: MyPerformanceFilterState;
    let expectedPositionId: string;

      filterMock = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.All
      };
    expectedPositionId = chance.string(chanceStringOptions);

    it('should call the getPositionProductMetrics endpoint and return all ProductMetrics when response is successful', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/positions/${expectedPositionId}/productMetrics`
          + '?type=volume&dateRangeCode=FYTDBDL&premiseType=All&aggregationLevel=brand');
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
        connection.mockError(new Response(options) as Response & Error);
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
        connection.mockError(new Response(options) as Response & Error);
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
    let filterMock: MyPerformanceFilterState;
    let expectedPositionId: string;
    let expectedAccountId: string;

    beforeEach(() => {
      filterMock = {
        metricType: MetricTypeValue.velocity,
        dateRangeCode: DateRangeTimePeriodValue.L3CM,
        premiseType: PremiseTypeValue.Off
      };
      expectedAccountId = chance.string(chanceStringOptions);
      expectedPositionId = chance.string(chanceStringOptions);
    });

    it('should call the getAccountProductMetrics endpoint and return all ProductMetrics', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/accounts/${expectedAccountId}/productMetrics`
          + `?type=velocity&dateRangeCode=L3CM&premiseType=Off&aggregationLevel=brand&positionId=${expectedPositionId}`);
      });

      productMetricsApiService
        .getAccountProductMetrics(expectedAccountId, expectedPositionId, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsDTOMock);
          done();
        });
    });

    it('should call the getAccountProductMetrics endpoint and return empty brandValues when '
      + 'brand aggregation response is 404', (done: any) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      productMetricsApiService
        .getAccountProductMetrics(expectedAccountId, expectedPositionId, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toBeDefined();
          expect(res.brandValues).toEqual([]);
          expect(res.type).toEqual('velocity');
          done();
        });
    });

    it('should call the getAccountProductMetrics endpoint and return empty skuValues when sku aggregation response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      productMetricsApiService
        .getAccountProductMetrics(expectedAccountId, expectedPositionId, filterMock, ProductMetricsAggregationType.sku)
        .subscribe((res) => {
          expect(res).toBeDefined();
          expect(res.skuValues).toEqual([]);
          expect(res.type).toEqual('velocity');
          done();
        });
    });
  });

  describe('getRoleGroupProductMetrics', () => {
    let filterMock: MyPerformanceFilterState;
    let expectedPositionId: string;
    let expectedEntityType: string;

    beforeEach(() => {
      filterMock = {
        metricType: MetricTypeValue.PointsOfDistribution,
        distributionType: DistributionTypeValue.simple,
        dateRangeCode: DateRangeTimePeriodValue.L60BDL,
        premiseType: PremiseTypeValue.On
      };
      expectedPositionId = chance.string(chanceStringOptions);
      expectedEntityType = chance.string(chanceStringOptions);
    });

    it('should call the getRoleGroupProductMetrics endpoint and return all ProductMetrics', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/positions/${expectedPositionId}/responsibilities/${expectedEntityType}/productMetrics`
          + `?type=simplePointsOfDistribution&dateRangeCode=L60BDL&premiseType=On&aggregationLevel=brand`);
      });

      productMetricsApiService
        .getRoleGroupProductMetrics(expectedPositionId, expectedEntityType, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsDTOMock);
          done();
        });
    });

    it('should call the getRoleGroupProductMetrics endpoint and return empty brandValues when '
      + 'brand aggregation response is 404', (done: any) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      productMetricsApiService
        .getRoleGroupProductMetrics(expectedPositionId, expectedEntityType, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toBeDefined();
          expect(res.brandValues).toEqual([]);
          expect(res.type).toEqual('simplePointsOfDistribution');
          done();
        });
    });

    it('should call the getRoleGroupProductMetrics endpoint and return empty skuValues when sku aggregation response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      productMetricsApiService
        .getRoleGroupProductMetrics(expectedPositionId, expectedEntityType, filterMock, ProductMetricsAggregationType.sku)
        .subscribe((res) => {
          expect(res).toBeDefined();
          expect(res.skuValues).toEqual([]);
          expect(res.type).toEqual('simplePointsOfDistribution');
          done();
        });
    });
  });

  describe('getAlternateHierarchyProductMetrics', () => {
    let filterMock: MyPerformanceFilterState;
    let expectedPositionId: string;
    let expectedEntityType: string;
    let expectedContextPositionId: string;

    beforeEach(() => {
      filterMock = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      expectedPositionId = chance.string(chanceStringOptions);
      expectedEntityType = chance.string(chanceStringOptions);
      expectedContextPositionId = chance.string(chanceStringOptions);
    });

    it('should call the getAlternateHierarchyProductMetrics endpoint and return all ProductMetrics', (done) => {
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

    it('should call the getAlternateHierarchyProductMetrics endpoint and return empty brandValues when '
      + 'brand aggregation response is 404', (done: any) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      productMetricsApiService
        .getAlternateHierarchyProductMetrics(
          expectedPositionId,
          expectedEntityType,
          filterMock,
          ProductMetricsAggregationType.brand,
          expectedContextPositionId)
        .subscribe((res) => {
          expect(res).toBeDefined();
          expect(res.brandValues).toEqual([]);
          expect(res.type).toEqual('volume');
          done();
        });
    });

    it('should call the getAlternateHierarchyProductMetrics endpoint and return empty skuValues when '
    + 'sku aggregation response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      productMetricsApiService
        .getAlternateHierarchyProductMetrics(
          expectedPositionId,
          expectedEntityType,
          filterMock,
          ProductMetricsAggregationType.sku,
          expectedContextPositionId)
        .subscribe((res) => {
          expect(res).toBeDefined();
          expect(res.skuValues).toEqual([]);
          expect(res.type).toEqual('volume');
          done();
        });
    });
  });

  describe('getAlternateHierarchyProductMetricsForPosition', () => {
    let filterMock: MyPerformanceFilterState;
    let expectedPositionId: string;
    let expectedContextPositionId: string;

    beforeEach(() => {
      filterMock = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      expectedPositionId = chance.string(chanceStringOptions);
      expectedContextPositionId = chance.string(chanceStringOptions);
    });

    it('should call the getAlternateHierarchyProductMetricsForPosition endpoint and return all ProductMetrics', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/positions/${expectedPositionId}/alternateHierarchyProductMetrics`
          + `?type=volume&dateRangeCode=FYTDBDL&premiseType=On&aggregationLevel=brand`
          + `&contextPositionId=${expectedContextPositionId}`);
      });

      productMetricsApiService
        .getAlternateHierarchyProductMetricsForPosition(
          expectedPositionId,
          filterMock,
          ProductMetricsAggregationType.brand,
          expectedContextPositionId)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsDTOMock);
          done();
        });
    });

    it('should call the getAlternateHierarchyProductMetricsForPosition endpoint and return empty brandValues when '
      + 'brand aggregation response is 404', (done: any) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      productMetricsApiService
        .getAlternateHierarchyProductMetricsForPosition(
          expectedPositionId,
          filterMock,
          ProductMetricsAggregationType.brand,
          expectedContextPositionId)
        .subscribe((res) => {
          expect(res).toBeDefined();
          expect(res.brandValues).toEqual([]);
          expect(res.type).toEqual('volume');
          done();
        });
    });

    it('should call the getAlternateHierarchyProductMetricsForPosition endpoint and return empty skuValues when '
      + 'sku aggregation response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      productMetricsApiService
        .getAlternateHierarchyProductMetricsForPosition(
          expectedPositionId,
          filterMock,
          ProductMetricsAggregationType.sku,
          expectedContextPositionId)
        .subscribe((res) => {
          expect(res).toBeDefined();
          expect(res.skuValues).toEqual([]);
          expect(res.type).toEqual('volume');
          done();
        });
    });
  });
});
