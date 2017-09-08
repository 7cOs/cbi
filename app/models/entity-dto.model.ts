import { EntityPropertyType } from '../enums/entity-responsibilities.enum';

export interface EntityDTO {
  type: EntityPropertyType;
  id: string;
  name: string;
}
