import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityWithPerformance } from '../models/entity-with-performance.model';
import { EntityType } from '../enums/entity-responsibilities.enum';
import { Performance } from '../models/performance.model';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { ProductMetrics, ProductMetricsBrandValue } from '../models/product-metrics.model';

@Injectable()
export class MyPerformanceTableDataTransformerService {

  public getLeftTableData(entities: EntityWithPerformance[]): MyPerformanceTableRow[] {
    return entities.map((entity: EntityWithPerformance) => {
      const transformedEntity: MyPerformanceTableRow = {
        descriptionRow0: entity.name,
        metricColumn0: entity.performance.total,
        metricColumn1: entity.performance.totalYearAgo,
        metricColumn2: entity.performance.totalYearAgoPercent,
        ctv: entity.performance.contributionToVolume,
        metadata: {
          positionId: entity.positionId,
          entityType: entity.entityType
        },
        performanceError: entity.performance.error
      };

      if (entity.name === 'Open') {
        transformedEntity.descriptionRow0 = 'Open Position';
        transformedEntity.descriptionRow1 = entity.positionDescription;
      }

      if (entity.contextPositionId) transformedEntity.metadata.contextPositionId = entity.contextPositionId;
      if (entity.entityTypeCode) transformedEntity.metadata.entityTypeCode = entity.entityTypeCode;

      if (entity.entityType === EntityType.Distributor) {
        transformedEntity.descriptionRow1 = 'GO TO DASHBOARD';
      }

      return transformedEntity;
    });
  }

  public getRightTableData(productMetrics: ProductMetrics): MyPerformanceTableRow[] {
    return (productMetrics.brandValues).map((item: ProductMetricsBrandValue) => {
      return {
        descriptionRow0: item.brandDescription,
        metricColumn0: item.current,
        metricColumn1: item.yearAgo,
        metricColumn2: item.yearAgoPercent,
        ctv: chance.natural({max: 100})
      };
    });
  }

  public getTotalRowData(performance: Performance): MyPerformanceTableRow {
    const totalRow = {
      descriptionRow0: 'Total',
      metricColumn0: performance.total,
      metricColumn1: performance.totalYearAgo,
      metricColumn2: performance.totalYearAgoPercent,
      ctv: performance.contributionToVolume
    };

    if (performance.name) totalRow['descriptionRow1'] = performance.name;

    return totalRow;
  }
}
