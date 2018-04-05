import { Injectable } from '@angular/core';

import { CalculatorService } from '../calculator.service';
import { CORPORATE_USER_POSITION_ID } from '../../containers/my-performance/my-performance.component';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { PluralizedRoleGroup } from '../../enums/pluralized-role-group.enum';
import { SalesHierarchyAccount } from '../../models/sales-hierarchy/sales-hierarchy-account.model';
import { SalesHierarchyAccountGroup } from '../../models/sales-hierarchy/sales-hierarchy-account-group.model';
import { SalesHierarchyDistributor } from '../../models/sales-hierarchy/sales-hierarchy-distributor.model';
import { SalesHierarchyDistributorGroup } from '../../models/sales-hierarchy/sales-hierarchy-distributor-group.model';
import { SalesHierarchyEntity } from '../../models/sales-hierarchy/sales-hierarchy-entity.model';
import { SalesHierarchyEntityGroup } from '../../models/sales-hierarchy/sales-hierarchy-entity-group.model';
import { SalesHierarchyEntityType } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum';
import { SalesHierarchyPosition } from '../../models/sales-hierarchy/sales-hierarchy-position.model';
import { SalesHierarchyRoleGroup } from '../../models/sales-hierarchy/sales-hierarchy-role-group.model';
import { SalesHierarchySubAccount } from '../../models/sales-hierarchy/sales-hierarchy-subaccount.model';
import { SpecializedAccountName } from '../../enums/specialized-account-name.enum';

export const GO_TO_DASHBOARD_TEXT: string = 'GO TO DASHBOARD';
export const OPEN_POSITION_TEXT: string = 'Open Position';

@Injectable()
export class TeamPerformanceTableTransformerService {

  constructor(
    private calculatorService: CalculatorService
  ) { }

  public transformAccounts(accounts: SalesHierarchyAccount[]): MyPerformanceTableRow[] {
    const cumulativeTotal: number = this.getCumulativePerformanceTotal(accounts);

    return accounts.map((account: SalesHierarchyAccount) => {
      return {
        descriptionRow0: SpecializedAccountName[account.name] || account.name,
        metricColumn0: account.performance.total,
        metricColumn1: account.performance.totalYearAgo,
        metricColumn2: account.performance.totalYearAgoPercent,
        ctv: this.getCTV(cumulativeTotal, account.performance.total),
        performanceError: account.performance.error,
        metadata: {
          id: account.id,
          type: account.type
        }
      };
    });
  }

  public transformDistributors(distributors: SalesHierarchyDistributor[]): MyPerformanceTableRow[] {
    const cumulativeTotal: number = this.getCumulativePerformanceTotal(distributors);

    return distributors.map((distributor: SalesHierarchyDistributor) => {
      return {
        descriptionRow0: distributor.name,
        descriptionRow1: GO_TO_DASHBOARD_TEXT,
        metricColumn0: distributor.performance.total,
        metricColumn1: distributor.performance.totalYearAgo,
        metricColumn2: distributor.performance.totalYearAgoPercent,
        ctv: this.getCTV(cumulativeTotal, distributor.performance.total),
        performanceError: distributor.performance.error,
        metadata: {
          id: distributor.id,
          type: distributor.type
        }
      };
    });
  }

  public transformPositions(positions: SalesHierarchyPosition[], isAlternateHierarchy: boolean): MyPerformanceTableRow[] {
    const cumulativeTotal: number = this.getCumulativePerformanceTotal(positions);

    return positions.map((position: SalesHierarchyPosition) => {
      const tableRow: MyPerformanceTableRow = {
        descriptionRow0: position.name,
        metricColumn0: position.performance.total,
        metricColumn1: position.performance.totalYearAgo,
        metricColumn2: position.performance.totalYearAgoPercent,
        ctv: this.getCTV(cumulativeTotal, position.performance.total),
        performanceError: position.performance.error,
        metadata: {
          id: position.id,
          type: position.type
        }
      };

      if (position.isOpenPosition) {
        tableRow.descriptionRow0 = OPEN_POSITION_TEXT;
        tableRow.descriptionRow1 = position.positionLocation;
      } else if (isAlternateHierarchy) {
        tableRow.descriptionRow0 = position.positionLocation ? position.positionLocation : 'AREA';
        tableRow.descriptionRow1 = position.name;
      }

      return tableRow;
    });
  }

