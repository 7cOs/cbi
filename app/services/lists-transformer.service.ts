import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

import { ListStoreDTO } from '../models/lists-store-dto.model';
import { StoreDetailsRow, StoreHeaderDetails } from '../models/lists.model';
import { StoreHeaderInfoDTO } from '../models/lists-store-header-dto.model';

@Injectable()
export class ListsTransformerService {
  private defaultDateFormat: string;

  constructor() { }

  public formatStoresData(listStoresDTOs: Array<ListStoreDTO>): Array<StoreDetailsRow> {
    return listStoresDTOs.map(store => this.formatStoreData(store));
  }

  public formatListHeaderData(headerDataDTO: StoreHeaderInfoDTO): StoreHeaderDetails {
    return {
      description: headerDataDTO.description,
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
      number: store.number,
      postalCode: store.postalCode,
      premiseType: store.premiseType,
      state : store.state
    };
    return storeData;
  }
}
