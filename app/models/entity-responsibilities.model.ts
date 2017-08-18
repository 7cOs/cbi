import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';

export interface EntityResponsibilities {
  id: number;
  name: string;
  type: string;
  hierarchyType: string;
  description: string;
  otherType?: string;
  peopleType?: EntityPeopleType;
  employeeId?: string;
  propertyType?: EntityPropertyType;
}
