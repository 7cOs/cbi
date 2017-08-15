import { getEntityPeopleResponsibilitiesMock } from './entity-responsibilities.model.mock';
import { getPerformanceTotalMock } from './performance-total.model.mock';
import { RoleGroups, RoleGroupPerformanceTotal } from './role-groups.model';

export function getRoleGroupsMock(): RoleGroups {
  return {
    'GENERAL MANAGER': [ getEntityPeopleResponsibilitiesMock() ],
    'MARKET DEVELOPMENT MANAGER': [ getEntityPeopleResponsibilitiesMock() ]
  };
}

export function getRoleGroupPerformanceTotalsMock(): Array<RoleGroupPerformanceTotal> {
  return [
    { entityType: 'GENERAL MANAGER', performanceTotal: getPerformanceTotalMock() },
    { entityType: 'MARKET DEVELOPMENT MANAGER', performanceTotal: getPerformanceTotalMock() }
  ];
}
