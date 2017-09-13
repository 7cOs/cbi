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
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
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

  describe('when a FetchResponsibilitiesAction is received', () => {
    beforeEach(inject([],
      () => {
        runner.queue(new FetchResponsibilitiesAction({
          positionId: positionIdMock,
          filter: performanceFilterStateMock
        }));
      }
    ));

    describe('when everything returns successfully', () => {
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

      it('should call getResponsibilities with the right arguments', (done) => {
        const getResponsibilitiesSpy = spyOn(responsibilitiesService, 'getResponsibilities').and.callThrough();

        responsibilitiesEffects.fetchResponsibilities$().subscribe(() => {
          done();
        });

        expect(getResponsibilitiesSpy.calls.count()).toBe(1);
        expect(getResponsibilitiesSpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock);
      });

      it('should call getPerformanceTotalForGroupedEntities with the right arguments', (done) => {
        const getPerformanceSpy = spyOn(responsibilitiesService, 'getPerformanceTotalForGroupedEntities').and.callThrough();

        responsibilitiesEffects.fetchResponsibilities$().subscribe(() => {
          done();
        });

        expect(getPerformanceSpy.calls.count()).toBe(1);
        expect(getPerformanceSpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock);
      });

      it('should call getAccountsDistributors with the right arguments', (done) => {
        const getAccountsDistributorsSpy = spyOn(responsibilitiesService, 'getAccountsDistributors').and.callThrough();

        responsibilitiesEffects.fetchResponsibilities$().subscribe(() => {
          done();
        });

        expect(getAccountsDistributorsSpy.calls.count()).toBe(1);
        expect(getAccountsDistributorsSpy.calls.argsFor(0)[0]).toEqual(responsibilitiesDataMock);
      });
    });

    describe('when getResponsibilities returns an error', () => {
      it('should return a FetchResponsibilitiesFailureAction after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getResponsibilities').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.fetchResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailureAction(error));
          done();
        });
      });
    });

    describe('when getPerformanceTotalForGroupedEntities returns an error', () => {
      it('should return a FetchResponsibilitiesFailureAction after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getPerformanceTotalForGroupedEntities').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.fetchResponsibilities$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailureAction(error));
          done();
        });
      });
    });

    describe('when getAccountsDistributors returns an error', () => {
      it('should return a FetchResponsibilitiesFailureAction after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getAccountsDistributors').and.returnValue(Observable.throw(error));
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
  });

  describe('when a FetchResponsibilityEntityPerformance is received', () => {
    const fetchEntityPerformancePayloadMock: FetchResponsibilityEntitiesPerformancePayload = {
      entityType: EntityPeopleType['GENERAL MANAGER'],
      entities: [getEntityPeopleResponsibilitiesMock()],
      filter: performanceFilterStateMock,
      entitiesTotalPerformances: getMyPerformanceTableRowMock(1)[0],
      viewType: ViewType.people
    };

    beforeEach(inject([], () => {
        runner.queue(new FetchResponsibilityEntityPerformance(fetchEntityPerformancePayloadMock));
      }
    ));

    it('should call getResponsibilitiesPerformanceTotals with the right arguments', (done) => {
      const getResponsibilitiesSpy = spyOn(responsibilitiesService, 'getResponsibilitiesPerformanceTotals').and.callThrough();

      responsibilitiesEffects.FetchResponsibilityEntityPerformance$().subscribe(() => {
        done();
      });

      expect(getResponsibilitiesSpy.calls.count()).toBe(1);
      expect(getResponsibilitiesSpy.calls.argsFor(0)).toEqual([
        fetchEntityPerformancePayloadMock.entities,
        fetchEntityPerformancePayloadMock.filter
      ]);
    });

    describe('when getResponsibilitiesPerformanceTotals returns successfully', () => {
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

    describe('when getResponsibilitiesPerformanceTotals returns an error', () => {
      it('should return a FetchResponsibilitiesFailureAction after catching an error', (done) => {
        spyOn(responsibilitiesService, 'getResponsibilitiesPerformanceTotals').and.returnValue(Observable.throw(error));
        responsibilitiesEffects.FetchResponsibilityEntityPerformance$().subscribe((result) => {
          expect(result).toEqual(new FetchResponsibilitiesFailureAction(error));
          done();
        });
      });
    });
  });

  describe('when a fetch performance total or responsibilities action is dispatched', () => {
    beforeEach(inject([], () => {
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

    it('should call getPerformanceTotal with the right arguments', (done) => {
      const getResponsibilitiesSpy = spyOn(responsibilitiesService, 'getPerformanceTotal').and.callThrough();

      responsibilitiesEffects.fetchPerformanceTotal$().subscribe(() => {
        done();
      });

      expect(getResponsibilitiesSpy.calls.count()).toBe(1);
      expect(getResponsibilitiesSpy.calls.argsFor(0)).toEqual([
        positionIdMock,
        performanceFilterStateMock
      ]);
    });

    it('should return a fail action when the api service returns an error', (done) => {
      spyOn(responsibilitiesService, 'getPerformanceTotal').and.returnValue(Observable.throw(error));

      responsibilitiesEffects.fetchPerformanceTotal$().subscribe(result => {
        expect(result).toEqual(new FetchPerformanceTotalFailureAction(error));
        done();
      });
    });

    it('should log the error payload when a FetchPerformanceTotalFailureAction is received', (done) => {
      spyOn(responsibilitiesService, 'getPerformanceTotal').and.returnValue(Observable.throw(error));
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
