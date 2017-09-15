import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntitiesPerformances } from '../models/entities-performances.model';
import { EntitiesTotalPerformances } from '../models/entities-total-performances.model';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';

@Injectable()
export class MyPerformanceTableDataTransformerService {

  public getLeftTableData(entities: EntitiesPerformances[]): MyPerformanceTableRow[] {
    return entities.map((entity: EntitiesPerformances) => {
      const transformedEntity: MyPerformanceTableRow = {
        descriptionRow0: entity.name,
        metricColumn0: entity.performanceTotal.total,
        metricColumn1: entity.performanceTotal.totalYearAgo,
        metricColumn2: entity.performanceTotal.totalYearAgoPercent,
        ctv: entity.performanceTotal.contributionToVolume,
        metadata: {
          positionId: entity.positionId
        }
      };

      if (entity.contextPositionId) transformedEntity.metadata.contextPositionId = entity.contextPositionId;

      return transformedEntity;
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
