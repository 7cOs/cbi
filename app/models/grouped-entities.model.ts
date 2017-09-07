import { EntityResponsibilities } from './entity-responsibilities.model';

export interface GroupedEntities {
  [key: string]: EntityResponsibilities[];
}
