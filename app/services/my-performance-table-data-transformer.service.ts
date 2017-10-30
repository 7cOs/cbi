import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityWithPerformance } from '../models/entity-with-performance.model';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { PluralizedRoleGroup } from '../enums/pluralized-role-group.enum';
import { Performance } from '../models/performance.model';
import { ProductMetrics, ProductMetricsValues } from '../models/product-metrics.model';
import { ProductMetricsViewType } from '../enums/product-metrics-view-type.enum';
import { SkuPackageType  } from '../enums/sku-package-type.enum';

@Injectable()
export class MyPerformanceTableDataTransformerService {

  public getLeftTableData(entities: EntityWithPerformance[], inAltHierarchy: boolean): MyPerformanceTableRow[] {
    const total: number = entities.reduce((sum: number, entity: EntityWithPerformance): number => {
      return sum + entity.performance.total;
    }, 0);

    return entities.map((entity: EntityWithPerformance) => {
      const descriptionRow0 = entity.entityType === EntityType.RoleGroup || entity.entityType === EntityType.AccountGroup
        ? PluralizedRoleGroup[entity.name]
        : entity.name;
      const transformedEntity: MyPerformanceTableRow = {
        descriptionRow0: descriptionRow0,
        metricColumn0: entity.performance.total,
        metricColumn1: entity.performance.totalYearAgo,
        metricColumn2: entity.performance.totalYearAgoPercent,
        ctv:  total ? this.getPercentageOfTotal(entity.performance.total, total) : 0,
        metadata: {
          positionId: entity.positionId,
          entityType: entity.entityType,
          entityName: entity.name
        },
        performanceError: entity.performance.error
      };

      if (entity.entityType === EntityType.Person) {
        if (inAltHierarchy) {
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

  public getRightTableData(productMetrics: ProductMetrics, productMetricsViewType: ProductMetricsViewType): MyPerformanceTableRow[] {
    const productsValues: ProductMetricsValues[] = productMetricsViewType === ProductMetricsViewType.brands
      ? productMetrics.brandValues : productMetrics.skuValues;
    const total: number = productsValues.reduce((sum: number, item: ProductMetricsValues): number => {
      return sum + item.current;
    }, 0);

    return productsValues.map((item: ProductMetricsValues) => {
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

      return rightTableData.filter((row: MyPerformanceTableRow) => {
        return (row.metricColumn0 !== 0 && row.metricColumn1 !== 0);
      });
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

  public getProductMetricsSelectedBrandRow(productMetricsValues: ProductMetricsValues): MyPerformanceTableRow {
    return {
      descriptionRow0: productMetricsValues.brandDescription,
      metricColumn0: productMetricsValues.current,
      metricColumn1: productMetricsValues.yearAgo,
      metricColumn2: productMetricsValues.yearAgoPercent,
      ctv: chance.natural({max: 100}),
    };
  }

  private getPercentageOfTotal(contribution: number, total: number): number {
    return contribution && total
      ? Math.round((contribution / total) * 1000) / 10
      : 0;
  }
}
