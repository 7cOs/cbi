import * as ListProperties from '../../enums/lists/list-properties.enum';

export interface BaseList {
  archived: boolean;
  collaborators: Collaborator[];
  createdOn: string;
  deleted: boolean;
  description: string;
  id: string;
  name: string;
  numberOfAccounts: number;
  numberOfClosedOpportunities: number;
  owner: User;
  survey: SurveyInfo;
  totalOpportunities: number;
  type: string;
  updatedOn: string;
}

export interface CollaboratorOwnerDetails {
  employeeId: string;
  firstName: string;
  lastName: string;
}

export interface SurveyInfo {
  sfid: string;
  name: string;
}

export interface PrimaryDistributor {
  id: string;
  name: string;
}

export interface V3List extends BaseList {
  category: ListProperties.ListCategory;
  collaboratorType: ListProperties.CollaboratorType;
}

export interface V2List extends BaseList {
  collaboratorPermissionLevel: string;
  opportunitiesSummary: OpportunitiesSummary;
  dateOpportunitiesUpdated?: string;
  targetListAuthor?: string;
}

export interface Collaborator {
  lastViewed: string;
  permissionLevel: string;
  user: User;
}

export interface UnformattedNewList {
  description: string;
  name: string;
  opportunities: any[];
  collaborators: User[];
  targetListShares?: {id: number}[];
}

export interface FormattedNewList {
  category: ListProperties.ListCategory;
  collaboratorType: ListProperties.CollaboratorType;
  name: string;
  type: ListProperties.ListType;

  description?: string;
  ownerEmployeeId?: string;
  surveySfid?: any;
  archived?: boolean;
  collaboratorEmployeeIds?: string[];
}

export interface User {
  employeeId: string;
  firstName: string;
  lastName: string;
  email?: string;
  id?: string;
}

export interface OpportunitiesSummary {
  closedOpportunitiesCount: number;
  opportunitiesCount: number;
}

export interface V2ListSummary {
  owned: V2List[];
  sharedWithMe: V2List[];

  ownedArchived: number;
  ownedNotArchived: number;
  sharedArchived: number;
  sharedNotArchived: number;
}

export interface ListsCollectionSummary {
  archived: V2List[];
  owned: V2List[];
  ownedNotArchivedTargetLists: V2List[];
  sharedWithMe: V2List[];

  ownedArchived: number;
  ownedNotArchived: number;
  sharedArchivedCount: number;
  sharedNotArchivedCount: number;
}
