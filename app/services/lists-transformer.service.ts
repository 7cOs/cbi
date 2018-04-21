import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { ListStoreDTO } from '../models/lists/lists-store-dto.model';
import { ListsSummary } from '../models/lists/lists-header.model';
import { ListsSummaryDTO } from '../models/lists/lists-header-dto.model';
import { StoreDetails } from '../models/lists/lists-store.model';
import { ListOpportunitiesDTO } from '../models/lists/lists-opportunities-dto.model';
import { ListsOpportunities } from '../models/lists/lists-opportunities.model';

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

  public formatListOpportunitiesData(listOpportunities: Array<ListOpportunitiesDTO>): Array<ListsOpportunities> {
    return listOpportunities.map(listOpportunity => this.formatListOpportunityData(listOpportunity));
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

  private formatListOpportunityData(listOpportunity: ListOpportunitiesDTO): ListsOpportunities {
    return {
      id: listOpportunity.id,
      brandCode: listOpportunity.brandCode,
      brandDescription: listOpportunity.brandDescription,
      skuDescription: listOpportunity.skuDescription,
      type: listOpportunity.type,
      status: listOpportunity.status,
      impact: listOpportunity.impact,
      currentDepletions_CYTD: listOpportunity.currentDepletions_CYTD,
      yearAgoDepletions_CYTD: listOpportunity.yearAgoDepletions_CYTD,
      lastDepletionDate: listOpportunity.lastDepletionDate,
      storeSourceCode: listOpportunity.storeSourceCode
    };
  }
}
