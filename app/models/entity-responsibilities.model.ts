import { EntityPeopleType, EntityPropertyType } from '../enums/entity-responsibilities.enum';

export interface EntityResponsibilities {
  peopleType?: EntityPeopleType;
  propertyType?: EntityPropertyType;
  id: string;
  name: string;
}
