import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityWithPerformance } from '../models/entity-with-performance.model';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { GroupedOpportunityCounts } from '../models/opportunity-count.model';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { PluralizedRoleGroup } from '../enums/pluralized-role-group.enum';
import { Performance } from '../models/performance.model';
import { ProductMetrics, ProductMetricsValues } from '../models/product-metrics.model';
import { ProductMetricsViewType } from '../enums/product-metrics-view-type.enum';
import { SkuPackageType  } from '../enums/sku-package-type.enum';
import { SpecializedAccountName } from '../enums/specialized-account-name.enum';

@Injectable()
export class MyPerformanceTableDataTransformerService {

  public getLeftTableData(entities: EntityWithPerformance[], altHierarchyId?: string): MyPerformanceTableRow[] {
    const total: number = entities.reduce((sum: number, entity: EntityWithPerformance): number => {
      return sum + entity.performance.total;
    }, 0);

    return entities.map((entity: EntityWithPerformance) => {
      const transformedEntity: MyPerformanceTableRow = {
        descriptionRow0: this.getDisplayName(entity.name, entity.entityType),
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
    groupedOpportunityCounts: GroupedOpportunityCounts,
    productMetricsViewType: ProductMetricsViewType
  ): MyPerformanceTableRow[] {
    const productsValues: ProductMetricsValues[] = productMetricsViewType === ProductMetricsViewType.brands
      ? productMetrics.brandValues : productMetrics.skuValues;
    const total: number = productsValues.reduce((sum: number, item: ProductMetricsValues): number => {
      return sum + item.current;
    }, 0);

    const rowData: MyPerformanceTableRow[] = productsValues.map((item: ProductMetricsValues) => {
      const rightTableData: MyPerformanceTableRow = {
        descriptionRow0: productMetricsViewType === ProductMetricsViewType.brands
          ? item.brandDescription
          : item.beerId.masterPackageSKUDescription || item.beerId.masterSKUDescription,
        metricColumn0: item.current,
        metricColumn1: item.yearAgo,
        metricColumn2: item.yearAgoPercent,
        ctv: total ? this.getPercentageOfTotal(item.current, total) : 0,
        metadata: {}
      };

      if (productMetricsViewType === ProductMetricsViewType.brands) {
        rightTableData.metadata.brandCode = item.brandCode;
      } else {
        rightTableData.metadata.skuPackageType = item.beerId.masterPackageSKUCode ? SkuPackageType.package : SkuPackageType.sku;
        rightTableData.metadata.skuPackageCode = item.beerId.masterPackageSKUCode || item.beerId.masterSKUCode;
      }

      if (groupedOpportunityCounts) {
        rightTableData.opportunities = this.matchProductMetricOpportunityCounts(item, groupedOpportunityCounts, productMetricsViewType);
      }

      return rightTableData;
    });

    return rowData.filter((row: MyPerformanceTableRow) => {
      return (row.metricColumn0 !== 0 || row.metricColumn1 !== 0);
    });
  }

  public getTotalRowData(performance: Performance): MyPerformanceTableRow {
    const totalRow = {
      descriptionRow0: 'Total',
      metricColumn0: performance.total,
      metricColumn1: performance.totalYearAgo,
      metricColumn2: performance.totalYearAgoPercent,
      ctv: 100
    };

    if (performance.name) totalRow['descriptionRow1'] = performance.name;

    return totalRow;
  }

  public getProductMetricsSelectedBrandRow(
    productMetricsValues: ProductMetricsValues,
    groupedOpportunityCounts: GroupedOpportunityCounts
  ): MyPerformanceTableRow {
    const selectedBrandRow: MyPerformanceTableRow = {
      descriptionRow0: productMetricsValues.brandDescription,
      metricColumn0: productMetricsValues.current,
      metricColumn1: productMetricsValues.yearAgo,
      metricColumn2: productMetricsValues.yearAgoPercent,
      ctv: 100
    };

    if (groupedOpportunityCounts) selectedBrandRow.opportunities = groupedOpportunityCounts[productMetricsValues.brandCode].total;

    return selectedBrandRow;
  }

  private getPercentageOfTotal(contribution: number, total: number): number {
    return contribution && total
      ? Math.round((contribution / total) * 1000) / 10
      : 0;
  }

  private getDisplayName(name: string, entityType: EntityType): string {
    switch (entityType) {
      case EntityType.RoleGroup:
      case EntityType.AccountGroup:
        return PluralizedRoleGroup[name];
      case EntityType.Account:
      case EntityType.SubAccount:
        return SpecializedAccountName[name] || name;
      default:
        return name;
    }
  }

  private matchProductMetricOpportunityCounts(
    item: ProductMetricsValues,
    groupedOpportunityCounts: GroupedOpportunityCounts,
    productMetricsViewType: ProductMetricsViewType
  ): (number|string) {
    if (productMetricsViewType === ProductMetricsViewType.brands) {
      if (groupedOpportunityCounts[item.brandCode]) {
        return groupedOpportunityCounts[item.brandCode].total;
      } else {
        return '-';
      }
    } else {
      if (groupedOpportunityCounts[item.beerId.masterPackageSKUCode]) {
        return groupedOpportunityCounts[item.beerId.masterPackageSKUCode].total;
      } else if (groupedOpportunityCounts[item.beerId.masterSKUCode]) {
        return groupedOpportunityCounts[item.beerId.masterSKUCode].total;
      } else {
        return '-';
      }
    }
  }
}
