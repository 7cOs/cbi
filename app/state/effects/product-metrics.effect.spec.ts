import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { DateRangeTimePeriodValue } from '../../enums/date-range-time-period.enum';
import { DistributionTypeValue } from '../../enums/distribution-type.enum';
import * as ProductMetricsActions from '../actions/product-metrics.action';
import { MetricTypeValue } from '../../enums/metric-type.enum';
import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { ProductMetricsEffects } from './product-metrics.effect';
import { ProductMetricsTransformerService } from '../../services/product-metrics-transformer.service';
import { FetchProductMetricsSuccessPayload, ProductMetrics } from '../../models/product-metrics.model';
import { getProductMetricMock } from '../../models/entity-product-metrics-dto.model.mock';

const chance = new Chance();

describe('ProductMetrics Effects', () => {
  const positionIdMock = chance.string();
  const productsMock: ProductMetrics = getProductMetricMock();
  const performanceFilterStateMock: MyPerformanceFilterState = {
    metricType: MetricTypeValue.PointsOfDistribution,
    dateRangeCode: DateRangeTimePeriodValue.FYTDBDL,
    premiseType: PremiseTypeValue.On,
    distributionType: DistributionTypeValue.simple
  };
  const productMetricsSuccessPayloadMock: FetchProductMetricsSuccessPayload = {
    positionId: positionIdMock,
    products: productsMock
  };
  const err = new Error(chance.string());
  const myPerformanceApiServiceMock = {
    getPositionProductMetrics() {
      return Observable.of({products: productsMock});
    }
  };

  const productMetricsTransformerServiceMock = {
    transformProductMetrics(): ProductMetrics {
      return productsMock;
    }
  };

  let runner: EffectsRunner;
  let productMetricsEffects: ProductMetricsEffects;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      EffectsTestingModule
    ],
    providers: [
      ProductMetricsEffects,
      {
        provide: MyPerformanceApiService,
        useValue: myPerformanceApiServiceMock
      },
      {
        provide: ProductMetricsTransformerService,
        useValue: productMetricsTransformerServiceMock
      }
    ]
  }));

  beforeEach(inject([ EffectsRunner, ProductMetricsEffects ],
    (_runner: EffectsRunner, _compassWebEffects: ProductMetricsEffects) => {
      runner = _runner;
      productMetricsEffects = _compassWebEffects;
    }
  ));

  describe('when a FetchProductMetricsAction is received', () => {

    describe('when ProductMetricsApiService returns successfully', () => {
      let myPerformanceApiService: MyPerformanceApiService;
      beforeEach(inject([ MyPerformanceApiService ],
        (_myPerformanceApiService: MyPerformanceApiService) => {
          myPerformanceApiService = _myPerformanceApiService;

          runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
            positionId: positionIdMock,
            filter: performanceFilterStateMock
          }));
        }
      ));

      it('should return a FetchProductMetricsSuccessAction', (done) => {
        productMetricsEffects.fetchProductMetrics$().subscribe(result => {
          expect(result).toEqual(new ProductMetricsActions.FetchProductMetricsSuccessAction(
            productMetricsSuccessPayloadMock));
          done();
        });
      });
    });

    describe('when ProductMetricsApiService returns an error', () => {
      let myPerformanceApiService: MyPerformanceApiService;

      beforeEach(inject([ MyPerformanceApiService ],
        (_myPerformanceApiService: MyPerformanceApiService) => {
          myPerformanceApiService = _myPerformanceApiService;
          runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
            positionId: positionIdMock,
            filter: performanceFilterStateMock
          }));
        }
      ));

      it('should return a FetchProductMetricsFailureAction after catching an error', (done) => {
        spyOn(myPerformanceApiService, 'getPositionProductMetrics').and.returnValue(Observable.throw(err));
        productMetricsEffects.fetchProductMetrics$().subscribe((result) => {
          expect(result).toEqual(new ProductMetricsActions.FetchProductMetricsFailureAction(err));
          done();
        });
      });
    });
  });

  describe('when a failed FetchProductMetricsFailureAction is received', () => {

    beforeEach(() => {
      runner.queue(new ProductMetricsActions.FetchProductMetricsFailureAction(err));
      spyOn(console, 'error');
    });

    it('should log the error payload', (done) => {
      productMetricsEffects.fetchProdcutMetricsFailure$().subscribe(() => {
        expect(console.error).toHaveBeenCalled();
        done();
      });
    });
  });
});
