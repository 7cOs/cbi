import * as Chance from 'chance';
import { getTestBed, TestBed } from '@angular/core/testing';

import { getPremiseTypeValueMock } from '../../enums/premise-type.enum.mock';
import { getSalesHierarchyAccountDTOSMock } from '../../models/sales-hierarchy/sales-hierarchy-account-dto.model.mock';
import { getSalesHierarchyDistributorDTOSMock } from '../../models/sales-hierarchy/sales-hierarchy-distributor-dto.model.mock';
import { getSalesHierarchyPositionDTOMock,
         getSalesHierarchyPositionDTOSMock } from '../../models/sales-hierarchy/sales-hierarchy-position-dto.model.mock';
import { getSalesHierarchySubAccountDTOSMock } from '../../models/sales-hierarchy/sales-hierarchy-subaccount-dto.model.mock';
import { PluralizedRoleGroup } from '../../enums/pluralized-role-group.enum';
import { PremiseTypeValue } from '../../enums/premise-type.enum';
import { SalesHierarchyAccount } from '../../models/sales-hierarchy/sales-hierarchy-account.model';
import { SalesHierarchyAccountDTO } from '../../models/sales-hierarchy/sales-hierarchy-account-dto.model';
import { SalesHierarchyAccountGroup } from '../../models/sales-hierarchy/sales-hierarchy-account-group.model';
import { SalesHierarchyDistributor } from '../../models/sales-hierarchy/sales-hierarchy-distributor.model';
import { SalesHierarchyDistributorDTO } from '../../models/sales-hierarchy/sales-hierarchy-distributor-dto.model';
import { SalesHierarchyDistributorGroup } from '../../models/sales-hierarchy/sales-hierarchy-distributor-group.model';
import { SalesHierarchyEntityType } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum';
import { SalesHierarchyGroupTypeCode } from '../../enums/sales-hierarchy/sales-hierarchy-group-type-code.enum';
import { SalesHierarchyPosition } from '../../models/sales-hierarchy/sales-hierarchy-position.model';
import { SalesHierarchyPositionDTO } from '../../models/sales-hierarchy/sales-hierarchy-position-dto.model';
import { SalesHierarchyRoleGroup } from '../../models/sales-hierarchy/sales-hierarchy-role-group.model';
import { SalesHierarchySubAccount } from '../../models/sales-hierarchy/sales-hierarchy-subaccount.model';
import { SalesHierarchySubAccountDTO } from '../../models/sales-hierarchy/sales-hierarchy-subaccount-dto.model';
import { SalesHierarchyTransformerService } from './sales-hierarchy-transformer.service';

const chance = new Chance();

