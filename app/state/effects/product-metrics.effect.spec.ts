import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getProductMetricMock } from '../../models/entity-product-metrics-dto.model.mock';
import * as ProductMetricsActions from '../actions/product-metrics.action';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { ProductMetrics } from '../../models/product-metrics.model';
import { ProductMetricsEffects } from './product-metrics.effect';
import { ProductMetricsService, ProductMetricsData } from '../../services/product-metrics.service';
import { SelectedEntityType } from '../../enums/selected-entity-type.enum';

const chance = new Chance();

describe('ProductMetrics Effects', () => {
  let positionIdMock: string;
  let contextPositionIdMock: string;
  let entityTypeCodeMock: string;
  let productMetricsMock: ProductMetrics;
  let performanceFilterStateMock: MyPerformanceFilterState;
  let selectedEntityTypeMock: SelectedEntityType = SelectedEntityType.Position;
  let productMetricsSuccessPayloadMock: ProductMetricsActions.FetchProductMetricsSuccessPayload;
  let error: Error;
  let runner: EffectsRunner;
  let productMetricsEffects: ProductMetricsEffects;
  let productMetricsService: ProductMetricsService;
  let productMetricsDataMock: ProductMetricsData;

  const productMetricsServiceMock = {
    getProductMetrics(responsibilitiesData: ProductMetricsData): Observable<ProductMetricsData> {
      return Observable.of(responsibilitiesData);
    }
  };

  beforeEach(() => {
    positionIdMock = chance.string();
    contextPositionIdMock = chance.string();
    entityTypeCodeMock = chance.string();
    productMetricsMock = getProductMetricMock();
    performanceFilterStateMock = getMyPerformanceFilterMock();
    error = new Error(chance.string());

    productMetricsDataMock = {
      positionId: positionIdMock,
      contextPositionId: contextPositionIdMock,
      entityTypeCode: entityTypeCodeMock,
      filter: performanceFilterStateMock,
      selectedEntityType: selectedEntityTypeMock
    };

    TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule
      ],
      providers: [
        ProductMetricsEffects,
        {
          provide: ProductMetricsService,
          useValue: productMetricsServiceMock
        }
      ]
    });
  });

  beforeEach(inject([ EffectsRunner, ProductMetricsEffects, ProductMetricsService ],
    (_runner: EffectsRunner,
      _productMetricsEffects: ProductMetricsEffects,
      _productMetricsService: ProductMetricsService) => {
      runner = _runner;
      productMetricsEffects = _productMetricsEffects;
      productMetricsService = _productMetricsService;
    }
  ));

  describe('when a FetchProductMetricsAction is received', () => {
    beforeEach(() => {
      runner.queue(new ProductMetricsActions.FetchProductMetricsAction({
        positionId: positionIdMock,
        contextPositionId: contextPositionIdMock,
        entityTypeCode: entityTypeCodeMock,
        filter: performanceFilterStateMock,
        selectedEntityType: SelectedEntityType.Position
      }));
    });

    it('should call getProductMetrics with productMetricsData', (done) => {
      const getProductMetricsSpy = spyOn(productMetricsService, 'getProductMetrics').and.callThrough();

      productMetricsEffects.fetchProductMetrics$().subscribe(() => {
        done();
      });

      expect(getProductMetricsSpy.calls.count()).toBe(1);
      expect(getProductMetricsSpy.calls.argsFor(0)[0]).toEqual(productMetricsDataMock);
    });

    describe('when ProductMetricsService returns successfully', () => {
      it('should return a FetchProductMetricsSuccessAction', (done) => {
        spyOn(productMetricsService, 'getProductMetrics').and.callFake((productMetricsData: ProductMetricsData) => {
          productMetricsData.products = productMetricsMock;
          return Observable.of(productMetricsData);
        });

        productMetricsSuccessPayloadMock = {
          positionId: positionIdMock,
          products: productMetricsMock
        };

        productMetricsEffects.fetchProductMetrics$().subscribe(action => {
          expect(action).toEqual(new ProductMetricsActions.FetchProductMetricsSuccessAction(
            productMetricsSuccessPayloadMock));
          done();
        });
      });
    });

    describe('when ProductMetricsApiService returns an error', () => {
      it('should return a FetchProductMetricsFailureAction after catching an error', (done) => {
        spyOn(productMetricsService, 'getProductMetrics').and.returnValue(Observable.throw(error));

        productMetricsEffects.fetchProductMetrics$().subscribe((result) => {
          expect(result).toEqual(new ProductMetricsActions.FetchProductMetricsFailureAction(error));
          done();
        });
      });
    });
  });

  describe('when a failed FetchProductMetricsFailureAction is received', () => {

    beforeEach(() => {
      runner.queue(new ProductMetricsActions.FetchProductMetricsFailureAction(error));
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
