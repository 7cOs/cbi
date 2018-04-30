import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { CalculatorService } from '../calculator.service';
import { ListPerformance } from '../../models/lists/list-performance.model';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { ListStorePerformance } from '../../models/lists/list-store-performance.model';
import { OpportunitiesByStore } from '../../models/lists/opportunities-by-store.model';
import { StoreDetails } from '../../models/lists/lists-store.model';

import { ListsOpportunities } from '../../models/lists/lists-opportunities.model';
import { ListOpportunitiesTableRow } from '../../models/list-opportunities/list-opportunities-table-row.model';

export const PERFORMANCE_TOTAL_ROW_NAME: string = 'Total';

@Injectable()
export class ListsTableTransformerService {

  constructor(
    private calculatorService: CalculatorService
  ) { }

  public transformOpportunitiesCollection(
    stores: StoreDetails[],
    volumePerformance: ListStorePerformance[],
    opportunities: OpportunitiesByStore
  ): ListOpportunitiesTableRow[] {
    return stores.reduce((opportunityRows: ListOpportunitiesTableRow[], store: StoreDetails) => {
      if (!opportunities[store.unversionedStoreId]) return opportunityRows;

      const storeVolume: ListStorePerformance = this.getStorePerformance(store.unversionedStoreId, volumePerformance);
      const storeOpportunities: ListsOpportunities[] = opportunities[store.unversionedStoreId];
      const isPerformanceError: boolean = !volumePerformance || !opportunities;

      opportunityRows.push({
        storeColumn: store.name,
        storeAddressSubline: this.getFullStoreAddress(store),
        distributorColumn: store.distributor,
        segmentColumn: store.segmentCode,
        cytdColumn: storeVolume ? storeVolume.current : 0,
        cytdVersusYaPercentColumn: storeVolume ? this.calculatorService.getYearAgoPercent(storeVolume.current, storeVolume.yearAgo) : 0,
        opportunitiesColumn: storeOpportunities.length,
        performanceError: isPerformanceError,
        checked: false,
        expanded: false
      });

      return opportunityRows;
    }, []);

    // return stores.map((store: StoreDetails) => {
    //   if (!opportunities[store.unversionedStoreId]) return;

    //   const storeVolume: ListStorePerformance = this.getStorePerformance(store.unversionedStoreId, volumePerformance);
    //   const storeOpportunities: ListsOpportunities[] = opportunities[store.unversionedStoreId];
    //   const isPerformanceError: boolean = !volumePerformance || !opportunities;

    //   return {
    //     storeColumn: store.name,
    //     storeAddressSubline: this.getFullStoreAddress(store),
    //     distributorColumn: store.distributor,
    //     segmentColumn: store.segmentCode,
    //     cytdColumn: storeVolume ? storeVolume.current : 0,
    //     cytdVersusYaPercentColumn: storeVolume ? this.calculatorService.getYearAgoPercent(storeVolume.current, storeVolume.yearAgo) : 0,
    //     opportunitiesColumn: storeOpportunities.length,
    //     performanceError: isPerformanceError,
    //     checked: false,
    //     expanded: false
    //   };
    // });
  }

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

  private getFullStoreAddress(store: StoreDetails): string {
    return `${ store.address } ${ store.city } ${ store.state } ${ store.postalCode }`;
  }

  private getStorePerformance(unversionedStoreId: string, storePerformance: ListStorePerformance[]): ListStorePerformance {
    return storePerformance.find((performance: ListStorePerformance) => performance.unversionedStoreId === unversionedStoreId);
  }
}
