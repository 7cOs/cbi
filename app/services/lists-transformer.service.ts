import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { ListStoreDTO } from '../models/lists/lists-store-dto.model';
import { ListsSummary } from '../models/lists/lists-header.model';
import { ListsSummaryDTO } from '../models/lists/lists-header-dto.model';
import { StoreDetails } from '../models/lists/lists-store.model';

interface BaseList {
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
  survey: any;
  totalOpportunities: number;
  type: string;
  updatedOn: string;
}

interface V3List extends BaseList {
  category: string;
  collaboratorType: string;
}

interface V2List extends BaseList {
  collaboratorPermissionLevel: string;
  opportunitiesSummary: OpportunitiesSummary;
  dateOpportunitiesUpdated?: string;
  targetListAuthor?: string;
}

interface Collaborator {
  lastViewed: string;
  permissionLevel: string;
  user: User;
}

interface User {
  employeeId: string;
  firstName: string;
  lastName: string;
  email?: string;
  id?: string;
}

interface OpportunitiesSummary {
  closedOpportunitiesCount: number;
  opportunitiesCount: number;
}

interface V2ListSummary {
  owned: V2List[];
  sharedWithMe: V2List[];

  ownedArchived: number;
  ownedNotArchived: number;
  sharedArchived: number;
  sharedNotArchived: number;
}

interface ListsCollectionSummary {
  archived: V2List[];
  owned: V2List[];
  ownedNotArchivedTargetLists: V2List[];
  sharedWithMe: V2List[];

  ownedArchived: number;
  ownedNotArchived: number;
  sharedArchivedCount: number;
  sharedNotArchivedCount: number;
}

@Injectable()
export class ListsTransformerService {

  constructor() { }

  public formatAuthorText(author: Collaborator, currentUserIsAuthor: boolean = false): string {
    return currentUserIsAuthor || !author
      ? 'current user'
      : `${author.user.firstName} ${author.user.lastName}`;
  }

  public getListAuthor(collaborators: Collaborator[]): Collaborator {
    return collaborators.find((collaborator: Collaborator) => collaborator.permissionLevel === 'author');
  }

  public transformV3ToV2(list: V3List, isOwnedList: boolean = false): V2List {
    return {
      archived: list.archived,
      collaborators: list.collaborators,
      collaboratorPermissionLevel: list.collaboratorType,
      createdOn: list.createdOn,
      dateOpportunitiesUpdated: list.updatedOn || list.createdOn,
      deleted: list.deleted || false,
      description: list.description,
      id: list.id,
      name: list.name,
      numberOfAccounts: list.numberOfAccounts,
      numberOfClosedOpportunities: list.numberOfClosedOpportunities || 0,
      owner: list.owner,
      survey: list.survey,
      targetListAuthor: this.formatAuthorText(this.getListAuthor(list.collaborators), isOwnedList),
      totalOpportunities: list.totalOpportunities || 0,
      type: list.type,
      updatedOn: list.updatedOn,
      opportunitiesSummary: {
        closedOpportunitiesCount: list.numberOfClosedOpportunities || 0,
        opportunitiesCount: list.totalOpportunities || 0
      }
    };
  }

