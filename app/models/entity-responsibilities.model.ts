import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { PerformanceTotal, PerformanceTotalDTO } from './performance-total.model';

export interface EntityResponsibilities {
  positionId: string;
  name: string;
  type?: string;
  hierarchyType?: string;
  description?: string;
  otherType?: string;
  peopleType?: EntityPeopleType;
  employeeId?: string;
  propertyType?: EntityPropertyType;
}

export interface ResponsibilityEntityPerformanceDTO {
  id: string;
  name: string;
  performanceTotal: PerformanceTotalDTO;
}

export interface ResponsibilityEntityPerformance {
  positionId: string;
  name: string;
  performanceTotal: PerformanceTotal;
}
