import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { CalculatorService } from './calculator.service';
import { ListStoreDTO } from '../models/lists-store-dto.model';
import { StoreDetailsRow, StoreHeaderDetails } from '../models/lists.model';
import { StoreHeaderInfoDTO } from '../models/lists-store-header-dto.model';

@Injectable()
export class ListsTransformerService {
  constructor() { }

  public formatStoresData(listStoresDTOs: Array<ListStoreDTO>): Array<StoreDetailsRow> {
    return listStoresDTOs.map(store => this.formatStoreData(store));
  }

  public formatListHeaderData(headerDataDTO: StoreHeaderInfoDTO): StoreHeaderDetails {
    return {
      description: headerDataDTO.description,
      id: headerDataDTO.id,
      name: headerDataDTO.name
    };
  }

  private formatStoreData(store: ListStoreDTO): StoreDetailsRow {
    const storeData: StoreDetailsRow = {
      address: store.address,
      city: store.city
    };
    return storeData;
  }
}
