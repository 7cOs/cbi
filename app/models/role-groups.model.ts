import { EntityPeopleType } from '../enums/entity-responsibilities.enum';
import { EntityResponsibilities } from './entity-responsibilities.model';
import { PerformanceTotal } from './performance-total.model';

export interface RoleGroups {
  'MARKET DEVELOPMENT MANAGER'?: EntityResponsibilities[];
  'GENERAL MANAGER'?: EntityResponsibilities[];
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
