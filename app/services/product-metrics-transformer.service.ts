import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { CalculatorService } from './calculator.service';
import { GroupedOpportunityCounts, OpportunityCount } from '../models/opportunity-count.model';
import { OpportunityCountDTO } from '../models/opportunity-count-dto.model';
import { ProductMetricsDTO, ProductMetricsValuesDTO } from '../models/product-metrics.model';
import { ProductMetrics, ProductMetricsValues } from '../models/product-metrics.model';

@Injectable()
export class ProductMetricsTransformerService {
  constructor(private calculatorService: CalculatorService) { }

  public transformAndCombineProductMetricsDTOs(dtos: ProductMetricsDTO[]): ProductMetrics {
    const metrics: ProductMetrics[] = dtos.map(dto => this.transformProductMetricsDTO(dto));

    // combine brand and sku metrics into single metrics object via property assignment
    return Object.assign({}, ...metrics);
  }

  public transformAndGroupOpportunityCountDTOs(dtos: Array<OpportunityCountDTO>): GroupedOpportunityCounts {
    return dtos.reduce((groupedOpportunityCounts: GroupedOpportunityCounts, dto: OpportunityCountDTO) => {
      groupedOpportunityCounts[dto.label] = {
        total: dto.count,
        opportunities: this.formatOpportunityCounts(dto.items)
      };

      return groupedOpportunityCounts;
    }, {});
  }

  private formatOpportunityCounts(opportunityCounts: Array<OpportunityCountDTO>): Array<OpportunityCount> {
    return opportunityCounts.map((opportunityCount: OpportunityCountDTO) => {
      return {
        name: opportunityCount.label,
        count: opportunityCount.count
      };
    });
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
      yearAgo: this.calculatorService.getYearAgoDelta(valuesDTO.values[0].current, valuesDTO.values[0].yearAgo),
      yearAgoPercent: this.calculatorService.getYearAgoPercent(valuesDTO.values[0].current, valuesDTO.values[0].yearAgo),
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
