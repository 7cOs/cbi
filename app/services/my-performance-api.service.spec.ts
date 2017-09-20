import { BaseRequestOptions, Http, RequestMethod, Response, ResponseOptions } from '@angular/http';
import { inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
// import { DistributionTypeValue } from '../enums/distribution-type.enum';
// import { getEntitiesTotalPerformancesMock } from '../models/entities-total-performances.model.mock';
import { getEntitiesTotalPerformancesDTOMock } from '../models/entities-total-performances.model.mock';
import { getEntityDTOMock } from '../models/entity-dto.model.mock';
import { EntityDTO } from '../models/entity-dto.model';
import { EntitiesPerformancesDTO } from '../models/entities-performances.model';
import { EntitiesTotalPerformancesDTO } from '../models/entities-total-performances.model';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceApiService } from './my-performance-api.service';
import { PremiseTypeValue } from '../enums/premise-type.enum';

describe('Service: MyPerformanceApiService', () => {
  let myPerformanceApiService: MyPerformanceApiService;
  let mockBackend: MockBackend;

  const performanceTotalResponseMock: EntitiesTotalPerformancesDTO = getEntitiesTotalPerformancesDTOMock();
  const responsibilitiesResponseMock: any = {
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [ MockBackend, BaseRequestOptions ]
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

  describe('getPerformanceTotal', () => {

    it('should call the performanceTotal API and return performance data', (done) => {
      const mockFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceTotalResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          '/v3/positions/1/performanceTotal?metricType=volume&dateRangeCode=FYTDBDL&premiseType=On'
        );
      });

      myPerformanceApiService.getPerformanceTotal('1', mockFilter).subscribe((response: EntitiesTotalPerformancesDTO) => {
        expect(response).toEqual(performanceTotalResponseMock);
        done();
      });
    });
  });

  // describe('getDistributorsPerformanceTotals', () => {
  //   it('should call getDistributorPerformance total with the proper id for each distributor', () => {
  //     const getDistributorPerformanceSpy = spyOn(myPerformanceApiService, 'getDistributorPerformanceTotal').and.callFake(() => {});
  //     const mockFilter = {
  //       metricType: MetricTypeValue.volume,
  //       dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
  //       premiseType: PremiseTypeValue.On
  //     };

  //     const len = chance.natural({min: 1, max: 99});
  //     const distributorDTOs = Array(len).fill('').map(el => getDistributorEntityDTOMock());
  //     myPerformanceApiService.getDistributorsPerformanceTotals(distributorDTOs, mockFilter);
  //     expect(getDistributorPerformanceSpy).toHaveBeenCalledTimes(len);
  //     distributorDTOs.map((distributorDTO) => {
  //       expect(getDistributorPerformanceSpy).toHaveBeenCalledWith(distributorDTO.id, mockFilter);
  //     });
  //   });
  // });

  // describe('getAccountsPerformanceTotals', () => {
  //   it('should call getAccountPerformance total with the proper id for each account', () => {
  //     const getAccountPerformanceSpy = spyOn(myPerformanceApiService, 'getAccountPerformanceTotal').and.callFake(() => {});
  //     const mockFilter = {
  //       metricType: MetricTypeValue.volume,
  //       dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
  //       premiseType: PremiseTypeValue.On
  //     };

  //     const len = chance.natural({min: 1, max: 99});
  //     const accountDTOs = Array(len).fill('').map(el => getAccountEntityDTOMock());
  //     myPerformanceApiService.getAccountsPerformanceTotals(accountDTOs, mockFilter);
  //     expect(getAccountPerformanceSpy).toHaveBeenCalledTimes(len);
  //     accountDTOs.map((accountDTO) => {
  //       expect(getAccountPerformanceSpy).toHaveBeenCalledWith(accountDTO.id, mockFilter);
  //     });
  //   });
  // });

  describe('getDistributorPerformanceTotal', () => {

    it('should call the distributors performance API and return performance data', (done) => {
      const mockFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceTotalResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          '/v3/distributors/1/performanceTotal?metricType=volume&dateRangeCode=FYTDBDL&premiseType=On'
        );
      });

      myPerformanceApiService.getDistributorPerformanceTotal('1', mockFilter).subscribe((response: EntitiesTotalPerformances) => {
        expect(response).toEqual(performanceTotalResponseMock);
        done();
      });
    });
  });

  describe('getAccountsPerformanceTotals', () => {

    it('should call the accounts performance API and return performance data', (done) => {
      const mockFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceTotalResponseMock)
        });
        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(
          '/v3/accounts/1/performanceTotal?metricType=volume&dateRangeCode=FYTDBDL&premiseType=On'
        );
      });

      myPerformanceApiService.getAccountPerformanceTotal('1', mockFilter).subscribe((response: EntitiesTotalPerformances) => {
        expect(response).toEqual(performanceTotalResponseMock);
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

  describe('getResponsibilityPerformanceTotal', () => {

    it('should call the responsibility performanceTotal endpoint and return performance data for the responsibility', (done) => {
      const mockFilter = {
        metricType: MetricTypeValue.velocity,
        dateRangeCode: DateRangeTimePeriodValue.L90BDL,
        premiseType: PremiseTypeValue.All
      };
      const entityMock = {
        name: chance.string(),
        type: chance.string()
      };
      const positionIdMock = chance.string();
      const expectedBaseUrl = `/v3/positions/${ positionIdMock }/responsibilities/${ entityMock.type }/performanceTotal`;
      const expectedUrlParams = '?metricType=velocity&dateRangeCode=L90BDL&premiseType=All';

      mockBackend.connections.subscribe((connection: MockConnection) => {
        const options = new ResponseOptions({
          body: JSON.stringify(performanceTotalResponseMock)
        });

        connection.mockRespond(new Response(options));
        expect(connection.request.method).toEqual(RequestMethod.Get);
        expect(connection.request.url).toEqual(expectedBaseUrl + expectedUrlParams);
      });

      myPerformanceApiService.getResponsibilityPerformanceTotal(entityMock, mockFilter, positionIdMock)
        .subscribe((response: EntitiesPerformancesDTO) => {
          expect(response).toEqual({
            id: positionIdMock,
            name: entityMock.name,
            performanceTotal: performanceTotalResponseMock
          });
          done();
        });
      });
  });
});
