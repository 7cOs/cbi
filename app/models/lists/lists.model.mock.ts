import * as Lists from './lists.model';
import * as ListProperties from '../../enums/lists/list-properties.enum';
import { getListOpportunityMock } from '../../models/lists/lists-opportunities.model.mock';

import * as Chance from 'chance';
import { generateRandomSizedArray } from '../util.model';

const chance = new Chance();

function getBaseListMock() {
  return {
    archived: chance.bool(),
    collaborators: getCollaborators(chance.natural({min: 1, max: 5})),
    createdon: chance.string(),
    deleted: chance.bool(),
    description: chance.string(),
    id: chance.string(),
    name: chance.string(),
    numberofaccounts: chance.natural({min: 0, max: 1000}),
    numberofclosedopportunities: chance.natural({min: 0, max: 1000}),
    owner: getUser(),
    survey: getSurvey(),
    totalopportunities: chance.natural({min: 0, max: 1000}),
    type: ListProperties.ListType.TargetList,
    updatedon: chance.string()
  };
}

export function getV3ListMock() {
  return Object.assign(
    getBaseListMock(),
    {
      category: ListProperties.ListCategory.Beer,
      collaboratorType: ListProperties.CollaboratorType.CollaborateAndInvite
    }
  );
}

export function getV2ListMock() {
  return Object.assign(
    getBaseListMock(),
    {
      collaboratorPermissionLevel: ListProperties.CollaboratorType.CollaborateAndInvite,
      opportunitiesSummary: getOpportunitiesSummary(),
      dateOpportunitiesUpdated: chance.bool() ? chance.string() : null,
      targetListAuthor: chance.bool() ? chance.string() : null;
    }
  );
}

export function getUnformattedNewList() {
  return {
    description: chance.string(),
    name: chance.string(),
    opportunities: [] as any[],
    collaborators: getCollaborators(chance.natural({min: 1, max: 5}))
  };
}

export function getFormattedNewList() {
  return {
    category: ListProperties.ListCategory.Beer,
    collaboratorType: ListProperties.CollaboratorType.CollaborateAndInvite,
    name: chance.string(),
    type: ListProperties.ListType.TargetList
  };
}

function getOpportunitiesSummary() {
  const numberOfOpportunities = chance.natural({min: 0, max: 1000});
  return {
    closedOpportunitiesCount: numberOfOpportunities,
    opportunitiesCount: chance.natural({min: 0, max: numberOfOpportunities})
  };
}

function getCollaborators(numberOfCollaborators: number): Lists.User[] {
  return numberOfCollaborators
    ? new Array(numberOfCollaborators).fill('').map(element => getUser())
    : [] as Lists.User[];
}

function getCollaborator() {
  return {
    lastViewed: chance.string(),
    permissionLevel: ListProperties.CollaboratorType.CollaborateAndInvite,
    user: getUser()
  };
}

function getUser() {
  return {
    employeeId: chance.string(),
    firstName: chance.string(),
    lastName: chance.string(),
    email: chance.bool() ? chance.email() : null,
    id: chance.bool() ? chance.string() : null
  };
}

function getSurvey() {
  return {
    sfid: chance.string(),
    name: chance.string()
  };
}
