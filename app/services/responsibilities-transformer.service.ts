import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityDTO } from '../models/entity-dto.model';
import { HierarchyEntity } from '../models/hierarchy-entity.model';
import { EntityType } from '../enums/entity-responsibilities.enum';
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

  public groupPeopleEntitiesByRole(peopleEntities: HierarchyEntity[]): GroupedEntities {
    return peopleEntities.reduce((groupedEntities: GroupedEntities, entity: HierarchyEntity) => {
      if (Array.isArray(groupedEntities[entity.description])) {
        groupedEntities[entity.description].push(entity);
      } else {
        groupedEntities[entity.description] = [ entity ];
      }

      return groupedEntities;
    }, {});
  }

  public groupsAccountsDistributors(accountsDistributors: Array<EntityDTO>, entityType: string): GroupedEntities {
    return accountsDistributors.reduce((groups: GroupedEntities, entity: EntityDTO) => {
      groups[entityType].push({
        name: entity.name,
        positionId: entity.id,
        entityType: EntityType[entity.type]
      });

      return groups;
    }, {[entityType]: []});
  }

  public transformSubAccountsDTO(subAccountsDTO: Array<EntitySubAccountDTO>, accountName: string): GroupedEntities {
    return {
      [accountName]: subAccountsDTO.map((subAccount: EntitySubAccountDTO) => {
        return {
          positionId: subAccount.id,
          name: subAccount.name,
          entityType: EntityType.SubAccount
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
}
