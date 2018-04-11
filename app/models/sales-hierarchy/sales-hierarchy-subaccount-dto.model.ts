import { SalesHierarchyEntityDTO } from './sales-hierarchy-entity-dto.model';

export interface SalesHierarchySubAccountDTO extends SalesHierarchyEntityDTO {
  premiseTypes: string[];
}
