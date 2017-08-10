import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';

export interface EntityResponsibilities {
  id: number;
  name: string;
  otherType?: string;
  peopleType?: EntityPeopleType;
  propertyType?: EntityPropertyType;
  typeDisplayName: string;
}
