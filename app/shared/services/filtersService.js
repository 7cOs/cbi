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
      brands: [],
      distributors: [],
      expanded: false,
      filtersApplied: true,
      opportunityStatus: [
        {
          name: 'Open',
          value: 'open'
        }, {
          name: 'Targeted',
          value: 'targeted'
        }
      ],
      opportunitiesTypes: [
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
          name: 'Off Premise',
          value: 'off'
        }, {
          name: 'On Premise',
          value: 'on'
        }],
      retailer: [
        {name: 'Store'},
        {name: 'Chain'}
      ],
      selected: {
        myAccountsOnly: true,
        accountBrands: '',
        accountMarkets: '',
        accountTypes: '',
        brands: '',
        cbbdContact: '',
        chains: '',
        currentFilter: '',
        location: '',
        opportunitiesStatus: '',
        opportunitiesTypes: '',
        predictedImpactHigh: '',
        predictedImpactMedium: '',
        predictedImpactLow: '',
        premiseType: '',
        productTypeFeatured: '',
        productTypePriority: '',
        productTypeAuthorized: '',
        stores: '',
        retailer: '',
        storeSegmentationA: '',
        storeSegmentationB: '',
        storeSegmentationC: '',
        storeTypeCBBD: '',
        storeTypeIndependent: '',
        timePeriod: '',
        tradeChannelConvenience: '',
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
        {name: 'Current Month to Date'},
        {name: 'Last Closed Month'}
      ],
      trend: [
        {name: 'vs YA'},
        {name: 'va Plan'}
      ]
    };

    var service = {
      model: model,
      getAppliedFilters: getAppliedFilters
    };

    return service;

    function getAppliedFilters(type) {
      // get applied filters
      var filterPayload = {type: type};
      for (var key in service.model.selected) {
        /* if (service.model.selected[key].constructor === Array) {
          // to do for brands, stores, chains
        } else */if (service.model.selected[key] !== '') {
          filterPayload[key] = service.model.selected[key];
        }
      }

      return filterPayload;
    }
  };
