import { EntityType } from '../enums/entity-responsibilities.enum';

export interface HierarchyGroup {
  name: string;
  type: string;
  entityType: EntityType;
  positionId?: string;
  alternateHierarchyId?: string;
  hierarchyType?: string;
  positionDescription?: string;
  isMemberOfExceptionHierarchy?: boolean;
}
