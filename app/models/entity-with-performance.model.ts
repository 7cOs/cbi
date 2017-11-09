import { EntityType } from '../enums/entity-responsibilities.enum';
import { Performance, PerformanceDTO } from './performance.model';

export interface EntityWithPerformanceDTO {
  id: string;
  name: string;
  entityTypeCode?: string;
  entityType: EntityType;
  positionDescription?: string;
  performance: PerformanceDTO;
  alternateHierarchyId?: string;
}

export interface EntityWithPerformance {
  positionId: string;
  name: string;
  entityType: EntityType;
  positionDescription?: string;
  performance: Performance;
  contextPositionId?: string;
  alternateHierarchyId?: string;
  entityTypeCode?: string;
  exceptionHierarchy?: boolean;
}
