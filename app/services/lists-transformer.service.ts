import { includes } from 'lodash';
import { Injectable } from '@angular/core';

import * as Lists from '../models/lists/lists.model';
import { ListPerformance } from '../models/lists/list-performance.model';
import { ListPerformanceDTO } from '../models/lists/list-performance-dto.model';
import * as ListProperties from '../enums/lists/list-properties.enum';
import { ListStoreDTO } from '../models/lists/lists-store-dto.model';
import { ListStorePerformance } from '../models/lists/list-store-performance.model';
import { ListStorePerformanceDTO } from '../models/lists/list-store-performance-dto.model';
import { ListsSummary } from '../models/lists/lists-header.model';
import { ListsSummaryDTO } from '../models/lists/lists-header-dto.model';
import { ListOpportunityDTO } from '../models/lists/lists-opportunities-dto.model';
import { ListsOpportunities } from '../models/lists/lists-opportunities.model';
import { OpportunitiesByStore } from '../models/lists/opportunities-by-store.model';
import { OpportunityImpact } from '../enums/list-opportunities/list-opportunity-impact.enum';
import { OpportunityStatus } from '../enums/list-opportunities/list-opportunity-status.enum';
import { OpportunityType } from '../enums/list-opportunities/list-opportunity-type.enum';
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
      ownerLastName: summaryDataDTO.owner.lastName
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
      targetListAuthor: this.formatAuthorText(list.owner, isOwnedList),
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
      type: ListProperties.ListType.TargetList,
      archived: false,
      collaboratorType: ListProperties.CollaboratorType.CollaborateAndInvite,
      collaboratorEmployeeIds: list.collaborators.map((user: Lists.User) => user.employeeId),
      category: ListProperties.ListCategory.Beer
    };
  }

  public formatListOpportunitiesData(listOpportunities: Array<ListOpportunityDTO>): Array<ListsOpportunities> {
    return listOpportunities.map(listOpportunity => this.formatListOpportunityData(listOpportunity));
  }

  public groupOppsByStore(allOpps: ListsOpportunities[]): OpportunitiesByStore {
    const groups: OpportunitiesByStore = {};
    allOpps.forEach((opportunity) => {
      let group = opportunity.unversionedStoreId;
      groups[group] = groups[group] ? groups[group] : [];
      groups[group].push(opportunity);
    });
    return groups;
  }

  public transformListPerformanceDTO(listPerformanceDTO: ListPerformanceDTO): ListPerformance {
    return {
      current: listPerformanceDTO.current,
      currentSimple: listPerformanceDTO.currentSimple,
      yearAgo: listPerformanceDTO.yearAgo,
      yearAgoSimple: listPerformanceDTO.yearAgoSimple,
      storePerformance: this.transformListStorePerformanceDTOS(listPerformanceDTO.storePerformance)
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

  private formatAuthorText(author: Lists.User, currentUserIsAuthor: boolean = false): string {
    return currentUserIsAuthor || !author
      ? 'current user'
      : `${author.firstName} ${author.lastName}`;
  }

  private formatListOpportunityData(listOpportunity: ListOpportunityDTO): ListsOpportunities {
    return {
      id: listOpportunity.id,
      brandCode: listOpportunity.brandCode,
      brandDescription: listOpportunity.brandDescription,
      skuDescription: listOpportunity.skuDescription,
      currentDepletions_CYTD: listOpportunity.currentDepletions_CYTD,
      yearAgoDepletions_CYTD: listOpportunity.yearAgoDepletions_CYTD,
      lastDepletionDate: listOpportunity.lastDepletionDate,
      unversionedStoreId: listOpportunity.storeSourceCode,
      type: OpportunityType[listOpportunity.type],
      status: OpportunityStatus[listOpportunity.status],
      impact: OpportunityImpact[listOpportunity.impact],
      isSimpleDistribution: listOpportunity.isSimpleDistributionOpportunity
    };
  }

  private transformListStorePerformanceDTOS(listStorePerformanceDTOS: ListStorePerformanceDTO[]): ListStorePerformance[] {
    return listStorePerformanceDTOS.map((listStorePerformanceDTO: ListStorePerformanceDTO) => {
      return {
        unversionedStoreId: listStorePerformanceDTO.storeSourceCode,
        current: listStorePerformanceDTO.current,
        currentSimple: listStorePerformanceDTO.currentSimple,
        yearAgo: listStorePerformanceDTO.yearAgo,
        yearAgoSimple: listStorePerformanceDTO.yearAgoSimple,
        lastSoldDate: listStorePerformanceDTO.lastSoldDate
      };
    });
  }
}
