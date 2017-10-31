import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';
import { sample } from 'lodash';

import { DateRangeTimePeriodValue } from '../enums/date-range-time-period.enum';
import { EntityDTO } from '../models/entity-dto.model';
import { EntityWithPerformance, EntityWithPerformanceDTO } from '../models/entity-with-performance.model';
import { EntityPeopleType, EntityType, HierarchyGroupTypeCode } from '../enums/entity-responsibilities.enum';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { HierarchyGroup } from '../models/hierarchy-group.model';
import { getEntitiesWithPerformancesMock,
         getResponsibilityEntitiesPerformanceDTOMock } from '../models/entity-with-performance.model.mock';
import { getEntityPeopleResponsibilitiesMock, getEntityPropertyResponsibilitiesMock } from '../models/hierarchy-entity.model.mock';
import { getEntityTypeMock } from '../enums/entity-responsibilities.enum.mock';
import { getPerformanceMock, getPerformanceDTOMock } from '../models/performance.model.mock';
import { getEntityDTOMock } from '../models/entity-dto.model.mock';
import { getEntitySubAccountDTOMock } from '../models/entity-subaccount-dto.model.mock';
import { getGroupedEntitiesMock } from '../models/grouped-entities.model.mock';
import { getHierarchyGroupMock } from '../models/hierarchy-group.model.mock';
import { getMyPerformanceFilterMock } from '../models/my-performance-filter.model.mock';
import { getMyPerformanceTableRowMock } from '../models/my-performance-table-row.model.mock';
import { getPeopleResponsibilitiesDTOMock } from '../models/people-responsibilities-dto.model.mock';
import { GroupedEntities } from '../models/grouped-entities.model';
import { HierarchyEntity, HierarchyEntityDTO } from '../models/hierarchy-entity.model';
import { MetricTypeValue } from '../enums/metric-type.enum';
import { MyPerformanceApiService } from '../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../state/reducers/my-performance-filter.reducer';
import { PeopleResponsibilitiesDTO } from '../models/people-responsibilities-dto.model';
import { Performance, PerformanceDTO } from '../models/performance.model';
import { PerformanceTransformerService } from '../services/performance-transformer.service';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ResponsibilitiesTransformerService } from '../services/responsibilities-transformer.service';
import { ResponsibilitiesService,
         ResponsibilitiesData,
         SubAccountData,
         FetchEntityWithPerformanceData,
         RefreshAllPerformancesData,
         RefreshTotalPerformanceData } from './responsibilities.service';
import { SalesHierarchyViewType } from '../enums/sales-hierarchy-view-type.enum';
import { SkuPackageType } from '../enums/sku-package-type.enum';

const chance = new Chance();

