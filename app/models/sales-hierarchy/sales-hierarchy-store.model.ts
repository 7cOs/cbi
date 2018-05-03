import { SalesHierarchyEntity } from './sales-hierarchy-entity.model';

export interface SalesHierarchyStore extends SalesHierarchyEntity {
  storeNumber: string;
  unversionedStoreId: string;
}
