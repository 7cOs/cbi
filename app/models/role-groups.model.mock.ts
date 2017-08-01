import { RoleGroups } from './role-groups.model';

import { entityPeopleResponsibilitiesMock } from './entity-responsibilities.model.mock';

export function getMockRoleGroups(): RoleGroups {
  return {
    Specialist: [ entityPeopleResponsibilitiesMock() ],
    MDM: [ entityPeopleResponsibilitiesMock() ]
  };
}
