import { RoleGroups } from './role-groups.model';

import { getEntityPeopleResponsibilitiesMock } from './entity-responsibilities.model.mock';

export function getMockRoleGroups(): RoleGroups {
  return {
    Specialist: [ getEntityPeopleResponsibilitiesMock() ],
    MDM: [ getEntityPeopleResponsibilitiesMock() ]
  };
}
