import { EntityResponsibilities } from './entity-responsibilities.model';
import { PerformanceTotal, PerformanceTotalDTO } from './performance-total.model';

export interface RoleGroups {
  'MARKET DEVELOPMENT MANAGER'?: EntityResponsibilities[];
  'GENERAL MANAGER'?: EntityResponsibilities[];
}

export interface RoleGroupPerformanceTotalDTO {
  entityType: string;
  performanceTotal: PerformanceTotalDTO;
}

export interface RoleGroupPerformanceTotal {
  entityType: string;
  performanceTotal: PerformanceTotal;
}

export interface FetchResponsibilitiesSuccessPayload {
  positionId: number;
  responsibilities: RoleGroups;
  performanceTotals: Array<RoleGroupPerformanceTotal>;
}
