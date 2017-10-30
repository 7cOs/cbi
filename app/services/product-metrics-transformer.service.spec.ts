import { inject, TestBed } from '@angular/core/testing';

import { CalculatorService } from './calculator.service';
import { getProductMetricsSkuValuesDTOMock, getProductMetricsDTOBrandMock } from '../models/product-metrics.model.mock';
import { ProductMetrics, ProductMetricsValuesDTO, ProductMetricsDTO } from '../models/product-metrics.model';
import { ProductMetricsTransformerService } from './product-metrics-transformer.service';

const chance = new Chance();

let calculatorService: CalculatorService;
let productMetricsTransformerService: ProductMetricsTransformerService;

describe('Service: ProductMetricsTransformerService', () => {
  beforeEach(() => TestBed.configureTestingModule({

    providers: [
      CalculatorService, ProductMetricsTransformerService ]
  }));

  describe('#groupProductsByBrand', () => {
    beforeEach(inject([ ProductMetricsTransformerService, CalculatorService ],
      (_productMetricsTransformerService: ProductMetricsTransformerService, _calculatorService: CalculatorService) => {
        productMetricsTransformerService = _productMetricsTransformerService;
        calculatorService = _calculatorService;
    }));

    it('should return a collection of formatted ProductMetrics from a collection of ProductMetricsDTOs', () => {
      const productMetricsBrandDTOMock: ProductMetricsDTO = getProductMetricsDTOBrandMock(2, 2);

      const expectedProductMetrics: ProductMetrics = {
        brandValues: [{
          brandDescription: productMetricsBrandDTOMock.brandValues[0].brandDescription,
          current: parseInt((productMetricsBrandDTOMock.brandValues[0].values[0].current).toFixed(), 10),
          yearAgo: calculatorService.getYearAgoDelta(
            productMetricsBrandDTOMock.brandValues[0].values[0].current,
            productMetricsBrandDTOMock.brandValues[0].values[0].yearAgo),
          collectionMethod: productMetricsBrandDTOMock.brandValues[0].values[0].collectionMethod,
          yearAgoPercent: calculatorService.getYearAgoPercent(
            productMetricsBrandDTOMock.brandValues[0].values[0].current,
            productMetricsBrandDTOMock.brandValues[0].values[0].yearAgo),
          brandCode: productMetricsBrandDTOMock.brandValues[0].brandCode
        }, {
          brandDescription: productMetricsBrandDTOMock.brandValues[1].brandDescription,
          current: parseInt((productMetricsBrandDTOMock.brandValues[1].values[0].current).toFixed(), 10),
          yearAgo: calculatorService.getYearAgoDelta(
            productMetricsBrandDTOMock.brandValues[1].values[0].current,
            productMetricsBrandDTOMock.brandValues[1].values[0].yearAgo),
          collectionMethod: productMetricsBrandDTOMock.brandValues[1].values[0].collectionMethod,
          yearAgoPercent: calculatorService.getYearAgoPercent(
            productMetricsBrandDTOMock.brandValues[1].values[0].current,
            productMetricsBrandDTOMock.brandValues[1].values[0].yearAgo),
            brandCode: productMetricsBrandDTOMock.brandValues[1].brandCode
        }]
      };
      const transformedProductMetrics =
        productMetricsTransformerService.transformProductMetrics(productMetricsBrandDTOMock);
      expect(transformedProductMetrics).toEqual(expectedProductMetrics);
    });

    it('should return a collection of formatted Sku ProductMetrics from a collection of ProductMetricsDTOs containing skus', () => {
      const productMectricsSkuDTOMock: ProductMetricsValuesDTO = getProductMetricsSkuValuesDTOMock();

      const expectedProductMetrics: ProductMetrics = {
        skuValues: [{
          brandDescription: productMectricsSkuDTOMock.brandDescription,
          collectionMethod: productMectricsSkuDTOMock.values[0].collectionMethod,
          current: Math.round(productMectricsSkuDTOMock.values[0].current),
          yearAgo: calculatorService.getYearAgoDelta(
            productMectricsSkuDTOMock.values[0].current,
            productMectricsSkuDTOMock.values[0].yearAgo
          ),
          yearAgoPercent: calculatorService.getYearAgoPercent(
            productMectricsSkuDTOMock.values[0].current,
            productMectricsSkuDTOMock.values[0].yearAgo
          ),
          brandCode: productMectricsSkuDTOMock.brandCode,
          beerId: {
            masterPackageSKUDescription: productMectricsSkuDTOMock.beerId.masterPackageSKUDescription,
            masterSKUDescription: productMectricsSkuDTOMock.beerId.masterSKUDescription
          }
        }]
      };
      const transformedProductMetrics =
        productMetricsTransformerService.transformProductMetrics({
          skuValues: [productMectricsSkuDTOMock],
          type: chance.string()
        });
      expect(transformedProductMetrics).toEqual(expectedProductMetrics);
    });
  });
});
