import { SalesHierarchyEntityGroup } from './sales-hierarchy-entity-group.model';
import { SalesHierarchyStore } from './sales-hierarchy-store.model';

export interface SalesHierarchyStoreGroup extends SalesHierarchyEntityGroup {
  stores: SalesHierarchyStore[];
}
