import { Injectable } from '@angular/core';

import { EntityDTO } from '../../models/entity-dto.model';
import { EntitySubAccountDTO } from '../../models/entity-subaccount-dto.model';
import { EntityPeopleType, EntityType } from '../../enums/entity-responsibilities.enum';
import { GroupedEntities } from '../../models/grouped-entities.model';
import { HierarchyEntity } from '../../models/hierarchy-entity.model';
import { HierarchyEntityDTO } from '../../models/hierarchy-entity.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';

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

  public groupURIResponsibilities(uriResponsibilities: Array<EntityDTO>, groupName: EntityPeopleType): GroupedEntities {
    return groupName === EntityPeopleType.STORE
      ? this.groupStores(uriResponsibilities)
      : this.groupAccountsOrDistributors(uriResponsibilities, groupName);
  }

  public transformSubAccountsDTO(subAccountsDTO: Array<EntitySubAccountDTO>, accountName: string): GroupedEntities {
    return {
      [accountName]: subAccountsDTO.map((subAccount: EntitySubAccountDTO) => {
        return {
          positionId: subAccount.id,
          name: subAccount.name,
          entityType: EntityType.SubAccount,
          premiseType: (subAccount.premiseTypes.length > 1) ?  PremiseTypeValue.All : PremiseTypeValue[subAccount.premiseTypes[0]]
        };
      })
    };
  }

  public transformHierarchyEntityDTOCollection(entities: HierarchyEntityDTO[]): HierarchyEntity[] {
    return entities.map((entityDTO: HierarchyEntityDTO) => {
      return this.transformHierarchyEntityDTO(entityDTO);
    });
  }

  private transformHierarchyEntityDTO(entity: HierarchyEntityDTO): HierarchyEntity {
    return {
      positionId: entity.id,
      employeeId: entity.employeeId,
      name: entity.name,
      positionDescription: entity.positionDescription || '',
      type: entity.type,
      hierarchyType: entity.hierarchyType,
      description: entity.description,
      entityType: EntityType.Person
    };
  }

  private groupAccountsOrDistributors(accountsOrDistributors: EntityDTO[], groupName: EntityPeopleType): GroupedEntities {
    return accountsOrDistributors.reduce((groupedEntities: GroupedEntities, entity: EntityDTO) => {
      groupedEntities[groupName].push({
        name: entity.name,
        positionId: entity.id,
        entityType: entity.type as EntityType
      });

      return groupedEntities;
    }, { [groupName]: [] });
  }

  private groupStores(storeDTOS: EntityDTO[]): GroupedEntities {
    return storeDTOS.reduce((groupedStores: GroupedEntities, store: EntityDTO) => {
      groupedStores[EntityPeopleType.STORE].push({
        positionId: store.id,
        unversionedStoreId: store.storeSourceCode,
        storeNumber: store.storeNumber,
        entityType: EntityType.Store,
        name: store.name
      });

      return groupedStores;
    }, { [EntityPeopleType.STORE]: [] });
  }
}
