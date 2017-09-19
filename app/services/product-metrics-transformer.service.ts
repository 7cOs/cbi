import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { ProductMetricsDTO, ProductMetricsBrandValueDTO } from '../models/entity-product-metrics-dto.model';
import { ProductMetrics, ProductMetricsBrandValue } from '../models/product-metrics.model';
import { ProductMetricType } from '../enums/product-metrics-type.enum';
import { UtilService } from './util.service';

@Injectable()
export class ProductMetricsTransformerService {
  constructor(private utilService: UtilService) { }

  public transformProductMetrics(aggregation: ProductMetricType, productMetricsDTOs: ProductMetricsDTO): ProductMetrics {
    return productMetricsDTOs.brandValues.reduce((productMetrics: ProductMetrics, entity: ProductMetricsBrandValueDTO) => {
      if (Array.isArray(productMetrics[ProductMetricType[aggregation]])) {
        productMetrics[ProductMetricType[aggregation]].push(this.formatProductMetricsDTO(entity));
      } else {
        productMetrics[ProductMetricType[aggregation]] = [this.formatProductMetricsDTO(entity)];
      }
      return productMetrics;
    }, {});
  }

  private formatProductMetricsDTO(productMetricsDTO: ProductMetricsBrandValueDTO): ProductMetricsBrandValue {
    return {
      brandDescription: productMetricsDTO.brandDescription,
      current: parseInt((productMetricsDTO.values[0].current).toFixed(), 10),
      yearAgo: this.utilService.getYearAgoDelta(
        productMetricsDTO.values[0].current, productMetricsDTO.values[0].yearAgo),
      collectionMethod: productMetricsDTO.values[0].collectionMethod,
      yearAgoPercent: this.utilService.getYearAgoPercent(
        productMetricsDTO.values[0].current, productMetricsDTO.values[0].yearAgo)
    };
  }
}
