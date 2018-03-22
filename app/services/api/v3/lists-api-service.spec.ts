import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { AccountsApiService } from './accounts-api.service';
import { ApiRequestType } from '../../../enums/api-request-type.enum';
import { chanceStringOptions } from '../../../lib/spec-util';
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
import { V3ApiHelperService } from './v3-api-helper.service';
import { ListsApiService } from './lists-api.service';

describe('ListsApiService', () => {
  let testBed: TestBed;
  let http: HttpTestingController;
  let listsApiService: ListsApiService;

  let listIdMock: string;
  let positionIdMock: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ListsApiService, V3ApiHelperService ]
    });

    testBed = getTestBed();
    http = testBed.get(HttpTestingController);
    listsApiService = testBed.get(ListsApiService);

    listIdMock = chance.string(chanceStringOptions);
    positionIdMock = chance.string(chanceStringOptions);
  });

  afterEach(() => {
    http.verify();
  });

  describe('getStorePerformance', () => {
    let expectedRequestUrl: string;

    beforeEach(() => {
      expectedRequestUrl = `/v3/lists/${ listIdMock }`
        + `?positionId=${ positionIdMock }`;
    });

    it('should call the stores information endpoint and return stores data for the given list ID', () => {
      const performanceDTOResponseMock: PerformanceDTO = getPerformanceDTOMock();

      listsApiService.getStorePerformance(
        listIdMock,
        positionIdMock
      )
        .subscribe((response: PerformanceDTO) => {
          expect(response).toEqual(performanceDTOResponseMock);
        });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(performanceDTOResponseMock);

      expect(req.request.method).toBe(ApiRequestType.GET);
    });

    it('should call the Store Details endpoint and return empty data when response is 404', () => {
      const expectedEmptyPerformanceDTOResponseMock: PerformanceDTO = {
        total: 0,
        totalYearAgo: 0
      };

      listsApiService.getStorePerformance(
        listIdMock,
        positionIdMock
      )
        .subscribe((response: PerformanceDTO) => {
          expect(response).toEqual(expectedEmptyPerformanceDTOResponseMock);
        });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush({}, { status: 404, statusText: chance.string() });
    });
  });
  describe('getHeaderDetail', () => {
    let expectedRequestUrl: string;
    beforeEach(() => {
      expectedRequestUrl = `/v3/lists/${ listIdMock }`
        + `?positionId=${ positionIdMock }`;
    });

    it('should call the store header information endpoint and return data for the given list', () => {
      const performanceDTOResponseMock: PerformanceDTO = getPerformanceDTOMock();

      listsApiService.getHeaderDetail(
        listIdMock,
        positionIdMock
      )
        .subscribe((response: PerformanceDTO) => {
          expect(response).toEqual(performanceDTOResponseMock);
        });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(performanceDTOResponseMock);

      expect(req.request.method).toBe(ApiRequestType.GET);
    });

    it('should call the store header information endpoint and return empty PerformanceDTO data when response is 404', () => {
      const expectedEmptyPerformanceDTOResponseMock: PerformanceDTO = {
        total: 0,
        totalYearAgo: 0
      };

      listsApiService.getHeaderDetail(
        listIdMock,
        positionIdMock
      )
        .subscribe((response: PerformanceDTO) => {
          expect(response).toEqual(expectedEmptyPerformanceDTOResponseMock);
        });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush({}, { status: 404, statusText: chance.string() });
    });
  });
});
