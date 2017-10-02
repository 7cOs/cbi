import { EntityType } from '../enums/entity-responsibilities.enum';
import { Performance, PerformanceDTO } from './performance.model';

export interface EntityWithPerformanceDTO {
  id: string;
  name: string;
  entityTypeCode?: string;
  entityType: EntityType;
  positionDescription?: string;
  performance: PerformanceDTO;
}

export interface EntityWithPerformance {
  positionId: string;
  contextPositionId?: string;
  name: string;
  entityTypeCode?: string;
  entityType: EntityType;
  positionDescription?: string;
  performance: Performance;
}
