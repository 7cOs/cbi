describe('Unit: filter service', function() {
  var filtersService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('angulartics');
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
                roundedStores: 0
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
            opportunityType: ['All Types'],
            opportunitiesType: [
                {name: 'All Types'},
                {name: 'Non-Buy'},
                {name: 'At Risk'},
                {name: 'Low Velocity'},
                {name: 'New Placement (Quality)'},
                {name: 'New Placement (No Rebuy)'},
                {name: 'Custom'}
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
                id: 1
                }, {
                name: 'CYTM',
                displayValue: 'CYTM',
                id: 2
                }, {
                name: 'FYTM',
                displayValue: 'FYTM',
                id: 3
                }],
                year: [{
                name: 'MTD',
                displayValue: 'MTD',
                id: 4
                }, {
                name: 'CYTD',
                displayValue: 'CYTD',
                id: 5
                }, {
                name: 'FYTD',
                displayValue: 'FYTD',
                id: 6
                }]
            },
            distributionTimePeriod: {
                year: [{
                name: 'L60',
                displayValue: 'L60',
                id: 1
                }, {
                name: 'L90',
                displayValue: 'L90',
                id: 2
                }, {
                name: 'L120',
                displayValue: 'L120',
                id: 3
                }],
                month: [{
                name: 'L03',
                displayValue: 'L03',
                id: 4
                }]
            },
            scorecardDistributionTimePeriod: {
                year: [{
                name: 'L90',
                displayValue: 'L90',
                id: 2
                }],
                month: [{
                name: 'L03',
                displayValue: 'L03',
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
                zipCode: []
            },
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
                roundedStores: 0
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
            opportunityType: ['All Types'],
            opportunitiesType: [
                {name: 'All Types'},
                {name: 'Non-Buy'},
                {name: 'At Risk'},
                {name: 'Low Velocity'},
                {name: 'New Placement (Quality)'},
                {name: 'New Placement (No Rebuy)'},
                {name: 'Custom'}
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
                id: 1
                }, {
                name: 'CYTM',
                displayValue: 'CYTM',
                id: 2
                }, {
                name: 'FYTM',
                displayValue: 'FYTM',
                id: 3
                }],
                year: [{
                name: 'MTD',
                displayValue: 'MTD',
                id: 4
                }, {
                name: 'CYTD',
                displayValue: 'CYTD',
                id: 5
                }, {
                name: 'FYTD',
                displayValue: 'FYTD',
                id: 6
                }]
            },
            distributionTimePeriod: {
                year: [{
                name: 'L60',
                displayValue: 'L60',
                id: 1
                }, {
                name: 'L90',
                displayValue: 'L90',
                id: 2
                }, {
                name: 'L120',
                displayValue: 'L120',
                id: 3
                }],
                month: [{
                name: 'L03',
                displayValue: 'L03',
                id: 4
                }]
            },
            scorecardDistributionTimePeriod: {
                year: [{
                name: 'L90',
                displayValue: 'L90',
                id: 2
                }],
                month: [{
                name: 'L03',
                displayValue: 'L03',
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
                zipCode: []
            },
            selectedTemplate: {
                myAccountsOnly: true,
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
                zipCode: []
            },
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

  });
