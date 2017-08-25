import { EntityPropertyType } from '../enums/entity-responsibilities.enum';

export interface EntityDTO {
  type: EntityPropertyType; // Check if that gets casted correctly
  id: string;
  name: string;
}