  public transformSalesHierarchyGroups(
    salesHierarchyGroups: Array<SalesHierarchyAccountGroup|SalesHierarchyDistributorGroup|SalesHierarchyRoleGroup>
  ): MyPerformanceTableRow[] {
    const cumulativeTotal: number = this.getCumulativePerformanceTotal(salesHierarchyGroups);

    return salesHierarchyGroups.map((group: SalesHierarchyAccountGroup | SalesHierarchyDistributorGroup | SalesHierarchyRoleGroup) => {
      switch (group.type) {
        case SalesHierarchyEntityType.AccountGroup:
          return this.transformAccountGroup(group as SalesHierarchyAccountGroup, cumulativeTotal);
        case SalesHierarchyEntityType.DistributorGroup:
          return this.transformDistributorGroup(group as SalesHierarchyDistributorGroup, cumulativeTotal);
        case SalesHierarchyEntityType.RoleGroup:
        default:
          return this.transformRoleGroup(group as SalesHierarchyRoleGroup, cumulativeTotal);
      }
    });
  }

  public transformSubAccounts(subAccounts: SalesHierarchySubAccount[]): MyPerformanceTableRow[] {
    const cumulativeTotal: number = this.getCumulativePerformanceTotal(subAccounts);

    return subAccounts.map((subAccount: SalesHierarchySubAccount) => {
      return {
        descriptionRow0: SpecializedAccountName[subAccount.name] || subAccount.name,
        descriptionRow1: GO_TO_DASHBOARD_TEXT,
        metricColumn0: subAccount.performance.total,
        metricColumn1: subAccount.performance.totalYearAgo,
        metricColumn2: subAccount.performance.totalYearAgoPercent,
        ctv: this.getCTV(cumulativeTotal, subAccount.performance.total),
        performanceError: subAccount.performance.error,
        metadata: {
          id: subAccount.id,
          type: subAccount.type
        }
      };
    });
  }

  private transformAccountGroup(accountGroup: SalesHierarchyAccountGroup, cumulativePerformanceTotal: number): MyPerformanceTableRow {
    return {
      descriptionRow0: PluralizedRoleGroup.ACCOUNT,
      metricColumn0: accountGroup.performance.total,
      metricColumn1: accountGroup.performance.totalYearAgo,
      metricColumn2: accountGroup.performance.totalYearAgoPercent,
      ctv: this.getCTV(cumulativePerformanceTotal, accountGroup.performance.total),
      performanceError: accountGroup.performance.error,
      metadata: {
        groupTypeCode: accountGroup.groupTypeCode,
        type: accountGroup.type
      }
    };
  }

  private transformDistributorGroup(
    distributorGroup: SalesHierarchyDistributorGroup,
    cumulativePerformanceTotal: number
  ): MyPerformanceTableRow {
    return {
      descriptionRow0: PluralizedRoleGroup.GEOGRAPHY,
      metricColumn0: distributorGroup.performance.total,
      metricColumn1: distributorGroup.performance.totalYearAgo,
      metricColumn2: distributorGroup.performance.totalYearAgoPercent,
      ctv: this.getCTV(cumulativePerformanceTotal, distributorGroup.performance.total),
      performanceError: distributorGroup.performance.error,
      metadata: {
        groupTypeCode: distributorGroup.groupTypeCode,
        type: distributorGroup.type
      }
    };
  }

  private transformRoleGroup(roleGroup: SalesHierarchyRoleGroup, cumulativePerformanceTotal: number): MyPerformanceTableRow {
    return {
      descriptionRow0: this.getRoleGroupName(roleGroup.positionId, roleGroup.name),
      metricColumn0: roleGroup.performance.total,
      metricColumn1: roleGroup.performance.totalYearAgo,
      metricColumn2: roleGroup.performance.totalYearAgoPercent,
      ctv: this.getCTV(cumulativePerformanceTotal, roleGroup.performance.total),
      performanceError: roleGroup.performance.error,
      metadata: {
        groupTypeCode: roleGroup.groupTypeCode,
        type: roleGroup.type
      }
    };
  }

  private getRoleGroupName(roleGroupPositionId: string, roleGroupName: string): string {
    if (roleGroupPositionId === CORPORATE_USER_POSITION_ID && roleGroupName === EntityPeopleType['DRAFT MANAGER']) {
      return EntityPeopleType.DRAFT;
    } else {
      return PluralizedRoleGroup[roleGroupName] || roleGroupName;
    }
  }

  private getCumulativePerformanceTotal(salesHierarchyEntities: Array<SalesHierarchyEntity | SalesHierarchyEntityGroup>): number {
    return salesHierarchyEntities.reduce((sum: number, entity: (SalesHierarchyEntity | SalesHierarchyEntityGroup)) => {
      return sum + entity.performance.total;
    }, 0);
  }

  private getCTV(totalContribution: number, contribution: number): number {
    return totalContribution
      ? this.calculatorService.getPercentageOfTotal(totalContribution, contribution)
      : 0;
  }
}
