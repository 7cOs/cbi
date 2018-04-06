import { Injectable } from '@angular/core';

import { CORPORATE_USER_POSITION_ID } from '../../containers/my-performance/my-performance.component';
import { EntityWithPerformance } from '../../models/entity-with-performance.model';
import { EntityPeopleType, EntityType } from '../../enums/entity-responsibilities.enum';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { OpportunitiesGroupedByBrandSkuPackageCode } from '../../models/opportunity-count.model';
import { PluralizedRoleGroup } from '../../enums/pluralized-role-group.enum';
import { Performance } from '../../models/performance.model';
import { ProductMetrics, ProductMetricsValues } from '../../models/product-metrics.model';
import { ProductMetricsViewType } from '../../enums/product-metrics-view-type.enum';
import { SkuPackageType  } from '../../enums/sku-package-type.enum';
import { SpecializedAccountName } from '../../enums/specialized-account-name.enum';

@Injectable()
export class MyPerformanceTableDataTransformerService {

  public getLeftTableData(entities: EntityWithPerformance[], altHierarchyId?: string): MyPerformanceTableRow[] {
    const total: number = entities.reduce((sum: number, entity: EntityWithPerformance): number => {
      return sum + entity.performance.total;
    }, 0);

    return entities.map((entity: EntityWithPerformance) => {
      const transformedEntity: MyPerformanceTableRow = {
        descriptionRow0: this.getDisplayName(entity.name, entity.entityType, entity.positionId),
        metricColumn0: entity.performance.total,
        metricColumn1: entity.performance.totalYearAgo,
        metricColumn2: entity.performance.totalYearAgoPercent,
        ctv:  total ? this.getPercentageOfTotal(entity.performance.total, total) : 0,
        metadata: {
          positionId: entity.positionId,
          entityType: entity.entityType,
          entityName: entity.name,
          exceptionHierarchy: entity.isMemberOfExceptionHierarchy
        },
        performanceError: entity.performance.error
      };

      if (entity.entityType === EntityType.Person) {
        if (altHierarchyId) {
          transformedEntity.descriptionRow0 = entity.positionDescription ? entity.positionDescription : 'AREA';
          transformedEntity.descriptionRow1 = entity.name;
        } else if (entity.name === 'Open') {
          transformedEntity.descriptionRow0 = 'Open Position';
          transformedEntity.descriptionRow1 = entity.positionDescription;
        }
      }

      if (entity.contextPositionId) transformedEntity.metadata.contextPositionId = entity.contextPositionId;
      if (entity.entityTypeCode) transformedEntity.metadata.entityTypeCode = entity.entityTypeCode;
      if (entity.alternateHierarchyId) transformedEntity.metadata.alternateHierarchyId = entity.alternateHierarchyId;

      if (entity.entityType === EntityType.Distributor || entity.entityType === EntityType.SubAccount) {
        transformedEntity.descriptionRow1 = 'GO TO DASHBOARD';
      }

      return transformedEntity;
    });
  }

