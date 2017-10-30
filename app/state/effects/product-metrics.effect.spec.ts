import { Action } from '@ngrx/store';
import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { EntityType } from '../../enums/entity-responsibilities.enum';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getProductMetricsWithBrandValuesMock, getProductMetricsWithSkuValuesMock } from '../../models/product-metrics.model.mock';
import * as ProductMetricsActions from '../actions/product-metrics.action';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { ProductMetrics } from '../../models/product-metrics.model';
import { ProductMetricsEffects } from './product-metrics.effect';
import { ProductMetricsService, ProductMetricsData } from '../../services/product-metrics.service';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import { SkuPackageType } from '../../enums/sku-package-type.enum';

const chance = new Chance();

describe('ProductMetrics Effects', () => {
  let positionIdMock: string;
  let contextPositionIdMock: string;
  let entityTypeCodeMock: string;
  let selectedBrandCodeMock: string;
  let productMetricsWithBrandValuesMock: ProductMetrics;
  let productMetricsWithSkuValuesMock: ProductMetrics;
  let performanceFilterStateMock: MyPerformanceFilterState;
  let selectedEntityTypeMock: EntityType = EntityType.Person;
  let productMetricsSuccessPayloadMock: ProductMetricsActions.FetchProductMetricsSuccessPayload;
  let error: Error;
  let runner: EffectsRunner;
  let productMetricsEffects: ProductMetricsEffects;
  let productMetricsService: ProductMetricsService;
  let productMetricsDataMock: ProductMetricsData;

  const productMetricsServiceMock = {
    getProductMetrics(productMetricsData: ProductMetricsData): Observable<ProductMetricsData> {
      return Observable.of(productMetricsData);
    },
    checkEmptyProductMetricsResponse(productMetricsData: ProductMetricsData): Observable<ProductMetricsData> {
      return Observable.of(productMetricsData);
    },
    filterProductMetricsBrand(responsibilitiesData: ProductMetricsData): Observable<ProductMetricsData> {
      return Observable.of(responsibilitiesData);
    }
  };

  beforeEach(() => {
    positionIdMock = chance.string();
    contextPositionIdMock = chance.string();
    entityTypeCodeMock = chance.string();
    selectedBrandCodeMock = chance.string();
    productMetricsWithBrandValuesMock = getProductMetricsWithBrandValuesMock();
    productMetricsWithSkuValuesMock = getProductMetricsWithSkuValuesMock(SkuPackageType.package);
    performanceFilterStateMock = getMyPerformanceFilterMock();
    error = new Error(chance.string());

    productMetricsDataMock = {
      positionId: positionIdMock,
      contextPositionId: contextPositionIdMock,
      entityTypeCode: entityTypeCodeMock,
      filter: performanceFilterStateMock,
      selectedEntityType: selectedEntityTypeMock,
      selectedBrandCode: selectedBrandCodeMock
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

  describe('when a FetchProductMetrics is received', () => {
    beforeEach(() => {
      runner.queue(new ProductMetricsActions.FetchProductMetrics({
        positionId: positionIdMock,
        contextPositionId: contextPositionIdMock,
        entityTypeCode: entityTypeCodeMock,
        filter: performanceFilterStateMock,
        selectedEntityType: EntityType.Person,
        selectedBrandCode: selectedBrandCodeMock
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

    it('should call checkEmptyProductMetricsResponse with productMetricsData', (done) => {
      const checkEmptyProductMetricsResponseSpy = spyOn(productMetricsService, 'checkEmptyProductMetricsResponse').and.callThrough();

      productMetricsEffects.fetchProductMetrics$().subscribe(() => {
        done();
      });

      expect(checkEmptyProductMetricsResponseSpy.calls.count()).toBe(1);
      expect(checkEmptyProductMetricsResponseSpy.calls.argsFor(0)[0]).toEqual(productMetricsDataMock);
    });

    describe('when ProductMetricsService returns successfully and productMetricsViewType is brands', () => {
      it('should return a SetProductMetricsViewType and FetchProductMetricsSuccess', (done) => {
        spyOn(productMetricsService, 'getProductMetrics').and.callFake((productMetricsData: ProductMetricsData) => {
          productMetricsData.products = productMetricsWithBrandValuesMock;
          productMetricsData.productMetricsViewType = ProductMetricsViewType.brands;
          return Observable.of(productMetricsData);
        });

        productMetricsSuccessPayloadMock = {
          positionId: positionIdMock,
          products: productMetricsWithBrandValuesMock
        };

        productMetricsEffects.fetchProductMetrics$().pairwise().subscribe(([action1, action2]) => {
          expect(action1).toEqual(new ProductMetricsActions.SetProductMetricsViewType(ProductMetricsViewType.brands));
          expect(action2).toEqual(new ProductMetricsActions.FetchProductMetricsSuccess(productMetricsSuccessPayloadMock));
          done();
        });
      });
    });

    describe('when ProductMetricsService returns successfully and productMetricsViewType is skus', () => {
      it('should return a SetProductMetricsViewType, FetchProductMetricsSuccess, and SelectBrandValues', (done) => {
        spyOn(productMetricsService, 'getProductMetrics').and.callFake((productMetricsData: ProductMetricsData) => {
          productMetricsData.products = productMetricsWithBrandValuesMock;
          productMetricsData.productMetricsViewType = ProductMetricsViewType.skus;
          productMetricsData.selectedBrandCode = selectedBrandCodeMock;
          return Observable.of(productMetricsData);
        });

        productMetricsSuccessPayloadMock = {
          positionId: positionIdMock,
          products: productMetricsWithBrandValuesMock
        };

        let dispatchedActions: Action[] = [];

        productMetricsEffects.fetchProductMetrics$().subscribe((action: Action) => {
          dispatchedActions.push(action);

          if (dispatchedActions.length === 3) {
            expect(dispatchedActions).toEqual([
              new ProductMetricsActions.SetProductMetricsViewType(ProductMetricsViewType.skus),
              new ProductMetricsActions.FetchProductMetricsSuccess(productMetricsSuccessPayloadMock),
              new ProductMetricsActions.SelectBrandValues(selectedBrandCodeMock)
            ]);
            done();
          }
        });
      });
    });

    describe('when ProductMetricsApiService returns an error', () => {
      it('should return a FetchProductMetricsFailure after catching an error', (done) => {
        spyOn(productMetricsService, 'getProductMetrics').and.returnValue(Observable.throw(error));

        productMetricsEffects.fetchProductMetrics$().subscribe((result) => {
          expect(result).toEqual(new ProductMetricsActions.FetchProductMetricsFailure(error));
          done();
        });
      });
    });

    describe('when checkEmptyProductMetricsResponse returns an error', () => {
      it('should return a FetchProductMetricsFailureAction after catching an error', (done) => {
        spyOn(productMetricsService, 'checkEmptyProductMetricsResponse').and.returnValue(Observable.throw(error));

        productMetricsEffects.fetchProductMetrics$().subscribe((result) => {
          expect(result).toEqual(new ProductMetricsActions.FetchProductMetricsFailure(error));
          done();
        });
      });
    });
  });

  describe('when a failed FetchProductMetricsFailure is received', () => {

    beforeEach(() => {
      runner.queue(new ProductMetricsActions.FetchProductMetricsFailure(error));
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
