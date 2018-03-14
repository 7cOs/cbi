import { SalesHierarchyAccount } from './sales-hierarchy-account.model';
import { SalesHierarchyEntityGroup } from './sales-hierarchy-entity-group.model';

export interface SalesHierarchyAccountGroup extends SalesHierarchyEntityGroup {
  accounts: SalesHierarchyAccount[];
}
