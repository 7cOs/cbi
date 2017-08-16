import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityResponsibilities } from '../models/entity-responsibilities.model';
import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { EntityResponsibilitiesDTO } from '../models/entity-responsibilities-dto.model';
import { RoleGroups } from '../models/role-groups.model';

@Injectable()
export class ResponsibilitiesTransformerService {

  constructor() { }

  public groupPeopleByRoleGroups(responsibilities: EntityResponsibilitiesDTO[]): RoleGroups {
    return responsibilities.reduce((roleGroups: RoleGroups, entity: EntityResponsibilitiesDTO) => {
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

  private transformEntityResponsibilitiesDTO(entity: EntityResponsibilitiesDTO): EntityResponsibilities {
    const transformedEntity: EntityResponsibilities = {
      id: entity.id,
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
