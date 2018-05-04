import * as Lists from './lists.model';
import * as ListProperties from '../../enums/lists/list-properties.enum';
import { getListOpportunityMock } from '../../models/lists/lists-opportunities.model.mock';

import * as Chance from 'chance';
import { generateRandomSizedArray } from '../util.model';

const chance = new Chance();

function getBaseListMock(): Lists.BaseList {
  return {
    archived: chance.bool(),
    collaborators: getCollaborators(chance.natural({min: 1, max: 5})),
    createdOn: chance.string(),
    deleted: chance.bool(),
    description: chance.string(),
    id: chance.string(),
    name: chance.string(),
    numberOfAccounts: chance.natural({min: 0, max: 1000}),
    numberOfClosedOpportunities: chance.natural({min: 0, max: 1000}),
    owner: getUser(),
    survey: getSurvey(),
    totalOpportunities: chance.natural({min: 0, max: 1000}),
    type: ListProperties.ListType.TargetList,
    updatedOn: chance.string()
  };
}

export function getV3ListMock(): Lists.V3List {
  return Object.assign(
    getBaseListMock(),
    {
      category: ListProperties.ListCategory.Beer,
      collaboratorType: ListProperties.CollaboratorType.CollaborateAndInvite
    }
  );
}

export function getV2ListMock(): Lists.V2List {
  return Object.assign(
    getBaseListMock(),
    {
      collaboratorPermissionLevel: ListProperties.CollaboratorType.CollaborateAndInvite,
      opportunitiesSummary: getOpportunitiesSummary(),
      dateOpportunitiesUpdated: chance.bool() ? chance.string() : null,
      targetListAuthor: chance.bool() ? chance.string() : null
    }
  );
}

export function getUnformattedNewList(): Lists.UnformattedNewList {
  return {
    description: chance.string(),
    name: chance.string(),
    opportunities: [] as any[],
    collaborators: getUsers(chance.natural({min: 1, max: 5}))
  };
}

export function getFormattedNewList(): Lists.FormattedNewList {
  return {
    category: ListProperties.ListCategory.Beer,
    collaboratorType: ListProperties.CollaboratorType.CollaborateAndInvite,
    name: chance.string(),
    type: ListProperties.ListType.TargetList
  };
}

function getOpportunitiesSummary(): Lists.OpportunitiesSummary {
  const numberOfOpportunities = chance.natural({min: 0, max: 1000});
  return {
    closedOpportunitiesCount: numberOfOpportunities,
    opportunitiesCount: chance.natural({min: 0, max: numberOfOpportunities})
  };
}

function getUsers(numberOfUsers: number): Lists.User[] {
  return numberOfUsers
    ? new Array(numberOfUsers).fill('').map(element => getUser())
    : [] as Lists.User[];
}

function getCollaborators(numberOfCollaborators: number): Lists.Collaborator[] {
  return new Array(numberOfCollaborators).fill('').map(() => {
    return {
      lastViewed: chance.string(),
      permissionLevel: ListProperties.CollaboratorType.CollaborateAndInvite,
      user: getUser()
    };
  });
}

function getUser(): Lists.User {
  return {
    employeeId: chance.string(),
    firstName: chance.string(),
    lastName: chance.string(),
    email: chance.bool() ? chance.email() : null,
    id: chance.bool() ? chance.string() : null
  };
}

function getSurvey(): Lists.SurveyInfo {
  return {
    sfid: chance.string(),
    name: chance.string()
  };
}

export function getV2ListSummaryMock(): Lists.V2ListSummary {
  return {
    owned: generateRandomSizedArray(1, 500).map(() => getV2ListMock()),
    sharedWithMe: generateRandomSizedArray(1, 500).map(() => getV2ListMock()),
    sharedArchived: chance.natural(),
    sharedNotArchived: chance.natural(),
    ownedArchived: chance.natural(),
    ownedNotArchived: chance.natural()
  };
}

export function getListsCollectionSummaryMock(): Lists.ListsCollectionSummary {
  return {
    archived: generateRandomSizedArray(1, 500).map(() => getV2ListMock()),
    owned: generateRandomSizedArray(1, 500).map(() => getV2ListMock()),
    ownedNotArchivedTargetLists: generateRandomSizedArray(1, 500).map(() => getV2ListMock()),
    sharedWithMe: generateRandomSizedArray(1, 500).map(() => getV2ListMock()),
    sharedArchivedCount: chance.natural(),
    sharedNotArchivedCount: chance.natural(),
    ownedArchived: chance.natural(),
    ownedNotArchived: chance.natural()
  };
}
