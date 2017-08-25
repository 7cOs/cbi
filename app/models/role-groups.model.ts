import { EntityResponsibilities } from './entity-responsibilities.model';
import { PerformanceTotal } from './performance-total.model';

export interface RoleGroups {
  [key: string]: EntityResponsibilities[];
}

export interface RoleGroupPerformanceTotal {
  entityType: string;
  performanceTotal: PerformanceTotal;
}

export interface FetchResponsibilitiesSuccessPayload {
  positionId: string;
  responsibilities: RoleGroups;
  performanceTotals: Array<RoleGroupPerformanceTotal>;
}
