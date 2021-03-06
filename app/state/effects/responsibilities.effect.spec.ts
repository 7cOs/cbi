import { Action } from '@ngrx/store';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { EntityPeopleType, EntityType } from '../../enums/entity-responsibilities.enum';
import { EntityWithPerformance } from '../../models/entity-with-performance.model';
import { FetchAlternateHierarchyResponsibilities,
         FetchResponsibilities,
         FetchResponsibilitiesFailure,
         FetchResponsibilitiesSuccess,
         FetchEntityWithPerformance,
         FetchEntityWithPerformanceSuccess,
         FetchEntityWithPerformancePayload,
         FetchTotalPerformance,
         FetchTotalPerformanceSuccess,
         FetchTotalPerformanceFailure,
         FetchSubAccounts,
         FetchSubAccountsSuccess,
         FetchSubAccountsPayload,
         GetPeopleByRoleGroup,
         SetAccountPositionId,
         SetTotalPerformance,
         SetTotalPerformanceForSelectedRoleGroup,
         RefreshAllPerformancesPayload,
         RefreshAllPerformances } from '../actions/responsibilities.action';
import { FetchEntityWithPerformanceData,
         RefreshAllPerformancesData,
         RefreshTotalPerformanceData,
         ResponsibilitiesData,
         SubAccountData } from '../../services/responsibilities.service';
import { getEntitiesWithPerformancesMock } from '../../models/entity-with-performance.model.mock';
import { getEntityPeopleResponsibilitiesMock } from '../../models/hierarchy-entity.model.mock';
import { getEntityTypeMock } from '../../enums/entity-responsibilities.enum.mock';
import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
import { getHierarchyGroupMock } from '../../models/hierarchy-group.model.mock';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getPerformanceMock } from '../../models/performance.model.mock';
import { getSalesHierarchyViewTypeMock } from '../../enums/sales-hierarchy-view-type.enum.mock';
import { getSkuPackageTypeMock } from '../../enums/sku-package-type.enum.mock';
import { GroupedEntities } from '../../models/grouped-entities.model';
import { HierarchyGroup } from '../../models/hierarchy-group.model';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { Performance } from '../../models/performance.model';
import * as ResponsibilitiesActions from '../actions/responsibilities.action';
import { ResponsibilitiesEffects } from './responsibilities.effect';
import { ResponsibilitiesService } from '../../services/responsibilities.service';
import { SetSalesHierarchyViewType } from '../actions/sales-hierarchy-view-type.action';
import { SalesHierarchyViewType } from '../../enums/sales-hierarchy-view-type.enum';
import { SkuPackageType } from '../../enums/sku-package-type.enum';

const chance = new Chance();

