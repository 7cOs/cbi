import { Performance } from '../performance.model';
import { SalesHierarchyEntityType } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum';

export interface SalesHierarchyEntity {
  id: string;
  name: string;
  type: SalesHierarchyEntityType;
  performance?: Performance;
}
