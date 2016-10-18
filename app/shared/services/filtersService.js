'use strict';

module.exports = /*  @ngInject */
  function filtersService($filter) {
    var model = {
      account: [],
      appliedFilter: {
        appliedFilter: '',
        pagination: {
          currentPage: 0,
          totalPages: 0,
          default: true,
          totalOpportunities: 0,
          totalStores: 0
        },
        sort: {
          sortArr: [
            {
              str: 'store',
              asc: true
            }
          ]
        }
      },
      subaccount: [],
      masterSKU: '',
      contact: '',
      distributor: '',
      expanded: false,
      disableReset: false,
      filtersApplied: true,
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
        {name: 'Manual'}
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
          hintText: 'Name, Address, TDLinx, or Store#'
        },
        {
          name: 'Chain',
          hintText: 'Account or Subaccount Name'
        }
      ],
      depletionsTimePeriod: {
        month: [{
          name: 'CMTH'
        }, {
          name: 'CYTM'
        }, {
          name: 'FYTM'
        }],
        year: [{
          name: 'MTD'
        }, {
          name: 'CYTD'
        }, {
          name: 'FYTD'
        }]
      },
      distributionTimePeriod: [{
        name: 'L30 Days'
      }, {
        name: 'L60 Days'
      }, {
        name: 'L90 Days'
      }],
      accountSelected: {
        accountBrands: 'Distribution (simple)',
        accountMarkets: 'Depletions',
        depletionsTimeFilter: 'FYTD',
        distributionTimeFilter: 'L90 Days',
        timePeriod: 'Current Month to Date'
      },
      selected: {},
      selectedTemplate: {
        myAccountsOnly: true,
        account: [],
        subaccount: [],
        accountTypes: '',
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
        productType: ['authorized'],
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
         value: 'month'},
        {name: 'Last Closed Month',
         value: 'year'}
      ],
      tradeChannels: {
        on: [
          {label: 'Dining', name: 'Dining', value: '50'},
          {label: 'Bar / Nightclub', name: 'Bar', value: '51'},
          {label: 'Recreation', name: 'Recreation', value: '53'},
          {label: 'Lodging', name: 'Lodging', value: '52'},
          {label: 'Transportation', name: 'Transportation', value: '54'},
          {label: 'Military', name: 'Military', value: '57'},
          {label: 'Other', name: 'Other Trade Channel'}
        ],
        off: [
          {label: 'Grocery', name: 'Grocery', value: '05'},
          {label: 'Convenience', name: 'Convenience', value: '07'},
          {label: 'Drug', name: 'Drug', value: '03'},
          {label: 'Mass Merchandiser', name: 'Merchandiser', value: '08'},
          {label: 'Liquor', name: 'Liquor', value: '02'},
          {label: 'Military', name: 'Military', value: 'MF'},
          {label: 'Recreation', name: 'Recreation', value: '53'},
          {label: 'Other', name: 'Other Trade Channel'}
        ]
      },
      trend: [
        {name: 'vs YA'},
        {name: 'vs ABP'}
      ]
    };

    var service = {
      model: model,
      addSortFilter: addSortFilter,
      disableFilters: disableFilters,
      getAppliedFilters: getAppliedFilters,
      resetFilters: resetFilters
    };

    return service;

    function addSortFilter(name) {
      var filterExists = $filter('filter')(service.model.appliedFilter.sort.sortArr, {str: name});

      // Set page offset back to 0
      service.model.appliedFilter.pagination.currentPage = 0;

      if (filterExists.length > 0) {
        filterExists[0].asc = filterExists[0].asc ? filterExists[0].asc = false : filterExists[0].asc = true;
      } else {
        service.model.appliedFilter.sort.sortArr = []; // Comment out this line to sort mulitple fields
        service.model.appliedFilter.sort.sortArr.push({str: name, asc: true});
      }
    }

    function getAppliedFilters(type) {
      // get applied filters
      var filterPayload = {type: type};
      for (var key in service.model.selected) {
        if (service.model.selected[key].constructor === Array && service.model.selected[key].length > 0) {
          filterPayload[key] = service.model.selected[key];
        } else if (service.model.selected[key] !== '') {
          filterPayload[key] = service.model.selected[key];
        }
      }

      return filterPayload;
    }

    function disableFilters(filtersAppliedBool, filtersDefaultBool, disableResetBool, disableSaveFilterBool) {
      service.model.filtersApplied = filtersAppliedBool;
      service.model.filtersDefault = filtersDefaultBool;
      service.model.disableReset = disableResetBool;
      service.model.disableSaveFilter = disableSaveFilterBool;
    }

    function resetFilters() {
      service.model.selected = angular.copy(service.model.selectedTemplate);
      resetModel(); // reset view model bindings
      service.model.filtersApplied = false;
      service.model.filtersDefault = true;
      service.model.filtersValidCount = 0;
    }

    function resetModel() {
      for (var prop in service.model) {
        if (service.model[prop] && service.model[prop].constructor !== Array && service.model[prop] === true && prop !== 'expanded' && prop !== 'productTypeAuthorized') {
          service.model[prop] = false;
        } else if (prop === 'productTypeAuthorized') {
          service.model[prop] = true;
        }
      }
    }
  };
