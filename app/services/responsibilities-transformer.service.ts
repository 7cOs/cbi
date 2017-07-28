import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { EntityResponsibilitiesDTO } from '../models/entity-responsibilities-dto.model';
import { RoleGroups } from '../models/role-groups.model';

@Injectable()
export class ResponsibilitiesTransformerService {
  constructor() { }

  public groupPeopleByRoleGroups(responsibilities: EntityResponsibilitiesDTO[]): any {
    let roleGroups: RoleGroups = {};
    Object.keys(responsibilities).forEach((entityType: string) => {
      responsibilities[entityType].forEach((entity: EntityResponsibilitiesDTO) => {
        if (Array.isArray(roleGroups[entity.type])) {
          roleGroups[entity.type].push(entity);
        } else {
          roleGroups[entity.type] = [entity];
        }
      });
    });
    return roleGroups;
  }
}
