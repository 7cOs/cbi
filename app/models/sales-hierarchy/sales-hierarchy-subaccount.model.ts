import { SalesHierarchyEntity } from './sales-hierarchy-entity.model';
import { PremiseTypeValue } from '../../enums/premise-type.enum';

export interface SalesHierarchySubAccount extends SalesHierarchyEntity {
  premiseType: PremiseTypeValue;
}
