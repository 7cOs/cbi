import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { EntityType } from '../enums/entity-responsibilities.enum';
import { getMyPerformanceFilterMock } from '../models/my-performance-filter.model.mock';
import { getProductMetricsBrandDTOMock } from '../models/product-metrics.model.mock';
import { getProductMetricsWithBrandValuesMock, getProductMetricsWithSkuValuesMock } from '../models/product-metrics.model.mock';
import { ProductMetricsApiService } from '../services/product-metrics-api.service';
import { MyPerformanceFilterState } from '../state//reducers/my-performance-filter.reducer';
import { ProductMetrics, ProductMetricsDTO, ProductMetricsValues } from '../models/product-metrics.model';
import { ProductMetricsAggregationType } from '../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsService, ProductMetricsData } from './product-metrics.service';
import { ProductMetricsTransformerService } from '../services/product-metrics-transformer.service';
import { ProductMetricsViewType } from '../enums/product-metrics-view-type.enum';

const chance = new Chance();

describe('ProductMetrics Service', () => {
  let positionIdMock: string;
  let contextPositionIdMock: string;
  let entityTypeCodeMock: string;
  let productMetricsWithBrandValuesMock: ProductMetrics;
  let productMetricsWithSkuValuesMock: ProductMetrics;
  let productMetricsBrandsDTOMock: ProductMetricsDTO;
  let performanceFilterStateMock: MyPerformanceFilterState;
  let selectedEntityTypeMock: EntityType = EntityType.Person;
  let error: Error;
  let productMetricsApiServiceMock: any;
  let productMetricsTransformerServiceMock: any;

  let runner: EffectsRunner;
  let productMetricsService: ProductMetricsService;
  let productMetricsApiService: ProductMetricsApiService;
  let productMetricsTransformerService: ProductMetricsTransformerService;

  beforeEach(() => {
    positionIdMock = chance.string();
    contextPositionIdMock = chance.string();
    entityTypeCodeMock = chance.string();
    productMetricsWithBrandValuesMock = getProductMetricsWithBrandValuesMock(1, 9);
    productMetricsWithSkuValuesMock = getProductMetricsWithSkuValuesMock(1, 9);
    productMetricsBrandsDTOMock = {
      brandValues: Array(chance.natural({min: 1, max: 9})).fill('').map(() => getProductMetricsBrandDTOMock()),
      type: chance.string()
    };
    performanceFilterStateMock = getMyPerformanceFilterMock();
    error = new Error(chance.string());
    productMetricsApiServiceMock = {
      getPositionProductMetrics() {
        return Observable.of(productMetricsBrandsDTOMock);
      },
      getAccountProductMetrics() {
        return Observable.of(productMetricsBrandsDTOMock);
      },
      getRoleGroupProductMetrics() {
        return Observable.of(productMetricsBrandsDTOMock);
      }
    };

    productMetricsTransformerServiceMock = {
      transformProductMetrics(): ProductMetrics {
        return productMetricsWithBrandValuesMock;
      }
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

      it('should return a productMetricViewType of skus when the API returns skuValues', (done) => {
        productMetricsDataMock.selectedEntityType = EntityType.Person;
        getPositionProductMetricsSpy.and
          .callFake(() => Observable.of(productMetricsWithSkuValuesMock));

        productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
          expect(productMetricsData.productMetricsViewType).toEqual(ProductMetricsViewType.skus);
          done();
        });
      });

      it('should call getPositionProductMetrics when metrics for a position are requested', (done) => {
        productMetricsDataMock.selectedEntityType = EntityType.Person;

        productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
          expect(productMetricsData).toEqual({
            positionId: productMetricsDataMock.positionId,
            contextPositionId: productMetricsDataMock.contextPositionId,
            entityTypeCode: productMetricsDataMock.entityTypeCode,
            filter: productMetricsDataMock.filter,
            selectedEntityType: productMetricsDataMock.selectedEntityType,
            products: productMetricsWithBrandValuesMock,
            productMetricsViewType: ProductMetricsViewType.brands
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
          productMetricsBrandsDTOMock
        ]);
      });

      it('should call getPositionProductMetrics when metrics for an account are requested', (done) => {
        productMetricsDataMock.selectedEntityType = EntityType.Account;

        productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
          expect(productMetricsData).toEqual({
            positionId: productMetricsDataMock.positionId,
            contextPositionId: productMetricsDataMock.contextPositionId,
            entityTypeCode: productMetricsDataMock.entityTypeCode,
            filter: productMetricsDataMock.filter,
            selectedEntityType: productMetricsDataMock.selectedEntityType,
            products: productMetricsWithBrandValuesMock,
            productMetricsViewType: ProductMetricsViewType.brands
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
          productMetricsBrandsDTOMock
        ]);
      });

      it('should call getPositionProductMetrics when metrics for a role group are requested', (done) => {
        productMetricsDataMock.selectedEntityType = EntityType.RoleGroup;

        productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
          expect(productMetricsData).toEqual({
            positionId: productMetricsDataMock.positionId,
            contextPositionId: productMetricsDataMock.contextPositionId,
            entityTypeCode: productMetricsDataMock.entityTypeCode,
            filter: productMetricsDataMock.filter,
            selectedEntityType: productMetricsDataMock.selectedEntityType,
            products: productMetricsWithBrandValuesMock,
            productMetricsViewType: ProductMetricsViewType.brands
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
          productMetricsBrandsDTOMock
        ]);
      });
    });
  });

  describe('when filterProductMetricsBrand is called', () => {
    describe('when skus are passed in', () => {
      let productMetricsDataMock: ProductMetricsData;

      beforeEach(() => {
        productMetricsDataMock = {
          positionId: positionIdMock,
          contextPositionId: contextPositionIdMock,
          entityTypeCode: entityTypeCodeMock,
          filter: performanceFilterStateMock,
          selectedEntityType: selectedEntityTypeMock,
          products: productMetricsWithSkuValuesMock
        };
      });

      describe('when a brand is selected', () => {
        it('should return the sku that matches the selected brand', (done) => {
          productMetricsDataMock.selectedBrandCode = productMetricsWithSkuValuesMock.skuValues[0].brandCode;
          const nonMatchingBrandCode = productMetricsDataMock.selectedBrandCode + 'NONMATCH';
          productMetricsWithSkuValuesMock.skuValues = productMetricsWithSkuValuesMock.skuValues
            .map((productMetricsValues: ProductMetricsValues) => {
              productMetricsValues.brandCode = nonMatchingBrandCode;
              return productMetricsValues;
            });

          productMetricsWithSkuValuesMock.skuValues[0].brandCode = productMetricsDataMock.selectedBrandCode;

          productMetricsService.filterProductMetricsBrand(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
            expect(productMetricsData).toEqual({
              positionId: positionIdMock,
              contextPositionId: contextPositionIdMock,
              entityTypeCode: entityTypeCodeMock,
              filter: performanceFilterStateMock,
              selectedEntityType: selectedEntityTypeMock,
              products: {
                skuValues: [productMetricsWithSkuValuesMock.skuValues[0]]
              },
              selectedBrandCode: productMetricsDataMock.selectedBrandCode
            });
            done();
          });
        });

        it('should return an empty array when no brand matches', (done) => {
          productMetricsDataMock.selectedBrandCode = productMetricsWithSkuValuesMock.skuValues[0].brandCode;
          const nonMatchingBrandCode = productMetricsDataMock.selectedBrandCode + 'NONMATCH';
          productMetricsWithSkuValuesMock.skuValues = productMetricsWithSkuValuesMock.skuValues
            .map((productMetricsValues: ProductMetricsValues) => {
              productMetricsValues.brandCode = nonMatchingBrandCode;
              return productMetricsValues;
            });

          productMetricsService.filterProductMetricsBrand(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
            expect(productMetricsData).toEqual({
              positionId: positionIdMock,
              contextPositionId: contextPositionIdMock,
              entityTypeCode: entityTypeCodeMock,
              filter: performanceFilterStateMock,
              selectedEntityType: selectedEntityTypeMock,
              products: {
                skuValues: []
              },
              selectedBrandCode: productMetricsDataMock.selectedBrandCode
            });
            done();
          });
        });
      });

      describe('when NO brand is selected', () => {
        it('should return the input data', (done) => {
          productMetricsDataMock.selectedBrandCode = null;

          productMetricsService.filterProductMetricsBrand(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
            expect(productMetricsData).toEqual(productMetricsDataMock);
            done();
          });
        });
      });
    });

    describe('when brands are passed in', () => {
      let productMetricsDataMock: ProductMetricsData;

      beforeEach(() => {
        productMetricsDataMock = {
          positionId: positionIdMock,
          contextPositionId: contextPositionIdMock,
          entityTypeCode: entityTypeCodeMock,
          filter: performanceFilterStateMock,
          selectedEntityType: selectedEntityTypeMock,
          products: productMetricsWithBrandValuesMock,
          selectedBrandCode: chance.string()
        };
      });

      it('should return the input data', (done) => {
        productMetricsService.filterProductMetricsBrand(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
          expect(productMetricsData).toEqual(productMetricsDataMock);
          done();
        });
      });
    });
  });
});
