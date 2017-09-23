import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getProductMetricMock } from '../../models/entity-product-metrics-dto.model.mock';
import * as ProductMetricsActions from '../actions/product-metrics.action';
import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { ProductMetricsEffects } from './product-metrics.effect';
import { ProductMetricsTransformerService } from '../../services/product-metrics-transformer.service';
import { ProductMetrics, FetchProductMetricsSuccessPayload } from '../../models/product-metrics.model';
import { SelectedEntityType } from '../../enums/selected-entity-type.enum';

const chance = new Chance();

describe('ProductMetrics Effects', () => {
  const positionIdMock = chance.string();
  const contextPositionIdMock = chance.string();
  const productsMock: ProductMetrics = getProductMetricMock();
  const performanceFilterStateMock: MyPerformanceFilterState = getMyPerformanceFilterMock();
  const productMetricsSuccessPayloadMock: FetchProductMetricsSuccessPayload = {
    positionId: positionIdMock,
    products: productsMock
  };
  const err = new Error(chance.string());
  const myPerformanceApiServiceMock = {
    getPositionProductMetrics() {
      return Observable.of({products: productsMock});
    },
    getAccountProductMetrics() {
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

  describe('when a FetchProductMetricsAction for a Position is received', () => {

    describe('when ProductMetricsApiService returns successfully', () => {
      let myPerformanceApiService: MyPerformanceApiService;

      beforeEach(inject([ MyPerformanceApiService ],
        (_myPerformanceApiService: MyPerformanceApiService) => {
          myPerformanceApiService = _myPerformanceApiService;

          runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
            positionId: positionIdMock,
            filter: performanceFilterStateMock,
            selectedEntityType: SelectedEntityType.Position
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
          spyOn(myPerformanceApiService, 'getPositionProductMetrics').and.returnValue(Observable.throw(err));

          runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
            positionId: positionIdMock,
            filter: performanceFilterStateMock,
            selectedEntityType: SelectedEntityType.Position
          }));
        }
      ));

      it('should return a FetchProductMetricsFailureAction after catching an error', (done) => {
        productMetricsEffects.fetchProductMetrics$().subscribe((result) => {
          expect(result).toEqual(new ProductMetricsActions.FetchProductMetricsFailureAction(err));
          done();
        });
      });
    });
  });

  describe('when a FetchProductMetricsAction for an Account is received', () => {

    describe('when ProductMetricsApiService returns successfully', () => {
      let myPerformanceApiService: MyPerformanceApiService;

      beforeEach(inject([ MyPerformanceApiService ],
        (_myPerformanceApiService: MyPerformanceApiService) => {
          myPerformanceApiService = _myPerformanceApiService;

          runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
            positionId: positionIdMock,
            contextPositionId: contextPositionIdMock,
            filter: performanceFilterStateMock,
            selectedEntityType: SelectedEntityType.Account
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
          spyOn(myPerformanceApiService, 'getAccountProductMetrics').and.returnValue(Observable.throw(err));

          runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
            positionId: positionIdMock,
            filter: performanceFilterStateMock,
            selectedEntityType: SelectedEntityType.Account
          }));
        }
      ));

      it('should return a FetchProductMetricsFailureAction after catching an error', (done) => {
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
