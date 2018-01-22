import { Inject, Injectable } from '@angular/core';

import { FormatOpportunitiesTypePipe } from '../pipes/formatOpportunitiesType.pipe';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { SalesHierarchyViewType } from '../enums/sales-hierarchy-view-type.enum';
import { TeamPerformanceTableOpportunity } from '../models/my-performance-table-row.model';

@Injectable()
export class OpportunitiesSearchHandoffService {
  private PRODUCT_TYPE_FILTER: string = 'masterSKU';

  constructor(
    @Inject('chipsService') private chipsService: any,
    @Inject('filtersService') private filtersService: any
  ) { }

  public setOpportunitySearchChipsAndFilters(
    brandSkuPackageName: string,
    distributorCode: string,
    opportunity: TeamPerformanceTableOpportunity,
    opportunitiesBrandSkuCode: string,
    premiseType: PremiseTypeValue,
    salesHierarchyEntityName: string,
    selectedBrandCode: string,
    skuPackageCode: string,
    skuPackageType: string,
    subAccountID: string,
    viewType: string,
    brandNameForSkuPackage: string
  ) {
    const formattedOpportunityType: string = new FormatOpportunitiesTypePipe().transform(opportunity.name);
    const formattedPremiseType: string = `${PremiseTypeValue[premiseType].toUpperCase()} PREMISE`;

    this.setInitialFiltersServiceSelectedModel();

    if (viewType === SalesHierarchyViewType.subAccounts) {
      const type = 'subaccounts';
      const name = salesHierarchyEntityName;
      this.setSubAccountChipsAndFilters(
        name,
        subAccountID,
        type,
        formattedPremiseType
      );
    } else if (viewType === SalesHierarchyViewType.distributors) {
      const type = 'distributor';
      const name = salesHierarchyEntityName;
      this.setDistributorChipsAndFilters(
        name,
        distributorCode,
        type,
        formattedPremiseType
      );
    }

    if (skuPackageCode) {
      const name = brandSkuPackageName;
      const brandName = brandNameForSkuPackage;
      this.setSkuPackageChipsAndFilters(
        name,
        skuPackageCode,
        skuPackageType,
        brandName,
        selectedBrandCode,
        skuPackageCode
      );
    } else {
      const name = brandSkuPackageName;
      const type = 'brand';
      this.setBrandChipsAndFilters(
        type,
        name,
        opportunitiesBrandSkuCode
      );
    }
    this.setDefaultChipsAndFiltersForOpportunityCounts(formattedOpportunityType);
  }

  public setSubAccountChipsAndFilters(name: string, subAccountID: string, type: string, premiseType: string): void {
    this.filtersService.model.selected.subaccount = [subAccountID];
    this.chipsService.applyFilterArr(
      [],
      {
        name: name,
        ids: [subAccountID],
        type: type,
        premiseType: premiseType
      },
      type,
      name
    );
  }

  public setSkuPackageChipsAndFilters(
    name: string,
    skuPackageCode: string,
    skuPackageType: string,
    brandName: string,
    brandCode: string,
    opportunitiesSkuPackageCode: string
    ): void {
    this.filtersService.model.selected.masterSKU = [opportunitiesSkuPackageCode];
    const skuPackageResultPayload = {
      name: name,
      type: skuPackageType,
      brand: brandName,
      brandCode: brandCode,
      id: skuPackageCode
    };
    this.chipsService.applyFilterArr([], skuPackageResultPayload, this.PRODUCT_TYPE_FILTER, name);
  }

  public setBrandChipsAndFilters(type: string, name: string, opportunitiesBrandSkuCode: string): void {
    const brandResultPayload = {
      type: type,
      brand: name,
      brandCode: opportunitiesBrandSkuCode
    };
    this.chipsService.applyFilterArr([], brandResultPayload, this.PRODUCT_TYPE_FILTER);
  }

  public setDistributorChipsAndFilters(name: string, distributorCode: string, type: string, premiseType: string): void {
      this.filtersService.model.selected.distributor = [distributorCode];
      this.chipsService.applyFilterArr(
        [],
        {
          name: name,
          id: distributorCode,
          type: type,
          premiseType: premiseType
        },
        type,
        name
      );
  }

  private setInitialFiltersServiceSelectedModel(): void {
    this.filtersService.resetFilters();
    this.chipsService.resetChipsFilters();
    this.chipsService.removeChip('myAccountsOnly');
  }

  private setDefaultChipsAndFiltersForOpportunityCounts(opportunityType: string): void {
    this.chipsService.applyFilterArr([], 'A', 'segmentation', 'Segment A');
    this.chipsService.applyFilterArr(['A'], 'B', 'segmentation', 'Segment B');
    this.chipsService.applyFilterArr([], 'High', 'impact', 'High Impact');
    this.chipsService.applyFilterArr(['High'], 'Medium', 'impact', 'Medium Impact');
    this.chipsService.addChip(opportunityType, 'opportunityType', false);
    this.filtersService.model.selected.opportunityType = [opportunityType];
    this.filtersService.model.selected.segmentation = ['A', 'B'];
    this.filtersService.model.selected.impact = ['High', 'Medium'];
    this.filtersService.model.selected.myAccountsOnly = false;
    this.filtersService.model.predictedImpactHigh = true;
    this.filtersService.model.predictedImpactMedium = true;
    this.filtersService.model.storeSegmentationA = true;
    this.filtersService.model.storeSegmentationB = true;
  }
}
