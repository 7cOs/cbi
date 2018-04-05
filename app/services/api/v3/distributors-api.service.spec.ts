import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { ApiRequestType } from '../../../enums/api-request-type.enum';
import { chanceStringOptions } from '../../../lib/spec-util';
import { DistributorsApiService } from './distributors-api.service';
import { getDateRangeTimePeriodValueMock } from '../../../enums/date-range-time-period.enum.mock';
import { getMetricTypeValueMock } from '../../../enums/metric-type.enum.mock';
import { getOpportunityCountDTOsMock } from '../../../models/opportunity-count-dto.model.mock';
import { getPerformanceDTOMock } from '../../../models/performance-dto.model.mock';
import { getPremiseTypeValueMock } from '../../../enums/premise-type.enum.mock';
import { getProductMetricsBrandDTOMock } from '../../../models/product-metrics.model.mock';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { OpportunityCountDTO } from '../../../models/opportunity-count-dto.model';
import { PerformanceDTO } from '../../../models/performance-dto.model';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';
import { V3ApiHelperService } from './v3-api-helper.service';

describe('DistributorsApiService', () => {
  let testBed: TestBed;
  let http: HttpTestingController;
  let distributorsApiService: DistributorsApiService;

  let distributorIdMock: string;
  let positionIdMock: string;
  let filterStateMock: MyPerformanceFilterState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ DistributorsApiService, V3ApiHelperService ]
    });

    testBed = getTestBed();
    http = testBed.get(HttpTestingController);
    distributorsApiService = testBed.get(DistributorsApiService);

    distributorIdMock = chance.string(chanceStringOptions);
    positionIdMock = chance.string(chanceStringOptions);
    filterStateMock = {
      metricType: getMetricTypeValueMock(),
      dateRangeCode: getDateRangeTimePeriodValueMock(),
      premiseType: getPremiseTypeValueMock()
    };
  });

  afterEach(() => {
    http.verify();
  });

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

    it('should call the distributor opportunity counts endpoint and return OpportunityCountDTO data when successful', () => {
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
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl + expectedRequestParams);
      req.flush(opportunityCountDTOsMock);

      expect(req.request.method).toBe(ApiRequestType.GET);
    });

    it('should call the distirbutor opportunity counts endpoint with no `positionIds` query param when'
    + ' no positionId is passed in', () => {
      expectedRequestParams = `?premiseType=${ filterStateMock.premiseType }`
        + `&countStructureType=${ countStructureTypeMock }`
        + `&segment=${ segmentMock }`
        + `&impact=${ impactMock }`
        + `&type=${ typeMock }`;

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
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl + expectedRequestParams);
      req.flush(opportunityCountDTOsMock);

      expect(req.request.method).toBe(ApiRequestType.GET);
    });
  });

  describe('getDistributorPerformance', () => {
    let brandSkuCodeMock: string;
    let skuPackageTypeMock: SkuPackageType;
    let expectedRequestUrl: string;

    beforeEach(() => {
      brandSkuCodeMock = chance.string(chanceStringOptions);
      skuPackageTypeMock = SkuPackageType.sku;
      expectedRequestUrl = `/v3/distributors/${ distributorIdMock }/performanceTotal`
        + `?positionId=${ positionIdMock }`
        + `&metricType=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`
        + `&masterSKU=${ brandSkuCodeMock }`;
    });

    it('should call the distributor performance endpoint and return PerformanceDTO data for the passed in distributor', () => {
      const expectedPerformanceDTOResponseMock: PerformanceDTO = getPerformanceDTOMock();

      distributorsApiService.getDistributorPerformance(
        distributorIdMock,
        positionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      ).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expectedPerformanceDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(expectedPerformanceDTOResponseMock);

      expect(req.request.method).toBe(ApiRequestType.GET);
    });

    it('should call the distributor performance endpoint and return empty PerformanceDTO data when response is 404', () => {
      const expectedEmptyPerformanceDTOResponseMock: PerformanceDTO = {
        total: 0,
        totalYearAgo: 0
      };

      distributorsApiService.getDistributorPerformance(
        distributorIdMock,
        positionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      ).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expectedEmptyPerformanceDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush({}, { status: 404, statusText: chance.string() });
    });
  });

  describe('getDistributorProductMetrics', () => {
    let expectedRequestUrl: string;
    let productMetricsDTOResponseMock: ProductMetricsDTO;

    beforeEach(() => {
      expectedRequestUrl = `/v3/distributors/${ distributorIdMock }/productMetrics`
        + `?positionId=${ positionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.brand }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;
      productMetricsDTOResponseMock = getProductMetricsBrandDTOMock();
    });

    it('should call the distributors product metrics endpoint and return ProductMetricDTO data for the passed in distributor', () => {
      distributorsApiService.getDistributorProductMetrics(
        distributorIdMock,
        positionIdMock,
        ProductMetricsAggregationType.brand,
        filterStateMock
      )
      .subscribe((response: ProductMetricsDTO) => {
        expect(response).toEqual(productMetricsDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(productMetricsDTOResponseMock);

      expect(req.request.method).toBe(ApiRequestType.GET);
    });

    it('should call the distributors product metrics endpoint with no positionId query param when no positionId is passed in', () => {
      expectedRequestUrl = `/v3/distributors/${ distributorIdMock }/productMetrics`
        + `?aggregationLevel=${ ProductMetricsAggregationType.brand }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      distributorsApiService.getDistributorProductMetrics(
        distributorIdMock,
        undefined,
        ProductMetricsAggregationType.brand,
        filterStateMock
      )
      .subscribe((response: ProductMetricsDTO) => {
        expect(response).toEqual(productMetricsDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(productMetricsDTOResponseMock);

      expect(req.request.method).toBe(ApiRequestType.GET);
    });

    it('should return a response with an empty brandValues array when fetching product metrics for'
    + ' a brand aggregation type and the API call returns a 404 error', () => {
      distributorsApiService.getDistributorProductMetrics(
        distributorIdMock,
        positionIdMock,
        ProductMetricsAggregationType.brand,
        filterStateMock
      )
      .subscribe((response: ProductMetricsDTO) => {
        expect(response).toBeDefined();
        expect(response.brandValues).toEqual([]);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush({}, { status: 404, statusText: chance.string() });
    });

    it('should return a response with an empty skuValues array when fetching product metrics for'
    + ' a sku aggregation type and the API call returns a 404 error', () => {
      expectedRequestUrl = `/v3/distributors/${ distributorIdMock }/productMetrics`
        + `?positionId=${ positionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.sku }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      distributorsApiService.getDistributorProductMetrics(
        distributorIdMock,
        positionIdMock,
        ProductMetricsAggregationType.sku,
        filterStateMock
      )
      .subscribe((response: ProductMetricsDTO) => {
        expect(response).toBeDefined();
        expect(response.skuValues).toEqual([]);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush({}, { status: 404, statusText: chance.string() });
    });
  });
});
