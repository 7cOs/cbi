// import { Action } from '@ngrx/store';
// import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
// import { Observable } from 'rxjs';
// import { TestBed, inject } from '@angular/core/testing';
// import * as Chance from 'chance';
//
// import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
// import { DistributionTypeValue } from '../../enums/distribution-type.enum';
// import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
// import { FetchResponsibilitiesAction,
//          FetchResponsibilitiesFailureAction,
//          FetchResponsibilitiesSuccessAction,
//          FetchResponsibilityEntityPerformance,
//          FetchResponsibilityEntityPerformanceSuccess,
//          FetchResponsibilityEntitiesPerformancePayload,
//          GetPeopleByRoleGroupAction,
//          SetTableRowPerformanceTotal,
//          FetchPerformanceTotalAction,
//          FetchPerformanceTotalSuccessAction,
//          FetchPerformanceTotalFailureAction } from '../actions/responsibilities.action';
// import { getEntityPeopleResponsibilitiesMock } from '../../models/entity-responsibilities.model.mock';
// import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
// import { getEntitiesTotalPerformancesMock,
// getEntitiesTotalPerformancesDTOMock } from '../../models/entities-total-performances.model.mock';
// import { getEntitiesPerformancesMock, getResponsibilityEntitiesPerformanceDTOMock } from '../../models/entities-performances.model.mock';
// import { getGroupedEntitiesMock } from '../../models/grouped-entities.model.mock';
// import { MetricTypeValue } from '../../enums/metric-type.enum';
// import { MyPerformanceApiService } from '../../services/my-performance-api.service';
// import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
// import { PerformanceTransformerService } from '../../services/performance-transformer.service';
// import { EntitiesTotalPerformances, EntitiesTotalPerformancesDTO } from '../../models/entities-total-performances.model';
// import { PremiseTypeValue } from '../../enums/premise-type.enum';
// import { ResponsibilitiesEffects } from './responsibilities.effect';
// import { EntitiesPerformances } from '../../models/entities-performances.model';
// import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';
// import { GroupedEntities } from '../../models/grouped-entities.model';
// import { SetLeftMyPerformanceTableViewType } from '../actions/view-types.action';
// import { ViewType } from '../../enums/view-type.enum';
//
// const chance = new Chance();
//
// describe('Responsibilities Effects', () => {
//   const positionIdMock = chance.string();
//   const groupedEntitiesMock: GroupedEntities = getGroupedEntitiesMock();
//   const responsibilityEntitiesPerformanceDTOMock = getResponsibilityEntitiesPerformanceDTOMock();
//   const responsibilityEntitiesPerformanceMock = getEntitiesPerformancesMock();
//   const performanceTotalMock: EntitiesTotalPerformances = getEntitiesTotalPerformancesMock();
//   const entitiesTotalPerformancesDTOMock: EntitiesTotalPerformancesDTO = getEntitiesTotalPerformancesDTOMock();
//   const error = new Error(chance.string());
//
//   const performanceFilterStateMock: MyPerformanceFilterState = {
//     metricType: MetricTypeValue.PointsOfDistribution,
//     dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
//     premiseType: PremiseTypeValue.On,
//     distributionType: DistributionTypeValue.simple
//   };
//   const responsibilitiesSuccessPayloadMock = {
//     positionId: positionIdMock,
//     groupedEntities: groupedEntitiesMock,
//     entitiesPerformances: responsibilityEntitiesPerformanceMock
//   };
//   const myPerformanceApiServiceMock = {
//     getResponsibilities() {
//       return Observable.of({positions: groupedEntitiesMock});
//     },
//     getResponsibilityPerformanceTotal() {
//       return Observable.of(responsibilityEntitiesPerformanceDTOMock);
//     },
//     getPerformanceTotal() {
//       return Observable.of(entitiesTotalPerformancesDTOMock);
//     }
//   };
//   const responsibilitiesTransformerServiceMock = {
//     groupPeopleByGroupedEntities(mockArgs: any): GroupedEntities {
//       return groupedEntitiesMock;
//     }
//   };
//   const performanceTransformerServiceMock = {
//     transformEntitiesTotalPerformancesDTO(mockArgs: any): EntitiesTotalPerformances {
//       return performanceTotalMock;
//     },
//     transformEntitiesPerformancesDTO(mockArgs: any): EntitiesPerformances[] {
//       return responsibilityEntitiesPerformanceMock;
//     }
//   };
//
//   let runner: EffectsRunner;
//   let responsibilitiesEffects: ResponsibilitiesEffects;
//
//   beforeEach(() => TestBed.configureTestingModule({
//     imports: [
//       EffectsTestingModule
//     ],
//     providers: [
//       ResponsibilitiesEffects,
//       {
//         provide: MyPerformanceApiService,
//         useValue: myPerformanceApiServiceMock
//       },
//       {
//         provide: ResponsibilitiesTransformerService,
//         useValue: responsibilitiesTransformerServiceMock
//       },
//       {
//         provide: PerformanceTransformerService,
//         useValue: performanceTransformerServiceMock
//       }
//     ]
//   }));
//
//   beforeEach(inject([ EffectsRunner, ResponsibilitiesEffects ],
//     (_runner: EffectsRunner, _compassWebEffects: ResponsibilitiesEffects) => {
//       runner = _runner;
//       responsibilitiesEffects = _compassWebEffects;
//     }
//   ));
//
//   describe('when a FetchResponsibilitiesAction is received', () => {
//
//     describe('when ResponsibilitiesApiService returns successfully', () => {
//       let myPerformanceApiService: MyPerformanceApiService;
//       beforeEach(inject([ MyPerformanceApiService ],
//         (_myPerformanceApiService: MyPerformanceApiService) => {
//           myPerformanceApiService = _myPerformanceApiService;
//
//           runner.queue(new FetchResponsibilitiesAction({
//             positionId: positionIdMock,
//             filter: performanceFilterStateMock
//           }));
//         }
//       ));
//
//       it('should return a FetchResponsibilitiesSuccessAction', (done) => {
//         responsibilitiesEffects.fetchResponsibilities$().pairwise().subscribe(([result1, result2]) => {
//           expect(result1).toEqual(new SetLeftMyPerformanceTableViewType(ViewType.roleGroups));
//           expect(result2).toEqual(new FetchResponsibilitiesSuccessAction(responsibilitiesSuccessPayloadMock));
//           done();
//         });
//       });
//     });
//
//     describe('when ResponsibilitiesApiService returns an error', () => {
//       let myPerformanceApiService: MyPerformanceApiService;
//
//       beforeEach(inject([ MyPerformanceApiService ],
//         (_myPerformanceApiService: MyPerformanceApiService) => {
//           myPerformanceApiService = _myPerformanceApiService;
//           runner.queue(new FetchResponsibilitiesAction({
//             positionId: positionIdMock,
//             filter: performanceFilterStateMock
//           }));
//         }
//       ));
//
//       it('should return a FetchResponsibilitiesFailureAction after catching an error', (done) => {
//         spyOn(myPerformanceApiService, 'getResponsibilities').and.returnValue(Observable.throw(error));
//         responsibilitiesEffects.fetchResponsibilities$().subscribe((result) => {
//           expect(result).toEqual(new FetchResponsibilitiesFailureAction(error));
//           done();
//         });
//       });
//     });
//
//     describe('when a FetchResponsibilitiesFailureAction is received', () => {
//
//       beforeEach(() => {
//         runner.queue(new FetchResponsibilitiesFailureAction(error));
//         spyOn(console, 'error');
//       });
//
//       it('should log the error payload', (done) => {
//         responsibilitiesEffects.fetchResponsibilitiesFailure$().subscribe(() => {
//           expect(console.error).toHaveBeenCalled();
//           done();
//         });
//       });
//     });
//
//     // fdescribe('getPerformanceTotalForGroupedEntities stage', () => { // TODO: rename
//     //   let myPerformanceApiService: MyPerformanceApiService;
//     //   let performanceTransformerService: PerformanceTransformerService;
//     //   let performanceTotalArrayMock: [EntitiesTotalPerformances];
//     //   let getResponsibilityPerformanceTotalSpy: jasmine.Spy;
//     //   let transformEntitiesPerformancesDTOResponseMock: any;
//     //
//     //   fetchEntityPerformancePayloadMock.entities.push(getEntityPeopleResponsibilitiesMock());
//     //
//     //   beforeEach(inject([ MyPerformanceApiService, PerformanceTransformerService ],
//     //     (_myPerformanceApiService: MyPerformanceApiService, _performanceTransformerServiceMock: PerformanceTransformerService) => {
//     //       myPerformanceApiService = _myPerformanceApiService;
//     //       performanceTransformerService = _performanceTransformerServiceMock;
//     //
//     //       runner.queue(new FetchResponsibilityEntityPerformance(fetchEntityPerformancePayloadMock));
//     //
//     //       performanceTotalArrayMock = [
//     //         getEntitiesTotalPerformancesMock(),
//     //         getEntitiesTotalPerformancesMock()
//     //       ];
//     //
//     //       getResponsibilityPerformanceTotalSpy = spyOn(myPerformanceApiService, 'getResponsibilityPerformanceTotal').and.callFake(
//     //         (entity: { type: string, name: string }, filter: MyPerformanceFilterState, positionId: string) => {
//     //         const performancesIndex = fetchEntityPerformancePayloadMock.entities.findIndex(item => item.positionId === positionId);
//     //         return Observable.of({
//     //           id: positionId,
//     //           name: entity.name,
//     //           performanceTotal: performanceTotalArrayMock[performancesIndex]
//     //         });
//     //       });
//     //
//     //       transformEntitiesPerformancesDTOResponseMock = chance.string();
//     //
//     //       spyOn(performanceTransformerService, 'transformEntitiesPerformancesDTO').and.callFake(() => {
//     //         return transformEntitiesPerformancesDTOResponseMock;
//     //       });
//     //     }
//     //   ));
//     //
//     //   it('should call the responsibility performanceTotal endpoint for each entity and return an array of performance data',
//     //   (done: any) => {
//     //     const dispatchedActions: Action[] = [];
//     //
//     //     responsibilitiesEffects.FetchResponsibilityEntityPerformance$().subscribe((dispatchedAction: Action) => {
//     //       dispatchedActions.push(dispatchedAction);
//     //
//     //       if (dispatchedActions.length === 4) {
//     //         expect(dispatchedActions).toEqual([
//     //           new SetTableRowPerformanceTotal(fetchEntityPerformancePayloadMock.entitiesTotalPerformances),
//     //           new GetPeopleByRoleGroupAction(fetchEntityPerformancePayloadMock.entityType),
//     //           new FetchResponsibilityEntityPerformanceSuccess(transformEntitiesPerformancesDTOResponseMock),
//     //           new SetLeftMyPerformanceTableViewType(fetchEntityPerformancePayloadMock.viewType)
//     //         ]);
//     //
//     //         done();
//     //       }
//     //     });
//     //   });
//     //
//     //   it('should call getResponsibilitiesPerformanceTotal with the right arguments', () => {
//     //
//     //   });
//     // });
//   });
//
//   describe('when a FetchResponsibilityEntityPerformance is received', () => {
//     const fetchEntityPerformancePayloadMock: FetchResponsibilityEntitiesPerformancePayload = {
//       entityType: EntityPeopleType['GENERAL MANAGER'],
//       entities: [getEntityPeopleResponsibilitiesMock()],
//       filter: performanceFilterStateMock,
//       entitiesTotalPerformances: getMyPerformanceTableRowMock(1)[0],
//       viewType: ViewType.people
//     };
//
//     describe('when MyPerformanceApiService returns successfully', () => {
//       let myPerformanceApiService: MyPerformanceApiService;
//
//       beforeEach(inject([ MyPerformanceApiService ],
//         (_myPerformanceApiService: MyPerformanceApiService) => {
//           myPerformanceApiService = _myPerformanceApiService;
//
//           runner.queue(new FetchResponsibilityEntityPerformance(fetchEntityPerformancePayloadMock));
//         }
//       ));
//
//       it('should dispatch appropriate actions', (done) => {
//         const dispatchedActions: Action[] = [];
//
//         responsibilitiesEffects.FetchResponsibilityEntityPerformance$().subscribe((dispatchedAction: Action) => {
//           dispatchedActions.push(dispatchedAction);
//
//           if (dispatchedActions.length === 4) {
//             expect(dispatchedActions).toEqual([
//               new SetTableRowPerformanceTotal(fetchEntityPerformancePayloadMock.entitiesTotalPerformances),
//               new GetPeopleByRoleGroupAction(fetchEntityPerformancePayloadMock.entityType),
//               new FetchResponsibilityEntityPerformanceSuccess(responsibilityEntitiesPerformanceMock),
//               new SetLeftMyPerformanceTableViewType(fetchEntityPerformancePayloadMock.viewType)
//             ]);
//
//             done();
//           }
//         });
//       });
//     });
//
//     describe('when MyPerformanceApiService returns an error', () => {
//       let myPerformanceApiService: MyPerformanceApiService;
//
//       beforeEach(inject([ MyPerformanceApiService ],
//         (_myPerformanceApiService: MyPerformanceApiService) => {
//           myPerformanceApiService = _myPerformanceApiService;
//
//           runner.queue(new FetchResponsibilityEntityPerformance(fetchEntityPerformancePayloadMock));
//         }
//       ));
//
//       it('should return a FetchResponsibilitiesFailureAction after catching an error', (done) => {
//         spyOn(myPerformanceApiService, 'getResponsibilityPerformanceTotal').and.returnValue(Observable.throw(error));
//         responsibilitiesEffects.FetchResponsibilityEntityPerformance$().subscribe((result) => {
//           expect(result).toEqual(new FetchResponsibilitiesFailureAction(error));
//           done();
//         });
//       });
//     });
//
//     describe('when getResponsibilityPerformanceTotal returns successfully', () => {
//       let myPerformanceApiService: MyPerformanceApiService;
//       let performanceTransformerService: PerformanceTransformerService;
//       let performanceTotalArrayMock: [EntitiesTotalPerformances];
//       let getResponsibilityPerformanceTotalSpy: jasmine.Spy;
//       let transformEntitiesPerformancesDTOResponseMock: any;
//
//       fetchEntityPerformancePayloadMock.entities.push(getEntityPeopleResponsibilitiesMock());
//
//       beforeEach(inject([ MyPerformanceApiService, PerformanceTransformerService ],
//         (_myPerformanceApiService: MyPerformanceApiService, _performanceTransformerServiceMock: PerformanceTransformerService) => {
//           myPerformanceApiService = _myPerformanceApiService;
//           performanceTransformerService = _performanceTransformerServiceMock;
//
//           runner.queue(new FetchResponsibilityEntityPerformance(fetchEntityPerformancePayloadMock));
//
//           performanceTotalArrayMock = [
//             getEntitiesTotalPerformancesMock(),
//             getEntitiesTotalPerformancesMock()
//           ];
//
//           getResponsibilityPerformanceTotalSpy = spyOn(myPerformanceApiService, 'getResponsibilityPerformanceTotal').and.callFake(
//             (entity: { type: string, name: string }, filter: MyPerformanceFilterState, positionId: string) => {
//             const performancesIndex = fetchEntityPerformancePayloadMock.entities.findIndex(item => item.positionId === positionId);
//             return Observable.of({
//               id: positionId,
//               name: entity.name,
//               performanceTotal: performanceTotalArrayMock[performancesIndex]
//             });
//           });
//
//           transformEntitiesPerformancesDTOResponseMock = chance.string();
//
//           spyOn(performanceTransformerService, 'transformEntitiesPerformancesDTO').and.callFake(() => {
//             return transformEntitiesPerformancesDTOResponseMock;
//           });
//         }
//       ));
//
//       it('should call the responsibility performanceTotal endpoint for each entity and return an array of performance data',
//       (done: any) => {
//         const dispatchedActions: Action[] = [];
//
//         responsibilitiesEffects.FetchResponsibilityEntityPerformance$().subscribe((dispatchedAction: Action) => {
//           dispatchedActions.push(dispatchedAction);
//
//           if (dispatchedActions.length === 4) {
//             expect(dispatchedActions).toEqual([
//               new SetTableRowPerformanceTotal(fetchEntityPerformancePayloadMock.entitiesTotalPerformances),
//               new GetPeopleByRoleGroupAction(fetchEntityPerformancePayloadMock.entityType),
//               new FetchResponsibilityEntityPerformanceSuccess(transformEntitiesPerformancesDTOResponseMock),
//               new SetLeftMyPerformanceTableViewType(fetchEntityPerformancePayloadMock.viewType)
//             ]);
//
//             done();
//           }
//         });
//       });
//
//       it('should call getResponsibilitiesPerformanceTotal with the right arguments',
//       (done: any) => {
//         responsibilitiesEffects.FetchResponsibilityEntityPerformance$().subscribe((dispatchedAction: Action) => {
//           done();
//         });
//
//         expect(getResponsibilityPerformanceTotalSpy.calls.count()).toBe(fetchEntityPerformancePayloadMock.entities.length);
//         expect(getResponsibilityPerformanceTotalSpy.calls.argsFor(0)).toEqual([
//           fetchEntityPerformancePayloadMock.entities[0],
//           fetchEntityPerformancePayloadMock.filter,
//           fetchEntityPerformancePayloadMock.entities[0].positionId
//         ]);
//         expect(getResponsibilityPerformanceTotalSpy.calls.argsFor(1)).toEqual([
//           fetchEntityPerformancePayloadMock.entities[1],
//           fetchEntityPerformancePayloadMock.filter,
//           fetchEntityPerformancePayloadMock.entities[1].positionId
//         ]);
//       });
//     });
//   });
//
//   describe('when a fetch performance total or responsibilities action is dispatched', () => {
//     let myPerformanceApiService: MyPerformanceApiService;
//
//     beforeEach(inject([ MyPerformanceApiService ],
//       (_myPerformanceApiService: MyPerformanceApiService) => {
//         myPerformanceApiService = _myPerformanceApiService;
//         runner.queue(new FetchPerformanceTotalAction({
//           positionId: positionIdMock,
//           filter: performanceFilterStateMock
//         }));
//       }
//     ));
//
//     it('should return a success action when the api service returns a response', (done) => {
//       responsibilitiesEffects.fetchPerformanceTotal$().subscribe(result => {
//         expect(result).toEqual(new FetchPerformanceTotalSuccessAction(performanceTotalMock));
//         done();
//       });
//     });
//
//     it('should return a fail action when the api service returns an error', (done) => {
//       spyOn(myPerformanceApiService, 'getPerformanceTotal').and.returnValue(Observable.throw(error));
//
//       responsibilitiesEffects.fetchPerformanceTotal$().subscribe(result => {
//         expect(result).toEqual(new FetchPerformanceTotalFailureAction(error));
//         done();
//       });
//     });
//
//     it('should log the error payload when a FetchPerformanceTotalFailureAction is received', (done) => {
//       spyOn(myPerformanceApiService, 'getPerformanceTotal').and.returnValue(Observable.throw(error));
//       spyOn(console, 'error');
//
//       responsibilitiesEffects.fetchPerformanceTotal$().subscribe(result => {
//         expect(result).toEqual(new FetchPerformanceTotalFailureAction(error));
//         runner.queue(new FetchPerformanceTotalFailureAction(error));
//         done();
//       });
//
//       responsibilitiesEffects.fetchPerformanceTotalFailure$().subscribe((result) => {
//         expect(result).toEqual(new FetchPerformanceTotalFailureAction(error));
//         expect(console.error).toHaveBeenCalledWith('Failed fetching performance total data', result.payload);
//         done();
//       });
//     });
//   });
// });
