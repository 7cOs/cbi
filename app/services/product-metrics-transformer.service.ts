import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { ProductMetricsDTO, ProductMetricsValuesDTO } from '../models/product-metrics.model';
import { ProductMetrics, ProductMetricsValues } from '../models/product-metrics.model';
import { UtilService } from './util.service';

@Injectable()
export class ProductMetricsTransformerService {
  constructor(private utilService: UtilService) { }

  public transformAndCombineProductMetricsDTOs(dtos: ProductMetricsDTO[]): ProductMetrics {
    const metrics: ProductMetrics[] = dtos.map(dto => this.transformProductMetricsDTO(dto));

    // combine brand and sku metrics into single metrics object via property assignment
    return Object.assign({}, ...metrics);
  }

  private transformProductMetricsDTO(dto: ProductMetricsDTO): ProductMetrics {
    let productMetrics: ProductMetrics;

    if (dto.brandValues) {
      productMetrics = {
        brandValues: dto.brandValues.map((productMetricsValuesDTO: ProductMetricsValuesDTO) =>
          this.formatProductMetricsValuesDTO(productMetricsValuesDTO)
        )
      };
    } else {
      productMetrics = {
        skuValues: dto.skuValues.map((productMetricsValuesDTO: ProductMetricsValuesDTO) =>
          this.formatProductMetricsPackageSkuDTO(productMetricsValuesDTO))
      };
    }

    return productMetrics;
  }

  private formatProductMetricsValuesDTO(valuesDTO: ProductMetricsValuesDTO): ProductMetricsValues {
    return {
      brandDescription: valuesDTO.brandDescription,
      collectionMethod: valuesDTO.values[0].collectionMethod,
      current: Math.round(valuesDTO.values[0].current),
      yearAgo: this.utilService.getYearAgoDelta(valuesDTO.values[0].current, valuesDTO.values[0].yearAgo),
      yearAgoPercent: this.utilService.getYearAgoPercent(valuesDTO.values[0].current, valuesDTO.values[0].yearAgo),
      brandCode: valuesDTO.brandCode,
    };
  }

  private formatProductMetricsPackageSkuDTO(valuesDTO: ProductMetricsValuesDTO): ProductMetricsValues {
    let beerId;

    if (valuesDTO.beerId.masterSKUCode) {
      beerId = {
        masterSKUCode: valuesDTO.beerId.masterSKUCode,
        masterSKUDescription: valuesDTO.beerId.masterSKUDescription,
      };
    } else {
      beerId = {
        masterPackageSKUCode: valuesDTO.beerId.masterPackageSKUCode,
        masterPackageSKUDescription: valuesDTO.beerId.masterPackageSKUDescription
      };
    }

    return Object.assign({}, this.formatProductMetricsValuesDTO(valuesDTO), { beerId: beerId });
  }
}
