describe('Unit: filter service', function() {
  var filtersService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.filter');

    inject(function(_filtersService_) {
      filtersService = _filtersService_;
    });
  });

    var initialModelObject = {
        account: [],
            appliedFilter: {
                appliedFilter: '',
                pagination: {
                  currentPage: 0,
                  totalPages: 0,
                  default: true,
                  totalOpportunities: 0,
                  totalStores: 0,
                  roundedStores: 0,
                  shouldReloadData: false
                },
                sort: {
                sortArr: []
                }
            },
            defaultSort: {
                str: 'segmentation',
                asc: true
            },
            subaccount: [],
            masterSKU: '',
            contact: '',
            distributor: '',
            expanded: false,
            disableReset: false,
            filtersApplied: false,
            filtersDefault: true,
            disableSaveFilter: false,
            filtersValidCount: 0,
            impact: '',
            opportunitiesType: [
                {name: 'All Types'},
                {name: 'Non-Buy'},
                {name: 'At Risk'},
                {name: 'Low Velocity'},
                {name: 'New Placement (Quality)'},
                {name: 'New Placement (No Rebuy)'},
                {name: 'Custom'}
            ],
            featureType: [
              {name: 'All Types'},
              {name: 'Happy Hour', key: 'HH'},
              {name: 'Everyday Low Price', key: 'LP'},
              {name: 'Limited Time Only', key: 'LT'},
              {name: 'Beer of the Month', key: 'BE'},
              {name: 'Price Feature', key: 'PF'}
            ],
            itemAuthorizationType: [
              {name: 'All Types'},
              {name: 'Brand Mandate', key: 'BM'},
              {name: 'Corporate Mandate', key: 'CM'},
              {name: 'Authorized-Select Planogram', key: 'SP'},
              {name: 'Authorized-Optional (Sell-In)', key: 'OS'}
            ],
            savedFilters: [],
            placementType: [
                {name: 'Simple'},
                {name: 'Effective'}
            ],
            premises: [
                {
                name: 'All',
                value: 'all'
                }, {
                name: 'Off-Premise',
                value: 'off'
                }, {
                name: 'On-Premise',
                value: 'on'
                }],
            retailer: [
                {
                name: 'Store',
                type: 'Store',
                hintText: 'Name, Address, TDLinx'
                },
                {
                name: 'Chain',
                type: 'Account',
                hintText: 'Account or Subaccount Name'
                }
            ],
            depletionsTimePeriod: {
                month: [{
                name: 'CMTH',
                displayValue: 'Clo Mth',
                v3ApiCode: 'LCM',
                id: 1
                }, {
                name: 'CYTM',
                displayValue: 'CYTM',
                v3ApiCode: 'CYTM',
                id: 2
                }, {
                name: 'FYTM',
                displayValue: 'FYTM',
                v3ApiCode: 'FYTM',
                id: 3
                }],
                year: [{
                name: 'MTD',
                displayValue: 'MTD',
                v3ApiCode: 'CMIPBDL',
                id: 4
                }, {
                name: 'CYTD',
                displayValue: 'CYTD',
                v3ApiCode: 'CYTD',
                id: 5
                }, {
                name: 'FYTD',
                displayValue: 'FYTD',
                v3ApiCode: 'FYTD',
                id: 6
                }]
            },
            distributionTimePeriod: {
                year: [{
                name: 'L60',
                displayValue: 'L60',
                displayCode: 'L60 Days',
                v3ApiCode: 'L60',
                id: 1
                }, {
                name: 'L90',
                displayValue: 'L90',
                displayCode: 'L90 Days',
                v3ApiCode: 'L90',
                id: 2
                }, {
                name: 'L120',
                displayValue: 'L120',
                displayCode: 'L120 Days',
                v3ApiCode: 'L120',
                id: 3
                }],
                month: [{
                name: 'L03',
                displayValue: 'L03',
                displayCode: 'L03 Mth',
                v3ApiCode: 'L3CM',
                id: 4
                }]
            },
            scorecardDistributionTimePeriod: {
              year: [{
                name: 'L90',
                displayValue: 'L90',
                displayCode: 'L90 Days',
                v3ApiCode: 'L90',
                id: 2
              }],
              month: [{
                name: 'L03',
                displayValue: 'L03',
                displayCode: 'L03 Mth',
                v3ApiCode: 'L3CM',
                id: 4
              }]
            },
            accountSelected: {
                accountBrands: '',
                accountMarkets: '',
                depletionsTimeFilter: '',
                distributionTimeFilter: '',
                timePeriod: ''
            },
            selected: {},
            selectedTemplate: {
                myAccountsOnly: true,
                simpleDistributionType: false,
                priorityPackage: false,
                account: [],
                subaccount: [],
                brand: [],
                masterSKU: [],
                cbbdChain: [],
                contact: [],
                city: [],
                currentFilter: '',
                distributor: [],
                impact: [],
                opportunityStatus: [],
                opportunityType: ['All Types'],
                featureType: [],
                itemAuthorizationType: [],
                premiseType: 'off',
                productType: [],
                store: [],
                retailer: 'Chain',
                brandSearchText: '',
                storeSearchText: '',
                distributorSearchText: '',
                segmentation: [],
                state: [],
                tradeChannel: [],
                trend: '',
                valuesVsTrend: '',
                zipCode: [],
                salesStatus: [],
                storeFormat: ''
            },
            simpleDistributionType: false,
            storeFormat: '',
            timePeriod: [
                {name: 'Current Month to Date',
                value: 'year'},
                {name: 'Last Closed Month',
                value: 'month'}
            ],
            tradeChannels: {
                on: [
                {label: 'Dining', name: 'Dining', value: '50'},
                {label: 'Bar / Nightclub', name: 'Bar', value: '51'},
                {label: 'Recreation', name: 'Recreation', value: '53'},
                {label: 'Lodging', name: 'Lodging', value: '52'},
                {label: 'Transportation', name: 'Transportation', value: '54'},
                {label: 'Military', name: 'Military', value: '57'},
                {label: 'Other', name: 'Other Trade Channel', value: 'OTHER'}
                ],
                off: [
                {label: 'Grocery', name: 'Grocery', value: '05'},
                {label: 'Convenience', name: 'Convenience', value: '07'},
                {label: 'Drug', name: 'Drug', value: '03'},
                {label: 'Mass Merchandiser', name: 'Mass Merchandiser', value: '08'},
                {label: 'Liquor', name: 'Liquor', value: '02'},
                {label: 'Military', name: 'Military', value: 'MF'},
                {label: 'Wholesale Club', name: 'Wholesale Club', value: '01'},
                {label: 'Other', name: 'Other Trade Channel', value: 'OTHER'}
                ]
            },
            trend: [
                {
                name: 'vs YA',
                value: 1,
                showInStoreLevel: true,
                showInOtherLevels: true
                },
                {
                name: 'vs ABP',
                value: 2,
                showInStoreLevel: false,
                showInOtherLevels: true
                },
                {
                name: 'vs Similar Stores',
                value: 2,
                showInStoreLevel: true,
                showInOtherLevels: false
                }
            ]
    };

    var resetModelObject = {
        account: [],
            appliedFilter: {
                appliedFilter: '',
                pagination: {
                  currentPage: 0,
                  totalPages: 0,
                  default: true,
                  totalOpportunities: 0,
                  totalStores: 0,
                  roundedStores: 0,
                  shouldReloadData: false
                },
                sort: {
                sortArr: []
                }
            },
            defaultSort: {
                str: 'segmentation',
                asc: true
            },
            subaccount: [],
            masterSKU: '',
            contact: '',
            distributor: '',
            expanded: false,
            disableReset: false,
            filtersApplied: false,
            filtersDefault: true,
            disableSaveFilter: false,
            filtersValidCount: 0,
            impact: '',
            opportunitiesType: [
                {name: 'All Types'},
                {name: 'Non-Buy'},
                {name: 'At Risk'},
                {name: 'Low Velocity'},
                {name: 'New Placement (Quality)'},
                {name: 'New Placement (No Rebuy)'},
                {name: 'Custom'}
            ],
            featureType: [
              {name: 'All Types'},
              {name: 'Happy Hour', key: 'HH'},
              {name: 'Everyday Low Price', key: 'LP'},
              {name: 'Limited Time Only', key: 'LT'},
              {name: 'Beer of the Month', key: 'BE'},
              {name: 'Price Feature', key: 'PF'}
            ],
            itemAuthorizationType: [
              {name: 'All Types'},
              {name: 'Brand Mandate', key: 'BM'},
              {name: 'Corporate Mandate', key: 'CM'},
              {name: 'Authorized-Select Planogram', key: 'SP'},
              {name: 'Authorized-Optional (Sell-In)', key: 'OS'}
            ],
            savedFilters: [],
            placementType: [
                {name: 'Simple'},
                {name: 'Effective'}
            ],
            premises: [
                {
                name: 'All',
                value: 'all'
                }, {
                name: 'Off-Premise',
                value: 'off'
                }, {
                name: 'On-Premise',
                value: 'on'
                }],
            retailer: [
                {
                name: 'Store',
                type: 'Store',
                hintText: 'Name, Address, TDLinx'
                },
                {
                name: 'Chain',
                type: 'Account',
                hintText: 'Account or Subaccount Name'
                }
            ],
            depletionsTimePeriod: {
                month: [{
                name: 'CMTH',
                displayValue: 'Clo Mth',
                v3ApiCode: 'LCM',
                id: 1
                }, {
                name: 'CYTM',
                displayValue: 'CYTM',
                v3ApiCode: 'CYTM',
                id: 2
                }, {
                name: 'FYTM',
                displayValue: 'FYTM',
                v3ApiCode: 'FYTM',
                id: 3
                }],
                year: [{
                name: 'MTD',
                displayValue: 'MTD',
                v3ApiCode: 'CMIPBDL',
                id: 4
                }, {
                name: 'CYTD',
                displayValue: 'CYTD',
                v3ApiCode: 'CYTD',
                id: 5
                }, {
                name: 'FYTD',
                displayValue: 'FYTD',
                v3ApiCode: 'FYTD',
                id: 6
                }]
            },
            distributionTimePeriod: {
                year: [{
                name: 'L60',
                displayValue: 'L60',
                displayCode: 'L60 Days',
                v3ApiCode: 'L60',
                id: 1
                }, {
                name: 'L90',
                displayValue: 'L90',
                displayCode: 'L90 Days',
                v3ApiCode: 'L90',
                id: 2
                }, {
                name: 'L120',
                displayValue: 'L120',
                displayCode: 'L120 Days',
                v3ApiCode: 'L120',
                id: 3
                }],
                month: [{
                name: 'L03',
                displayValue: 'L03',
                displayCode: 'L03 Mth',
                v3ApiCode: 'L3CM',
                id: 4
                }]
            },
            scorecardDistributionTimePeriod: {
              year: [{
                name: 'L90',
                displayValue: 'L90',
                displayCode: 'L90 Days',
                v3ApiCode: 'L90',
                id: 2
              }],
              month: [{
                name: 'L03',
                displayValue: 'L03',
                displayCode: 'L03 Mth',
                v3ApiCode: 'L3CM',
                id: 4
              }]
            },
            accountSelected: {
                accountBrands: '',
                accountMarkets: '',
                depletionsTimeFilter: '',
                distributionTimeFilter: '',
                timePeriod: ''
            },
            selected: {
                myAccountsOnly: true,
                simpleDistributionType: false,
                priorityPackage: false,
                account: [],
                subaccount: [],
                brand: [],
                masterSKU: [],
                cbbdChain: [],
                contact: [],
                city: [],
                currentFilter: '',
                distributor: [],
                impact: [],
                opportunityStatus: [],
                opportunityType: ['All Types'],
                featureType: [],
                itemAuthorizationType: [],
                premiseType: 'off',
                productType: [],
                store: [],
                retailer: 'Chain',
                brandSearchText: '',
                storeSearchText: '',
                distributorSearchText: '',
                segmentation: [],
                state: [],
                tradeChannel: [],
                trend: '',
                valuesVsTrend: '',
                zipCode: [],
                salesStatus: [],
                storeFormat: ''
            },
            selectedTemplate: {
                myAccountsOnly: true,
                simpleDistributionType: false,
                priorityPackage: false,
                account: [],
                subaccount: [],
                brand: [],
                masterSKU: [],
                cbbdChain: [],
                contact: [],
                city: [],
                currentFilter: '',
                distributor: [],
                impact: [],
                opportunityStatus: [],
                opportunityType: ['All Types'],
                featureType: [],
                itemAuthorizationType: [],
                premiseType: 'off',
                productType: [],
                store: [],
                retailer: 'Chain',
                brandSearchText: '',
                storeSearchText: '',
                distributorSearchText: '',
                segmentation: [],
                state: [],
                tradeChannel: [],
                trend: '',
                valuesVsTrend: '',
                zipCode: [],
                salesStatus: [],
                storeFormat: ''
            },
            simpleDistributionType: false,
            storeFormat: '',
            timePeriod: [
                {name: 'Current Month to Date',
                value: 'year'},
                {name: 'Last Closed Month',
                value: 'month'}
            ],
            tradeChannels: {
                on: [
                {label: 'Dining', name: 'Dining', value: '50'},
                {label: 'Bar / Nightclub', name: 'Bar', value: '51'},
                {label: 'Recreation', name: 'Recreation', value: '53'},
                {label: 'Lodging', name: 'Lodging', value: '52'},
                {label: 'Transportation', name: 'Transportation', value: '54'},
                {label: 'Military', name: 'Military', value: '57'},
                {label: 'Other', name: 'Other Trade Channel', value: 'OTHER'}
                ],
                off: [
                {label: 'Grocery', name: 'Grocery', value: '05'},
                {label: 'Convenience', name: 'Convenience', value: '07'},
                {label: 'Drug', name: 'Drug', value: '03'},
                {label: 'Mass Merchandiser', name: 'Mass Merchandiser', value: '08'},
                {label: 'Liquor', name: 'Liquor', value: '02'},
                {label: 'Military', name: 'Military', value: 'MF'},
                {label: 'Wholesale Club', name: 'Wholesale Club', value: '01'},
                {label: 'Other', name: 'Other Trade Channel', value: 'OTHER'}
                ]
            },
            trend: [
                {
                name: 'vs YA',
                value: 1,
                showInStoreLevel: true,
                showInOtherLevels: true
                },
                {
                name: 'vs ABP',
                value: 2,
                showInStoreLevel: false,
                showInOtherLevels: true
                },
                {
                name: 'vs Similar Stores',
                value: 2,
                showInStoreLevel: true,
                showInOtherLevels: false
                }
            ],
            states: []
    };

  it('should be defined', function() {

      expect(filtersService.addSortFilter).toBeDefined();
      expect(filtersService.checkForAuthorizationFlag).toBeDefined();
      expect(filtersService.updateSelectedFilterModel).toBeDefined();
      expect(filtersService.getAppliedFilters).toBeDefined();
      expect(filtersService.disableFilters).toBeDefined();
      expect(filtersService.cleanUpSaveFilterObj).toBeDefined();
      expect(filtersService.resetFilters).toBeDefined();
      expect(filtersService.resetSort).toBeDefined();
      expect(filtersService.resetPagination).toBeDefined();
  });

  it('should have valid default model state', function() {

      expect(filtersService.model).toEqual(initialModelObject);
  });

  it('add sort filter', function() {

      filtersService.model.appliedFilter.pagination.currentPage = 5;
      filtersService.model.appliedFilter.sort.sortArr = [{asc: true, str: 'opportunity'}];
      filtersService.addSortFilter('segmentation');
      expect(filtersService.model.appliedFilter.pagination.currentPage).toEqual(0);
      expect(filtersService.model.appliedFilter.sort.sortArr).toEqual([{asc: true, str: 'segmentation'}]);

  });

  it('update selected filter model', function() {

      var filterModel = {
          selected: {
              myAccountsOnly: true,
              account: ['11111'],
              subaccount: ['22222'],
              brand: ['123'],
              masterSKU: ['1444'],
              cbbdChain: ['Cbbd'],
              contact: ['5555'],
              city: ['Cleveland'],
              currentFilter: '5623-492348-9068923',
              distributor: ['33333', '44444'],
              impact: ['H'],
              opportunityStatus: ['Targeted'],
              opportunityType: ['All Types'],
              premiseType: 'on',
              productType: ['featured'],
              retailer: 'Chain'
          }
      };

      expect(filterModel.selected).not.toEqual(filtersService.model.selected);
      filtersService.updateSelectedFilterModel(filterModel);
      expect(filterModel.selected).toEqual(filtersService.model.selected);
  });

  it('get applied filters', function() {

      var selectedFiltersFull = {
        myAccountsOnly: false,
        account: [],
        subaccount: [],
        brand: [],
        masterSKU: [],
        cbbdChain: [],
        contact: [],
        city: [],
        currentFilter: '',
        distributor: ['111111', '222222'],
        impact: ['H'],
        opportunityStatus: [],
        opportunityType: ['All Types'],
        premiseType: 'on',
        productType: [],
        store: [],
        retailer: 'Chain',
        brandSearchText: '',
        storeSearchText: '',
        distributorSearchText: '',
        segmentation: [],
        state: [],
        tradeChannel: [],
        trend: '',
        valuesVsTrend: '',
        zipCode: []
      };

      var selectedFiltersTrimmed = {
        type: 'opportunities',
        myAccountsOnly: false,
        distributor: ['111111', '222222'],
        impact: ['H'],
        opportunityType: ['All Types'],
        premiseType: 'on',
        retailer: 'Chain'
      };

      filtersService.model.selected = selectedFiltersFull;

      var filterObject = filtersService.getAppliedFilters('opportunities');
      expect(filterObject).not.toEqual(selectedFiltersFull);
      expect(filterObject).toEqual(selectedFiltersTrimmed);

      selectedFiltersTrimmed.type = 'topBottom';
      filterObject = filtersService.getAppliedFilters('topBottom');
      expect(filterObject).not.toEqual(selectedFiltersFull);
      expect(filterObject).toEqual(selectedFiltersTrimmed);

      selectedFiltersTrimmed.type = 'brandsnapshot';
      filterObject = filtersService.getAppliedFilters('brandsnapshot');
      expect(filterObject).not.toEqual(selectedFiltersFull);
      expect(filterObject).toEqual(selectedFiltersTrimmed);

  });

  it('clean up save filter obj', function() {

      var filterObjectToClean = initialModelObject;
      filterObjectToClean.account = ['111111'];
      filterObjectToClean.masterSKU = '22222';
      filterObjectToClean.impact = 'H';

      expect(filterObjectToClean.opportunityType);
      expect(filterObjectToClean.opportunitiesType);
      expect(filterObjectToClean.placementType);
      expect(filterObjectToClean.premises);
      expect(filterObjectToClean.retailer);
      expect(filterObjectToClean.depletionsTimePeriod);
      expect(filterObjectToClean.distributionTimePeriod);
      expect(filterObjectToClean.accountSelected);
      expect(filterObjectToClean.selectedTemplate);
      expect(filterObjectToClean.timePeriod);
      expect(filterObjectToClean.tradeChannels);
      expect(filterObjectToClean.trend);
      expect(filterObjectToClean.defaultSort);
      expect(filterObjectToClean.appliedFilter);

      filterObjectToClean = filtersService.cleanUpSaveFilterObj(filterObjectToClean);

      expect(!filterObjectToClean.opportunityType);
      expect(!filterObjectToClean.opportunitiesType);
      expect(!filterObjectToClean.placementType);
      expect(!filterObjectToClean.premises);
      expect(!filterObjectToClean.retailer);
      expect(!filterObjectToClean.depletionsTimePeriod);
      expect(!filterObjectToClean.distributionTimePeriod);
      expect(!filterObjectToClean.accountSelected);
      expect(!filterObjectToClean.selectedTemplate);
      expect(!filterObjectToClean.timePeriod);
      expect(!filterObjectToClean.tradeChannels);
      expect(!filterObjectToClean.trend);
      expect(!filterObjectToClean.defaultSort);
      expect(!filterObjectToClean.appliedFilter);

      expect(filterObjectToClean.account).toEqual(['111111']);
      expect(filterObjectToClean.masterSKU).toEqual('22222');
      expect(filterObjectToClean.impact).toEqual('H');
  });

  it('reset filters', function() {

      filtersService.resetFilters();
      expect(filtersService.model).toEqual(resetModelObject);

      filtersService.model.disableReset = true;
      filtersService.model.filtersApplied = true;
      filtersService.model.filtersDefault = false;
      filtersService.model.disableSaveFilter = true;
      filtersService.model.states = ['OH', 'WA'];
      filtersService.model.filtersValidCount = 1000;

      expect(filtersService.model).not.toEqual(resetModelObject);
      filtersService.resetFilters();
      expect(filtersService.model).toEqual(resetModelObject);

      filtersService.model.expanded = true;
      expect(filtersService.model).not.toEqual(resetModelObject);
      filtersService.resetFilters();
      expect(filtersService.model).not.toEqual(resetModelObject);
      filtersService.model.expanded = false;
      expect(filtersService.model).toEqual(resetModelObject);

  });

  it('reset sort', function() {

      expect(filtersService.model.appliedFilter.sort.sortArr).toEqual([]);
      filtersService.resetSort();
      expect(filtersService.model.appliedFilter.sort.sortArr).toEqual([filtersService.model.defaultSort]);

      filtersService.model.appliedFilter.sort.sortArr = [{str: 'count', asc: false}];
      expect(filtersService.model.appliedFilter.sort.sortArr).not.toEqual([]);
      filtersService.resetSort();
      expect(filtersService.model.appliedFilter.sort.sortArr).toEqual([filtersService.model.defaultSort]);

  });

  it('reset pagination filters', function() {
    const paginationObject = {
      currentPage: 1,
      totalPages: 3,
      default: true,
      totalOpportunities: 300,
      totalStores: 79,
      roundedStores: 80,
      shouldReloadData: true
    };

    filtersService.resetFilters();
    expect(filtersService.model).toEqual(resetModelObject);

    filtersService.model.appliedFilter.pagination = paginationObject;

    filtersService.resetPagination();
    expect(filtersService.model).toEqual(resetModelObject);
  });

  it('[getNewPaginationState] should not return a different number of total pages if current stores fit on existing pages', function() {

    const paginationModel = filtersService.getNewPaginationState({
      currentPage: 0,
      totalPages: 2,
      default: true,
      totalOpportunities: 41,
      totalStores: 41,
      roundedStores: 50,
      shouldReloadData: false
    });

    expect(paginationModel).toEqual({
      currentPage: 0,
      totalPages: 2,
      default: true,
      totalOpportunities: 41,
      totalStores: 41,
      roundedStores: 50,
      shouldReloadData: false
    });
  });

  it('[getNewPaginationState] should return a new total page count when there are no stores left for the last page', function() {

    const paginationModel = filtersService.getNewPaginationState({
      currentPage: 0,
      totalPages: 2,
      default: true,
      totalOpportunities: 40,
      totalStores: 40,
      roundedStores: 50,
      shouldReloadData: false
    });

    expect(paginationModel).toEqual({
      currentPage: 0,
      totalPages: 1,
      default: true,
      totalOpportunities: 40,
      totalStores: 40,
      roundedStores: 50,
      shouldReloadData: false
    });
  });

  it('[getNewPaginationState] if the currentPage is the last page and is removed, return true for shouldReloadData and set currentPage to the new last page', function() {
    const paginationModel = filtersService.getNewPaginationState({
      currentPage: 2,
      totalPages: 2,
      default: true,
      totalOpportunities: 40,
      totalStores: 40,
      roundedStores: 50,
      shouldReloadData: false
    });

    expect(paginationModel).toEqual({
      currentPage: 1,
      totalPages: 1,
      default: true,
      totalOpportunities: 40,
      totalStores: 40,
      roundedStores: 50,
      shouldReloadData: true
    });
  });
});
