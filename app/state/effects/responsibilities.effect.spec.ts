import * as Chance from 'chance';
import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';

import { FetchResponsibilitiesAction,
         FetchResponsibilitiesFailureAction,
         FetchResponsibilitiesSuccessAction } from '../actions/responsibilities.action';
import { getMockRoleGroups } from '../../models/role-groups.model.mock';
import { getPerformanceTotalMock } from '../../models/performance-total.model.mock';
import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { PerformanceTotal } from '../../models/performance-total.model';
import { FetchPerformanceTotalSuccessAction } from '../actions/performance-total.action';
import { ResponsibilitiesEffects } from './responsibilities.effect';
import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';
import { RoleGroups } from '../../models/role-groups.model';

let chance = new Chance();

fdescribe('Responsibilities Effects', () => {
  const roleGroupsMock: RoleGroups = getMockRoleGroups();
  const performanceTotalMock: PerformanceTotal = getPerformanceTotalMock();
  const myPerformanceApiServiceMock = {
    getResponsibilities() {
      return Observable.of(roleGroupsMock);
    },
    getPerformanceTotal() {
      return Observable.of(performanceTotalMock);
    }
  };
  const responsibilitiesTransformerServiceMock = {
    groupPeopleByRoleGroups(mockArgs: any): RoleGroups {
      return roleGroupsMock;
    }
  };

  const err = new Error(chance.string());

  let runner: EffectsRunner;
  let responsibilitiesEffects: ResponsibilitiesEffects;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      ResponsibilitiesEffects,
      {
        provide: MyPerformanceApiService,
        useValue: myPerformanceApiServiceMock
      },
      {
        provide: ResponsibilitiesTransformerService,
        useValue: responsibilitiesTransformerServiceMock
      }
    ]
  }));

  beforeEach(inject([ EffectsRunner, ResponsibilitiesEffects ],
    (_runner: EffectsRunner, _compassWebEffects: ResponsibilitiesEffects) => {
      runner = _runner;
      responsibilitiesEffects = _compassWebEffects;
    }
  ));

  describe('when a FetchResponsibilitiesAction is received', () => {

    describe('when ResponsibilitiesApiService returns successfully', () => {

      let myPerformanceApiService: MyPerformanceApiService;
      beforeEach(inject([ MyPerformanceApiService ],
        (_myPerformanceApiService: MyPerformanceApiService) => {
          myPerformanceApiService = _myPerformanceApiService;

          runner.queue(new FetchResponsibilitiesAction(1));
        }
      ));

      it('should return a FetchResponsibilitiesSuccessAction', () => {
        const expectedSuccessResult = [
          new FetchResponsibilitiesSuccessAction(roleGroupsMock),
          new FetchPerformanceTotalSuccessAction(performanceTotalMock)
        ];
        const successActions: Array<any|PerformanceTotal> = [];

        responsibilitiesEffects.fetchResponsibilities$().take(2).subscribe(
          result => successActions.push(result),
          () => {
            expect(successActions.length).toBe(2);
            expect(successActions).toEqual(expectedSuccessResult);
          }
        );
      });
    });

    describe('when ResponsibilitiesApiService returns an error', () => {
      let myPerformanceApiService: MyPerformanceApiService;

      beforeEach(inject([ MyPerformanceApiService ],
        (_myPerformanceApiService: MyPerformanceApiService) => {
          myPerformanceApiService = _myPerformanceApiService;
          runner.queue(new FetchResponsibilitiesAction(1));
        }
      ));

      it('should return a FetchVersionFailureAction after catching an error', (done) => {
        spyOn(myPerformanceApiService, 'getResponsibilities').and.returnValue(Observable.throw(err));
        responsibilitiesEffects.fetchResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailureAction(err));
          done();
        });
      });
    });
  });

  describe('when a FetchVersionFailureAction is received', () => {

    beforeEach(() => {
      runner.queue(new FetchResponsibilitiesFailureAction(err));
      spyOn(console, 'error');
    });

    // console logging isn't important, but it will be important to test real error handling if added later
    it('should log the error payload', (done) => {
      responsibilitiesEffects.fetchVersionFailure$().subscribe(() => {
        expect(console.error).toHaveBeenCalled();
        done();
      });
    });
  });
});
