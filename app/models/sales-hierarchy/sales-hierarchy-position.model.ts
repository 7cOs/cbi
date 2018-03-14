import { SalesHierarchyEntity } from './sales-hierarchy-entity.model';
import { SalesHierarchyType } from '../../enums/sales-hierarchy-type.enum';

export interface SalesHierarchyPosition extends SalesHierarchyEntity {
  salesHierarchyType: SalesHierarchyType;
  employeeId: string;
  isOpenPosition?: boolean;
  positionLocation?: string; // Title of the position
  positionRoleGroup?: string;
}
