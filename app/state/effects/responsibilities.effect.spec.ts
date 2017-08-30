import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { FetchResponsibilitiesAction,
         FetchResponsibilitiesFailureAction,
         FetchResponsibilitiesSuccessAction } from '../actions/responsibilities.action';
import { getResponsibilityEntitiesPerformanceMock,
         getResponsibilityEntitiesPerformanceDTOMock } from '../../models/entity-responsibilities.model.mock';
import { getRoleGroupsMock } from '../../models/role-groups.model.mock';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { PerformanceTotalTransformerService } from '../../services/performance-total-transformer.service';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { ResponsibilitiesEffects } from './responsibilities.effect';
import { ResponsibilityEntityPerformance } from '../../models/entity-responsibilities.model';
import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';
import { RoleGroups } from '../../models/role-groups.model';
import { SetLeftMyPerformanceTableViewType } from '../actions/view-types.action';
import { ViewType } from '../../enums/view-type.enum';

const chance = new Chance();

describe('Responsibilities Effects', () => {
  const positionIdMock = chance.natural();
  const roleGroupsMock: RoleGroups = getRoleGroupsMock();
  const responsibilityEntitiesPerformanceDTOMock = getResponsibilityEntitiesPerformanceDTOMock();
  const responsibilityEntitiesPerformanceMock = getResponsibilityEntitiesPerformanceMock();
  const err = new Error(chance.string());

  const performanceFilterStateMock: MyPerformanceFilterState = {
    metricType: MetricTypeValue.PointsOfDistribution,
    dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
    premiseType: PremiseTypeValue.On,
    distributionType: DistributionTypeValue.simple
  };
  const responsibilitiesSuccessPayloadMock = {
    positionId: positionIdMock,
    responsibilities: roleGroupsMock,
    performanceTotals: responsibilityEntitiesPerformanceMock
  };
  const myPerformanceApiServiceMock = {
    getResponsibilities() {
      return Observable.of({positions: roleGroupsMock});
    },
    getResponsibilitiesPerformanceTotals() {
      return Observable.of(responsibilityEntitiesPerformanceDTOMock);
    }
  };
  const responsibilitiesTransformerServiceMock = {
    groupPeopleByRoleGroups(mockArgs: any): RoleGroups {
      return roleGroupsMock;
    }
  };
  const performanceTotalTransformerServiceMock = {
    transformEntityPerformanceTotalDTO(mockArgs: any): ResponsibilityEntityPerformance[] {
      return responsibilityEntitiesPerformanceMock;
    }
  };

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
      },
      {
        provide: PerformanceTotalTransformerService,
        useValue: performanceTotalTransformerServiceMock
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

          runner.queue(new FetchResponsibilitiesAction({
            positionId: positionIdMock,
            filter: performanceFilterStateMock
          }));
        }
      ));

      it('should return a FetchResponsibilitiesSuccessAction', (done) => {
        responsibilitiesEffects.fetchResponsibilities$().pairwise().subscribe(([result1, result2]) => {
          expect(result1).toEqual(new SetLeftMyPerformanceTableViewType(ViewType.roleGroups));
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
        spyOn(myPerformanceApiService, 'getResponsibilities').and.returnValue(Observable.throw(err));
        responsibilitiesEffects.fetchResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailureAction(err));
          done();
        });
      });
    });
  });

  describe('when a FetchResponsibilitiesFailureAction is received', () => {

    beforeEach(() => {
      runner.queue(new FetchResponsibilitiesFailureAction(err));
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
