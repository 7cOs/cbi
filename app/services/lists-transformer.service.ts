import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { ListStoreDTO } from '../models/lists-store-dto.model';
import { StoreDetailsRow, ListHeaderDetails } from '../models/lists.model';
import { ListHeaderInfoDTO } from '../models/lists-header-dto.model';

@Injectable()
export class ListsTransformerService {

  constructor() { }

  public formatStoresData(listStoresDTOs: Array<ListStoreDTO>): Array<StoreDetailsRow> {
    return listStoresDTOs.map(store => this.formatStoreData(store));
  }

  public formatListHeaderData(headerDataDTO: ListHeaderInfoDTO): ListHeaderDetails {
    return {
      description: headerDataDTO.description,
      archived: headerDataDTO.archived,
      closedOpportunities: headerDataDTO.numberOfClosedOpportunities,
      totalOpportunities: headerDataDTO.totalOpportunities,
      id: headerDataDTO.id,
      name: headerDataDTO.name,
      numberOfAccounts: headerDataDTO.numberOfAccounts,
      ownerFirstName: headerDataDTO.owner.firstName,
      ownerLastName: headerDataDTO.owner.lastName
    };
  }

  private formatStoreData(store: ListStoreDTO): StoreDetailsRow {
    const storeData: StoreDetailsRow = {
      address: store.address,
      city: store.city,
      name: store.name,
      sevenDigitId: store.storeSourceCode,
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
