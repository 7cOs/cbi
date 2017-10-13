import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { ProductMetricsDTO, ProductMetricsBrandValueDTO } from '../models/product-metrics.model';
import { ProductMetrics, ProductMetricsBrandValue } from '../models/product-metrics.model';
import { UtilService } from './util.service';

@Injectable()
export class ProductMetricsTransformerService {
  constructor(private utilService: UtilService) { }

  public transformProductMetrics(productMetricsDTOs: ProductMetricsDTO): ProductMetrics {
    return {
      brandValues: productMetricsDTOs.brandValues.map((entity: ProductMetricsBrandValueDTO) => {
        return this.formatProductMetricsDTO(entity);
      })
    };
  }

  private formatProductMetricsDTO(productMetricsDTO: ProductMetricsBrandValueDTO): ProductMetricsBrandValue {
    return {
      brandDescription: productMetricsDTO.brandDescription,
      collectionMethod: productMetricsDTO.values[0].collectionMethod,
      current: Math.round(productMetricsDTO.values[0].current),
      yearAgo: this.utilService.getYearAgoDelta(productMetricsDTO.values[0].current, productMetricsDTO.values[0].yearAgo),
      yearAgoPercent: this.utilService.getYearAgoPercent(productMetricsDTO.values[0].current, productMetricsDTO.values[0].yearAgo)
    };
  }
}
