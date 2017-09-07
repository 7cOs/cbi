import { EntityResponsibilitiesDTO } from './entity-responsibilities.model';

export interface PeopleResponsibilitiesDTO {
  positions?: EntityResponsibilitiesDTO[];
  entityURIs?: Array<string>;
}
