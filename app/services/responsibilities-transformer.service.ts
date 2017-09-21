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
    return responsibilities.reduce((groupedEntities: GroupedEntities, entity: EntityResponsibilitiesDTO) => {
      if (Array.isArray(groupedEntities[entity.description])) {
        groupedEntities[entity.description].push(this.transformEntityResponsibilitiesDTO(entity));
      } else {
        groupedEntities[entity.description] = [
          this.transformEntityResponsibilitiesDTO(entity)
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
        name: entity.name,
        positionDescription: ''
      });

      return groups;
    }, {'all': []});
  }

  private transformEntityResponsibilitiesDTO(entity: EntityResponsibilitiesDTO): EntityResponsibilities {
    const transformedEntity: EntityResponsibilities = {
      positionId: entity.id,
      employeeId: entity.employeeId,
      name: entity.name,
      positionDescription: entity.positionDescription,
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
