import { Action } from '@ngrx/store';
import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { EntityPeopleType, EntityType } from '../../enums/entity-responsibilities.enum';
import { EntityWithPerformance } from '../../models/entity-with-performance.model';
import { Performance } from '../../models/performance.model';
import { FetchResponsibilities,
         FetchResponsibilitiesFailure,
         FetchResponsibilitiesSuccess,
         FetchEntityWithPerformance,
         FetchEntityWithPerformanceSuccess,
         FetchEntityWithPerformancePayload,
         GetPeopleByRoleGroupAction,
         SetTotalPerformance,
         FetchTotalPerformance,
         FetchTotalPerformanceSuccess,
         FetchTotalPerformanceFailure,
         FetchSubAccountsAction,
         FetchSubAccountsSuccessAction,
         FetchSubAccountsActionPayload,
         ConstructRoleGroups } from '../actions/responsibilities.action';
import { getEntityPeopleResponsibilitiesMock } from '../../models/hierarchy-entity.model.mock';
import { getPerformanceMock } from '../../models/performance.model.mock';
import { getEntitiesWithPerformancesMock } from '../../models/entity-with-performance.model.mock';
import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getViewTypeMock } from '../../enums/view-type.enum.mock';
import { GroupedEntities } from '../../models/grouped-entities.model';
import { HierarchyEntity } from '../../models/hierarchy-entity.model';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { ResponsibilitiesData, SubAccountData } from '../../services/responsibilities.service';
import { ResponsibilitiesEffects } from './responsibilities.effect';
import { ResponsibilitiesService } from '../../services/responsibilities.service';
import { SetLeftMyPerformanceTableViewType } from '../actions/view-types.action';
import { ViewType } from '../../enums/view-type.enum';

const chance = new Chance();

