import { SalesHierarchyEntityDTO } from './sales-hierarchy-entity-dto.model';
import { SalesHierarchyEntityType } from '../../enums/sales-hierarchy/sales-hierarchy-entity-type.enum';

export interface SalesHierarchyStoreDTO extends SalesHierarchyEntityDTO {
  type: SalesHierarchyEntityType;
  storeNumber: string;
  storeSourceCode: string;
}
