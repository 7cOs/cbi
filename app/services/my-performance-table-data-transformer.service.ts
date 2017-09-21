import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { EntitiesTotalPerformances } from '../models/entities-total-performances.model';
import { EntitiesPerformances } from '../models/entities-performances.model';
import { ProductMetrics, ProductMetricsBrandValue } from '../models/product-metrics.model';

@Injectable()
export class MyPerformanceTableDataTransformerService {

  public getLeftTableData(entities: EntitiesPerformances[]): MyPerformanceTableRow[] {

    return entities.map((entity: EntitiesPerformances) => {
      const row = {
        descriptionRow0: entity.name,
        metricColumn0: entity.performanceTotal.total,
        metricColumn1: entity.performanceTotal.totalYearAgo,
        metricColumn2: entity.performanceTotal.totalYearAgoPercent,
        ctv: entity.performanceTotal.contributionToVolume,
        metadata: {
          positionId: entity.positionId
        }
      };

      if (entity.positionDescription) {
        row.descriptionRow0 = (entity.name === 'Open') ? 'Open Position' : entity.name;
        row['descriptionRow1'] = entity.positionDescription;
      }

      return row;
    });
  }

  public getRightTableData(productMetrics: ProductMetrics): MyPerformanceTableRow[] {
    return (productMetrics.brand).map((item: ProductMetricsBrandValue) => {
      return {
        descriptionRow0: item.brandDescription,
        metricColumn0: item.current,
        metricColumn1: item.yearAgo,
        metricColumn2: item.yearAgoPercent,
        ctv: chance.natural({max: 100})
      };
    });
  }

  public getTotalRowData(performanceTotal: EntitiesTotalPerformances): MyPerformanceTableRow {
    const totalRow = {
      descriptionRow0: 'Total',
      metricColumn0: performanceTotal.total,
      metricColumn1: performanceTotal.totalYearAgo,
      metricColumn2: performanceTotal.totalYearAgoPercent,
      ctv: performanceTotal.contributionToVolume
    };

    if (performanceTotal.name) totalRow['descriptionRow1'] = performanceTotal.name;

    return totalRow;
  }
}
