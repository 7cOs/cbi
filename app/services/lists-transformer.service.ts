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

interface V2ListCollection {
  owned: V2List[];
  ownedArchived: number;
  ownedNotArchived: number;
  sharedArchived: number;
  sharedNotArchived: number;
  sharedWithMe: V2List[];
}

@Injectable()
export class ListsTransformerService {

  constructor() { }

  public transformLists(v3Lists: V3List[], currentUserEmployeeID: string): V2ListCollection[] {
    let owned = v3Lists.filter((list: V3List) => {
      return list.owner.employeeId === currentUserEmployeeID;
    });

    let sharedWithMe = v3Lists.filter((list: V3List) => {
      return list.owner.employeeId !== currentUserEmployeeID;
    });

    let newOwnedCollection: V2List[] = owned.map((list: V3List) => {
      return {
        archived: list.archived,
        collaborators: list.collaborators,
        collaboratorPermissionLevel: list.collaboratorType,
        createdOn: list.createdOn,
        description: list.description,
        id: list.id,
        name: list.name,
        numberOfAccounts: list.numberOfAccounts,
        numberOfClosedOpportunities: list.numberOfClosedOpportunities,
        owner: list.owner,
        survey: list.survey,
        totalOpportunities: list.totalOpportunities,
        type: list.type,
        updatedOn: list.updatedOn
      };
    });

    let newSharedWithMeCollection: V2List[] = sharedWithMe.map((list: V3List) => {
      return {
        archived: list.archived,
        collaborators: list.collaborators,
        collaboratorPermissionLevel: list.collaboratorType,
        createdOn: list.createdOn,
        description: list.description,
        id: list.id,
        name: list.name,
        numberOfAccounts: list.numberOfAccounts,
        numberOfClosedOpportunities: list.numberOfClosedOpportunities,
        owner: list.owner,
        survey: list.survey,
        totalOpportunities: list.totalOpportunities,
        type: list.type,
        updatedOn: list.updatedOn
      };
    });

    let newOwned: V2ListCollection = {
      owned: newOwnedCollection,
      sharedWithMe: [] as V2List[],
      ownedArchived: 0,
      ownedNotArchived: newOwnedCollection.filter((list: V2List) => !list.archived).length,
      sharedArchived: 0,
      sharedNotArchived: newSharedWithMeCollection.filter((list: V2List) => !list.archived).length
    };

    let newShared: V2ListCollection = {
      owned: [] as V2List[],
      sharedWithMe: newSharedWithMeCollection,
      ownedArchived: newOwnedCollection.filter((list: V2List) => list.archived).length,
      ownedNotArchived: 0,
      sharedArchived: newSharedWithMeCollection.filter((list: V2List) => list.archived).length,
      sharedNotArchived: 0
    };

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