describe('Responsibilities Effects', () => {
  const entityWithPerformanceMock = getEntitiesWithPerformancesMock();
  const error = new Error(chance.string());
  const groupedEntitiesMock: GroupedEntities = getGroupedEntitiesMock();
  const performanceMock: Performance = getPerformanceMock();
  const positionIdMock = chance.string();
  const entityTypeCodeMock = chance.string();

  const responsibilitiesServiceMock = {
    getResponsibilities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getPerformanceForGroupedEntities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getAccountsDistributors(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getResponsibilitiesPerformances(args: any): Observable<(EntityWithPerformance | Error)[]> {
      return Observable.of(entityWithPerformanceMock);
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
    getAlternateHierarchy(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getAlternateAccountsDistributors(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getEntityGroupViewType(entityType: EntityType): ViewType {
      return ViewType.roleGroups;
    },
    getEntitiesWithPerformanceForGroup(args: any): Observable<EntityWithPerformance[]> {
      return Observable.of(entityWithPerformanceMock);
    },
    groupPeopleResponsibilities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    }
  };

  const performanceFilterStateMock: MyPerformanceFilterState = getMyPerformanceFilterMock();

  const responsibilitiesSuccessPayloadMock = {
    positionId: positionIdMock,
    groupedEntities: groupedEntitiesMock,
    entityWithPerformance: entityWithPerformanceMock
  };

  const responsibilitiesDataMock: ResponsibilitiesData = {
    filter: performanceFilterStateMock,
    positionId: positionIdMock
  };

  let runner: EffectsRunner;
  let responsibilitiesEffects: ResponsibilitiesEffects;
  let responsibilitiesService: ResponsibilitiesService;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      ResponsibilitiesEffects,
      {
        provide: ResponsibilitiesService,
        useValue: responsibilitiesServiceMock
      }
    ]
  }));

  beforeEach(inject([ EffectsRunner, ResponsibilitiesEffects, ResponsibilitiesService ],
    (_runner: EffectsRunner,
      _compassWebEffects: ResponsibilitiesEffects,
      _responsibilitiesService: ResponsibilitiesService) => {
      runner = _runner;
      responsibilitiesEffects = _compassWebEffects;
      responsibilitiesService = _responsibilitiesService;
    }
  ));

  describe('when a FetchResponsibilities is received', () => {
    beforeEach(() => {
      runner.queue(new FetchResponsibilities({
        positionId: positionIdMock,
        filter: performanceFilterStateMock
      }));
    });

    describe('when everything returns successfully', () => {
      it('should return a FetchResponsibilitiesSuccess', (done) => {
        const viewTypeMock = ViewType[getViewTypeMock()];

        spyOn(responsibilitiesService, 'getResponsibilities').and.callFake((responsibilitiesData: ResponsibilitiesData) => {
          responsibilitiesData.groupedEntities = groupedEntitiesMock;
          responsibilitiesData.viewType = viewTypeMock;
          return Observable.of(responsibilitiesData);
        });

        spyOn(responsibilitiesService, 'getPerformanceForGroupedEntities').and.callFake(
          (responsibilitiesData: ResponsibilitiesData) => {
          responsibilitiesData.entityWithPerformance = entityWithPerformanceMock;
          return Observable.of(responsibilitiesData);
        });

        responsibilitiesEffects.fetchResponsibilities$().pairwise().subscribe(([result1, result2]) => {
          expect(result1).toEqual(new SetLeftMyPerformanceTableViewType(viewTypeMock));
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

      it('should call getAccountsDistributors with the right arguments', (done) => {
        const getAccountsDistributorsSpy = spyOn(responsibilitiesService, 'getAccountsDistributors').and.callThrough();

        responsibilitiesEffects.fetchResponsibilities$().subscribe(() => {
          done();
        });

        expect(getAccountsDistributorsSpy.calls.count()).toBe(1);
        expect(getAccountsDistributorsSpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock);
      });

      it('should call getAlternateHierarchy with the right arguments', (done) => {
        const getAlternateHierarchySpy = spyOn(responsibilitiesService, 'getAlternateHierarchy').and.callThrough();

        responsibilitiesEffects.fetchResponsibilities$().subscribe(() => {
          done();
        });

        expect(getAlternateHierarchySpy.calls.count()).toBe(1);
        expect(getAlternateHierarchySpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock);
      });

      it('should call getAlternateAccountsDistributors with the right arguments', (done) => {
        const getAlternateAccountsDistributorsSpy = spyOn(responsibilitiesService, 'getAlternateAccountsDistributors').and.callThrough();

        responsibilitiesEffects.fetchResponsibilities$().subscribe(() => {
          done();
        });

        expect(getAlternateAccountsDistributorsSpy.calls.count()).toBe(1);
        expect(getAlternateAccountsDistributorsSpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock);
      });

      it('should call getPerformanceForGroupedEntities with the right arguments', (done) => {
        const getPerformanceSpy = spyOn(responsibilitiesService, 'getPerformanceForGroupedEntities').and.callThrough();

        responsibilitiesEffects.fetchResponsibilities$().subscribe(() => {
          done();
        });

        expect(getPerformanceSpy.calls.count()).toBe(1);
        expect(getPerformanceSpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock);
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

    describe('when getAccountsDistributors returns an error', () => {
      it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getAccountsDistributors').and.returnValue(Observable.throw(error));
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

    describe('when getAlternateAccountsDistributors returns an error', () => {
      it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getAlternateAccountsDistributors').and.returnValue(Observable.throw(error));
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
        runner.queue(new FetchResponsibilitiesFailure(error));
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
      selectedPositionId: getMyPerformanceTableRowMock(1)[0].metadata.positionId,
      entityTypeGroupName: EntityPeopleType['GENERAL MANAGER'],
      entityTypeCode: entityTypeCodeMock,
      type: EntityType.RoleGroup,
      entities: [getEntityPeopleResponsibilitiesMock()],
      filter: performanceFilterStateMock
    };

    beforeEach(() => {
      runner.queue(new FetchEntityWithPerformance(fetchEntityPerformancePayloadMock));
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
        const dispatchedActions: Action[] = [];

        responsibilitiesEffects.FetchEntityWithPerformance$().subscribe((dispatchedAction: Action) => {
          dispatchedActions.push(dispatchedAction);

          if (dispatchedActions.length === 4) {
            expect(dispatchedActions).toEqual([
              new SetTotalPerformance(fetchEntityPerformancePayloadMock.selectedPositionId),
              new GetPeopleByRoleGroupAction(fetchEntityPerformancePayloadMock.entityTypeGroupName),
              new FetchEntityWithPerformanceSuccess({
                entityWithPerformance: entityWithPerformanceMock,
                entityTypeCode: entityTypeCodeMock
              }),
              new SetLeftMyPerformanceTableViewType(ViewType.roleGroups)
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

  describe('when a fetch performance total or responsibilities action is dispatched', () => {
    beforeEach(() => {
      runner.queue(new FetchTotalPerformance({
        positionId: positionIdMock,
        filter: performanceFilterStateMock
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
        performanceFilterStateMock
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
        runner.queue(new FetchTotalPerformanceFailure(error));
        done();
      });

      responsibilitiesEffects.fetchPerformanceFailure$().subscribe((result) => {
        expect(result).toEqual(new FetchTotalPerformanceFailure(error));
        expect(console.error).toHaveBeenCalledWith('Failed fetching performance total data', result.payload);
        done();
      });
    });

    describe('when a FetchSubAccountsAction is recieved', () => {
      let fetchSubAccountsPayloadMock: FetchSubAccountsActionPayload;
      let subAccountDataMock: SubAccountData;

      beforeEach(() => {
        fetchSubAccountsPayloadMock = {
          positionId: chance.string({pool: '0123456789'}),
          contextPositionId: chance.string({pool: '0123456789'}),
          entityTypeAccountName: chance.string(),
          selectedPositionId: getMyPerformanceTableRowMock(1)[0].metadata.positionId,
          filter: performanceFilterStateMock
        };
        subAccountDataMock = Object.assign({}, fetchSubAccountsPayloadMock);

        runner.queue(new FetchSubAccountsAction(fetchSubAccountsPayloadMock));
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

        it('should call getSubAccountsPerformances with the right arguments', (done) => {
          const getSubAccountsPerformanceSpy = spyOn(responsibilitiesService, 'getSubAccountsPerformances').and.callThrough();

          responsibilitiesEffects.fetchSubAccounts$().subscribe(() => {
            done();
          });

          expect(getSubAccountsPerformanceSpy.calls.count()).toBe(1);
          expect(getSubAccountsPerformanceSpy.calls.argsFor(0)[0]).toEqual(subAccountDataMock);
        });

        it('should return a FetchSubAccountsSuccessAction', (done) => {
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

            if (dispatchedActions.length === 3) {
              expect(dispatchedActions).toEqual([
                new SetTotalPerformance(fetchSubAccountsPayloadMock.selectedPositionId),
                new FetchSubAccountsSuccessAction({
                  groupedEntities: groupedEntitiesMock,
                  entityWithPerformance: entityWithPerformanceMock
                }),
                new SetLeftMyPerformanceTableViewType(ViewType.subAccounts)
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

    describe('when a ConstructRoleGroups action is recieved', () => {
      let constructRoleGroupsPayloadMock: { positionId: string, entities: HierarchyEntity[], filter: MyPerformanceFilterState };
      let roleGroupsDataMock: ResponsibilitiesData;

      beforeEach(() => {
        constructRoleGroupsPayloadMock = {
          positionId: chance.string(),
          entities: [ getEntityPeopleResponsibilitiesMock(), getEntityPeopleResponsibilitiesMock() ],
          filter: performanceFilterStateMock
        };
        roleGroupsDataMock = Object.assign({}, constructRoleGroupsPayloadMock);

        runner.queue(new ConstructRoleGroups(constructRoleGroupsPayloadMock));
      });

      describe('when everything returns successfully', () => {
        it('should call groupPeopleResponsibilities with the right arguments', (done) => {
          const groupPeopleResponsibilitiesSpy = spyOn(responsibilitiesService, 'groupPeopleResponsibilities').and.callThrough();

          responsibilitiesEffects.constructRoleGroups$().subscribe(() => {
            done();
          });

          expect(groupPeopleResponsibilitiesSpy.calls.count()).toBe(1);
          expect(groupPeopleResponsibilitiesSpy.calls.argsFor(0)[0]).toEqual(roleGroupsDataMock);
        });

        it('should call getPerformanceForGroupedEntities with the right arguments', (done) => {
          const getPerformanceForGroupedEntitiesSpy = spyOn(responsibilitiesService, 'getPerformanceForGroupedEntities').and.callThrough();

          responsibilitiesEffects.constructRoleGroups$().subscribe(() => {
            done();
          });

          expect(getPerformanceForGroupedEntitiesSpy.calls.count()).toBe(1);
          expect(getPerformanceForGroupedEntitiesSpy.calls.argsFor(0)[0]).toEqual(roleGroupsDataMock);
        });

        it('should dispatch appropriate when everything returns successfully', (done) => {
          spyOn(responsibilitiesService, 'groupPeopleResponsibilities').and.callFake((responsibilitiesData: ResponsibilitiesData) => {
            return Observable.of(Object.assign({}, responsibilitiesData, {
              groupedEntities: groupedEntitiesMock,
              viewType: ViewType.roleGroups
            }));
          });

          spyOn(responsibilitiesService, 'getPerformanceForGroupedEntities').and.callFake((responsibilitiesData: ResponsibilitiesData) => {
            return Observable.of(Object.assign({}, responsibilitiesData, {
              entityWithPerformance: entityWithPerformanceMock
            }));
          });

          responsibilitiesEffects.constructRoleGroups$().pairwise().subscribe(([action1, action2]) => {
            expect(action1).toEqual(new SetLeftMyPerformanceTableViewType(ViewType.roleGroups));
            expect(action2).toEqual(new FetchResponsibilitiesSuccess({
              positionId: constructRoleGroupsPayloadMock.positionId,
              groupedEntities: groupedEntitiesMock,
              entityWithPerformance: entityWithPerformanceMock
            }));
            done();
          });
        });
      });

      describe('when getPerformanceForGroupedEntities returns an error', () => {
        it('should return a FetchResponsibilitiesFailure after catching an error', (done) => {
          spyOn(responsibilitiesService, 'getPerformanceForGroupedEntities').and.returnValue(Observable.throw(error));
          responsibilitiesEffects.constructRoleGroups$().subscribe((result) => {
            expect(result).toEqual(new FetchResponsibilitiesFailure(error));
            done();
          });
        });
      });
    });
  });
});
