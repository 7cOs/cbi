import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as Chance from 'chance';

import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { PerformanceTotalDTO } from '../models/performance-total-dto.model';
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

  public getTotalRowDisplayData(performanceTotalDTO: PerformanceTotalDTO): MyPerformanceTableRow {
    return {
      descriptionRow0: 'Total',
      descriptionRow1: '',
      metricColumn0: performanceTotalDTO.total,
      metricColumn1: performanceTotalDTO.totalYearAgo,
      metricColumn2: parseFloat((performanceTotalDTO.total / performanceTotalDTO.totalYearAgo).toFixed(1)),
      ctv: performanceTotalDTO.contributionToVolume
    };
  }
}
