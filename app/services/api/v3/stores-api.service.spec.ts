import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { ApiRequestType } from '../../../enums/api-request-type.enum';
import { chanceStringOptions } from '../../../lib/spec-util';
import { getDateRangeTimePeriodValueMock } from '../../../enums/date-range-time-period.enum.mock';
import { getMetricTypeValueMock } from '../../../enums/metric-type.enum.mock';
import { getPerformanceDTOMock } from '../../../models/performance-dto.model.mock';
import { getPremiseTypeValueMock } from '../../../enums/premise-type.enum.mock';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { PerformanceDTO } from '../../../models/performance-dto.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';
import { StoresApiService } from './stores-api.service';
import { V3ApiHelperService } from './v3-api-helper.service';

describe('StoresApiService', () => {
  let testBed: TestBed;
  let http: HttpTestingController;
  let storesApiService: StoresApiService;

  let storeIdMock: string;
  let positionIdMock: string;
  let filterStateMock: MyPerformanceFilterState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        StoresApiService,
        V3ApiHelperService
      ]
    });

    testBed = getTestBed();
    http = testBed.get(HttpTestingController);
    storesApiService = testBed.get(StoresApiService);

    storeIdMock = chance.string(chanceStringOptions);
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

  describe('getStorePerformance', () => {
    let brandSkuCodeMock: string;
    let skuPackageTypeMock: SkuPackageType;
    let expectedRequestUrl: string;

    beforeEach(() => {
      brandSkuCodeMock = chance.string(chanceStringOptions);
      skuPackageTypeMock = SkuPackageType.sku;
      expectedRequestUrl = `/v3/versionedStores/${ storeIdMock }/performanceTotal`
        + `?positionId=${ positionIdMock }`
        + `&metricType=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`
        + `&masterSKU=${ brandSkuCodeMock }`;
    });

    it('should call the Versioned Stores Performance endpoint and return PerformanceDTO data for the given StoreId', () => {
      const performanceDTOResponseMock: PerformanceDTO = getPerformanceDTOMock();

      storesApiService.getStorePerformance(
        storeIdMock,
        positionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      ).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(performanceDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(performanceDTOResponseMock);

      expect(req.request.method).toBe(ApiRequestType.GET);
    });

    it('should call the Versioned Stores Performance endpoint and return empty PerformanceDTO data when response is 404', () => {
      const expectedEmptyPerformanceDTOResponseMock: PerformanceDTO = {
        total: 0,
        totalYearAgo: 0
      };

      storesApiService.getStorePerformance(
        storeIdMock,
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
});
