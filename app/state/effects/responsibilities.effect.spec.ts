import { Action } from '@ngrx/store';
import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { EntitiesPerformances } from '../../models/entities-performances.model';
import { EntitiesTotalPerformances } from '../../models/entities-total-performances.model';
import { FetchResponsibilitiesAction,
         FetchResponsibilitiesFailureAction,
         FetchResponsibilitiesSuccessAction,
         FetchResponsibilityEntityPerformance,
         FetchResponsibilityEntityPerformanceSuccess,
         FetchResponsibilityEntitiesPerformancePayload,
         GetPeopleByRoleGroupAction,
         SetTableRowPerformanceTotal,
         FetchPerformanceTotalAction,
         FetchPerformanceTotalSuccessAction,
         FetchPerformanceTotalFailureAction } from '../actions/responsibilities.action';
import { getEntityPeopleResponsibilitiesMock } from '../../models/entity-responsibilities.model.mock';
import { getEntitiesTotalPerformancesMock } from '../../models/entities-total-performances.model.mock';
import { getEntitiesPerformancesMock } from '../../models/entities-performances.model.mock';
import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getViewTypeMock } from '../../enums/view-type.enum.mock';
import { GroupedEntities } from '../../models/grouped-entities.model';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { PerformanceTransformerService } from '../../services/performance-transformer.service';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { ResponsibilitiesData } from '../../services/responsibilities.service';
import { ResponsibilitiesEffects } from './responsibilities.effect';
import { ResponsibilitiesService } from '../../services/responsibilities.service';
import { SetLeftMyPerformanceTableViewType } from '../actions/view-types.action';
import { ViewType } from '../../enums/view-type.enum';

const chance = new Chance();

