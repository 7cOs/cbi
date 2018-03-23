import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { CalculatorService } from './calculator.service';
import { ListStoreDTO } from '../models/lists-store-dto.model';
import { Stores, StoresHeader } from '../models/lists.model';
import { StoreHeaderInfoDTO } from '../models/lists-store-header-dto.model';

@Injectable()
export class ListsTransformerService {
  constructor(private calculatorService: CalculatorService) { }

  private formatStoresData(valuesDTO: ListStoreDTO): Stores {
    return {
      brandDescription: valuesDTO.brandDescription,
      collectionMethod: valuesDTO.values[0].collectionMethod,
      current: Math.round(valuesDTO.values[0].current),
      yearAgo: this.calculatorService.getYearAgoDelta(valuesDTO.values[0].current, valuesDTO.values[0].yearAgo),
      yearAgoPercent: this.calculatorService.getYearAgoPercent(valuesDTO.values[0].current, valuesDTO.values[0].yearAgo),
      brandCode: valuesDTO.brandCode,
    };
  }

  private formatListHeaderData(valuesDTO: StoreHeaderInfoDTO): StoresHeader {
    return {
      brandDescription: valuesDTO.brandDescription,
      collectionMethod: valuesDTO.values[0].collectionMethod,
      current: Math.round(valuesDTO.values[0].current),
      yearAgo: this.calculatorService.getYearAgoDelta(valuesDTO.values[0].current, valuesDTO.values[0].yearAgo),
      yearAgoPercent: this.calculatorService.getYearAgoPercent(valuesDTO.values[0].current, valuesDTO.values[0].yearAgo),
      brandCode: valuesDTO.brandCode,
    };
  }
}
