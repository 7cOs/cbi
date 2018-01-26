import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions, ResponseType } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

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
  let positionsApiService: PositionsApiService;
  let mockBackend: MockBackend;

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
        PositionsApiService,
        ApiHelperService
      ]
    });
  });

  beforeEach(inject([PositionsApiService, MockBackend], (_positionsApiService: PositionsApiService, _mockBackend: MockBackend) => {
    positionsApiService = _positionsApiService;
    mockBackend = _mockBackend;

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
  }));

  describe('getAccountsOrDistributors', () => {
    it('should call the passed in EntityURI endpoint and return Accounts or Distributors', (done) => {
      const expectedEntityDTOResponseMock: EntityDTO[] = [getEntityDTOMock()];
      const entityURIMock: string = chance.string(chanceStringOptions);
      const expectedRequestUrl: string = `/v3${entityURIMock}`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(expectedEntityDTOResponseMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl);
      });

      positionsApiService.getAccountsOrDistributors(entityURIMock).subscribe((response: EntityDTO[]) => {
        expect(response).toEqual(expectedEntityDTOResponseMock);
        done();
      });
    });
  });

  describe('getAlternateHierarchy', () => {
    it('should call the Positions AlternateHierarchy endpoint and return PeopleResponsibilitiesDTO data for the given'
    + ' PositionId and ContextPositionId', (done) => {
      const expectedPeopleResponsibilitiesDTOResponseMock: PeopleResponsibilitiesDTO = getPeopleResponsibilitiesDTOMock();
      const expectedRequestUrl: string = `/v3/positions/${ positionIdMock }/alternateHierarchy`
        + `?contextPositionId=${ alternateHierarchyPositionIdMock }`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(expectedPeopleResponsibilitiesDTOResponseMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl);
      });

      positionsApiService.getAlternateHierarchy(
        positionIdMock,
        alternateHierarchyPositionIdMock
      )
      .subscribe((response: PeopleResponsibilitiesDTO) => {
        expect(response).toEqual(expectedPeopleResponsibilitiesDTOResponseMock);
        done();
      });
    });
  });

  describe('getAlternateHierarchyGroupPerformance', () => {
    it('should call the Positions Alternate Hierarchy Performance endpoint and return PerformanceDTO data'
    + ' for the given AlternateHierarchy Group', (done) => {
      const expectedRequestUrl: string = `/v3/positions/${ positionIdMock }/alternateHierarchy/${ groupTypeCodeMock }/performanceTotal`
        + `?contextPositionId=${ alternateHierarchyPositionIdMock }`
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
        done();
      });
    });

    it('should return empty PerformanceDTO data when the API responds with a 404 error', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

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
        done();
      });
    });
  });

  describe('getAlternateHierarchyPersonPerformance', () => {
    it('should call the Positions Alternate Hierarchy Performance endpoint and return PerformanceDTO data', (done) => {
      const expectedRequestUrl: string = `/v3/positions/${ positionIdMock }/alternateHierarchyPerformanceTotal`
        + `?contextPositionId=${ alternateHierarchyPositionIdMock }`
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

      positionsApiService.getAlternateHierarchyPersonPerformance(
        positionIdMock,
        alternateHierarchyPositionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      )
      .subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(performanceDTOResponseMock);
        done();
      });
    });

    it('should return empty PerformanceDTO data when the API responds with a 404 error', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      positionsApiService.getAlternateHierarchyPersonPerformance(
        positionIdMock,
        alternateHierarchyPositionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      )
      .subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expectedEmptyPerformanceDTOResponseMock);
        done();
      });
    });
  });

  describe('getAlternateHierarchyPersonProductMetrics', () => {
    it('should call the Positions Alternate Hierarchy Product Metrics endpoint and return ProductMetricDTO data', (done) => {
      const expectedRequestUrl: string = `/v3/positions/${ positionIdMock }/alternateHierarchyProductMetrics`
        + `?contextPositionId=${ alternateHierarchyPositionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.sku }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOResponseMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl);
      });

      positionsApiService.getAlternateHierarchyPersonProductMetrics(
        positionIdMock,
        alternateHierarchyPositionIdMock,
        ProductMetricsAggregationType.sku,
        filterStateMock
      )
      .subscribe((response: ProductMetricsDTO) => {
        expect(response).toEqual(productMetricsDTOResponseMock);
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

      positionsApiService.getAlternateHierarchyPersonProductMetrics(
        positionIdMock,
        alternateHierarchyPositionIdMock,
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

      positionsApiService.getAlternateHierarchyPersonProductMetrics(
        positionIdMock,
        alternateHierarchyPositionIdMock,
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

  describe('getAlternateHierarchyRoleGroupProductMetrics', () => {
    it('should call the Positions Alternate Hierarchy Group Product Metrics endpoint and return ProductMetricDTO data', (done) => {
      const expectedRequestUrl: string = `/v3/positions/${ positionIdMock }/alternateHierarchy/${ groupTypeCodeMock }/productMetrics`
        + `?contextPositionId=${ alternateHierarchyPositionIdMock }`
        + `&aggregationLevel=${ ProductMetricsAggregationType.sku }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOResponseMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl);
      });

      positionsApiService.getAlternateHierarchyRoleGroupProductMetrics(
        positionIdMock,
        groupTypeCodeMock,
        alternateHierarchyPositionIdMock,
        ProductMetricsAggregationType.sku,
        filterStateMock
      )
      .subscribe((response: ProductMetricsDTO) => {
        expect(response).toEqual(productMetricsDTOResponseMock);
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

      positionsApiService.getAlternateHierarchyRoleGroupProductMetrics(
        positionIdMock,
        groupTypeCodeMock,
        alternateHierarchyPositionIdMock,
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

      positionsApiService.getAlternateHierarchyRoleGroupProductMetrics(
        positionIdMock,
        groupTypeCodeMock,
        alternateHierarchyPositionIdMock,
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

  describe('getHierarchyGroupPerformance', () => {
    it('should call the Positions Group Performance endpoint and return PerformanceDTO data', (done) => {
      const expectedRequestUrl: string = `/v3/positions/${ positionIdMock }/responsibilities/${ groupTypeCodeMock }/performanceTotal`
        + `?metricType=${ filterStateMock.metricType.toLowerCase() }`
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

      positionsApiService.getHierarchyGroupPerformance(
        positionIdMock,
        groupTypeCodeMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      )
      .subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(performanceDTOResponseMock);
        done();
      });
    });

    it('should return empty PerformanceDTO data when the API responds with a 404 error', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      positionsApiService.getHierarchyGroupPerformance(
        positionIdMock,
        groupTypeCodeMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      )
      .subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expectedEmptyPerformanceDTOResponseMock);
        done();
      });
    });
  });

  describe('getPeopleResponsibilities', () => {
    it('should call the Positions Responsibilities endpoint and return PeopleResponsibilitiesDTO data for the PositionId', (done) => {
      const expectedPeopleResponsibilitiesDTOResponseMock: PeopleResponsibilitiesDTO = getPeopleResponsibilitiesDTOMock();
      const expectedRequestUrl: string = `/v3/positions/${ positionIdMock }/responsibilities`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(expectedPeopleResponsibilitiesDTOResponseMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl);
      });

      positionsApiService.getPeopleResponsibilities(positionIdMock).subscribe((response: PeopleResponsibilitiesDTO) => {
        expect(response).toEqual(expectedPeopleResponsibilitiesDTOResponseMock);
        done();
      });
    });
  });

  describe('getPersonPerformance', () => {
    it('should call the Positions Performance endpoint and return PerformanceDTO data for the given PositionId', (done) => {
      const expectedRequestUrl: string = `/v3/positions/${ positionIdMock }/performanceTotal`
        + `?metricType=${ filterStateMock.metricType.toLowerCase() }`
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

      positionsApiService.getPersonPerformance(
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

    it('should return empty PerformanceDTO data when the API responds with a 404 error', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      positionsApiService.getPersonPerformance(
        positionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock,
        filterStateMock
      )
      .subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expectedEmptyPerformanceDTOResponseMock);
        done();
      });
    });
  });

  describe('getPersonProductMetrics', () => {
    it('should call the Positions Product Metrics endpoint and return ProductMetricsDTO data for the given PositionId', (done) => {
      const expectedRequestUrl: string = `/v3/positions/${ positionIdMock }/productMetrics`
        + `?aggregationLevel=${ ProductMetricsAggregationType.sku }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOResponseMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl);
      });

      positionsApiService.getPersonProductMetrics(
        positionIdMock,
        ProductMetricsAggregationType.sku,
        filterStateMock
      )
      .subscribe((response: ProductMetricsDTO) => {
        expect(response).toEqual(productMetricsDTOResponseMock);
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

      positionsApiService.getPersonProductMetrics(
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

      positionsApiService.getPersonProductMetrics(
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

  describe('getRoleGroupProductMetrics', () => {
    it('should call the Positions Group Product Metrics endpoint and return ProductMetricsDTO data for the given PositionId', (done) => {
      const expectedRequestUrl: string = `/v3/positions/${ positionIdMock }/responsibilities/${ groupTypeCodeMock }/productMetrics`
        + `?aggregationLevel=${ ProductMetricsAggregationType.sku }`
        + `&type=${ filterStateMock.metricType.toLowerCase() }`
        + `&dateRangeCode=${ filterStateMock.dateRangeCode }`
        + `&premiseType=${ filterStateMock.premiseType }`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(productMetricsDTOResponseMock)
        });
        connection.mockRespond(new Response(options));

        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedRequestUrl);
      });

      positionsApiService.getRoleGroupProductMetrics(
        positionIdMock,
        groupTypeCodeMock,
        ProductMetricsAggregationType.sku,
        filterStateMock
      )
      .subscribe((response: ProductMetricsDTO) => {
        expect(response).toEqual(productMetricsDTOResponseMock);
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

      positionsApiService.getRoleGroupProductMetrics(
        positionIdMock,
        groupTypeCodeMock,
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

      positionsApiService.getRoleGroupProductMetrics(
        positionIdMock,
        groupTypeCodeMock,
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
