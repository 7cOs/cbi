import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions, ResponseType } from '@angular/http';
import * as Chance from 'chance';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { getOpportunityCountDTOsMock } from '../models/opportunity-count-dto.model.mock';
import { getProductMetricsBrandDTOMock } from '../models/product-metrics.model.mock';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { OpportunityCountDTO } from '../models/opportunity-count-dto.model';
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
        metricType: MetricTypeValue.Depletions,
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
    + 'brand aggregation response is 404', (done) => {
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
        metricType: MetricTypeValue.Velocity,
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
      + 'brand aggregation response is 404', (done) => {
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

  describe('getSubAccountProductMetrics', () => {
    let filterMock: MyPerformanceFilterState;
    let expectedPositionId: string;
    let expectedSubAccountId: string;

    beforeEach(() => {
      filterMock = {
        metricType: MetricTypeValue.Velocity,
        dateRangeCode: DateRangeTimePeriodValue.L3CM,
        premiseType: PremiseTypeValue.Off
      };
      expectedSubAccountId = chance.string(chanceStringOptions);
      expectedPositionId = chance.string(chanceStringOptions);
    });

    it('should call the getSubAccountProductMetrics endpoint and return all ProductMetrics', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/subAccounts/${expectedSubAccountId}/productMetrics`
          + `?type=velocity&dateRangeCode=L3CM&premiseType=Off&aggregationLevel=brand&positionId=${expectedPositionId}`);
      });

      productMetricsApiService
        .getSubAccountProductMetrics(expectedSubAccountId, expectedPositionId, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsDTOMock);
          done();
        });
    });

    it('should call the getSubAccountProductMetrics endpoint and return empty brandValues when '
      + 'brand aggregation response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      productMetricsApiService
        .getSubAccountProductMetrics(expectedSubAccountId, expectedPositionId, filterMock, ProductMetricsAggregationType.brand)
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
        .getSubAccountProductMetrics(expectedSubAccountId, expectedPositionId, filterMock, ProductMetricsAggregationType.sku)
        .subscribe((res) => {
          expect(res).toBeDefined();
          expect(res.skuValues).toEqual([]);
          expect(res.type).toEqual('velocity');
          done();
        });
    });
  });

  describe('getDistributorProductMetrics', () => {
    let filterMock: MyPerformanceFilterState;
    let expectedPositionId: string;
    let expectedDistributorId: string;

    beforeEach(() => {
      filterMock = {
        metricType: MetricTypeValue.Velocity,
        dateRangeCode: DateRangeTimePeriodValue.L3CM,
        premiseType: PremiseTypeValue.Off
      };
      expectedDistributorId = chance.string(chanceStringOptions);
      expectedPositionId = chance.string(chanceStringOptions);
    });

    it('should call the getDistributorProductMetrics endpoint and return all ProductMetrics', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3/distributors/${expectedDistributorId}/productMetrics`
          + `?type=velocity&dateRangeCode=L3CM&premiseType=Off&aggregationLevel=brand&positionId=${expectedPositionId}`);
      });

      productMetricsApiService
        .getDistributorProductMetrics(expectedDistributorId, expectedPositionId, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toEqual(productMetricsDTOMock);
          done();
        });
    });

    it('should call the getDistributorProductMetrics endpoint and return empty brandValues when '
      + 'brand aggregation response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      productMetricsApiService
        .getDistributorProductMetrics(expectedDistributorId, expectedPositionId, filterMock, ProductMetricsAggregationType.brand)
        .subscribe((res) => {
          expect(res).toBeDefined();
          expect(res.brandValues).toEqual([]);
          expect(res.type).toEqual('velocity');
          done();
        });
    });

    it('should call the getDistributorProductMetrics endpoint and return empty skuValues when sku aggregation response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      productMetricsApiService
        .getDistributorProductMetrics(expectedDistributorId, expectedPositionId, filterMock, ProductMetricsAggregationType.sku)
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
        metricType: MetricTypeValue.Distribution,
        distributionType: DistributionTypeValue.Simple,
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
      + 'brand aggregation response is 404', (done) => {
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
        metricType: MetricTypeValue.Depletions,
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
      + 'brand aggregation response is 404', (done) => {
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
        metricType: MetricTypeValue.Depletions,
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
      + 'brand aggregation response is 404', (done) => {
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

  describe('getSubAccountOpportunityCounts', () => {
    let subAccountIdMock: string;
    let positionIdMock: string;
    let premiseTypeMock: string;
    let countStructureMock: string;
    let segmentMock: string;
    let impactMock: string;
    let typeMock: string;
    let opportunityCountDTOsMock: Array<OpportunityCountDTO>;
    let expectedUrl: string;
    let expectedParams: string;

    beforeEach(() => {
      subAccountIdMock = chance.string(chanceStringOptions);
      positionIdMock = chance.string(chanceStringOptions);
      premiseTypeMock = chance.string(chanceStringOptions);
      countStructureMock = chance.string(chanceStringOptions);
      segmentMock = chance.string(chanceStringOptions);
      impactMock = chance.string(chanceStringOptions);
      typeMock = chance.string(chanceStringOptions);
      opportunityCountDTOsMock = getOpportunityCountDTOsMock();
      expectedUrl = `/v3/subAccounts/${ subAccountIdMock }/opportunityCounts`;
      expectedParams = `?positionIds=${ positionIdMock }`
        + `&premiseType=${ premiseTypeMock }`
        + `&countStructureType=${ countStructureMock }`
        + `&segment=${ segmentMock }`
        + `&impact=${ impactMock}`
        + `&type=${ typeMock }`;
    });

    it('should call the subaccount opportunity counts endpoint and return OpportunityCountDTOs when successful', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(opportunityCountDTOsMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedUrl + encodeURI(expectedParams));
      });

      productMetricsApiService
        .getSubAccountOpportunityCounts(
          subAccountIdMock,
          positionIdMock,
          premiseTypeMock,
          countStructureMock,
          segmentMock,
          impactMock,
          typeMock)
        .subscribe((response: Array<ProductMetricsDTO>) => {
          expect(response).toEqual(opportunityCountDTOsMock);
          done();
        });
    });
  });

  describe('getDistributorOpportunityCounts', () => {
    let distributorIdMock: string;
    let positionIdMock: string;
    let premiseTypeMock: string;
    let countStructureTypeMock: string;
    let segmentMock: string;
    let impactMock: string;
    let typeMock: string;
    let opportunityCountDTOsMock: Array<OpportunityCountDTO>;
    let expectedUrl: string;
    let expectedParams: string;

    beforeEach(() => {
      distributorIdMock = chance.string(chanceStringOptions);
      positionIdMock = chance.string(chanceStringOptions);
      premiseTypeMock = chance.string(chanceStringOptions);
      countStructureTypeMock = chance.string(chanceStringOptions);
      segmentMock = chance.string(chanceStringOptions);
      impactMock = chance.string(chanceStringOptions);
      typeMock = chance.string(chanceStringOptions);
      opportunityCountDTOsMock = getOpportunityCountDTOsMock();
      expectedUrl = `/v3/distributors/${ distributorIdMock }/opportunityCounts`;
      expectedParams = `?positionIds=${ positionIdMock }`
        + `&premiseType=${ premiseTypeMock }`
        + `&countStructureType=${ countStructureTypeMock }`
        + `&segment=${ segmentMock }`
        + `&impact=${ impactMock }`
        + `&type=${ typeMock }`;
    });

    it('should call the distributor opportunity counts endpoint and return OpportunityCountDTOs when successful', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(opportunityCountDTOsMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedUrl + encodeURI(expectedParams));
      });

      productMetricsApiService
        .getDistributorOpportunityCounts(
          distributorIdMock,
          positionIdMock,
          premiseTypeMock,
          countStructureTypeMock,
          segmentMock,
          impactMock,
          typeMock)
        .subscribe((response: Array<OpportunityCountDTO>) => {
          expect(response).toEqual(opportunityCountDTOsMock);
          done();
        });
    });

    it('should call the distirbutor opportunity counts endpoint with no `positionIds` query param when '
    + 'no positionId is passed in', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(opportunityCountDTOsMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedUrl + encodeURI(`?premiseType=${ premiseTypeMock }`
        + `&countStructureType=${ countStructureTypeMock }`
        + `&segment=${ segmentMock }`
        + `&impact=${ impactMock }`
        + `&type=${ typeMock }`));
      });

      productMetricsApiService
        .getDistributorOpportunityCounts(
          distributorIdMock,
          undefined,
          premiseTypeMock,
          countStructureTypeMock,
          segmentMock,
          impactMock,
          typeMock)
        .subscribe((response: Array<OpportunityCountDTO>) => {
          expect(response).toEqual(opportunityCountDTOsMock);
          done();
        });
    });
  });
});
