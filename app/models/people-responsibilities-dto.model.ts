import { EntityResponsibilitiesDTO } from './entity-responsibilities-dto.model';

export interface PeopleResponsibilitiesDTO {
  positions?: EntityResponsibilitiesDTO[];
  entityURIs?: Array<string>;
}
