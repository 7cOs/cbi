'use strict';

module.exports =
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
      opportunitiesStatus: [
        {name: 'Open'},
        {name: 'Targeted'}
      ],
      opportunitiesTypes: [
        {name: 'All Types'},
        {name: 'Non-buy'},
        {name: 'At Risk'},
        {name: 'Low Velocity'},
        {name: 'New Placement (Quality)'},
        {name: 'New Placement (No Rebuy)'},
        {name: 'Manual'}
      ],
      savedFilters: [
        {name: 'Wine Shops'},
        {name: 'Costco No Buy'},
        {name: 'Circle K - Fremont'}
      ],
      placementType: [
        {name: 'Simple'},
        {name: 'Effective'}
      ],
      premises: [
        {name: 'Off Premise'},
        {name: 'On Premise'}
      ],
      selected: {
        accountScope: false,
        accountBrands: '',
        accountMarkets: '',
        accountTypes: '',
        cbbdContact: '',
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
        storeSegmentationA: '',
        storeSegmentationB: '',
        storeSegmentationC: '',
        storeTypeCBBD: '',
        storeTypeIndependent: '',
        tradeChannelConvenience: '',
        tradeChannelDrug: '',
        tradeChannelGrocery: '',
        tradeChannelLiquor: '',
        tradeChannelMassMerchandiser: '',
        tradeChannelMilitary: '',
        tradeChannelOther: '',
        tradeChannelRecreation: '',
        valuesVsTrend: ''
      },
      timePeriod: [
        {name: 'Current Month to Date'},
        {name: 'Last Closed Month'}
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
      for (var key in model.selected) {
        if (model.selected[key] !== '') {
          filterPayload[key] = model.selected[key];
        }
      }

      return filterPayload;
    }
  };
