
import { inject, TestBed } from '@angular/core/testing';

import { FormatOpportunitiesTypePipe } from '../pipes/formatOpportunitiesType.pipe';
import { getTeamPerformanceTableOpportunityMock } from '../models/my-performance-table-row.model.mock';
import { OpportunitiesSearchHandoffService } from './opportunities-search-handoff.service';
import { PremiseTypeValue } from '../enums/premise-type.enum';
import { SalesHierarchyViewType } from '../enums/sales-hierarchy-view-type.enum';
import { TeamPerformanceTableOpportunity } from '../models/my-performance-table-row.model';

describe('Service: OpportunitiesSearchHandoffService', () => {
  let opportunitiesSearchHandoffService: OpportunitiesSearchHandoffService;
  let chipsServiceMock: any;
  let filtersServiceMock: any;
  let serviceCopy: any;

  let brandSkuPackageName: string;
  let distributorCode: string;
  let opportunity: TeamPerformanceTableOpportunity;
  let opportunitiesBrandSkuCode: string;
  let premiseType: PremiseTypeValue;
  let salesHierarchyEntityName: string;
  let selectedBrandCode: string;
  let skuPackageCode: string;
  let skuPackageType: string;
  let subAccountID: string;
  let viewType: string;
  let brandNameForSkuPackage: string;

  let formattedOpportunityTypeMock: string;
  let pipeSpy: any;
  let premiseTypeString: string;

  beforeEach(() => {
    brandSkuPackageName = chance.string();
    distributorCode = chance.string();
    opportunity = getTeamPerformanceTableOpportunityMock();
    opportunitiesBrandSkuCode = chance.string();
    premiseType = chance.natural({min: 0, max: 1}) === 0 ? PremiseTypeValue.Off : PremiseTypeValue.On;
    salesHierarchyEntityName = chance.string();
    selectedBrandCode = chance.string();
    skuPackageCode = chance.string();
    skuPackageType = chance.string();
    subAccountID = chance.string();
    viewType = chance.string();
    brandNameForSkuPackage = chance.string();
    formattedOpportunityTypeMock = chance.string();
    pipeSpy = spyOn(FormatOpportunitiesTypePipe.prototype, 'transform').and.returnValue(formattedOpportunityTypeMock);
    premiseTypeString = `${PremiseTypeValue[premiseType].toUpperCase()} PREMISE`;

    chipsServiceMock = {
      model: {},
      applyFilterArr: jasmine.createSpy('applyFilterArr'),
      addChip: jasmine.createSpy('addChip'),
      resetChipsFilters: jasmine.createSpy('resetChipsFilters')
    };

    filtersServiceMock = {
      model: {
        selected: {}
      },
      resetFilters: jasmine.createSpy('resetFilters')
    };

    TestBed.configureTestingModule({
      providers: [
        OpportunitiesSearchHandoffService,
        {
          provide: 'filtersService',
          useValue: filtersServiceMock
        },
        {
          provide: 'chipsService',
          useValue: chipsServiceMock
        },
      ],
    });
  });

  beforeEach(inject([ OpportunitiesSearchHandoffService ],
    (_opportunitiesSearchHandoffService: OpportunitiesSearchHandoffService) => {
      opportunitiesSearchHandoffService = _opportunitiesSearchHandoffService;
      serviceCopy = opportunitiesSearchHandoffService as any;
  }));

  describe('#setOpportunitySearchChipsAndFilters', () => {

    beforeEach(() => {
    });

    it('should call FormatOpportunities to transform the premiseType', () => {
      opportunitiesSearchHandoffService.setOpportunitySearchChipsAndFilters(
        brandSkuPackageName,
        distributorCode,
        opportunity,
        opportunitiesBrandSkuCode,
        premiseType,
        salesHierarchyEntityName,
        selectedBrandCode,
        skuPackageCode,
        skuPackageType,
        subAccountID,
        viewType,
        brandNameForSkuPackage,
      );
      expect(pipeSpy).toHaveBeenCalled();
    });

    it('should set default and initial values for filtersService.model.selected', () => {
      opportunitiesSearchHandoffService.setOpportunitySearchChipsAndFilters(
        brandSkuPackageName,
        distributorCode,
        opportunity,
        opportunitiesBrandSkuCode,
        premiseType,
        salesHierarchyEntityName,
        selectedBrandCode,
        skuPackageCode,
        skuPackageType,
        subAccountID,
        viewType,
        brandNameForSkuPackage,
      );
      expect(filtersServiceMock.resetFilters).toHaveBeenCalled();
      expect(chipsServiceMock.resetChipsFilters).toHaveBeenCalled();
      expect(serviceCopy.filtersService.model.selected).toEqual({
        masterSKU: [skuPackageCode],
        impact: ['High', 'Medium'],
        opportunityType: [formattedOpportunityTypeMock],
        segmentation: ['A', 'B'],
      });

      expect(serviceCopy.filtersService.model.predictedImpactHigh).toBe(true);
      expect(serviceCopy.filtersService.model.predictedImpactMedium).toBe(true);
      expect(serviceCopy.filtersService.model.storeSegmentationA).toBe(true);
      expect(serviceCopy.filtersService.model.storeSegmentationB).toBe(true);
    });

    it('should call chipsService to set default chips', () => {
      opportunitiesSearchHandoffService.setOpportunitySearchChipsAndFilters(
        brandSkuPackageName,
        distributorCode,
        opportunity,
        opportunitiesBrandSkuCode,
        premiseType,
        salesHierarchyEntityName,
        selectedBrandCode,
        skuPackageCode,
        skuPackageType,
        subAccountID,
        viewType,
        brandNameForSkuPackage,
      );
      expect(serviceCopy.chipsService.applyFilterArr).toHaveBeenCalledTimes(5);
      expect(serviceCopy.chipsService.addChip).toHaveBeenCalledTimes(1);
    });

    describe('when viewtype is subAccounts', () => {
      let subAccountSpy: any;
      beforeEach(() => {
        subAccountSpy = spyOn(opportunitiesSearchHandoffService, 'setSubAccountChipsAndFilters');
        viewType = SalesHierarchyViewType.subAccounts;
        opportunitiesSearchHandoffService.setOpportunitySearchChipsAndFilters(
          brandSkuPackageName,
          distributorCode,
          opportunity,
          opportunitiesBrandSkuCode,
          premiseType,
          salesHierarchyEntityName,
          selectedBrandCode,
          skuPackageCode,
          skuPackageType,
          subAccountID,
          viewType,
          brandNameForSkuPackage,
        );

      });
      it('should set chips and filters for selected subaccount', () => {
        expect(subAccountSpy).toHaveBeenCalledWith(salesHierarchyEntityName, subAccountID, 'subaccounts', premiseTypeString);
      });
    });

    describe('when viewtype is distributors', () => {
      let distributorSpy: any;
      beforeEach(() => {
        distributorSpy = spyOn(opportunitiesSearchHandoffService, 'setDistributorChipsAndFilters');
        viewType = SalesHierarchyViewType.distributors;
        opportunitiesSearchHandoffService.setOpportunitySearchChipsAndFilters(
          brandSkuPackageName,
          distributorCode,
          opportunity,
          opportunitiesBrandSkuCode,
          premiseType,
          salesHierarchyEntityName,
          selectedBrandCode,
          skuPackageCode,
          skuPackageType,
          subAccountID,
          viewType,
          brandNameForSkuPackage,
        );
      });
      it('should set chips and filters for selected distributor', () => {
        expect(distributorSpy).toHaveBeenCalledWith(salesHierarchyEntityName, distributorCode, 'distributor', premiseTypeString);
      });
    });

    describe('when skuPackageCode is supplied', () => {
      let skuPackageSpy: any;
      beforeEach(() => {
        skuPackageSpy = spyOn(opportunitiesSearchHandoffService, 'setSkuPackageChipsAndFilters');
        viewType = SalesHierarchyViewType.distributors;
        opportunitiesSearchHandoffService.setOpportunitySearchChipsAndFilters(
          brandSkuPackageName,
          distributorCode,
          opportunity,
          opportunitiesBrandSkuCode,
          premiseType,
          salesHierarchyEntityName,
          selectedBrandCode,
          skuPackageCode,
          skuPackageType,
          subAccountID,
          viewType,
          brandNameForSkuPackage,
        );
      });
      it('should set chips and filters for selected skuPackage', () => {
        expect(skuPackageSpy).toHaveBeenCalledWith(
          brandSkuPackageName,
          skuPackageCode,
          skuPackageType,
          brandNameForSkuPackage,
          selectedBrandCode,
          skuPackageCode
        );
      });
    });
    describe('when skuPackageCode is NOT supplied', () => {
      let brandSpy: any;
      beforeEach(() => {
        brandSpy = spyOn(opportunitiesSearchHandoffService, 'setBrandChipsAndFilters');
        viewType = SalesHierarchyViewType.subAccounts;
        opportunitiesSearchHandoffService.setOpportunitySearchChipsAndFilters(
          brandSkuPackageName,
          distributorCode,
          opportunity,
          opportunitiesBrandSkuCode,
          premiseType,
          salesHierarchyEntityName,
          selectedBrandCode,
          undefined,
          undefined,
          subAccountID,
          viewType,
          undefined,
        );
      });

      it('should set chips and filters for selceted brand', () => {
        expect(brandSpy).toHaveBeenCalledWith(
          'brand',
          brandSkuPackageName,
          opportunitiesBrandSkuCode
        );
      });
    });
  });

  describe('setSkuPackageChipsAndFilters', () => {
    it('should set skuPackage chips and filters', () => {
      opportunitiesSearchHandoffService.setSkuPackageChipsAndFilters(
        brandSkuPackageName,
        skuPackageCode,
        skuPackageType,
        brandNameForSkuPackage,
        selectedBrandCode,
        skuPackageCode
      );
      expect(serviceCopy.filtersService.model.selected.masterSKU).toEqual([skuPackageCode]);
      expect(serviceCopy.chipsService.applyFilterArr).toHaveBeenCalledWith(
          [],
          {
            brand: brandNameForSkuPackage,
            brandCode: selectedBrandCode,
            id: skuPackageCode,
            name: brandSkuPackageName,
            type: skuPackageType
          },
          'masterSKU',
          brandSkuPackageName
      );
    });
  });
  describe('setBrandChipsAndFilters', () => {
    it('should set brand chips and filters', () => {
      opportunitiesSearchHandoffService.setBrandChipsAndFilters(
        'brand',
        brandSkuPackageName,
        opportunitiesBrandSkuCode
      );
      expect(serviceCopy.chipsService.applyFilterArr).toHaveBeenCalledWith(
          [],
          {
            brand: brandSkuPackageName,
            brandCode: opportunitiesBrandSkuCode,
            type: 'brand'
          },
          'masterSKU'
      );
    });
  });

  describe('setSubAccountChipsAndFilters', () => {
    it('should set subaccount chips and filters', () => {
      opportunitiesSearchHandoffService.setSubAccountChipsAndFilters(
        salesHierarchyEntityName,
        subAccountID,
        'subaccounts',
        premiseTypeString
      );
      expect(serviceCopy.filtersService.model.selected.subaccount).toEqual([subAccountID]);
      expect(serviceCopy.chipsService.applyFilterArr).toHaveBeenCalledWith(
          [],
          {
            name: salesHierarchyEntityName,
            ids: [subAccountID],
            type: 'subaccounts',
            premiseType: premiseTypeString
          },
          'subaccounts',
          salesHierarchyEntityName
      );
    });
  });

  describe('setDistributorChipsAndFilters', () => {
    it('should set distributor chips and filters', () => {
      opportunitiesSearchHandoffService.setDistributorChipsAndFilters(
        salesHierarchyEntityName,
        distributorCode,
        'distributor',
        premiseTypeString
      );
      expect(serviceCopy.filtersService.model.selected.distributor).toEqual([distributorCode]);
      expect(serviceCopy.chipsService.applyFilterArr).toHaveBeenCalledWith(
          [],
          {
            name: salesHierarchyEntityName,
            id: distributorCode,
            type: 'distributor',
            premiseType: premiseTypeString
          },
          'distributor',
          salesHierarchyEntityName
      );
    });
  });
});
