import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { getMyPerformanceFilterMock } from '../models/my-performance-filter.model.mock';
import { getProductMetricsBrandDTOMock } from '../models/entity-product-metrics-dto.model.mock';
import { getProductMetricMock } from '../models/entity-product-metrics-dto.model.mock';
import { ProductMetricsApiService } from '../services/product-metrics-api.service';
import { MyPerformanceFilterState } from '../state//reducers/my-performance-filter.reducer';
import { ProductMetrics } from '../models/product-metrics.model';
import { ProductMetricsDTO } from '../models/entity-product-metrics-dto.model';
import { ProductMetricsAggregationType } from '../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsService, ProductMetricsData } from './product-metrics.service';
import { ProductMetricsTransformerService } from '../services/product-metrics-transformer.service';
import { SelectedEntityType } from '../enums/selected-entity-type.enum';

const chance = new Chance();

describe('ProductMetrics Service', () => {
  let positionIdMock: string;
  let contextPositionIdMock: string;
  let entityTypeCodeMock: string;
  let productMetricsMock: ProductMetrics;
  let productMetricsDTOMock: ProductMetricsDTO;
  let performanceFilterStateMock: MyPerformanceFilterState;
  let selectedEntityTypeMock: SelectedEntityType = SelectedEntityType.Position;
  let error: Error;
  let productMetricsApiServiceMock: any;
  let productMetricsTransformerServiceMock: any;
  let toastServiceMock: any;

  let runner: EffectsRunner;
  let productMetricsService: ProductMetricsService;
  let productMetricsApiService: ProductMetricsApiService;
  let productMetricsTransformerService: ProductMetricsTransformerService;

  beforeEach(() => {
    positionIdMock = chance.string();
    contextPositionIdMock = chance.string();
    entityTypeCodeMock = chance.string();
    productMetricsMock = getProductMetricMock();
    productMetricsDTOMock = {
      brandValues: Array(chance.natural({min: 1, max: 9})).fill('').map(() => getProductMetricsBrandDTOMock()),
      type: chance.string()
    };
    performanceFilterStateMock = getMyPerformanceFilterMock();
    error = new Error(chance.string());
    productMetricsApiServiceMock = {
      getPositionProductMetrics() {
        return Observable.of(productMetricsDTOMock);
      },
      getAccountProductMetrics() {
        return Observable.of(productMetricsDTOMock);
      },
      getRoleGroupProductMetrics() {
        return Observable.of(productMetricsDTOMock);
      }
    };

    productMetricsTransformerServiceMock = {
      transformProductMetrics(): ProductMetrics {
        return productMetricsMock;
      }
    };

    toastServiceMock = {
      showPerformanceDataErrorToast: jasmine.createSpy('showPerformanceDataErrorToast')
    };

    TestBed.configureTestingModule({
      imports: [
        EffectsTestingModule
      ],
      providers: [
        ProductMetricsService,
        {
          provide: ProductMetricsApiService,
          useValue: productMetricsApiServiceMock
        },
        {
          provide: ProductMetricsTransformerService,
          useValue: productMetricsTransformerServiceMock
        },
        {
          provide: 'toastService',
          useValue: toastServiceMock
        }
      ]
    });
  });

  beforeEach(inject([ EffectsRunner, ProductMetricsService, ProductMetricsApiService, ProductMetricsTransformerService ],
    (_runner: EffectsRunner,
      _productMetricsService: ProductMetricsService,
      _productMetricsApiService: ProductMetricsApiService,
      _productMetricsTransformerService: ProductMetricsTransformerService) => {
      runner = _runner;
      productMetricsService = _productMetricsService;
      productMetricsApiService = _productMetricsApiService;
      productMetricsTransformerService = _productMetricsTransformerService;

      toastServiceMock.showPerformanceDataErrorToast.calls.reset();
    }
  ));

  describe('when getProductMetrics is called', () => {
    let productMetricsDataMock: ProductMetricsData;

    beforeEach(() => {
      productMetricsDataMock = {
        positionId: positionIdMock,
        contextPositionId: contextPositionIdMock,
        entityTypeCode: entityTypeCodeMock,
        filter: performanceFilterStateMock,
        selectedEntityType: selectedEntityTypeMock
      };
    });

    describe('when ProductMetricsApiService returns successfully', () => {
      let getPositionProductMetricsSpy: jasmine.Spy;
      let getAccountProductMetricsSpy: jasmine.Spy;
      let getRoleGroupProductMetricsSpy: jasmine.Spy;
      let transformProductMetricsSpy: jasmine.Spy;

      beforeEach(() => {
        getPositionProductMetricsSpy = spyOn(productMetricsApiService, 'getPositionProductMetrics').and.callThrough();
        getAccountProductMetricsSpy = spyOn(productMetricsApiService, 'getAccountProductMetrics').and.callThrough();
        getRoleGroupProductMetricsSpy = spyOn(productMetricsApiService, 'getRoleGroupProductMetrics').and.callThrough();
        transformProductMetricsSpy = spyOn(productMetricsTransformerService, 'transformProductMetrics').and.callThrough();
      });

      it('should call getPositionProductMetrics when metrics for a position are requested', (done) => {
        productMetricsDataMock.selectedEntityType = SelectedEntityType.Position;

        productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
          expect(productMetricsData).toEqual({
            positionId: productMetricsDataMock.positionId,
            contextPositionId: productMetricsDataMock.contextPositionId,
            entityTypeCode: productMetricsDataMock.entityTypeCode,
            filter: productMetricsDataMock.filter,
            selectedEntityType: productMetricsDataMock.selectedEntityType,
            products: productMetricsMock
          });
          done();
        });

        expect(getPositionProductMetricsSpy.calls.count()).toBe(1);
        expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
        expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(0);
        expect(transformProductMetricsSpy.calls.count()).toBe(1);

        expect(getPositionProductMetricsSpy.calls.argsFor(0)).toEqual([
          productMetricsDataMock.positionId,
          productMetricsDataMock.filter,
          ProductMetricsAggregationType.brand
        ]);
        expect(transformProductMetricsSpy.calls.argsFor(0)).toEqual([
          productMetricsDTOMock,
          ProductMetricsAggregationType.brand
        ]);
      });

      it('should call getPositionProductMetrics when metrics for an account are requested', (done) => {
        productMetricsDataMock.selectedEntityType = SelectedEntityType.Account;

        productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
          expect(productMetricsData).toEqual({
            positionId: productMetricsDataMock.positionId,
            contextPositionId: productMetricsDataMock.contextPositionId,
            entityTypeCode: productMetricsDataMock.entityTypeCode,
            filter: productMetricsDataMock.filter,
            selectedEntityType: productMetricsDataMock.selectedEntityType,
            products: productMetricsMock
          });
          done();
        });

        expect(getPositionProductMetricsSpy.calls.count()).toBe(0);
        expect(getAccountProductMetricsSpy.calls.count()).toBe(1);
        expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(0);
        expect(transformProductMetricsSpy.calls.count()).toBe(1);

        expect(getAccountProductMetricsSpy.calls.argsFor(0)).toEqual([
          productMetricsDataMock.positionId,
          productMetricsDataMock.contextPositionId,
          productMetricsDataMock.filter,
          ProductMetricsAggregationType.brand
        ]);
        expect(transformProductMetricsSpy.calls.argsFor(0)).toEqual([
          productMetricsDTOMock,
          ProductMetricsAggregationType.brand
        ]);
      });

      it('should call getPositionProductMetrics when metrics for a role group are requested', (done) => {
        productMetricsDataMock.selectedEntityType = SelectedEntityType.RoleGroup;

        productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
          expect(productMetricsData).toEqual({
            positionId: productMetricsDataMock.positionId,
            contextPositionId: productMetricsDataMock.contextPositionId,
            entityTypeCode: productMetricsDataMock.entityTypeCode,
            filter: productMetricsDataMock.filter,
            selectedEntityType: productMetricsDataMock.selectedEntityType,
            products: productMetricsMock
          });
          done();
        });

        expect(getPositionProductMetricsSpy.calls.count()).toBe(0);
        expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
        expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(1);
        expect(transformProductMetricsSpy.calls.count()).toBe(1);

        expect(getRoleGroupProductMetricsSpy.calls.argsFor(0)).toEqual([
          productMetricsDataMock.positionId,
          productMetricsDataMock.entityTypeCode,
          productMetricsDataMock.filter,
          ProductMetricsAggregationType.brand
        ]);
        expect(transformProductMetricsSpy.calls.argsFor(0)).toEqual([
          productMetricsDTOMock,
          ProductMetricsAggregationType.brand
        ]);
      });
    });

    describe('when ProductMetricsApiService returns an error', () => {
      beforeEach(() => {
        spyOn(productMetricsApiService, 'getPositionProductMetrics').and.returnValue(Observable.throw(error));
        spyOn(productMetricsTransformerService, 'transformProductMetrics');
      });

      it('should return the original productMetricsData after catching an error', (done) => {
        productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData | Error) => {
          expect(productMetricsData).toEqual(productMetricsDataMock);
          done();
        });

        expect(toastServiceMock.showPerformanceDataErrorToast).toHaveBeenCalledTimes(1);
        expect(productMetricsTransformerService.transformProductMetrics).not.toHaveBeenCalled();
      });
    });
  });
});
