import { includes } from 'lodash';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as Lists from '../models/lists/lists.model';
import { ListStoreDTO } from '../models/lists/lists-store-dto.model';
import { ListsSummary } from '../models/lists/lists-header.model';
import { ListsSummaryDTO } from '../models/lists/lists-header-dto.model';
import { StoreDetails } from '../models/lists/lists-store.model';

@Injectable()
export class ListsTransformerService {

  constructor() { }

  public getV2ListsSummary(v3Lists: Lists.V3List[], currentUserEmployeeID: string): Lists.ListsCollectionSummary {
    const ownedLists: Lists.V3List[] = v3Lists.filter((list: Lists.V3List) => list.owner.employeeId === currentUserEmployeeID);
    const archivedLists: Lists.V3List[] = v3Lists.filter((list: Lists.V3List) => list.archived);
    const sharedWithMeLists: Lists.V3List[] = v3Lists.filter((list: Lists.V3List) => list.owner.employeeId !== currentUserEmployeeID);
    const ownedNotArchivedLists: Lists.V3List[] = ownedLists.filter((ownedList: Lists.V3List) => !includes(archivedLists, ownedList));

    const ownedArchivedListsCount: number = ownedLists.filter((ownedList: Lists.V3List) => !includes(archivedLists, ownedList)).length;
    const ownedNotArchivedListsCount: number = ownedNotArchivedLists.length;
    const sharedArchivedListsCount: number =
      sharedWithMeLists.filter((sharedList: Lists.V3List) => includes(archivedLists, sharedList)).length;
    const sharedNotArchivedListsCount: number =
      sharedWithMeLists.filter((sharedList: Lists.V3List) => !includes(archivedLists, sharedList)).length;

    const ownedV2Lists: Lists.V2List[] = ownedLists.map((list: Lists.V3List) => this.transformV3ToV2(list, true));
    const archivedV2Lists: Lists.V2List[] = archivedLists.map((list: Lists.V3List) => this.transformV3ToV2(list));
    const sharedWithMeV2Lists: Lists.V2List[] = sharedWithMeLists.map((list: Lists.V3List) => this.transformV3ToV2(list));
    const ownedNotArchivedV2Lists: Lists.V2List[] = ownedNotArchivedLists.map((list: Lists.V3List) => this.transformV3ToV2(list, true));

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

  public getV2ListSummary(
    ownedListCollection: Lists.V2List[],
    sharedListCollection: Lists.V2List[],
    archived: boolean = false
  ): Lists.V2ListSummary {
    return {
      owned: ownedListCollection,
      sharedWithMe: sharedListCollection,
      ownedNotArchived: ownedListCollection.filter((list: Lists.V2List) => archived ? list.archived : !list.archived ).length,
      ownedArchived: ownedListCollection.filter((list: Lists.V2List) => archived ? list.archived : !list.archived ).length,
      sharedNotArchived: sharedListCollection.filter((list: Lists.V2List) => archived ? list.archived : !list.archived).length,
      sharedArchived: sharedListCollection.filter((list: Lists.V2List) => archived ? list.archived : !list.archived).length
    };
  }

  public formatStoresData(listStoresDTOs: ListStoreDTO[]): StoreDetails[] {
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
      ownerLastName: summaryDataDTO.owner.lastName,
      collaborators: summaryDataDTO.collaborators,
      ownerId: summaryDataDTO.owner.employeeId,
      type: summaryDataDTO.type,
      collaboratorType: summaryDataDTO.collaboratorType,
      category: summaryDataDTO.category
    };
  }

  public convertCollaborators(list: ListsSummary): Lists.FormattedNewList {
    return {
      description: list.description,
      name: list.name,
      type: Lists.ListType.TargetList,
      archived: list.archived,
      collaboratorType: Lists.CollaboratorType.CollaborateAndInvite,
      collaboratorEmployeeIds: list.collaborators.map((user: Lists.User) => user.employeeId),
      category: Lists.ListCategory.Beer
    };
  }

  public transformV3ToV2(list: Lists.V3List, isOwnedList: boolean = false): Lists.V2List {
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

  public formatNewList(list: Lists.UnformattedNewList): Lists.FormattedNewList {
    return {
      description: list.description,
      name: list.name,
      type: Lists.ListType.TargetList,
      archived: false,
      collaboratorType: Lists.CollaboratorType.CollaborateAndInvite,
      collaboratorEmployeeIds: list.collaborators.map((user: Lists.User) => user.employeeId),
      category: Lists.ListCategory.Beer
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

  private formatAuthorText(author: Lists.Collaborator, currentUserIsAuthor: boolean = false): string {
    return currentUserIsAuthor || !author
      ? 'current user'
      : `${author.user.firstName} ${author.user.lastName}`;
  }

  private getListAuthor(collaborators: Lists.Collaborator[]): Lists.Collaborator {
    return collaborators.find((collaborator: Lists.Collaborator) => collaborator.permissionLevel === 'author');
  }
}
