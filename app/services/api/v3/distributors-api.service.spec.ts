import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions, ResponseType } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { ApiHelperService } from '../../api-helper.service';
import { DistributorsApiService } from './distributors-api.service';
import { getDateRangeTimePeriodValueMock } from '../../../enums/date-range-time-period.enum.mock';
import { getOpportunityCountDTOsMock } from '../../../models/opportunity-count-dto.model.mock';
import { getPerformanceDTOMock } from '../../../models/performance.model.mock';
import { getPremiseTypeMock } from '../../../enums/premise-type.enum.mock';
import { getProductMetricsBrandDTOMock } from '../../../models/product-metrics.model.mock';
import { MetricTypeValue } from '../../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { OpportunityCountDTO } from '../../../models/opportunity-count-dto.model';
import { PerformanceDTO } from '../../../models/performance.model';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';

const chanceStringOptions = {
  pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
};

describe('DistributorsApiService', () => {
  let distributorsApiService: DistributorsApiService;
  let mockBackend: MockBackend;

  let distributorIdMock: string;
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
        DistributorsApiService,
        ApiHelperService
      ]
    });
  });

  beforeEach(inject([DistributorsApiService, MockBackend], (_distributorsApiService: DistributorsApiService, _mockBackend: MockBackend) => {
    distributorsApiService = _distributorsApiService;
    mockBackend = _mockBackend;

    distributorIdMock = chance.string(chanceStringOptions);
    positionIdMock = chance.string(chanceStringOptions);
    filterStateMock = {
      metricType: MetricTypeValue.Depletions,
      dateRangeCode: getDateRangeTimePeriodValueMock(),
      premiseType: getPremiseTypeMock()
    };
  }));

  describe('getDistributorOpportunityCounts', () => {
    let countStructureTypeMock: string;
    let segmentMock: string;
    let impactMock: string;
    let typeMock: string;
    let opportunityCountDTOsMock: Array<OpportunityCountDTO>;
    let expectedRequestUrl: string;
    let expectedRequestParams: string;

    beforeEach(() => {
      countStructureTypeMock = chance.string(chanceStringOptions);
      segmentMock = chance.string(chanceStringOptions);
      impactMock = chance.string(chanceStringOptions);
      typeMock = chance.string(chanceStringOptions);
      opportunityCountDTOsMock = getOpportunityCountDTOsMock();
      expectedRequestUrl = `/v3/distributors/${ distributorIdMock }/opportunityCounts`;
      expectedRequestParams = `?positionIds=${ positionIdMock }`
        + `&premiseType=${ filterStateMock.premiseType }`
        + `&countStructureType=${ countStructureTypeMock }`
        + `&segment=${ segmentMock }`
        + `&impact=${ impactMock }`
        + `&type=${ typeMock }`;
    });

    it('should call the distributor opportunity counts endpoint and return OpportunityCountDTO data when successful', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(opportunityCountDTOsMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl + expectedRequestParams);
      });

      distributorsApiService.getDistributorOpportunityCounts(
        distributorIdMock,
        positionIdMock,
        filterStateMock.premiseType,
        countStructureTypeMock,
        segmentMock,
        impactMock,
        typeMock
      )
      .subscribe((response: OpportunityCountDTO[]) => {
        expect(response).toEqual(opportunityCountDTOsMock);
        done();
      });
    });

    it('should call the distirbutor opportunity counts endpoint with no `positionIds` query param when'
    + ' no positionId is passed in', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(opportunityCountDTOsMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl
          + `?premiseType=${ filterStateMock.premiseType }`
          + `&countStructureType=${ countStructureTypeMock }`
          + `&segment=${ segmentMock }`
          + `&impact=${ impactMock }`
          + `&type=${ typeMock }`);
      });

      distributorsApiService.getDistributorOpportunityCounts(
        distributorIdMock,
        undefined,
        filterStateMock.premiseType,
        countStructureTypeMock,
        segmentMock,
        impactMock,
        typeMock
      )
      .subscribe((response: Array<OpportunityCountDTO>) => {
        expect(response).toEqual(opportunityCountDTOsMock);
        done();
      });
    });
  });

  describe('getDistributorPerformance', () => {
    let brandSkuCodeMock: string;
    let skuPackageTypeMock: SkuPackageType;

    beforeEach(() => {
      brandSkuCodeMock = chance.string(chanceStringOptions);
      skuPackageTypeMock = SkuPackageType.sku;
    });

    it('should call the distributor performance endpoint and return PerformanceDTO data for the passed in distributor', (done) => {
      const expectedPerformanceDTOResponseMock: PerformanceDTO = getPerformanceDTOMock();
      const expectedRequestUrl: string = `/v3/distributors/${ distributorIdMock }/performanceTotal`
        + `?positionId=${ positionIdMock }`
        + `&metricType=volume`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`
        + `&masterSKU=${ brandSkuCodeMock }`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(expectedPerformanceDTOResponseMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl);
      });

      distributorsApiService.getDistributorPerformance(
        distributorIdMock,
        positionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      ).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expectedPerformanceDTOResponseMock);
        done();
      });
    });

    it('should call the distributor performance endpoint and return empty PerformanceDTO data when response is 404', (done) => {
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

      distributorsApiService.getDistributorPerformance(
        distributorIdMock,
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

  describe('getDistributorProductMetrics', () => {
    it('should call the distributors product metrics endpoint and return ProductMetricDTO data for the passed in distributor', (done) => {
      const expectedProductMetricsDTOResponseMock: ProductMetricsDTO = getProductMetricsBrandDTOMock();
      const expectedRequestUrl: string = `/v3/distributors/${ distributorIdMock }/productMetrics`
        + `?positionId=${ positionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.brand }`
        + `&metricType=volume`
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

      distributorsApiService.getDistributorProductMetrics(
        distributorIdMock,
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

      distributorsApiService.getDistributorProductMetrics(
        distributorIdMock,
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

      distributorsApiService.getDistributorProductMetrics(
        distributorIdMock,
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
