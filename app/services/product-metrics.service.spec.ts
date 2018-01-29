import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { AccountsApiService } from './api/v3/accounts-api.service';
import { DistributorsApiService } from './api/v3/distributors-api.service';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { FetchOpportunityCountsPayload } from '../state/actions/product-metrics.action';
import { getEntityTypeMock } from '../enums/entity-responsibilities.enum.mock';
import { getMyPerformanceFilterMock } from '../models/my-performance-filter.model.mock';
import { getOpportunitiesGroupedByBrandSkuPackageCodeMock } from '../models/opportunity-count.model.mock';
import { getOpportunityCountDTOsMock } from '../models/opportunity-count-dto.model.mock';
import { getProductMetricsViewTypeMock } from '../enums/product-metrics-view-type.enum.mock';
import { getProductMetricsBrandDTOMock, getProductMetricsSkuDTOMock } from '../models/product-metrics.model.mock';
import { getProductMetricsWithBrandValuesMock, getProductMetricsWithSkuValuesMock } from '../models/product-metrics.model.mock';
import { MyPerformanceFilterState } from '../state//reducers/my-performance-filter.reducer';
import { OpportunitiesGroupedByBrandSkuPackageCode } from '../models/opportunity-count.model';
import { OpportunityCountDTO } from '../models/opportunity-count-dto.model';
import { PositionsApiService } from './api/v3/positions-api.service';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { ProductMetrics, ProductMetricsDTO, ProductMetricsValues } from '../models/product-metrics.model';
import { ProductMetricsAggregationType } from '../enums/product-metrics-aggregation-type.enum';
import { ProductMetricsService, ProductMetricsData } from './product-metrics.service';
import * as ProductMetricsServiceConstants from '../models/product-metrics-service.model';
import { ProductMetricsTransformerService } from '../services/product-metrics-transformer.service';
import { ProductMetricsViewType } from '../enums/product-metrics-view-type.enum';
import { SkuPackageType } from '../enums/sku-package-type.enum';
import { SubAccountsApiService } from './api/v3/sub-accounts-api.service';

const chance = new Chance();

