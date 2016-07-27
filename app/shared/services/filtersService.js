'use strict';

module.exports =
  function filtersService(opportunitiesService, productsService, distributorsService) {

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
        {name: 'On Premise'},
        {name: 'Off Premise'}
      ],
      selected: {
        accountScope: false,
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
        tradeChannelRecreation: ''
      },
      timePeriod: [
        {name: 'Current Month to Date'},
        {name: 'Last Closed Month'}
      ]
    };

    distributorsService.getDistributors().then(function(data) {
      model.distributors = data.distributors;
    });

    productsService.getProducts().then(function(data) {
      model.brands = data.products;
    });

    return {
      model: model
    };

  };
