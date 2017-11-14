import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions, ResponseType } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { EntityDTO } from '../models/entity-dto.model';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { getEntityDTOMock } from '../models/entity-dto.model.mock';
import { getEntitySubAccountDTOMock } from '../models/entity-subaccount-dto.model.mock';
import { getPerformanceDTOMock } from '../models/performance.model.mock';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceApiService } from './my-performance-api.service';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../models/people-responsibilities-dto.model';
import { PerformanceDTO } from '../models/performance.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { SkuPackageType } from '../enums/sku-package-type.enum';

describe('Service: MyPerformanceApiService', () => {
  let myPerformanceApiService: MyPerformanceApiService;
  let mockBackend: MockBackend;

  const emptyPerformanceDTOMock: PerformanceDTO = {
    total: 0,
    totalYearAgo: 0
  };
  const performanceDTOResponseMock: PerformanceDTO = getPerformanceDTOMock();
  const responsibilitiesResponseMock: PeopleResponsibilitiesDTO = {
    positions: [{
      id: '123',
      employeeId: '1231231',
      name: 'Joel Cummins',
      description: 'MARKET DEVELOPMENT MANAGER',
      type: '10',
      hierarchyType: 'SALES_HIER',
    }, {
      id: '456',
      employeeId: '4564561',
      name: 'Andy Farag',
      description: 'MARKET DEVELOPMENT MANAGER',
      type: '20',
      hierarchyType: 'SALES_HIER',
    }, {
      id: '789',
      employeeId: '7897891',
      name: 'Ryan Stasik',
      description: 'Specialist',
      type: '30',
      hierarchyType: 'SALES_HIER',
    }]
  };
  const entityDTOMock: Array<EntityDTO> = [getEntityDTOMock(), getEntityDTOMock()];
  const subAccountsDTOMock: Array<EntitySubAccountDTO> = [getEntitySubAccountDTOMock(), getEntitySubAccountDTOMock()];

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
        MyPerformanceApiService
      ]
    });
  });

  beforeEach(inject([MyPerformanceApiService, MockBackend],
    (_myPerformanceApiService: MyPerformanceApiService, _mockBackend: MockBackend) => {
      myPerformanceApiService = _myPerformanceApiService;
      mockBackend = _mockBackend;
    })
  );

  describe('getResponsibilities', () => {

    it('should call the responsibilities endpoint and return all responsibilities', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(responsibilitiesResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual('/v3/positions/1/responsibilities');
      });

      myPerformanceApiService
        .getResponsibilities('1')
        .subscribe((res) => {
          expect(res).toEqual(responsibilitiesResponseMock);
          done();
        });
    });
  });

  describe('getPerformance', () => {
    const positionIdMock = chance.string();
    const brandSkuCodeMock = chance.string({
      pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
    });
    const skuPackageTypeMock = SkuPackageType.sku;

    const filterStateMock: MyPerformanceFilterState = {
      metricType: MetricTypeValue.volume,
      dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
      premiseType: PremiseTypeValue.On
    };

    it('should call the performance API and return performance data for a sku', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceDTOResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          `/v3/positions/${positionIdMock}/performanceTotal`
          + `?metricType=volume`
          + `&dateRangeCode=FYTDBDL`
          + `&premiseType=On`
          + `&masterSKU=${brandSkuCodeMock}`
        );
      });

      myPerformanceApiService.getPerformance(positionIdMock,
        filterStateMock, brandSkuCodeMock, skuPackageTypeMock).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(performanceDTOResponseMock);
        done();
      });
    });

    it('should call the performance API and return performance data for a brand', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceDTOResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          `/v3/positions/${positionIdMock}/performanceTotal`
          + `?metricType=volume`
          + `&dateRangeCode=FYTDBDL`
          + `&premiseType=On`
          + `&brandCode=${brandSkuCodeMock}`
        );
      });

      myPerformanceApiService.getPerformance(positionIdMock,
        filterStateMock, brandSkuCodeMock).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(performanceDTOResponseMock);
        done();
      });
    });

    it('should call the performance API and return empty performance data when response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      myPerformanceApiService.getPerformance('', filterStateMock).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(emptyPerformanceDTOMock);
        done();
      });
    });
  });

  describe('getAlternateHierarchyPersonPerformance', () => {
    const filterStateMock: MyPerformanceFilterState = {
      metricType: MetricTypeValue.volume,
      dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
      premiseType: PremiseTypeValue.On
    };

    it('should call the alternate hierarchy performance API and return performance data for a package', (done) => {
      const positionIdMock: string = chance.string();
      const brandSkuCodeMock = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });
      const skuPackageTypeMock = SkuPackageType.package;
      const alternateHierarchyIdMock: string = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });

      const expectedBaseUrl = `/v3/positions/${ positionIdMock }/alternateHierarchyPerformanceTotal`;
      const expectedUrlParams = `?metricType=volume`
      + `&dateRangeCode=FYTDBDL`
      + `&premiseType=On`
      + `&masterPackageSKU=${brandSkuCodeMock}`
      + `&contextPositionId=${ alternateHierarchyIdMock }`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceDTOResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedBaseUrl + expectedUrlParams);
      });

      myPerformanceApiService.getAlternateHierarchyPersonPerformance(
        positionIdMock,
        alternateHierarchyIdMock,
        filterStateMock,
        brandSkuCodeMock,
        skuPackageTypeMock
      ).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(performanceDTOResponseMock);
        done();
      });
    });

    it('should call the alternate hierarchy performance API and return empty performance data when response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      myPerformanceApiService.getAlternateHierarchyPersonPerformance('', '', filterStateMock).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(emptyPerformanceDTOMock);
        done();
      });
    });
  });

  describe('getSubAccountPerformance', () => {
    const filterStateMock: MyPerformanceFilterState = {
      metricType: MetricTypeValue.volume,
      dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
      premiseType: PremiseTypeValue.On
    };

    it('should call the SubAccounts performance API and return performance data for a brand', (done) => {
      const subAccountIdMock: string = chance.string();
      const contextPositionIdMock: string = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });
      const brandSkuCodeMock = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceDTOResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          `/v3/subAccounts/${ subAccountIdMock }/performanceTotal`
          + `?metricType=volume`
          + `&dateRangeCode=FYTDBDL`
          + `&premiseType=On`
          + `&brandCode=${brandSkuCodeMock}`
          + `&positionId=${contextPositionIdMock}`
        );
      });

      myPerformanceApiService.getSubAccountPerformance(subAccountIdMock, contextPositionIdMock, filterStateMock, brandSkuCodeMock)
        .subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(performanceDTOResponseMock);
        done();
      });
    });

    it('should call the SubAccounts performance API and return empty performance data when response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      myPerformanceApiService.getSubAccountPerformance('', '', filterStateMock).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(emptyPerformanceDTOMock);
        done();
      });
    });
  });

  describe('getDistributorPerformance', () => {
    const filterStateMock: MyPerformanceFilterState = {
      metricType: MetricTypeValue.volume,
      dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
      premiseType: PremiseTypeValue.On
    };

    it('should call the distributor performance API and return performance data for a sku', (done) => {
      const positionIdMock = chance.string();
      const contextPositionIdMock = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });
      const brandSkuCodeMock = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });
      const skuPackageTypeMock = SkuPackageType.sku;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceDTOResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          `/v3/distributors/${positionIdMock}/performanceTotal`
          + `?metricType=volume`
          + `&dateRangeCode=FYTDBDL`
          + `&premiseType=On`
          + `&masterSKU=${brandSkuCodeMock}`
          + `&positionId=${contextPositionIdMock}`
        );
      });

      const expected = performanceDTOResponseMock;

      myPerformanceApiService.getDistributorPerformance(
        positionIdMock,
        filterStateMock,
        contextPositionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock
      ).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expected);
        done();
      });
    });

    it('should call the distributor performance API and return empty performance data when response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      myPerformanceApiService.getDistributorPerformance('', filterStateMock, '').subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(emptyPerformanceDTOMock);
        done();
      });
    });
  });

  describe('getAccountPerformance', () => {
    const filterStateMock: MyPerformanceFilterState = {
      metricType: MetricTypeValue.volume,
      dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
      premiseType: PremiseTypeValue.On
    };

    it('should call the account performance API and return performance data for a package', (done) => {
      const positionIdMock = chance.string();
      const contextPositionIdMock = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });
      const brandSkuCodeMock = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });
      const skuPackageTypeMock = SkuPackageType.package;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceDTOResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          `/v3/accounts/${positionIdMock}/performanceTotal`
          + `?metricType=volume`
          + `&dateRangeCode=FYTDBDL`
          + `&premiseType=On`
          + `&masterPackageSKU=${brandSkuCodeMock}`
          + `&positionId=${contextPositionIdMock}`
        );
      });

      const expected = performanceDTOResponseMock;

      myPerformanceApiService.getAccountPerformance(
        positionIdMock,
        filterStateMock,
        contextPositionIdMock,
        brandSkuCodeMock,
        skuPackageTypeMock
      ).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(expected);
        done();
      });
    });

    it('should call the account performance API and return empty performance data when response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      myPerformanceApiService.getAccountPerformance('', filterStateMock, '').subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(emptyPerformanceDTOMock);
        done();
      });
    });
  });

  describe('getAccountsDistributors', () => {
    it('should call the responsibilities endpoint and return some entities', (done) => {
      const entityURIMock = chance.string();

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(entityDTOMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(`/v3${ entityURIMock }`);
      });

      myPerformanceApiService
        .getAccountsDistributors(entityURIMock)
        .subscribe((res) => {
          expect(res).toEqual(entityDTOMock);
          done();
        });
    });
  });

  describe('getHierarchyGroupPerformance', () => {
    const filterStateMock: MyPerformanceFilterState = {
      metricType: MetricTypeValue.velocity,
      dateRangeCode: DateRangeTimePeriodValue.L90BDL,
      premiseType: PremiseTypeValue.All
    };
    const hierarchyGroupTypeMock = chance.string();

    it('should call the responsibility performance endpoint and return performance data for the responsibility for brand', (done) => {
      const positionIdMock = chance.string();
      const brandSkuCodeMock = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });
      const expectedBaseUrl = `/v3/positions/${ positionIdMock }/responsibilities/${ hierarchyGroupTypeMock }/performanceTotal`;
      const expectedUrlParams = `?metricType=velocity&dateRangeCode=L90BDL&premiseType=All&brandCode=${brandSkuCodeMock}`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceDTOResponseMock)
        });

        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedBaseUrl + expectedUrlParams);
      });

      myPerformanceApiService.getHierarchyGroupPerformance(hierarchyGroupTypeMock, filterStateMock, positionIdMock, brandSkuCodeMock)
        .subscribe((response: PerformanceDTO) => {
          expect(response).toEqual(performanceDTOResponseMock);
          done();
      });
    });

    it('should call the responsibility performance API and return empty performance data when response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      myPerformanceApiService.getHierarchyGroupPerformance(
        hierarchyGroupTypeMock,
        filterStateMock,
        ''
      ).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(emptyPerformanceDTOMock);
        done();
      });
    });
  });

  describe('getAlternateHierarchyGroupPerformance', () => {
    const hierarchyGroupTypeMock: string = chance.string();
    const filterStateMock: MyPerformanceFilterState = {
      metricType: MetricTypeValue.velocity,
      dateRangeCode: DateRangeTimePeriodValue.L90BDL,
      premiseType: PremiseTypeValue.All
    };

    it('should call the alternateHierarchy performanceTotal endpoint and return performance data for the group with a sku', (done) => {
      const positionIdMock = chance.string();
      const brandSkuCodeMock = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });
      const skuPackageTypeMock = SkuPackageType.sku;
      const alternateHierarchyIdMock = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });

      const expectedBaseUrl = `/v3/positions/${ positionIdMock }/alternateHierarchy/${ hierarchyGroupTypeMock }/performanceTotal`;
      const expectedUrlParams = `?metricType=velocity`
        + `&dateRangeCode=L90BDL`
        + `&premiseType=All`
        + `&masterSKU=${brandSkuCodeMock}`
        + `&contextPositionId=${alternateHierarchyIdMock}`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceDTOResponseMock)
        });

        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedBaseUrl + expectedUrlParams);
      });

      myPerformanceApiService.getAlternateHierarchyGroupPerformance(
        hierarchyGroupTypeMock, positionIdMock, alternateHierarchyIdMock, filterStateMock, brandSkuCodeMock, skuPackageTypeMock)
        .subscribe((response: PerformanceDTO) => {
          expect(response).toEqual(performanceDTOResponseMock);
          done();
      });
    });

    it('should call the alternateHierarchy performance API and return empty performance data when response is 404', (done) => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          type: ResponseType.Error,
          status: 404,
          statusText: 'No performance totals found with given parameters'
        });
        connection.mockError(new Response(options) as Response & Error);
      });

      myPerformanceApiService.getAlternateHierarchyGroupPerformance(
        hierarchyGroupTypeMock, '', '', filterStateMock
      ).subscribe((response: PerformanceDTO) => {
        expect(response).toEqual(emptyPerformanceDTOMock);
        done();
      });
    });
  });

  describe('getSubAccounts', () => {

    it('should call the accounts/subAcccount endpoint and return subAccounts', (done) => {
      const positionIdMock: string = chance.string();
      const contextPositionIdMock: string = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#%^&*()[]'
      });
      const premiseTypeMock: PremiseTypeValue = PremiseTypeValue.All;

      const expectedBaseUrl = `/v3/accounts/${ positionIdMock }/subAccounts`;
      const expectedUrlParams =
        `?positionId=${encodeURIComponent(contextPositionIdMock)}&premiseType=${encodeURIComponent(PremiseTypeValue[premiseTypeMock])}`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(subAccountsDTOMock)
        });

        connection.mockRespond(new Response(options));

        expect(connection.request.method).toBe(RequestMethod.Get);
        expect(connection.request.url).toBe(expectedBaseUrl + expectedUrlParams);
      });

      myPerformanceApiService.getSubAccounts(positionIdMock, contextPositionIdMock, premiseTypeMock)
        .subscribe((response: Array<EntitySubAccountDTO>) => {
          expect(response).toEqual(subAccountsDTOMock);
          done();
        });
    });
  });

  describe('getAlternateHierarchy', () => {
    it('should call the positions alternateHierarchy endpoint and return the position\'s hierarchy call', (done) => {
      const positionIdMock: string = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });
      const contextPositionIdMock: string = chance.string({
        pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!*()'
      });
      const responseMock: PeopleResponsibilitiesDTO = {
        entityURIs: [chance.string()]
      };
      const expectedUrl = `/v3/positions/${ positionIdMock }/alternateHierarchy?contextPositionId=${ contextPositionIdMock }`;

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(responseMock)
        });

        connection.mockRespond(new Response(options));

        expect(connection.request.method).toBe(RequestMethod.Get);
        expect(connection.request.url).toBe(expectedUrl);
      });

      myPerformanceApiService.getAlternateHierarchy(positionIdMock, contextPositionIdMock)
        .subscribe((response: PeopleResponsibilitiesDTO) => {
          expect(response).toEqual(responseMock);
          done();
        });
    });
  });
});