describe('ProductMetrics Service', () => {
  let positionIdMock: string;
  let contextPositionIdMock: string;
  let entityTypeCodeMock: string;
  let performanceFilterStateMock: MyPerformanceFilterState;
  let selectedEntityTypeMock: EntityType;

  let opportunitiesGroupedByBrandSkuPackageCodeMock: OpportunitiesGroupedByBrandSkuPackageCode;
  let opportunityCountDTOsMock: OpportunityCountDTO[];
  let productMetricsWithBrandValuesMock: ProductMetrics;
  let productMetricsWithSkuValuesMock: ProductMetrics;
  let productMetricsWithCombinedValuesMock: ProductMetrics;
  let productMetricsBrandsDTOMock: ProductMetricsDTO;
  let productMetricsSkuDTOMock: ProductMetricsDTO;

  let accountsApiServiceMock: any;
  let distributorsApiServiceMock: any;
  let positionsApiServiceMock: any;
  let productMetricsTransformerServiceMock: any;
  let subAccountsApiServiceMock: any;

  let accountsApiService: AccountsApiService;
  let distributorsApiService: DistributorsApiService;
  let positionsApiService: PositionsApiService;
  let productMetricsService: ProductMetricsService;
  let productMetricsTransformerService: ProductMetricsTransformerService;
  let subAccountsApiService: SubAccountsApiService;

  beforeEach(() => {
    positionIdMock = chance.string();
    contextPositionIdMock = chance.string();
    entityTypeCodeMock = chance.string();
    performanceFilterStateMock = getMyPerformanceFilterMock();
    selectedEntityTypeMock = getEntityTypeMock();

    opportunitiesGroupedByBrandSkuPackageCodeMock = getOpportunitiesGroupedByBrandSkuPackageCodeMock();
    opportunityCountDTOsMock = getOpportunityCountDTOsMock();
    productMetricsWithBrandValuesMock = getProductMetricsWithBrandValuesMock();
    productMetricsWithSkuValuesMock = getProductMetricsWithSkuValuesMock(SkuPackageType.package);
    productMetricsWithCombinedValuesMock = Object.assign({}, productMetricsWithBrandValuesMock, productMetricsWithSkuValuesMock);
    productMetricsBrandsDTOMock = getProductMetricsBrandDTOMock();
    productMetricsSkuDTOMock = getProductMetricsSkuDTOMock();

    accountsApiServiceMock = {
      getAccountProductMetrics(
        accountId: string,
        positionId: string,
        aggregationLevel: ProductMetricsAggregationType,
        filter: MyPerformanceFilterState
      ) {
        return aggregationLevel === ProductMetricsAggregationType.brand
          ? Observable.of(productMetricsBrandsDTOMock)
          : Observable.of(productMetricsSkuDTOMock);
      }
    };

    distributorsApiServiceMock = {
      getDistributorOpportunityCounts() {
        return Observable.of(opportunityCountDTOsMock);
      },
      getDistributorProductMetrics(
        distributorId: string,
        positionId: string,
        aggregationLevel: ProductMetricsAggregationType,
        filter: MyPerformanceFilterState
      ) {
        return aggregationLevel === ProductMetricsAggregationType.brand
          ? Observable.of(productMetricsBrandsDTOMock)
          : Observable.of(productMetricsSkuDTOMock);
      }
    };

    positionsApiServiceMock = {
      getAlternateHierarchyPersonProductMetrics(
        positionId: string,
        alternateHierarchyPositionId: string,
        aggregationLevel: ProductMetricsAggregationType,
        filter: MyPerformanceFilterState
      ) {
        return aggregationLevel === ProductMetricsAggregationType.brand
          ? Observable.of(productMetricsBrandsDTOMock)
          : Observable.of(productMetricsSkuDTOMock);
      },
      getAlternateHierarchyRoleGroupProductMetrics(
        positionId: string,
        groupTypeCode: EntityType,
        alternateHierarchyPositionId: string,
        aggregationLevel: ProductMetricsAggregationType,
        filter: MyPerformanceFilterState
      ) {
        return aggregationLevel === ProductMetricsAggregationType.brand
          ? Observable.of(productMetricsBrandsDTOMock)
          : Observable.of(productMetricsSkuDTOMock);
      },
      getPersonProductMetrics(
        positionId: string,
        aggregationLevel: ProductMetricsAggregationType,
        filter: MyPerformanceFilterState
      ) {
        return aggregationLevel === ProductMetricsAggregationType.brand
          ? Observable.of(productMetricsBrandsDTOMock)
          : Observable.of(productMetricsSkuDTOMock);
      },
      getRoleGroupProductMetrics(
        positionId: string,
        groupTypeCode: string,
        aggregationLevel: ProductMetricsAggregationType,
        filter: MyPerformanceFilterState
      ) {
        return aggregationLevel === ProductMetricsAggregationType.brand
          ? Observable.of(productMetricsBrandsDTOMock)
          : Observable.of(productMetricsSkuDTOMock);
      }
    };

    subAccountsApiServiceMock = {
      getSubAccountOpportunityCounts() {
        return Observable.of(opportunityCountDTOsMock);
      },
      getSubAccountProductMetrics(
        subAccountId: string,
        positionId: string,
        aggregationLevel: ProductMetricsAggregationType,
        filter: MyPerformanceFilterState
      ) {
        return aggregationLevel === ProductMetricsAggregationType.brand
          ? Observable.of(productMetricsBrandsDTOMock)
          : Observable.of(productMetricsSkuDTOMock);
      }
    };

    productMetricsTransformerServiceMock = {
      transformAndCombineProductMetricsDTOs(dtos: ProductMetricsDTO[]): ProductMetrics {
        return dtos.length === 1 ? productMetricsWithBrandValuesMock : productMetricsWithCombinedValuesMock;
      },
      transformAndGroupOpportunityCounts(dtos: OpportunityCountDTO[]): OpportunitiesGroupedByBrandSkuPackageCode {
        return opportunitiesGroupedByBrandSkuPackageCodeMock;
      }
    };

    TestBed.configureTestingModule({
      providers: [
        ProductMetricsService,
        {
          provide: AccountsApiService,
          useValue: accountsApiServiceMock
        },
        {
          provide: DistributorsApiService,
          useValue: distributorsApiServiceMock
        },
        {
          provide: PositionsApiService,
          useValue: positionsApiServiceMock
        },
        {
          provide: ProductMetricsTransformerService,
          useValue: productMetricsTransformerServiceMock
        },
        {
          provide: SubAccountsApiService,
          useValue: subAccountsApiServiceMock
        }
      ]
    });
  });

  beforeEach(inject([
    AccountsApiService,
    DistributorsApiService,
    PositionsApiService,
    ProductMetricsService,
    ProductMetricsTransformerService ,
    SubAccountsApiService
  ], (_accountsApiService: AccountsApiService,
    _distributorsApiService: DistributorsApiService,
    _positionsApiService: PositionsApiService,
    _productMetricsService: ProductMetricsService,
    _productMetricsTransformerService: ProductMetricsTransformerService,
    _subAccountsApiService: SubAccountsApiService
  ) => {
    accountsApiService = _accountsApiService;
    distributorsApiService = _distributorsApiService;
    positionsApiService = _positionsApiService;
    productMetricsService = _productMetricsService;
    productMetricsTransformerService = _productMetricsTransformerService;
    subAccountsApiService = _subAccountsApiService;
  }));

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
      getPositionProductMetricsSpy = spyOn(positionsApiService, 'getPersonProductMetrics').and.callThrough();
      getAccountProductMetricsSpy = spyOn(accountsApiService, 'getAccountProductMetrics').and.callThrough();
      getSubAccountProductMetricsSpy = spyOn(subAccountsApiService, 'getSubAccountProductMetrics').and.callThrough();
      getDistributorProductMetricsSpy = spyOn(distributorsApiService, 'getDistributorProductMetrics').and.callThrough();
      getRoleGroupProductMetricsSpy = spyOn(positionsApiService, 'getRoleGroupProductMetrics').and.callThrough();
      transformProductMetricsSpy = spyOn(productMetricsTransformerService, 'transformAndCombineProductMetricsDTOs').and.callThrough();
      getAlternateHierarchyProductMetricsSpy =
        spyOn(positionsApiService, 'getAlternateHierarchyRoleGroupProductMetrics').and.callThrough();
      getAlternateHierarchyProductMetricsForPositionSpy
        = spyOn(positionsApiService, 'getAlternateHierarchyPersonProductMetrics').and.callThrough();

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
                productMetricsDataMock.contextPositionId,
                ProductMetricsAggregationType.brand,
                productMetricsDataMock.filter
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
                productMetricsDataMock.contextPositionId,
                ProductMetricsAggregationType.sku,
                productMetricsDataMock.filter
              ]);
              expect(getAlternateHierarchyProductMetricsForPositionSpy.calls.argsFor(1)).toEqual([
                productMetricsDataMock.positionId,
                productMetricsDataMock.contextPositionId,
                ProductMetricsAggregationType.brand,
                productMetricsDataMock.filter
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
                productMetricsDataMock.contextPositionId,
                ProductMetricsAggregationType.brand,
                productMetricsDataMock.filter
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
                productMetricsDataMock.contextPositionId,
                ProductMetricsAggregationType.sku,
                productMetricsDataMock.filter
              ]);
              expect(getAlternateHierarchyProductMetricsSpy.calls.argsFor(1)).toEqual([
                productMetricsDataMock.positionId,
                productMetricsDataMock.entityTypeCode,
                productMetricsDataMock.contextPositionId,
                ProductMetricsAggregationType.brand,
                productMetricsDataMock.filter
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
                ProductMetricsAggregationType.brand,
                productMetricsDataMock.filter
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
                ProductMetricsAggregationType.sku,
                productMetricsDataMock.filter
              ]);
              expect(getDistributorProductMetricsSpy.calls.argsFor(1)).toEqual([
                productMetricsDataMock.positionId,
                '0',
                ProductMetricsAggregationType.brand,
                productMetricsDataMock.filter
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
                ProductMetricsAggregationType.brand,
                productMetricsDataMock.filter
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
                ProductMetricsAggregationType.sku,
                productMetricsDataMock.filter
              ]);
              expect(getDistributorProductMetricsSpy.calls.argsFor(1)).toEqual([
                productMetricsDataMock.positionId,
                productMetricsDataMock.contextPositionId,
                ProductMetricsAggregationType.brand,
                productMetricsDataMock.filter
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
              ProductMetricsAggregationType.brand,
              productMetricsDataMock.filter
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
              ProductMetricsAggregationType.sku,
              productMetricsDataMock.filter
            ]);
            expect(getPositionProductMetricsSpy.calls.argsFor(1)).toEqual([
              productMetricsDataMock.positionId,
              ProductMetricsAggregationType.brand,
              productMetricsDataMock.filter
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
              ProductMetricsAggregationType.brand,
              productMetricsDataMock.filter
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
              ProductMetricsAggregationType.sku,
              productMetricsDataMock.filter
            ]);
            expect(getPositionProductMetricsSpy.calls.argsFor(1)).toEqual([
              productMetricsDataMock.positionId,
              ProductMetricsAggregationType.brand,
              productMetricsDataMock.filter
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
              ProductMetricsAggregationType.brand,
              productMetricsDataMock.filter
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
              ProductMetricsAggregationType.sku,
              productMetricsDataMock.filter
            ]);
            expect(getAccountProductMetricsSpy.calls.argsFor(1)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.contextPositionId,
              ProductMetricsAggregationType.brand,
              productMetricsDataMock.filter
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
              ProductMetricsAggregationType.brand,
              productMetricsDataMock.filter
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
              ProductMetricsAggregationType.sku,
              productMetricsDataMock.filter
            ]);
            expect(getSubAccountProductMetricsSpy.calls.argsFor(1)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.contextPositionId,
              ProductMetricsAggregationType.brand,
              productMetricsDataMock.filter
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
              ProductMetricsAggregationType.brand,
              productMetricsDataMock.filter
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
              ProductMetricsAggregationType.sku,
              productMetricsDataMock.filter
            ]);
            expect(getDistributorProductMetricsSpy.calls.argsFor(1)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.contextPositionId,
              ProductMetricsAggregationType.brand,
              productMetricsDataMock.filter
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
              ProductMetricsAggregationType.brand,
              productMetricsDataMock.filter
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
              ProductMetricsAggregationType.sku,
              productMetricsDataMock.filter
            ]);
            expect(getRoleGroupProductMetricsSpy.calls.argsFor(1)).toEqual([
              productMetricsDataMock.positionId,
              productMetricsDataMock.entityTypeCode,
              ProductMetricsAggregationType.brand,
              productMetricsDataMock.filter
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
        const getOpportunityCountsSpy = spyOn(subAccountsApiService, 'getSubAccountOpportunityCounts').and.callThrough();
        const expectedPremiseTypeValue = PremiseTypeValue[fetchOpportunityCountsMock.filter.premiseType].toLowerCase();

        productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe(() => {
          done();
        });

        expect(getOpportunityCountsSpy.calls.count()).toBe(1);
        expect(getOpportunityCountsSpy.calls.argsFor(0)).toEqual([
          fetchOpportunityCountsMock.subAccountId,
          fetchOpportunityCountsMock.positionId,
          expectedPremiseTypeValue,
          ProductMetricsServiceConstants.opportunityCountStructureType,
          ProductMetricsServiceConstants.opportunitySegment,
          ProductMetricsServiceConstants.opportunityImpact,
          ProductMetricsServiceConstants.opportunityType
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
        productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe(
          (response: OpportunitiesGroupedByBrandSkuPackageCode) => {

          expect(response).toEqual(opportunitiesGroupedByBrandSkuPackageCodeMock);
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
          const getOpportunityCountsSpy = spyOn(distributorsApiService, 'getDistributorOpportunityCounts').and.callThrough();
          const expectedPremiseTypeValue = PremiseTypeValue[fetchOpportunityCountsMock.filter.premiseType].toLowerCase();

          productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe(() => {
            done();
          });

          expect(getOpportunityCountsSpy.calls.count()).toBe(1);
          expect(getOpportunityCountsSpy.calls.argsFor(0)).toEqual([
            fetchOpportunityCountsMock.distributorId,
            fetchOpportunityCountsMock.positionId,
            expectedPremiseTypeValue,
            ProductMetricsServiceConstants.opportunityCountStructureType,
            ProductMetricsServiceConstants.opportunitySegment,
            ProductMetricsServiceConstants.opportunityImpact,
            ProductMetricsServiceConstants.opportunityType
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
          const getOpportunityCountsSpy = spyOn(distributorsApiService, 'getDistributorOpportunityCounts').and.callThrough();
          const expectedPremiseTypeValue = PremiseTypeValue[fetchOpportunityCountsMock.filter.premiseType].toLowerCase();

          productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe(() => {
            done();
          });

          expect(getOpportunityCountsSpy.calls.count()).toBe(1);
          expect(getOpportunityCountsSpy.calls.argsFor(0)).toEqual([
            fetchOpportunityCountsMock.distributorId,
            undefined,
            expectedPremiseTypeValue,
            ProductMetricsServiceConstants.opportunityCountStructureType,
            ProductMetricsServiceConstants.opportunitySegment,
            ProductMetricsServiceConstants.opportunityImpact,
            ProductMetricsServiceConstants.opportunityType
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
          const getOpportunityCountsSpy = spyOn(distributorsApiService, 'getDistributorOpportunityCounts').and.callThrough();
          const expectedPremiseTypeValue = PremiseTypeValue[fetchOpportunityCountsMock.filter.premiseType].toLowerCase();

          productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe(() => {
            done();
          });

          expect(getOpportunityCountsSpy.calls.count()).toBe(1);
          expect(getOpportunityCountsSpy.calls.argsFor(0)).toEqual([
            fetchOpportunityCountsMock.distributorId,
            fetchOpportunityCountsMock.alternateHierarchyId,
            expectedPremiseTypeValue,
            ProductMetricsServiceConstants.opportunityCountStructureType,
            ProductMetricsServiceConstants.opportunitySegment,
            ProductMetricsServiceConstants.opportunityImpact,
            ProductMetricsServiceConstants.opportunityType
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
          productMetricsService.getOpportunityCounts(fetchOpportunityCountsMock).subscribe(
            (response: OpportunitiesGroupedByBrandSkuPackageCode) => {

            expect(response).toEqual(opportunitiesGroupedByBrandSkuPackageCodeMock);
            done();
          });
        });
      });
    });
  });
});
