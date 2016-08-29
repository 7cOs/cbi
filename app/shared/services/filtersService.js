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
      depletionsTimePeriod: [{
        name: 'MTD July 1 - July 31'
      }, {
        name: 'CYTD Jan 1 - July 21'
      }, {
        name: 'FYTD May 1, 2016 - July 21, 2016'
      }],
      distributionTimePeriod: [{
        name: 'L30 Days June 21 - July 21'
      }, {
        name: 'L60 May 21, 2016 - July 21, 2016'
      }, {
        name: 'L90 Days April 22, 2016 - July 21, 2016'
      }],
      selected: {
        myAccountsOnly: true,
        accountBrands: '',
        accountMarkets: '',
        accountTypes: '',
        brands: '',
        cbbdContact: '',
        chains: '',
        currentFilter: '',
        depletionsTimeFilter: 'MTD July 1 - July 31',
        distributionTimeFilter: 'L90 Days April 22, 2016 - July 21, 2016',
        location: '',
        opportunitiesStatus: '',
        opportunitiesTypes: '',
        predictedImpactHigh: '',
        predictedImpactMedium: '',
        predictedImpactLow: '',
        premiseType: 'off',
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
        timePeriod: 'Current Month to Date',
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

    console.log(service.model);

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
