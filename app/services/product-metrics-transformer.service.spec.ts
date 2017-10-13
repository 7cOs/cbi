import { inject, TestBed } from '@angular/core/testing';

import { ProductMetrics } from '../models/product-metrics.model';
import { ProductMetricsTransformerService } from './product-metrics-transformer.service';
import { productMetricsBrandDTOMock } from '../models/product-metrics.model.mock';
import { UtilService } from './util.service';

let utilService: UtilService;
let productMetricsTransformerService: ProductMetricsTransformerService;

describe('Service: ProductMetricsTransformerService', () => {
  beforeEach(() => TestBed.configureTestingModule({

    providers: [
      ProductMetricsTransformerService, UtilService ]
  }));

  describe('#groupProductsByBrand', () => {
    beforeEach(inject([ ProductMetricsTransformerService, UtilService ],
      (_productMetricsTransformerService: ProductMetricsTransformerService, _utilService: UtilService) => {
        productMetricsTransformerService = _productMetricsTransformerService;
        utilService = _utilService;
    }));

    it('should return a collection of formatted ProductMetrics from a collection of ProductMetricsDTOs', () => {
      spyOn(productMetricsTransformerService, 'transformProductMetrics').and.callThrough();
      const expectedProductBrands: ProductMetrics = {
        brandValues: [{
          brandDescription: 'CORONA FAMILIAR',
          current: parseInt((productMetricsBrandDTOMock.brandValues[0].values[0].current).toFixed(), 10),
          yearAgo: utilService.getYearAgoDelta(
            productMetricsBrandDTOMock.brandValues[0].values[0].current,
            productMetricsBrandDTOMock.brandValues[0].values[0].yearAgo),
          collectionMethod: 'RAD',
          yearAgoPercent: utilService.getYearAgoPercent(
            productMetricsBrandDTOMock.brandValues[0].values[0].current,
            productMetricsBrandDTOMock.brandValues[0].values[0].yearAgo)
        }, {
          brandDescription: 'CERVEZAS CLASICAS',
          current: parseInt((productMetricsBrandDTOMock.brandValues[1].values[0].current).toFixed(), 10),
          yearAgo: utilService.getYearAgoDelta(
            productMetricsBrandDTOMock.brandValues[1].values[0].current,
            productMetricsBrandDTOMock.brandValues[1].values[0].yearAgo),
          collectionMethod: 'RAD',
          yearAgoPercent: utilService.getYearAgoPercent(
            productMetricsBrandDTOMock.brandValues[1].values[0].current,
            productMetricsBrandDTOMock.brandValues[1].values[0].yearAgo)
        }]
      };
      const transformedProductMetrics =
        productMetricsTransformerService.transformProductMetrics(productMetricsBrandDTOMock);
      expect(transformedProductMetrics).toEqual(expectedProductBrands);
    });
  });
});