describe('Responsibilities Effects', () => {
  let positionIdMock: string;
  let alternateHierarchyIdMock: string;
  let contextPositionIdMock: string;
  let brandCodeMock: string;
  let skuPackageTypeMock: SkuPackageType;
  let groupedEntitiesMock: GroupedEntities;
  let hierarchyGroupsMock: HierarchyGroup[];
  let entityTypeMock: EntityType;
  let accountsDistributorsDTOMock: EntityDTO[];
  let accountsDistributorsMock: GroupedEntities;
  let groupedSubAccountsMock: GroupedEntities;
  let peopleResponsibilitiesDTOMock: PeopleResponsibilitiesDTO;
  let peopleResponsibilitiesMock: HierarchyEntity[];
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
  let performanceDTOMock: PerformanceDTO;

  const performanceFilterStateMock: MyPerformanceFilterState = getMyPerformanceFilterMock();

  const myPerformanceApiServiceMock = {
    getResponsibilities() {
      return Observable.of(peopleResponsibilitiesDTOMock);
    },
    getHierarchyGroupPerformance() {
      return Observable.of(performanceDTOMock);
    },
    getAlternateHierarchyGroupPerformance() {
      return Observable.of(performanceDTOMock);
    },
    getPerformance() {
      return Observable.of(entitiesTotalPerformancesDTOMock);
    },
    getAlternateHierarchyPersonPerformance() {
      return Observable.of(entitiesTotalPerformancesDTOMock);
    },
    getAccountsDistributors() {
      return Observable.of(accountsDistributorsDTOMock);
    },
    getDistributorPerformance() {
      return Observable.of(entitiesTotalPerformancesDTOMock);
    },
    getAccountPerformance() {
      return Observable.of(entitiesTotalPerformancesDTOMock);
    },
    getSubAccountPerformance() {
      return Observable.of(entitiesTotalPerformancesDTOMock);
    },
    getSubAccounts() {
      return Observable.of(entitySubAccountDTOMock);
    },
    getAlternateHierarchy() {
      return Observable.of(peopleResponsibilitiesDTOMock);
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
    },
    groupPeopleEntitiesByRole(mockArgs: HierarchyEntity[]): GroupedEntities {
      return groupedEntitiesMock;
    },
    transformHierarchyEntityDTOCollection(mockArgs: HierarchyEntityDTO[]): HierarchyEntity[] {
      return peopleResponsibilitiesMock;
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
    },
    transformEntityWithPerformance(mockArgs: any): EntityWithPerformance {
      return entityWithPerformanceMock[0];
    },
    transformHierarchyGroupPerformance(mockArgs: any): EntityWithPerformance {
      return entityWithPerformanceMock[0];
    }
  };

  const toastServiceMock = {
    showPerformanceDataErrorToast: jasmine.createSpy('showPerformanceDataErrorToast')
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
      },
      {
        provide: 'toastService',
        useValue: toastServiceMock
      }
    ]
  }));

  beforeEach(inject([ResponsibilitiesService, MyPerformanceApiService, PerformanceTransformerService, ResponsibilitiesTransformerService],
    (_responsibilitiesService: ResponsibilitiesService,
     _myPerformanceApiService: MyPerformanceApiService,
     _performanceTransformerService: PerformanceTransformerService,
     _responsibilitiesTransformerService: ResponsibilitiesTransformerService) => {
      responsibilitiesService = _responsibilitiesService;
      myPerformanceApiService = _myPerformanceApiService;
      performanceTransformerService = _performanceTransformerService;
      responsibilitiesTransformerService = _responsibilitiesTransformerService;
      positionIdMock = chance.string();
      alternateHierarchyIdMock = chance.string();
      contextPositionIdMock = chance.string();
      brandCodeMock = chance.string();
      groupedEntitiesMock = getGroupedEntitiesMock();
      hierarchyGroupsMock = Array(chance.natural({min: 1, max: 99}))
        .fill('').map(el => getHierarchyGroupMock());
      entityTypeMock = getEntityTypeMock();
      accountsDistributorsDTOMock = [ Object.assign({}, getEntityDTOMock(), {
        type: EntityType.Distributor
      })];
      accountsDistributorsMock = {
        [accountsDistributorsDTOMock[0].type]: [{
          name: accountsDistributorsDTOMock[0].name,
          positionId: accountsDistributorsDTOMock[0].id,
          entityType: EntityType[accountsDistributorsDTOMock[0].type]
        }]
      };
      peopleResponsibilitiesDTOMock = getPeopleResponsibilitiesDTOMock();
      peopleResponsibilitiesMock = [ getEntityPeopleResponsibilitiesMock(), getEntityPeopleResponsibilitiesMock() ];
      responsibilityEntitiesPerformanceDTOMock = getResponsibilityEntitiesPerformanceDTOMock();
      entityWithPerformanceMock = getEntitiesWithPerformancesMock();
      entitiesTotalPerformancesMock = getPerformanceMock();
      entitiesTotalPerformancesDTOMock = getPerformanceDTOMock();
      entityDTOMock = getEntityDTOMock();
      accountsDistributorsDTOMock = [ Object.assign({}, getEntityDTOMock(), {
        type: EntityType.Distributor
      })];
      toastServiceMock.showPerformanceDataErrorToast.calls.reset();
      performanceDTOMock = getPerformanceDTOMock();
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
        const expectedResponsibilities: ResponsibilitiesData = {
          positionId: positionIdMock,
          groupedEntities: groupedEntitiesMock,
          salesHierarchyViewType: SalesHierarchyViewType.roleGroups,
          hierarchyGroups: [{
            type: groupedEntitiesMock['GENERAL MANAGER'][0].type,
            name: 'GENERAL MANAGER',
            positionDescription: groupedEntitiesMock['GENERAL MANAGER'][0].positionDescription,
            entityType: EntityType.RoleGroup
          }, {
            type: groupedEntitiesMock['MARKET DEVELOPMENT MANAGER'][0].type,
            name: 'MARKET DEVELOPMENT MANAGER',
            positionDescription: groupedEntitiesMock['MARKET DEVELOPMENT MANAGER'][0].positionDescription,
            entityType: EntityType.RoleGroup
          }]
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
        const groupPeopleByGroupedEntitiesSpy = spyOn(responsibilitiesTransformerService,
          'groupPeopleByGroupedEntities').and.callThrough();

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
          salesHierarchyViewType: SalesHierarchyViewType.accounts,
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
        const groupPeopleByGroupedEntitiesSpy = spyOn(responsibilitiesTransformerService,
          'groupPeopleByGroupedEntities').and.callThrough();

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
          salesHierarchyViewType: SalesHierarchyViewType.distributors,
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
        const groupPeopleByGroupedEntitiesSpy = spyOn(responsibilitiesTransformerService,
          'groupPeopleByGroupedEntities').and.callThrough();

        responsibilitiesService.getResponsibilities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(groupPeopleByGroupedEntitiesSpy.calls.count()).toBe(0);
      });
    });
  });

  describe('when getAlternateHierarchyResponsibilities is called', () => {
    let responsibilitiesDataMock: ResponsibilitiesData;

    beforeEach(() => {
      responsibilitiesDataMock = {
        positionId: positionIdMock,
        alternateHierarchyId: alternateHierarchyIdMock
      };
    });

    describe('when myPerformanceApiService.getAlternateHierarchy returns positions', () => {

      beforeEach(() => {
        peopleResponsibilitiesDTOMock.entityURIs = undefined;
      });

      it('returns positions and their performances', (done) => {
        const expectedResponsibilities: ResponsibilitiesData = {
          positionId: positionIdMock,
          alternateHierarchyId: alternateHierarchyIdMock,
          groupedEntities: groupedEntitiesMock,
          salesHierarchyViewType: SalesHierarchyViewType.roleGroups,
          hierarchyGroups: [{
            type: groupedEntitiesMock['GENERAL MANAGER'][0].type,
            name: 'GENERAL MANAGER',
            positionDescription: groupedEntitiesMock['GENERAL MANAGER'][0].positionDescription,
            entityType: EntityType.RoleGroup
          }, {
            type: groupedEntitiesMock['MARKET DEVELOPMENT MANAGER'][0].type,
            name: 'MARKET DEVELOPMENT MANAGER',
            positionDescription: groupedEntitiesMock['MARKET DEVELOPMENT MANAGER'][0].positionDescription,
            entityType: EntityType.RoleGroup
          }]
        };

        responsibilitiesService.getAlternateHierarchyResponsibilities(responsibilitiesDataMock)
          .subscribe((responsibilitiesData: ResponsibilitiesData) => {
            expect(responsibilitiesData).toEqual(expectedResponsibilities);
            done();
          });
      });
    });

    it('calls myPerformanceApiService.getAlternateHierarchy with the right parameters', (done) => {
      const getAlternateHierarchySpy = spyOn(myPerformanceApiService, 'getAlternateHierarchy').and.callThrough();

      responsibilitiesService.getAlternateHierarchyResponsibilities(responsibilitiesDataMock).subscribe(() => {
        done();
      });

      expect(getAlternateHierarchySpy.calls.count()).toBe(1);
      expect(getAlternateHierarchySpy.calls.argsFor(0)).toEqual([positionIdMock, alternateHierarchyIdMock]);
    });

    it('calls groupPeopleByGroupedEntities with the right parameters', (done) => {
      const groupPeopleByGroupedEntitiesSpy = spyOn(responsibilitiesTransformerService,
        'groupPeopleByGroupedEntities').and.callThrough();

      responsibilitiesService.getAlternateHierarchyResponsibilities(responsibilitiesDataMock).subscribe(() => {
        done();
      });

      expect(groupPeopleByGroupedEntitiesSpy.calls.count()).toBe(1);
      expect(groupPeopleByGroupedEntitiesSpy.calls.argsFor(0)[0]).toBe(peopleResponsibilitiesDTOMock.positions);
    });

    describe('when myPerformanceApiService.getAlternateHierarchy returns accounts', () => {
      beforeEach(() => {
        peopleResponsibilitiesDTOMock.positions = undefined;
        peopleResponsibilitiesDTOMock.entityURIs[0] = 'accounts';
      });

      it('returns accounts and their performances', (done) => {
        const expectedResponsibilities = {
          positionId: positionIdMock,
          alternateHierarchyId: alternateHierarchyIdMock,
          salesHierarchyViewType: SalesHierarchyViewType.accounts,
          entitiesURL: peopleResponsibilitiesDTOMock.entityURIs[0]
        };

        responsibilitiesService.getAlternateHierarchyResponsibilities(responsibilitiesDataMock)
          .subscribe((responsibilitiesData: ResponsibilitiesData) => {
            expect(responsibilitiesData).toEqual(expectedResponsibilities);
            done();
          });
      });

      it('does not call groupPeopleByGroupedEntities', (done) => {
        const groupPeopleByGroupedEntitiesSpy = spyOn(responsibilitiesTransformerService,
          'groupPeopleByGroupedEntities').and.callThrough();

        responsibilitiesService.getAlternateHierarchyResponsibilities(responsibilitiesDataMock).subscribe(() => {
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
          alternateHierarchyId: alternateHierarchyIdMock,
          salesHierarchyViewType: SalesHierarchyViewType.distributors,
          entitiesURL: peopleResponsibilitiesDTOMock.entityURIs[0]
        };

        responsibilitiesService.getAlternateHierarchyResponsibilities(responsibilitiesDataMock)
          .subscribe((responsibilitiesData: ResponsibilitiesData) => {
            expect(responsibilitiesData).toEqual(expectedResponsibilities);
            done();
          });
      });

      it('does not call groupPeopleByGroupedEntities', (done) => {
        const groupPeopleByGroupedEntitiesSpy = spyOn(responsibilitiesTransformerService,
          'groupPeopleByGroupedEntities').and.callThrough();

        responsibilitiesService.getAlternateHierarchyResponsibilities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(groupPeopleByGroupedEntitiesSpy.calls.count()).toBe(0);
      });
    });
  });

  describe('when getPerformanceForGroupedEntities is called', () => {
    describe('when called for salesHierarchyViewType.roleGroups', () => {
      const responsibilitiesDataMock: ResponsibilitiesData = {
        positionId: positionIdMock,
        salesHierarchyViewType: SalesHierarchyViewType.roleGroups,
        hierarchyGroups: [{
          type: chance.string(),
          name: chance.string(),
          positionDescription: chance.string(),
          entityType: EntityType.RoleGroup
        }],
        groupedEntities: accountsDistributorsMock,
        filter: performanceFilterStateMock,
        brandSkuCode: brandCodeMock
      };

      it('returns performances totals for role groups', (done) => {
        spyOn(responsibilitiesService, 'getHierarchyGroupsPerformances').and.callFake(() => {
          return Observable.of(entityWithPerformanceMock);
        });

        const expectedPerformancesTotal = {
          positionId: responsibilitiesDataMock.positionId,
          salesHierarchyViewType: SalesHierarchyViewType.roleGroups,
          hierarchyGroups: responsibilitiesDataMock.hierarchyGroups,
          filter: responsibilitiesDataMock.filter,
          entityWithPerformance: entityWithPerformanceMock,
          groupedEntities: responsibilitiesDataMock.groupedEntities,
          brandSkuCode: responsibilitiesDataMock.brandSkuCode
        };

        responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesDataMock)
          .subscribe((responsibilitiesData: ResponsibilitiesData) => {
            expect(responsibilitiesData).toEqual(expectedPerformancesTotal);

            done();
          });
      });

      it('calls getHierarchyGroupsPerformances with the right parameters', (done) => {
        const getHierarchyGroupsPerformancesSpy = spyOn(responsibilitiesService, 'getHierarchyGroupsPerformances').and.callThrough();

        responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(getHierarchyGroupsPerformancesSpy.calls.count()).toBe(1);
        expect(getHierarchyGroupsPerformancesSpy.calls.argsFor(0)).toEqual([
          responsibilitiesDataMock.hierarchyGroups,
          responsibilitiesDataMock.filter,
          responsibilitiesDataMock.positionId,
          responsibilitiesDataMock.brandSkuCode,
          null
        ]);
      });
    });

    describe('when called for salesHierarchyViewType.distributors', () => {
      const responsibilitiesDataMock: ResponsibilitiesData = {
        positionId: positionIdMock,
        salesHierarchyViewType: SalesHierarchyViewType.distributors,
        hierarchyGroups: [{
          type: chance.string(),
          name: chance.string(),
          positionDescription: chance.string(),
          entityType: EntityType.Distributor
        }],
        groupedEntities: { 'DISTRIBUTOR': [ getEntityPeopleResponsibilitiesMock() ]},
        filter: performanceFilterStateMock,
        brandSkuCode: brandCodeMock
      };

      it('returns performance entities for distributors', (done) => {
        spyOn(responsibilitiesService, 'getDistributorsPerformances').and.callFake(() => {
          return Observable.of(entityWithPerformanceMock);
        });
        const expectedPerformancesTotal = {
          positionId: responsibilitiesDataMock.positionId,
          salesHierarchyViewType: SalesHierarchyViewType.distributors,
          hierarchyGroups: responsibilitiesDataMock.hierarchyGroups,
          filter: responsibilitiesDataMock.filter,
          groupedEntities: responsibilitiesDataMock.groupedEntities,
          entityWithPerformance: entityWithPerformanceMock,
          brandSkuCode: responsibilitiesDataMock.brandSkuCode
        };

        responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesDataMock)
          .subscribe((responsibilitiesData: ResponsibilitiesData) => {
            expect(responsibilitiesData).toEqual(expectedPerformancesTotal);

            done();
          });
      });

      it('calls getDistributorsPerformances with the right parameters when NO alternateHierarchyId is passed in the data', (done) => {
        const distributorsPerformanceSpy = spyOn(responsibilitiesService, 'getDistributorsPerformances').and.returnValue(
          Observable.of(entityWithPerformanceMock));

        responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(distributorsPerformanceSpy.calls.count()).toBe(1);
        expect(distributorsPerformanceSpy.calls.argsFor(0)).toEqual([
          responsibilitiesDataMock.groupedEntities.DISTRIBUTOR,
          responsibilitiesDataMock.filter,
          responsibilitiesDataMock.positionId,
          responsibilitiesDataMock.brandSkuCode
        ]);
      });

      it('calls getDistributorsPerformances with the right parameters when an alternateHierarchyId IS passed in the data', (done) => {
        const distributorsPerformanceSpy = spyOn(responsibilitiesService, 'getDistributorsPerformances').and.returnValue(
          Observable.of(entityWithPerformanceMock));

        responsibilitiesDataMock.alternateHierarchyId = chance.string();

        responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(distributorsPerformanceSpy.calls.count()).toBe(1);
        expect(distributorsPerformanceSpy.calls.argsFor(0)).toEqual([
          responsibilitiesDataMock.groupedEntities.DISTRIBUTOR,
          responsibilitiesDataMock.filter,
          '0',
          responsibilitiesDataMock.brandSkuCode
        ]);
      });
    });

    describe('when called for salesHierarchyViewType.accounts', () => {
      const responsibilitiesDataMock: ResponsibilitiesData = {
        positionId: positionIdMock,
        salesHierarchyViewType: SalesHierarchyViewType.accounts,
        hierarchyGroups: [{
          type: chance.string(),
          name: chance.string(),
          positionDescription: chance.string(),
          entityType: EntityType.Account
        }],
        groupedEntities: { 'ACCOUNT': [ getEntityPeopleResponsibilitiesMock() ]},
        filter: performanceFilterStateMock
      };

      it('returns performance entities for accounts', (done) => {
        spyOn(responsibilitiesService, 'getAccountsPerformances').and.callFake(() => {
          return Observable.of(entityWithPerformanceMock);
        });
        const expectedPerformancesTotal = {
          positionId: responsibilitiesDataMock.positionId,
          salesHierarchyViewType: SalesHierarchyViewType.accounts,
          hierarchyGroups: responsibilitiesDataMock.hierarchyGroups,
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

      it('calls getAccountsPerformances with the right parameters', (done) => {
        const accountsPerformanceSpy = spyOn(responsibilitiesService, 'getAccountsPerformances').and.callFake(() => {
          return Observable.of(entityWithPerformanceMock);
        });
        responsibilitiesService.getPerformanceForGroupedEntities(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(accountsPerformanceSpy.calls.count()).toBe(1);
        expect(accountsPerformanceSpy.calls.argsFor(0)).toEqual([
          responsibilitiesDataMock.groupedEntities.ACCOUNT,
          responsibilitiesDataMock.filter,
          responsibilitiesDataMock.positionId,
          responsibilitiesDataMock.brandSkuCode
        ]);
      });
    });
  });

  describe('when getAccountsDistributors is called', () => {
    describe('when called for distributors or accounts', () => {
      const responsibilitiesDataMock: ResponsibilitiesData = {
        salesHierarchyViewType: SalesHierarchyViewType.distributors,
        hierarchyGroups: [{
          type: 'Distributor',
          name: chance.string(),
          positionDescription: chance.string(),
          entityType: EntityType.Distributor
        }],
        entitiesURL: chance.string()
      };

      it('returns accounts or distributors', (done) => {
        responsibilitiesService.getAccountsDistributors(responsibilitiesDataMock)
          .subscribe((responsibilitiesData: ResponsibilitiesData) => {
            expect(responsibilitiesData.groupedEntities).toEqual(accountsDistributorsMock);

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
        const accountEntityDTOResponseMock: EntityDTO[] = [Object.assign({}, getEntityDTOMock(), {
          type: EntityType.Distributor
        })];
        const groupsAccountsDistributorsSpy = spyOn(responsibilitiesTransformerService, 'groupsAccountsDistributors').and.callThrough();

        spyOn(myPerformanceApiService, 'getAccountsDistributors').and.returnValue(Observable.of(accountEntityDTOResponseMock));

        responsibilitiesService.getAccountsDistributors(responsibilitiesDataMock).subscribe(() => {
          done();
        });

        expect(groupsAccountsDistributorsSpy.calls.count()).toBe(1);
        expect(groupsAccountsDistributorsSpy.calls.argsFor(0)).toEqual([
          accountEntityDTOResponseMock,
          'DISTRIBUTOR'
        ]);
      });

      it('gives back the original parameters if not call with accounts or distributors', (done) => {
        responsibilitiesDataMock.salesHierarchyViewType = SalesHierarchyViewType.roleGroups;

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

  describe('when getHierarchyGroupsPerformances is called', () => {
    let hierarchyGroups: Array<HierarchyGroup>;

    beforeEach(() => {
      hierarchyGroups = [{
        type: chance.string(),
        name: chance.string(),
        positionDescription: chance.string(),
        entityType: EntityType.RoleGroup
      }, {
        type: chance.string(),
        name: chance.string(),
        positionDescription: chance.string(),
        entityType: EntityType.RoleGroup
      }];
    });

    it('returns transformed hierarchy groups with their performance data', (done) => {
      responsibilitiesService.getHierarchyGroupsPerformances(hierarchyGroups, performanceFilterStateMock, positionIdMock)
        .subscribe((entityWithPerformance: EntityWithPerformance[]) => {
          expect(entityWithPerformance).toEqual([entityWithPerformanceMock[0], entityWithPerformanceMock[0]]);
          done();
        });
    });

    it('calls getHierarchyGroupPerformance with the given positionId when the given HierarchyGroup has ' +
    'no alternateHierarchyId', (done) => {
      const getGroupPerformanceSpy = spyOn(myPerformanceApiService, 'getHierarchyGroupPerformance').and.callThrough();
      const getAlternateGroupPerformanceSpy = spyOn(myPerformanceApiService, 'getAlternateHierarchyGroupPerformance').and.callThrough();

      responsibilitiesService.getHierarchyGroupsPerformances(hierarchyGroups, performanceFilterStateMock, positionIdMock, brandCodeMock)
        .subscribe((entityWithPerformance: EntityWithPerformance[]) => {
          expect(entityWithPerformance).toEqual([entityWithPerformanceMock[0], entityWithPerformanceMock[0]]);
          done();
        });

      expect(getGroupPerformanceSpy.calls.count()).toBe(hierarchyGroups.length);

      hierarchyGroups.forEach((hierarchyGroup: HierarchyGroup, index: number) => {
        expect(getGroupPerformanceSpy.calls.argsFor(index)).toEqual([
          hierarchyGroup,
          performanceFilterStateMock,
          positionIdMock,
          brandCodeMock
        ]);
      });

      expect(getAlternateGroupPerformanceSpy).not.toHaveBeenCalled();
    });

    it('calls getAlternateHierarchyGroupPerformance with the group`s postiionId and alternateHierarchyId given HierarchyGroup has ' +
    'an alternateHierarchyId', (done) => {
      const getGroupPerformanceSpy = spyOn(myPerformanceApiService, 'getHierarchyGroupPerformance').and.callThrough();
      const getAlternateGroupPerformanceSpy = spyOn(myPerformanceApiService, 'getAlternateHierarchyGroupPerformance').and.callThrough();

      hierarchyGroups = hierarchyGroups.map((hierarchyGroup: HierarchyGroup) => {
        return Object.assign({}, hierarchyGroup, {
          alternateHierarchyId: chance.string()
        });
      });

      responsibilitiesService.getHierarchyGroupsPerformances(hierarchyGroups, performanceFilterStateMock, positionIdMock, brandCodeMock)
        .subscribe((entityWithPerformance: EntityWithPerformance[]) => {
          expect(entityWithPerformance).toEqual([entityWithPerformanceMock[0], entityWithPerformanceMock[0]]);
          done();
        });

      expect(getAlternateGroupPerformanceSpy.calls.count()).toBe(hierarchyGroups.length);

      hierarchyGroups.forEach((hierarchyGroup: HierarchyGroup, index: number) => {
        expect(getAlternateGroupPerformanceSpy.calls.argsFor(index)).toEqual([
          hierarchyGroup,
          positionIdMock,
          hierarchyGroups[index].alternateHierarchyId,
          performanceFilterStateMock,
          brandCodeMock
        ]);
      });

      expect(getGroupPerformanceSpy).not.toHaveBeenCalled();
    });

    it('calls transformHierarchyGroupPerformance with the right parameters', (done) => {
      const transformerSpy = spyOn(performanceTransformerService, 'transformHierarchyGroupPerformance').and.callThrough();

      responsibilitiesService.getHierarchyGroupsPerformances(hierarchyGroups, performanceFilterStateMock, positionIdMock)
        .subscribe((entityWithPerformance: EntityWithPerformance[]) => {
          done();
        });

      expect(transformerSpy.calls.count()).toBe(hierarchyGroups.length);

      hierarchyGroups.forEach((hierarchyGroup: HierarchyGroup, index: number) => {
        expect(transformerSpy.calls.argsFor(index)).toEqual([
          performanceDTOMock,
          hierarchyGroups[index],
          positionIdMock
        ]);
      });
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

      responsibilitiesService.getPerformance(positionIdMock, performanceFilterStateMock, brandCodeMock).subscribe(() => {
        done();
      });

      expect(getPerformanceSpy.calls.count()).toBe(1);
      expect(getPerformanceSpy.calls.argsFor(0)).toEqual([
        positionIdMock,
        performanceFilterStateMock,
        brandCodeMock
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

  describe('getPositionsPerformances', () => {
    it('should call getPerformance when no alternate hierarchy id is passed in', (done) => {
      const getPerformanceSpy = spyOn(myPerformanceApiService, 'getPerformance').and.callThrough();
      const getAlternateHierarchyPerformanceSpy = spyOn(myPerformanceApiService, 'getAlternateHierarchyPersonPerformance')
        .and.callThrough();
      const transformEntityWithPerformanceSpy = spyOn(performanceTransformerService, 'transformEntityWithPerformance').and.callThrough();

      const myPerformanceFilterState: MyPerformanceFilterState = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      const numberOfEntities: number = chance.natural({min: 1, max: 99});
      const entities: Array<HierarchyEntity> = Array(numberOfEntities).fill('').map(el => getEntityPropertyResponsibilitiesMock());

      responsibilitiesService.getPositionsPerformances(entities, myPerformanceFilterState).subscribe(() => {
        expect(getPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        expect(transformEntityWithPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);

        entities.forEach((entity: HierarchyEntity) => {
          expect(getPerformanceSpy).toHaveBeenCalledWith(entity.positionId, myPerformanceFilterState);
          expect(transformEntityWithPerformanceSpy).toHaveBeenCalledWith(entitiesTotalPerformancesDTOMock, entity);
          expect(getAlternateHierarchyPerformanceSpy).not.toHaveBeenCalled();
        });

        done();
      });
    });

    it('should call getAlternateHierarchyPersonPerformance when an alternate hierarchy id is passed in', (done) => {
      const getPerformanceSpy = spyOn(myPerformanceApiService, 'getPerformance').and.callThrough();
      const getAlternateHierarchyPerformanceSpy = spyOn(myPerformanceApiService, 'getAlternateHierarchyPersonPerformance')
        .and.callThrough();
      const transformEntityWithPerformanceSpy = spyOn(performanceTransformerService, 'transformEntityWithPerformance').and.callThrough();

      const myPerformanceFilterMock: MyPerformanceFilterState = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };
      const numberOfEntities: number = chance.natural({min: 1, max: 99});
      const entities: Array<HierarchyEntity> = Array(numberOfEntities).fill('').map(el => getEntityPropertyResponsibilitiesMock());

      responsibilitiesService.getPositionsPerformances(
        entities,
        myPerformanceFilterMock,
        brandCodeMock,
        skuPackageTypeMock,
        alternateHierarchyIdMock)
        .subscribe(() => {
          expect(getAlternateHierarchyPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
          expect(transformEntityWithPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);

          entities.forEach((entity: HierarchyEntity) => {
            expect(getAlternateHierarchyPerformanceSpy).toHaveBeenCalledWith(entity.positionId,
              alternateHierarchyIdMock, myPerformanceFilterMock, brandCodeMock);
            expect(transformEntityWithPerformanceSpy).toHaveBeenCalledWith(entitiesTotalPerformancesDTOMock, entity);
            expect(getPerformanceSpy).not.toHaveBeenCalled();
          });

          done();
        });
    });

    it('should call show toast and transform null dto when getPerformance returns an error', (done) => {
      const getPerformanceSpy = spyOn(myPerformanceApiService, 'getPerformance').and.callFake(() => {
        return Observable.throw(new Error(chance.string()));
      });
      const transformEntityWithPerformanceSpy = spyOn(performanceTransformerService, 'transformEntityWithPerformance').and.callThrough();
      const mockFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      const numberOfEntities = chance.natural({min: 2, max: 5});
      const entities = Array(numberOfEntities).fill('').map(el => getEntityPropertyResponsibilitiesMock());
      responsibilitiesService.getPositionsPerformances(entities, mockFilter).subscribe(() => {
        expect(getPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        expect(toastServiceMock.showPerformanceDataErrorToast).toHaveBeenCalledTimes(numberOfEntities);
        expect(transformEntityWithPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        entities.map((entity) => {
          expect(getPerformanceSpy).toHaveBeenCalledWith(entity.positionId, mockFilter);
          expect(transformEntityWithPerformanceSpy).toHaveBeenCalledWith(null, entity);
        });
        done();
      });
    });
  });

  describe('getDistributorsPerformances', () => {
    it('should call getDistributorPerformance with the proper id for each distributor', (done) => {
      const getDistributorPerformanceSpy = spyOn(myPerformanceApiService, 'getDistributorPerformance').and.callFake(() => {
        return Observable.of(entitiesTotalPerformancesDTOMock);
      });
      const transformEntityWithPerformanceSpy = spyOn(performanceTransformerService, 'transformEntityWithPerformance').and.callThrough();
      const mockFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      const contextId = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#%^&*()[]'});
      const numberOfEntities = chance.natural({min: 1, max: 99});
      const distributors = Array(numberOfEntities).fill('').map(el => getEntityPropertyResponsibilitiesMock());
      responsibilitiesService.getDistributorsPerformances(distributors, mockFilter, contextId, brandCodeMock).subscribe(() => {
        expect(getDistributorPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        expect(transformEntityWithPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        distributors.map((distributor) => {
          expect(getDistributorPerformanceSpy).toHaveBeenCalledWith(distributor.positionId, mockFilter, contextId, brandCodeMock);
          expect(transformEntityWithPerformanceSpy).toHaveBeenCalledWith(entitiesTotalPerformancesDTOMock, distributor);
        });
        done();
      });
    });

    it('should call show toast and transform null dto when getDistributorPerformance returns an error', (done) => {
      const getDistributorPerformanceSpy = spyOn(myPerformanceApiService, 'getDistributorPerformance').and.callFake(() => {
        return Observable.throw(new Error(chance.string()));
      });
      const transformEntityWithPerformanceSpy = spyOn(performanceTransformerService, 'transformEntityWithPerformance').and.callThrough();
      const mockFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      const contextId = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#%^&*()[]'});
      const numberOfEntities = chance.natural({min: 2, max: 5});
      const distributors = Array(numberOfEntities).fill('').map(el => getEntityPropertyResponsibilitiesMock());
      responsibilitiesService.getDistributorsPerformances(distributors, mockFilter, contextId, brandCodeMock).subscribe(() => {
        expect(getDistributorPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        expect(toastServiceMock.showPerformanceDataErrorToast).toHaveBeenCalledTimes(numberOfEntities);
        expect(transformEntityWithPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        distributors.map((distributor) => {
          expect(getDistributorPerformanceSpy).toHaveBeenCalledWith(distributor.positionId, mockFilter, contextId, brandCodeMock);
          expect(transformEntityWithPerformanceSpy).toHaveBeenCalledWith(null, distributor);
        });
        done();
      });
    });
  });

  describe('getAccountsPerformances', () => {
    it('should call getAccountPerformance total with the proper id for each account', (done) => {
      const getAccountPerformanceSpy = spyOn(myPerformanceApiService, 'getAccountPerformance').and.callFake(() => {
        return Observable.of(entitiesTotalPerformancesDTOMock);
      });
      const transformEntityWithPerformanceSpy = spyOn(performanceTransformerService, 'transformEntityWithPerformance').and.callThrough();
      const mockFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      const contextId = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#%^&*()[]'});
      const numberOfEntities = chance.natural({min: 1, max: 99});
      const accounts = Array(numberOfEntities).fill('').map(el => getEntityPropertyResponsibilitiesMock());
      responsibilitiesService.getAccountsPerformances(accounts, mockFilter, contextId, brandCodeMock).subscribe(() => {
        expect(getAccountPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        expect(transformEntityWithPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        accounts.map((account) => {
          expect(getAccountPerformanceSpy).toHaveBeenCalledWith(account.positionId, mockFilter, contextId, brandCodeMock);
          expect(transformEntityWithPerformanceSpy).toHaveBeenCalledWith(entitiesTotalPerformancesDTOMock, account);
        });
        done();
      });
    });

    it('should call show toast and transform null dto when getAccountPerformance returns an error', (done) => {
      const getAccountPerformanceSpy = spyOn(myPerformanceApiService, 'getAccountPerformance').and.callFake(() => {
        return Observable.throw(new Error(chance.string()));
      });
      const transformEntityWithPerformanceSpy = spyOn(performanceTransformerService, 'transformEntityWithPerformance').and.callThrough();
      const mockFilter = {
        metricType: MetricTypeValue.volume,
        dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
        premiseType: PremiseTypeValue.On
      };

      const contextId = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#%^&*()[]'});
      const numberOfEntities = chance.natural({min: 2, max: 5});
      const accounts = Array(numberOfEntities).fill('').map(el => getEntityPropertyResponsibilitiesMock());
      responsibilitiesService.getAccountsPerformances(accounts, mockFilter, contextId, brandCodeMock).subscribe(() => {
        expect(getAccountPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        expect(toastServiceMock.showPerformanceDataErrorToast).toHaveBeenCalledTimes(numberOfEntities);
        expect(transformEntityWithPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        accounts.map((account) => {
          expect(getAccountPerformanceSpy).toHaveBeenCalledWith(account.positionId, mockFilter, contextId, brandCodeMock);
          expect(transformEntityWithPerformanceSpy).toHaveBeenCalledWith(null, account);
        });
        done();
      });
    });
  });

  describe('getSubAccountsPerformances', () => {
    let subAccountDataMock: SubAccountData;
    let subAccounts: HierarchyEntity[];
    let numberOfEntities: number;
    let entityTypeAccountNameMock: string;

    beforeEach(() => {
      entitySubAccountDTOMock = [getEntitySubAccountDTOMock(), getEntitySubAccountDTOMock()];
      entityTypeAccountNameMock = chance.string();
      numberOfEntities = chance.natural({min: 1, max: 99});
      subAccounts = Array(numberOfEntities).fill('').map(el => getEntityPropertyResponsibilitiesMock());
      groupedSubAccountsMock = {
        [entityTypeAccountNameMock]: subAccounts
      };
      subAccountDataMock = {
        positionId: positionIdMock,
        contextPositionId: contextPositionIdMock,
        entityTypeAccountName: entityTypeAccountNameMock,
        selectedPositionId: getMyPerformanceTableRowMock(1)[0].metadata.positionId,
        filter: performanceFilterStateMock,
        groupedEntities: groupedSubAccountsMock,
        brandSkuCode: brandCodeMock
      };
    });

    it('should call getSubAccountPerformance total with the proper id for each account', (done) => {
      const transformEntityWithPerformanceSpy = spyOn(performanceTransformerService, 'transformEntityWithPerformance').and.callThrough();
      const getSubAccountPerformanceSpy = spyOn(myPerformanceApiService, 'getSubAccountPerformance').and.callFake(() => {
        return Observable.of(entitiesTotalPerformancesDTOMock);
      });

      responsibilitiesService.getSubAccountsPerformances(subAccountDataMock).subscribe(() => {
        expect(getSubAccountPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        expect(transformEntityWithPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        subAccounts.map((subAccount) => {
          expect(getSubAccountPerformanceSpy).toHaveBeenCalledWith(subAccount.positionId,
            contextPositionIdMock, performanceFilterStateMock, brandCodeMock);
          expect(transformEntityWithPerformanceSpy).toHaveBeenCalledWith(entitiesTotalPerformancesDTOMock, subAccount);
        });
        done();
      });
    });

    it('should call show toast and transform null dto when getSubAccountPerformance returns an error', (done) => {
      const getSubAccountPerformanceSpy = spyOn(myPerformanceApiService, 'getSubAccountPerformance').and.callFake(() => {
        return Observable.throw(new Error(chance.string()));
      });
      const transformEntityWithPerformanceSpy = spyOn(performanceTransformerService, 'transformEntityWithPerformance').and.callThrough();

      responsibilitiesService.getSubAccountsPerformances(subAccountDataMock).subscribe(() => {
        expect(getSubAccountPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        expect(toastServiceMock.showPerformanceDataErrorToast).toHaveBeenCalledTimes(numberOfEntities);
        expect(transformEntityWithPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        subAccounts.map((subAccount) => {
          expect(getSubAccountPerformanceSpy).toHaveBeenCalledWith(subAccount.positionId,
            contextPositionIdMock, performanceFilterStateMock, brandCodeMock);
          expect(transformEntityWithPerformanceSpy).toHaveBeenCalledWith(null, subAccount);
        });
        done();
      });
    });
  });

  // copy of getSubAccountsPerformances tests until getSubAccountsPerformances and getSubAccountsRefreshedPerformances are merged together
  describe('getSubAccountsRefreshedPerformances', () => {
    let refreshAllPerformancesDataMock: RefreshAllPerformancesData;
    let subAccounts: HierarchyEntity[];
    let numberOfEntities: number;
    let entityTypeAccountNameMock: string;

    beforeEach(() => {
      entitySubAccountDTOMock = [getEntitySubAccountDTOMock(), getEntitySubAccountDTOMock()];
      entityTypeAccountNameMock = chance.string();
      subAccounts = groupedSubAccountsMock[Object.keys(groupedSubAccountsMock)[0]];
      numberOfEntities = subAccounts.length;
      refreshAllPerformancesDataMock = {
        positionId: positionIdMock,
        filter: performanceFilterStateMock,
        groupedEntities: groupedSubAccountsMock,
        brandSkuCode: brandCodeMock,
        entityType: entityTypeMock
      };
    });

    it('should call getSubAccountsRefreshedPerformances total with the proper id for each account', (done) => {
      const transformEntityWithPerformanceSpy = spyOn(performanceTransformerService, 'transformEntityWithPerformance').and.callThrough();
      const getSubAccountPerformanceSpy = spyOn(myPerformanceApiService, 'getSubAccountPerformance').and.callFake(() => {
        return Observable.of(entitiesTotalPerformancesDTOMock);
      });

      responsibilitiesService.getSubAccountsRefreshedPerformances(refreshAllPerformancesDataMock).subscribe(() => {
        expect(getSubAccountPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        expect(transformEntityWithPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        subAccounts.map((subAccount) => {
          expect(getSubAccountPerformanceSpy).toHaveBeenCalledWith(subAccount.positionId,
            refreshAllPerformancesDataMock.positionId, refreshAllPerformancesDataMock.filter, brandCodeMock);
          expect(transformEntityWithPerformanceSpy).toHaveBeenCalledWith(entitiesTotalPerformancesDTOMock, subAccount);
        });
        done();
      });
    });

    it('should call show toast and transform null dto when getSubAccountPerformance returns an error', (done) => {
      const getSubAccountPerformanceSpy = spyOn(myPerformanceApiService, 'getSubAccountPerformance').and.callFake(() => {
        return Observable.throw(new Error(chance.string()));
      });
      const transformEntityWithPerformanceSpy = spyOn(performanceTransformerService, 'transformEntityWithPerformance').and.callThrough();

      responsibilitiesService.getSubAccountsRefreshedPerformances(refreshAllPerformancesDataMock).subscribe(() => {
        expect(getSubAccountPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        expect(toastServiceMock.showPerformanceDataErrorToast).toHaveBeenCalledTimes(numberOfEntities);
        expect(transformEntityWithPerformanceSpy).toHaveBeenCalledTimes(numberOfEntities);
        subAccounts.map((subAccount) => {
          expect(getSubAccountPerformanceSpy).toHaveBeenCalledWith(subAccount.positionId,
            refreshAllPerformancesDataMock.positionId, refreshAllPerformancesDataMock.filter, brandCodeMock);
          expect(transformEntityWithPerformanceSpy).toHaveBeenCalledWith(null, subAccount);
        });
        done();
      });
    });
  });

  describe('getRefreshedPerformances', () => {
    let refreshAllPerformancesData: RefreshAllPerformancesData;
    let salesHierarchyViewType: SalesHierarchyViewType;
    let getPerformanceForGroupedEntitiesSpy: jasmine.Spy;
    let getSubAccountsRefreshedPerformancesSpy: jasmine.Spy;
    let getEntitiesWithPerformanceForGroupSpy: jasmine.Spy;

    beforeEach(() => {
      getPerformanceForGroupedEntitiesSpy = spyOn(responsibilitiesService, 'getPerformanceForGroupedEntities').and.callFake(
        (pipelineData: ResponsibilitiesData | RefreshAllPerformancesData) => Observable.of(pipelineData));
      getSubAccountsRefreshedPerformancesSpy = spyOn(responsibilitiesService, 'getSubAccountsRefreshedPerformances').and.callFake(
        (pipelineData: ResponsibilitiesData | RefreshAllPerformancesData) => Observable.of(pipelineData));
      getEntitiesWithPerformanceForGroupSpy = spyOn(responsibilitiesService, 'getEntitiesWithPerformanceForGroup').and.callFake(
        (pipelineData: ResponsibilitiesData | RefreshAllPerformancesData) => Observable.of(pipelineData));

      refreshAllPerformancesData = {
        positionId: positionIdMock,
        filter: performanceFilterStateMock,
        brandSkuCode: brandCodeMock,
        groupedEntities: groupedEntitiesMock,
        alternateHierarchyId: alternateHierarchyIdMock,
        hierarchyGroups: hierarchyGroupsMock,
        entityType: entityTypeMock,
        salesHierarchyViewType: salesHierarchyViewType
      };
    });

    describe('when refreshing groupedEntities (salesHierarchyViewType is one of roleGroups, accounts or distributors)', () => {
      beforeEach(() => {
        const salesHierarchyViewTypePossibilities: Array<SalesHierarchyViewType> = [
          SalesHierarchyViewType.roleGroups,
          SalesHierarchyViewType.accounts,
          SalesHierarchyViewType.distributors
        ];
        salesHierarchyViewType = sample(salesHierarchyViewTypePossibilities);
        refreshAllPerformancesData.salesHierarchyViewType = salesHierarchyViewType;
      });

      it('should call getPerformanceForGroupedEntities with all the passed-in data', (done) => {
        responsibilitiesService.getRefreshedPerformances(refreshAllPerformancesData).subscribe(() => {
          expect(getPerformanceForGroupedEntitiesSpy).toHaveBeenCalledWith(refreshAllPerformancesData);
          done();
        });
      });

      it('should NOT call the other functions', (done) => {
        responsibilitiesService.getRefreshedPerformances(refreshAllPerformancesData).subscribe(() => {
          expect(getSubAccountsRefreshedPerformancesSpy).not.toHaveBeenCalled();
          expect(getEntitiesWithPerformanceForGroupSpy).not.toHaveBeenCalled();
          done();
        });
      });
    });

    describe('when refreshing subAccounts', () => {
      beforeEach(() => {
        salesHierarchyViewType = SalesHierarchyViewType.subAccounts;
        refreshAllPerformancesData.salesHierarchyViewType = salesHierarchyViewType;
      });

      it('should call getPerformanceForGroupedEntities with all the passed-in data', (done) => {
        responsibilitiesService.getRefreshedPerformances(refreshAllPerformancesData).subscribe(() => {
          expect(getSubAccountsRefreshedPerformancesSpy).toHaveBeenCalledWith(refreshAllPerformancesData);
          done();
        });
      });

      it('should NOT call the other functions', (done) => {
        responsibilitiesService.getRefreshedPerformances(refreshAllPerformancesData).subscribe(() => {
          expect(getPerformanceForGroupedEntitiesSpy).not.toHaveBeenCalled();
          expect(getEntitiesWithPerformanceForGroupSpy).not.toHaveBeenCalled();
          done();
        });
      });
    });

    describe('when refreshing people', () => {
      beforeEach(() => {
        salesHierarchyViewType = SalesHierarchyViewType.people;
        refreshAllPerformancesData.salesHierarchyViewType = salesHierarchyViewType;
      });

      it('should call getPerformanceForGroupedEntities with all the data + the first of groupedEntities', (done) => {
        responsibilitiesService.getRefreshedPerformances(refreshAllPerformancesData).subscribe(() => {
          expect(getEntitiesWithPerformanceForGroupSpy).toHaveBeenCalledWith({
            positionId: positionIdMock,
            filter: performanceFilterStateMock,
            brandCode: brandCodeMock,
            groupedEntities: groupedEntitiesMock,
            alternateHierarchyId: alternateHierarchyIdMock,
            hierarchyGroups: hierarchyGroupsMock,
            entityType: entityTypeMock,
            salesHierarchyViewType: salesHierarchyViewType,
            entities: groupedEntitiesMock[Object.keys(groupedEntitiesMock)[0]]
          });

          done();
        });
      });

      it('should NOT call the other functions', (done) => {
        responsibilitiesService.getRefreshedPerformances(refreshAllPerformancesData).subscribe(() => {
          expect(getPerformanceForGroupedEntitiesSpy).not.toHaveBeenCalled();
          expect(getSubAccountsRefreshedPerformancesSpy).not.toHaveBeenCalled();

          done();
        });
      });
    });
  });

  describe('getRefreshedTotalPerformance', () => {
    let refreshTotalPerformanceData: RefreshTotalPerformanceData;
    let salesHierarchyViewType: SalesHierarchyViewType;
    let getPerformanceSpy: jasmine.Spy;
    let getAccountPerformanceSpy: jasmine.Spy;
    let transformPerformanceDTOSpy: jasmine.Spy;
    let getHierarchyGroupPerformanceSpy: jasmine.Spy;
    let transformHierarchyGroupPerformanceSpy: jasmine.Spy;

    beforeEach(() => {
      getPerformanceSpy = spyOn(responsibilitiesService, 'getPerformance').and.callFake(
        (positionId: string, filter: MyPerformanceFilterState, brandCode?: string): Observable<Performance> =>
        Observable.of(entitiesTotalPerformancesMock));

      getAccountPerformanceSpy = spyOn(myPerformanceApiService, 'getAccountPerformance').and.callFake((performanceDTO: PerformanceDTO)
        : Observable<PerformanceDTO> => Observable.of(entitiesTotalPerformancesDTOMock));

      transformPerformanceDTOSpy = spyOn(performanceTransformerService, 'transformPerformanceDTO').and.callFake((
        accountId: string,
        filter: MyPerformanceFilterState,
        contextPositionId?: string,
        brandCode?: string
        ): Performance => entitiesTotalPerformancesMock);

      getHierarchyGroupPerformanceSpy = spyOn(myPerformanceApiService, 'getHierarchyGroupPerformance').and.callFake((
        hierarchyGroup: HierarchyGroup,
        filter: MyPerformanceFilterState,
        positionId: string,
        brandCode?: string)
        : Observable<PerformanceDTO> => Observable.of(entitiesTotalPerformancesDTOMock));

      transformHierarchyGroupPerformanceSpy = spyOn(performanceTransformerService, 'transformHierarchyGroupPerformance').and.callFake((
        performanceDTO: PerformanceDTO,
        group: HierarchyGroup,
        positionId: string
      ): EntityWithPerformance => entityWithPerformanceMock[0]);

      refreshTotalPerformanceData = {
        positionId: positionIdMock,
        filter: performanceFilterStateMock,
        brandSkuCode: brandCodeMock,
        groupedEntities: groupedEntitiesMock,
        hierarchyGroups: hierarchyGroupsMock,
        entityType: entityTypeMock,
        salesHierarchyViewType: salesHierarchyViewType
      };
    });

    describe('when refreshing groupedEntities (salesHierarchyViewType is one of roleGroups, accounts or distributors)', () => {
      beforeEach(() => {
        const salesHierarchyViewTypePossibilities: Array<SalesHierarchyViewType> = [
          SalesHierarchyViewType.roleGroups,
          SalesHierarchyViewType.accounts,
          SalesHierarchyViewType.distributors
        ];
        salesHierarchyViewType = sample(salesHierarchyViewTypePossibilities);
        refreshTotalPerformanceData.salesHierarchyViewType = salesHierarchyViewType;
      });

      it('should call getPerformance with the positionId, filter, and brandCode', (done) => {
        responsibilitiesService.getRefreshedTotalPerformance(refreshTotalPerformanceData).subscribe(() => {
          expect(getPerformanceSpy).toHaveBeenCalledWith(
            refreshTotalPerformanceData.positionId,
            refreshTotalPerformanceData.filter,
            refreshTotalPerformanceData.brandSkuCode
          );

          done();
        });
      });

      it('should NOT call the other functions/services', (done) => {
        responsibilitiesService.getRefreshedTotalPerformance(refreshTotalPerformanceData).subscribe(() => {
          expect(getAccountPerformanceSpy).not.toHaveBeenCalled();
          expect(transformPerformanceDTOSpy).not.toHaveBeenCalled();
          expect(getHierarchyGroupPerformanceSpy).not.toHaveBeenCalled();
          expect(transformHierarchyGroupPerformanceSpy).not.toHaveBeenCalled();

          done();
        });
      });

      it('should update entitiesTotalPerformances', (done) => {
        responsibilitiesService.getRefreshedTotalPerformance(refreshTotalPerformanceData).subscribe((
          updatedRefreshTotalPerformanceData: RefreshTotalPerformanceData) => {

          expect(updatedRefreshTotalPerformanceData).toEqual({
            positionId: positionIdMock,
            filter: performanceFilterStateMock,
            brandSkuCode: brandCodeMock,
            groupedEntities: groupedEntitiesMock,
            hierarchyGroups: hierarchyGroupsMock,
            entityType: entityTypeMock,
            salesHierarchyViewType: salesHierarchyViewType,
            entitiesTotalPerformances: entitiesTotalPerformancesMock
          });
          done();
        });
      });
    });

    describe('when refreshing subAccounts', () => {
      beforeEach(() => {
        salesHierarchyViewType = SalesHierarchyViewType.subAccounts;
        refreshTotalPerformanceData.salesHierarchyViewType = salesHierarchyViewType;
      });

      it('should call getAccountPerformances with the accountPositionId, filter, positionId and brandCode', (done) => {
        responsibilitiesService.getRefreshedTotalPerformance(refreshTotalPerformanceData).subscribe(() => {
          expect(getAccountPerformanceSpy).toHaveBeenCalledWith(
            refreshTotalPerformanceData.accountPositionId,
            refreshTotalPerformanceData.filter,
            refreshTotalPerformanceData.positionId,
            refreshTotalPerformanceData.brandSkuCode
          );

          done();
        });
      });

      it('should call transformPerformanceDTO with the result from getAccountPerformances', (done) => {
        responsibilitiesService.getRefreshedTotalPerformance(refreshTotalPerformanceData).subscribe(() => {
          expect(transformPerformanceDTOSpy).toHaveBeenCalledWith(entitiesTotalPerformancesDTOMock);

          done();
        });
      });

      it('should NOT call the other functions/services', (done) => {
        responsibilitiesService.getRefreshedTotalPerformance(refreshTotalPerformanceData).subscribe(() => {
          expect(getPerformanceSpy).not.toHaveBeenCalled();
          expect(getHierarchyGroupPerformanceSpy).not.toHaveBeenCalled();
          expect(transformHierarchyGroupPerformanceSpy).not.toHaveBeenCalled();

          done();
        });
      });

      it('should update entitiesTotalPerformances', (done) => {
        responsibilitiesService.getRefreshedTotalPerformance(refreshTotalPerformanceData).subscribe((
          updatedRefreshTotalPerformanceData: RefreshTotalPerformanceData) => {
          expect(updatedRefreshTotalPerformanceData).toEqual({
            positionId: positionIdMock,
            filter: performanceFilterStateMock,
            brandSkuCode: brandCodeMock,
            groupedEntities: groupedEntitiesMock,
            hierarchyGroups: hierarchyGroupsMock,
            entityType: entityTypeMock,
            salesHierarchyViewType: salesHierarchyViewType,
            entitiesTotalPerformances: entitiesTotalPerformancesMock
          });

          done();
        });
      });
    });

    describe('when refreshing people', () => {
      beforeEach(() => {
        salesHierarchyViewType = SalesHierarchyViewType.people;
        refreshTotalPerformanceData.salesHierarchyViewType = salesHierarchyViewType;
      });

      it('should call getHierarchyGroupPerformance with the hierarchyGroups that has for name the key of the of groupedEntities,'
        + 'the filter, positionId, brandCode', (done) => {
        const randomIndex = chance.natural({min: 0, max: refreshTotalPerformanceData.hierarchyGroups.length - 1});
        refreshTotalPerformanceData.hierarchyGroups[randomIndex].name = Object.keys(refreshTotalPerformanceData.groupedEntities)[0];

        responsibilitiesService.getRefreshedTotalPerformance(refreshTotalPerformanceData).subscribe(() => {
          expect(getHierarchyGroupPerformanceSpy).toHaveBeenCalledWith(
            refreshTotalPerformanceData.hierarchyGroups[randomIndex],
            refreshTotalPerformanceData.filter,
            refreshTotalPerformanceData.positionId,
            refreshTotalPerformanceData.brandSkuCode
          );

          done();
        });
      });

      it('should call transformHierarchyGroupPerformance with the result from getRefreshedTotalPerformance', (done) => {
        const randomIndex = chance.natural({min: 0, max: refreshTotalPerformanceData.hierarchyGroups.length - 1});
        refreshTotalPerformanceData.hierarchyGroups[randomIndex].name = Object.keys(refreshTotalPerformanceData.groupedEntities)[0];

        responsibilitiesService.getRefreshedTotalPerformance(refreshTotalPerformanceData).subscribe(() => {
          expect(transformHierarchyGroupPerformanceSpy).toHaveBeenCalledWith(
            entitiesTotalPerformancesDTOMock,
            refreshTotalPerformanceData.hierarchyGroups[randomIndex],
            refreshTotalPerformanceData.positionId
          );

          done();
        });
      });

      it('should NOT call the other functions/services', (done) => {
        responsibilitiesService.getRefreshedTotalPerformance(refreshTotalPerformanceData).subscribe(() => {
          expect(getPerformanceSpy).not.toHaveBeenCalled();
          expect(getAccountPerformanceSpy).not.toHaveBeenCalled();
          expect(transformPerformanceDTOSpy).not.toHaveBeenCalled();

          done();
        });
      });

      it('should update entitiesTotalPerformances', (done) => {
        responsibilitiesService.getRefreshedTotalPerformance(refreshTotalPerformanceData).subscribe((
          updatedRefreshTotalPerformanceData: RefreshTotalPerformanceData) => {
          expect(updatedRefreshTotalPerformanceData).toEqual({
            positionId: positionIdMock,
            filter: performanceFilterStateMock,
            brandSkuCode: brandCodeMock,
            groupedEntities: groupedEntitiesMock,
            hierarchyGroups: hierarchyGroupsMock,
            entityType: entityTypeMock,
            salesHierarchyViewType: salesHierarchyViewType,
            entitiesTotalPerformances: entityWithPerformanceMock[0].performance
          });

          done();
        });
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
        entityTypeAccountName: chance.string(),
        selectedPositionId: getMyPerformanceTableRowMock(1)[0].metadata.positionId,
        filter: performanceFilterStateMock
      };
      groupedSubAccountsMock = {
        [subAccountDataMock.entityTypeAccountName]: [{
          positionId: entitySubAccountDTOMock[0].id,
          name: entitySubAccountDTOMock[0].name,
          entityType: EntityType.SubAccount
        }, {
          positionId: entitySubAccountDTOMock[1].id,
          name: entitySubAccountDTOMock[1].name,
          entityType: EntityType.SubAccount
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
        subAccountDataMock.filter.premiseType
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

  describe('when getAlternateHierarchy is called', () => {
    let responsibilitiesDataMock: ResponsibilitiesData;

    beforeEach(() => {
      responsibilitiesDataMock = {
        positionId: positionIdMock,
        groupedEntities: groupedEntitiesMock,
        hierarchyGroups: [{
          type: groupedEntitiesMock['GENERAL MANAGER'][0].type,
          name: 'GENERAL MANAGER',
          positionDescription: groupedEntitiesMock['GENERAL MANAGER'][0].positionDescription,
          entityType: EntityType.RoleGroup
        }, {
          type: groupedEntitiesMock['MARKET DEVELOPMENT MANAGER'][0].type,
          name: 'MARKET DEVELOPMENT MANAGER',
          positionDescription: groupedEntitiesMock['MARKET DEVELOPMENT MANAGER'][0].positionDescription,
          entityType: EntityType.RoleGroup
        }],
        salesHierarchyViewType: SalesHierarchyViewType.roleGroups
      };
    });

    it('should call the myPerformanceApiService.getAlternateHierarchy with the provided positionId', (done) => {
      const getAlternateHierarchySpy = spyOn(myPerformanceApiService, 'getAlternateHierarchy').and.callThrough();

      responsibilitiesService.getAlternateHierarchy(responsibilitiesDataMock).subscribe(() => {
        expect(getAlternateHierarchySpy).toHaveBeenCalledWith(responsibilitiesDataMock.positionId, responsibilitiesDataMock.positionId);
        done();
      });
    });

    describe('when myPerformanceApiService.getAlternateHierarchy returns positions', () => {
      beforeEach(() => {
        peopleResponsibilitiesDTOMock.entityURIs = undefined;
      });

      it('should reach out to the responsibilitiesTransformerService and call transformHierarchyEntityDTOCollection' +
      'to transform DTO entities into HierarchyEntities', (done) => {
        const transformHierarchyEntityDTOCollectionSpy
          = spyOn(responsibilitiesTransformerService, 'transformHierarchyEntityDTOCollection').and.callThrough();

        responsibilitiesService.getAlternateHierarchy(responsibilitiesDataMock).subscribe(() => {
          expect(transformHierarchyEntityDTOCollectionSpy).toHaveBeenCalledWith(peopleResponsibilitiesDTOMock.positions);
          done();
        });
      });

      it('should group transformed people positions under a GEOGRAPHY group and append the group to existing ' +
      'entity types and grouped entities', (done) => {
        spyOn(responsibilitiesTransformerService, 'transformHierarchyEntityDTOCollection').and.returnValue(peopleResponsibilitiesMock);

        const expectedGroupedEntities: GroupedEntities = Object.assign({}, groupedEntitiesMock, {
          [EntityPeopleType.GEOGRAPHY]: peopleResponsibilitiesMock
        });
        const expectedGeographyGroup: HierarchyGroup = {
          name: EntityPeopleType.GEOGRAPHY,
          type: peopleResponsibilitiesDTOMock.positions[0].type,
          entityType: EntityType.RoleGroup,
          alternateHierarchyId: positionIdMock
        };
        const expectedHierarchyGroups: Array<HierarchyGroup> = responsibilitiesDataMock.hierarchyGroups.concat([expectedGeographyGroup]);
        const expectedResponsibilitiesData: ResponsibilitiesData = Object.assign({}, responsibilitiesDataMock, {
          groupedEntities: expectedGroupedEntities,
          hierarchyGroups: expectedHierarchyGroups
        });

        responsibilitiesService.getAlternateHierarchy(responsibilitiesDataMock).subscribe((responsibilitiesData: ResponsibilitiesData) => {
          expect(responsibilitiesData).toEqual(expectedResponsibilitiesData);
          done();
        });
      });
    });

    describe('when myPerformanceApiService.getAlternateHierarchy returns an entityURIs', () => {
      beforeEach(() => {
        delete peopleResponsibilitiesDTOMock.positions;
      });

      it('should return responsibilitiesData with the entityURIs response saved under alternateEntitiesURL', (done) => {
        const expectedResponsibilitiesData = Object.assign({}, responsibilitiesDataMock, {
          alternateEntitiesURL: peopleResponsibilitiesDTOMock.entityURIs[0]
        });

        responsibilitiesService.getAlternateHierarchy(responsibilitiesDataMock).subscribe((actualResponsibilitiesData) => {
          expect(actualResponsibilitiesData).toEqual(expectedResponsibilitiesData);
          done();
        });
      });
    });

    describe('when myPerformanceApiService.getAlternateHierarchy returns an empty object', () => {
      it('should return the passed in responsibilitiesData without making any changes', (done) => {
        spyOn(myPerformanceApiService, 'getAlternateHierarchy').and.returnValue(Observable.of({}));

        responsibilitiesService.getAlternateHierarchy(responsibilitiesDataMock).subscribe((actualResponsibilitiesData) => {
          expect(actualResponsibilitiesData).toEqual(responsibilitiesDataMock);
          done();
        });
      });
    });
  });

  describe('when getAlternateAccountsDistributors is called', () => {
    let responsibilitiesDataMock: ResponsibilitiesData;

    beforeEach(() => {
      responsibilitiesDataMock = {
        positionId: positionIdMock,
        groupedEntities: groupedEntitiesMock,
        hierarchyGroups: [{
          type: groupedEntitiesMock['GENERAL MANAGER'][0].type,
          name: 'GENERAL MANAGER',
          positionDescription: groupedEntitiesMock['GENERAL MANAGER'][0].positionDescription,
          entityType: EntityType.RoleGroup
        }, {
          type: groupedEntitiesMock['MARKET DEVELOPMENT MANAGER'][0].type,
          name: 'MARKET DEVELOPMENT MANAGER',
          positionDescription: groupedEntitiesMock['MARKET DEVELOPMENT MANAGER'][0].positionDescription,
          entityType: EntityType.RoleGroup
        }],
        salesHierarchyViewType: SalesHierarchyViewType.roleGroups,
        alternateEntitiesURL: chance.string()
      };
    });

    describe('when no alternateEntitiesURL was received', () => {
      beforeEach(() => {
        delete responsibilitiesDataMock.alternateEntitiesURL;
      });

      it('should return the passed in responsibilitiesData without making any changes', (done) => {
        responsibilitiesService.getAlternateAccountsDistributors(responsibilitiesDataMock).subscribe((actualResponsibilitiesData) => {
          expect(actualResponsibilitiesData).toEqual(responsibilitiesDataMock);
          done();
        });
      });
    });

    describe('when an alternateEntitiesURL is present', () => {
      it('should reach out to myPerformanceApiService.getAccountsDistributors to get accounts or distributors', (done) => {
        const getAccountsDistributorsSpy = spyOn(myPerformanceApiService, 'getAccountsDistributors').and.callThrough();

        responsibilitiesService.getAlternateAccountsDistributors(responsibilitiesDataMock).subscribe((actualResponsibilitiesData) => {
          expect(getAccountsDistributorsSpy).toHaveBeenCalledWith(responsibilitiesDataMock.alternateEntitiesURL);
          done();
        });
      });

      it('should group received accounts or distributors under a GEOGRAPHY group by reaching out to' +
      'responsibilitiesTransformerService.groupsAccountsDistributors', (done) => {
        const groupsAccountsDistributorsSpy = spyOn(responsibilitiesTransformerService, 'groupsAccountsDistributors').and.callThrough();

        responsibilitiesService.getAlternateAccountsDistributors(responsibilitiesDataMock).subscribe(() => {
          expect(groupsAccountsDistributorsSpy).toHaveBeenCalledWith(accountsDistributorsDTOMock, EntityPeopleType.GEOGRAPHY);
          done();
        });
      });

      it('should append new accounts/distributors geography group to existing entity types and grouped entities', (done) => {
        spyOn(responsibilitiesTransformerService, 'groupsAccountsDistributors').and.returnValue({
          [EntityPeopleType.GEOGRAPHY]: [{
            name: accountsDistributorsDTOMock[0].name,
            positionId: accountsDistributorsDTOMock[0].id,
            propertyType: accountsDistributorsDTOMock[0].type,
            entityType: EntityType.Distributor,
            alternateHierarchyId: positionIdMock
          }]
        });

        const expectedGroupedEntities: GroupedEntities = Object.assign({}, responsibilitiesDataMock.groupedEntities, {
          [EntityPeopleType.GEOGRAPHY]: [{
            name: accountsDistributorsDTOMock[0].name,
            positionId: accountsDistributorsDTOMock[0].id,
            propertyType: accountsDistributorsDTOMock[0].type,
            entityType: EntityType.Distributor,
            alternateHierarchyId: positionIdMock
          }]
        });
        const expectedGeographyGroup: HierarchyGroup = {
          name: EntityPeopleType.GEOGRAPHY,
          type: HierarchyGroupTypeCode.distributors,
          entityType: EntityType.DistributorGroup,
          alternateHierarchyId: positionIdMock
        };
        const expectedHierarchyGroups: Array<HierarchyGroup> = responsibilitiesDataMock.hierarchyGroups.concat([expectedGeographyGroup]);
        const expectedResponsibilities = Object.assign({}, responsibilitiesDataMock, {
          groupedEntities: expectedGroupedEntities,
          hierarchyGroups: expectedHierarchyGroups
        });

        responsibilitiesService.getAlternateAccountsDistributors(responsibilitiesDataMock)
        .subscribe((responsibilitiesData: ResponsibilitiesData) => {
          expect(responsibilitiesData).toEqual(expectedResponsibilities);
          done();
        });
      });
    });
  });

  describe('when getEntitiesWithPerformanceForGroup is called', () => {
    let fetchEntityWithPerformanceDataMock: FetchEntityWithPerformanceData;

    beforeEach(() => {
      fetchEntityWithPerformanceDataMock = {
        entityTypeGroupName: EntityPeopleType.GEOGRAPHY,
        entityTypeCode: chance.string(),
        entities: peopleResponsibilitiesMock,
        filter: performanceFilterStateMock,
        positionId: chance.string(),
        entityType: EntityType.RoleGroup,
        selectedEntityDescription: chance.string(),
        brandSkuCode: chance.string()
      };
    });

    describe('when the passed in entity has a type of RoleGroup', () => {
      it('should call getPositionsPerformances with the correct parameters when NO alternateHierarchyId is passed in', (done) => {
        const getPositionsPerformancesSpy = spyOn(responsibilitiesService, 'getPositionsPerformances').and.callThrough();

        responsibilitiesService.getEntitiesWithPerformanceForGroup(fetchEntityWithPerformanceDataMock).subscribe(() => {
          expect(getPositionsPerformancesSpy)
            .toHaveBeenCalledWith(
              fetchEntityWithPerformanceDataMock.entities,
              fetchEntityWithPerformanceDataMock.filter,
              fetchEntityWithPerformanceDataMock.brandSkuCode,
              null
            );
          done();
        });
      });

      it('should call getPositionsPerformances with the correct parameters when an alternateHierarchyId is passed in', (done) => {
        const getPositionsPerformancesSpy = spyOn(responsibilitiesService, 'getPositionsPerformances').and.callThrough();

        fetchEntityWithPerformanceDataMock.alternateHierarchyId = chance.string();

        responsibilitiesService.getEntitiesWithPerformanceForGroup(fetchEntityWithPerformanceDataMock).subscribe(() => {
          expect(getPositionsPerformancesSpy)
            .toHaveBeenCalledWith(fetchEntityWithPerformanceDataMock.entities,
              fetchEntityWithPerformanceDataMock.filter,
              fetchEntityWithPerformanceDataMock.brandSkuCode,
              fetchEntityWithPerformanceDataMock.alternateHierarchyId);
          done();
        });
      });
    });

    describe('when the passed in entity has a type of DistributorGroup', () => {
      beforeEach(() => {
        fetchEntityWithPerformanceDataMock.entityType = EntityType.DistributorGroup;
      });

      it('should call getDistributorsPerformances with the correct parameters when NO alternateHierarchyId is passed in', (done) => {
        const getDistributorsPerformancesSpy = spyOn(responsibilitiesService, 'getDistributorsPerformances').and.callThrough();

        responsibilitiesService.getEntitiesWithPerformanceForGroup(fetchEntityWithPerformanceDataMock).subscribe(() => {
          expect(getDistributorsPerformancesSpy).toHaveBeenCalledWith(
            fetchEntityWithPerformanceDataMock.entities,
            fetchEntityWithPerformanceDataMock.filter,
            fetchEntityWithPerformanceDataMock.positionId,
            fetchEntityWithPerformanceDataMock.brandSkuCode);
          done();
        });
      });

      it('should call getDistributorsPerformances with the correct parameters when an alternateHierarchyId is passed in', (done) => {
        const getDistributorsPerformancesSpy = spyOn(responsibilitiesService, 'getDistributorsPerformances').and.callThrough();

        fetchEntityWithPerformanceDataMock.alternateHierarchyId = chance.string();

        responsibilitiesService.getEntitiesWithPerformanceForGroup(fetchEntityWithPerformanceDataMock).subscribe(() => {
          expect(getDistributorsPerformancesSpy).toHaveBeenCalledWith(
            fetchEntityWithPerformanceDataMock.entities,
            fetchEntityWithPerformanceDataMock.filter,
            '0',
            fetchEntityWithPerformanceDataMock.brandSkuCode);
          done();
        });
      });
    });

    describe('when the passed in entity has a type of AccountGroup', () => {
      beforeEach(() => {
        fetchEntityWithPerformanceDataMock.entityType = EntityType.AccountGroup;
      });

      it('should call getAccountsPerformances with the correct parameters', (done) => {
        const getAccountsPerformancesSpy = spyOn(responsibilitiesService, 'getAccountsPerformances').and.callThrough();

        responsibilitiesService.getEntitiesWithPerformanceForGroup(fetchEntityWithPerformanceDataMock).subscribe(() => {
          expect(getAccountsPerformancesSpy).toHaveBeenCalledWith(
            fetchEntityWithPerformanceDataMock.entities,
            fetchEntityWithPerformanceDataMock.filter,
            fetchEntityWithPerformanceDataMock.positionId,
            fetchEntityWithPerformanceDataMock.brandSkuCode);
          done();
        });
      });
    });
  });

  describe('when getEntityGroupViewType is called', () => {
    it('should return the correct SalesHierarchyViewType when given a type of ResponsibilitiesGroup', () => {
      const expectedViewType = SalesHierarchyViewType.roleGroups;
      const actualViewType = responsibilitiesService.getEntityGroupViewType(EntityType.ResponsibilitiesGroup);
      expect(actualViewType).toBe(expectedViewType);
    });

    it('should return the correct SalesHierarchyViewType when given a type of RoleGroup', () => {
      const expectedViewType = SalesHierarchyViewType.people;
      const actualViewType = responsibilitiesService.getEntityGroupViewType(EntityType.RoleGroup);
      expect(actualViewType).toBe(expectedViewType);
    });

    it('should return the correct SalesHierarchyViewType when given a type of DistributorGroup', () => {
      const expectedViewType = SalesHierarchyViewType.distributors;
      const actualViewType = responsibilitiesService.getEntityGroupViewType(EntityType.DistributorGroup);
      expect(actualViewType).toBe(expectedViewType);
    });

    it('should return the correct SalesHierarchyViewType when given a type of AccountGroup', () => {
      const expectedViewType = SalesHierarchyViewType.accounts;
      const actualViewType = responsibilitiesService.getEntityGroupViewType(EntityType.AccountGroup);
      expect(actualViewType).toBe(expectedViewType);
    });
  });

  describe('when checkEmptyResponsibilitiesResponse is called', () => {
    let responsibilitiesDataMock: ResponsibilitiesData;
    let checkEmptyResponsibilitiesResponseSpy: jasmine.Spy;

        beforeEach(() => {
          checkEmptyResponsibilitiesResponseSpy = spyOn(responsibilitiesService, 'checkEmptyResponsibilitiesResponse').and.callThrough();
          responsibilitiesDataMock = {
            positionId: positionIdMock,
            hierarchyGroups: [{
              type: chance.string(),
              name: chance.string(),
              positionDescription: chance.string(),
              entityType: EntityType.RoleGroup
            }],
            groupedEntities: accountsDistributorsMock,
            filter: performanceFilterStateMock};
        });

    it('should return an observable of responsibilities if is non-empty', (done) => {
      responsibilitiesService.checkEmptyResponsibilitiesResponse(responsibilitiesDataMock)
        .subscribe((responsibilitiesData: ResponsibilitiesData) => {
        expect(responsibilitiesData).toEqual(responsibilitiesDataMock);
        done();
      });
    });
  });

  describe('when checkEmptySubaccountsResponse is called', () => {
    let subAccountDataMock: SubAccountData;
    let checkEmptySubaccountsResponseMock: jasmine.Spy;

    beforeEach(() => {
      checkEmptySubaccountsResponseMock = spyOn(responsibilitiesService, 'checkEmptySubaccountsResponse').and.callThrough();
      subAccountDataMock = {
        positionId: positionIdMock,
        contextPositionId: contextPositionIdMock,
        entityTypeAccountName: chance.string(),
        selectedPositionId: getMyPerformanceTableRowMock(1)[0].metadata.positionId,
        filter: performanceFilterStateMock,
        groupedEntities: groupedSubAccountsMock
      };
    });

    it('should return an observable of subaccounts if is non-empty', (done) => {
      responsibilitiesService.checkEmptySubaccountsResponse(subAccountDataMock)
        .subscribe((subAccountData: SubAccountData) => {
        expect(subAccountData).toEqual(subAccountDataMock);
        done();
      });
    });
  });
});
