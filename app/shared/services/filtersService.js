'use strict';

module.exports = /*  @ngInject */
  function filtersService() {
    var model = {
      accounts: [
        {name: 'Walmart', subAccount: 'North East'},
        {name: 'Walmart', subAccount: 'West'},
        {name: 'Walmart', subAccount: 'South'},
        {name: 'Walmart', subAccount: 'East'}
      ],
      brands: '',
      cbbdContact: '',
      distributors: '',
      expanded: false,
      filtersApplied: true,
      filtersDefault: true,
      opportunityStatus: [
        {
          name: 'Open',
          value: 'open'
        }, {
          name: 'Targeted',
          value: 'targeted'
        }
      ],
      opportunityTypes: ['All Types'],
      opportunitiesTypes: [
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
        accountBrands: 'Distribution (simple)',
        accountMarkets: 'Depletions',
        accountTypes: '',
        brands: [],
        cbbdContact: [],
        chains: '',
        currentFilter: '',
        depletionsTimeFilter: 'FYTD',
        distributors: [],
        distributionTimeFilter: 'L90 Days',
        location: '',
        opportunitiesStatus: '',
        opportunityTypes: ['All Types'],
        predictedImpactHigh: '',
        predictedImpactMedium: '',
        predictedImpactLow: '',
        premiseType: 'off',
        productTypeFeatured: '',
        productTypePriority: '',
        productTypeAuthorized: true,
        stores: [],
        retailer: '',
        storeSearchText: '',
        storeSegmentationA: '',
        storeSegmentationB: '',
        storeSegmentationC: '',
        storeType: '',
        timePeriod: 'Current Month to Date',
        tradeChannelConvenience: false,
        tradeChannelDrug: '',
        tradeChannelGrocery: '',
        tradeChannelLiquor: '',
        tradeChannelMassMerchandiser: '',
        tradeChannelMilitary: '',
        tradeChannelOther: '',
        tradeChannelRecreation: '',
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
          {label: 'Grocery', name: 'Grocery'},
          {label: 'Convenience', name: 'Convenience'},
          {label: 'Drug', name: 'Drug'},
          {label: 'Mass Merchandiser', name: 'Mass'},
          {label: 'Liquor', name: 'Liquor'},
          {label: 'Military', name: 'Military'},
          {label: 'Recreation', name: 'Recreation'},
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
