import { getEntityPeopleResponsibilitiesMock } from './entity-responsibilities.model.mock';
import { getPerformanceTotalMock, getPerformanceTotalDTOMock } from './performance-total.model.mock';
import { RoleGroups, RoleGroupPerformanceTotal, RoleGroupPerformanceTotalDTO } from './role-groups.model';

export function getRoleGroupsMock(): RoleGroups {
  return {
    'GENERAL MANAGER': [ getEntityPeopleResponsibilitiesMock() ],
    'MARKET DEVELOPMENT MANAGER': [ getEntityPeopleResponsibilitiesMock() ]
  };
}

export function getRoleGroupPerformanceTotalDTOMock(): Array<RoleGroupPerformanceTotalDTO> {
  return [
    { entityType: 'GENERAL MANAGER', performanceTotal: getPerformanceTotalDTOMock() },
    { entityType: 'MARKET DEVELOPMENT MANAGER', performanceTotal: getPerformanceTotalDTOMock() }
  ];
}

export function getRoleGroupPerformanceTotalsMock(): Array<RoleGroupPerformanceTotal> {
  return [
    { entityType: 'GENERAL MANAGER', performanceTotal: getPerformanceTotalMock() },
    { entityType: 'MARKET DEVELOPMENT MANAGER', performanceTotal: getPerformanceTotalMock() }
  ];
}
