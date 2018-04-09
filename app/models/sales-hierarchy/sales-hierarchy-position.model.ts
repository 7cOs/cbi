import { SalesHierarchyEntity } from './sales-hierarchy-entity.model';
import { SalesHierarchyType } from '../../enums/sales-hierarchy/sales-hierarchy-type.enum';

export interface SalesHierarchyPosition extends SalesHierarchyEntity {
  salesHierarchyType: SalesHierarchyType;
  positionLocation: string;
  positionRoleGroup: string;
  isOpenPosition: boolean;
  employeeId: string;
}
