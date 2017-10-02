import { EntityPropertyType } from '../enums/entity-responsibilities.enum';
import { Performance, PerformanceDTO } from './performance.model';

export interface EntityWithPerformanceDTO {
  id: string;
  name: string;
  entityTypeCode?: string;
  positionDescription?: string;
  performance: PerformanceDTO;
}

export interface EntityWithPerformance {
  positionId: string;
  contextPositionId?: string;
  name: string;
  entityTypeCode?: string;
  positionDescription?: string;
  performance: Performance;
  propertyType?: EntityPropertyType;
}
