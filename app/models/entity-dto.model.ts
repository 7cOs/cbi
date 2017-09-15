import { EntityPropertyType } from '../enums/entity-responsibilities.enum';

export interface EntityDTO {
  id: string;
  name: string;
  type: EntityPropertyType;
}
