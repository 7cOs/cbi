import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';

export interface EntityResponsibilities {
  positionId: string;
  name: string;
  type?: string;
  hierarchyType?: string;
  description?: string;
  otherType?: string;
  peopleType?: EntityPeopleType;
  employeeId?: string;
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
