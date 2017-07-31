import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityPeopleType, EntityPropertyType, EntityResponsibilities } from '../models/entity-responsibilities.model';
import { EntityResponsibilitiesDTO } from '../models/entity-responsibilities-dto.model';
import { RoleGroups } from '../models/role-groups.model';

@Injectable()
export class ResponsibilitiesTransformerService {
  constructor() { }

  public groupPeopleByRoleGroups(responsibilities: EntityResponsibilitiesDTO[]): RoleGroups {
    let roleGroups: RoleGroups = {};
    Object.keys(responsibilities).forEach((entityType: string) => {
      responsibilities[entityType].forEach((entity: EntityResponsibilitiesDTO) => {
        if (Array.isArray(roleGroups[entity.type])) {
          roleGroups[entity.type].push(this.transformEntityResponsibilitiesDTO(entity));
        } else {
          roleGroups[entity.type] = [this.transformEntityResponsibilitiesDTO(entity)];
        }
      });
    });
    return roleGroups;
  }

  private transformEntityResponsibilitiesDTO(entity: EntityResponsibilitiesDTO): EntityResponsibilities {
    const transformedEntity: EntityResponsibilities = {
      id: entity.id,
      name: entity.name
    };

    if (entity.type in EntityPeopleType) {
      transformedEntity.peopleType = EntityPeopleType[entity.type];
    } else if (entity.type in EntityPropertyType) {
      transformedEntity.propertyType = EntityPropertyType[entity.type];
    }

    return transformedEntity;
  }
}
