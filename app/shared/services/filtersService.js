'use strict';

module.exports = /*  @ngInject */
  function filtersService() {
    var model = {
      account: [],
      subaccount: [],
      accounts: [
        {name: 'Walmart', subAccount: 'North East'},
        {name: 'Walmart', subAccount: 'West'},
        {name: 'Walmart', subAccount: 'South'},
        {name: 'Walmart', subAccount: 'East'}
      ],
      brands: '',
      cbbdContact: '',
      distributor: '',
      expanded: false,
      filtersApplied: true,
      filtersDefault: true,
      impact: '',
      opportunityStatus: [
        {
          name: 'Open',
          value: 'open'
        }, {
          name: 'Targeted',
          value: 'targeted'
        }
      ],
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
      selected: {},
      selectedTemplate: {
        myAccountsOnly: true,
        account: [],
        subaccount: [],
        accountBrands: 'Distribution (simple)',
        accountMarkets: 'Depletions',
        accountTypes: '',
        brands: [],
        cbbdChain: false,
        cbbdContact: [],
        currentFilter: '',
        depletionsTimeFilter: 'FYTD',
        distributor: [],
        distributionTimeFilter: 'L90 Days',
        impact: '',
        independent: false,
        location: '',
        opportunitiesStatus: '',
        opportunityType: ['All Types'],
        predictedImpactHigh: '',
        predictedImpactMedium: '',
        predictedImpactLow: '',
        premiseType: 'off',
        productTypeFeatured: '',
        productTypePriority: '',
        productTypeAuthorized: true,
        store: [],
        retailer: 'Chain',
        storeSearchText: '',
        storeSegmentationA: '',
        storeSegmentationB: '',
        storeSegmentationC: '',
        storeType: '',
        timePeriod: 'Current Month to Date',
        trend: '',
        valuesVsTrend: ''
      },
      timePeriod: [
        {name: 'Current Month to Date',
         value: 'month'},
        {name: 'Last Closed Month',
         value: 'year'}
      ],
      tradeChannels: {
        on: [
          {label: 'Dining', name: 'Dining'},
          {label: 'Bar / Nightclub', name: 'Bar'},
          {label: 'Recreation', name: 'Recreation'},
          {label: 'Lodging', name: 'Lodging'},
          {label: 'Transportation', name: 'Transportation'},
          {label: 'Military', name: 'Military'},
          {label: 'Other', name: 'Other'}
        ],
        off: [
          {label: 'Grocery', name: 'Grocery', value: '05'},
          {label: 'Convenience', name: 'Convenience', value: '07'},
          {label: 'Drug', name: 'Drug', value: '03'},
          {label: 'Mass Merchandiser', name: 'Mass', value: '08'},
          {label: 'Liquor', name: 'Liquor', value: '02'},
          {label: 'Military', name: 'Military', value: 'MF'},
          {label: 'Recreation', name: 'Recreation', value: '53'},
          {label: 'Other', name: 'Other'}
        ]

      },
      trend: [
        {name: 'vs YA'},
        {name: 'vs ABP'}
      ]
    };

    var service = {
      model: model,
      getAppliedFilters: getAppliedFilters,
      resetFilters: resetFilters
    };

    return service;

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

    function resetFilters() {
      service.model.selected = angular.copy(service.model.selectedTemplate);
      service.model.filtersApplied = false;
      service.model.filtersDefault = true;
    }
  };
