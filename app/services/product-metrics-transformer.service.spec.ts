import { inject, TestBed } from '@angular/core/testing';

import { CalculatorService } from './calculator.service';
import { getOpportunityCountDTOsMock } from '../models/opportunity-count-dto.model.mock';
import { getOpportunityTypeMock } from '../enums/opportunity.enum.mock';
import { getProductMetricsBrandDTOMock, getProductMetricsSkuDTOMock } from '../models/product-metrics.model.mock';
import { OpportunitiesGroupedByBrandSkuPackageCode } from '../models/opportunity-count.model';
import { OpportunityCount } from '../models/opportunity-count.model';
import { OpportunityType, OpportunityTypeLabel } from '../enums/opportunity.enum';
import { OpportunityCountDTO } from '../models/opportunity-count-dto.model';
import { ProductMetrics, ProductMetricsValues, ProductMetricsDTO } from '../models/product-metrics.model';
import { ProductMetricsTransformerService } from './product-metrics-transformer.service';

describe('Service: ProductMetricsTransformerService', () => {
  let calculatorService: CalculatorService;
  let productMetricsTransformerService: ProductMetricsTransformerService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      CalculatorService,
      ProductMetricsTransformerService
    ]
  }));

  beforeEach(inject([ ProductMetricsTransformerService, CalculatorService ],
    (_productMetricsTransformerService: ProductMetricsTransformerService, _calculatorService: CalculatorService) => {
      productMetricsTransformerService = _productMetricsTransformerService;
      calculatorService = _calculatorService;
  }));

  describe('transformAndCombineProductMetricsDTOs', () => {
    it('should return a collection of formatted ProductMetrics with both brandValues and skuValues', () => {
      const productMetricsBrandDTOMock: ProductMetricsDTO = getProductMetricsBrandDTOMock();
      const productMetricsSkuDTOMock: ProductMetricsDTO = getProductMetricsSkuDTOMock();

      const transformedProductMetrics: ProductMetrics =
        productMetricsTransformerService.transformAndCombineProductMetricsDTOs([
          productMetricsBrandDTOMock,
          productMetricsSkuDTOMock
        ]);

      expect(transformedProductMetrics.brandValues).toBeDefined();
      expect(transformedProductMetrics.skuValues).toBeDefined();
      expect(transformedProductMetrics.brandValues.length).toBe(productMetricsBrandDTOMock.brandValues.length);
      expect(transformedProductMetrics.skuValues.length).toBe(productMetricsSkuDTOMock.skuValues.length);

      for (let i = 0; i < productMetricsBrandDTOMock.brandValues.length; i++) {
        const expectedValues: ProductMetricsValues = {
          brandDescription: productMetricsBrandDTOMock.brandValues[i].brandDescription,
          current: parseInt((productMetricsBrandDTOMock.brandValues[i].values[0].current).toFixed(), 10),
          yearAgo: calculatorService.getYearAgoDelta(
            productMetricsBrandDTOMock.brandValues[i].values[0].current,
            productMetricsBrandDTOMock.brandValues[i].values[0].yearAgo),
          collectionMethod: productMetricsBrandDTOMock.brandValues[i].values[0].collectionMethod,
          yearAgoPercent: calculatorService.getYearAgoPercent(
            productMetricsBrandDTOMock.brandValues[i].values[0].current,
            productMetricsBrandDTOMock.brandValues[i].values[0].yearAgo),
          brandCode: productMetricsBrandDTOMock.brandValues[i].brandCode
        };

        expect(transformedProductMetrics.brandValues[i]).toEqual(expectedValues);
      }

      for (let i = 0; i < productMetricsSkuDTOMock.skuValues.length; i++) {
        let expectedValues: ProductMetricsValues = {
          brandDescription: productMetricsSkuDTOMock.skuValues[i].brandDescription,
          current: parseInt((productMetricsSkuDTOMock.skuValues[i].values[0].current).toFixed(), 10),
          yearAgo: calculatorService.getYearAgoDelta(
            productMetricsSkuDTOMock.skuValues[i].values[0].current,
            productMetricsSkuDTOMock.skuValues[i].values[0].yearAgo),
          collectionMethod: productMetricsSkuDTOMock.skuValues[i].values[0].collectionMethod,
          yearAgoPercent: calculatorService.getYearAgoPercent(
            productMetricsSkuDTOMock.skuValues[i].values[0].current,
            productMetricsSkuDTOMock.skuValues[i].values[0].yearAgo),
          brandCode: productMetricsSkuDTOMock.skuValues[i].brandCode,
          beerId: { }
        };

        if (productMetricsSkuDTOMock.skuValues[i].beerId.masterSKUCode) {
          expectedValues.beerId.masterSKUCode = productMetricsSkuDTOMock.skuValues[i].beerId.masterSKUCode;
          expectedValues.beerId.masterSKUDescription = productMetricsSkuDTOMock.skuValues[i].beerId.masterSKUDescription;
        } else {
          expectedValues.beerId.masterPackageSKUCode = productMetricsSkuDTOMock.skuValues[i].beerId.masterPackageSKUCode;
          expectedValues.beerId.masterPackageSKUDescription = productMetricsSkuDTOMock.skuValues[i].beerId.masterPackageSKUDescription;
        }

        expect(transformedProductMetrics.skuValues[i]).toEqual(expectedValues);
      }
    });
  });

  describe('transformAndGroupOpportunityCounts', () => {
    let opportunityCountDTOMock: Array<OpportunityCountDTO>;

    beforeEach(() => {
      opportunityCountDTOMock = getOpportunityCountDTOsMock();
    });

    it('should return GroupedOpportunityCounts containing each brand/sku/package opportunity count total', () => {
      const transformedOpportunityCounts: OpportunitiesGroupedByBrandSkuPackageCode
        = productMetricsTransformerService.transformAndGroupOpportunityCounts(opportunityCountDTOMock);
      let brandOpportunityCountTotal: number = 0;

      opportunityCountDTOMock.forEach((brandOpportunityCount: OpportunityCountDTO) => {
        expect(transformedOpportunityCounts[brandOpportunityCount.label].brandSkuPackageOpportunityCountTotal).toBeDefined();

        brandOpportunityCount.items.forEach((skuPackageOpportunityCount: OpportunityCountDTO) => {
          brandOpportunityCountTotal += skuPackageOpportunityCount.count;
          expect(transformedOpportunityCounts[skuPackageOpportunityCount.label].brandSkuPackageOpportunityCountTotal).toBeDefined();
          expect(transformedOpportunityCounts[skuPackageOpportunityCount.label].brandSkuPackageOpportunityCountTotal)
            .toBe(skuPackageOpportunityCount.count);
        });

        expect(transformedOpportunityCounts[brandOpportunityCount.label].brandSkuPackageOpportunityCountTotal)
          .toBe(brandOpportunityCountTotal);
        brandOpportunityCountTotal = 0;
      });
    });

    it('should return GroupedOpportunityCounts containing the sum of each opportunity type count for each Brand`s Skus/Packages', () => {
      const transformedOpportunityCounts: OpportunitiesGroupedByBrandSkuPackageCode =
        productMetricsTransformerService.transformAndGroupOpportunityCounts(opportunityCountDTOMock);

      opportunityCountDTOMock.forEach((brandOpportunityCount: OpportunityCountDTO) => {
        const expectedBrandOpportunityTypeCounts = {};

        brandOpportunityCount.items.forEach((skuPackageOpportunityCount: OpportunityCountDTO) => {
          skuPackageOpportunityCount.items.forEach((skuPackageOpportunityTypeCount: OpportunityCountDTO) => {
            expectedBrandOpportunityTypeCounts[skuPackageOpportunityTypeCount.label]
              ? expectedBrandOpportunityTypeCounts[skuPackageOpportunityTypeCount.label] += skuPackageOpportunityTypeCount.count
              : expectedBrandOpportunityTypeCounts[skuPackageOpportunityTypeCount.label] = skuPackageOpportunityTypeCount.count;
          });
        });

        transformedOpportunityCounts[brandOpportunityCount.label].opportunityCounts.forEach((opportunityCount: OpportunityCount) => {
          expect(expectedBrandOpportunityTypeCounts[opportunityCount.name]).toBeTruthy();
          expect(expectedBrandOpportunityTypeCounts[opportunityCount.name]).toBe(opportunityCount.count);
        });
      });
    });

    it('should return GroupedOpportunityCounts containing each individual sku/package opportunity type counts', () => {
      const transformedOpportunityCounts: OpportunitiesGroupedByBrandSkuPackageCode =
        productMetricsTransformerService.transformAndGroupOpportunityCounts(opportunityCountDTOMock);

      opportunityCountDTOMock.forEach((brandOpportunityCount: OpportunityCountDTO) => {
        brandOpportunityCount.items.forEach((skuPackageOpportunityCount: OpportunityCountDTO) => {
          skuPackageOpportunityCount.items.forEach((skuPackageOpportunityTypeCount: OpportunityCountDTO) => {
            const expectedSkuPackageOpportunityCount: OpportunityCount =
              transformedOpportunityCounts[skuPackageOpportunityCount.label].opportunityCounts.find(opportunityCount =>
                opportunityCount.name === skuPackageOpportunityTypeCount.label
                && opportunityCount.count === skuPackageOpportunityTypeCount.count);

            expect(expectedSkuPackageOpportunityCount).toEqual({
              name: skuPackageOpportunityTypeCount.label,
              count: skuPackageOpportunityTypeCount.count
            });
          });
        });
      });
    });

    it('should return Opportunity Types with transformed names if an OpportunityTypeLabel enum is matched', () => {
      const opportunityTypeMock: OpportunityType = getOpportunityTypeMock();
      const expectedOpportunityTypeLabel: OpportunityTypeLabel = OpportunityTypeLabel[opportunityTypeMock];

      opportunityCountDTOMock[0].items.forEach((skuPackageOpportunityCount: OpportunityCountDTO) => {
        skuPackageOpportunityCount.items.forEach((skuPackageOpportunityType) => {
          skuPackageOpportunityType.label = opportunityTypeMock;
        });
      });

      const transformedOpportunityCounts: OpportunitiesGroupedByBrandSkuPackageCode =
        productMetricsTransformerService.transformAndGroupOpportunityCounts(opportunityCountDTOMock);

      transformedOpportunityCounts[opportunityCountDTOMock[0].label].opportunityCounts.forEach((opportunityCount: OpportunityCount) => {
        expect(opportunityCount.name).toBe(expectedOpportunityTypeLabel);
      });
    });

    it('should not return Opportunity Types with OpportunityTypeLabel enum names if there is no match', () => {
      const transformedOpportunityCounts: OpportunitiesGroupedByBrandSkuPackageCode =
        productMetricsTransformerService.transformAndGroupOpportunityCounts(opportunityCountDTOMock);

      transformedOpportunityCounts[opportunityCountDTOMock[0].label].opportunityCounts.forEach((opportunityCount: OpportunityCount) => {
        expect(OpportunityTypeLabel[opportunityCount.name]).toBe(undefined);
      });
    });
  });
});
