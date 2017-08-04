import { EntityResponsibilities } from './entity-responsibilities.model';
import { PerformanceTotal } from './performance-total.model';

export interface RoleGroups {
  MDM?: EntityResponsibilities[];
  Specialist?: EntityResponsibilities[];
}

export interface RoleGroupPerformanceTotal {
  entityType: string;
  performanceTotal: PerformanceTotal;
}
