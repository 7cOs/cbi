import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { AccountsApiService } from './accounts-api.service';
import { ApiHelperService } from '../api-helper.service';
import { EntitySubAccountDTO } from '../../../models/entity-subaccount-dto.model';
import { getDateRangeTimePeriodValueMock } from '../../../enums/date-range-time-period.enum.mock';
import { getEntitySubAccountDTOMock } from '../../../models/entity-subaccount-dto.model.mock';
import { getMetricTypeValueMock } from '../../../enums/metric-type.enum.mock';
import { getPerformanceDTOMock } from '../../../models/performance.model.mock';
import { getPremiseTypeValueMock } from '../../../enums/premise-type.enum.mock';
import { getProductMetricsBrandDTOMock } from '../../../models/product-metrics.model.mock';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { PerformanceDTO } from '../../../models/performance.model';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';

const chanceStringOptions = {
  pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
};

describe('AccountsApiService', () => {
  let testBed: TestBed;
  let http: HttpTestingController;
  let accountsApiService: AccountsApiService;

  let accountIdMock: string;
  let positionIdMock: string;
  let brandSkuCodeMock: string;
  let skuPackageTypeMock: SkuPackageType;
  let filterStateMock: MyPerformanceFilterState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AccountsApiService, ApiHelperService ]
    });

    testBed = getTestBed();
    http = testBed.get(HttpTestingController);
    accountsApiService = testBed.get(AccountsApiService);

    accountIdMock = chance.string(chanceStringOptions);
    positionIdMock = chance.string(chanceStringOptions);
    brandSkuCodeMock = chance.string(chanceStringOptions);
    skuPackageTypeMock = SkuPackageType.sku;
    filterStateMock = {
      metricType: getMetricTypeValueMock(),
      dateRangeCode: getDateRangeTimePeriodValueMock(),
      premiseType: getPremiseTypeValueMock()
    };
  });

  afterEach(() => {
    http.verify();
  });

  describe('getAccountPerformance', () => {
    let expectedRequestUrl: string;

    beforeEach(() => {
      expectedRequestUrl = `/v3/accounts/${ accountIdMock }/performanceTotal`
        + `?positionId=${ positionIdMock }`
        + `&metricType=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`
        + `&masterSKU=${ brandSkuCodeMock }`;
    });

    it('should call the account performance endpoint and return PerformanceDTO data for the passed in account', () => {
      const expectedPerformanceDTOResponseMock: PerformanceDTO = getPerformanceDTOMock();

      accountsApiService.getAccountPerformance(
        accountIdMock,
        positionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      ).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expectedPerformanceDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(expectedPerformanceDTOResponseMock);

      expect(req.request.method).toBe('GET');
    });

    it('should call the account performance endpoint and return empty PerformanceDTO data when response is 404', () => {
      const expectedEmptyPerformanceDTOResponseMock: PerformanceDTO = {
        total: 0,
        totalYearAgo: 0
      };

      accountsApiService.getAccountPerformance(
        accountIdMock,
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

  describe('getAccountProductMetrics', () => {
    let productMetricsDTOMock: ProductMetricsDTO;
    let expectedRequestUrl: string;

    beforeEach(() => {
      productMetricsDTOMock = getProductMetricsBrandDTOMock();
      expectedRequestUrl = `/v3/accounts/${ accountIdMock }/productMetrics`
        + `?positionId=${ positionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.brand }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;
    });

    it('should call the accounts product metrics endpoint and return ProductMetricsDTO data for the passed in account', () => {
      accountsApiService.getAccountProductMetrics(
        accountIdMock,
        positionIdMock,
        ProductMetricsAggregationType.brand,
        filterStateMock
      ).subscribe((response: ProductMetricsDTO) => {
        expect(response).toEqual(productMetricsDTOMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(productMetricsDTOMock);

      expect(req.request.method).toBe('GET');
    });

    it('should return a response with an empty brandValues array when fetching product metrics for'
    + ' a brand aggregation type and the API call returns a 404 error', () => {
      accountsApiService.getAccountProductMetrics(
        accountIdMock,
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
      expectedRequestUrl = `/v3/accounts/${ accountIdMock }/productMetrics`
        + `?positionId=${ positionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.sku }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      accountsApiService.getAccountProductMetrics(
        accountIdMock,
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

  describe('getSubAccounts', () => {
    it('should call the accounts/subAcccount endpoint and return subAccounts under the passed in account', () => {
      const subAccountsDTOMock: EntitySubAccountDTO[] = [getEntitySubAccountDTOMock(), getEntitySubAccountDTOMock()];
      const expectedRequestUrl: string = `/v3/accounts/${ accountIdMock }/subAccounts`
        + `?positionId=${ positionIdMock }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      accountsApiService.getSubAccounts(
        accountIdMock,
        positionIdMock,
        filterStateMock.premiseType
      )
      .subscribe((response: EntitySubAccountDTO[]) => {
        expect(response).toEqual(subAccountsDTOMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(subAccountsDTOMock);

      expect(req.request.method).toBe('GET');
    });
  });
});
