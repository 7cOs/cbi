import { Injectable } from '@angular/core';

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
import { SalesHierarchyType } from '../../enums/sales-hierarchy/sales-hierarchy-type.enum';

@Injectable()
export class SalesHierarchyTransformerService {

  public transformAccountDTOCollection(accountDTOS: SalesHierarchyAccountDTO[], positionId: string): SalesHierarchyAccountGroup {
    const transformedAccounts: SalesHierarchyAccount[] = this.transformAccountDTOS(accountDTOS, positionId);

    return {
      positionId: positionId,
      type: SalesHierarchyEntityType.AccountGroup,
      groupTypeCode: SalesHierarchyGroupTypeCode.Account,
      name: PluralizedRoleGroup.ACCOUNT,
      accounts: transformedAccounts
    };
  }

  public transformDistributorDTOCollection(
    distributorDTOs: SalesHierarchyDistributorDTO[],
    positionId: string
  ): SalesHierarchyDistributorGroup {
    const transformedDistributors: SalesHierarchyDistributor[] = this.transformDistributorDTOS(distributorDTOs, positionId);

    return {
      positionId: positionId,
      type: SalesHierarchyEntityType.DistributorGroup,
      groupTypeCode: SalesHierarchyGroupTypeCode.Distributor,
      name: PluralizedRoleGroup.GEOGRAPHY,
      distributors: transformedDistributors
    };
  }

  public transformPositionDTOCollection(
    positionDTOS: SalesHierarchyPositionDTO[],
    positionId: string,
    isAlternateHierarchyEntryPoint: boolean
  ): SalesHierarchyRoleGroup[] {
    return isAlternateHierarchyEntryPoint
      ? this.groupPositionsInGeographyGroup(positionDTOS, positionId)
      : this.groupPositionsByRoleGroup(positionDTOS, positionId);
  }

  public transformSubAccountDTOCollection(subAccountDTOS: SalesHierarchySubAccountDTO[]): SalesHierarchySubAccount[] {
    return subAccountDTOS.map((subAccountDTO: SalesHierarchySubAccountDTO) => {
      return {
        id: subAccountDTO.id,
        name: subAccountDTO.name,
        type: SalesHierarchyEntityType.SubAccount,
        premiseType: subAccountDTO.premiseTypes.length > 1 ? PremiseTypeValue.All : subAccountDTO.premiseTypes[0] as PremiseTypeValue
      };
    });
  }

  private getRoleGroup(name: string, positionId: string, groupTypeCode: string): SalesHierarchyRoleGroup {
    return {
      positionId: positionId,
      type: SalesHierarchyEntityType.RoleGroup,
      groupTypeCode: groupTypeCode,
      name: name,
      positions: []
    };
  }

  private groupPositionsByRoleGroup(positionDTOS: SalesHierarchyPositionDTO[], positionId: string): SalesHierarchyRoleGroup[] {
    const positionsGroupedByRoleGroup = {};

    positionDTOS.forEach((positionDTO: SalesHierarchyPositionDTO) => {
      const transformedPosition: SalesHierarchyPosition = this.transformPositionDTO(positionDTO);

      if (positionsGroupedByRoleGroup[transformedPosition.positionRoleGroup]) {
        positionsGroupedByRoleGroup[transformedPosition.positionRoleGroup].positions.push(transformedPosition);
      } else {
        positionsGroupedByRoleGroup[transformedPosition.positionRoleGroup] = this.getRoleGroup(
          transformedPosition.positionRoleGroup,
          positionId,
          positionDTO.type
        );

        positionsGroupedByRoleGroup[transformedPosition.positionRoleGroup].positions.push(transformedPosition);
      }
    });

    return Object.keys(positionsGroupedByRoleGroup).map((roleGroupName: string) => {
      return positionsGroupedByRoleGroup[roleGroupName];
    });
  }

  private groupPositionsInGeographyGroup(positionDTOS: SalesHierarchyPositionDTO[], positionId: string): SalesHierarchyRoleGroup[] {
    const transformedPositions: SalesHierarchyPosition[] = positionDTOS.map((positionDTO: SalesHierarchyPositionDTO) => {
      return this.transformPositionDTO(positionDTO);
    });

    return [{
      positionId: positionId,
      type: SalesHierarchyEntityType.RoleGroup,
      groupTypeCode: positionDTOS[0].type,
      name: PluralizedRoleGroup.GEOGRAPHY,
      positions: transformedPositions
    }];
  }

  private transformAccountDTOS(accountDTOS: SalesHierarchyAccountDTO[], positionId: string): SalesHierarchyAccount[] {
    return accountDTOS.map((accountDTO: SalesHierarchyAccountDTO) => {
      return {
        id: accountDTO.id,
        positionId: positionId,
        name: accountDTO.name,
        type: SalesHierarchyEntityType.Account
      };
    });
  }

  private transformDistributorDTOS(distributorDTOS: SalesHierarchyDistributorDTO[], positionId: string): SalesHierarchyDistributor[] {
    return distributorDTOS.map((distributorDTO: SalesHierarchyDistributorDTO) => {
      return {
        id: distributorDTO.id,
        positionId: positionId,
        name: distributorDTO.name,
        type: SalesHierarchyEntityType.Distributor
      };
    });
  }

  private transformPositionDTO(positionDTO: SalesHierarchyPositionDTO): SalesHierarchyPosition {
    return {
      id: positionDTO.id,
      employeeId: positionDTO.employeeId,
      type: SalesHierarchyEntityType.Person,
      salesHierarchyType: positionDTO.hierarchyType as SalesHierarchyType,
      name: positionDTO.name,
      positionRoleGroup: positionDTO.description,
      positionLocation: positionDTO.positionDescription,
      isOpenPosition: positionDTO.name === 'Open' ? true : false
    };
  }
}
