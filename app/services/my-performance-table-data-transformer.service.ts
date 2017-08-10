import * as Chance from 'chance';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityResponsibilities } from '../models/entity-responsibilities.model';
import { EntityPeopleType } from '../enums/entity-responsibilities.enum';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { RoleGroups } from '../models/role-groups.model';
let chance = new Chance();

@Injectable()
export class MyPerformanceTableDataTransformerService {
  // mocking the performance data for now;
  public transformRoleGroupTableData(roleGroups: RoleGroups): MyPerformanceTableRow[] {
    return Object.keys(roleGroups).map((groupName: string) => {
      return {
        descriptionRow0: roleGroups[groupName][0].typeDisplayName,
        metricColumn0: chance.natural({max: 1000}),
        metricColumn1: chance.natural({max: 1000}),
        metricColumn2: chance.natural({max: 100}),
        ctv: chance.natural({max: 100})
      };
    });
  }

  public transformPeopleTableData(roleGroups: RoleGroups): MyPerformanceTableRow[] {
    const groupName = Object.keys(roleGroups)[0];
    return roleGroups[groupName].map((person: EntityResponsibilities) => {
      return {
        descriptionRow0: person.name,
        metricColumn0: chance.natural({max: 1000}),
        metricColumn1: chance.natural({max: 1000}),
        metricColumn2: chance.natural({max: 100}),
        ctv: chance.natural({max: 100})
      };
    });
  }

  public buildTotalRow(roleGroups: RoleGroups): MyPerformanceTableRow {
    const groupName: EntityPeopleType = EntityPeopleType[Object.keys(roleGroups)[0]];
    return {
      descriptionRow0: 'TOTAL',
      descriptionRow1: `${groupName}s`,
      metricColumn0: chance.natural({max: 1000}),
      metricColumn1: chance.natural({max: 1000}),
      metricColumn2: chance.natural({max: 100}),
      ctv: 100
    };
  }
}
