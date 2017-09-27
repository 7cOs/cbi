import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getProductMetricMock } from '../../models/entity-product-metrics-dto.model.mock';
import * as ProductMetricsActions from '../actions/product-metrics.action';
import { MyPerformanceApiService } from '../../services/my-performance-api.service';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { ProductMetricsAggregationType } from '../../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsEffects } from './product-metrics.effect';
import { ProductMetricsTransformerService } from '../../services/product-metrics-transformer.service';
import { ProductMetrics, FetchProductMetricsSuccessPayload } from '../../models/product-metrics.model';
import { SelectedEntityType } from '../../enums/selected-entity-type.enum';

const chance = new Chance();

describe('ProductMetrics Effects', () => {
  let positionIdMock: string;
  let contextPositionIdMock: string;
  let entityTypeCodeMock: string;
  let productMetricsMock: ProductMetrics;
  let performanceFilterStateMock: MyPerformanceFilterState;
  let productMetricsSuccessPayloadMock: FetchProductMetricsSuccessPayload;
  let err: Error;
  let myPerformanceApiServiceMock: any;
  let productMetricsTransformerServiceMock: any;

  let runner: EffectsRunner;
  let productMetricsEffects: ProductMetricsEffects;

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
    myPerformanceApiServiceMock = {
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
          provide: MyPerformanceApiService,
          useValue: myPerformanceApiServiceMock
        },
        {
          provide: ProductMetricsTransformerService,
          useValue: productMetricsTransformerServiceMock
        }
      ]
    });
  });

  beforeEach(inject([ EffectsRunner, ProductMetricsEffects ],
    (_runner: EffectsRunner, _compassWebEffects: ProductMetricsEffects) => {
      runner = _runner;
      productMetricsEffects = _compassWebEffects;
    }
  ));

  describe('when a FetchProductMetricsAction for a Position is received', () => {
    let myPerformanceApiService: MyPerformanceApiService;

    beforeEach(inject([ MyPerformanceApiService ],
      (_myPerformanceApiService: MyPerformanceApiService) => {
        myPerformanceApiService = _myPerformanceApiService;
      }
    ));

    describe('when ProductMetricsApiService returns successfully', () => {
      beforeEach(() => {
        spyOn(myPerformanceApiService, 'getPositionProductMetrics').and.callThrough();
        runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
          positionId: positionIdMock,
          filter: performanceFilterStateMock,
          selectedEntityType: SelectedEntityType.Position
        }));
      });

      it('should return a FetchProductMetricsSuccessAction', (done) => {
        productMetricsEffects.fetchProductMetrics$().subscribe(result => {
          expect(myPerformanceApiService.getPositionProductMetrics).toHaveBeenCalledWith(
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
        spyOn(myPerformanceApiService, 'getPositionProductMetrics').and.returnValue(Observable.throw(err));
        runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
          positionId: positionIdMock,
          filter: performanceFilterStateMock,
          selectedEntityType: SelectedEntityType.Position
        }));
      });

      it('should return a FetchProductMetricsFailureAction after catching an error', (done) => {
        productMetricsEffects.fetchProductMetrics$().subscribe((result) => {
          expect(myPerformanceApiService.getPositionProductMetrics).toHaveBeenCalledWith(
            positionIdMock, performanceFilterStateMock, ProductMetricsAggregationType.brand
          );
          expect(result).toEqual(new ProductMetricsActions.FetchProductMetricsFailureAction(err));
          done();
        });
      });
    });
  });

  describe('when a FetchProductMetricsAction for an Account is received', () => {
    let myPerformanceApiService: MyPerformanceApiService;

    beforeEach(inject([ MyPerformanceApiService ],
      (_myPerformanceApiService: MyPerformanceApiService) => {
        myPerformanceApiService = _myPerformanceApiService;
      }
    ));

    describe('when ProductMetricsApiService returns successfully', () => {
      beforeEach(() => {
        spyOn(myPerformanceApiService, 'getAccountProductMetrics').and.callThrough();
        runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
          positionId: positionIdMock,
          contextPositionId: contextPositionIdMock,
          filter: performanceFilterStateMock,
          selectedEntityType: SelectedEntityType.Account
        }));
      });

      it('should return a FetchProductMetricsSuccessAction', (done) => {
        productMetricsEffects.fetchProductMetrics$().subscribe(result => {
          expect(myPerformanceApiService.getAccountProductMetrics).toHaveBeenCalledWith(
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
        spyOn(myPerformanceApiService, 'getAccountProductMetrics').and.returnValue(Observable.throw(err));
        runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
          positionId: positionIdMock,
          contextPositionId: contextPositionIdMock,
          filter: performanceFilterStateMock,
          selectedEntityType: SelectedEntityType.Account
        }));
      });

      it('should return a FetchProductMetricsFailureAction after catching an error', (done) => {
        productMetricsEffects.fetchProductMetrics$().subscribe((result) => {
          expect(myPerformanceApiService.getAccountProductMetrics).toHaveBeenCalledWith(
            positionIdMock, contextPositionIdMock, performanceFilterStateMock, ProductMetricsAggregationType.brand
          );
          expect(result).toEqual(new ProductMetricsActions.FetchProductMetricsFailureAction(err));
          done();
        });
      });
    });
  });

  describe('when a FetchProductMetricsAction for an RoleGroup is received', () => {
    let myPerformanceApiService: MyPerformanceApiService;

    beforeEach(inject([ MyPerformanceApiService ],
      (_myPerformanceApiService: MyPerformanceApiService) => {
        myPerformanceApiService = _myPerformanceApiService;
      }
    ));

    describe('when ProductMetricsApiService returns successfully', () => {
      beforeEach(() => {
        spyOn(myPerformanceApiService, 'getRoleGroupProductMetrics').and.callThrough();
        runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
          positionId: positionIdMock,
          entityTypeCode: entityTypeCodeMock,
          filter: performanceFilterStateMock,
          selectedEntityType: SelectedEntityType.RoleGroup
        }));
      });

      it('should return a FetchProductMetricsSuccessAction', (done) => {
        productMetricsEffects.fetchProductMetrics$().subscribe(result => {
          expect(myPerformanceApiService.getRoleGroupProductMetrics).toHaveBeenCalledWith(
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
        spyOn(myPerformanceApiService, 'getRoleGroupProductMetrics').and.returnValue(Observable.throw(err));
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
