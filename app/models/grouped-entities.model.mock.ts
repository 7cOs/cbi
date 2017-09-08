import { getEntityPeopleResponsibilitiesMock } from './entity-responsibilities.model.mock';
import { GroupedEntities } from './grouped-entities.model';

  export function getGroupedEntitiesMock(): GroupedEntities {
  return {
    'GENERAL MANAGER': [ getEntityPeopleResponsibilitiesMock() ],
    'MARKET DEVELOPMENT MANAGER': [ getEntityPeopleResponsibilitiesMock() ]
  };
}
