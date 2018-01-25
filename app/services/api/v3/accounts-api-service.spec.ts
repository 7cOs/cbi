import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions, ResponseType } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { AccountsApiService } from './accounts-api.service';
import { ApiHelperService } from '../api-helper.service';
import { EntitySubAccountDTO } from '../../../models/entity-subaccount-dto.model';
import { getDateRangeTimePeriodValueMock } from '../../../enums/date-range-time-period.enum.mock';
import { getEntitySubAccountDTOMock } from '../../../models/entity-subaccount-dto.model.mock';
import { getPerformanceDTOMock } from '../../../models/performance.model.mock';
import { getPremiseTypeMock } from '../../../enums/premise-type.enum.mock';
import { getProductMetricsBrandDTOMock } from '../../../models/product-metrics.model.mock';
import { MetricTypeValue } from '../../../enums/metric-type.enum';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { PerformanceDTO } from '../../../models/performance.model';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';

const chanceStringOptions = {
  pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
};

describe('AccountsApiService', () => {
  let accountsApiService: AccountsApiService;
  let mockBackend: MockBackend;

  let accountIdMock: string;
  let positionIdMock: string;
  let brandSkuCodeMock: string;
  let skuPackageTypeMock: SkuPackageType;
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
        AccountsApiService,
        ApiHelperService
      ]
    });
  });

  beforeEach(inject([AccountsApiService, MockBackend], (_accountsApiService: AccountsApiService, _mockBackend: MockBackend) => {
    accountsApiService = _accountsApiService;
    mockBackend = _mockBackend;

    accountIdMock = chance.string(chanceStringOptions);
    positionIdMock = chance.string(chanceStringOptions);
    brandSkuCodeMock = chance.string(chanceStringOptions);
    skuPackageTypeMock = SkuPackageType.sku;
    filterStateMock = {
      metricType: MetricTypeValue.Depletions,
      dateRangeCode: getDateRangeTimePeriodValueMock(),
      premiseType: getPremiseTypeMock()
    };
  }));

  describe('getAccountPerformance', () => {
    it('should call the account performance endpoint and return PerformanceDTO data for the passed in account', (done) => {
      const expectedPerformanceDTOResponseMock: PerformanceDTO = getPerformanceDTOMock();
      const expectedRequestUrl: string = `/v3/accounts/${ accountIdMock }/performanceTotal`
        + `?positionId=${ positionIdMock }`
        + `&metricType=${ filterStateMock.metricType.toLowerCase() }`
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

      accountsApiService.getAccountPerformance(
        accountIdMock,
        positionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      ).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expectedPerformanceDTOResponseMock);
        done();
      });
    });

    it('should call the account performance endpoint and return empty PerformanceDTO data when response is 404', (done) => {
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

      accountsApiService.getAccountPerformance(
        accountIdMock,
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

  describe('getAccountProductMetrics', () => {
    let productMetricsDTOMock: ProductMetricsDTO;

    beforeEach(() => {
      productMetricsDTOMock = getProductMetricsBrandDTOMock();
    });

    it('should call the accounts product metrics endpoint and return ProductMetricsDTO data for the passed in account', (done) => {
      const expectedRequestUrl: string = `/v3/accounts/${ accountIdMock }/productMetrics`
        + `?positionId=${ positionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.brand }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl);
      });

      accountsApiService.getAccountProductMetrics(
        accountIdMock,
        positionIdMock,
        ProductMetricsAggregationType.brand,
        filterStateMock
      ).subscribe((response: ProductMetricsDTO) => {
        expect(response).toEqual(productMetricsDTOMock);
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

      accountsApiService.getAccountProductMetrics(
        accountIdMock,
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

      accountsApiService.getAccountProductMetrics(
        accountIdMock,
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

  describe('getSubAccounts', () => {
    it('should call the accounts/subAcccount endpoint and return subAccounts under the passed in account', (done) => {
      const subAccountsDTOMock: EntitySubAccountDTO[] = [getEntitySubAccountDTOMock(), getEntitySubAccountDTOMock()];
      const expectedRequestUrl: string = `/v3/accounts/${ accountIdMock }/subAccounts`
        + `?positionId=${ positionIdMock }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(subAccountsDTOMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toBe(RequestMethod.Get);
        expect(connection.request.url).toBe(expectedRequestUrl);
      });

      accountsApiService.getSubAccounts(
        accountIdMock,
        positionIdMock,
        filterStateMock.premiseType
      )
      .subscribe((response: EntitySubAccountDTO[]) => {
        expect(response).toEqual(subAccountsDTOMock);
        done();
      });
    });
  });
});
