import { includes } from 'lodash';
import { Injectable } from '@angular/core';

import { CollaboratorType } from '../enums/lists/collaborator-type.enum';
import { FormattedNewList } from '../models/lists/formatted-new-list.model';
import { GroupedLists } from '../models/lists/grouped-lists.model';
import { ListCategory } from '../enums/lists/list-category.enum';
import { ListPerformance } from '../models/lists/list-performance.model';
import { ListPerformanceDTO } from '../models/lists/list-performance-dto.model';
import { ListStoreDTO } from '../models/lists/lists-store-dto.model';
import { ListType } from '../enums/lists/list-type.enum';
import { ListsCollectionSummary } from '../models/lists/lists-collection-summary.model';
import { ListsSummary } from '../models/lists/lists-header.model';
import { ListsSummaryDTO } from '../models/lists/lists-header-dto.model';
import { ListOpportunityDTO } from '../models/lists/lists-opportunities-dto.model';
import { ListsOpportunities } from '../models/lists/lists-opportunities.model';
import { ListStorePerformance } from '../models/lists/list-store-performance.model';
import { ListStorePerformanceDTO } from '../models/lists/list-store-performance-dto.model';
import { OpportunitiesByStore } from '../models/lists/opportunities-by-store.model';
import { OpportunityImpact } from '../enums/list-opportunities/list-opportunity-impact.enum';
import { OpportunityStatus } from '../enums/list-opportunities/list-opportunity-status.enum';
import { OpportunityType } from '../enums/list-opportunities/list-opportunity-type.enum';
import { StoreDetails } from '../models/lists/lists-store.model';
import { V3List } from '../models/lists/v3-list.model';
import { V2List } from '../models/lists/v2-list.model';
import { UnformattedNewList } from '../models/lists/unformatted-new-list.model';
import { User } from '../models/lists/user.model';

@Injectable()
export class ListsTransformerService {

  public getV2ListsSummary(v3Lists: V3List[], currentUserEmployeeID: string): ListsCollectionSummary {
    const ownedLists: V3List[] = v3Lists.filter((list: V3List) => list.owner.employeeId === currentUserEmployeeID);
    const archivedLists: V3List[] = v3Lists.filter((list: V3List) => list.archived);
    const sharedWithMeLists: V3List[] = v3Lists.filter((list: V3List) => list.owner.employeeId !== currentUserEmployeeID);
    const ownedNotArchivedLists: V3List[] = ownedLists.filter((ownedList: V3List) => !includes(archivedLists, ownedList));

    const ownedArchivedListsCount: number = ownedLists.filter((ownedList: V3List) => !includes(archivedLists, ownedList)).length;
    const ownedNotArchivedListsCount: number = ownedNotArchivedLists.length;
    const sharedArchivedListsCount: number =
      sharedWithMeLists.filter((sharedList: V3List) => includes(archivedLists, sharedList)).length;
    const sharedNotArchivedListsCount: number =
      sharedWithMeLists.filter((sharedList: V3List) => !includes(archivedLists, sharedList)).length;

    const ownedV2Lists: V2List[] = ownedLists.map((list: V3List) => this.transformV3ToV2(list, true));
    const archivedV2Lists: V2List[] = archivedLists.map((list: V3List) => this.transformV3ToV2(list));
    const sharedWithMeV2Lists: V2List[] = sharedWithMeLists.map((list: V3List) => this.transformV3ToV2(list));
    const ownedNotArchivedV2Lists: V2List[] = ownedNotArchivedLists.map((list: V3List) => this.transformV3ToV2(list, true));
    const ownedAndSharedWithMeV2Lists: V2List[] = ownedV2Lists.concat(sharedWithMeV2Lists);

    return {
      owned: ownedV2Lists,
      archived: archivedV2Lists,
      ownedNotArchivedTargetLists: ownedNotArchivedV2Lists,
      sharedWithMe: sharedWithMeV2Lists,
      ownedAndSharedWithMe: ownedAndSharedWithMeV2Lists,
      sharedArchivedCount: sharedArchivedListsCount,
      sharedNotArchivedCount: sharedNotArchivedListsCount,
      ownedNotArchived: ownedNotArchivedListsCount,
      ownedArchived: ownedArchivedListsCount
    };
  }

  public groupLists(lists: V3List[], currentUserEmployeeID: string): GroupedLists {
    const owned: V3List[] = lists.filter((list: V3List) => {
      return list.owner.employeeId === currentUserEmployeeID
        && !list.archived;
    });

    const sharedWithMe: V3List[] = lists.filter((list: V3List) => {
      return list.owner.employeeId !== currentUserEmployeeID
        && !list.archived;
    });

    const archived: V3List[] = lists.filter((list: V3List) => {
      return list.archived;
    });

    return {
      owned: owned,
      sharedWithMe: sharedWithMe,
      archived: archived
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

  public convertCollaborators(list: ListsSummary): FormattedNewList {
    return {
      description: list.description,
      name: list.name,
      type: ListType.TargetList,
      archived: list.archived,
      collaboratorType: CollaboratorType.CollaborateAndInvite,
      collaboratorEmployeeIds: list.collaborators.map((user: User) => user.employeeId),
      category: ListCategory.Beer
    };
  }

  public getLeaveListPayload(employeeId: string, listSummary: ListsSummary): FormattedNewList {
    const convertedPayload: FormattedNewList = Object.assign({}, this.convertCollaborators(listSummary), {
      ownerEmployeeId: listSummary.ownerId
    });

    convertedPayload.collaboratorEmployeeIds = convertedPayload.collaboratorEmployeeIds.filter((collaboratorId: string) => {
      return collaboratorId !== employeeId;
    });

    return convertedPayload;
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

  public formatNewList(list: UnformattedNewList): FormattedNewList {
    return {
      description: list.description,
      name: list.name,
      type: ListType.TargetList,
      archived: false,
      collaboratorType: CollaboratorType.CollaborateAndInvite,
      collaboratorEmployeeIds: list.collaborators.map((user: User) => user.employeeId),
      category: ListCategory.Beer
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

  private formatAuthorText(author: User, currentUserIsAuthor: boolean = false): string {
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
      type: OpportunityType[listOpportunity.type] || listOpportunity.type,
      status: OpportunityStatus[listOpportunity.status] || listOpportunity.status,
      impact: OpportunityImpact[listOpportunity.impact] || listOpportunity.impact,
      isSimpleDistribution: listOpportunity.isSimpleDistributionOpportunity,
      rationale: listOpportunity.rationale
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
