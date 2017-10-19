import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { ProductMetricsDTO, ProductMetricsValuesDTO } from '../models/product-metrics.model';
import { ProductMetrics, ProductMetricsValues } from '../models/product-metrics.model';
import { UtilService } from './util.service';

@Injectable()
export class ProductMetricsTransformerService {
  constructor(private utilService: UtilService) { }

  public transformProductMetrics(productMetricsDTOs: ProductMetricsDTO): ProductMetrics {
    return productMetricsDTOs.brandValues
      ? { brandValues: productMetricsDTOs.brandValues.map((productMetricsValuesDTO: ProductMetricsValuesDTO) => {
          return this.formatProductMetricsDTO(productMetricsValuesDTO);
        })}
      : { skuValues: productMetricsDTOs.skuValues.map((productMetricsValuesDTO: ProductMetricsValuesDTO) => {
          return this.formatProductMetricsSkuDTO(productMetricsValuesDTO);
        })};
  }

  private formatProductMetricsDTO(productMetricsDTO: ProductMetricsValuesDTO): ProductMetricsValues {
    return {
      brandDescription: productMetricsDTO.brandDescription,
      collectionMethod: productMetricsDTO.values[0].collectionMethod,
      current: Math.round(productMetricsDTO.values[0].current),
      yearAgo: this.utilService.getYearAgoDelta(productMetricsDTO.values[0].current, productMetricsDTO.values[0].yearAgo),
      yearAgoPercent: this.utilService.getYearAgoPercent(productMetricsDTO.values[0].current, productMetricsDTO.values[0].yearAgo),
      brandCode: productMetricsDTO.brandCode,
    };
  }

  private formatProductMetricsSkuDTO(productMetricsDTO: ProductMetricsValuesDTO): ProductMetricsValues {
    return Object.assign({}, this.formatProductMetricsDTO(productMetricsDTO), {
      beerId: productMetricsDTO.beerId
    });
  }
}
