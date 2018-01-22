import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { CalculatorService } from './calculator.service';
import { OpportunitiesGroupedByBrandSkuPackageCode, OpportunitiesGroupedBySkuPackageCode } from '../models/opportunity-count.model';
import { OpportunityCount } from '../models/opportunity-count.model';
import { OpportunityCountDTO } from '../models/opportunity-count-dto.model';
import { OpportunityTypeLabel } from '../enums/opportunity.enum';
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

  public transformAndGroupOpportunityCounts(dtos: OpportunityCountDTO[]): OpportunitiesGroupedByBrandSkuPackageCode {
    return dtos.reduce(
      (brandSkuPackageOpportunityCounts: OpportunitiesGroupedByBrandSkuPackageCode, brandOpportunityCountDTO: OpportunityCountDTO) => {

      const skuPackageGroupedOpportunities: OpportunitiesGroupedBySkuPackageCode = this.getOpportunitiesGroupedBySkuPackageCode(
        brandOpportunityCountDTO.items);

      brandSkuPackageOpportunityCounts[brandOpportunityCountDTO.label] = {
        brandSkuPackageOpportunityCountTotal: skuPackageGroupedOpportunities.skuPackageOpportunityCountTotal,
        opportunityCounts: skuPackageGroupedOpportunities.brandOpportunityCounts
      };

      return Object.assign(skuPackageGroupedOpportunities.opportunitiesGroupedBySkuPackageCode, brandSkuPackageOpportunityCounts);
    }, {});
  }

  private getOpportunitiesGroupedBySkuPackageCode(skuPackageOpportunitiesDTO: OpportunityCountDTO[]): OpportunitiesGroupedBySkuPackageCode {
    const groupedBrandOpportunityCounts: { [key: string]: number } = {};

    const groupedOpportunities: OpportunitiesGroupedBySkuPackageCode = skuPackageOpportunitiesDTO.reduce(
      (opportunitiesGroupedBySkuPackageCode: OpportunitiesGroupedBySkuPackageCode, skuPackageOpportunityDTO: OpportunityCountDTO) => {
      const skuPackageOpportunityCounts: OpportunityCount[] = this.getOpportunityCounts(skuPackageOpportunityDTO.items);

      opportunitiesGroupedBySkuPackageCode.skuPackageOpportunityCountTotal += skuPackageOpportunityDTO.count;
      opportunitiesGroupedBySkuPackageCode.opportunitiesGroupedBySkuPackageCode[skuPackageOpportunityDTO.label] = {
        brandSkuPackageOpportunityCountTotal: skuPackageOpportunityDTO.count,
        opportunityCounts: skuPackageOpportunityCounts
      };

      skuPackageOpportunityCounts.forEach((opportunityCount: OpportunityCount) => {
        groupedBrandOpportunityCounts[opportunityCount.name] = groupedBrandOpportunityCounts[opportunityCount.name]
          ? groupedBrandOpportunityCounts[opportunityCount.name] += opportunityCount.count
          : groupedBrandOpportunityCounts[opportunityCount.name] = opportunityCount.count;
      });

      return opportunitiesGroupedBySkuPackageCode;
    }, {
      skuPackageOpportunityCountTotal: 0,
      opportunitiesGroupedBySkuPackageCode: {},
      brandOpportunityCounts: []
    });

    Object.keys(groupedBrandOpportunityCounts).forEach((opportunityTypeName: string) => {
      groupedOpportunities.brandOpportunityCounts.push({
        name: opportunityTypeName,
        count: groupedBrandOpportunityCounts[opportunityTypeName]
      });
    });

    return groupedOpportunities;
  }

  private getOpportunityCounts(skuPackageOpportunityCountsDTO: OpportunityCountDTO[]): OpportunityCount[] {
    return skuPackageOpportunityCountsDTO.map((skuPackageOpportunityType: OpportunityCountDTO) => {
      return {
        name: OpportunityTypeLabel[skuPackageOpportunityType.label] || skuPackageOpportunityType.label,
        count: skuPackageOpportunityType.count
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
