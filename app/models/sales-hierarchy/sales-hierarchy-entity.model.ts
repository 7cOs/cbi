import { EntityType } from '../../enums/entity-responsibilities.enum';
import { Performance } from '../performance.model';

export interface SalesHierarchyEntity {
  id: string; // this maps to specific ids in the models.
  name: string;
  type: EntityType;
  performance: Performance;
}
