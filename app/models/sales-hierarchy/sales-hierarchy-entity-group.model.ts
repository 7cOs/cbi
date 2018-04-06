import { Performance } from '../performance.model';
import { SalesHierarchyEntityType } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum';

export interface SalesHierarchyEntityGroup {
  positionId: string;
  type: SalesHierarchyEntityType;
  groupTypeCode: string;
  name: string;
  performance?: Performance;
}
