import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityWithPerformance } from '../models/entity-with-performance.model';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { PluralizedRoleGroup } from '../enums/pluralized-role-group.enum';
import { Performance } from '../models/performance.model';
import { ProductMetrics, ProductMetricsValues } from '../models/product-metrics.model';

@Injectable()
export class MyPerformanceTableDataTransformerService {

  public getLeftTableData(entities: EntityWithPerformance[], total?: number): MyPerformanceTableRow[] {
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

      if (entity.name === 'Open') {
        transformedEntity.descriptionRow0 = 'Open Position';
        transformedEntity.descriptionRow1 = entity.positionDescription;
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

  public getRightTableData(productMetrics: ProductMetrics, total?: number): MyPerformanceTableRow[] {
    const productsValues = productMetrics.brandValues || productMetrics.skuValues;
    return productsValues.map((item: ProductMetricsValues) => {
      return {
        descriptionRow0: productMetrics.brandValues ? item.brandDescription : item.beerId.masterPackageSKUDescription,
        metricColumn0: item.current,
        metricColumn1: item.yearAgo,
        metricColumn2: item.yearAgoPercent,
        ctv: total ? this.getPercentageOfTotal(item.current, total) : 0,
        metadata: {
          brandCode: item.brandCode
        }
      };
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

  public getProductMetricsTotal(productMetricsValues: ProductMetricsValues): MyPerformanceTableRow {
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
