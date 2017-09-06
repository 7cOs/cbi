import { Action } from '@ngrx/store';
import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
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
import { getMyPerformanceTableRowMock } from '../../models/my-performance-table-row.model.mock';
import { getPerformanceTotalMock, getPerformanceTotalDTOMock } from '../../models/performance-total.model.mock';
import { getResponsibilityEntitiesPerformanceMock,
         getResponsibilityEntitiesPerformanceDTOMock } from '../../models/entity-responsibilities.model.mock';
import { getRoleGroupsMock } from '../../models/role-groups.model.mock';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { PerformanceTotalTransformerService } from '../../services/performance-total-transformer.service';
import { PerformanceTotal, PerformanceTotalDTO } from '../../models/performance-total.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { ResponsibilitiesEffects } from './responsibilities.effect';
import { ResponsibilityEntityPerformance } from '../../models/entity-responsibilities.model';
import { ResponsibilitiesTransformerService } from '../../services/responsibilities-transformer.service';
import { RoleGroups } from '../../models/role-groups.model';
import { SetLeftMyPerformanceTableViewType } from '../actions/view-types.action';
import { ViewType } from '../../enums/view-type.enum';

const chance = new Chance();

describe('Responsibilities Effects', () => {
  const positionIdMock = chance.string();
  const roleGroupsMock: RoleGroups = getRoleGroupsMock();
  const responsibilityEntitiesPerformanceDTOMock = getResponsibilityEntitiesPerformanceDTOMock();
  const responsibilityEntitiesPerformanceMock = getResponsibilityEntitiesPerformanceMock();
  const performanceTotalMock: PerformanceTotal = getPerformanceTotalMock();
  const performanceTotalDTOMock: PerformanceTotalDTO = getPerformanceTotalDTOMock();
  const error = new Error(chance.string());

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
    },
    getPerformanceTotal() {
      return Observable.of(performanceTotalDTOMock);
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
    },
    transformPerformanceTotalDTO(mockArgs: any): PerformanceTotal {
      return performanceTotalMock;
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
        spyOn(myPerformanceApiService, 'getResponsibilities').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.fetchResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailureAction(error));
          done();
        });
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

  describe('when a FetchResponsibilityEntityPerformance is received', () => {
    const fetchEntityPerformancePayloadMock: FetchResponsibilityEntitiesPerformancePayload = {
      entityType: EntityPeopleType['GENERAL MANAGER'],
      entities: [getEntityPeopleResponsibilitiesMock()],
      filter: performanceFilterStateMock,
      performanceTotal: getMyPerformanceTableRowMock(1)[0],
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
              new SetTableRowPerformanceTotal(fetchEntityPerformancePayloadMock.performanceTotal),
              new GetPeopleByRoleGroupAction(fetchEntityPerformancePayloadMock.entityType),
              new FetchResponsibilityEntityPerformanceSuccess(responsibilityEntitiesPerformanceMock),
              new SetLeftMyPerformanceTableViewType(fetchEntityPerformancePayloadMock.viewType)
            ]);
          }
          done();
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
        spyOn(myPerformanceApiService, 'getResponsibilitiesPerformanceTotals').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.FetchResponsibilityEntityPerformance$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailureAction(error));
          done();
        });
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
