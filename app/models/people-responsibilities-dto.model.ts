import { HierarchyEntityDTO } from './hierarchy-entity.model';

export interface PeopleResponsibilitiesDTO {
  positions?: HierarchyEntityDTO[];
  entityURIs?: Array<string>;
}
