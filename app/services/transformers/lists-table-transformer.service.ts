import { Injectable } from '@angular/core';
import * as moment from 'moment';

import { CalculatorService } from '../calculator.service';
import { ListOpportunitiesTableRow } from '../../models/list-opportunities/list-opportunities-table-row.model';
import { ListPerformance } from '../../models/lists/list-performance.model';
import { ListPerformanceTableRow } from '../../models/list-performance/list-performance-table-row.model';
import { ListsOpportunities } from '../../models/lists/lists-opportunities.model';
import { ListStorePerformance } from '../../models/lists/list-store-performance.model';
import { ListTableDrawerRow } from '../../models/lists/list-table-drawer-row.model';
import { OpportunitiesByStore } from '../../models/lists/opportunities-by-store.model';
import { OpportunityStatus } from '../../enums/list-opportunities/list-opportunity-status.enum';
import { OpportunityTypeLabel } from '../../enums/list-opportunities/list-opportunity-type-label.enum';
import { StoreDetails } from '../../models/lists/lists-store.model';
import { BeerDistributors } from '../../models/lists/beer-distributors.model';

export const PERFORMANCE_TOTAL_ROW_NAME: string = 'Total';
export const SIMPLE_OPPORTUNITY_SKU_PACKAGE_LABEL: string = 'ANY';

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
      const primaryDistributorIndex = this.getPrimaryDistributorIndex(store.beerDistributors);

      opportunityRows.push({
        storeColumn: store.name,
        storeAddressSubline: this.getFullStoreAddress(store),
        distributorColumn: store.distributor,
        segmentColumn: store.segmentCode,
        cytdColumn: storeVolume ? storeVolume.current : 0,
        cytdVersusYaPercentColumn: storeVolume ? this.calculatorService.getYearAgoPercent(storeVolume.current, storeVolume.yearAgo) : 0,
        opportunitiesColumn: storeOpportunities.length,
        opportunities: this.transformStoreOpportunities(storeOpportunities),
        performanceError: !storeVolume,
        checked: false,
        expanded: false,
        storeNumber: store.number,
        storeCity: store.city,
        storeState: store.state,
        unversionedStoreId: store.unversionedStoreId,
        distributorCustomerCode: store.beerDistributors[primaryDistributorIndex].distributorCustomerCode,
        distributorSalesperson: store.beerDistributors[primaryDistributorIndex].salespersonName,
      });

      return opportunityRows;
    }, []);
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
      const primaryDistributorIndex = this.getPrimaryDistributorIndex(store.beerDistributors);

      return {
        storeColumn: store.name,
        storeAddressSubline: this.getFullStoreAddress(store),
        distributorColumn: store.distributor,
        segmentColumn: store.segmentCode,
        cytdColumn: storeVolume ? storeVolume.current : 0,
        cytdVersusYaColumn: storeVolume ? this.calculatorService.getYearAgoDelta(storeVolume.current, storeVolume.yearAgo) : 0,
        cytdVersusYaPercentColumn: storeVolume ? this.calculatorService.getYearAgoPercent(storeVolume.current, storeVolume.yearAgo) : 0,
        l90Column: storePOD ? storePOD.current : 0,
        l90VersusYaColumn: storePOD ? this.calculatorService.getYearAgoDelta(storePOD.current, storePOD.yearAgo) : 0,
        l90VersusYaPercentColumn: storePOD ? this.calculatorService.getYearAgoPercent(storePOD.current, storePOD.yearAgo) : 0,
        lastDepletionDateColumn: storeVolume ? moment(storeVolume.lastSoldDate).format('MM/DD/YY') : '-',
        performanceError: isPerformanceError,
        checked: false,
        storeNumber: store.number,
        storeCity: store.city,
        storeState: store.state,
        unversionedStoreId: store.unversionedStoreId,
        distributorCustomerCode: store.beerDistributors[primaryDistributorIndex].distributorCustomerCode,
        distributorSalesperson: store.beerDistributors[primaryDistributorIndex].salespersonName,
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
      cytdVersusYaColumn: this.calculatorService.getYearAgoDelta(volumePerfomance.current, volumePerfomance.yearAgo),
      cytdVersusYaPercentColumn: this.calculatorService.getYearAgoPercent(volumePerfomance.current, volumePerfomance.yearAgo),
      l90Column: podPerformance.current,
      l90VersusYaColumn: this.calculatorService.getYearAgoDelta(podPerformance.current, podPerformance.yearAgo),
      l90VersusYaPercentColumn: this.calculatorService.getYearAgoPercent(podPerformance.current, podPerformance.yearAgo),
      lastDepletionDateColumn: '',
      performanceError: false,
      checked: false,
      storeNumber: '',
      storeCity: '',
      storeState: '',
      unversionedStoreId: '',
      distributorCustomerCode: '',
      distributorSalesperson: ''
    };
  }

  public transformStoreOpportunities(opportunities: ListsOpportunities[]): ListTableDrawerRow[] {
    return opportunities.map((opportunity: ListsOpportunities) => {
      return {
        id: opportunity.id,
        brand: opportunity.brandDescription,
        skuPackage: opportunity.isSimpleDistribution ? SIMPLE_OPPORTUNITY_SKU_PACKAGE_LABEL : opportunity.skuDescription,
        type: OpportunityTypeLabel[opportunity.type] || opportunity.type,
        subType: opportunity.subType,
        status: opportunity.status || '-' as OpportunityStatus,
        impact: opportunity.impact,
        current: opportunity.currentDepletions_CYTD || 0,
        yearAgo: this.calculatorService.getYearAgoPercent(opportunity.currentDepletions_CYTD, opportunity.yearAgoDepletions_CYTD),
        depletionDate: opportunity.lastDepletionDate ? moment(opportunity.lastDepletionDate).format('MM/DD/YY') : '-',
        checked: false
      };
    });
  }

  private getFullStoreAddress(store: StoreDetails): string {
    return `${ store.address } ${ store.city } ${ store.state } ${ store.postalCode }`;
  }

  private getStorePerformance(unversionedStoreId: string, storePerformance: ListStorePerformance[]): ListStorePerformance {
    return storePerformance.find((performance: ListStorePerformance) => performance.unversionedStoreId === unversionedStoreId);
  }

  private getPrimaryDistributorIndex(beerDistributors: BeerDistributors[]): number {
    return beerDistributors.findIndex((primaryBeerDistributor: BeerDistributors) => primaryBeerDistributor.isPrimary === true);
  }
}
