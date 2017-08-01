import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as Chance from 'chance';

import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { PerformanceTotal } from '../models/performance-total.model';
import { RoleGroups } from '../models/role-groups.model';

const chance = new Chance();

@Injectable()
export class MyPerformanceTableDataTransformerService {

  // mocking the performance data for now;
  public transformRoleGroupTableData(roleGroups: RoleGroups): MyPerformanceTableRow[] {
    return Object.keys(roleGroups).map((groupName: string) => {
      return {
        descriptionRow0: roleGroups[groupName][0].typeDisplayName,
        descriptionRow1: '',
        metricColumn0: chance.natural({max: 1000}),
        metricColumn1: chance.natural({max: 1000}),
        metricColumn2: chance.natural({max: 100}),
        ctv: chance.natural({max: 100})
      };
    });
  }

  public getTotalRowDisplayData(performanceTotal: PerformanceTotal): MyPerformanceTableRow {
    return {
      descriptionRow0: 'Total',
      descriptionRow1: '',
      metricColumn0: performanceTotal.total,
      metricColumn1: performanceTotal.totalYearAgo,
      metricColumn2: parseFloat((performanceTotal.total / performanceTotal.totalYearAgo).toFixed(1)),
      ctv: performanceTotal.contributionToVolume
    };
  }
}
