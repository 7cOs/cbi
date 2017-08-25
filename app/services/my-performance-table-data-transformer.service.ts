import * as Chance from 'chance';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityResponsibilities } from '../models/entity-responsibilities.model';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { PerformanceTotal } from '../models/performance-total.model';
import { ResponsibilitiesState } from '../state/reducers/responsibilities.reducer';
import { RoleGroups, RoleGroupPerformanceTotal } from '../models/role-groups.model';
import { UtilService } from './util.service';
import { ViewType } from '../enums/view-type.enum';

const chance = new Chance();

@Injectable()
export class MyPerformanceTableDataTransformerService {

  constructor(private utilService: UtilService) { }

  public getTableData(viewType: ViewType, responsibilitiesState: ResponsibilitiesState): MyPerformanceTableRow[] {
    switch (viewType) {
      case ViewType.people:
        return this.transformPeopleTableData(responsibilitiesState.responsibilities);

      case ViewType.accounts:
      case ViewType.distributors:
        return this.transformAccountDistributorsTableData(responsibilitiesState.responsibilities);

      case ViewType.roleGroups:
      default:
        return this.getRoleGroupPerformanceTableData(responsibilitiesState.performanceTotals);
    }
  }

  public transformPeopleTableData(roleGroups: RoleGroups): MyPerformanceTableRow[] {
    const groupName = Object.keys(roleGroups)[0];
    return roleGroups[groupName].map((person: EntityResponsibilities) => {
      return {
        descriptionRow0: person.name,
        metricColumn0: chance.natural({max: 1000}),
        metricColumn1: chance.natural({max: 1000}),
        metricColumn2: chance.natural({max: 100}),
        ctv: chance.natural({max: 100}),
        metadata: {
          positionId: person.positionId
        }
      };
    });
  }

  public transformAccountDistributorsTableData(roleGroups: RoleGroups): MyPerformanceTableRow[] {
    const groupName = Object.keys(roleGroups)[0];
    return roleGroups[groupName].map((property: EntityResponsibilities) => {
      return {
        descriptionRow0: property.name,
        metricColumn0: chance.natural({max: 1000}),
        metricColumn1: chance.natural({max: 1000}),
        metricColumn2: chance.natural({max: 100}),
        ctv: chance.natural({max: 100}),
        metadata: {
          positionId: property.positionId
        }
      };
    });
  }

  public getRoleGroupPerformanceTableData(performanceData: Array<RoleGroupPerformanceTotal>): Array<MyPerformanceTableRow> {
    return performanceData.map((performance: RoleGroupPerformanceTotal) => {
      return {
        descriptionRow0: `${performance.entityType}S`,
        metricColumn0: performance.performanceTotal.total,
        metricColumn1: performance.performanceTotal.totalYearAgo,
        metricColumn2: this.utilService.getYearAgoPercent(performance.performanceTotal.total, performance.performanceTotal.totalYearAgo),
        ctv: performance.performanceTotal.contributionToVolume
      };
    });
  }

  public getTotalRowDisplayData(performanceTotal: PerformanceTotal): MyPerformanceTableRow {
    return {
      descriptionRow0: 'Total',
      metricColumn0: performanceTotal.total,
      metricColumn1: performanceTotal.totalYearAgo,
      metricColumn2: this.utilService.getYearAgoPercent(performanceTotal.total, performanceTotal.totalYearAgo),
      ctv: performanceTotal.contributionToVolume
    };
  }
}
