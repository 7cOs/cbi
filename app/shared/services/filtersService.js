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
        name: 'L30 Days June 21, 2016 - July 21, 2016'
      }, {
        name: 'L60 Days May 21, 2016 - July 21, 2016'
      }, {
        name: 'L90 Days April 22, 2016 - July 21, 2016'
      }],
      selected: {},
      selectedTemplate: {
        myAccountsOnly: true,
        accountBrands: '',
        accountMarkets: '',
        accountTypes: '',
        brands: [],
        cbbdContact: [],
        chains: '',
        currentFilter: '',
        depletionsTimeFilter: 'MTD July 1, 2016- July 31, 2016',
        distributors: [],
        distributionTimeFilter: 'L90 Days April 22, 2016 - July 21, 2016',
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
          {label: 'Military On Premise', name: 'Military'},
          {label: 'Other', name: 'Other'}
        ],
        off: [
          {label: 'Convenience', name: 'Convenience'},
          {label: 'Mass Merchandiser', name: 'Mass'},
          {label: 'Grocery', name: 'Grocery'},
          {label: 'Drug', name: 'Drug'},
          {label: 'Liquor', name: 'Liquor'},
          {label: 'Military Off Premise', name: 'Military'},
          {label: 'Recreation', name: 'Recreation'},
          {label: 'Other', name: 'Other'}
        ]

      },
      trend: [
        {name: 'vs YA'},
        {name: 'va Plan'}
      ]
    };

    var service = {
      model: model,
      getAppliedFilters: getAppliedFilters,
      resetFilters: resetFilters,
      saveReport: saveReport
    };

    return service;

    function getAppliedFilters(type) {
      // get applied filters
      var filterPayload = {type: type};
      for (var key in service.model.selected) {
        if (service.model.selected[key].constructor === Array) {
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

    function saveReport() {}
  };
