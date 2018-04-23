import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { CalculatorService } from '../calculator.service';
import { ListPerformance } from '../../models/lists/list-performance.model';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { ListStorePerformance } from '../../models/lists/list-store-performance.model';
import { ListsOpportunities } from '../../models/lists/lists-opportunities.model';
import { OpportunitiesByStore } from '../../models/lists/lists-opportunities-by-store.model';
import { StoreDetails } from '../../models/lists/lists-store.model';

export const PERFORMANCE_TOTAL_ROW_NAME: string = 'Total';

@Injectable()
export class ListsTableTransformerService {

  constructor(
    private calculatorService: CalculatorService
  ) { }

  public transformPerformanceCollection(
    stores: StoreDetails[],
    volumePerformance: ListStorePerformance[],
    podPerformance: ListStorePerformance[]
  ): ListPerformanceTableRow[] {
    return stores.map((store: StoreDetails) => {
      const storeVolume: ListStorePerformance = this.getStorePerformance(store.unversionedStoreId, volumePerformance);
      const storePOD: ListStorePerformance = this.getStorePerformance(store.unversionedStoreId, podPerformance);
      const isPerformanceError: boolean = !storeVolume || !storePOD;

      return {
        storeColumn: store.name,
        storeAddressSubline: this.getFullStoreAddress(store),
        distributorColumn: store.distributor,
        segmentColumn: store.segmentCode,
        cytdColumn: storeVolume ? storeVolume.current : 0,
        cytdVersusYaColumn: storeVolume ? storeVolume.yearAgo : 0,
        cytdVersusYaPercentColumn: storeVolume ? this.calculatorService.getYearAgoPercent(storeVolume.current, storeVolume.yearAgo) : 0,
        l90Column: storePOD ? storePOD.current : 0,
        l90VersusYaColumn: storePOD ? storePOD.yearAgo : 0,
        l90VersusYaPercentColumn: storePOD ? this.calculatorService.getYearAgoPercent(storePOD.current, storePOD.yearAgo) : 0,
        lastDepletionDateColumn: storeVolume ? moment(storeVolume.lastSoldDate).format('MM/DD/YY') : '-',
        performanceError: isPerformanceError,
        checked: false
      };
    });
  }

  public transformPerformanceTotal(
    volumePerfomance: ListPerformance,
    podPerformance: ListPerformance
  ): ListPerformanceTableRow {
    return {
      storeColumn: PERFORMANCE_TOTAL_ROW_NAME,
      storeAddressSubline: '',
      distributorColumn: '',
      segmentColumn: '',
      cytdColumn: volumePerfomance.current,
      cytdVersusYaColumn: volumePerfomance.yearAgo,
      cytdVersusYaPercentColumn: this.calculatorService.getYearAgoPercent(volumePerfomance.current, volumePerfomance.yearAgo),
      l90Column: podPerformance.current,
      l90VersusYaColumn: podPerformance.yearAgo,
      l90VersusYaPercentColumn: this.calculatorService.getYearAgoPercent(podPerformance.current, podPerformance.yearAgo),
      lastDepletionDateColumn: '',
      performanceError: false,
      checked: false
    };
  }

  public groupOppsByStore(allOpps: ListsOpportunities[]): Array<OpportunitiesByStore> {
    const groups = {};
    allOpps.forEach((opportunity) => {
      let group = opportunity.storeSourceCode;
      groups[group] = groups[group] ? groups[group] : { storeSourceCode: group, oppsForStore: [] };
      groups[group].oppsForStore.push(opportunity);
    });
    return Object.keys(groups).map((key) => { return groups[key]; });
  }

  private getFullStoreAddress(store: StoreDetails): string {
    return `${ store.address } ${ store.city } ${ store.state } ${ store.postalCode }`;
  }

  private getStorePerformance(unversionedStoreId: string, storePerformance: ListStorePerformance[]): ListStorePerformance {
    return storePerformance.find((performance: ListStorePerformance) => performance.unversionedStoreId === unversionedStoreId);
  }
}
