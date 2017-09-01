import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { PerformanceTotal } from '../models/performance-total.model';
import { ResponsibilityEntityPerformance } from '../models/entity-responsibilities.model';

@Injectable()
export class MyPerformanceTableDataTransformerService {

  public getLeftTableData(entities: ResponsibilityEntityPerformance[]): MyPerformanceTableRow[] {
    return entities.map((entity: ResponsibilityEntityPerformance) => {
      return {
        descriptionRow0: entity.name,
        metricColumn0: entity.performanceTotal.total,
        metricColumn1: entity.performanceTotal.totalYearAgo,
        metricColumn2: entity.performanceTotal.totalYearAgoPercent,
        ctv: entity.performanceTotal.contributionToVolume
      };
    });
  }

  public getTotalRowData(performanceTotal: PerformanceTotal): MyPerformanceTableRow {
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
