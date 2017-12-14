import { Action } from '@ngrx/store';
import { EffectsRunner, EffectsTestingModule } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';
import { TestBed, inject } from '@angular/core/testing';
import * as Chance from 'chance';

import { EntityType } from '../../enums/entity-responsibilities.enum';
import { FetchOpportunityCountsPayload } from '../actions/product-metrics.action';
import { getEntityTypeMock } from '../../enums/entity-responsibilities.enum.mock';
import { getGroupedOpportunityCountsMock } from '../../models/opportunity-count.model.mock';
import { getMyPerformanceFilterMock } from '../../models/my-performance-filter.model.mock';
import { getProductMetricsViewTypeMock } from '../../enums/product-metrics-view-type.enum.mock';
import { getProductMetricsWithBrandValuesMock, getProductMetricsWithSkuValuesMock } from '../../models/product-metrics.model.mock';
import { GroupedOpportunityCounts } from '../../models/opportunity-count.model';
import { MyPerformanceFilterState } from '../reducers/my-performance-filter.reducer';
import { ProductMetrics } from '../../models/product-metrics.model';
import * as ProductMetricsActions from '../actions/product-metrics.action';
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
  let groupedOpportunityCountsMock: GroupedOpportunityCounts;

  const productMetricsServiceMock = {
    getProductMetrics(productMetricsData: ProductMetricsData): Observable<ProductMetricsData> {
      return Observable.of(productMetricsData);
    },
    getOpportunityCounts(opportunityCountsPayload: FetchOpportunityCountsPayload): Observable<GroupedOpportunityCounts> {
      return Observable.of(groupedOpportunityCountsMock);
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
    groupedOpportunityCountsMock = getGroupedOpportunityCountsMock();
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

    describe('when ProductMetricsService returns successfully and productMetricsViewType is packages', () => {
      it('should return a SetProductMetricsViewType, FetchProductMetricsSuccess, and SelectBrandValues', (done) => {
        spyOn(productMetricsService, 'getProductMetrics').and.callFake((productMetricsData: ProductMetricsData) => {
          productMetricsData.products = productMetricsWithBrandValuesMock;
          productMetricsData.productMetricsViewType = ProductMetricsViewType.packages;
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
              new ProductMetricsActions.SetProductMetricsViewType(ProductMetricsViewType.packages),
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

  describe('when a FetchOpportunityCounts actions is received', () => {
    let actionPayloadMock: FetchOpportunityCountsPayload;

    beforeEach(() => {
      actionPayloadMock = {
        positionId: chance.string(),
        contextId: chance.string(),
        alternateHierarchyId: chance.string(),
        isMemberOfExceptionHierarchy: chance.bool(),
        selectedEntityType: getEntityTypeMock(),
        productMetricsViewType: getProductMetricsViewTypeMock(),
        filter: getMyPerformanceFilterMock()
      };

      runner.queue(new ProductMetricsActions.FetchOpportunityCounts(actionPayloadMock));
    });

    describe('when everything returns successfully', () => {
      it('should call getOpportunityCounts from the ProductMetricsService given the passed in action payload', (done) => {
        const getOpportunitiesSpy = spyOn(productMetricsService, 'getOpportunityCounts').and.callThrough();

        productMetricsEffects.fetchProductMetricOpportunityCounts$().subscribe(() => {
          done();
        });

        expect(getOpportunitiesSpy.calls.count()).toBe(1);
        expect(getOpportunitiesSpy.calls.argsFor(0)[0]).toEqual(actionPayloadMock);
      });

      it('should dispatch a FetchOpportunityCountsSuccess action with the returned GroupedOpportunityCounts', (done) => {
        productMetricsEffects.fetchProductMetricOpportunityCounts$().subscribe((action: Action) => {
          expect(action).toEqual(new ProductMetricsActions.FetchOpportunityCountsSuccess(groupedOpportunityCountsMock));
          done();
        });
      });
    });

    describe('when an error is returned from getOpportunityCounts', () => {
      it('should dispatch a FetchProductMetricsFailure action with the error', (done) => {
        spyOn(productMetricsService, 'getOpportunityCounts').and.returnValue(Observable.throw(error));

        productMetricsEffects.fetchProductMetricOpportunityCounts$().subscribe((response) => {
          expect(response).toEqual(new ProductMetricsActions.FetchOpportunityCountsFailure(error));
          done();
        });
      });
    });
  });
});
