import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { Performance, PerformanceDTO } from '../models/performance.model';
import { EntityDTO } from '../models/entity-dto.model';
import { EntityWithPerformance, EntityWithPerformanceDTO } from '../models/entity-with-performance.model';
import { EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { getEntityPeopleResponsibilitiesMock,
  getEntityPropertyResponsibilitiesMock } from '../models/hierarchy-entity.model.mock';
import { getPerformanceMock,
  getPerformanceDTOMock } from '../models/performance.model.mock';
import { getEntitiesWithPerformancesMock, getResponsibilityEntitiesPerformanceDTOMock } from '../models/entity-with-performance.model.mock';
import { getEntityDTOMock } from '../models/entity-dto.model.mock';
import { getEntitySubAccountDTOMock } from '../models/entity-subaccount-dto.model.mock';
import { getGroupedEntitiesMock } from '../models/grouped-entities.model.mock';
import { getMyPerformanceFilterMock } from '../models/my-performance-filter.model.mock';
import { getMyPerformanceTableRowMock } from '../models/my-performance-table-row.model.mock';
import { getPeopleResponsibilitiesDTOMock } from '../models/people-responsibilities-dto.model.mock';
import { GroupedEntities } from '../models/grouped-entities.model';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceApiService } from '../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../models/people-responsibilities-dto.model';
import { PerformanceTransformerService } from '../services/performance-transformer.service';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ResponsibilitiesTransformerService } from '../services/responsibilities-transformer.service';
import { ResponsibilitiesService, ResponsibilitiesData, SubAccountData } from './responsibilities.service';
import { ViewType } from '../enums/view-type.enum';

const chance = new Chance();

