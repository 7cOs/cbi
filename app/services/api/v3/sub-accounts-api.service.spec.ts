import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions, ResponseType } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { ApiHelperService } from '../api-helper.service';
import { getDateRangeTimePeriodValueMock } from '../../../enums/date-range-time-period.enum.mock';
import { getOpportunityCountDTOsMock } from '../../../models/opportunity-count-dto.model.mock';
import { getPerformanceDTOMock } from '../../../models/performance.model.mock';
import { getPremiseTypeValueMock } from '../../../enums/premise-type.enum.mock';
import { getProductMetricsBrandDTOMock } from '../../../models/product-metrics.model.mock';
import { MetricTypeValue } from '../../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { OpportunityCountDTO } from '../../../models/opportunity-count-dto.model';
import { PerformanceDTO } from '../../../models/performance.model';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';
import { SubAccountsApiService } from './sub-accounts-api.service';

const chanceStringOptions = {
  pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
};

describe('SubAccountsApiService', () => {
  let subAccountsApiService: SubAccountsApiService;
  let mockBackend: MockBackend;

  let subAccountIdMock: string;
  let positionIdMock: string;
  let filterStateMock: MyPerformanceFilterState;

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
        SubAccountsApiService,
        ApiHelperService
      ]
    });
  });

  beforeEach(inject([SubAccountsApiService, MockBackend], (_subAccountsApiService: SubAccountsApiService, _mockBackend: MockBackend) => {
    subAccountsApiService = _subAccountsApiService;
    mockBackend = _mockBackend;

    subAccountIdMock = chance.string(chanceStringOptions);
    positionIdMock = chance.string(chanceStringOptions);
    filterStateMock = {
      metricType: MetricTypeValue.Depletions,
      dateRangeCode: getDateRangeTimePeriodValueMock(),
      premiseType: getPremiseTypeValueMock()
    };
  }));

  describe(`getSubAccountOpportunityCounts`, () => {
    let countStructureMock: string;
    let segmentMock: string;
    let impactMock: string;
    let typeMock: string;
    let opportunityCountDTOsMock: Array<OpportunityCountDTO>;
    let expectedRequestUrl: string;

    beforeEach(() => {
      countStructureMock = chance.string(chanceStringOptions);
      segmentMock = chance.string(chanceStringOptions);
      impactMock = chance.string(chanceStringOptions);
      typeMock = chance.string(chanceStringOptions);
      opportunityCountDTOsMock = getOpportunityCountDTOsMock();
      expectedRequestUrl = `/v3/subAccounts/${ subAccountIdMock }/opportunityCounts`
        + `?positionIds=${ positionIdMock }`
        + `&premiseType=${ filterStateMock.premiseType }`
        + `&countStructureType=${ countStructureMock }`
        + `&segment=${ segmentMock }`
        + `&impact=${ impactMock}`
        + `&type=${ typeMock }`;
    });

    it('should call the SubAccount Opportunity Counts endpoint and return OpportunityCountDTO data when successful', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(opportunityCountDTOsMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl);
      });

      subAccountsApiService.getSubAccountOpportunityCounts(
        subAccountIdMock,
        positionIdMock,
        filterStateMock.premiseType,
        countStructureMock,
        segmentMock,
        impactMock,
        typeMock
      )
      .subscribe((response: ProductMetricsDTO[]) => {
        expect(response).toEqual(opportunityCountDTOsMock);
        done();
      });
    });
  });

  describe('getSubAccountPerformance', () => {
    let brandSkuCodeMock: string;
    let skuPackageTypeMock: SkuPackageType;

    beforeEach(() => {
      brandSkuCodeMock = chance.string(chanceStringOptions);
      skuPackageTypeMock = SkuPackageType.sku;
    });

    it('should call the SubAccount Performance endpoint and return PerformanceDTO data for the given SubAccount', (done) => {
      const performanceDTOResponseMock: PerformanceDTO = getPerformanceDTOMock();
      const expectedRequestUrl: string = `/v3/subAccounts/${ subAccountIdMock }/performanceTotal`
        + `?positionId=${ positionIdMock }`
        + `&metricType=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`
        + `&masterSKU=${ brandSkuCodeMock }`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceDTOResponseMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl);
      });

      subAccountsApiService.getSubAccountPerformance(
        subAccountIdMock,
        positionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      )
      .subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(performanceDTOResponseMock);
        done();
      });
    });

    it('should call the SubAccount Performance endpoint and return empty PerformanceDTO data when response is 404', (done) => {
      const expectedEmptyPerformanceDTOResponseMock: PerformanceDTO = {
        total: 0,
        totalYearAgo: 0
      };

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      subAccountsApiService.getSubAccountPerformance(
        subAccountIdMock,
        positionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      ).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expectedEmptyPerformanceDTOResponseMock);
        done();
      });
    });
  });

  describe('getSubAccountProductMetrics', () => {
    it('should call the SubAccounts Product Metrics endpoint and return ProductMetricDTO data for the given SubAccount', (done) => {
      const expectedProductMetricsDTOResponseMock: ProductMetricsDTO = getProductMetricsBrandDTOMock();
      const expectedRequestUrl: string = `/v3/subAccounts/${ subAccountIdMock }/productMetrics`
        + `?positionId=${ positionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.brand }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(expectedProductMetricsDTOResponseMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl);
      });

      subAccountsApiService.getSubAccountProductMetrics(
        subAccountIdMock,
        positionIdMock,
        ProductMetricsAggregationType.brand,
        filterStateMock
      )
      .subscribe((response: ProductMetricsDTO) => {
        expect(response).toEqual(expectedProductMetricsDTOResponseMock);
        done();
      });
    });

    it('should return a response with an empty brandValues array when fetching product metrics for'
    + ' a brand aggregation type and the API call returns a 404 error', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      subAccountsApiService.getSubAccountProductMetrics(
        subAccountIdMock,
        positionIdMock,
        ProductMetricsAggregationType.brand,
        filterStateMock
      )
      .subscribe((response: ProductMetricsDTO) => {
        expect(response).toBeDefined();
        expect(response.brandValues).toEqual([]);
        done();
      });
    });

    it('should return a response with an empty skuValues array when fetching product metrics for'
    + ' a sku aggregation type and the API call returns a 404 error', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      subAccountsApiService.getSubAccountProductMetrics(
        subAccountIdMock,
        positionIdMock,
        ProductMetricsAggregationType.sku,
        filterStateMock
      )
      .subscribe((response: ProductMetricsDTO) => {
        expect(response).toBeDefined();
        expect(response.skuValues).toEqual([]);
        done();
      });
    });
  });
});
