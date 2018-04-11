import { SalesHierarchyEntityDTO } from './sales-hierarchy-entity-dto.model';
import { SalesHierarchyType } from '../../enums/sales-hierarchy/sales-hierarchy-type.enum';

export interface SalesHierarchyPositionDTO extends SalesHierarchyEntityDTO {
  type: string;
  hierarchyType: SalesHierarchyType;
  description: string;
  positionDescription: string;
  employeeId?: string;
}