describe('Responsibilities Effects', () => {
  let positionIdMock: string;
  let contextPositionIdMock: string;
  let groupedEntitiesMock: GroupedEntities;
  let accountsDistributorsMock: GroupedEntities;
  let groupedSubAccountsMock: GroupedEntities;
  let peopleResponsibilitiesDTOMock: PeopleResponsibilitiesDTO;
  let responsibilityEntitiesPerformanceDTOMock: EntityWithPerformanceDTO[];
  let entityWithPerformanceMock: EntityWithPerformance[];
  let entitiesTotalPerformancesMock: Performance;
  let entitiesTotalPerformancesDTOMock: PerformanceDTO;
  let entityDTOMock: EntityDTO;
  let responsibilitiesService: ResponsibilitiesService;
  let myPerformanceApiService: MyPerformanceApiService;
  let performanceTransformerService: PerformanceTransformerService;
  let responsibilitiesTransformerService: ResponsibilitiesTransformerService;
  let entitySubAccountDTOMock: EntitySubAccountDTO[];

  const performanceFilterStateMock: MyPerformanceFilterState = getMyPerformanceFilterMock();

  const myPerformanceApiServiceMock = {
    getResponsibilities() {
      return Observable.of(peopleResponsibilitiesDTOMock);
    },
    getResponsibilityPerformance() {
      return Observable.of(responsibilityEntitiesPerformanceDTOMock);
    },
    getPerformance() {
      return Observable.of(entitiesTotalPerformancesDTOMock);
    },
    getAccountsDistributors() {
      return Observable.of(entityDTOMock);
    },
    getDistributorPerformance() {
      return Observable.of(entitiesTotalPerformancesDTOMock);
    },
    getAccountPerformance() {
      return Observable.of(entitiesTotalPerformancesDTOMock);
    },
    getSubAccounts() {
      return Observable.of(entitySubAccountDTOMock);
    }
  };

  const responsibilitiesTransformerServiceMock = {
    groupPeopleByGroupedEntities(mockArgs: any): GroupedEntities {
      return groupedEntitiesMock;
    },
    groupsAccountsDistributors(mockArgs: any): GroupedEntities {
      return accountsDistributorsMock;
    },
    transformSubAccountsDTO(mockArgs: any): GroupedEntities {
      return groupedSubAccountsMock;
    }
  };

  const performanceTransformerServiceMock = {
    transformPerformanceDTO(mockArgs: any): Performance {
      return entitiesTotalPerformancesMock;
    },
    transformEntityWithPerformanceDTOs(mockArgs: any): EntityWithPerformance[] {
      return entityWithPerformanceMock;
    },
    transformEntityDTOsWithPerformance(...mockArgs: any[]): EntityWithPerformance[] {
      return entityWithPerformanceMock;
    },
    transformEntityWithPerformanceDTO(...mockArgs: any[]): EntityWithPerformance {
      return entityWithPerformanceMock[0];
    }
  };

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ResponsibilitiesService,
      {
        provide: MyPerformanceApiService,
        useValue: myPerformanceApiServiceMock
      },
      {
        provide: ResponsibilitiesTransformerService,
        useValue: responsibilitiesTransformerServiceMock
      },
      {
        provide: PerformanceTransformerService,
        useValue: performanceTransformerServiceMock
      }
    ]
  }));

  beforeEach(inject([ ResponsibilitiesService, MyPerformanceApiService, PerformanceTransformerService, ResponsibilitiesTransformerService ],
    (_responsibilitiesService: ResponsibilitiesService,
     _myPerformanceApiService: MyPerformanceApiService,
     _performanceTransformerService: PerformanceTransformerService,
     _responsibilitiesTransformerService: ResponsibilitiesTransformerService) => {
      responsibilitiesService = _responsibilitiesService;
      myPerformanceApiService = _myPerformanceApiService;
      performanceTransformerService = _performanceTransformerService;
      responsibilitiesTransformerService = _responsibilitiesTransformerService;

      positionIdMock = chance.string();
      contextPositionIdMock = chance.string();
      groupedEntitiesMock = getGroupedEntitiesMock();
      accountsDistributorsMock = {'all': [ getEntityPeopleResponsibilitiesMock() ]};
      peopleResponsibilitiesDTOMock = getPeopleResponsibilitiesDTOMock();
      responsibilityEntitiesPerformanceDTOMock = getResponsibilityEntitiesPerformanceDTOMock();
      entityWithPerformanceMock = getEntitiesWithPerformancesMock();
      entitiesTotalPerformancesMock = getPerformanceMock();
      entitiesTotalPerformancesDTOMock = getPerformanceDTOMock();
      entityDTOMock = getEntityDTOMock();
    }));

  describe('when getResponsibilities is called', () => {
    let responsibilitiesDataMock: ResponsibilitiesData;

    beforeEach(() => {
      responsibilitiesDataMock = {
        positionId: positionIdMock
      };
    });

    describe('when myPerformanceApiService returns some positions', () => {
      beforeEach(() => {
        peopleResponsibilitiesDTOMock.entityURIs = undefined;
      });
      it('returns positions and their performances', (done) => {
        const expectedResponsibilities = {
          positionId: positionIdMock,
          groupedEntities: groupedEntitiesMock,
          viewType: ViewType.roleGroups,
          entityTypes: [
            {
              type: groupedEntitiesMock['GENERAL MANAGER'][0].type,
              name: 'GENERAL MANAGER',
              positionDescription: groupedEntitiesMock['GENERAL MANAGER'][0].positionDescription
            },
            {
              type: groupedEntitiesMock['MARKET DEVELOPMENT MANAGER'][0].type,
              name: 'MARKET DEVELOPMENT MANAGER',
              positionDescription: groupedEntitiesMock['MARKET DEVELOPMENT MANAGER'][0].positionDescription
            }
          ],
          entitiesURL: undefined as any
        };

        responsibilitiesService.getResponsibilities(responsibilitiesDataMock).subscribe((responsibilitiesData: ResponsibilitiesData) => {
          expect(responsibilitiesData).toEqual(expectedResponsibilities);

          done();
        });
      });

      it('calls getResponsibilities with the right parameters', (done) => {
        const getResponsibilitiesSpy = spyOn(myPerformanceApiService, 'getResponsibilities').and.callThrough();

        responsibilitiesService.getResponsibilities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(getResponsibilitiesSpy.calls.count()).toBe(1);
        expect(getResponsibilitiesSpy.calls.argsFor(0)[0]).toBe(positionIdMock);
      });

      it('calls groupPeopleByGroupedEntities with the right parameters', (done) => {
        const groupPeopleByGroupedEntitiesSpy = spyOn(responsibilitiesTransformerService, 'groupPeopleByGroupedEntities').and.callThrough();

        responsibilitiesService.getResponsibilities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(groupPeopleByGroupedEntitiesSpy.calls.count()).toBe(1);
        expect(groupPeopleByGroupedEntitiesSpy.calls.argsFor(0)[0]).toBe(peopleResponsibilitiesDTOMock.positions);
      });
    });

    describe('when myPerformanceApiService returns some accounts', () => {
      beforeEach(() => {
        peopleResponsibilitiesDTOMock.positions = undefined;
        peopleResponsibilitiesDTOMock.entityURIs[0] = 'accounts';
      });

      it('returns accounts and their performances', (done) => {
        const expectedResponsibilities = {
          positionId: positionIdMock,
          groupedEntities: undefined as any,
          viewType: ViewType.accounts,
          entityTypes: undefined as any,
          entitiesURL: peopleResponsibilitiesDTOMock.entityURIs[0]
        };

        responsibilitiesService.getResponsibilities(responsibilitiesDataMock).subscribe((responsibilitiesData: ResponsibilitiesData) => {
          expect(responsibilitiesData).toEqual(expectedResponsibilities);

          done();
        });
      });

      it('calls getResponsibilities with the right parameters', (done) => {
        const getResponsibilitiesSpy = spyOn(myPerformanceApiService, 'getResponsibilities').and.callThrough();

        responsibilitiesService.getResponsibilities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(getResponsibilitiesSpy.calls.count()).toBe(1);
        expect(getResponsibilitiesSpy.calls.argsFor(0)[0]).toBe(positionIdMock);
      });

      it('does not call groupPeopleByGroupedEntities', (done) => {
        const groupPeopleByGroupedEntitiesSpy = spyOn(responsibilitiesTransformerService, 'groupPeopleByGroupedEntities').and.callThrough();

        responsibilitiesService.getResponsibilities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(groupPeopleByGroupedEntitiesSpy.calls.count()).toBe(0);
      });
    });

    describe('when myPerformanceApiService returns some distributors', () => {
      beforeEach(() => {
        peopleResponsibilitiesDTOMock.positions = undefined;
        peopleResponsibilitiesDTOMock.entityURIs[0] = 'distributors';
      });

      it('returns the distributors and their performances', (done) => {
        const expectedResponsibilities = {
          positionId: positionIdMock,
          groupedEntities: undefined as any,
          viewType: ViewType.distributors,
          entityTypes: undefined as any,
          entitiesURL: peopleResponsibilitiesDTOMock.entityURIs[0]
        };

        responsibilitiesService.getResponsibilities(responsibilitiesDataMock).subscribe((responsibilitiesData: ResponsibilitiesData) => {
          expect(responsibilitiesData).toEqual(expectedResponsibilities);

          done();
        });
      });

      it('calls getResponsibilities with the right parameters', (done) => {
        const getResponsibilitiesSpy = spyOn(myPerformanceApiService, 'getResponsibilities').and.callThrough();

        responsibilitiesService.getResponsibilities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(getResponsibilitiesSpy.calls.count()).toBe(1);
        expect(getResponsibilitiesSpy.calls.argsFor(0)[0]).toBe(positionIdMock);
      });

      it('does not call groupPeopleByGroupedEntities', (done) => {
        const groupPeopleByGroupedEntitiesSpy = spyOn(responsibilitiesTransformerService, 'groupPeopleByGroupedEntities').and.callThrough();

        responsibilitiesService.getResponsibilities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(groupPeopleByGroupedEntitiesSpy.calls.count()).toBe(0);
      });
    });
  });

  describe('when getPerformanceForGroupedEntities is called', () => {
    describe('when called for roleGroups', () => {
      const responsibilitiesDataMock: ResponsibilitiesData = {
        positionId: positionIdMock,
        viewType: ViewType.roleGroups,
        entityTypes: [{
          type: chance.string(),
          name: chance.string(),
          positionDescription: chance.string()
        }],
        groupedEntities: accountsDistributorsMock,
        filter: performanceFilterStateMock
      };

      it('returns performances totals', (done) => {
        spyOn(responsibilitiesService, 'getResponsibilitiesPerformances').and.callFake(() => {
          return Observable.of(entityWithPerformanceMock);
        });

        const expectedPerformancesTotal = {
          positionId: responsibilitiesDataMock.positionId,
          viewType: ViewType.roleGroups,
          entityTypes: responsibilitiesDataMock.entityTypes,
          filter: responsibilitiesDataMock.filter,
          entityWithPerformance: entityWithPerformanceMock,
          groupedEntities: responsibilitiesDataMock.groupedEntities
        };

        responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesDataMock)
          .subscribe((responsibilitiesData: ResponsibilitiesData) => {
            expect(responsibilitiesData).toEqual(expectedPerformancesTotal);

            done();
          });
      });

      it('calls getPerformanceForGroupedEntities with the right parameters', (done) => {
        const getResponsibilitiesPerformanceSpy = spyOn(responsibilitiesService, 'getResponsibilitiesPerformances').and.callThrough();

        responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(getResponsibilitiesPerformanceSpy.calls.count()).toBe(1);
        expect(getResponsibilitiesPerformanceSpy.calls.argsFor(0)).toEqual([
          responsibilitiesDataMock.entityTypes,
          responsibilitiesDataMock.filter,
          responsibilitiesDataMock.positionId
        ]);
      });
    });

    describe('when called for distributors', () => {
      const responsibilitiesDataMock: ResponsibilitiesData = {
        positionId: positionIdMock,
        viewType: ViewType.distributors,
        entityTypes: [{
          type: chance.string(),
          name: chance.string(),
          positionDescription: chance.string()
        }],
        groupedEntities: {'all': [ getEntityPeopleResponsibilitiesMock() ]},
        filter: performanceFilterStateMock
      };

      it('returns entities performance', (done) => {
        spyOn(responsibilitiesService, 'getDistributorsPerformances').and.callFake(() => {
          return Observable.of(entityWithPerformanceMock);
        });
        const expectedPerformancesTotal = {
          positionId: responsibilitiesDataMock.positionId,
          viewType: ViewType.distributors,
          entityTypes: responsibilitiesDataMock.entityTypes,
          filter: responsibilitiesDataMock.filter,
          groupedEntities: responsibilitiesDataMock.groupedEntities,
          entityWithPerformance: entityWithPerformanceMock
        };

        responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesDataMock)
          .subscribe((responsibilitiesData: ResponsibilitiesData) => {
            expect(responsibilitiesData).toEqual(expectedPerformancesTotal);

            done();
          });
      });

      it('calls getPerformanceForGroupedEntities with the right parameters', (done) => {
        const distributorsPerformanceSpy = spyOn(responsibilitiesService, 'getDistributorsPerformances').and.callFake(() => {
          return Observable.of(entityWithPerformanceMock);
        });
        responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(distributorsPerformanceSpy.calls.count()).toBe(1);
        expect(distributorsPerformanceSpy.calls.argsFor(0)).toEqual([
          responsibilitiesDataMock.groupedEntities.all,
          responsibilitiesDataMock.filter,
          responsibilitiesDataMock.positionId
        ]);
      });
    });

    describe('when called for accounts', () => {
      const responsibilitiesDataMock: ResponsibilitiesData = {
        positionId: positionIdMock,
        viewType: ViewType.accounts,
        entityTypes: [{
          type: chance.string(),
          name: chance.string(),
          positionDescription: chance.string()
        }],
        groupedEntities: {'all': [ getEntityPeopleResponsibilitiesMock() ]},
        filter: performanceFilterStateMock
      };

      it('returns a collection of EntityWithPerformance', (done) => {
        spyOn(responsibilitiesService, 'getAccountsPerformances').and.callFake(() => {
          return Observable.of(entityWithPerformanceMock);
        });
        const expectedPerformancesTotal = {
          positionId: responsibilitiesDataMock.positionId,
          viewType: ViewType.accounts,
          entityTypes: responsibilitiesDataMock.entityTypes,
          filter: responsibilitiesDataMock.filter,
          groupedEntities: responsibilitiesDataMock.groupedEntities,
          entityWithPerformance: entityWithPerformanceMock
        };

        responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesDataMock)
          .subscribe((responsibilitiesData: ResponsibilitiesData) => {
            expect(responsibilitiesData).toEqual(expectedPerformancesTotal);

            done();
          });
      });

      it('calls getPerformanceForGroupedEntities with the right parameters', (done) => {
        const accountsPerformanceSpy = spyOn(responsibilitiesService, 'getAccountsPerformances').and.callFake(() => {
          return Observable.of(entityWithPerformanceMock);
        });
        responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(accountsPerformanceSpy.calls.count()).toBe(1);
        expect(accountsPerformanceSpy.calls.argsFor(0)).toEqual([
          responsibilitiesDataMock.groupedEntities.all,
          responsibilitiesDataMock.filter,
          responsibilitiesDataMock.positionId
        ]);
      });
    });
  });

  describe('when getAccountsDistributors is called', () => {
    describe('when called for distributors or accounts', () => {
      const responsibilitiesDataMock: ResponsibilitiesData = {
        viewType: ViewType.distributors,
        entityTypes: [{
          type: chance.string(),
          name: chance.string(),
          positionDescription: chance.string()
        }]
      };

      it('returns accounts or distributors', (done) => {
        const expectedGroupedEntities = accountsDistributorsMock;

        responsibilitiesService.getAccountsDistributors(responsibilitiesDataMock)
          .subscribe((responsibilitiesData: ResponsibilitiesData) => {
            expect(responsibilitiesData.groupedEntities).toEqual(expectedGroupedEntities);

            done();
          });
      });

      it('calls getAccountsDistributors with the right parameters', (done) => {
        const getAccountsDistributorsSpy = spyOn(myPerformanceApiService, 'getAccountsDistributors').and.callThrough();

        responsibilitiesService.getAccountsDistributors(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(getAccountsDistributorsSpy.calls.count()).toBe(1);
        expect(getAccountsDistributorsSpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock.entitiesURL);
      });

      it('calls groupsAccountsDistributors with the right parameters', (done) => {
        const groupsAccountsDistributorsSpy = spyOn(responsibilitiesTransformerService, 'groupsAccountsDistributors').and.callThrough();

        responsibilitiesService.getAccountsDistributors(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(groupsAccountsDistributorsSpy.calls.count()).toBe(1);
        expect(groupsAccountsDistributorsSpy.calls.argsFor(0)[0]).toEqual(entityDTOMock);
      });

      it('gives back the original parameters if not call with accounts or distributors', (done) => {
        responsibilitiesDataMock.viewType = ViewType.roleGroups;

        const getAccountsDistributorsSpy = spyOn(myPerformanceApiService, 'getAccountsDistributors').and.callThrough();
        const groupsAccountsDistributorsSpy = spyOn(responsibilitiesTransformerService, 'groupsAccountsDistributors').and.callThrough();

        responsibilitiesService.getAccountsDistributors(responsibilitiesDataMock).subscribe(
          (responsibilitiesData: ResponsibilitiesData) => {
            expect(responsibilitiesDataMock).toBe(responsibilitiesData);

            done();
          });

        expect(getAccountsDistributorsSpy.calls.count()).toBe(0);
        expect(groupsAccountsDistributorsSpy.calls.count()).toBe(0);
      });
    });
  });

  describe('when getResponsibilitiesPerformances is called', () => {
    let entities: Array<{ positionId?: string, type: string, name: string, positionDescription: string }>;

    beforeEach(() => {
      entities = [
        {
          positionId: chance.string(),
          type: chance.string(),
          name: chance.string(),
          positionDescription: chance.string()
        },
        {
          positionId: chance.string(),
          type: chance.string(),
          name: chance.string(),
          positionDescription: chance.string()
        }
      ];
    });

    it('returns the transformed entities performances when given a positionId', (done) => {
      responsibilitiesService.getResponsibilitiesPerformances(
        entities,
        performanceFilterStateMock,
        positionIdMock
      )
        .subscribe((entityWithPerformance: EntityWithPerformance[]) => {
          expect(entityWithPerformance).toBe(entityWithPerformanceMock);

          done();
        });
    });

    it('returns the transformed entities performances not given a positionId', (done) => {
      responsibilitiesService.getResponsibilitiesPerformances(
        entities,
        performanceFilterStateMock
      )
        .subscribe((entityWithPerformance: EntityWithPerformance[]) => {
          expect(entityWithPerformance).toBe(entityWithPerformanceMock);

          done();
        });
    });

    it('calls getResponsibilityPerformance with the given positionId when then entities donn\'t have some', (done) => {
      const getPerformanceSpy = spyOn(myPerformanceApiService, 'getResponsibilityPerformance').and.callThrough();

      entities[0].positionId = undefined;
      entities[1].positionId = undefined;

      responsibilitiesService.getResponsibilitiesPerformances(
        entities,
        performanceFilterStateMock,
        positionIdMock
      )
        .subscribe((entityWithPerformance: EntityWithPerformance[]) => {
          expect(entityWithPerformance).toBe(entityWithPerformanceMock);

          done();
        });

      expect(getPerformanceSpy.calls.count()).toBe(2);
      expect(getPerformanceSpy.calls.argsFor(0)).toEqual([
        entities[0],
        performanceFilterStateMock,
        positionIdMock
      ]);
      expect(getPerformanceSpy.calls.argsFor(1)).toEqual([
        entities[1],
        performanceFilterStateMock,
        positionIdMock
      ]);
    });

    it('calls getResponsibilityPerformance with the individual entitie\'s positionId when they are popoulated', (done) => {
      const getPerformanceSpy = spyOn(myPerformanceApiService, 'getResponsibilityPerformance').and.callThrough();

      responsibilitiesService.getResponsibilitiesPerformances(
        entities,
        performanceFilterStateMock
      )
        .subscribe((entityWithPerformance: EntityWithPerformance[]) => {
          expect(entityWithPerformance).toBe(entityWithPerformanceMock);

          done();
        });

      expect(getPerformanceSpy.calls.count()).toBe(2);
      expect(getPerformanceSpy.calls.argsFor(0)).toEqual([
        entities[0],
        performanceFilterStateMock,
        entities[0].positionId
      ]);
      expect(getPerformanceSpy.calls.argsFor(1)).toEqual([
        entities[1],
        performanceFilterStateMock,
        entities[1].positionId
      ]);
    });

    it('calls transformEntityWithPerformanceDTOs with the right parameters', (done) => {
      const transformerSpy = spyOn(performanceTransformerService, 'transformEntityWithPerformanceDTOs').and.callThrough();

      responsibilitiesService.getResponsibilitiesPerformances(entities, performanceFilterStateMock)
        .subscribe((entityWithPerformance: EntityWithPerformance[]) => {
          done();
        });

      expect(transformerSpy.calls.count()).toBe(1);
      expect(transformerSpy.calls.argsFor(0)[0]).toEqual([
        responsibilityEntitiesPerformanceDTOMock,
        responsibilityEntitiesPerformanceDTOMock
      ]);
    });
  });

  describe('when getPerformance is called', () => {
    it('returns the transformed total performances', (done) => {
      responsibilitiesService.getPerformance(positionIdMock, performanceFilterStateMock)
        .subscribe((entitiesTotalPerformances: Performance) => {
          expect(entitiesTotalPerformances).toBe(entitiesTotalPerformancesMock);

          done();
        });
    });

    it('calls getPerformance with the right parameters', (done) => {
      const getPerformanceSpy = spyOn(myPerformanceApiService, 'getPerformance').and.callThrough();

      responsibilitiesService.getPerformance(positionIdMock, performanceFilterStateMock).subscribe(() => {
        done();
      });

      expect(getPerformanceSpy.calls.count()).toBe(1);
      expect(getPerformanceSpy.calls.argsFor(0)).toEqual([
        positionIdMock,
        performanceFilterStateMock
      ]);
    });

    it('calls transformPerformanceDTO with the right parameters', (done) => {
      const transformerSpy = spyOn(performanceTransformerService, 'transformPerformanceDTO').and.callThrough();

      responsibilitiesService.getPerformance(positionIdMock, performanceFilterStateMock).subscribe(() => {
        done();
      });

      expect(transformerSpy.calls.count()).toBe(1);
      expect(transformerSpy.calls.argsFor(0)[0]).toEqual(entitiesTotalPerformancesDTOMock);
    });
  });

  describe('getDistributorsPerformances', () => {
    it('should call getDistributorPerformance with the proper id for each distributor', () => {
      const getDistributorPerformanceSpy = spyOn(myPerformanceApiService, 'getDistributorPerformance').and.callFake(() => {
        return Observable.of(entitiesTotalPerformancesDTOMock);
      });
      const mockFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      const contextId = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#%^&*()[]'});
      const numberOfEntities = chance.natural({min: 1, max: 99});
      const distributors = Array(numberOfEntities).fill('').map(el => getEntityPropertyResponsibilitiesMock());
      responsibilitiesService.getDistributorsPerformances(distributors, mockFilter, contextId);
      expect(getDistributorPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
      distributors.map((distributor) => {
        expect(getDistributorPerformanceSpy).toHaveBeenCalledWith(distributor.positionId, mockFilter, contextId);
      });
    });
  });

  describe('getAccountsPerformances', () => {
    it('should call getAccountPerformance total with the proper id for each account', () => {
      const getAccountPerformanceSpy = spyOn(myPerformanceApiService, 'getAccountPerformance').and.callFake(() => {
        return Observable.of(entitiesTotalPerformancesDTOMock);
      });
      const mockFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      const contextId = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#%^&*()[]'});
      const numberOfEntities = chance.natural({min: 1, max: 99});
      const accounts = Array(numberOfEntities).fill('').map(el => getEntityPropertyResponsibilitiesMock());
      responsibilitiesService.getAccountsPerformances(accounts, mockFilter, contextId);
      expect(getAccountPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
      accounts.map((account) => {
        expect(getAccountPerformanceSpy).toHaveBeenCalledWith(account.positionId, mockFilter, contextId);
      });
    });
  });

  describe('when getSubAccounts is called', () => {
    let subAccountDataMock: SubAccountData;

    beforeEach(() => {
      entitySubAccountDTOMock = [getEntitySubAccountDTOMock(), getEntitySubAccountDTOMock()];
      subAccountDataMock = {
        positionId: positionIdMock,
        contextPositionId: contextPositionIdMock,
        entityType: chance.string(),
        premiseType: PremiseTypeValue.All,
        selectedPositionId: getMyPerformanceTableRowMock(1)[0].metadata.positionId
      };
      groupedSubAccountsMock = {
        [subAccountDataMock.entityType]: [{
          positionId: entitySubAccountDTOMock[0].subaccountCode,
          contextPositionId: entitySubAccountDTOMock[0].accountCode,
          name: entitySubAccountDTOMock[0].subaccountDescription,
          propertyType: EntityPropertyType.SubAccount
        }, {
          positionId: entitySubAccountDTOMock[1].subaccountCode,
          contextPositionId: entitySubAccountDTOMock[1].accountCode,
          name: entitySubAccountDTOMock[1].subaccountDescription,
          propertyType: EntityPropertyType.SubAccount
        }]
      };
    });

    it('calls getSubAccounts from the myPerformanceApiService with the right parameters', (done) => {
      const getSubAccountsSpy = spyOn(myPerformanceApiService, 'getSubAccounts').and.callThrough();

      responsibilitiesService.getSubAccounts(subAccountDataMock).subscribe(() => {
        done();
      });

      expect(getSubAccountsSpy.calls.count()).toBe(1);
      expect(getSubAccountsSpy.calls.argsFor(0)).toEqual([
        subAccountDataMock.positionId,
        subAccountDataMock.contextPositionId,
        subAccountDataMock.premiseType
      ]);
    });

    it('calls transformSubAccountsDTO with the right parameters', (done) => {
      const transformerSpy = spyOn(responsibilitiesTransformerService, 'transformSubAccountsDTO').and.callThrough();

      responsibilitiesService.getSubAccounts(subAccountDataMock).subscribe(() => {
        done();
      });

      expect(transformerSpy.calls.count()).toBe(1);
      expect(transformerSpy.calls.argsFor(0)[0]).toEqual(entitySubAccountDTOMock);
    });

    it('returns grouped subAccounts with initial subAccountData', (done) => {
      const expectedResponse: SubAccountData = Object.assign({}, subAccountDataMock, {
        groupedEntities : groupedSubAccountsMock
      });

      responsibilitiesService.getSubAccounts(subAccountDataMock).subscribe((actualResponse: SubAccountData) => {
        expect(expectedResponse).toEqual(actualResponse);
        done();
      });
    });
  });
});
