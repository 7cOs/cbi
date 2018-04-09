import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { ListStoreDTO } from '../models/lists-store-dto.model';
import { ListsSummary } from '../models/lists-header.model';
import { ListsSummaryDTO } from '../models/lists-header-dto.model';
import { StoreDetails } from '../models/lists-store.model';

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