describe('Responsibilities Effects', () => {
  const entityWithPerformanceMock = getEntitiesWithPerformancesMock();
  const error = new Error(chance.string());
  const groupedEntitiesMock: GroupedEntities = getGroupedEntitiesMock();
  const hierarchyGroupsMock: Array<HierarchyGroup> = Array(chance.natural({min: 1, max: 9})).fill('').map(() => getHierarchyGroupMock());
  const performanceMock: Performance = getPerformanceMock();
  const positionIdMock = chance.string();
  const alternateHierarchyIdMock = chance.string();
  const entityTypeCodeMock = chance.string();
  const selectedEntityDescriptionMock = chance.string();
  const brandCodeMock = chance.string();
  const skuPackageTypeMock = SkuPackageType[getSkuPackageTypeMock()];

  const responsibilitiesServiceMock = {
    getResponsibilities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getPerformanceForGroupedEntities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getEntityURIResponsibilities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getPositionsPerformances(args: any): Observable<(EntityWithPerformance | Error)[]> {
      return Observable.of(entityWithPerformanceMock);
    },
    getPerformance(args: any): Observable<Performance> {
      return Observable.of(performanceMock);
    },
    getSubAccounts(subAccountData: SubAccountData): Observable<SubAccountData> {
      return Observable.of(subAccountData);
    },
    getSubAccountsPerformances(subAccountData: SubAccountData): Observable<SubAccountData> {
      return Observable.of(subAccountData);
    },
    getRefreshedPerformances(refreshAllPerformancesData: RefreshAllPerformancesData)
      : Observable<ResponsibilitiesData | RefreshAllPerformancesData> {
      return Observable.of(refreshAllPerformancesData);
    },
    getRefreshedTotalPerformance(refreshTotalPerformanceData: RefreshTotalPerformanceData)
      : Observable<RefreshTotalPerformanceData> {
      return Observable.of(refreshTotalPerformanceData);
    },
    getAlternateHierarchy(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getAlternateEntityURIResponsibilities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getEntityGroupViewType(entityType: EntityType): SalesHierarchyViewType {
      return SalesHierarchyViewType.roleGroups;
    },
    getEntitiesWithPerformanceForGroup(fetchEntityWithPerformanceData: FetchEntityWithPerformanceData)
      : Observable<FetchEntityWithPerformanceData> {
      return Observable.of(fetchEntityWithPerformanceData);
    },
    groupPeopleResponsibilities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getAlternateHierarchyResponsibilities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    checkEmptyResponsibilitiesResponse(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    checkEmptySubaccountsResponse(subAccountsData: SubAccountData): Observable<SubAccountData> {
      return Observable.of(subAccountsData);
    }
  };

  const performanceFilterStateMock: MyPerformanceFilterState = getMyPerformanceFilterMock();

  const responsibilitiesSuccessPayloadMock = {
    positionId: positionIdMock,
    groupedEntities: groupedEntitiesMock,
    hierarchyGroups: hierarchyGroupsMock,
    entityWithPerformance: entityWithPerformanceMock
  };

  const responsibilitiesDataMock: ResponsibilitiesData = {
    filter: performanceFilterStateMock,
    positionId: positionIdMock,
    selectedEntityDescription: selectedEntityDescriptionMock
  };

  let actions$: Subject<ResponsibilitiesActions.Action>;
  let responsibilitiesEffects: ResponsibilitiesEffects;
  let responsibilitiesService: ResponsibilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResponsibilitiesEffects,
        provideMockActions(() => actions$),
        {
          provide: ResponsibilitiesService,
          useValue: responsibilitiesServiceMock
        }
      ]
    });

    actions$ = new ReplaySubject(1);
  });

  beforeEach(inject([ ResponsibilitiesEffects, ResponsibilitiesService ],
    (_responsibilitiesEffects: ResponsibilitiesEffects, _responsibilitiesService: ResponsibilitiesService) => {
      responsibilitiesEffects = _responsibilitiesEffects;
      responsibilitiesService = _responsibilitiesService;
    }
  ));

  describe('when a FetchResponsibilities is received', () => {
    beforeEach(() => {
      actions$.next(new FetchResponsibilities({
        positionId: positionIdMock,
        filter: performanceFilterStateMock,
        selectedEntityDescription: selectedEntityDescriptionMock
      }));
    });

    describe('when everything returns successfully', () => {
      it('should return a SetSalesHierarchyViewType and FetchResponsibilitiesSuccess', (done) => {
        const salesHierarchyViewTypeMock = SalesHierarchyViewType[getSalesHierarchyViewTypeMock()];

        spyOn(responsibilitiesService, 'getResponsibilities').and.callFake((responsibilitiesData: ResponsibilitiesData) => {
          responsibilitiesData.groupedEntities = groupedEntitiesMock;
          responsibilitiesData.salesHierarchyViewType = salesHierarchyViewTypeMock;
          return Observable.of(responsibilitiesData);
        });

        spyOn(responsibilitiesService, 'getPerformanceForGroupedEntities').and.callFake(
          (responsibilitiesData: ResponsibilitiesData) => {
          responsibilitiesData.entityWithPerformance = entityWithPerformanceMock;
          responsibilitiesData.hierarchyGroups = hierarchyGroupsMock;
          return Observable.of(responsibilitiesData);
        });

        responsibilitiesEffects.fetchResponsibilities$().pairwise().subscribe(([result1, result2]) => {
          expect(result1).toEqual(new SetSalesHierarchyViewType(salesHierarchyViewTypeMock));
          expect(result2).toEqual(new FetchResponsibilitiesSuccess(responsibilitiesSuccessPayloadMock));
          done();
        });
      });

      it('should call getResponsibilities with the right arguments', (done) => {
        const getResponsibilitiesSpy = spyOn(responsibilitiesService, 'getResponsibilities').and.callThrough();

        responsibilitiesEffects.fetchResponsibilities$().subscribe(() => {
          done();
        });

        expect(getResponsibilitiesSpy.calls.count()).toBe(1);
        expect(getResponsibilitiesSpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock);
      });

      it('should call getEntityURIResponsibilities with the right arguments', (done) => {
        const getEntityURIResponsibilitiesSpy = spyOn(responsibilitiesService, 'getEntityURIResponsibilities').and.callThrough();

        responsibilitiesEffects.fetchResponsibilities$().subscribe(() => {
          done();
        });

        expect(getEntityURIResponsibilitiesSpy.calls.count()).toBe(1);
        expect(getEntityURIResponsibilitiesSpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock);
      });

      it('should call getAlternateHierarchy with the right arguments', (done) => {
        const getAlternateHierarchySpy = spyOn(responsibilitiesService, 'getAlternateHierarchy').and.callThrough();

        responsibilitiesEffects.fetchResponsibilities$().subscribe(() => {
          done();
        });

        expect(getAlternateHierarchySpy.calls.count()).toBe(1);
        expect(getAlternateHierarchySpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock);
      });

      it('should call getAlternateEntityURIResponsibilities with the right arguments', (done) => {
        const getAlternateEntityURIResponsibilitiesSpy = spyOn(
          responsibilitiesService,
          'getAlternateEntityURIResponsibilities'
        )
        .and.callThrough();

        responsibilitiesEffects.fetchResponsibilities$().subscribe(() => {
          done();
        });

        expect(getAlternateEntityURIResponsibilitiesSpy.calls.count()).toBe(1);
        expect(getAlternateEntityURIResponsibilitiesSpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock);
      });

      it('should call getPerformanceForGroupedEntities with the right arguments', (done) => {
        const getPerformanceSpy = spyOn(responsibilitiesService, 'getPerformanceForGroupedEntities').and.callThrough();

        responsibilitiesEffects.fetchResponsibilities$().subscribe(() => {
          done();
        });

        expect(getPerformanceSpy.calls.count()).toBe(1);
        expect(getPerformanceSpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock);
      });

      it('should call checkEmptyResponsibilitiesResponse with the right arguments', (done) => {
        const checkEmptyResponsibilitiesSpy = spyOn(responsibilitiesService, 'checkEmptyResponsibilitiesResponse').and.callThrough();

        responsibilitiesEffects.fetchResponsibilities$().subscribe(() => {
          done();
        });

        expect(checkEmptyResponsibilitiesSpy.calls.count()).toBe(1);
        expect(checkEmptyResponsibilitiesSpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock);
      });
    });

    describe('when getResponsibilities returns an error', () => {
      it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getResponsibilities').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.fetchResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailure(error));
          done();
        });
      });
    });

    describe('when getEntityURIResponsibilities returns an error', () => {
      it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getEntityURIResponsibilities').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.fetchResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailure(error));
          done();
        });
      });
    });

    describe('when getAlternateHierarchy returns an error', () => {
      it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getAlternateHierarchy').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.fetchResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailure(error));
          done();
        });
      });
    });

    describe('when getAlternateEntityURIResponsibilities returns an error', () => {
      it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getAlternateEntityURIResponsibilities').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.fetchResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailure(error));
          done();
        });
      });
    });

    describe('when getPerformanceForGroupedEntities returns an error', () => {
      it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getPerformanceForGroupedEntities').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.fetchResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailure(error));
          done();
        });
      });
    });

    describe('when a FetchResponsibilitiesFailure is received', () => {

      beforeEach(() => {
        actions$.next(new FetchResponsibilitiesFailure(error));
        spyOn(console, 'error');
      });

      it('should log the error payload', (done) => {
        responsibilitiesEffects.fetchResponsibilitiesFailure$().subscribe(() => {
          expect(console.error).toHaveBeenCalled();
          done();
        });
      });
    });
  });

  describe('when a FetchEntityWithPerformance is received', () => {
    const fetchEntityPerformancePayloadMock: FetchEntityWithPerformancePayload = {
      positionId: getMyPerformanceTableRowMock(1)[0].metadata.positionId,
      entityTypeGroupName: EntityPeopleType['GENERAL MANAGER'],
      entityTypeCode: entityTypeCodeMock,
      entityType: EntityType.RoleGroup,
      entities: [getEntityPeopleResponsibilitiesMock()],
      filter: performanceFilterStateMock,
      selectedEntityDescription: chance.string()
    };

    beforeEach(() => {
      actions$.next(new FetchEntityWithPerformance(fetchEntityPerformancePayloadMock));
    });

    it('should call getEntitiesWithPerformanceForGroup with the right arguments', (done) => {
      const getResponsibilitiesSpy = spyOn(responsibilitiesService, 'getEntitiesWithPerformanceForGroup').and.callThrough();

      responsibilitiesEffects.FetchEntityWithPerformance$().subscribe(() => {
        done();
      });

      expect(getResponsibilitiesSpy.calls.count()).toBe(1);
      expect(getResponsibilitiesSpy.calls.argsFor(0)).toEqual([fetchEntityPerformancePayloadMock]);
    });

    describe('when getEntitiesWithPerformanceForGroup returns successfully', () => {
      it('should dispatch appropriate actions', (done) => {
        spyOn(responsibilitiesService, 'getEntitiesWithPerformanceForGroup').and.callFake(
          (fetchEntityWithPerformanceData: FetchEntityWithPerformanceData) => {
            return Observable.of(Object.assign({}, fetchEntityWithPerformanceData, {
              entityWithPerformance: entityWithPerformanceMock
            }));
        });

        const dispatchedActions: Action[] = [];

        responsibilitiesEffects.FetchEntityWithPerformance$().subscribe((dispatchedAction: Action) => {
          dispatchedActions.push(dispatchedAction);

          if (dispatchedActions.length === 4) {
            expect(dispatchedActions).toEqual([
              new SetTotalPerformanceForSelectedRoleGroup(fetchEntityPerformancePayloadMock.entityTypeCode),
              new GetPeopleByRoleGroup(fetchEntityPerformancePayloadMock.entityTypeGroupName),
              new FetchEntityWithPerformanceSuccess({
                entityWithPerformance: entityWithPerformanceMock,
                entityTypeCode: entityTypeCodeMock
              }),
              new SetSalesHierarchyViewType(SalesHierarchyViewType.roleGroups)
            ]);

            done();
          }
        });
      });
    });

    describe('when getEntitiesWithPerformanceForGroup returns an error', () => {
      it('should return a FetchResponsibilitiesFailureAction after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getEntitiesWithPerformanceForGroup').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.FetchEntityWithPerformance$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailure(error));
          done();
        });
      });
    });
  });

  describe('when a RefreshAllPerformances is received', () => {
    const refreshAllPerformancesPayloadMock: RefreshAllPerformancesPayload = {
      positionId: chance.string(),
      groupedEntities: getGroupedEntitiesMock(),
      hierarchyGroups: [getHierarchyGroupMock()],
      selectedEntityType: getEntityTypeMock(),
      salesHierarchyViewType: SalesHierarchyViewType[getSalesHierarchyViewTypeMock()],
      skuPackageType: SkuPackageType[getSkuPackageTypeMock()],
      filter: performanceFilterStateMock,
      brandSkuCode: chance.string(),
      entityType: getEntityTypeMock(),
      alternateHierarchyId: chance.string(),
      accountPositionId: chance.string()
    };

    beforeEach(() => {
      actions$.next(new RefreshAllPerformances(refreshAllPerformancesPayloadMock));
    });

    describe('refresh all performances', () => {
      it('should call getRefreshedPerformances with the payload data', (done) => {
        const getRefreshedPerformancesSpy = spyOn(responsibilitiesService, 'getRefreshedPerformances').and.callThrough();

        responsibilitiesEffects.RefreshAllPerformances$().subscribe(() => {
          done();
        });

        expect(getRefreshedPerformancesSpy.calls.count()).toBe(1);
        expect(getRefreshedPerformancesSpy.calls.argsFor(0)).toEqual([refreshAllPerformancesPayloadMock]);
      });

      describe('when getRefreshedPerformances returns successfully', () => {
        it('should dispatch appropriate actions', (done) => {
          spyOn(responsibilitiesService, 'getRefreshedPerformances').and.callFake(
            (refreshAllPerformancesData: RefreshAllPerformancesData) => {
              return Observable.of(Object.assign({}, refreshAllPerformancesData, {
                entityWithPerformance: entityWithPerformanceMock
              }));
          });

          const dispatchedActions: Action[] = [];

          responsibilitiesEffects.RefreshAllPerformances$().subscribe((dispatchedAction: Action) => {
            dispatchedActions.push(dispatchedAction);

            if (dispatchedActions.length === 2) {
              expect(dispatchedActions).toEqual([
                new SetSalesHierarchyViewType(refreshAllPerformancesPayloadMock.salesHierarchyViewType),
                new FetchResponsibilitiesSuccess({
                  positionId: refreshAllPerformancesPayloadMock.positionId,
                  groupedEntities: refreshAllPerformancesPayloadMock.groupedEntities,
                  hierarchyGroups: refreshAllPerformancesPayloadMock.hierarchyGroups,
                  entityWithPerformance: entityWithPerformanceMock
                })
              ]);

              done();
            }
          });
        });
      });

      describe('when getRefreshedPerformances returns an error', () => {
        it('should return a FetchResponsibilitiesFailure action after catching an error', (done) => {
          spyOn(responsibilitiesService, 'getRefreshedPerformances').and.returnValue(Observable.throw(error));
          responsibilitiesEffects.RefreshAllPerformances$().subscribe((result) => {
            expect(result).toEqual(new FetchResponsibilitiesFailure(error));
            done();
          });
        });
      });
    });

    describe('refresh total performance', () => {
      it('should call getRefreshedTotalPerformance with the payload data', (done) => {
        const getRefreshedTotalPerformanceSpy = spyOn(responsibilitiesService, 'getRefreshedTotalPerformance').and.callThrough();

        responsibilitiesEffects.RefreshTotalPerformance$().subscribe(() => {
          done();
        });

        expect(getRefreshedTotalPerformanceSpy.calls.count()).toBe(1);
        expect(getRefreshedTotalPerformanceSpy.calls.argsFor(0)).toEqual([refreshAllPerformancesPayloadMock]);
      });

      describe('when getRefreshedTotalPerformance returns successfully', () => {
        it('should dispatch appropriate actions', (done) => {
          spyOn(responsibilitiesService, 'getRefreshedTotalPerformance').and.callFake(
            (refreshTotalPerformanceData: RefreshTotalPerformanceData) => {
              return Observable.of(Object.assign({}, refreshTotalPerformanceData, {
                entitiesTotalPerformances: performanceMock
              }));
          });

          const dispatchedActions: Action[] = [];

          responsibilitiesEffects.RefreshTotalPerformance$().subscribe((dispatchedAction: Action) => {
            dispatchedActions.push(dispatchedAction);

            if (dispatchedActions.length === 1) {
              expect(dispatchedActions).toEqual([
                new FetchTotalPerformanceSuccess(performanceMock)
              ]);

              done();
            }
          });
        });
      });

      describe('when getRefreshedTotalPerformance returns an error', () => {
        it('should return a FetchResponsibilitiesFailure action after catching an error', (done) => {
          spyOn(responsibilitiesService, 'getRefreshedTotalPerformance').and.returnValue(Observable.throw(error));
          responsibilitiesEffects.RefreshTotalPerformance$().subscribe((result) => {
            expect(result).toEqual(new FetchTotalPerformanceFailure(error));
            done();
          });
        });
      });
    });
  });

  describe('when a fetch performance total or responsibilities action is dispatched', () => {
    beforeEach(() => {
      actions$.next(new FetchTotalPerformance({
        positionId: positionIdMock,
        filter: performanceFilterStateMock,
        brandSkuCode: brandCodeMock,
        skuPackageType: skuPackageTypeMock
      }));
    });

    it('should return a success action when the api service returns a response', (done) => {
      responsibilitiesEffects.fetchPerformance$().subscribe(result => {
        expect(result).toEqual(new FetchTotalPerformanceSuccess(performanceMock));
        done();
      });
    });

    it('should call getPerformance with the right arguments', (done) => {
      const getResponsibilitiesSpy = spyOn(responsibilitiesService, 'getPerformance').and.callThrough();

      responsibilitiesEffects.fetchPerformance$().subscribe(() => {
        done();
      });

      expect(getResponsibilitiesSpy.calls.count()).toBe(1);
      expect(getResponsibilitiesSpy.calls.argsFor(0)).toEqual([
        positionIdMock,
        performanceFilterStateMock,
        brandCodeMock,
        skuPackageTypeMock
      ]);
    });

    it('should return a fail action when the api service returns an error', (done) => {
      spyOn(responsibilitiesService, 'getPerformance').and.returnValue(Observable.throw(error));

      responsibilitiesEffects.fetchPerformance$().subscribe(result => {
        expect(result).toEqual(new FetchTotalPerformanceFailure(error));
        done();
      });
    });

    it('should log the error payload when a FetchTotalPerformanceFailure is received', (done) => {
      spyOn(responsibilitiesService, 'getPerformance').and.returnValue(Observable.throw(error));
      spyOn(console, 'error');

      responsibilitiesEffects.fetchPerformance$().subscribe(result => {
        expect(result).toEqual(new FetchTotalPerformanceFailure(error));
        actions$.next(new FetchTotalPerformanceFailure(error));
        done();
      });

      responsibilitiesEffects.fetchPerformanceFailure$().subscribe((result: ResponsibilitiesActions.FetchTotalPerformanceFailure) => {
        expect(result).toEqual(new FetchTotalPerformanceFailure(error));
        expect(console.error).toHaveBeenCalledWith('Failed fetching performance total data', result.payload);
        done();
      });
    });

    describe('when a FetchSubAccounts is recieved', () => {
      let fetchSubAccountsPayloadMock: FetchSubAccountsPayload;
      let subAccountDataMock: SubAccountData;

      beforeEach(() => {
        fetchSubAccountsPayloadMock = {
          positionId: chance.string({pool: '0123456789'}),
          contextPositionId: chance.string({pool: '0123456789'}),
          entityTypeAccountName: chance.string(),
          selectedPositionId: getMyPerformanceTableRowMock(1)[0].metadata.positionId,
          filter: performanceFilterStateMock,
          selectedEntityDescription: chance.string(),
          brandSkuCode: chance.string()
        };
        subAccountDataMock = Object.assign({}, fetchSubAccountsPayloadMock);

        actions$.next(new FetchSubAccounts(fetchSubAccountsPayloadMock));
      });

      describe('when everything returns successfully', () => {
        it('should call getSubAccounts with the right arguments', (done) => {
          const getSubAccountsSpy = spyOn(responsibilitiesService, 'getSubAccounts').and.callThrough();

          responsibilitiesEffects.fetchSubAccounts$().subscribe(() => {
            done();
          });

          expect(getSubAccountsSpy.calls.count()).toBe(1);
          expect(getSubAccountsSpy.calls.argsFor(0)[0]).toEqual(subAccountDataMock);
        });

        it('should call checkEmptySubaccountsResponse with the right arguments', (done) => {
          const checkEmptySubaccountsSpy = spyOn(responsibilitiesService, 'checkEmptySubaccountsResponse').and.callThrough();

          responsibilitiesEffects.fetchSubAccounts$().subscribe(() => {
            done();
          });

          expect(checkEmptySubaccountsSpy.calls.count()).toBe(1);
          expect(checkEmptySubaccountsSpy.calls.argsFor(0)[0]).toEqual(subAccountDataMock);
        });

        it('should call getSubAccountsPerformances with the right arguments', (done) => {
          const getSubAccountsPerformanceSpy = spyOn(responsibilitiesService, 'getSubAccountsPerformances').and.callThrough();

          responsibilitiesEffects.fetchSubAccounts$().subscribe(() => {
            done();
          });

          expect(getSubAccountsPerformanceSpy.calls.count()).toBe(1);
          expect(getSubAccountsPerformanceSpy.calls.argsFor(0)[0]).toEqual(subAccountDataMock);
        });

        it('should return a FetchSubAccountsSuccess', (done) => {
          spyOn(responsibilitiesService, 'getSubAccounts').and.callFake((subAccountData: SubAccountData) => {
            return Observable.of(Object.assign({}, subAccountData, {
              groupedEntities: groupedEntitiesMock
            }));
          });

          spyOn(responsibilitiesService, 'getSubAccountsPerformances').and.callFake((subAccountData: SubAccountData) => {
            return Observable.of(Object.assign({}, subAccountData, {
              entityWithPerformance: entityWithPerformanceMock
            }));
          });

          const dispatchedActions: Action[] = [];

          responsibilitiesEffects.fetchSubAccounts$().subscribe((dispatchedAction: Action) => {
            dispatchedActions.push(dispatchedAction);

            if (dispatchedActions.length === 4) {
              expect(dispatchedActions).toEqual([
                new SetTotalPerformance(fetchSubAccountsPayloadMock.selectedPositionId),
                new FetchSubAccountsSuccess({
                  groupedEntities: groupedEntitiesMock,
                  entityWithPerformance: entityWithPerformanceMock
                }),
                new SetAccountPositionId(fetchSubAccountsPayloadMock.positionId),
                new SetSalesHierarchyViewType(SalesHierarchyViewType.subAccounts)
              ]);

              done();
            }
          });
        });
      });

      describe('when getSubAccounts returns an error', () => {
        it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
          spyOn(responsibilitiesService, 'getSubAccounts').and.returnValue(Observable.throw(error));
          responsibilitiesEffects.fetchSubAccounts$().subscribe((result) => {
            expect(result).toEqual(new FetchResponsibilitiesFailure(error));
            done();
          });
        });
      });

      describe('when checkEmptySubaccountsResponse returns an error', () => {
        it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
          spyOn(responsibilitiesService, 'checkEmptySubaccountsResponse').and.returnValue(Observable.throw(error));
          responsibilitiesEffects.fetchSubAccounts$().subscribe((result) => {
            expect(result).toEqual(new FetchResponsibilitiesFailure(error));
            done();
          });
        });
      });

      describe('when getSubAccountsPerformances returns an error', () => {
        it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
          spyOn(responsibilitiesService, 'getSubAccountsPerformances').and.returnValue(Observable.throw(error));
          responsibilitiesEffects.fetchSubAccounts$().subscribe((result) => {
            expect(result).toEqual(new FetchResponsibilitiesFailure(error));
            done();
          });
        });
      });
    });
  });

  describe('when a FetchAlternateHierarchyResponsibilities action is received', () => {
    let alternateResponsibilitiesDataMock: ResponsibilitiesData;

    beforeEach(() => {
      actions$.next(new FetchAlternateHierarchyResponsibilities({
        positionId: positionIdMock,
        alternateHierarchyId: alternateHierarchyIdMock,
        filter: performanceFilterStateMock,
        selectedEntityDescription: selectedEntityDescriptionMock
      }));

      alternateResponsibilitiesDataMock = {
        positionId: positionIdMock,
        alternateHierarchyId: alternateHierarchyIdMock,
        filter: performanceFilterStateMock,
        selectedEntityDescription: selectedEntityDescriptionMock
      };
    });

    describe('when everything returns successfully', () => {
      it('should dispatch the appropriate success actions', (done) => {
        const salesHierarchyViewTypeMock = SalesHierarchyViewType[getSalesHierarchyViewTypeMock()];
        const dispatchedActions: Action[] = [];

        spyOn(responsibilitiesService, 'getAlternateHierarchyResponsibilities').and.callFake(
          (responsibilitiesData: ResponsibilitiesData) => {
            responsibilitiesData.groupedEntities = groupedEntitiesMock;
            responsibilitiesData.salesHierarchyViewType = salesHierarchyViewTypeMock;
            responsibilitiesData.hierarchyGroups = hierarchyGroupsMock;
            return Observable.of(responsibilitiesData);
        });

        spyOn(responsibilitiesService, 'getPerformanceForGroupedEntities').and.callFake(
          (responsibilitiesData: ResponsibilitiesData) => {
            responsibilitiesData.entityWithPerformance = entityWithPerformanceMock;
            return Observable.of(responsibilitiesData);
        });

        responsibilitiesEffects.fetchAlternateHierarchyResponsibilities$().subscribe((dispatchedAction: Action) => {
          dispatchedActions.push(dispatchedAction);

          if (dispatchedActions.length === 3) {
            expect(dispatchedActions).toEqual([
              new SetSalesHierarchyViewType(salesHierarchyViewTypeMock),
              new SetTotalPerformance(alternateResponsibilitiesDataMock.positionId),
              new FetchResponsibilitiesSuccess(responsibilitiesSuccessPayloadMock)
            ]);

            done();
          }
        });
      });

      it('should call getAlternateHierarchyResponsibilities with the right arguments', (done) => {
        const getResponsibilitiesSpy = spyOn(responsibilitiesService, 'getAlternateHierarchyResponsibilities').and.callThrough();

        responsibilitiesEffects.fetchAlternateHierarchyResponsibilities$().subscribe(() => {
          done();
        });

        expect(getResponsibilitiesSpy.calls.count()).toBe(1);
        expect(getResponsibilitiesSpy.calls.argsFor(0)[0]).toEqual(alternateResponsibilitiesDataMock);
      });

      it('should call getEntityURIResponsibilities with the right arguments', (done) => {
        const getEntityURIResponsibilitiesSpy = spyOn(responsibilitiesService, 'getEntityURIResponsibilities').and.callThrough();

        responsibilitiesEffects.fetchAlternateHierarchyResponsibilities$().subscribe(() => {
          done();
        });

        expect(getEntityURIResponsibilitiesSpy.calls.count()).toBe(1);
        expect(getEntityURIResponsibilitiesSpy.calls.argsFor(0)[0]).toEqual(alternateResponsibilitiesDataMock);
      });

      it('should call checkEmptyResponsibilitiesResponse with the right arguments', (done) => {
        const checkEmptyResponsibilitiesResponseSpy =
          spyOn(responsibilitiesService, 'checkEmptyResponsibilitiesResponse').and.callThrough();

        responsibilitiesEffects.fetchAlternateHierarchyResponsibilities$().subscribe(() => {
          done();
        });

        expect(checkEmptyResponsibilitiesResponseSpy.calls.count()).toBe(1);
        expect(checkEmptyResponsibilitiesResponseSpy.calls.argsFor(0)[0]).toEqual(alternateResponsibilitiesDataMock);
      });

      it('should call getPerformanceForGroupedEntities with the right arguments', (done) => {
        const getPerformanceSpy = spyOn(responsibilitiesService, 'getPerformanceForGroupedEntities').and.callThrough();

        responsibilitiesEffects.fetchAlternateHierarchyResponsibilities$().subscribe(() => {
          done();
        });

        expect(getPerformanceSpy.calls.count()).toBe(1);
        expect(getPerformanceSpy.calls.argsFor(0)[0]).toEqual(alternateResponsibilitiesDataMock);
      });
    });

    describe('when getAlternateHierarchyResponsibilities returns an error', () => {
      it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getAlternateHierarchyResponsibilities').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.fetchAlternateHierarchyResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailure(error));
          done();
        });
      });
    });

    describe('when getEntityURIResponsibilities returns an error', () => {
      it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getEntityURIResponsibilities').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.fetchAlternateHierarchyResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailure(error));
          done();
        });
      });
    });

    describe('when checkEmptyResponsibilitiesResponse returns an error', () => {
      it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
        spyOn(responsibilitiesService, 'checkEmptyResponsibilitiesResponse').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.fetchAlternateHierarchyResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailure(error));
          done();
        });
      });
    });

    describe('when getPerformanceForGroupedEntities returns an error', () => {
      it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getPerformanceForGroupedEntities').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.fetchAlternateHierarchyResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailure(error));
          done();
        });
      });
    });
  });
});
