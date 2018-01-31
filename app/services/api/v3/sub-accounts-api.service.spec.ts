import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { getDateRangeTimePeriodValueMock } from '../../../enums/date-range-time-period.enum.mock';
import { getMetricTypeValueMock } from '../../../enums/metric-type.enum.mock';
import { getOpportunityCountDTOsMock } from '../../../models/opportunity-count-dto.model.mock';
import { getPerformanceDTOMock } from '../../../models/performance.model.mock';
import { getPremiseTypeValueMock } from '../../../enums/premise-type.enum.mock';
import { getProductMetricsBrandDTOMock } from '../../../models/product-metrics.model.mock';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { OpportunityCountDTO } from '../../../models/opportunity-count-dto.model';
import { PerformanceDTO } from '../../../models/performance.model';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';
import { SubAccountsApiService } from './sub-accounts-api.service';
import { V3ApiHelperService } from './v3-api-helper.service';

const chanceStringOptions = {
  pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
};

describe('SubAccountsApiService', () => {
  let testBed: TestBed;
  let http: HttpTestingController;
  let subAccountsApiService: SubAccountsApiService;

  let subAccountIdMock: string;
  let positionIdMock: string;
  let filterStateMock: MyPerformanceFilterState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ SubAccountsApiService, V3ApiHelperService ]
    });

    testBed = getTestBed();
    http = testBed.get(HttpTestingController);
    subAccountsApiService = testBed.get(SubAccountsApiService);

    subAccountIdMock = chance.string(chanceStringOptions);
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

    it('should call the SubAccount Opportunity Counts endpoint and return OpportunityCountDTO data when successful', () => {
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
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(opportunityCountDTOsMock);

      expect(req.request.method).toBe('GET');
    });
  });

  describe('getSubAccountPerformance', () => {
    let brandSkuCodeMock: string;
    let skuPackageTypeMock: SkuPackageType;
    let expectedRequestUrl: string;

    beforeEach(() => {
      brandSkuCodeMock = chance.string(chanceStringOptions);
      skuPackageTypeMock = SkuPackageType.sku;
      expectedRequestUrl = `/v3/subAccounts/${ subAccountIdMock }/performanceTotal`
        + `?positionId=${ positionIdMock }`
        + `&metricType=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`
        + `&masterSKU=${ brandSkuCodeMock }`;
    });

    it('should call the SubAccount Performance endpoint and return PerformanceDTO data for the given SubAccount', () => {
      const performanceDTOResponseMock: PerformanceDTO = getPerformanceDTOMock();

      subAccountsApiService.getSubAccountPerformance(
        subAccountIdMock,
        positionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      )
      .subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(performanceDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(performanceDTOResponseMock);

      expect(req.request.method).toBe('GET');
    });

    it('should call the SubAccount Performance endpoint and return empty PerformanceDTO data when response is 404', () => {
      const expectedEmptyPerformanceDTOResponseMock: PerformanceDTO = {
        total: 0,
        totalYearAgo: 0
      };

      subAccountsApiService.getSubAccountPerformance(
        subAccountIdMock,
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

  describe('getSubAccountProductMetrics', () => {
    let expectedRequestUrl: string;
    let productMetricsDTOResponseMock: ProductMetricsDTO;

    beforeEach(() => {
      expectedRequestUrl = `/v3/subAccounts/${ subAccountIdMock }/productMetrics`
        + `?positionId=${ positionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.brand }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;
      productMetricsDTOResponseMock = getProductMetricsBrandDTOMock();
    });

    it('should call the SubAccounts Product Metrics endpoint and return ProductMetricDTO data for the given SubAccount', () => {
      subAccountsApiService.getSubAccountProductMetrics(
        subAccountIdMock,
        positionIdMock,
        ProductMetricsAggregationType.brand,
        filterStateMock
      )
      .subscribe((response: ProductMetricsDTO) => {
        expect(response).toEqual(productMetricsDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(productMetricsDTOResponseMock);

      expect(req.request.method).toBe('GET');
    });

    it('should call the SubAccounts Product Metrics endpoint without a positionId query param when no positionId is passed in', () => {
      expectedRequestUrl = `/v3/subAccounts/${ subAccountIdMock }/productMetrics`
        + `?aggregationLevel=${ ProductMetricsAggregationType.brand }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      subAccountsApiService.getSubAccountProductMetrics(
        subAccountIdMock,
        undefined,
        ProductMetricsAggregationType.brand,
        filterStateMock
      )
      .subscribe((response: ProductMetricsDTO) => {
        expect(response).toEqual(productMetricsDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(productMetricsDTOResponseMock);

      expect(req.request.method).toBe('GET');
    });

    it('should return a response with an empty brandValues array when fetching product metrics for'
    + ' a brand aggregation type and the API call returns a 404 error', () => {
      subAccountsApiService.getSubAccountProductMetrics(
        subAccountIdMock,
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
      expectedRequestUrl = `/v3/subAccounts/${ subAccountIdMock }/productMetrics`
        + `?positionId=${ positionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.sku }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      subAccountsApiService.getSubAccountProductMetrics(
        subAccountIdMock,
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
