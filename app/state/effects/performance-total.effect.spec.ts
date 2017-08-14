import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import { getPerformanceTotalMock } from '../../models/performance-total.model.mock';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { PerformanceTotal } from '../../models/performance-total.model';
import { PerformanceTotalEffects } from './performance-total.effect';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import * as PerformanceTotalActions from '../actions/performance-total.action';

const chance = new Chance();

describe('Performance Total Effects', () => {
  const positionIdMock = chance.natural();
  const performanceFilterStateMock: MyPerformanceFilterState = {
    metricType: MetricTypeValue.PointsOfDistribution,
    dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
    premiseType: PremiseTypeValue.On,
    distributionType: DistributionTypeValue.simple
  };
  const performanceTotalMock: PerformanceTotal = getPerformanceTotalMock();
  const error = new Error(chance.string());
  const myPerformanceApiServiceMock = {
    getPerformanceTotal() {
      return Observable.of(performanceTotalMock);
    }
  };

  let runner: EffectsRunner;
  let performanceTotalEffects: PerformanceTotalEffects;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      PerformanceTotalEffects,
      {
        provide: MyPerformanceApiService,
        useValue: myPerformanceApiServiceMock
      }
    ]
  }));

  beforeEach(inject([ EffectsRunner, PerformanceTotalEffects ],
    (_runner: EffectsRunner, _compassWebEffects: PerformanceTotalEffects) => {
      runner = _runner;
      performanceTotalEffects = _compassWebEffects;
    }
  ));

  describe('when a fetch performance total or responsibilities action is dispatched', () => {
    let myPerformanceApiService: MyPerformanceApiService;

    beforeEach(inject([ MyPerformanceApiService ],
      (_myPerformanceApiService: MyPerformanceApiService) => {
        myPerformanceApiService = _myPerformanceApiService;
        runner.queue(new PerformanceTotalActions.FetchPerformanceTotalAction({
          positionId: positionIdMock,
          filter: performanceFilterStateMock
        }));
      }
    ));

    it('should return a success action when the api service returns a response', (done) => {
      performanceTotalEffects.fetchPerformanceTotal$().subscribe(result => {
        expect(result).toEqual(new PerformanceTotalActions.FetchPerformanceTotalSuccessAction(performanceTotalMock));
        done();
      });
    });

    it('should return a fail action when the api service returns an error', (done) => {
      spyOn(myPerformanceApiService, 'getPerformanceTotal').and.returnValue(Observable.throw(error));

      performanceTotalEffects.fetchPerformanceTotal$().subscribe(result => {
        expect(result).toEqual(new PerformanceTotalActions.FetchPerformanceTotalFailureAction(error));
        done();
      });
    });

    it('should log the error payload', (done) => {
      runner.queue(new PerformanceTotalActions.FetchPerformanceTotalFailureAction(error));
      spyOn(console, 'error');

      performanceTotalEffects.fetchPerformanceTotalFailure$().subscribe(() => {
        expect(console.error).toHaveBeenCalled();
        done();
      });
    });
  });
});
