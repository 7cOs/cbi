import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';

export interface HierarchyEntity {
  positionId: string;
  employeeId?: string;
  contextPositionId?: string;
  name: string;
  positionDescription?: string;
  description?: string;
  type?: string;
  hierarchyType?: string;
  otherType?: string;
  peopleType?: EntityPeopleType;
  propertyType?: EntityPropertyType;
}

export interface HierarchyEntityDTO {
  id: string;
  employeeId: string;
  name: string;
  description: string;
  type: string;
  hierarchyType: string;
  positionDescription?: string;
}