import { Inject, Injectable } from '@angular/core';

@Injectable()
export class OpportunitiesSearchHandoffService {
  private PRODUCT_TYPE_FILTER: string = 'masterSKU';

  constructor(
    @Inject('chipsService') private chipsService: any,
    @Inject('filtersService') private filtersService: any,
  ) { }

  public setOpportunitySearchChipsAndFilters(

  ) {

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

  public setBrandChipsAndFitlers(type: string, name: string, opportunitiesBrandSkuCode: string): void {
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

  public setDefaultOpportunitiesChipsAndFilters(opportunityType: string): void {
    this.chipsService.applyFilterArr([], 'A', 'segmentation', 'Segment A');
    this.chipsService.applyFilterArr(['A'], 'B', 'segmentation', 'Segment B');
    this.chipsService.applyFilterArr([], 'High', 'impact', 'High Impact');
    this.chipsService.applyFilterArr(['High'], 'Medium', 'impact', 'Medium Impact');
    this.chipsService.addChip(opportunityType, 'opportunityType', false);
    this.filtersService.model.selected.opportunityType = [opportunityType];
    this.filtersService.model.selected.segmentation = ['A', 'B'];
    this.filtersService.model.selected.impact = ['High', 'Medium'];
    this.filtersService.model.predictedImpactHigh = true;
    this.filtersService.model.predictedImpactMedium = true;
    this.filtersService.model.storeSegmentationA = true;
    this.filtersService.model.storeSegmentationB = true;
  }
}
