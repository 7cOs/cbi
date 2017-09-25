import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityDTO } from '../models/entity-dto.model';
import { HierarchyEntity } from '../models/hierarchy-entity.model';
import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { HierarchyEntityDTO } from '../models/hierarchy-entity.model';
import { EntitySubAccountDTO } from '../models/entity-subaccount-dto.model';
import { GroupedEntities } from '../models/grouped-entities.model';

@Injectable()
export class ResponsibilitiesTransformerService {

  public groupPeopleByGroupedEntities(responsibilities: HierarchyEntityDTO[]): GroupedEntities {
    return responsibilities.reduce((groupedEntities: GroupedEntities, entity: HierarchyEntityDTO) => {
      if (Array.isArray(groupedEntities[entity.description])) {
        groupedEntities[entity.description].push(this.transformHierarchyEntityDTO(entity));
      } else {
        groupedEntities[entity.description] = [
          this.transformHierarchyEntityDTO(entity)
        ];
      }

      return groupedEntities;
    }, {});
  }

  public groupsAccountsDistributors(accountsDistributors: Array<EntityDTO>): GroupedEntities {
    return accountsDistributors.reduce((groups: GroupedEntities, entity: EntityDTO) => {
      groups['all'].push({
        propertyType: entity.type,
        positionId: entity.id,
        name: entity.name
      });

      return groups;
    }, {'all': []});
  }

  public transformSubAccountsDTO(subAccountsDTO: Array<EntitySubAccountDTO>, accountName: string): GroupedEntities {
    return {
      [accountName]: subAccountsDTO.map((subAccount: EntitySubAccountDTO) => {
        return {
          positionId: subAccount.subaccountCode,
          contextPositionId: subAccount.accountCode,
          name: subAccount.subaccountDescription,
          propertyType: EntityPropertyType.SubAccount
        };
      })
    };
  }

  private transformHierarchyEntityDTO(entity: HierarchyEntityDTO): HierarchyEntity {
    const transformedEntity: HierarchyEntity = {
      positionId: entity.id,
      employeeId: entity.employeeId,
      name: entity.name,
      positionDescription: entity.positionDescription || '',
      type: entity.type,
      hierarchyType: entity.hierarchyType,
      description: entity.description
    };

    if (entity.description in EntityPeopleType) {
      transformedEntity.peopleType = EntityPeopleType[entity.description];
    } else if (entity.description in EntityPropertyType) {
      transformedEntity.propertyType = EntityPropertyType[entity.description];
    } else {
      transformedEntity.otherType = entity.description;
    }

    return transformedEntity;
  }
}
