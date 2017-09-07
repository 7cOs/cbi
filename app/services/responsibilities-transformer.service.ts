import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityDTO } from '../models/entity-dto.model';
import { EntityResponsibilities } from '../models/entity-responsibilities.model';
import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { EntityResponsibilitiesDTO } from '../models/entity-responsibilities.model';
import { GroupedEntities } from '../models/grouped-entities.model';

@Injectable()
export class ResponsibilitiesTransformerService {

  constructor() { }

  public groupPeopleByGroupedEntities(responsibilities: EntityResponsibilitiesDTO[]): GroupedEntities {
    return responsibilities.reduce((roleGroups: GroupedEntities, entity: EntityResponsibilitiesDTO) => {
      if (Array.isArray(roleGroups[entity.description])) {
        roleGroups[entity.description].push(this.transformEntityResponsibilitiesDTO(entity));
      } else {
        roleGroups[entity.description] = [
          this.transformEntityResponsibilitiesDTO(entity)
        ];
      }

      return roleGroups;
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

  private transformEntityResponsibilitiesDTO(entity: EntityResponsibilitiesDTO): EntityResponsibilities {
    const transformedEntity: EntityResponsibilities = {
      positionId: entity.id,
      employeeId: entity.employeeId,
      name: entity.name,
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
