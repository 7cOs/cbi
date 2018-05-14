import { BaseList } from './base-list.model';
import { Collaborator } from './collaborator.model';
import { CollaboratorType } from '../../enums/lists/collaborator-type.enum';
import { FormattedNewList } from './formatted-new-list.model';
import { generateRandomSizedArray } from '../util.model';
import { ListCategory } from '../../enums/lists/list-category.enum';
import { ListsCollectionSummary } from './lists-collection-summary.model';
import { ListType } from '../../enums/lists/list-type.enum';
import { OpportunitiesSummary } from './opportunities-summary.model';
import { SurveyInfo } from './survey-info.model';
import { UnformattedNewList } from './unformatted-new-list.model';
import { User } from './user.model';
import { V2List } from './v2-list.model';
import { V3List } from './v3-list.model';

import * as Chance from 'chance';
const chance = new Chance();

function getBaseListMock(): BaseList {
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
    type: ListType.TargetList,
    updatedOn: chance.string()
  };
}

export function getV3ListMock(): V3List {
  return Object.assign(
    getBaseListMock(),
    {
      category: ListCategory.Beer,
      collaboratorType: CollaboratorType.CollaborateAndInvite
    }
  );
}

export function getV2ListMock(): V2List {
  return Object.assign(
    getBaseListMock(),
    {
      collaboratorPermissionLevel: CollaboratorType.CollaborateAndInvite,
      opportunitiesSummary: getOpportunitiesSummary(),
      dateOpportunitiesUpdated: chance.bool() ? chance.string() : null,
      targetListAuthor: chance.bool() ? chance.string() : null
    }
  );
}

export function getUnformattedNewList(): UnformattedNewList {
  return {
    description: chance.string(),
    name: chance.string(),
    opportunities: [] as any[],
    collaborators: getUsers(chance.natural({min: 1, max: 5}))
  };
}

export function getFormattedNewList(): FormattedNewList {
  return {
    category: ListCategory.Beer,
    collaboratorType: CollaboratorType.CollaborateAndInvite,
    name: chance.string(),
    type: ListType.TargetList
  };
}

function getOpportunitiesSummary(): OpportunitiesSummary {
  const numberOfOpportunities = chance.natural({min: 0, max: 1000});
  return {
    closedOpportunitiesCount: numberOfOpportunities,
    opportunitiesCount: chance.natural({min: 0, max: numberOfOpportunities})
  };
}

function getUsers(numberOfUsers: number): User[] {
  return numberOfUsers
    ? new Array(numberOfUsers).fill('').map(element => getUser())
    : [] as User[];
}

function getCollaborators(numberOfCollaborators: number): Collaborator[] {
  return new Array(numberOfCollaborators).fill('').map(() => {
    return {
      lastViewed: chance.string(),
      permissionLevel: CollaboratorType.CollaborateAndInvite,
      user: getUser()
    };
  });
}

function getUser(): User {
  return {
    employeeId: chance.string(),
    firstName: chance.string(),
    lastName: chance.string(),
    email: chance.bool() ? chance.email() : null,
    id: chance.bool() ? chance.string() : null
  };
}

function getSurvey(): SurveyInfo {
  return {
    sfid: chance.string(),
    name: chance.string()
  };
}

export function getListsCollectionSummaryMock(): ListsCollectionSummary {
  return {
    archived: generateRandomSizedArray(1, 5).map(() => getV2ListMock()),
    owned: generateRandomSizedArray(1, 5).map(() => getV2ListMock()),
    ownedNotArchivedTargetLists: generateRandomSizedArray(1, 5).map(() => getV2ListMock()),
    sharedWithMe: generateRandomSizedArray(1, 5).map(() => getV2ListMock()),
    sharedArchivedCount: chance.natural(),
    sharedNotArchivedCount: chance.natural(),
    ownedArchived: chance.natural(),
    ownedNotArchived: chance.natural()
  };
}
