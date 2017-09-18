import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../enums/distribution-type.enum';
import { EntitiesPerformances, EntitiesPerformancesDTO } from '../models/entities-performances.model';
import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from '../models/entities-total-performances.model';
import { EntityDTO } from '../models/entity-dto.model';
import { EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { EntityResponsibilities } from '../models/entity-responsibilities.model';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { getEntitiesTotalPerformancesMock, getEntitiesTotalPerformancesDTOMock } from '../models/entities-total-performances.model.mock';
import { getEntitiesPerformancesMock, getResponsibilityEntitiesPerformanceDTOMock } from '../models/entities-performances.model.mock';
import { getEntityDTOMock } from '../models/entity-dto.model.mock';
import { getEntityPeopleResponsibilitiesMock } from '../models/entity-responsibilities.model.mock';
import { getEntitySubAccountDTOMock } from '../models/entity-subaccount-dto.model.mock';
import { getGroupedEntitiesMock } from '../models/grouped-entities.model.mock';
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
  let peopleResponsibilitiesDTOMock: PeopleResponsibilitiesDTO;
  let responsibilityEntitiesPerformanceDTOMock: EntitiesPerformancesDTO[];
  let entitiesPerformanceMock: EntitiesPerformances[];
  let performanceTotalMock: EntitiesTotalPerformances;
  let entitiesTotalPerformancesDTOMock: EntitiesTotalPerformancesDTO;
  let entityDTOMock: EntityDTO;
  let entitySubAccountDTOMock: EntitySubAccountDTO[];

  const performanceFilterStateMock: MyPerformanceFilterState = {
    metricType: MetricTypeValue.PointsOfDistribution,
    dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
    premiseType: PremiseTypeValue.On,
    distributionType: DistributionTypeValue.simple
  };

  const myPerformanceApiServiceMock = {
    getResponsibilities() {
      return Observable.of(peopleResponsibilitiesDTOMock);
    },
    getResponsibilityPerformanceTotal() {
      return Observable.of(responsibilityEntitiesPerformanceDTOMock);
    },
    getPerformanceTotal() {
      return Observable.of(entitiesTotalPerformancesDTOMock);
    },
    getAccountsDistributors() {
      return Observable.of(entityDTOMock);
    },
    getSubAccounts() {
      return Observable.of(entitySubAccountDTOMock);
    }
  };

  const performanceTransformerServiceMock = {
    transformEntitiesTotalPerformancesDTO(mockArgs: any): EntitiesTotalPerformances {
      return performanceTotalMock;
    },
    transformEntitiesPerformancesDTO(mockArgs: any): EntitiesPerformances[] {
      return entitiesPerformanceMock;
    }
  };

  const responsibilitiesTransformerServiceMock = {
    groupPeopleByGroupedEntities(mockArgs: any): GroupedEntities {
      return groupedEntitiesMock;
    },
    groupsAccountsDistributors(mockArgs: any): GroupedEntities {
      return accountsDistributorsMock;
    },
    transformSubAccountsDTO(mockArgs: any): Array<EntityResponsibilities> {
      return [{
        positionId: mockArgs[0].subaccountCode,
        contextPositionId: mockArgs[0].accountCode,
        name: mockArgs[0].subaccountDescription,
        propertyType: EntityPropertyType.SubAccount
      }];
    }
  };

  let responsibilitiesService: ResponsibilitiesService;
  let myPerformanceApiService: MyPerformanceApiService;
  let performanceTransformerService: PerformanceTransformerService;
  let responsibilitiesTransformerService: ResponsibilitiesTransformerService;

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
      entitiesPerformanceMock = getEntitiesPerformancesMock();
      performanceTotalMock = getEntitiesTotalPerformancesMock();
      entitiesTotalPerformancesDTOMock = getEntitiesTotalPerformancesDTOMock();
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
              name: 'GENERAL MANAGER'
            },
            {
              type: groupedEntitiesMock['MARKET DEVELOPMENT MANAGER'][0].type,
              name: 'MARKET DEVELOPMENT MANAGER'
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

  describe('when getPerformanceTotalForGroupedEntities is called', () => {
    describe('when called for roleGroups', () => {
      const responsibilitiesDataMock: ResponsibilitiesData = {
        positionId: positionIdMock,
        viewType: ViewType.roleGroups,
        entityTypes: [{
          type: chance.string(),
          name: chance.string()
        }],
        filter: performanceFilterStateMock
      };

      it('returns performances totals', (done) => {
        spyOn(responsibilitiesService, 'getResponsibilitiesPerformanceTotals').and.callFake(() => {
          return Observable.of(entitiesPerformanceMock);
        });

        const expectedPerformancesTotal = {
          positionId: responsibilitiesDataMock.positionId,
          viewType: ViewType.roleGroups,
          entityTypes: responsibilitiesDataMock.entityTypes,
          filter: responsibilitiesDataMock.filter,
          entitiesPerformances: entitiesPerformanceMock
        };

        responsibilitiesService.getPerformanceTotalForGroupedEntities(responsibilitiesDataMock)
          .subscribe((responsibilitiesData: ResponsibilitiesData) => {
          expect(responsibilitiesData).toEqual(expectedPerformancesTotal);

          done();
        });
      });

      it('calls getPerformanceTotalForGroupedEntities with the right parameters', (done) => {
        const getResponsibilitiesPerformanceSpy = spyOn(responsibilitiesService, 'getResponsibilitiesPerformanceTotals').and.callThrough();

        responsibilitiesService.getPerformanceTotalForGroupedEntities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(getResponsibilitiesPerformanceSpy.calls.count()).toBe(1);
        expect(getResponsibilitiesPerformanceSpy.calls.argsFor(0)).toEqual([
          responsibilitiesDataMock.entityTypes,
          responsibilitiesDataMock.filter,
          responsibilitiesDataMock.positionId
        ]);
      });

      it('does not call getPerformanceTotalForGroupedEntities if we are not viewing role groups', (done) => {
        responsibilitiesDataMock.viewType = ViewType.accounts;
        const getResponsibilitiesPerformanceSpy = spyOn(responsibilitiesService, 'getResponsibilitiesPerformanceTotals').and.callThrough();

        responsibilitiesService.getPerformanceTotalForGroupedEntities(responsibilitiesDataMock).subscribe(
          (responsibilitiesData: ResponsibilitiesData) => {
          expect(responsibilitiesDataMock).toBe(responsibilitiesData);

          done();
        });

        expect(getResponsibilitiesPerformanceSpy.calls.count()).toBe(0);
      });
    });
  });

  describe('when getAccountsDistributors is called', () => {
    describe('when called for distributors or accounts', () => {
      const responsibilitiesDataMock: ResponsibilitiesData = {
        viewType: ViewType.distributors,
        entityTypes: [{
          type: chance.string(),
          name: chance.string()
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

  describe('when getResponsibilitiesPerformanceTotals is called', () => {
    let entities: Array<{ positionId?: string, type: string, name: string }>;

    beforeEach(() => {
      entities = [
        {
          positionId: chance.string(),
          type: chance.string(),
          name: chance.string()
        },
        {
          positionId: chance.string(),
          type: chance.string(),
          name: chance.string()
        }
      ];
    });

    it('returns the transformed entities performances when given a positionId', (done) => {
      responsibilitiesService.getResponsibilitiesPerformanceTotals(
        entities,
        performanceFilterStateMock,
        positionIdMock
        )
        .subscribe((entitiesPerformances: EntitiesPerformances[]) => {
        expect(entitiesPerformances).toBe(entitiesPerformanceMock);

        done();
      });
    });

    it('returns the transformed entities performances not given a positionId', (done) => {
      responsibilitiesService.getResponsibilitiesPerformanceTotals(
        entities,
        performanceFilterStateMock
        )
        .subscribe((entitiesPerformances: EntitiesPerformances[]) => {
        expect(entitiesPerformances).toBe(entitiesPerformanceMock);

        done();
      });
    });

    it('calls getResponsibilityPerformanceTotal with the given positionId when then entities donn\'t have some', (done) => {
      const getPerformanceSpy = spyOn(myPerformanceApiService, 'getResponsibilityPerformanceTotal').and.callThrough();

      entities[0].positionId = undefined;
      entities[1].positionId = undefined;

      responsibilitiesService.getResponsibilitiesPerformanceTotals(
        entities,
        performanceFilterStateMock,
        positionIdMock
        )
        .subscribe((entitiesPerformances: EntitiesPerformances[]) => {
        expect(entitiesPerformances).toBe(entitiesPerformanceMock);

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

    it('calls getResponsibilityPerformanceTotal with the individual entitie\'s positionId when they are popoulated', (done) => {
      const getPerformanceSpy = spyOn(myPerformanceApiService, 'getResponsibilityPerformanceTotal').and.callThrough();

      responsibilitiesService.getResponsibilitiesPerformanceTotals(
        entities,
        performanceFilterStateMock
        )
        .subscribe((entitiesPerformances: EntitiesPerformances[]) => {
        expect(entitiesPerformances).toBe(entitiesPerformanceMock);

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

    it('calls transformEntitiesPerformancesDTO with the right parameters', (done) => {
      const transformerSpy = spyOn(performanceTransformerService, 'transformEntitiesPerformancesDTO').and.callThrough();

      responsibilitiesService.getResponsibilitiesPerformanceTotals(entities, performanceFilterStateMock)
        .subscribe((entitiesPerformances: EntitiesPerformances[]) => {
        done();
      });

      expect(transformerSpy.calls.count()).toBe(1);
      expect(transformerSpy.calls.argsFor(0)[0]).toEqual([
        responsibilityEntitiesPerformanceDTOMock,
        responsibilityEntitiesPerformanceDTOMock
      ]);
    });
  });

  describe('when getPerformanceTotal is called', () => {
    it('returns the transformed total performances', (done) => {
      responsibilitiesService.getPerformanceTotal(positionIdMock, performanceFilterStateMock)
        .subscribe((entitiesTotalPerformances: EntitiesTotalPerformances) => {
        expect(entitiesTotalPerformances).toBe(performanceTotalMock);

        done();
      });
    });

    it('calls getPerformanceTotal with the right parameters', (done) => {
      const getPerformanceTotalSpy = spyOn(myPerformanceApiService, 'getPerformanceTotal').and.callThrough();

      responsibilitiesService.getPerformanceTotal(positionIdMock, performanceFilterStateMock).subscribe(() => {
        done();
      });

      expect(getPerformanceTotalSpy.calls.count()).toBe(1);
      expect(getPerformanceTotalSpy.calls.argsFor(0)).toEqual([
        positionIdMock,
        performanceFilterStateMock
      ]);
    });

    it('calls transformEntitiesTotalPerformancesDTO with the right parameters', (done) => {
      const transformerSpy = spyOn(performanceTransformerService, 'transformEntitiesTotalPerformancesDTO').and.callThrough();

      responsibilitiesService.getPerformanceTotal(positionIdMock, performanceFilterStateMock).subscribe(() => {
        done();
      });

      expect(transformerSpy.calls.count()).toBe(1);
      expect(transformerSpy.calls.argsFor(0)[0]).toEqual(entitiesTotalPerformancesDTOMock);
    });
  });

  describe('when getSubAccounts is called', () => {
    let subAccountDataMock: SubAccountData;

    beforeEach(() => {
      entitySubAccountDTOMock = getEntitySubAccountDTOMock();
      subAccountDataMock = {
        positionId: positionIdMock,
        contextPositionId: contextPositionIdMock,
        entityType: chance.string(),
        premiseType: PremiseTypeValue.All,
        entitiesTotalPerformances: getMyPerformanceTableRowMock(1)[0]
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
        groupedEntities: {
          [subAccountDataMock.entityType]: [{
            positionId: entitySubAccountDTOMock[0].subaccountCode,
            contextPositionId: entitySubAccountDTOMock[0].accountCode,
            name: entitySubAccountDTOMock[0].subaccountDescription,
            propertyType: EntityPropertyType.SubAccount
          }]
        }
      });

      responsibilitiesService.getSubAccounts(subAccountDataMock).subscribe((actualResponse: SubAccountData) => {
        expect(expectedResponse).toEqual(actualResponse);
        done();
      });
    });
  });
});
