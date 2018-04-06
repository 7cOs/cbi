import * as Chance from 'chance';
import { getTestBed, TestBed } from '@angular/core/testing';

import { CalculatorService } from '../calculator.service';
import { CORPORATE_USER_POSITION_ID } from '../../containers/my-performance/my-performance.component';
import { EntityPeopleType } from '../../enums/entity-responsibilities.enum';
import { getSalesHierarchyAccountsMock } from '../../models/sales-hierarchy/sales-hierarchy-account.model.mock';
import { getSalesHierarchyAccountGroupsMock } from '../../models/sales-hierarchy/sales-hierarchy-account-group.model.mock';
import { getSalesHierarchyDistributorsMock } from '../../models/sales-hierarchy/sales-hierarchy-distributor.model.mock';
import { getSalesHierarchyDistributorGroupsMock } from '../../models/sales-hierarchy/sales-hierarchy-distributor-group.model.mock';
import { getSalesHierarchyPositionsMock } from '../../models/sales-hierarchy/sales-hierarchy-position.model.mock';
import { getSalesHierarchyRoleGroupsMock } from '../../models/sales-hierarchy/sales-hierarchy-role-group.model.mock';
import { getSalesHierarchySubAccountsMock } from '../../models/sales-hierarchy/sales-hierarchy-subaccount.model.mock';
import { GO_TO_DASHBOARD_TEXT, OPEN_POSITION_TEXT } from './team-performance-table-transformer.service';
import { MyPerformanceTableRow } from '../../models/my-performance-table-row.model';
import { PluralizedRoleGroup } from '../../enums/pluralized-role-group.enum';
import { SalesHierarchyAccount } from '../../models/sales-hierarchy/sales-hierarchy-account.model';
import { SalesHierarchyAccountGroup } from '../../models/sales-hierarchy/sales-hierarchy-account-group.model';
import { SalesHierarchyDistributor } from '../../models/sales-hierarchy/sales-hierarchy-distributor.model';
import { SalesHierarchyDistributorGroup } from '../../models/sales-hierarchy/sales-hierarchy-distributor-group.model';
import { SalesHierarchyPosition } from '../../models/sales-hierarchy/sales-hierarchy-position.model';
import { SalesHierarchyRoleGroup } from '../../models/sales-hierarchy/sales-hierarchy-role-group.model';
import { SalesHierarchySubAccount } from '../../models/sales-hierarchy/sales-hierarchy-subaccount.model';
import { SpecializedAccountName } from '../../enums/specialized-account-name.enum';
import { TeamPerformanceTableTransformerService } from './team-performance-table-transformer.service';

const chance = new Chance();

