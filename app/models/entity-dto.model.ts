import { EntityType } from '../enums/entity-responsibilities.enum';

export interface EntityDTO {
  id: string;
  name: string;
  type: EntityType;
  storeSourceCode?: string;
  storeNumber?: string;
}
