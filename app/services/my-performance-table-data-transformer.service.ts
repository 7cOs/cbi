import * as Chance from 'chance';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { RoleGroups } from '../models/role-groups.model';
let chance = new Chance();

@Injectable()
export class MyPerformanceTableDataTransformerService {
  // mocking the performance data for now;
  public transformRoleGroupTableData(roleGroups: RoleGroups): MyPerformanceTableRow[] {
    return Object.keys(roleGroups).map((groupName: string) => {
      return {
        descriptionRow0: groupName,
        descriptionRow1: '',
        metricColumn0: chance.natural({max: 1000}),
        metricColumn1: chance.natural({max: 1000}),
        metricColumn2: chance.natural({max: 100}),
        ctv: chance.natural({max: 100})
      };
    });
  }
}