describe('Sales Hierarchy Transformer Service', () => {
  let testBed: TestBed;
  let salesHierarchyTransformerService: SalesHierarchyTransformerService;

  let positionIdMock: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ SalesHierarchyTransformerService ]
    });

    testBed = getTestBed();
    salesHierarchyTransformerService = testBed.get(SalesHierarchyTransformerService);

    positionIdMock = chance.string();
  });

  describe('transformAccountDTOCollection', () => {
    let salesHierarchyAccountDTOSMock: SalesHierarchyAccountDTO[];

    beforeEach(() => {
      salesHierarchyAccountDTOSMock = getSalesHierarchyAccountDTOSMock();
    });

    it('should return a SalesHierarchyAccountGroup called `ACCOUNTS` for the given AccountDTO Collection and provided positionId'
    + ' that contains the transformed SalesHierarchyAccounts collection', () => {
      const expectedAccounts: SalesHierarchyAccount[] = salesHierarchyAccountDTOSMock.map((accountDTO: SalesHierarchyAccountDTO) => {
        return {
          id: accountDTO.id,
          positionId: positionIdMock,
          name: accountDTO.name,
          type: SalesHierarchyEntityType.Account
        };
      });
      const expectedAccountGroup: SalesHierarchyAccountGroup = {
        positionId: positionIdMock,
        type: SalesHierarchyEntityType.AccountGroup,
        groupTypeCode: SalesHierarchyGroupTypeCode.Account,
        name: PluralizedRoleGroup.ACCOUNT,
        accounts: expectedAccounts
      };
      const actualAccountGroup: SalesHierarchyAccountGroup = salesHierarchyTransformerService.transformAccountDTOCollection(
        salesHierarchyAccountDTOSMock,
        positionIdMock
      );

      expect(actualAccountGroup).toEqual(expectedAccountGroup);
    });
  });

  describe('transformDistributorDTOCollection', () => {
    let salesHierarchyDistributorDTOSMock: SalesHierarchyDistributorDTO[];

    beforeEach(() => {
      salesHierarchyDistributorDTOSMock = getSalesHierarchyDistributorDTOSMock();
    });

    it('should return a SalesHierarchyDistributorGroup called `GEOGRAPHY` for the given DistributorDTO Collection and positionId that'
    + ' contains the transformed SalesHierarchyDistributor collection', () => {
      const expectedDistributors: SalesHierarchyDistributor[] = salesHierarchyDistributorDTOSMock.map(
        (distributorDTO: SalesHierarchyDistributorDTO) => {
          return {
            id: distributorDTO.id,
            positionId: positionIdMock,
            name: distributorDTO.name,
            type: SalesHierarchyEntityType.Distributor
          };
      });
      const expectedDistributorGroup: SalesHierarchyDistributorGroup = {
        positionId: positionIdMock,
        type: SalesHierarchyEntityType.DistributorGroup,
        groupTypeCode: SalesHierarchyGroupTypeCode.Distributor,
        name: PluralizedRoleGroup.GEOGRAPHY,
        distributors: expectedDistributors
      };
      const actualDistributorGroup: SalesHierarchyDistributorGroup = salesHierarchyTransformerService.transformDistributorDTOCollection(
        salesHierarchyDistributorDTOSMock,
        positionIdMock
      );

      expect(actualDistributorGroup).toEqual(expectedDistributorGroup);
    });
  });

  describe('transformPositionDTOCollection', () => {
    let salesHierarchyPositionDTOSMock: SalesHierarchyPositionDTO[];
    let isAlternateHierarchyEntryPointMock: boolean;

    describe('when the passed in SalesHierarchyPositionDTO collection is going to be an alternate hierachy entry point group', () => {
      beforeEach(() => {
        salesHierarchyPositionDTOSMock = getSalesHierarchyPositionDTOSMock();
        isAlternateHierarchyEntryPointMock = true;
      });

      it('should return a single `GEOGRAPHY` SalesHierarchyRoleGroup containing all the transformed positions', () => {
        const expectedPositions: SalesHierarchyPosition[] = salesHierarchyPositionDTOSMock.map(
          (positionDTO: SalesHierarchyPositionDTO) => {
            return {
              id: positionDTO.id,
              employeeId: positionDTO.employeeId,
              type: SalesHierarchyEntityType.Person,
              salesHierarchyType: positionDTO.hierarchyType,
              name: positionDTO.name,
              positionRoleGroup: positionDTO.description,
              positionLocation: positionDTO.positionDescription,
              isOpenPosition: false
            };
        });
        const expectedRoleGroupCollection: SalesHierarchyRoleGroup[] = [{
          positionId: positionIdMock,
          type: SalesHierarchyEntityType.RoleGroup,
          groupTypeCode: salesHierarchyPositionDTOSMock[0].type,
          name: PluralizedRoleGroup.GEOGRAPHY,
          positions: expectedPositions
        }];
        const actualRoleGroupCollection: SalesHierarchyRoleGroup[] = salesHierarchyTransformerService.transformPositionDTOCollection(
          salesHierarchyPositionDTOSMock,
          positionIdMock,
          isAlternateHierarchyEntryPointMock
        );

        expect(actualRoleGroupCollection).toEqual(expectedRoleGroupCollection);
      });
    });

    describe('when the passed in SalesHierarchyPositionDTO collection is NOT going to be an alternate hierachy entry point group', () => {
      let roleGroupNameMock: string;

      beforeEach(() => {
        roleGroupNameMock = chance.string();
        isAlternateHierarchyEntryPointMock = false;
        salesHierarchyPositionDTOSMock = Array(4).fill('').map(() => getSalesHierarchyPositionDTOMock());
        salesHierarchyPositionDTOSMock[0].description = roleGroupNameMock;
        salesHierarchyPositionDTOSMock[1].description = roleGroupNameMock;
      });

      it('should return an array of SalesHierarchyRoleGroups for each unique description in the PositionDTO collection', () => {
        const actualRoleGroupCollection: SalesHierarchyRoleGroup[] = salesHierarchyTransformerService.transformPositionDTOCollection(
          salesHierarchyPositionDTOSMock,
          positionIdMock,
          isAlternateHierarchyEntryPointMock
        );

        expect(actualRoleGroupCollection.length).toBe(3);

        actualRoleGroupCollection.forEach((roleGroup: SalesHierarchyRoleGroup, index: number) => {
          expect(roleGroup.positionId).toBe(positionIdMock);
          expect(roleGroup.type).toBe(SalesHierarchyEntityType.RoleGroup);

          if (index === 0) {
            expect(roleGroup.name).toBe(salesHierarchyPositionDTOSMock[0].description);
            expect(roleGroup.groupTypeCode).toBe(salesHierarchyPositionDTOSMock[0].type);
          } else {
            expect(roleGroup.name).toBe(salesHierarchyPositionDTOSMock[index + 1].description);
            expect(roleGroup.groupTypeCode).toBe(salesHierarchyPositionDTOSMock[index + 1].type);
          }
        });
      });

      it('should return an array of SalesHierarchyRoleGroups that contain the transformed positions belonging to each'
      + ' respective role group', () => {
        const expectedPositions: SalesHierarchyPosition[] = salesHierarchyPositionDTOSMock.map(
          (positionDTO: SalesHierarchyPositionDTO) => {
            return {
              id: positionDTO.id,
              employeeId: positionDTO.employeeId,
              type: SalesHierarchyEntityType.Person,
              salesHierarchyType: positionDTO.hierarchyType,
              name: positionDTO.name,
              positionRoleGroup: positionDTO.description,
              positionLocation: positionDTO.positionDescription,
              isOpenPosition: false
            };
        });
        const actualRoleGroupCollection: SalesHierarchyRoleGroup[] = salesHierarchyTransformerService.transformPositionDTOCollection(
          salesHierarchyPositionDTOSMock,
          positionIdMock,
          isAlternateHierarchyEntryPointMock
        );

        actualRoleGroupCollection.forEach((roleGroup: SalesHierarchyRoleGroup, index: number) => {
          if (index === 0) {
            expect(roleGroup.positions.length).toBe(2);
            expect(roleGroup.positions[0]).toEqual(expectedPositions[0]);
            expect(roleGroup.positions[1]).toEqual(expectedPositions[1]);
          } else {
            expect(roleGroup.positions.length).toBe(1);
            expect(roleGroup.positions[0]).toEqual(expectedPositions[index + 1]);
          }
        });
      });
    });

    describe('regardless if the SalesHierarchyPositionDTO collection is an alternate hierarchy entry point or not', () => {
      beforeEach(() => {
        salesHierarchyPositionDTOSMock = getSalesHierarchyPositionDTOSMock();
        salesHierarchyPositionDTOSMock.forEach((positionDTO: SalesHierarchyPositionDTO) => {
          positionDTO.name = 'Open';
        });
        isAlternateHierarchyEntryPointMock = true;
      });

      it('should return transformed positions with isOpenPosition set to true when the position name is `Open`', () => {
        const actualRoleGroupCollection: SalesHierarchyRoleGroup[] = salesHierarchyTransformerService.transformPositionDTOCollection(
          salesHierarchyPositionDTOSMock,
          positionIdMock,
          isAlternateHierarchyEntryPointMock
        );

        actualRoleGroupCollection[0].positions.forEach((position: SalesHierarchyPosition) => {
          expect(position.isOpenPosition).toBe(true);
        });
      });
    });
  });

  describe('transformSubAccountDTOCollection', () => {
    let salesHierarchySubAccountDTOSMock: SalesHierarchySubAccountDTO[];

    beforeEach(() => {
      salesHierarchySubAccountDTOSMock = getSalesHierarchySubAccountDTOSMock();
    });

    it('should return a SalesHierarchySubAccount for each SalesHierarchySubAccountDTO object', () => {
      const transformedSubAccounts: SalesHierarchySubAccount[] = salesHierarchyTransformerService.transformSubAccountDTOCollection(
        salesHierarchySubAccountDTOSMock);

      transformedSubAccounts.forEach((subAccount: SalesHierarchySubAccount, index: number) => {
        expect(subAccount).toEqual({
          id: salesHierarchySubAccountDTOSMock[index].id,
          name: salesHierarchySubAccountDTOSMock[index].name,
          type: SalesHierarchyEntityType.SubAccount,
          premiseType: PremiseTypeValue[salesHierarchySubAccountDTOSMock[index].premiseTypes[0]]
        });
      });
    });

    it('should return a SubAccount with a PremiseTypeValue of All when the SubAccountDTO contains multiple PremiseType', () => {
      salesHierarchySubAccountDTOSMock.forEach((subAccountDTO: SalesHierarchySubAccountDTO) => {
        subAccountDTO.premiseTypes.push(getPremiseTypeValueMock());
      });

      const transformedSubAccounts: SalesHierarchySubAccount[] = salesHierarchyTransformerService.transformSubAccountDTOCollection(
        [salesHierarchySubAccountDTOSMock[0]]);

      transformedSubAccounts.forEach((subAccount: SalesHierarchySubAccount) => {
        expect(subAccount.premiseType).toBe(PremiseTypeValue.All);
      });
    });
  });
});
