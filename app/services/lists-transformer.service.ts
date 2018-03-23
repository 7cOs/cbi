import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { CalculatorService } from './calculator.service';
import { ListStoreDTO } from '../models/lists-store-dto.model';
import { Stores, StoresHeader } from '../models/lists.model';
import { StoreHeaderInfoDTO } from '../models/lists-store-header-dto.model';

@Injectable()
export class ListsTransformerService {
  constructor(private calculatorService: CalculatorService) { }

  public formatStoresData(valuesDTO: ListStoreDTO[]): Stores {
    return {
    };
  }

  public formatListHeaderData(valuesDTO: StoreHeaderInfoDTO[]): StoresHeader {
    return {
    };
  }
}
