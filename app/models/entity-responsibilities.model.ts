import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { PerformanceTotal, PerformanceTotalDTO } from './performance-total.model';

export interface EntityResponsibilities {
  id: number;
  name: string;
  type: string;
  hierarchyType: string;
  description: string;
  otherType?: string;
  peopleType?: EntityPeopleType;
  employeeId?: string;
  propertyType?: EntityPropertyType;
}

export interface EntityResponsibilitiesPerformanceDTO {
  id: number;
  name: string;
  performanceTotal: PerformanceTotalDTO;
}

export interface EntityResponsibilitiesPerformance {
  id: number;
  name: string;
  performanceTotal: PerformanceTotal;
}
