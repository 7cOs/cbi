import { Injectable } from '@angular/core';

import { ListPerformance } from '../models/lists/list-performance.model';
import { ListPerformanceDTO } from '../models/lists/list-performance-dto.model';
import { ListStoreDTO } from '../models/lists/lists-store-dto.model';
import { ListStorePerformance } from '../models/lists/list-store-performance.model';
import { ListStorePerformanceDTO } from '../models/lists/list-store-performance-dto.model';
import { ListsSummary } from '../models/lists/lists-header.model';
import { ListsSummaryDTO } from '../models/lists/lists-header-dto.model';
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
