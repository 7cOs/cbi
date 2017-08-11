// import * as Chance from 'chance';
// import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
// import { Observable } from 'rxjs';
// import { TestBed, inject } from '@angular/core/testing';

// import { FetchResponsibilitiesAction,
//          FetchResponsibilitiesFailureAction,
//          FetchResponsibilitiesPerformanceTotalsSuccess,
//          FetchResponsibilitiesSuccessAction } from '../actions/responsibilities.action';
// import { getRoleGroupsMock, getRoleGroupPerformanceTotalsMock } from '../../models/role-groups.model.mock';
// import { MyPerformanceApiService } from '../../services/my-performance-api.service';
// import { ResponsibilitiesEffects } from './responsibilities.effect';
// import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';
// import { RoleGroups } from '../../models/role-groups.model';
// import { SetLeftMyPerformanceTableViewType } from '../actions/view-types.action';
// import { ViewType } from '../../enums/view-type.enum';

// const chance = new Chance();

// describe('Responsibilities Effects', () => {
//   const roleGroupsMock: RoleGroups = getRoleGroupsMock();
//   const positionIdMock = chance.natural();
//   const responsibilitiesResponseMock = {
//     positionId: positionIdMock,
//     responsibilities: roleGroupsMock
//   };
//   const mockRoleGroupPerformanceTotals = getRoleGroupPerformanceTotalsMock();
//   const err = new Error(chance.string());

//   let runner: EffectsRunner;
//   let responsibilitiesEffects: ResponsibilitiesEffects;
//   let myPerformanceApiServiceMock = {
//     getResponsibilities() {
//       return Observable.of(responsibilitiesResponseMock);
//     },
//     getResponsibilitiesPerformanceTotals() {
//       return Observable.of({positions: roleGroupsMock});
//     }
//   };
//   let responsibilitiesTransformerServiceMock = {
//     groupPeopleByRoleGroups(mockArgs: any): RoleGroups {
//       return roleGroupsMock;
//     }
//   };

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
//       }
//     ]
//   }));

//   beforeEach(inject([ EffectsRunner, ResponsibilitiesEffects ],
//     (_runner: EffectsRunner, _compassWebEffects: ResponsibilitiesEffects) => {
//       runner = _runner;
//       responsibilitiesEffects = _compassWebEffects;
//     }
//   ));

//   describe('when a FetchResponsibilitiesAction is received', () => {

//     describe('when ResponsibilitiesApiService returns successfully', () => {
//       let myPerformanceApiService: MyPerformanceApiService;
//       beforeEach(inject([ MyPerformanceApiService ],
//         (_myPerformanceApiService: MyPerformanceApiService) => {
//           myPerformanceApiService = _myPerformanceApiService;

//           runner.queue(new FetchResponsibilitiesAction(positionIdMock));
//         }
//       ));

//       it('should return a FetchResponsibilitiesSuccessAction', (done) => {
//         responsibilitiesEffects.fetchResponsibilities$().pairwise().subscribe(([result1, result2]) => {
//           expect(result1).toEqual(new SetLeftMyPerformanceTableViewType(ViewType.roleGroups));
//           expect(result2).toEqual(new FetchResponsibilitiesSuccessAction(roleGroupsMock));
//           done();
//         });
//       });
//     });

//     describe('when ResponsibilitiesApiService returns an error', () => {
//       let myPerformanceApiService: MyPerformanceApiService;

//       beforeEach(inject([ MyPerformanceApiService ],
//         (_myPerformanceApiService: MyPerformanceApiService) => {
//           myPerformanceApiService = _myPerformanceApiService;
//           runner.queue(new FetchResponsibilitiesAction(1));
//         }
//       ));

//       it('should return a FetchResponsibilitiesFailureAction after catching an error', (done) => {
//         spyOn(myPerformanceApiService, 'getResponsibilities').and.returnValue(Observable.throw(err));
//         responsibilitiesEffects.fetchResponsibilities$().subscribe((result) => {
//           expect(result).toEqual(new FetchResponsibilitiesFailureAction(err));
//           done();
//         });
//       });
//     });
//   });

//   describe('when a FetchResponsibilitiesFailureAction is received', () => {

//     beforeEach(() => {
//       runner.queue(new FetchResponsibilitiesFailureAction(err));
//       spyOn(console, 'error');
//     });

//     it('should log the error payload', (done) => {
//       responsibilitiesEffects.fetchResponsibilitiesFailure$().subscribe(() => {
//         expect(console.error).toHaveBeenCalled();
//         done();
//       });
//     });
//   });

//   describe('when a FetchResponsibilitiesSuccessAction is received', () => {

//     describe('when getResponsibilitiesPerformanceTotals returns successfully', () => {
//       let myPerformanceApiService: MyPerformanceApiService;

//       beforeEach(inject([ MyPerformanceApiService ],
//         (_myPerformanceApiService: MyPerformanceApiService) => {
//           myPerformanceApiService = _myPerformanceApiService;
//           runner.queue(new FetchResponsibilitiesSuccessAction(responsibilitiesResponseMock));
//         }
//       ));

//       it('should return a FetchResponsibilitiesPerformanceTotalsSuccess action', (done) => {
//         responsibilitiesEffects.fetchResponsibilitiesPerformanceTotals$().subscribe(result => {
//           expect(result).toEqual(new FetchResponsibilitiesPerformanceTotalsSuccess(mockRoleGroupPerformanceTotals));
//           done();
//         });
//       });
//     });

//     describe('when getResponsibilitiesPerformanceTotals returns an error', () => {
//       let myPerformanceApiService: MyPerformanceApiService;

//       beforeEach(inject([ MyPerformanceApiService ],
//         (_myPerformanceApiService: MyPerformanceApiService) => {
//           myPerformanceApiService = _myPerformanceApiService;
//           runner.queue(new FetchResponsibilitiesSuccessAction(responsibilitiesResponseMock));
//         }
//       ));

//       it('should return a FetchVersionFailureAction after catching an error', (done) => {
//         spyOn(myPerformanceApiService, 'getResponsibilitiesPerformanceTotals').and.returnValue(Observable.throw(err));
//         responsibilitiesEffects.fetchResponsibilitiesPerformanceTotals$().subscribe((result) => {
//           expect(result).toEqual(new FetchResponsibilitiesFailureAction(err));
//           done();
//         });
//       });
//     });
//   });
// });
