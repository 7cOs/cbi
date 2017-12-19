import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { EntityType } from '../enums/entity-responsibilities.enum';
import { FetchOpportunityCountsPayload } from '../state/actions/product-metrics.action';
import { getEntityTypeMock } from '../enums/entity-responsibilities.enum.mock';
import { getGroupedOpportunityCountsMock } from '../models/opportunity-count.model.mock';
import { getMyPerformanceFilterMock } from '../models/my-performance-filter.model.mock';
import { getOpportunityCountDTOsMock } from '../models/opportunity-count-dto.model.mock';
import { getProductMetricsViewTypeMock } from '../enums/product-metrics-view-type.enum.mock';
import { getProductMetricsBrandDTOMock, getProductMetricsSkuDTOMock } from '../models/product-metrics.model.mock';
import { getProductMetricsWithBrandValuesMock, getProductMetricsWithSkuValuesMock } from '../models/product-metrics.model.mock';
import { GroupedOpportunityCounts } from '../models/opportunity-count.model';
import { MyPerformanceFilterState } from '../state//reducers/my-performance-filter.reducer';
import { OpportunityCountDTO } from '../models/opportunity-count-dto.model';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ProductMetricsApiService } from '../services/product-metrics-api.service';
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

  let groupedOpportunityCountsMock: GroupedOpportunityCounts;
  let opportunityCountDTOsMock: OpportunityCountDTO[];
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

    groupedOpportunityCountsMock = getGroupedOpportunityCountsMock();
    opportunityCountDTOsMock = getOpportunityCountDTOsMock();
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
      getSubAccountProductMetrics(
        accountId: string, positionId: string, filter: MyPerformanceFilterState, aggregation: ProductMetricsAggregationType
      ) {
        return aggregation === ProductMetricsAggregationType.brand
          ? Observable.of(productMetricsBrandsDTOMock)
          : Observable.of(productMetricsSkuDTOMock);
      },
      getDistributorProductMetrics(
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
      },
      getSubAccountOpportunityCounts() {
        return Observable.of(opportunityCountDTOsMock);
      },
      getDistributorOpportunityCounts() {
        return Observable.of(opportunityCountDTOsMock);
      }
    };

    productMetricsTransformerServiceMock = {
      transformAndCombineProductMetricsDTOs(dtos: ProductMetricsDTO[]): ProductMetrics {
        return dtos.length === 1 ? productMetricsWithBrandValuesMock : productMetricsWithCombinedValuesMock;
      },
      transformAndGroupOpportunityCounts(dtos: OpportunityCountDTO[]): GroupedOpportunityCounts {
        return groupedOpportunityCountsMock;
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
    let getSubAccountProductMetricsSpy: jasmine.Spy;
    let getDistributorProductMetricsSpy: jasmine.Spy;
    let getRoleGroupProductMetricsSpy: jasmine.Spy;
    let transformProductMetricsSpy: jasmine.Spy;
    let getAlternateHierarchyProductMetricsSpy: jasmine.Spy;
    let getAlternateHierarchyProductMetricsForPositionSpy: jasmine.Spy;

    beforeEach(() => {
      getPositionProductMetricsSpy = spyOn(productMetricsApiService, 'getPositionProductMetrics').and.callThrough();
      getAccountProductMetricsSpy = spyOn(productMetricsApiService, 'getAccountProductMetrics').and.callThrough();
      getSubAccountProductMetricsSpy = spyOn(productMetricsApiService, 'getSubAccountProductMetrics').and.callThrough();
      getDistributorProductMetricsSpy = spyOn(productMetricsApiService, 'getDistributorProductMetrics').and.callThrough();
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
              expect(getSubAccountProductMetricsSpy.calls.count()).toBe(0);
              expect(getDistributorProductMetricsSpy.calls.count()).toBe(0);
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
              expect(getSubAccountProductMetricsSpy.calls.count()).toBe(0);
              expect(getDistributorProductMetricsSpy.calls.count()).toBe(0);
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
              expect(getSubAccountProductMetricsSpy.calls.count()).toBe(0);
              expect(getDistributorProductMetricsSpy.calls.count()).toBe(0);
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
              expect(getSubAccountProductMetricsSpy.calls.count()).toBe(0);
              expect(getDistributorProductMetricsSpy.calls.count()).toBe(0);
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

      describe('when selectedEntityType is Distributor', () => {
        beforeEach(() => {
          productMetricsDataMock.selectedEntityType = EntityType.Distributor;
          productMetricsDataMock.inAlternateHierarchy = true;
        });

        describe('when no selectedBrandCode is present', () => {
          it('should call getDistributorProductMetrics for brand level aggregation', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
              expect(getPositionProductMetricsSpy.calls.count()).toBe(0);
              expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
              expect(getDistributorProductMetricsSpy.calls.count()).toBe(1);
              expect(getDistributorProductMetricsSpy.calls.argsFor(0)).toEqual([
                productMetricsDataMock.positionId,
                '0',
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
                  selectedEntityType: EntityType.Distributor,
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
              expect(getDistributorProductMetricsSpy.calls.count()).toBe(2);
              expect(getDistributorProductMetricsSpy.calls.argsFor(0)).toEqual([
                productMetricsDataMock.positionId,
                '0',
                productMetricsDataMock.filter,
                ProductMetricsAggregationType.sku
              ]);
              expect(getDistributorProductMetricsSpy.calls.argsFor(1)).toEqual([
                productMetricsDataMock.positionId,
                '0',
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
                [ productMetricsSkuDTOMock, productMetricsBrandsDTOMock ]
              );
              done();
            });
          });

          it('should respond with transformed product metrics and skus view type', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
              expect(productMetricsData).toEqual(
                Object.assign({}, productMetricsDataMock, {
                  selectedEntityType: EntityType.Distributor,
                  products: productMetricsWithCombinedValuesMock,
                  productMetricsViewType: ProductMetricsViewType.skus
                })
              );
              done();
            });
          });
        });
      });

      describe('when selectedEntityType is Distributor when in Exception Hierarchy', () => {
        beforeEach(() => {
          productMetricsDataMock.selectedEntityType = EntityType.Distributor;
          productMetricsDataMock.inAlternateHierarchy = true;
          productMetricsDataMock.isMemberOfExceptionHierarchy = true;
        });

        describe('when no selectedBrandCode is present', () => {
          it('should call getDistributorProductMetrics for brand level aggregation', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
              expect(getPositionProductMetricsSpy.calls.count()).toBe(0);
              expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
              expect(getDistributorProductMetricsSpy.calls.count()).toBe(1);
              expect(getDistributorProductMetricsSpy.calls.argsFor(0)).toEqual([
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
                [productMetricsBrandsDTOMock]
              );
              done();
            });
          });

          it('should respond with transformed product metrics and brands view type', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
              expect(productMetricsData).toEqual(
                Object.assign({}, productMetricsDataMock, {
                  selectedEntityType: EntityType.Distributor,
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
              expect(getDistributorProductMetricsSpy.calls.count()).toBe(2);
              expect(getDistributorProductMetricsSpy.calls.argsFor(0)).toEqual([
                productMetricsDataMock.positionId,
                productMetricsDataMock.contextPositionId,
                productMetricsDataMock.filter,
                ProductMetricsAggregationType.sku
              ]);
              expect(getDistributorProductMetricsSpy.calls.argsFor(1)).toEqual([
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
                [ productMetricsSkuDTOMock, productMetricsBrandsDTOMock ]
              );
              done();
            });
          });

          it('should respond with transformed product metrics and skus view type', (done) => {
            productMetricsService.getProductMetrics(productMetricsDataMock).subscribe((productMetricsData: ProductMetricsData) => {
              expect(productMetricsData).toEqual(
                Object.assign({}, productMetricsDataMock, {
                  selectedEntityType: EntityType.Distributor,
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
            expect(getSubAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getDistributorProductMetricsSpy.calls.count()).toBe(0);
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
            expect(getSubAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getDistributorProductMetricsSpy.calls.count()).toBe(0);
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
            expect(getSubAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getDistributorProductMetricsSpy.calls.count()).toBe(0);
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
            expect(getSubAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getDistributorProductMetricsSpy.calls.count()).toBe(0);
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
            expect(getSubAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getDistributorProductMetricsSpy.calls.count()).toBe(0);
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
            expect(getSubAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getDistributorProductMetricsSpy.calls.count()).toBe(0);
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

    describe('when selectedEntityType is Subaccount', () => {
      beforeEach(() => {
        productMetricsDataMock.selectedEntityType = EntityType.SubAccount;
      });

      describe('when no selectedBrandCode is present', () => {
        it('should call getSubAccountProductMetrics for brand level aggregation', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(getPositionProductMetricsSpy.calls.count()).toBe(0);
            expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getSubAccountProductMetricsSpy.calls.count()).toBe(1);
            expect(getSubAccountProductMetricsSpy.calls.argsFor(0)).toEqual([
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
                selectedEntityType: EntityType.SubAccount,
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
            expect(getSubAccountProductMetricsSpy.calls.count()).toBe(2);
            expect(getSubAccountProductMetricsSpy.calls.argsFor(0)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.contextPositionId,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.sku
            ]);
            expect(getSubAccountProductMetricsSpy.calls.argsFor(1)).toEqual([
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
                selectedEntityType: EntityType.SubAccount,
                products: productMetricsWithCombinedValuesMock,
                productMetricsViewType: ProductMetricsViewType.skus
              })
            );
            done();
          });
        });
      });
    });

    describe('when selectedEntityType is Distributor', () => {
      beforeEach(() => {
        productMetricsDataMock.selectedEntityType = EntityType.Distributor;
      });

      describe('when no selectedBrandCode is present', () => {
        it('should call getDistributorProductMetrics for brand level aggregation', (done) => {
          productMetricsService.getProductMetrics(productMetricsDataMock).subscribe(() => {
            expect(getPositionProductMetricsSpy.calls.count()).toBe(0);
            expect(getAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getDistributorProductMetricsSpy.calls.count()).toBe(1);
            expect(getDistributorProductMetricsSpy.calls.argsFor(0)).toEqual([
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
                selectedEntityType: EntityType.Distributor,
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
            expect(getDistributorProductMetricsSpy.calls.count()).toBe(2);
            expect(getDistributorProductMetricsSpy.calls.argsFor(0)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.contextPositionId,
              productMetricsDataMock.filter,
              ProductMetricsAggregationType.sku
            ]);
            expect(getDistributorProductMetricsSpy.calls.argsFor(1)).toEqual([
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
                selectedEntityType: EntityType.Distributor,
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
            expect(getSubAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getDistributorProductMetricsSpy.calls.count()).toBe(0);
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
            expect(getSubAccountProductMetricsSpy.calls.count()).toBe(0);
            expect(getDistributorProductMetricsSpy.calls.count()).toBe(0);
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

  describe('getOpportunityCounts', () => {
    let fetchOpportunityCountsMock: FetchOpportunityCountsPayload;

    beforeEach(() => {
      fetchOpportunityCountsMock = {
        positionId: chance.string(),
        alternateHierarchyId: chance.string(),
        distributorId: chance.string(),
        subAccountId: chance.string(),
        isMemberOfExceptionHierarchy: chance.bool(),
        selectedEntityType: getEntityTypeMock(),
        productMetricsViewType: getProductMetricsViewTypeMock(),
        filter: getMyPerformanceFilterMock()
      };
    });

    describe('when fetching opportunity counts for a SubAccount', () => {
      beforeEach(() => {
        fetchOpportunityCountsMock.selectedEntityType = EntityType.SubAccount;
        fetchOpportunityCountsMock.filter.premiseType = PremiseTypeValue.On;
      });

      it('should call getSubAccountOpportunityCounts with the passed in subAccountId, positionId and '
      + 'a stringified lower case PremiseTypeValue', (done) => {
        const getOpportunityCountsSpy = spyOn(productMetricsApiService, 'getSubAccountOpportunityCounts').and.callThrough();
        const expectedPremiseTypeValue = PremiseTypeValue[fetchOpportunityCountsMock.filter.premiseType].toLowerCase();

        productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe(() => {
          done();
        });

        expect(getOpportunityCountsSpy.calls.count()).toBe(1);
        expect(getOpportunityCountsSpy.calls.argsFor(0)).toEqual([
          fetchOpportunityCountsMock.subAccountId,
          fetchOpportunityCountsMock.positionId,
          expectedPremiseTypeValue
        ]);
      });

      it('should call productMetricsTransformerService.transformAndGroupOpportunityCounts with the opportunity counts '
      + 'received from the API call', (done) => {
        const transformerSpy = spyOn(productMetricsTransformerService, 'transformAndGroupOpportunityCounts').and.callThrough();

        productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe(() => {
          done();
        });

        expect(transformerSpy.calls.count()).toBe(1);
        expect(transformerSpy.calls.argsFor(0)[0]).toBe(opportunityCountDTOsMock);
      });

      it('should return the transformed GroupedOpportunityCounts', (done) => {
        productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe((response: GroupedOpportunityCounts) => {
          expect(response).toEqual(groupedOpportunityCountsMock);
          done();
        });
      });
    });

    describe('when fetching opportunity counts for a Distributor', () => {
      beforeEach(() => {
        fetchOpportunityCountsMock.selectedEntityType = EntityType.Distributor;
        fetchOpportunityCountsMock.filter.premiseType = PremiseTypeValue.On;
      });

      describe('when we are in the Standard Hierarchy', () => {
        beforeEach(() => {
          fetchOpportunityCountsMock.isMemberOfExceptionHierarchy = false;
          fetchOpportunityCountsMock.alternateHierarchyId = undefined;
        });

        it('should call getDistributorOpportunityCounts with the passed in distributorId, positionId, and stringified lower '
        + 'case PremiseTypeValue', (done) => {
          const getOpportunityCountsSpy = spyOn(productMetricsApiService, 'getDistributorOpportunityCounts').and.callThrough();
          const expectedPremiseTypeValue = PremiseTypeValue[fetchOpportunityCountsMock.filter.premiseType].toLowerCase();

          productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe(() => {
            done();
          });

          expect(getOpportunityCountsSpy.calls.count()).toBe(1);
          expect(getOpportunityCountsSpy.calls.argsFor(0)).toEqual([
            fetchOpportunityCountsMock.distributorId,
            fetchOpportunityCountsMock.positionId,
            expectedPremiseTypeValue
          ]);
        });
      });

      describe('when we are not in the Exception Hierarchy but are in an Alternate Hierarchy', () => {
        beforeEach(() => {
          fetchOpportunityCountsMock.isMemberOfExceptionHierarchy = false;
          fetchOpportunityCountsMock.alternateHierarchyId = chance.string();
        });

        it('should call getDistributorOpportunityCounts with the passed in distributorId, a positionId of undefined, and stringified lower '
        + 'case PremiseTypeValue', (done) => {
          const getOpportunityCountsSpy = spyOn(productMetricsApiService, 'getDistributorOpportunityCounts').and.callThrough();
          const expectedPremiseTypeValue = PremiseTypeValue[fetchOpportunityCountsMock.filter.premiseType].toLowerCase();

          productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe(() => {
            done();
          });

          expect(getOpportunityCountsSpy.calls.count()).toBe(1);
          expect(getOpportunityCountsSpy.calls.argsFor(0)).toEqual([
            fetchOpportunityCountsMock.distributorId,
            undefined,
            expectedPremiseTypeValue
          ]);
        });
      });

      describe('when we are in the Exception Hierarchy and the Alternate Hierarchy', () => {
        beforeEach(() => {
          fetchOpportunityCountsMock.isMemberOfExceptionHierarchy = true;
          fetchOpportunityCountsMock.alternateHierarchyId = chance.string();
        });

        it('should call getDistributorOpportunityCounts with the passed in distributorId, alternateHierarchyId, and '
        + 'and a stringified lower case PremiseTypeValue', (done) => {
          const getOpportunityCountsSpy = spyOn(productMetricsApiService, 'getDistributorOpportunityCounts').and.callThrough();
          const expectedPremiseTypeValue = PremiseTypeValue[fetchOpportunityCountsMock.filter.premiseType].toLowerCase();

          productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe(() => {
            done();
          });

          expect(getOpportunityCountsSpy.calls.count()).toBe(1);
          expect(getOpportunityCountsSpy.calls.argsFor(0)).toEqual([
            fetchOpportunityCountsMock.distributorId,
            fetchOpportunityCountsMock.alternateHierarchyId,
            expectedPremiseTypeValue
          ]);
        });
      });

      describe('when the API call returns Opportunity Counts', () => {
        it('should call productMetricsTransformerService.transformAndGroupOpportunityCounts with the opportunity counts '
        + 'received from the API call', (done) => {
          const transformerSpy = spyOn(productMetricsTransformerService, 'transformAndGroupOpportunityCounts').and.callThrough();

          productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe(() => {
            done();
          });

          expect(transformerSpy.calls.count()).toBe(1);
          expect(transformerSpy.calls.argsFor(0)[0]).toBe(opportunityCountDTOsMock);
        });

        it('should return the transformed GroupedOpportunityCounts', (done) => {
          productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe((response: GroupedOpportunityCounts) => {
            expect(response).toEqual(groupedOpportunityCountsMock);
            done();
          });
        });
      });
    });
  });
});
