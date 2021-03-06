import { getEntityPeopleResponsibilitiesMock } from './hierarchy-entity.model.mock';
import { GroupedEntities } from './grouped-entities.model';

  export function getGroupedEntitiesMock(): GroupedEntities {
  return {
    'GENERAL MANAGER': [ getEntityPeopleResponsibilitiesMock() ],
    'MARKET DEVELOPMENT MANAGER': [ getEntityPeopleResponsibilitiesMock() ],
    'NATIONAL SALES ORG': [ getEntityPeopleResponsibilitiesMock() ],
    'DRAFT': [ getEntityPeopleResponsibilitiesMock() ]
  };
}
