import { Injectable } from '@angular/core';

import { ListPerformance } from '../models/lists/list-performance.model';
import { ListPerformanceDTO } from '../models/lists/list-performance-dto.model';
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
      impact: OpportunityImpact[listOpportunity.impact]
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
