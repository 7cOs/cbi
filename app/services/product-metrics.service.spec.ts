import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { EntityType } from '../enums/entity-responsibilities.enum';
import { getEntityTypeMock } from '../enums/entity-responsibilities.enum.mock';
import { getMyPerformanceFilterMock } from '../models/my-performance-filter.model.mock';
import { getProductMetricsBrandDTOMock, getProductMetricsSkuDTOMock } from '../models/product-metrics.model.mock';
import { getProductMetricsWithBrandValuesMock, getProductMetricsWithSkuValuesMock } from '../models/product-metrics.model.mock';
import { ProductMetricsApiService } from '../services/product-metrics-api.service';
import { MyPerformanceFilterState } from '../state//reducers/my-performance-filter.reducer';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ProductMetrics, ProductMetricsDTO, ProductMetricsValues } from '../models/product-metrics.model';
import { ProductMetricsAggregationType } from '../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsService, ProductMetricsData } from './product-metrics.service';
import { ProductMetricsTransformerService } from '../services/product-metrics-transformer.service';
import { ProductMetricsViewType } from '../enums/product-metrics-view-type.enum';
import { SkuPackageType } from '../enums/sku-package-type.enum';

const chance = new Chance();

describe('ProductMetrics Service', () => {
  let positionIdMock: string;
  let contextPositionIdMock: string;
  let entityTypeCodeMock: string;
  let performanceFilterStateMock: MyPerformanceFilterState;
  let selectedEntityTypeMock: EntityType;

  let productMetricsWithBrandValuesMock: ProductMetrics;
  let productMetricsWithSkuValuesMock: ProductMetrics;
  let productMetricsWithCombinedValuesMock: ProductMetrics;
  let productMetricsBrandsDTOMock: ProductMetricsDTO;
  let productMetricsSkuDTOMock: ProductMetricsDTO;

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
    performanceFilterStateMock = getMyPerformanceFilterMock();
    selectedEntityTypeMock = getEntityTypeMock();

    productMetricsWithBrandValuesMock = getProductMetricsWithBrandValuesMock();
    productMetricsWithSkuValuesMock = getProductMetricsWithSkuValuesMock(SkuPackageType.package);
    productMetricsWithCombinedValuesMock = Object.assign({}, productMetricsWithBrandValuesMock, productMetricsWithSkuValuesMock);
    productMetricsBrandsDTOMock = getProductMetricsBrandDTOMock();
    productMetricsSkuDTOMock = getProductMetricsSkuDTOMock();

    productMetricsApiServiceMock = {
      getAlternateHierarchyProductMetricsForPosition(
        positionId: string,
        filter: MyPerformanceFilterState,
        aggregation: ProductMetricsAggregationType,
        contextPositionId: string
      ) {
        return aggregation === ProductMetricsAggregationType.brand
          ? Observable.of(productMetricsBrandsDTOMock)
          : Observable.of(productMetricsSkuDTOMock);
      },
      getAlternateHierarchyProductMetrics(
        positionId: string,
        entityTypeCode: EntityType,
        filter: MyPerformanceFilterState,
        aggregation: ProductMetricsAggregationType,
        contextPositionId: string
      ) {
        return aggregation === ProductMetricsAggregationType.brand
          ? Observable.of(productMetricsBrandsDTOMock)
          : Observable.of(productMetricsSkuDTOMock);
      },
      getPositionProductMetrics(
        positionId: string, filter: MyPerformanceFilterState, aggregation: ProductMetricsAggregationType
      ) {
        return aggregation === ProductMetricsAggregationType.brand
          ? Observable.of(productMetricsBrandsDTOMock)
          : Observable.of(productMetricsSkuDTOMock);
      },
      getAccountProductMetrics(
        accountId: string, positionId: string, filter: MyPerformanceFilterState, aggregation: ProductMetricsAggregationType
      ) {
        return aggregation === ProductMetricsAggregationType.brand
          ? Observable.of(productMetricsBrandsDTOMock)
          : Observable.of(productMetricsSkuDTOMock);
      },
      getRoleGroupProductMetrics(
        positionId: string, entityType: string, filter: MyPerformanceFilterState, aggregation: ProductMetricsAggregationType
      ) {
        return aggregation === ProductMetricsAggregationType.brand
          ? Observable.of(productMetricsBrandsDTOMock)
          : Observable.of(productMetricsSkuDTOMock);
      }
    };

    productMetricsTransformerServiceMock = {
      transformAndCombineProductMetricsDTOs(dtos: ProductMetricsDTO[]): ProductMetrics {
        return dtos.length === 1 ? productMetricsWithBrandValuesMock : productMetricsWithCombinedValuesMock;
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
    let getPositionProductMetricsSpy: jasmine.Spy;
    let getAccountProductMetricsSpy: jasmine.Spy;
    let getRoleGroupProductMetricsSpy: jasmine.Spy;
    let transformProductMetricsSpy: jasmine.Spy;
    let getAlternateHierarchyProductMetricsSpy: jasmine.Spy;
    let getAlternateHierarchyProductMetricsForPositionSpy: jasmine.Spy;

    beforeEach(() => {
      getPositionProductMetricsSpy = spyOn(productMetricsApiService, 'getPositionProductMetrics').and.callThrough();
      getAccountProductMetricsSpy = spyOn(productMetricsApiService, 'getAccountProductMetrics').and.callThrough();
      getRoleGroupProductMetricsSpy = spyOn(productMetricsApiService, 'getRoleGroupProductMetrics').and.callThrough();
      transformProductMetricsSpy = spyOn(productMetricsTransformerService, 'transformAndCombineProductMetricsDTOs').and.callThrough();
      getAlternateHierarchyProductMetricsSpy = spyOn(productMetricsApiService, 'getAlternateHierarchyProductMetrics').and.callThrough();
      getAlternateHierarchyProductMetricsForPositionSpy =
        spyOn(productMetricsApiService, 'getAlternateHierarchyProductMetricsForPosition').and.callThrough();

      productMetricsDataMock = {
        positionId: positionIdMock,
        contextPositionId: contextPositionIdMock,
        entityTypeCode: entityTypeCodeMock,
        filter: performanceFilterStateMock,
        selectedEntityType: selectedEntityTypeMock
      };
      productMetricsDataMock.filter.premiseType = PremiseTypeValue.All;
    });

    describe('when in alternateHierarchy', () => {
      describe('when selectedEntityType is Person', () => {
        beforeEach(() => {
          productMetricsDataMock.selectedEntityType = EntityType.Person;
          productMetricsDataMock.inAlternateHierarchy = true;
        });

        describe('when no selectedBrandCode is present', () => {
          it('should call getPositionProductMetrics for brand level aggregation', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
              expect(getAlternateHierarchyProductMetricsForPositionSpy.calls.count()).toBe(1);
              expect(getAlternateHierarchyProductMetricsForPositionSpy.calls.argsFor(0)).toEqual([
                productMetricsDataMock.positionId,
                productMetricsDataMock.filter,
                ProductMetricsAggregationType.brand,
                productMetricsDataMock.contextPositionId
              ]);
              expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
              expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(0);
              done();
            });
          });

          it('should call transformAndCombineProductMetricsDTOs with correct input', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
              expect(transformProductMetricsSpy.calls.count()).toBe(1);
              expect(transformProductMetricsSpy.calls.argsFor(0)[0]).toEqual(
                [ productMetricsBrandsDTOMock ]
              );
              done();
            });
          });

          it('should respond with transformed product metrics and brands view type', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
              expect(productMetricsData).toEqual(
                Object.assign({}, productMetricsDataMock, {
                  selectedEntityType: EntityType.Person,
                  products: productMetricsWithBrandValuesMock,
                  productMetricsViewType: ProductMetricsViewType.brands
                })
              );
              done();
            });
          });
        });

        describe('when selectedBrandCode is present', () => {
          beforeEach(() => {
            productMetricsDataMock.inAlternateHierarchy = true;
            productMetricsDataMock.selectedEntityType = EntityType.Person;
            productMetricsDataMock.selectedBrandCode = chance.string();
          });

          it('should call getAlternateHierarchyProductMetricsForPosition for brand AND sku level aggregation', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
              expect(getAlternateHierarchyProductMetricsForPositionSpy.calls.count()).toBe(2);
              expect(getAlternateHierarchyProductMetricsForPositionSpy.calls.argsFor(0)).toEqual([
                productMetricsDataMock.positionId,
                productMetricsDataMock.filter,
                ProductMetricsAggregationType.sku,
                productMetricsDataMock.contextPositionId
              ]);
              expect(getAlternateHierarchyProductMetricsForPositionSpy.calls.argsFor(1)).toEqual([
                productMetricsDataMock.positionId,
                productMetricsDataMock.filter,
                ProductMetricsAggregationType.brand,
                productMetricsDataMock.contextPositionId
              ]);
              expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
              expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(0);
              done();
            });
          });

          it('should call transformAndCombineProductMetricsDTOs with correct input', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
              expect(transformProductMetricsSpy.calls.count()).toBe(1);
              expect(transformProductMetricsSpy.calls.argsFor(0)[0]).toEqual(
                [ productMetricsSkuDTOMock, productMetricsBrandsDTOMock ]
              );
              done();
            });
          });

          it('should respond with transformed product metrics and skus view type', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
              expect(productMetricsData).toEqual(
                Object.assign({}, productMetricsDataMock, {
                  selectedEntityType: EntityType.Person,
                  products: productMetricsWithCombinedValuesMock,
                  productMetricsViewType: ProductMetricsViewType.skus
                })
              );
              done();
            });
          });
        });
      });

      describe('when selectedEntityType is a Role Group', () => {
        beforeEach(() => {
          productMetricsDataMock.selectedEntityType = EntityType.RoleGroup;
          productMetricsDataMock.inAlternateHierarchy = true;
        });

        describe('when no selectedBrandCode is present', () => {
          it('should call getAlternateHierarchyProductMetrics for brand level aggregation', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
              expect(getAlternateHierarchyProductMetricsSpy.calls.count()).toBe(1);
              expect(getAlternateHierarchyProductMetricsSpy.calls.argsFor(0)).toEqual([
                productMetricsDataMock.positionId,
                productMetricsDataMock.entityTypeCode,
                productMetricsDataMock.filter,
                ProductMetricsAggregationType.brand,
                productMetricsDataMock.contextPositionId
              ]);
              expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
              expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(0);
              done();
            });
          });

          it('should call transformAndCombineProductMetricsDTOs with correct input', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
              expect(transformProductMetricsSpy.calls.count()).toBe(1);
              expect(transformProductMetricsSpy.calls.argsFor(0)[0]).toEqual(
                [ productMetricsBrandsDTOMock ]
              );
              done();
            });
          });

          it('should respond with transformed product metrics and brands view type', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
              expect(productMetricsData).toEqual(
                Object.assign({}, productMetricsDataMock, {
                  selectedEntityType: EntityType.RoleGroup,
                  products: productMetricsWithBrandValuesMock,
                  productMetricsViewType: ProductMetricsViewType.brands
                })
              );
              done();
            });
          });
        });

        describe('when selectedBrandCode is present', () => {
          beforeEach(() => {
            productMetricsDataMock.selectedBrandCode = chance.string();
          });

          it('should call getAlternateHierarchyProductMetrics for brand AND sku level aggregation', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
              expect(getAlternateHierarchyProductMetricsSpy.calls.count()).toBe(2);
              expect(getAlternateHierarchyProductMetricsSpy.calls.argsFor(0)).toEqual([
                productMetricsDataMock.positionId,
                productMetricsDataMock.entityTypeCode,
                productMetricsDataMock.filter,
                ProductMetricsAggregationType.sku,
                productMetricsDataMock.contextPositionId
              ]);
              expect(getAlternateHierarchyProductMetricsSpy.calls.argsFor(1)).toEqual([
                productMetricsDataMock.positionId,
                productMetricsDataMock.entityTypeCode,
                productMetricsDataMock.filter,
                ProductMetricsAggregationType.brand,
                productMetricsDataMock.contextPositionId
              ]);
              expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
              expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(0);
              done();
            });
          });

          it('should call transformAndCombineProductMetricsDTOs with correct input', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
              expect(transformProductMetricsSpy.calls.count()).toBe(1);
              expect(transformProductMetricsSpy.calls.argsFor(0)[0]).toEqual(
                [ productMetricsSkuDTOMock, productMetricsBrandsDTOMock ]
              );
              done();
            });
          });

          it('should respond with transformed product metrics and skus view type', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
              expect(productMetricsData).toEqual(
                Object.assign({}, productMetricsDataMock, {
                  selectedEntityType: EntityType.RoleGroup,
                  products: productMetricsWithCombinedValuesMock,
                  productMetricsViewType: ProductMetricsViewType.skus
                })
              );
              done();
            });
          });
        });
      });
    });

    describe('when selectedEntityType is Person', () => {
      beforeEach(() => {
        productMetricsDataMock.selectedEntityType = EntityType.Person;
      });

      describe('when no selectedBrandCode is present', () => {
        it('should call getPositionProductMetrics for brand level aggregation', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(getPositionProductMetricsSpy.calls.count()).toBe(1);
            expect(getPositionProductMetricsSpy.calls.argsFor(0)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.brand
            ]);
            expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(0);
            done();
          });
        });

        it('should call transformAndCombineProductMetricsDTOs with correct input', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(transformProductMetricsSpy.calls.count()).toBe(1);
            expect(transformProductMetricsSpy.calls.argsFor(0)[0]).toEqual(
              [ productMetricsBrandsDTOMock ]
            );
            done();
          });
        });

        it('should respond with transformed product metrics and brands view type', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
            expect(productMetricsData).toEqual(
              Object.assign({}, productMetricsDataMock, {
                selectedEntityType: EntityType.Person,
                products: productMetricsWithBrandValuesMock,
                productMetricsViewType: ProductMetricsViewType.brands
              })
            );
            done();
          });
        });
      });

      describe('when selectedBrandCode is present', () => {
        beforeEach(() => {
          productMetricsDataMock.selectedBrandCode = chance.string();
        });

        it('should call getPositionProductMetrics for brand AND sku level aggregation', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(getPositionProductMetricsSpy.calls.count()).toBe(2);
            expect(getPositionProductMetricsSpy.calls.argsFor(0)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.sku
            ]);
            expect(getPositionProductMetricsSpy.calls.argsFor(1)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.brand
            ]);
            expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(0);
            done();
          });
        });

        it('should call transformAndCombineProductMetricsDTOs with correct input', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(transformProductMetricsSpy.calls.count()).toBe(1);
            expect(transformProductMetricsSpy.calls.argsFor(0)[0]).toEqual(
              [ productMetricsSkuDTOMock, productMetricsBrandsDTOMock ]
            );
            done();
          });
        });

        it('should respond with transformed product metrics and skus view type', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
            expect(productMetricsData).toEqual(
              Object.assign({}, productMetricsDataMock, {
                selectedEntityType: EntityType.Person,
                products: productMetricsWithCombinedValuesMock,
                productMetricsViewType: ProductMetricsViewType.skus
              })
            );
            done();
          });
        });
      });
    });

    describe('when selectedEntityType is AccountGroup', () => {
      beforeEach(() => {
        productMetricsDataMock.selectedEntityType = EntityType.AccountGroup;
      });

      describe('when no selectedBrandCode is present', () => {
        it('should call getPositionProductMetrics for brand level aggregation', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(getPositionProductMetricsSpy.calls.count()).toBe(1);
            expect(getPositionProductMetricsSpy.calls.argsFor(0)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.brand
            ]);
            expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(0);
            done();
          });
        });

        it('should call transformAndCombineProductMetricsDTOs with correct input', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(transformProductMetricsSpy.calls.count()).toBe(1);
            expect(transformProductMetricsSpy.calls.argsFor(0)[0]).toEqual(
              [ productMetricsBrandsDTOMock ]
            );
            done();
          });
        });

        it('should respond with transformed product metrics and brands view type', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
            expect(productMetricsData).toEqual(
              Object.assign({}, productMetricsDataMock, {
                selectedEntityType: EntityType.AccountGroup,
                products: productMetricsWithBrandValuesMock,
                productMetricsViewType: ProductMetricsViewType.brands
              })
            );
            done();
          });
        });
      });

      describe('when selectedBrandCode is present', () => {
        beforeEach(() => {
          productMetricsDataMock.selectedBrandCode = chance.string();
        });

        it('should call getPositionProductMetrics for brand AND sku level aggregation', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(getPositionProductMetricsSpy.calls.count()).toBe(2);
            expect(getPositionProductMetricsSpy.calls.argsFor(0)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.sku
            ]);
            expect(getPositionProductMetricsSpy.calls.argsFor(1)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.brand
            ]);
            expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(0);
            done();
          });
        });

        it('should call transformAndCombineProductMetricsDTOs with correct input', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(transformProductMetricsSpy.calls.count()).toBe(1);
            expect(transformProductMetricsSpy.calls.argsFor(0)[0]).toEqual(
              [ productMetricsSkuDTOMock, productMetricsBrandsDTOMock ]
            );
            done();
          });
        });

        it('should respond with transformed product metrics and skus view type', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
            expect(productMetricsData).toEqual(
              Object.assign({}, productMetricsDataMock, {
                selectedEntityType: EntityType.AccountGroup,
                products: productMetricsWithCombinedValuesMock,
                productMetricsViewType: ProductMetricsViewType.skus
              })
            );
            done();
          });
        });
      });
    });

    describe('when selectedEntityType is Account', () => {
      beforeEach(() => {
        productMetricsDataMock.selectedEntityType = EntityType.Account;
      });

      describe('when no selectedBrandCode is present', () => {
        it('should call getAccountProductMetrics for brand level aggregation', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(getPositionProductMetricsSpy.calls.count()).toBe(0);
            expect(getAccountProductMetricsSpy.calls.count()).toBe(1);
            expect(getAccountProductMetricsSpy.calls.argsFor(0)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.contextPositionId,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.brand
            ]);
            expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(0);
            done();
          });
        });

        it('should call transformAndCombineProductMetricsDTOs with correct input', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(transformProductMetricsSpy.calls.count()).toBe(1);
            expect(transformProductMetricsSpy.calls.argsFor(0)[0]).toEqual(
              [ productMetricsBrandsDTOMock ]
            );
            done();
          });
        });

        it('should respond with transformed product metrics and brands view type', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
            expect(productMetricsData).toEqual(
              Object.assign({}, productMetricsDataMock, {
                selectedEntityType: EntityType.Account,
                products: productMetricsWithBrandValuesMock,
                productMetricsViewType: ProductMetricsViewType.brands
              })
            );
            done();
          });
        });
      });

      describe('when selectedBrandCode is present', () => {
        beforeEach(() => {
          productMetricsDataMock.selectedBrandCode = chance.string();
        });

        it('should call getAccountProductMetrics for brand AND sku level aggregation', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(getPositionProductMetricsSpy.calls.count()).toBe(0);
            expect(getAccountProductMetricsSpy.calls.count()).toBe(2);
            expect(getAccountProductMetricsSpy.calls.argsFor(0)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.contextPositionId,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.sku
            ]);
            expect(getAccountProductMetricsSpy.calls.argsFor(1)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.contextPositionId,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.brand
            ]);
            expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(0);
            done();
          });
        });

        it('should call transformAndCombineProductMetricsDTOs with correct input', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(transformProductMetricsSpy.calls.count()).toBe(1);
            expect(transformProductMetricsSpy.calls.argsFor(0)[ 0 ]).toEqual(
              [ productMetricsSkuDTOMock, productMetricsBrandsDTOMock ]
            );
            done();
          });
        });

        it('should respond with transformed product metrics and skus view type', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
            expect(productMetricsData).toEqual(
              Object.assign({}, productMetricsDataMock, {
                selectedEntityType: EntityType.Account,
                products: productMetricsWithCombinedValuesMock,
                productMetricsViewType: ProductMetricsViewType.skus
              })
            );
            done();
          });
        });
      });
    });

    describe('when selectedEntityType is RoleGroup', () => {
      beforeEach(() => {
        productMetricsDataMock.selectedEntityType = EntityType.RoleGroup;
      });

      describe('when no selectedBrandCode is present', () => {
        it('should call getRoleGroupProductMetrics for brand level aggregation', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(getPositionProductMetricsSpy.calls.count()).toBe(0);
            expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(1);
            expect(getRoleGroupProductMetricsSpy.calls.argsFor(0)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.entityTypeCode,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.brand
            ]);
            done();
          });
        });

        it('should call transformAndCombineProductMetricsDTOs with correct input', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(transformProductMetricsSpy.calls.count()).toBe(1);
            expect(transformProductMetricsSpy.calls.argsFor(0)[0]).toEqual(
              [ productMetricsBrandsDTOMock ]
            );
            done();
          });
        });

        it('should respond with transformed product metrics and brands view type', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
            expect(productMetricsData).toEqual(
              Object.assign({}, productMetricsDataMock, {
                selectedEntityType: EntityType.RoleGroup,
                products: productMetricsWithBrandValuesMock,
                productMetricsViewType: ProductMetricsViewType.brands
              })
            );
            done();
          });
        });
      });

      describe('when selectedBrandCode is present', () => {
        beforeEach(() => {
          productMetricsDataMock.selectedBrandCode = chance.string();
        });

        it('should call getAccountProductMetrics for brand AND sku level aggregation', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(getPositionProductMetricsSpy.calls.count()).toBe(0);
            expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getRoleGroupProductMetricsSpy.calls.count()).toBe(2);
            expect(getRoleGroupProductMetricsSpy.calls.argsFor(0)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.entityTypeCode,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.sku
            ]);
            expect(getRoleGroupProductMetricsSpy.calls.argsFor(1)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.entityTypeCode,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.brand
            ]);
            done();
          });
        });

        it('should call transformAndCombineProductMetricsDTOs with correct input', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(transformProductMetricsSpy.calls.count()).toBe(1);
            expect(transformProductMetricsSpy.calls.argsFor(0)[ 0 ]).toEqual(
              [ productMetricsSkuDTOMock, productMetricsBrandsDTOMock ]
            );
            done();
          });
        });

        it('should respond with transformed product metrics and skus view type', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
            expect(productMetricsData).toEqual(
              Object.assign({}, productMetricsDataMock, {
                selectedEntityType: EntityType.RoleGroup,
                products: productMetricsWithCombinedValuesMock,
                productMetricsViewType: ProductMetricsViewType.skus
              })
            );
            done();
          });
        });
      });
    });

    describe('getProductMetrics view type', () => {
      beforeEach(() => {
        productMetricsDataMock.selectedEntityType = EntityType.Person;
      });

      it('should return a view type of brands when brand values are returned', (done) => {
        productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
          expect(productMetricsData.productMetricsViewType).toBe(ProductMetricsViewType.brands);
          done();
        });
      });

      it('should return a view type of skus when sku values are returned, a selected brand code is present ' +
      'and product metrics are filtered for a premise type of All', (done) => {
        productMetricsDataMock.selectedBrandCode = chance.string();
        productMetricsDataMock.filter.premiseType = PremiseTypeValue.All;

        productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
          expect(productMetricsData.productMetricsViewType).toBe(ProductMetricsViewType.skus);
          done();
        });
      });

      it('should return a view type of packages when sku values are returned, a selected brand code is present ' +
      'and product metrics are filtered for On Premise', (done) => {
        productMetricsDataMock.selectedBrandCode = chance.string();
        productMetricsDataMock.filter.premiseType = PremiseTypeValue.On;

        productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
          expect(productMetricsData.productMetricsViewType).toBe(ProductMetricsViewType.packages);
          done();
        });
      });

      it('should return a view type of skus when sku values are returned, a selected brand code is present ' +
      'and product metrics are filtered for Off Premise', (done) => {
        productMetricsDataMock.selectedBrandCode = chance.string();
        productMetricsDataMock.filter.premiseType = PremiseTypeValue.Off;

        productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
          expect(productMetricsData.productMetricsViewType).toBe(ProductMetricsViewType.skus);
          done();
        });
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
          products: productMetricsWithCombinedValuesMock
        };
      });

      describe('when a brand is selected', () => {
        it('should return the sku that matches the selected brand', (done) => {
          productMetricsDataMock.selectedBrandCode = productMetricsWithCombinedValuesMock.skuValues[0].brandCode;
          const nonMatchingBrandCode = productMetricsDataMock.selectedBrandCode + 'NONMATCH';
          productMetricsWithCombinedValuesMock.skuValues = productMetricsWithCombinedValuesMock.skuValues
            .map((productMetricsValues: ProductMetricsValues) => {
              productMetricsValues.brandCode = nonMatchingBrandCode;
              return productMetricsValues;
            });

          productMetricsWithCombinedValuesMock.skuValues[0].brandCode = productMetricsDataMock.selectedBrandCode;

          productMetricsService.filterProductMetricsBrand(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
            expect(productMetricsData).toEqual({
              positionId: positionIdMock,
              contextPositionId: contextPositionIdMock,
              entityTypeCode: entityTypeCodeMock,
              filter: performanceFilterStateMock,
              selectedEntityType: selectedEntityTypeMock,
              products: {
                brandValues: productMetricsWithCombinedValuesMock.brandValues,
                skuValues: [productMetricsWithCombinedValuesMock.skuValues[0]]
              },
              selectedBrandCode: productMetricsDataMock.selectedBrandCode
            });
            done();
          });
        });

        it('should return an empty array when no brand matches', (done) => {
          productMetricsDataMock.selectedBrandCode = productMetricsWithCombinedValuesMock.skuValues[0].brandCode;
          const nonMatchingBrandCode = productMetricsDataMock.selectedBrandCode + 'NONMATCH';
          productMetricsWithCombinedValuesMock.skuValues = productMetricsWithCombinedValuesMock.skuValues
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
                brandValues: productMetricsWithCombinedValuesMock.brandValues,
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
  });
});
