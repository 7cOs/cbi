import { RoleGroups } from './role-groups.model';

import { EntityResponsibilities, EntityPeopleType, EntityPropertyType } from './entity-responsibilities.model';
import { entityPeopleResponsibilitiesMock } from './entity-responsibilities.model.mock';

export function getMockRoleGroups() {
  return {
    Specialists: [ entityPeopleResponsibilitiesMock() ],
   'Market Development Managers': [ entityPeopleResponsibilitiesMock() ]
  };
}
