import { getEntityPeopleResponsibilitiesMock } from './entity-responsibilities.model.mock';
import { getPerformanceTotalMock } from './performance-total.model.mock';
import { RoleGroups, RoleGroupPerformanceTotal } from './role-groups.model';

export function getMockRoleGroups(): RoleGroups {
  return {
    Specialist: [ getEntityPeopleResponsibilitiesMock() ],
    MDM: [ getEntityPeopleResponsibilitiesMock() ]
  };
}

export function getMockRoleGroupPerformanceTotals(): Array<RoleGroupPerformanceTotal> {
  return [
    { entityType: 'Specialist', performanceTotal: getPerformanceTotalMock() },
    { entityType: 'MDM', performanceTotal: getPerformanceTotalMock() }
  ];
}
