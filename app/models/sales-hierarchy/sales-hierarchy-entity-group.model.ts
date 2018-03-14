import { EntityType } from '../../enums/entity-responsibilities.enum';

export interface SalesHierarchyEntityGroup {
  isAlternateHierarchyEntryPoint: boolean;
  groupTypeCode: string;
  positionId: string;
  name: string;
  type: EntityType;
  performance?: Performance;
  alternateHierarchyId?: string;
}
