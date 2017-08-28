import * as Chance from 'chance';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

// import { EntityResponsibilities } from '../models/entity-responsibilities.model';
import { MyPerformanceTableRow } from '../models/my-performance-table-row.model';
import { PerformanceTotal } from '../models/performance-total.model';
import { ResponsibilitiesState } from '../state/reducers/responsibilities.reducer';
import { RoleGroups, RoleGroupPerformanceTotal } from '../models/role-groups.model';
import { ViewType } from '../enums/view-type.enum';

const chance = new Chance();

@Injectable()
export class MyPerformanceTableDataTransformerService {

  // mocking the performance data for now;
  public transformRoleGroupTableData(roleGroups: RoleGroups): MyPerformanceTableRow[] {
    return Object.keys(roleGroups).map((groupName: string) => {
      return {
        descriptionRow0: roleGroups[groupName][0].description,
        metricColumn0: chance.natural({max: 1000}),
        metricColumn1: chance.natural({max: 1000}),
        metricColumn2: chance.natural({max: 100}),
        ctv: chance.natural({max: 100})
      };
    });
  }

  public getTableData(viewType: ViewType, responsibilitiesState: ResponsibilitiesState): MyPerformanceTableRow[] {
    switch (viewType) {
      case ViewType.people:
        return this.transformPeopleTableData(responsibilitiesState.performanceTotals);

      case ViewType.roleGroups:
      default:
        return this.getRoleGroupPerformanceTableData(responsibilitiesState.performanceTotals);
    }
  }

  public transformPeopleTableData(responsibilityEntities: any[]): MyPerformanceTableRow[] {
    return responsibilityEntities.map((entity: any) => {
      return {
        descriptionRow0: entity.name,
        metricColumn0: entity.performanceTotal.total,
        metricColumn1: entity.performanceTotal.totalYearAgo,
        metricColumn2: entity.performanceTotal.totalYearAgoPercent,
        ctv: entity.performanceTotal.contributionToVolume
      };
    });
  }

  public buildTotalRow(roleGroups: RoleGroups): MyPerformanceTableRow {
    const groupName: string = Object.keys(roleGroups)[0];
    return {
      descriptionRow0: 'TOTAL',
      descriptionRow1: `${groupName}S`,
      metricColumn0: chance.natural({max: 1000}),
      metricColumn1: chance.natural({max: 1000}),
      metricColumn2: chance.natural({max: 100}),
      ctv: 100
    };
  }

  public getRoleGroupPerformanceTableData(performanceData: Array<RoleGroupPerformanceTotal>): Array<MyPerformanceTableRow> {
    return performanceData.map((performance: RoleGroupPerformanceTotal) => {
      return {
        descriptionRow0: `${performance.entityType}S`,
        metricColumn0: performance.performanceTotal.total,
        metricColumn1: performance.performanceTotal.totalYearAgo,
        metricColumn2: performance.performanceTotal.totalYearAgoPercent,
        ctv: performance.performanceTotal.contributionToVolume
      };
    });
  }

  public getTotalRowDisplayData(performanceTotal: PerformanceTotal): MyPerformanceTableRow {
    const totalRow = {
      descriptionRow0: 'Total',
      metricColumn0: performanceTotal.total,
      metricColumn1: performanceTotal.totalYearAgo,
      metricColumn2: performanceTotal.totalYearAgoPercent,
      ctv: performanceTotal.contributionToVolume
    };

    if (performanceTotal.entityType) totalRow['descriptionRow1'] = performanceTotal.entityType;

    return totalRow;
  }
}
