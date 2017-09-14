import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';

export interface EntityResponsibilities {
  positionId: string;
  employeeId?: string;
  contextPositionId?: string;
  name: string;
  description?: string;
  type?: string;
  hierarchyType?: string;
  otherType?: string;
  peopleType?: EntityPeopleType;
  propertyType?: EntityPropertyType;
}

export interface EntityResponsibilitiesDTO {
  id: string;
  employeeId: string;
  name: string;
  description: string;
  type: string;
  hierarchyType: string;
}