  public getRightTableData(
    productMetrics: ProductMetrics,
    opportunitiesGroupedByBrandSkuPackageCode: OpportunitiesGroupedByBrandSkuPackageCode,
    productMetricsViewType: ProductMetricsViewType
  ): MyPerformanceTableRow[] {
    const productsValues: ProductMetricsValues[] = productMetricsViewType === ProductMetricsViewType.brands
      ? productMetrics.brandValues : productMetrics.skuValues;
    const total: number = productsValues.reduce((sum: number, productMetricsValues: ProductMetricsValues): number => {
      return sum + productMetricsValues.current;
    }, 0);

    const rowData: MyPerformanceTableRow[] = productsValues.map((productMetricsValues: ProductMetricsValues) => {
      const rightTableData: MyPerformanceTableRow = {
        descriptionRow0: productMetricsViewType === ProductMetricsViewType.brands
          ? productMetricsValues.brandDescription
          : productMetricsValues.beerId.masterPackageSKUDescription || productMetricsValues.beerId.masterSKUDescription,
        metricColumn0: productMetricsValues.current,
        metricColumn1: productMetricsValues.yearAgo,
        metricColumn2: productMetricsValues.yearAgoPercent,
        ctv: total ? this.getPercentageOfTotal(productMetricsValues.current, total) : 0,
        metadata: {}
      };

      if (productMetricsViewType === ProductMetricsViewType.brands) {
        rightTableData.metadata.brandCode = productMetricsValues.brandCode;
      } else {
        rightTableData.metadata.skuPackageType = productMetricsValues.beerId.masterPackageSKUCode
          ? SkuPackageType.package
          : SkuPackageType.sku;
        rightTableData.metadata.skuPackageCode = productMetricsValues.beerId.masterPackageSKUCode
          || productMetricsValues.beerId.masterSKUCode;
      }

      if (opportunitiesGroupedByBrandSkuPackageCode) {
        rightTableData.opportunities = this.matchProductMetricOpportunityCounts(
          productMetricsValues, opportunitiesGroupedByBrandSkuPackageCode, productMetricsViewType);
      }

      return rightTableData;
    });

    return rowData.filter((row: MyPerformanceTableRow) => {
      return (row.metricColumn0 !== 0 || row.metricColumn1 !== 0);
    });
  }

  public getTotalRowData(performance: Performance): MyPerformanceTableRow {
    return {
      descriptionRow0: 'Total',
      metricColumn0: performance.total,
      metricColumn1: performance.totalYearAgo,
      metricColumn2: performance.totalYearAgoPercent,
      ctv: 100
    };
  }

  public getProductMetricsSelectedBrandRow(productMetricsValues: ProductMetricsValues): MyPerformanceTableRow {
    const rowTotal: MyPerformanceTableRow = {
      descriptionRow0: productMetricsValues.brandDescription,
      metricColumn0: productMetricsValues.current,
      metricColumn1: productMetricsValues.yearAgo,
      metricColumn2: productMetricsValues.yearAgoPercent,
      ctv: 100
    };

    if (productMetricsValues.brandCode) {
      rowTotal.metadata = { brandCode:  productMetricsValues.brandCode };
    }

    return rowTotal;
  }

  private getPercentageOfTotal(contribution: number, total: number): number {
    return contribution && total
      ? Math.round((contribution / total) * 1000) / 10
      : 0;
  }

  private getDisplayName(name: string, entityType: EntityType, positionId: string): string {
    if (positionId === CORPORATE_USER_POSITION_ID && name === EntityPeopleType['DRAFT MANAGER']) {
      return EntityPeopleType.DRAFT;
    }

    switch (entityType) {
      case EntityType.RoleGroup:
      case EntityType.AccountGroup:
        return PluralizedRoleGroup[name] || name;
      case EntityType.Account:
      case EntityType.SubAccount:
        return SpecializedAccountName[name] || name;
      default:
        return name;
    }
  }

  private matchProductMetricOpportunityCounts(
    product: ProductMetricsValues,
    opportunitiesGroupedByBrandSkuPackageCode: OpportunitiesGroupedByBrandSkuPackageCode,
    productMetricsViewType: ProductMetricsViewType
  ): number {
    let productOpportunityCount: number;

    if (productMetricsViewType === ProductMetricsViewType.brands) {
      productOpportunityCount = opportunitiesGroupedByBrandSkuPackageCode[product.brandCode]
        ? opportunitiesGroupedByBrandSkuPackageCode[product.brandCode].brandSkuPackageOpportunityCountTotal
        : 0;
    } else {
      if (opportunitiesGroupedByBrandSkuPackageCode[product.beerId.masterPackageSKUCode]) {
        productOpportunityCount
          = opportunitiesGroupedByBrandSkuPackageCode[product.beerId.masterPackageSKUCode].brandSkuPackageOpportunityCountTotal;
      } else if (opportunitiesGroupedByBrandSkuPackageCode[product.beerId.masterSKUCode]) {
        productOpportunityCount =
          opportunitiesGroupedByBrandSkuPackageCode[product.beerId.masterSKUCode].brandSkuPackageOpportunityCountTotal;
      } else {
        productOpportunityCount = 0;
      }
    }

    return productOpportunityCount;
  }
}
