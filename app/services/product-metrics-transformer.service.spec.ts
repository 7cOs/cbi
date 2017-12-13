import { inject, TestBed } from '@angular/core/testing';

import { CalculatorService } from './calculator.service';
import { getOpportunityCountDTOsMock } from '../models/opportunity-count-dto.model.mock';
import { getProductMetricsBrandDTOMock, getProductMetricsSkuDTOMock } from '../models/product-metrics.model.mock';
import { GroupedOpportunityCounts } from '../models/opportunity-count.model';
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

    it('should return a GroupedOpportunityCounts object containing each brand/sku/package opportunity count total', () => {
      const transformedOpportunityCounts: GroupedOpportunityCounts = productMetricsTransformerService.transformAndGroupOpportunityCounts(
        opportunityCountDTOMock);

      opportunityCountDTOMock.forEach((brandOpportunityCount: OpportunityCountDTO) => {
        expect(transformedOpportunityCounts[brandOpportunityCount.label].total).toBeDefined();
        expect(transformedOpportunityCounts[brandOpportunityCount.label].total).toBe(brandOpportunityCount.count);

        brandOpportunityCount.items.forEach((skuPackageOpportunityCount: OpportunityCountDTO) => {
          expect(transformedOpportunityCounts[skuPackageOpportunityCount.label].total).toBeDefined();
          expect(transformedOpportunityCounts[skuPackageOpportunityCount.label].total).toBe(skuPackageOpportunityCount.count);
        });
      });
    });
  });
});
