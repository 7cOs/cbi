import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityPeopleType, EntityPropertyType, EntityResponsibilities } from '../models/entity-responsibilities.model';
import { EntityResponsibilitiesDTO } from '../models/entity-responsibilities-dto.model';
import { RoleGroups } from '../models/role-groups.model';

@Injectable()
export class ResponsibilitiesTransformerService {
  private typeDisplayMapping: any = {
    'MDM': 'Market Development Managers',
    'Specialist': 'Specialists'
  };

  constructor() { }

  public groupPeopleByRoleGroups(responsibilities: EntityResponsibilitiesDTO[]): RoleGroups {
    let roleGroups: RoleGroups = {};
    Object.keys(responsibilities).forEach((entityType: string) => {
      const entity = responsibilities[entityType];
      const typeDisplayName: string = this.typeDisplayMapping[entity.type] || entity.type;

      if (Array.isArray(roleGroups[entity.type])) {
        roleGroups[entity.type].push(this.transformEntityResponsibilitiesDTO(entity, typeDisplayName));
      } else {
        roleGroups[entity.type] = [
          this.transformEntityResponsibilitiesDTO(entity, typeDisplayName)
        ];
      }
    });

    return roleGroups;
  }

  private transformEntityResponsibilitiesDTO(entity: EntityResponsibilitiesDTO, displayName: string): EntityResponsibilities {
    const transformedEntity: EntityResponsibilities = {
      id: entity.id,
      name: entity.name,
      typeDisplayName: displayName
    };

    if (entity.type in EntityPeopleType) {
      transformedEntity.peopleType = EntityPeopleType[entity.type];
    } else if (entity.type in EntityPropertyType) {
      transformedEntity.propertyType = EntityPropertyType[entity.type];
    } else {
      transformedEntity.otherType = entity.type;
    }

    return transformedEntity;
  }
}