describe('Responsibilities Effects', () => {
  const positionIdMock = chance.string();
  const entitiesPerformancesMock = getEntitiesPerformancesMock();
  const groupedEntitiesMock: GroupedEntities = getGroupedEntitiesMock();
  const performanceTotalMock: EntitiesTotalPerformances = getEntitiesTotalPerformancesMock();
  const error = new Error(chance.string());

  const responsibilitiesServiceMock = {
    getResponsibilities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getPerformanceTotalForGroupedEntities(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getAccountsDistributors(responsibilitiesData: ResponsibilitiesData): Observable<ResponsibilitiesData> {
      return Observable.of(responsibilitiesData);
    },
    getResponsibilitiesPerformanceTotals(args: any): Observable<(EntitiesPerformances | Error)[]> {
      return Observable.of(entitiesPerformancesMock);
    },
    getPerformanceTotal(args: any): Observable<EntitiesTotalPerformances> {
      return Observable.of(performanceTotalMock);
    }
  };

  const performanceFilterStateMock: MyPerformanceFilterState = {
    metricType: MetricTypeValue.PointsOfDistribution,
    dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
    premiseType: PremiseTypeValue.On,
    distributionType: DistributionTypeValue.simple
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

  fdescribe('when a FetchResponsibilitiesAction is received', () => {

    describe('when ResponsibilitiesApiService returns successfully', () => {
      beforeEach(inject([],
        () => {
          runner.queue(new FetchResponsibilitiesAction({
            positionId: positionIdMock,
            filter: performanceFilterStateMock
          }));
        }
      ));

      it('should return a FetchResponsibilitiesSuccessAction', (done: any) => {
        const responsibilitiesSuccessPayloadMock = {
          positionId: positionIdMock,
          groupedEntities: groupedEntitiesMock,
          entitiesPerformances: entitiesPerformancesMock
        };

        const viewTypeMock = ViewType[getViewTypeMock()];

        spyOn(responsibilitiesService, 'getResponsibilities').and.callFake((responsibilitiesData: ResponsibilitiesData) => {
          responsibilitiesData.groupedEntities = groupedEntitiesMock;
          responsibilitiesData.viewType = viewTypeMock;
          return Observable.of(responsibilitiesData);
        });

        spyOn(responsibilitiesService, 'getPerformanceTotalForGroupedEntities').and.callFake(
          (responsibilitiesData: ResponsibilitiesData) => {
          responsibilitiesData.entitiesPerformances = entitiesPerformancesMock;
          return Observable.of(responsibilitiesData);
        });

        responsibilitiesEffects.fetchResponsibilities$().pairwise().subscribe(([result1, result2]) => {
          expect(result1).toEqual(new SetLeftMyPerformanceTableViewType(viewTypeMock));
          expect(result2).toEqual(new FetchResponsibilitiesSuccessAction(responsibilitiesSuccessPayloadMock));
          done();
        });
      });
    });

    describe('when ResponsibilitiesApiService returns an error', () => {
      let myPerformanceApiService: MyPerformanceApiService;

      beforeEach(inject([ MyPerformanceApiService ],
        (_myPerformanceApiService: MyPerformanceApiService) => {
          myPerformanceApiService = _myPerformanceApiService;
          runner.queue(new FetchResponsibilitiesAction({
            positionId: positionIdMock,
            filter: performanceFilterStateMock
          }));
        }
      ));

      it('should return a FetchResponsibilitiesFailureAction after catching an error', (done) => {
        spyOn(myPerformanceApiService, 'getResponsibilities').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.fetchResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailureAction(error));
          done();
        });
      });
    });

    describe('when a FetchResponsibilitiesFailureAction is received', () => {

      beforeEach(() => {
        runner.queue(new FetchResponsibilitiesFailureAction(error));
        spyOn(console, 'error');
      });

      it('should log the error payload', (done) => {
        responsibilitiesEffects.fetchResponsibilitiesFailure$().subscribe(() => {
          expect(console.error).toHaveBeenCalled();
          done();
        });
      });
    });

    // fdescribe('getPerformanceTotalForGroupedEntities stage', () => { // TODO: rename
    //   let myPerformanceApiService: MyPerformanceApiService;
    //   let performanceTransformerService: PerformanceTransformerService;
    //   let performanceTotalArrayMock: [EntitiesTotalPerformances];
    //   let getResponsibilityPerformanceTotalSpy: jasmine.Spy;
    //   let transformEntitiesPerformancesDTOResponseMock: any;
    //
    //   fetchEntityPerformancePayloadMock.entities.push(getEntityPeopleResponsibilitiesMock());
    //
    //   beforeEach(inject([ MyPerformanceApiService, PerformanceTransformerService ],
    //     (_myPerformanceApiService: MyPerformanceApiService, _performanceTransformerServiceMock: PerformanceTransformerService) => {
    //       myPerformanceApiService = _myPerformanceApiService;
    //       performanceTransformerService = _performanceTransformerServiceMock;
    //
    //       runner.queue(new FetchResponsibilityEntityPerformance(fetchEntityPerformancePayloadMock));
    //
    //       performanceTotalArrayMock = [
    //         getEntitiesTotalPerformancesMock(),
    //         getEntitiesTotalPerformancesMock()
    //       ];
    //
    //       getResponsibilityPerformanceTotalSpy = spyOn(myPerformanceApiService, 'getResponsibilityPerformanceTotal').and.callFake(
    //         (entity: { type: string, name: string }, filter: MyPerformanceFilterState, positionId: string) => {
    //         const performancesIndex = fetchEntityPerformancePayloadMock.entities.findIndex(item => item.positionId === positionId);
    //         return Observable.of({
    //           id: positionId,
    //           name: entity.name,
    //           performanceTotal: performanceTotalArrayMock[performancesIndex]
    //         });
    //       });
    //
    //       transformEntitiesPerformancesDTOResponseMock = chance.string();
    //
    //       spyOn(performanceTransformerService, 'transformEntitiesPerformancesDTO').and.callFake(() => {
    //         return transformEntitiesPerformancesDTOResponseMock;
    //       });
    //     }
    //   ));
    //
    //   it('should call the responsibility performanceTotal endpoint for each entity and return an array of performance data',
    //   (done: any) => {
    //     const dispatchedActions: Action[] = [];
    //
    //     responsibilitiesEffects.FetchResponsibilityEntityPerformance$().subscribe((dispatchedAction: Action) => {
    //       dispatchedActions.push(dispatchedAction);
    //
    //       if (dispatchedActions.length === 4) {
    //         expect(dispatchedActions).toEqual([
    //           new SetTableRowPerformanceTotal(fetchEntityPerformancePayloadMock.entitiesTotalPerformances),
    //           new GetPeopleByRoleGroupAction(fetchEntityPerformancePayloadMock.entityType),
    //           new FetchResponsibilityEntityPerformanceSuccess(transformEntitiesPerformancesDTOResponseMock),
    //           new SetLeftMyPerformanceTableViewType(fetchEntityPerformancePayloadMock.viewType)
    //         ]);
    //
    //         done();
    //       }
    //     });
    //   });
    //
    //   it('should call getResponsibilitiesPerformanceTotal with the right arguments', () => {
    //
    //   });
    // });
  });

  describe('when a FetchResponsibilityEntityPerformance is received', () => {
    const fetchEntityPerformancePayloadMock: FetchResponsibilityEntitiesPerformancePayload = {
      entityType: EntityPeopleType['GENERAL MANAGER'],
      entities: [getEntityPeopleResponsibilitiesMock()],
      filter: performanceFilterStateMock,
      entitiesTotalPerformances: getMyPerformanceTableRowMock(1)[0],
      viewType: ViewType.people
    };

    describe('when MyPerformanceApiService returns successfully', () => {
      let myPerformanceApiService: MyPerformanceApiService;

      beforeEach(inject([ MyPerformanceApiService ],
        (_myPerformanceApiService: MyPerformanceApiService) => {
          myPerformanceApiService = _myPerformanceApiService;

          runner.queue(new FetchResponsibilityEntityPerformance(fetchEntityPerformancePayloadMock));
        }
      ));

      it('should dispatch appropriate actions', (done) => {
        const dispatchedActions: Action[] = [];

        responsibilitiesEffects.FetchResponsibilityEntityPerformance$().subscribe((dispatchedAction: Action) => {
          dispatchedActions.push(dispatchedAction);

          if (dispatchedActions.length === 4) {
            expect(dispatchedActions).toEqual([
              new SetTableRowPerformanceTotal(fetchEntityPerformancePayloadMock.entitiesTotalPerformances),
              new GetPeopleByRoleGroupAction(fetchEntityPerformancePayloadMock.entityType),
              new FetchResponsibilityEntityPerformanceSuccess(entitiesPerformancesMock),
              new SetLeftMyPerformanceTableViewType(fetchEntityPerformancePayloadMock.viewType)
            ]);

            done();
          }
        });
      });
    });

    describe('when MyPerformanceApiService returns an error', () => {
      let myPerformanceApiService: MyPerformanceApiService;

      beforeEach(inject([ MyPerformanceApiService ],
        (_myPerformanceApiService: MyPerformanceApiService) => {
          myPerformanceApiService = _myPerformanceApiService;

          runner.queue(new FetchResponsibilityEntityPerformance(fetchEntityPerformancePayloadMock));
        }
      ));

      it('should return a FetchResponsibilitiesFailureAction after catching an error', (done) => {
        spyOn(myPerformanceApiService, 'getResponsibilityPerformanceTotal').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.FetchResponsibilityEntityPerformance$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailureAction(error));
          done();
        });
      });
    });

    describe('when getResponsibilityPerformanceTotal returns successfully', () => {
      let myPerformanceApiService: MyPerformanceApiService;
      let performanceTransformerService: PerformanceTransformerService;
      let performanceTotalArrayMock: [EntitiesTotalPerformances];
      let getResponsibilityPerformanceTotalSpy: jasmine.Spy;
      let transformEntitiesPerformancesDTOResponseMock: any;

      fetchEntityPerformancePayloadMock.entities.push(getEntityPeopleResponsibilitiesMock());

      beforeEach(inject([ MyPerformanceApiService, PerformanceTransformerService ],
        (_myPerformanceApiService: MyPerformanceApiService, _performanceTransformerServiceMock: PerformanceTransformerService) => {
          myPerformanceApiService = _myPerformanceApiService;
          performanceTransformerService = _performanceTransformerServiceMock;

          runner.queue(new FetchResponsibilityEntityPerformance(fetchEntityPerformancePayloadMock));

          performanceTotalArrayMock = [
            getEntitiesTotalPerformancesMock(),
            getEntitiesTotalPerformancesMock()
          ];

          getResponsibilityPerformanceTotalSpy = spyOn(myPerformanceApiService, 'getResponsibilityPerformanceTotal').and.callFake(
            (entity: { type: string, name: string }, filter: MyPerformanceFilterState, positionId: string) => {
            const performancesIndex = fetchEntityPerformancePayloadMock.entities.findIndex(item => item.positionId === positionId);
            return Observable.of({
              id: positionId,
              name: entity.name,
              performanceTotal: performanceTotalArrayMock[performancesIndex]
            });
          });

          transformEntitiesPerformancesDTOResponseMock = chance.string();

          spyOn(performanceTransformerService, 'transformEntitiesPerformancesDTO').and.callFake(() => {
            return transformEntitiesPerformancesDTOResponseMock;
          });
        }
      ));

      it('should call the responsibility performanceTotal endpoint for each entity and return an array of performance data',
      (done: any) => {
        const dispatchedActions: Action[] = [];

        responsibilitiesEffects.FetchResponsibilityEntityPerformance$().subscribe((dispatchedAction: Action) => {
          dispatchedActions.push(dispatchedAction);

          if (dispatchedActions.length === 4) {
            expect(dispatchedActions).toEqual([
              new SetTableRowPerformanceTotal(fetchEntityPerformancePayloadMock.entitiesTotalPerformances),
              new GetPeopleByRoleGroupAction(fetchEntityPerformancePayloadMock.entityType),
              new FetchResponsibilityEntityPerformanceSuccess(transformEntitiesPerformancesDTOResponseMock),
              new SetLeftMyPerformanceTableViewType(fetchEntityPerformancePayloadMock.viewType)
            ]);

            done();
          }
        });
      });

      it('should call getResponsibilitiesPerformanceTotal with the right arguments',
      (done: any) => {
        responsibilitiesEffects.FetchResponsibilityEntityPerformance$().subscribe((dispatchedAction: Action) => {
          done();
        });

        expect(getResponsibilityPerformanceTotalSpy.calls.count()).toBe(fetchEntityPerformancePayloadMock.entities.length);
        expect(getResponsibilityPerformanceTotalSpy.calls.argsFor(0)).toEqual([
          fetchEntityPerformancePayloadMock.entities[0],
          fetchEntityPerformancePayloadMock.filter,
          fetchEntityPerformancePayloadMock.entities[0].positionId
        ]);
        expect(getResponsibilityPerformanceTotalSpy.calls.argsFor(1)).toEqual([
          fetchEntityPerformancePayloadMock.entities[1],
          fetchEntityPerformancePayloadMock.filter,
          fetchEntityPerformancePayloadMock.entities[1].positionId
        ]);
      });
    });
  });

  describe('when a fetch performance total or responsibilities action is dispatched', () => {
    let myPerformanceApiService: MyPerformanceApiService;

    beforeEach(inject([ MyPerformanceApiService ],
      (_myPerformanceApiService: MyPerformanceApiService) => {
        myPerformanceApiService = _myPerformanceApiService;
        runner.queue(new FetchPerformanceTotalAction({
          positionId: positionIdMock,
          filter: performanceFilterStateMock
        }));
      }
    ));

    it('should return a success action when the api service returns a response', (done) => {
      responsibilitiesEffects.fetchPerformanceTotal$().subscribe(result => {
        expect(result).toEqual(new FetchPerformanceTotalSuccessAction(performanceTotalMock));
        done();
      });
    });

    it('should return a fail action when the api service returns an error', (done) => {
      spyOn(myPerformanceApiService, 'getPerformanceTotal').and.returnValue(Observable.throw(error));

      responsibilitiesEffects.fetchPerformanceTotal$().subscribe(result => {
        expect(result).toEqual(new FetchPerformanceTotalFailureAction(error));
        done();
      });
    });

    it('should log the error payload when a FetchPerformanceTotalFailureAction is received', (done) => {
      spyOn(myPerformanceApiService, 'getPerformanceTotal').and.returnValue(Observable.throw(error));
      spyOn(console, 'error');

      responsibilitiesEffects.fetchPerformanceTotal$().subscribe(result => {
        expect(result).toEqual(new FetchPerformanceTotalFailureAction(error));
        runner.queue(new FetchPerformanceTotalFailureAction(error));
        done();
      });

      responsibilitiesEffects.fetchPerformanceTotalFailure$().subscribe((result) => {
        expect(result).toEqual(new FetchPerformanceTotalFailureAction(error));
        expect(console.error).toHaveBeenCalledWith('Failed fetching performance total data', result.payload);
        done();
      });
    });
  });
});
