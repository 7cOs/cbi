import { getTestBed, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';

import { ApiHelperService } from '../api-helper.service';
import { EntityDTO } from '../../../models/entity-dto.model';
import { getDateRangeTimePeriodValueMock } from '../../../enums/date-range-time-period.enum.mock';
import { getEntityDTOMock } from '../../../models/entity-dto.model.mock';
import { getMetricTypeValueMock } from '../../../enums/metric-type.enum.mock';
import { getPeopleResponsibilitiesDTOMock } from '../../../models/people-responsibilities-dto.model.mock';
import { getPerformanceDTOMock } from '../../../models/performance.model.mock';
import { getPremiseTypeValueMock } from '../../../enums/premise-type.enum.mock';
import { getProductMetricsBrandDTOMock } from '../../../models/product-metrics.model.mock';
import { MyPerformanceFilterState } from '../../../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../../../models/people-responsibilities-dto.model';
import { PerformanceDTO } from '../../../models/performance.model';
import { PositionsApiService } from './positions-api.service';
import { ProductMetricsAggregationType } from '../../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsDTO } from '../../../models/product-metrics.model';
import { SkuPackageType } from '../../../enums/sku-package-type.enum';

const chanceStringOptions = {
  pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
};
const expectedEmptyPerformanceDTOResponseMock: PerformanceDTO = {
  total: 0,
  totalYearAgo: 0
};

describe('PositionsApiService', () => {
  let testBed: TestBed;
  let http: HttpTestingController;
  let positionsApiService: PositionsApiService;

  let positionIdMock: string;
  let alternateHierarchyPositionIdMock: string;
  let groupTypeCodeMock: string;
  let brandSkuCodeMock: string;
  let skuPackageTypeMock: SkuPackageType;
  let performanceDTOResponseMock: PerformanceDTO;
  let productMetricsDTOResponseMock: ProductMetricsDTO;
  let filterStateMock: MyPerformanceFilterState;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ApiHelperService, PositionsApiService ]
    });

    testBed = getTestBed();
    http = testBed.get(HttpTestingController);
    positionsApiService = testBed.get(PositionsApiService);

    positionIdMock = chance.string(chanceStringOptions);
    alternateHierarchyPositionIdMock = chance.string(chanceStringOptions);
    groupTypeCodeMock = chance.string(chanceStringOptions);
    brandSkuCodeMock = chance.string(chanceStringOptions);
    skuPackageTypeMock = SkuPackageType.sku;
    performanceDTOResponseMock = getPerformanceDTOMock();
    productMetricsDTOResponseMock = getProductMetricsBrandDTOMock();
    filterStateMock = {
      metricType: getMetricTypeValueMock(),
      dateRangeCode: getDateRangeTimePeriodValueMock(),
      premiseType: getPremiseTypeValueMock()
    };
  });

  afterEach(() => {
    http.verify();
  });

  describe('getAccountsOrDistributors', () => {
    it('should call the passed in EntityURI endpoint and return Accounts or Distributors', () => {
      const expectedEntityDTOResponseMock: EntityDTO[] = [getEntityDTOMock()];
      const entityURIMock: string = chance.string(chanceStringOptions);
      const expectedRequestUrl: string = `/v3${entityURIMock}`;

      positionsApiService.getAccountsOrDistributors(entityURIMock).subscribe((response: EntityDTO[]) => {
        expect(response).toEqual(expectedEntityDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(expectedEntityDTOResponseMock);

      expect(req.request.method).toBe('GET');
    });
  });

  describe('getAlternateHierarchy', () => {
    it('should call the Positions AlternateHierarchy endpoint and return PeopleResponsibilitiesDTO data for the given'
    + ' PositionId and ContextPositionId', () => {
      const expectedPeopleResponsibilitiesDTOResponseMock: PeopleResponsibilitiesDTO = getPeopleResponsibilitiesDTOMock();
      const expectedRequestUrl: string = `/v3/positions/${ positionIdMock }/alternateHierarchy`
        + `?contextPositionId=${ alternateHierarchyPositionIdMock }`;

      positionsApiService.getAlternateHierarchy(
        positionIdMock,
        alternateHierarchyPositionIdMock
      )
      .subscribe((response: PeopleResponsibilitiesDTO) => {
        expect(response).toEqual(expectedPeopleResponsibilitiesDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(expectedPeopleResponsibilitiesDTOResponseMock);

      expect(req.request.method).toBe('GET');
    });
  });

  describe('getAlternateHierarchyGroupPerformance', () => {
    let expectedRequestUrl: string;

    beforeEach(() => {
      expectedRequestUrl = `/v3/positions/${ positionIdMock }/alternateHierarchy/${ groupTypeCodeMock }/performanceTotal`
        + `?contextPositionId=${ alternateHierarchyPositionIdMock }`
        + `&metricType=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`
        + `&masterSKU=${ brandSkuCodeMock }`;
    });

    it('should call the Positions Alternate Hierarchy Performance endpoint and return PerformanceDTO data'
    + ' for the given AlternateHierarchy Group', () => {
      positionsApiService.getAlternateHierarchyGroupPerformance(
        positionIdMock,
        alternateHierarchyPositionIdMock,
        groupTypeCodeMock,
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

    it('should return empty PerformanceDTO data when the API responds with a 404 error', () => {
      positionsApiService.getAlternateHierarchyGroupPerformance(
        positionIdMock,
        alternateHierarchyPositionIdMock,
        groupTypeCodeMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      )
      .subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expectedEmptyPerformanceDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush({}, { status: 404, statusText: chance.string() });
    });
  });

  describe('getAlternateHierarchyPersonPerformance', () => {
    let expectedRequestUrl: string;

    beforeEach(() => {
      expectedRequestUrl = `/v3/positions/${ positionIdMock }/alternateHierarchyPerformanceTotal`
        + `?contextPositionId=${ alternateHierarchyPositionIdMock }`
        + `&metricType=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`
        + `&masterSKU=${ brandSkuCodeMock }`;
    });

    it('should call the Positions Alternate Hierarchy Performance endpoint and return PerformanceDTO data', () => {
      positionsApiService.getAlternateHierarchyPersonPerformance(
        positionIdMock,
        alternateHierarchyPositionIdMock,
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

    it('should return empty PerformanceDTO data when the API responds with a 404 error', () => {
      positionsApiService.getAlternateHierarchyPersonPerformance(
        positionIdMock,
        alternateHierarchyPositionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      )
      .subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expectedEmptyPerformanceDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush({}, { status: 404, statusText: chance.string() });
    });
  });

  describe('getAlternateHierarchyPersonProductMetrics', () => {
    let expectedRequestUrl: string;

    beforeEach(() => {
      expectedRequestUrl = `/v3/positions/${ positionIdMock }/alternateHierarchyProductMetrics`
        + `?contextPositionId=${ alternateHierarchyPositionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.sku }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;
    });

    it('should call the Positions Alternate Hierarchy Product Metrics endpoint and return ProductMetricDTO data', () => {
      positionsApiService.getAlternateHierarchyPersonProductMetrics(
        positionIdMock,
        alternateHierarchyPositionIdMock,
        ProductMetricsAggregationType.sku,
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
      expectedRequestUrl = `/v3/positions/${ positionIdMock }/alternateHierarchyProductMetrics`
        + `?contextPositionId=${ alternateHierarchyPositionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.brand }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      positionsApiService.getAlternateHierarchyPersonProductMetrics(
        positionIdMock,
        alternateHierarchyPositionIdMock,
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
      positionsApiService.getAlternateHierarchyPersonProductMetrics(
        positionIdMock,
        alternateHierarchyPositionIdMock,
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

  describe('getAlternateHierarchyGroupProductMetrics', () => {
    let expectedRequestUrl: string;

    beforeEach(() => {
      expectedRequestUrl = `/v3/positions/${ positionIdMock }/alternateHierarchy/${ groupTypeCodeMock }/productMetrics`
        + `?contextPositionId=${ alternateHierarchyPositionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.sku }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;
    });

    it('should call the Positions Alternate Hierarchy Group Product Metrics endpoint and return ProductMetricDTO data', () => {
      positionsApiService.getAlternateHierarchyGroupProductMetrics(
        positionIdMock,
        groupTypeCodeMock,
        alternateHierarchyPositionIdMock,
        ProductMetricsAggregationType.sku,
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
      expectedRequestUrl = `/v3/positions/${ positionIdMock }/alternateHierarchy/${ groupTypeCodeMock }/productMetrics`
        + `?contextPositionId=${ alternateHierarchyPositionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.brand }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      positionsApiService.getAlternateHierarchyGroupProductMetrics(
        positionIdMock,
        groupTypeCodeMock,
        alternateHierarchyPositionIdMock,
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
      positionsApiService.getAlternateHierarchyGroupProductMetrics(
        positionIdMock,
        groupTypeCodeMock,
        alternateHierarchyPositionIdMock,
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

  describe('getGroupPerformance', () => {
    let expectedRequestUrl: string;

    beforeEach(() => {
      expectedRequestUrl = `/v3/positions/${ positionIdMock }/responsibilities/${ groupTypeCodeMock }/performanceTotal`
        + `?metricType=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`
        + `&masterSKU=${ brandSkuCodeMock }`;
    });

    it('should call the Positions Group Performance endpoint and return PerformanceDTO data', () => {
      positionsApiService.getGroupPerformance(
        positionIdMock,
        groupTypeCodeMock,
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

    it('should return empty PerformanceDTO data when the API responds with a 404 error', () => {
      positionsApiService.getGroupPerformance(
        positionIdMock,
        groupTypeCodeMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      )
      .subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expectedEmptyPerformanceDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush({}, { status: 404, statusText: chance.string() });
    });
  });

  describe('getPeopleResponsibilities', () => {
    it('should call the Positions Responsibilities endpoint and return PeopleResponsibilitiesDTO data for the PositionId', () => {
      const expectedPeopleResponsibilitiesDTOResponseMock: PeopleResponsibilitiesDTO = getPeopleResponsibilitiesDTOMock();
      const expectedRequestUrl: string = `/v3/positions/${ positionIdMock }/responsibilities`;

      positionsApiService.getPeopleResponsibilities(positionIdMock).subscribe((response: PeopleResponsibilitiesDTO) => {
        expect(response).toEqual(expectedPeopleResponsibilitiesDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush(expectedPeopleResponsibilitiesDTOResponseMock);

      expect(req.request.method).toBe('GET');
    });
  });

  describe('getPersonPerformance', () => {
    let expectedRequestUrl: string;

    beforeEach(() => {
      expectedRequestUrl = `/v3/positions/${ positionIdMock }/performanceTotal`
        + `?metricType=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`
        + `&masterSKU=${ brandSkuCodeMock }`;
    });

    it('should call the Positions Performance endpoint and return PerformanceDTO data for the given PositionId', () => {
      positionsApiService.getPersonPerformance(
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

    it('should return empty PerformanceDTO data when the API responds with a 404 error', () => {
      positionsApiService.getPersonPerformance(
        positionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      )
      .subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expectedEmptyPerformanceDTOResponseMock);
      });

      const req: TestRequest = http.expectOne(expectedRequestUrl);
      req.flush({}, { status: 404, statusText: chance.string() });
    });
  });

  describe('getPersonProductMetrics', () => {
    let expectedRequestUrl: string;

    beforeEach(() => {
      expectedRequestUrl = `/v3/positions/${ positionIdMock }/productMetrics`
        + `?aggregationLevel=${ ProductMetricsAggregationType.sku }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;
    });

    it('should call the Positions Product Metrics endpoint and return ProductMetricsDTO data for the given PositionId', () => {
      positionsApiService.getPersonProductMetrics(
        positionIdMock,
        ProductMetricsAggregationType.sku,
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
      expectedRequestUrl = `/v3/positions/${ positionIdMock }/productMetrics`
        + `?aggregationLevel=${ ProductMetricsAggregationType.brand }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      positionsApiService.getPersonProductMetrics(
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
      positionsApiService.getPersonProductMetrics(
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

  describe('getGroupProductMetrics', () => {
    let expectedRequestUrl: string;

    beforeEach(() => {
      expectedRequestUrl = `/v3/positions/${ positionIdMock }/responsibilities/${ groupTypeCodeMock }/productMetrics`
        + `?aggregationLevel=${ ProductMetricsAggregationType.sku }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;
    });

    it('should call the Positions Group Product Metrics endpoint and return ProductMetricsDTO data for the given PositionId', () => {
      positionsApiService.getGroupProductMetrics(
        positionIdMock,
        groupTypeCodeMock,
        ProductMetricsAggregationType.sku,
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
      expectedRequestUrl = `/v3/positions/${ positionIdMock }/responsibilities/${ groupTypeCodeMock }/productMetrics`
        + `?aggregationLevel=${ ProductMetricsAggregationType.brand }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      positionsApiService.getGroupProductMetrics(
        positionIdMock,
        groupTypeCodeMock,
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
      positionsApiService.getGroupProductMetrics(
        positionIdMock,
        groupTypeCodeMock,
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
