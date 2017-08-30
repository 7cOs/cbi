import { getEntityPeopleResponsibilitiesMock } from './entity-responsibilities.model.mock';
import { RoleGroups } from './role-groups.model';

export function getRoleGroupsMock(): RoleGroups {
  return {
    'GENERAL MANAGER': [ getEntityPeopleResponsibilitiesMock() ],
    'MARKET DEVELOPMENT MANAGER': [ getEntityPeopleResponsibilitiesMock() ]
  };
}
