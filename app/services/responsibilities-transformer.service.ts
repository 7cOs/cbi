import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityResponsibilities } from '../models/entity-responsibilities.model';
import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { EntityResponsibilitiesDTO } from '../models/entity-responsibilities-dto.model';
import { RoleGroups } from '../models/role-groups.model';

@Injectable()
export class ResponsibilitiesTransformerService {
  private typeDisplayMapping: {[key: string]: string} = {
    'MDM': 'Market Development Manager',
    'Specialist': 'Specialist'
  };

  constructor() { }

  public groupPeopleByRoleGroups(responsibilities: EntityResponsibilitiesDTO[]): RoleGroups {
    return responsibilities.reduce((roleGroups: RoleGroups, entity: EntityResponsibilitiesDTO) => {
      const typeDisplayName: string = this.typeDisplayMapping[entity.type] || entity.type;

      if (Array.isArray(roleGroups[entity.type])) {
        roleGroups[entity.type].push(this.transformEntityResponsibilitiesDTO(entity, typeDisplayName));
      } else {
        roleGroups[entity.type] = [
          this.transformEntityResponsibilitiesDTO(entity, typeDisplayName)
        ];
      }

      return roleGroups;
    }, {});
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
