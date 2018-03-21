import { SalesHierarchyEntityGroup } from './sales-hierarchy-entity-group.model';
import { SalesHierarchyPosition } from './sales-hierarchy-position.model';

export interface SalesHierarchyRoleGroup extends SalesHierarchyEntityGroup {
  positions: SalesHierarchyPosition[];
}