describe('TeamPerformanceTableTransformerService', () => {
  let testBed: TestBed;
  let calculatorService: CalculatorService;
  let teamPerformanceTableTransformerService: TeamPerformanceTableTransformerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ CalculatorService, TeamPerformanceTableTransformerService ]
    });

    testBed = getTestBed();
    teamPerformanceTableTransformerService = testBed.get(TeamPerformanceTableTransformerService);
    calculatorService = testBed.get(CalculatorService);
  });

  describe('transformAccounts', () => {
    let salesHierarchyAccountsMock: SalesHierarchyAccount[];
    let accountsMockPerformanceTotalSum: number;

    beforeEach(() => {
      salesHierarchyAccountsMock = getSalesHierarchyAccountsMock();
      accountsMockPerformanceTotalSum = salesHierarchyAccountsMock.reduce((sum: number, account: SalesHierarchyAccount) => {
        return sum + account.performance.total;
      }, 0);
    });

    it('should return a MyPerformanceTableRow collection containing data for the passed in SalesHierarchyAccount array', () => {
      const tableRows: MyPerformanceTableRow[] = teamPerformanceTableTransformerService.transformAccounts(salesHierarchyAccountsMock);

      tableRows.forEach((tableRow: MyPerformanceTableRow, index: number) => {
        expect(tableRow).toEqual({
          descriptionRow0: salesHierarchyAccountsMock[index].name,
          metricColumn0: salesHierarchyAccountsMock[index].performance.total,
          metricColumn1: salesHierarchyAccountsMock[index].performance.totalYearAgo,
          metricColumn2: salesHierarchyAccountsMock[index].performance.totalYearAgoPercent,
          ctv: calculatorService.getPercentageOfTotal(accountsMockPerformanceTotalSum, salesHierarchyAccountsMock[index].performance.total),
          performanceError: salesHierarchyAccountsMock[index].performance.error,
          metadata: {
            id: salesHierarchyAccountsMock[index].id,
            type: salesHierarchyAccountsMock[index].type
          }
        });
      });
    });

    it('should return a table row with a SpecializedAccountName when the passed in account has an edge case name', () => {
      const randomIndex: number = chance.integer({ min: 0, max: salesHierarchyAccountsMock.length - 1 });
      salesHierarchyAccountsMock[randomIndex].name = 'ALL OTHER';
      const tableRows: MyPerformanceTableRow[] = teamPerformanceTableTransformerService.transformAccounts(salesHierarchyAccountsMock);

      tableRows.forEach((tableRow: MyPerformanceTableRow, index: number) => {
        index === randomIndex
          ? expect(tableRow.descriptionRow0).toBe(SpecializedAccountName[salesHierarchyAccountsMock[index].name])
          : expect(tableRow.descriptionRow0).toBe(salesHierarchyAccountsMock[index].name);
      });
    });
  });

  describe('transformDistributors', () => {
    let salesHierarchyDistributorsMock: SalesHierarchyDistributor[];
    let distributorsMockPerformanceTotalSum: number;

    beforeEach(() => {
      salesHierarchyDistributorsMock = getSalesHierarchyDistributorsMock();
      distributorsMockPerformanceTotalSum = salesHierarchyDistributorsMock.reduce(
        (sum: number, distributor: SalesHierarchyDistributor) => {
          return sum + distributor.performance.total;
      }, 0);
    });

    it('should return a MyPerformanceTableRow collection containing data for the passed in SalesHierarchyDistirbutor array', () => {
      const tableRows: MyPerformanceTableRow[] = teamPerformanceTableTransformerService.transformDistributors(
        salesHierarchyDistributorsMock
      );

      tableRows.forEach((tableRow: MyPerformanceTableRow, index: number) => {
        expect(tableRow).toEqual({
          descriptionRow0: salesHierarchyDistributorsMock[index].name,
          descriptionRow1: GO_TO_DASHBOARD_TEXT,
          metricColumn0: salesHierarchyDistributorsMock[index].performance.total,
          metricColumn1: salesHierarchyDistributorsMock[index].performance.totalYearAgo,
          metricColumn2: salesHierarchyDistributorsMock[index].performance.totalYearAgoPercent,
          ctv: calculatorService.getPercentageOfTotal(
            distributorsMockPerformanceTotalSum,
            salesHierarchyDistributorsMock[index].performance.total
          ),
          performanceError: salesHierarchyDistributorsMock[index].performance.error,
          metadata: {
            id: salesHierarchyDistributorsMock[index].id,
            type: salesHierarchyDistributorsMock[index].type
          }
        });
      });
    });
  });

  describe('transformPositions', () => {
    let salesHierarchyPositionsMock: SalesHierarchyPosition[];
    let positionsMockPerformanceTotalSum: number;
    let isAlternateHierarchyMock: boolean;

    beforeEach(() => {
      salesHierarchyPositionsMock = getSalesHierarchyPositionsMock();
      positionsMockPerformanceTotalSum = salesHierarchyPositionsMock.reduce((sum: number, position: SalesHierarchyPosition) => {
        return sum + position.performance.total;
      }, 0);
    });

    describe('when the passed in isAlternateHierarchy flag is false', () => {
      beforeEach(() => {
        isAlternateHierarchyMock = false;
      });

      it('should return a MyPerformanceTableRow collection containing data for the passed in SalesHierarchyPosition array', () => {
        const tableRows: MyPerformanceTableRow[] = teamPerformanceTableTransformerService.transformPositions(
          salesHierarchyPositionsMock,
          isAlternateHierarchyMock
        );

        tableRows.forEach((tableRow: MyPerformanceTableRow, index: number) => {
          expect(tableRow).toEqual({
            descriptionRow0: salesHierarchyPositionsMock[index].name,
            metricColumn0: salesHierarchyPositionsMock[index].performance.total,
            metricColumn1: salesHierarchyPositionsMock[index].performance.totalYearAgo,
            metricColumn2: salesHierarchyPositionsMock[index].performance.totalYearAgoPercent,
            ctv: calculatorService.getPercentageOfTotal(
              positionsMockPerformanceTotalSum,
              salesHierarchyPositionsMock[index].performance.total
            ),
            performanceError: salesHierarchyPositionsMock[index].performance.error,
            metadata: {
              id: salesHierarchyPositionsMock[index].id,
              type: salesHierarchyPositionsMock[index].type
            }
          });
        });
      });
    });

    describe('when the passed in isAlternateHierarchy flag is true', () => {
      beforeEach(() => {
        isAlternateHierarchyMock = true;
      });

      it('it shold return a table row collection where the descriptionRow0 contains the location of the position and'
      + ' the descriptionRow1 field contains the name of the position', () => {
        const tableRows: MyPerformanceTableRow[] = teamPerformanceTableTransformerService.transformPositions(
          salesHierarchyPositionsMock,
          isAlternateHierarchyMock
        );

        tableRows.forEach((tableRow: MyPerformanceTableRow, index: number) => {
          expect(tableRow.descriptionRow0).toBe(salesHierarchyPositionsMock[index].positionLocation);
          expect(tableRow.descriptionRow1).toBe(salesHierarchyPositionsMock[index].name);
        });
      });
    });

    describe('when a passed in position is an open position regardless of the isAlternateHierarchy flag', () => {
      beforeEach(() => {
        isAlternateHierarchyMock = chance.bool();
        salesHierarchyPositionsMock.forEach((position: SalesHierarchyPosition) => {
          position.isOpenPosition = true;
        });
      });

      it('should return a table row collection where the descriptionRow0 contains `Open Position` and the'
      + ' descriptionRow1 contains the position location', () => {
        const tableRows: MyPerformanceTableRow[] = teamPerformanceTableTransformerService.transformPositions(
          salesHierarchyPositionsMock,
          isAlternateHierarchyMock
        );

        tableRows.forEach((tableRow: MyPerformanceTableRow, index: number) => {
          expect(tableRow.descriptionRow0).toBe(OPEN_POSITION_TEXT);
          expect(tableRow.descriptionRow1).toBe(salesHierarchyPositionsMock[index].positionLocation);
        });
      });
    });
  });

  describe('transformSalesHierarchyGroups', () => {
    describe('when the passed in collection contains SalesHierarchyAccountGroups', () => {
      let salesHierarchyAccountGroupsMock: SalesHierarchyAccountGroup[];
      let accountGroupsMockPerformanceTotalSum: number;

      beforeEach(() => {
        salesHierarchyAccountGroupsMock = getSalesHierarchyAccountGroupsMock();
        accountGroupsMockPerformanceTotalSum = salesHierarchyAccountGroupsMock.reduce((sum: number, group: SalesHierarchyAccountGroup) => {
          return sum + group.performance.total;
        }, 0);
      });

      it('should call transformAccountGroup and return a table row containing data from the passed in SalesHierarchyAccountGroup', () => {
        const tableRows: MyPerformanceTableRow[] = teamPerformanceTableTransformerService.transformSalesHierarchyGroups(
          salesHierarchyAccountGroupsMock
        );

        tableRows.forEach((tableRow: MyPerformanceTableRow, index: number) => {
          expect(tableRow).toEqual({
            descriptionRow0: PluralizedRoleGroup.ACCOUNT,
            metricColumn0: salesHierarchyAccountGroupsMock[index].performance.total,
            metricColumn1: salesHierarchyAccountGroupsMock[index].performance.totalYearAgo,
            metricColumn2: salesHierarchyAccountGroupsMock[index].performance.totalYearAgoPercent,
            ctv: calculatorService.getPercentageOfTotal(
              accountGroupsMockPerformanceTotalSum,
              salesHierarchyAccountGroupsMock[index].performance.total
            ),
            performanceError: salesHierarchyAccountGroupsMock[index].performance.error,
            metadata: {
              type: salesHierarchyAccountGroupsMock[index].type,
              groupTypeCode: salesHierarchyAccountGroupsMock[index].groupTypeCode
            }
          });
        });
      });
    });

    describe('when the passed in collection contains SalesHierarchyDistributorGroups', () => {
      let salesHierarchyDistributorGroupsMock: SalesHierarchyDistributorGroup[];
      let distributorGroupsMockPerformanceTotalSum: number;

      beforeEach(() => {
        salesHierarchyDistributorGroupsMock = getSalesHierarchyDistributorGroupsMock();
        distributorGroupsMockPerformanceTotalSum = salesHierarchyDistributorGroupsMock.reduce(
          (sum: number, group: SalesHierarchyDistributorGroup) => {
            return sum + group.performance.total;
        }, 0);
      });

      it('should call transformDistributorGroup and return a table row containing data from the passed in' +
      ' SalesHierarchyDistributorGroup', () => {
        const tableRows: MyPerformanceTableRow[] = teamPerformanceTableTransformerService.transformSalesHierarchyGroups(
          salesHierarchyDistributorGroupsMock
        );

        tableRows.forEach((tableRow: MyPerformanceTableRow, index: number) => {
          expect(tableRow).toEqual({
            descriptionRow0: PluralizedRoleGroup.GEOGRAPHY,
            metricColumn0: salesHierarchyDistributorGroupsMock[index].performance.total,
            metricColumn1: salesHierarchyDistributorGroupsMock[index].performance.totalYearAgo,
            metricColumn2: salesHierarchyDistributorGroupsMock[index].performance.totalYearAgoPercent,
            ctv: calculatorService.getPercentageOfTotal(
              distributorGroupsMockPerformanceTotalSum,
              salesHierarchyDistributorGroupsMock[index].performance.total
            ),
            performanceError: salesHierarchyDistributorGroupsMock[index].performance.error,
            metadata: {
              type: salesHierarchyDistributorGroupsMock[index].type,
              groupTypeCode: salesHierarchyDistributorGroupsMock[index].groupTypeCode
            }
          });
        });
      });
    });

    describe('when the passed in collection contains SalesHierarchyRoleGroups', () => {
      let salesHierarchyRoleGroupsMock: SalesHierarchyRoleGroup[];
      let roleGroupsMockPerformanceTotalSum: number;
      let randomIndex: number;

      beforeEach(() => {
        salesHierarchyRoleGroupsMock = getSalesHierarchyRoleGroupsMock();
        roleGroupsMockPerformanceTotalSum = salesHierarchyRoleGroupsMock.reduce((sum: number, group: SalesHierarchyRoleGroup) => {
          return sum + group.performance.total;
        }, 0);
        randomIndex = chance.integer({ min: 0, max: salesHierarchyRoleGroupsMock.length - 1 });
      });

      it('should call transformRoleGroup and return a table row containing data from the passed in SalesHierarchyRoleGroup', () => {
        const tableRows: MyPerformanceTableRow[] = teamPerformanceTableTransformerService.transformSalesHierarchyGroups(
          salesHierarchyRoleGroupsMock
        );

        tableRows.forEach((tableRow: MyPerformanceTableRow, index: number) => {
          expect(tableRow).toEqual({
            descriptionRow0: salesHierarchyRoleGroupsMock[index].name,
            metricColumn0: salesHierarchyRoleGroupsMock[index].performance.total,
            metricColumn1: salesHierarchyRoleGroupsMock[index].performance.totalYearAgo,
            metricColumn2: salesHierarchyRoleGroupsMock[index].performance.totalYearAgoPercent,
            ctv: calculatorService.getPercentageOfTotal(
              roleGroupsMockPerformanceTotalSum,
              salesHierarchyRoleGroupsMock[index].performance.total
            ),
            performanceError: salesHierarchyRoleGroupsMock[index].performance.error,
            metadata: {
              type: salesHierarchyRoleGroupsMock[index].type,
              groupTypeCode: salesHierarchyRoleGroupsMock[index].groupTypeCode
            }
          });
        });
      });

      it('should return a SalesHierarchyRoleGroup with the name `DRAFT` when the given group contains a corporate positionId'
      + ' and has a name of `DRAFT MANAGER`', () => {
        salesHierarchyRoleGroupsMock[randomIndex].positionId = CORPORATE_USER_POSITION_ID;
        salesHierarchyRoleGroupsMock[randomIndex].name = EntityPeopleType['DRAFT MANAGER'];

        const tableRows: MyPerformanceTableRow[] = teamPerformanceTableTransformerService.transformSalesHierarchyGroups(
          salesHierarchyRoleGroupsMock
        );

        tableRows.forEach((tableRow: MyPerformanceTableRow, index: number) => {
          index === randomIndex
            ? expect(tableRow.descriptionRow0).toBe(EntityPeopleType.DRAFT)
            : expect(tableRow.descriptionRow0).toBe(salesHierarchyRoleGroupsMock[index].name);
        });
      });

      it('should return a SalesHierarchyRoleGroup with a pluralized name if PluralizedRoleGroup supports it', () => {
        salesHierarchyRoleGroupsMock[randomIndex].name = EntityPeopleType['GENERAL MANAGER'];

        const tableRows: MyPerformanceTableRow[] = teamPerformanceTableTransformerService.transformSalesHierarchyGroups(
          salesHierarchyRoleGroupsMock
        );

        tableRows.forEach((tableRow: MyPerformanceTableRow, index: number) => {
          index === randomIndex
            ? expect(tableRow.descriptionRow0).toBe(PluralizedRoleGroup['GENERAL MANAGER'])
            : expect(tableRow.descriptionRow0).toBe(salesHierarchyRoleGroupsMock[index].name);
        });
      });
    });
  });

  describe('transformSubAccounts', () => {
    let salesHierarchySubAccountsMock: SalesHierarchySubAccount[];
    let subAccountsMockPerformanceTotalSum: number;

    beforeEach(() => {
      salesHierarchySubAccountsMock = getSalesHierarchySubAccountsMock();
      subAccountsMockPerformanceTotalSum = salesHierarchySubAccountsMock.reduce((sum: number, subAccount: SalesHierarchySubAccount) => {
        return sum + subAccount.performance.total;
      }, 0);
    });

    it('should return a table row collection containing data for the passed in SalesHierarchySubAccount arrray', () => {
      const tableRows: MyPerformanceTableRow[] = teamPerformanceTableTransformerService.transformSubAccounts(
        salesHierarchySubAccountsMock
      );

      tableRows.forEach((tableRow: MyPerformanceTableRow, index: number) => {
        expect(tableRow).toEqual({
          descriptionRow0: salesHierarchySubAccountsMock[index].name,
          descriptionRow1: GO_TO_DASHBOARD_TEXT,
          metricColumn0: salesHierarchySubAccountsMock[index].performance.total,
          metricColumn1: salesHierarchySubAccountsMock[index].performance.totalYearAgo,
          metricColumn2: salesHierarchySubAccountsMock[index].performance.totalYearAgoPercent,
          ctv: calculatorService.getPercentageOfTotal(
            subAccountsMockPerformanceTotalSum,
            salesHierarchySubAccountsMock[index].performance.total
          ),
          performanceError: salesHierarchySubAccountsMock[index].performance.error,
          metadata: {
            id: salesHierarchySubAccountsMock[index].id,
            type: salesHierarchySubAccountsMock[index].type
          }
        });
      });
    });

    it('should return a table row with a SpecializedAccountName when the passed in subaccount has an edge case name', () => {
      const randomIndex: number = chance.integer({ min: 0, max: salesHierarchySubAccountsMock.length - 1 });
      salesHierarchySubAccountsMock[randomIndex].name = 'ALL OTHER';
      const tableRows: MyPerformanceTableRow[] = teamPerformanceTableTransformerService.transformSubAccounts(
        salesHierarchySubAccountsMock
      );

      tableRows.forEach((tableRow: MyPerformanceTableRow, index: number) => {
        index === randomIndex
          ? expect(tableRow.descriptionRow0).toBe(SpecializedAccountName[salesHierarchySubAccountsMock[index].name])
          : expect(tableRow.descriptionRow0).toBe(salesHierarchySubAccountsMock[index].name);
      });
    });
  });
});
