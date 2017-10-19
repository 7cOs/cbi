import { EntityType } from '../enums/entity-responsibilities.enum';

export interface HierarchyGroup {
  name: string;
  type: string;
  entityType: EntityType;
  positionId?: string;
  positionDescription?: string;
}
