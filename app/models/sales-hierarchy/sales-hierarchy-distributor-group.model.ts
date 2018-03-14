import { SalesHierarchyDistributor } from './sales-hierarchy-distributor.model';
import { SalesHierarchyEntityGroup } from './sales-hierarchy-entity-group.model';

export interface SalesHierarchyDistributorGroup extends SalesHierarchyEntityGroup {
  distributors: SalesHierarchyDistributor[];
}