  public getV2ListsSummary(v3Lists: V3List[], currentUserEmployeeID: string): ListsCollectionSummary {
    const ownedLists: V3List[] = v3Lists.filter((list: V3List) => list.owner.employeeId === currentUserEmployeeID);
    const archivedLists: V3List[] = v3Lists.filter((list: V3List) => list.archived);
    const sharedWithMeLists: V3List[] = v3Lists.filter((list: V3List) => list.owner.employeeId !== currentUserEmployeeID);
    const ownedNotArchivedLists: V3List[] = ownedLists.filter((ownedList: V3List) => !archivedLists.includes(ownedList));

    const ownedArchivedListsCount: number = ownedLists.filter((ownedList: V3List) => archivedLists.includes(ownedList)).length;
    const ownedNotArchivedListsCount: number = ownedNotArchivedLists.length;
    const sharedArchivedListsCount: number = sharedWithMeLists.filter((sharedList: V3List) => archivedLists.includes(sharedList)).length;
    const sharedNotArchivedListsCount: number =
      sharedWithMeLists.filter((sharedList: V3List) => !archivedLists.includes(sharedList)).length;

    const ownedV2Lists: V2List[] = ownedLists.map((list: V3List) => this.transformV3ToV2(list, true));
    const archivedV2Lists: V2List[] = archivedLists.map((list: V3List) => this.transformV3ToV2(list));
    const sharedWithMeV2Lists: V2List[] = sharedWithMeLists.map((list: V3List) => this.transformV3ToV2(list));
    const ownedNotArchivedV2Lists: V2List[] = ownedNotArchivedLists.map((list: V3List) => this.transformV3ToV2(list, true));

    return {
      owned: ownedV2Lists,
      archived: archivedV2Lists,
      ownedNotArchivedTargetLists: ownedNotArchivedV2Lists,
      sharedWithMe: sharedWithMeV2Lists,
      sharedArchivedCount: sharedArchivedListsCount,
      sharedNotArchivedCount: sharedNotArchivedListsCount,
      ownedNotArchived: ownedNotArchivedListsCount,
      ownedArchived: ownedArchivedListsCount
    };
  }

  public getV2ListSummary(ownedListCollection: V2List[], sharedListCollection: V2List[], archived: boolean = false) {
    return {
      owned: ownedListCollection,
      sharedWithMe: sharedListCollection,
      ownedNotArchived: ownedListCollection.filter((list: V2List) => archived ? list.archived : !list.archived ).length,
      ownedArchived: ownedListCollection.filter((list: V2List) => archived ? list.archived : !list.archived ).length,
      sharedNotArchived: sharedListCollection.filter((list: V2List) => archived ? list.archived : !list.archived).length,
      sharedArchived: sharedListCollection.filter((list: V2List) => archived ? list.archived : !list.archived).length
    };
  }

  public transformV3toV2Lists(v3Lists: V3List[], currentUserEmployeeID: string): V2ListSummary[] {
    let owned = v3Lists.filter((list: V3List) => list.owner.employeeId === currentUserEmployeeID);
    let sharedWithMe = v3Lists.filter((list: V3List) => list.owner.employeeId !== currentUserEmployeeID);
    let newOwnedCollection: V2List[] = owned.map((list: V3List) => this.transformV3ToV2(list));
    let newSharedWithMeCollection: V2List[] = sharedWithMe.map((list: V3List) => this.transformV3ToV2(list));

    let newOwned: V2ListSummary = this.getV2ListSummary(newOwnedCollection, newSharedWithMeCollection, false);
    let newShared: V2ListSummary = this.getV2ListSummary(newOwnedCollection, newSharedWithMeCollection, true);

    return [
      newOwned,
      newShared
    ];
  }

  public formatStoresData(listStoresDTOs: Array<ListStoreDTO>): Array<StoreDetails> {
    return listStoresDTOs.map(store => this.formatStoreData(store));
  }

  public formatListsSummaryData(summaryDataDTO: ListsSummaryDTO): ListsSummary {
    return {
      description: summaryDataDTO.description,
      archived: summaryDataDTO.archived,
      closedOpportunities: summaryDataDTO.numberOfClosedOpportunities,
      totalOpportunities: summaryDataDTO.totalOpportunities,
      id: summaryDataDTO.id,
      name: summaryDataDTO.name,
      numberOfAccounts: summaryDataDTO.numberOfAccounts,
      ownerFirstName: summaryDataDTO.owner.firstName,
      ownerLastName: summaryDataDTO.owner.lastName
    };
  }

  private formatStoreData(store: ListStoreDTO): StoreDetails {
    const storeData: StoreDetails = {
      address: store.address,
      city: store.city,
      name: store.name,
      unversionedStoreId: store.storeSourceCode,
      number: store.number,
      postalCode: store.postalCode,
      premiseType: store.premiseType,
      state : store.state,
      distributor: store.primaryBeerDistributor.name,
      segmentCode: store.segmentCode
    };
    return storeData;
  }
}
