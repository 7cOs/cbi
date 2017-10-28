import { inject, TestBed } from '@angular/core/testing';

import {
  getProductMetricsBrandDTOMock,
  getProductMetricsSkuDTOMock
} from '../models/product-metrics.model.mock';
import { ProductMetrics, ProductMetricsDTO, ProductMetricsValues } from '../models/product-metrics.model';
import { ProductMetricsTransformerService } from './product-metrics-transformer.service';
import { UtilService } from './util.service';

describe('Service: ProductMetricsTransformerService', () => {
  let utilService: UtilService;
  let productMetricsTransformerService: ProductMetricsTransformerService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ProductMetricsTransformerService, UtilService ]
  }));

  describe('transformAndCombineProductMetricsDTOs', () => {
    beforeEach(inject([ ProductMetricsTransformerService, UtilService ],
      (_productMetricsTransformerService: ProductMetricsTransformerService, _utilService: UtilService) => {
        productMetricsTransformerService = _productMetricsTransformerService;
        utilService = _utilService;
    }));

    it('should return a collection of formatted ProductMetrics with ', () => {
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
          yearAgo: utilService.getYearAgoDelta(
            productMetricsBrandDTOMock.brandValues[i].values[0].current,
            productMetricsBrandDTOMock.brandValues[i].values[0].yearAgo),
          collectionMethod: productMetricsBrandDTOMock.brandValues[i].values[0].collectionMethod,
          yearAgoPercent: utilService.getYearAgoPercent(
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
          yearAgo: utilService.getYearAgoDelta(
            productMetricsSkuDTOMock.skuValues[i].values[0].current,
            productMetricsSkuDTOMock.skuValues[i].values[0].yearAgo),
          collectionMethod: productMetricsSkuDTOMock.skuValues[i].values[0].collectionMethod,
          yearAgoPercent: utilService.getYearAgoPercent(
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
});
