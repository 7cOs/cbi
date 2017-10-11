import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getProductMetricMock } from '../../models/entity-product-metrics-dto.model.mock';
import * as ProductMetricsActions from '../actions/product-metrics.action';
import { ProductMetricsApiService } from '../../services/product-metrics-api.service';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { ProductMetricsAggregationType } from '../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsEffects } from './product-metrics.effect';
import { ProductMetricsTransformerService } from '../../services/product-metrics-transformer.service';
import { ProductMetrics } from '../../models/product-metrics.model';
import { SelectedEntityType } from '../../enums/selected-entity-type.enum';

const chance = new Chance();

describe('ProductMetrics Effects', () => {
  let positionIdMock: string;
  let contextPositionIdMock: string;
  let entityTypeCodeMock: string;
  let productMetricsMock: ProductMetrics;
  let performanceFilterStateMock: MyPerformanceFilterState;
  let productMetricsSuccessPayloadMock: ProductMetricsActions.FetchProductMetricsSuccessPayload;
  let err: Error;
  let productMetricsApiServiceMock: any;
  let productMetricsTransformerServiceMock: any;

  let runner: EffectsRunner;
  let productMetricsEffects: ProductMetricsEffects;

  let productMetricsApiService: ProductMetricsApiService;

  beforeEach(() => {
    positionIdMock = chance.string();
    contextPositionIdMock = chance.string();
    entityTypeCodeMock = chance.string();
    productMetricsMock = getProductMetricMock();
    performanceFilterStateMock = getMyPerformanceFilterMock();
    productMetricsSuccessPayloadMock = {
      positionId: positionIdMock,
      products: productMetricsMock
    };
    err = new Error(chance.string());
    productMetricsApiServiceMock = {
      getPositionProductMetrics() {
        return Observable.of({products: productMetricsMock});
      },
      getAccountProductMetrics() {
        return Observable.of({products: productMetricsMock});
      },
      getRoleGroupProductMetrics() {
        return Observable.of({products: productMetricsMock});
      }
    };

    productMetricsTransformerServiceMock = {
      transformProductMetrics(): ProductMetrics {
        return productMetricsMock;
      }
    };

    TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule
      ],
      providers: [
        ProductMetricsEffects,
        {
          provide: ProductMetricsApiService,
          useValue: productMetricsApiServiceMock
        },
        {
          provide: ProductMetricsTransformerService,
          useValue: productMetricsTransformerServiceMock
        }
      ]
    });
  });

  beforeEach(inject([ EffectsRunner, ProductMetricsEffects, ProductMetricsApiService ],
    (_runner: EffectsRunner,
      _compassWebEffects: ProductMetricsEffects,
      _productMetricsApiService: ProductMetricsApiService) => {
      runner = _runner;
      productMetricsEffects = _compassWebEffects;
      productMetricsApiService = _productMetricsApiService;
    }
  ));

  describe('when a FetchProductMetricsAction for a Position is received', () => {
    describe('when ProductMetricsApiService returns successfully', () => {
      beforeEach(() => {
        spyOn(productMetricsApiService, 'getPositionProductMetrics').and.callThrough();
        runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
          positionId: positionIdMock,
          filter: performanceFilterStateMock,
          selectedEntityType: SelectedEntityType.Position
        }));
      });

      it('should return a FetchProductMetricsSuccessAction', (done) => {
        productMetricsEffects.fetchProductMetrics$().subscribe(result => {
          expect(productMetricsApiService.getPositionProductMetrics).toHaveBeenCalledWith(
            positionIdMock, performanceFilterStateMock, ProductMetricsAggregationType.brand
          );
          expect(result).toEqual(new ProductMetricsActions.FetchProductMetricsSuccessAction(
            productMetricsSuccessPayloadMock));
          done();
        });
      });
    });

    describe('when ProductMetricsApiService returns an error', () => {
      beforeEach(() => {
        spyOn(productMetricsApiService, 'getPositionProductMetrics').and.returnValue(Observable.throw(err));
        runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
          positionId: positionIdMock,
          filter: performanceFilterStateMock,
          selectedEntityType: SelectedEntityType.Position
        }));
      });

      it('should return a FetchProductMetricsFailureAction after catching an error', (done) => {
        productMetricsEffects.fetchProductMetrics$().subscribe((result) => {
          expect(productMetricsApiService.getPositionProductMetrics).toHaveBeenCalledWith(
            positionIdMock, performanceFilterStateMock, ProductMetricsAggregationType.brand
          );
          expect(result).toEqual(new ProductMetricsActions.FetchProductMetricsFailureAction(err));
          done();
        });
      });
    });
  });

  describe('when a FetchProductMetricsAction for an Account is received', () => {
    describe('when ProductMetricsApiService returns successfully', () => {
      beforeEach(() => {
        spyOn(productMetricsApiService, 'getAccountProductMetrics').and.callThrough();
        runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
          positionId: positionIdMock,
          contextPositionId: contextPositionIdMock,
          filter: performanceFilterStateMock,
          selectedEntityType: SelectedEntityType.Account
        }));
      });

      it('should return a FetchProductMetricsSuccessAction', (done) => {
        productMetricsEffects.fetchProductMetrics$().subscribe(result => {
          expect(productMetricsApiService.getAccountProductMetrics).toHaveBeenCalledWith(
            positionIdMock, contextPositionIdMock, performanceFilterStateMock, ProductMetricsAggregationType.brand
          );
          expect(result).toEqual(new ProductMetricsActions.FetchProductMetricsSuccessAction(
            productMetricsSuccessPayloadMock));
          done();
        });
      });
    });

    describe('when ProductMetricsApiService returns an error', () => {
      beforeEach(() => {
        spyOn(productMetricsApiService, 'getAccountProductMetrics').and.returnValue(Observable.throw(err));
        runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
          positionId: positionIdMock,
          contextPositionId: contextPositionIdMock,
          filter: performanceFilterStateMock,
          selectedEntityType: SelectedEntityType.Account
        }));
      });

      it('should return a FetchProductMetricsFailureAction after catching an error', (done) => {
        productMetricsEffects.fetchProductMetrics$().subscribe((result) => {
          expect(productMetricsApiService.getAccountProductMetrics).toHaveBeenCalledWith(
            positionIdMock, contextPositionIdMock, performanceFilterStateMock, ProductMetricsAggregationType.brand
          );
          expect(result).toEqual(new ProductMetricsActions.FetchProductMetricsFailureAction(err));
          done();
        });
      });
    });
  });

  describe('when a FetchProductMetricsAction for an RoleGroup is received', () => {
    describe('when ProductMetricsApiService returns successfully', () => {
      beforeEach(() => {
        spyOn(productMetricsApiService, 'getRoleGroupProductMetrics').and.callThrough();
        runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
          positionId: positionIdMock,
          entityTypeCode: entityTypeCodeMock,
          filter: performanceFilterStateMock,
          selectedEntityType: SelectedEntityType.RoleGroup
        }));
      });

      it('should return a FetchProductMetricsSuccessAction', (done) => {
        productMetricsEffects.fetchProductMetrics$().subscribe(result => {
          expect(productMetricsApiService.getRoleGroupProductMetrics).toHaveBeenCalledWith(
            positionIdMock, entityTypeCodeMock, performanceFilterStateMock, ProductMetricsAggregationType.brand
          );
          expect(result).toEqual(new ProductMetricsActions.FetchProductMetricsSuccessAction(
            productMetricsSuccessPayloadMock));
          done();
        });
      });
    });

    describe('when ProductMetricsApiService returns an error', () => {
      beforeEach(() => {
        spyOn(productMetricsApiService, 'getRoleGroupProductMetrics').and.returnValue(Observable.throw(err));
        runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
          positionId: positionIdMock,
          entityTypeCode: entityTypeCodeMock,
          filter: performanceFilterStateMock,
          selectedEntityType: SelectedEntityType.RoleGroup
        }));
      });

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
