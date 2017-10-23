'use strict';

module.exports = /*  @ngInject */
  function filtersService($filter) {
    var paramsNotIncludedInSaveFilter = ['opportunitiesType', 'featureType', 'itemAuthorizationType', 'placementType', 'premises', 'retailer', 'depletionsTimePeriod', 'distributionTimePeriod', 'accountSelected', 'selectedTemplate', 'timePeriod', 'tradeChannels', 'trend', 'defaultSort', 'appliedFilter', 'topBottomSnapshotTypes'];
    var model = {
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
          id: 1,
          type: 'month'
        }, {
          name: 'CYTM',
          displayValue: 'CYTM',
          v3ApiCode: 'CYTM',
          id: 2,
          type: 'month'
        }, {
          name: 'FYTM',
          displayValue: 'FYTM',
          v3ApiCode: 'FYTM',
          id: 3,
          type: 'month'
        }],
        year: [{
          name: 'MTD',
          displayValue: 'MTD',
          v3ApiCode: 'CMIPBDL',
          id: 4,
          type: 'year'
        }, {
          name: 'CYTD',
          displayValue: 'CYTD',
          v3ApiCode: 'CYTDBDL',
          id: 5,
          type: 'year'
        }, {
          name: 'FYTD',
          displayValue: 'FYTD',
          v3ApiCode: 'FYTDBDL',
          id: 6,
          type: 'year'
        }]
      },
      distributionTimePeriod: {
        year: [{
          name: 'L60',
          displayValue: 'L60',
          displayCode: 'L60 Days',
          v3ApiCode: 'L60BDL',
          id: 1,
          type: 'year'
        }, {
          name: 'L90',
          displayValue: 'L90',
          displayCode: 'L90 Days',
          v3ApiCode: 'L90BDL',
          id: 2,
          type: 'year'
        }, {
          name: 'L120',
          displayValue: 'L120',
          displayCode: 'L120 Days',
          v3ApiCode: 'L120BDL',
          id: 3,
          type: 'year'
        }],
        month: [{
          name: 'L03',
          displayValue: 'L03',
          displayCode: 'L03 Mth',
          v3ApiCode: 'L3CM',
          id: 4,
          type: 'month'
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

    var trendPropertyNames = {
      'distributionsSimple': [
        'distributionsSimpleTrend',
        'planDistirbutionSimpleTrend'
      ],
      'distributionsEffective': [
        'distributionsEffectiveTrend',
        'planDistirbutionEffectiveTrend'
      ],
      'depletions': [
        'depletionsTrend',
        'planDepletionTrend'
      ],
      'velocity': [
        'velocityTrend',
        'velocityPlanTrend'
      ]
    };

    var accountFilters = {
      placementType: [{
        name: 'Simple'
      }, {
        name: 'Effective'
      }],
      trend: [{
        name: 'vs YA'
      }, {
        name: 'vs ABP'
      }],
      premiseTypeValue: {
        'ON PREMISE': 'on',
        'OFF PREMISE': 'off',
        'NON RETAIL': 'nonretail',
        'ALL': 'all'
      },
      premiseTypeDisplay: {
        'ON PREMISE': 'ON',
        'OFF PREMISE': 'OFF',
        'NON RETAIL': 'NON-RETAIL'
      },
      accountBrands: [{
        name: 'Distribution (simple)',
        propertyName: 'distributionsSimple',
        depletionTableHeaderText: 'Distribution (simple)',
        value: 1
      }, {
        name: 'Distribution (effective)',
        propertyName: 'distributionsEffective',
        depletionTableHeaderText: 'Distribution (effective)',
        value: 2
      }, {
        name: 'Velocity',
        propertyName: 'velocity',
        depletionTableHeaderText: 'Velocity',
        value: 3
      }],
      accountMarketsEnums: {
        depletions: 1,
        distSimple: 2,
        distEffective: 3,
        velocity: 4
      },
      accountMarkets: [{
        name: 'Depletions',
        propertyName: 'depletions',
        value: 1
      }, {
        name: 'Distribution (simple)',
        propertyName: 'distributionsSimple',
        value: 2
      }, {
        name: 'Distribution (effective)',
        propertyName: 'distributionsEffective',
        value: 3
      }, {
        name: 'Velocity',
        propertyName: 'velocity',
        value: 4
      }],
      valuesVsTrend: [{
        name: 'Top 30 (Values)',
        value: 1
      }, {
        name: 'Top 30 (Trend)',
        value: 2
      }, {
        name: 'Bottom 30 (Values)',
        value: 3
      }, {
        name: 'Bottom 30 (Trend)',
        value: 4
      }],
      accountTypes: [{
        name: 'Distributors',
        value: 1
      }, {
        name: 'Accounts',
        value: 2
      }, {
        name: 'Sub-Accounts',
        value: 3
      }, {
        name: 'Stores',
        value: 4
      }],
      storeTypes: [{
        name: 'Chain'
      }, {
        name: 'Independent'
      }],
      accountBrandEnum: {
        'distirbutionSimple': 1,
        'distirbutionEffective': 2,
        'velocity': 3
      },
      accountMarketsEnum: {
        'depletions': 1,
        'distirbutionSimple': 2,
        'distirbutionEffective': 3,
        'velocity': 4
      },
      topBottomSortTypeEnum: {
        'topValues': 1,
        'topTrends': 2,
        'bottomValues': 3,
        'bottomTrends': 4
      },
      accountTypesEnums: {
        'distributors': 1,
        'accounts': 2,
        'subAccounts': 3,
        'stores': 4
      },
      storeFormats: [
        {
          name: 'All',
          value: '',
          chipValue: 'All Formats'

        },
        {
          name: 'Hispanic',
          value: 'HISPANIC',
          chipValue: 'Hispanic'
        },
        {
          name: 'General Market',
          value: 'GM',
          chipValue: 'General Market'
        }
      ],
      accountTypeValues: {
        Distributors: 'distributors',
        Accounts: 'accounts',
        'Sub-Accounts': 'subAccounts',
        Stores: 'stores'
      }
    };

    var lastEndingTimePeriod = {
      endingPeriodType: 'year',
      depletionValue: model.depletionsTimePeriod.year[2],
      timePeriodValue: model.distributionTimePeriod.year[1]
    };

    var service = {
      model: model,
      addSortFilter: addSortFilter,
      disableFilters: disableFilters,
      getAppliedFilters: getAppliedFilters,
      resetFilters: resetFilters,
      updateSelectedFilterModel: updateSelectedFilterModel,
      checkForAuthorizationFlag: checkForAuthorizationFlag,
      resetSort: resetSort,
      cleanUpSaveFilterObj: cleanUpSaveFilterObj,
      lastEndingTimePeriod: lastEndingTimePeriod,
      accountFilters: accountFilters,
      trendPropertyNames: trendPropertyNames,
      resetPagination: resetPagination,
      depletionsTimePeriodFromName: depletionsTimePeriodFromName,
      depletionsTimePeriodFromV3APICode: depletionsTimePeriodFromV3APICode,
      distributionTimePeriodFromV3APICode: distributionTimePeriodFromV3APICode,
      getNewPaginationState: getNewPaginationState
    };

    return service;

    function addSortFilter(name) {
      const filterExists = $filter('filter')(service.model.appliedFilter.sort.sortArr, {str: name});

      service.model.appliedFilter.pagination.currentPage = 0; // reset pagination offset

      if (filterExists.length) {
        filterExists[0].asc = !filterExists[0].asc;
      } else {
        const defaultAsc = name !== 'opportunity';
        service.model.appliedFilter.sort.sortArr = []; // Comment out this line to sort mulitple fields
        service.model.appliedFilter.sort.sortArr.push({str: name, asc: defaultAsc});
      }
    }

    /**
     * Checks if product type is present. If yes the authorization flag does not need to be reset
     * @params {Object} propertyName - Name of the filter
     * @returns {Boolean}
     */
    function checkForAuthorizationFlag(propertyName) {
      return propertyName === 'productType';
    }

    /**
     * This function converts the query string to appropriate selected model in the filter
     * @params {Object} filterProp - Name of the filter
     */
    function updateSelectedFilterModel(filterModel) {
      for (var property in filterModel) {
        if (filterModel.hasOwnProperty(property)) {
          service.model[property] = filterModel[property];
        }
      }
    }

    function getAppliedFilters(type) {
      // get applied filters
      var filterPayload = {type: type};
      for (var key in service.model.selected) {
        var propVal = service.model.selected[key];
        if (service.model.selected.hasOwnProperty(key) && propVal !== '') {
          if (!Array.isArray(propVal) || propVal.length) {
            filterPayload[key] = service.model.selected[key];
          }
        }
      }
      return filterPayload;
    }

    function disableFilters(filtersAppliedBool, filtersDefaultBool, disableResetBool, disableSaveFilterBool) {
      // these are inverted booleans
      service.model.filtersApplied = filtersAppliedBool;
      service.model.filtersDefault = filtersDefaultBool;
      service.model.disableReset = disableResetBool;
      service.model.disableSaveFilter = disableSaveFilterBool;
    }

    function cleanUpSaveFilterObj(currentFilterObj) {
      // Remove all categories in the model that need be saved
      angular.forEach(paramsNotIncludedInSaveFilter, function(val, index) {
        if (currentFilterObj.hasOwnProperty(val)) {
          delete currentFilterObj[val];
        }
      });

      // Remove all empty and false properties of object
      for (var prop in currentFilterObj) {
        var propVal = currentFilterObj[prop];
        if (currentFilterObj.hasOwnProperty(prop) && propVal !== '' && propVal !== 'false') {
          if (Array.isArray(propVal) && propVal.length === 0) {
            delete currentFilterObj[prop];
          }
        } else {
          delete currentFilterObj[prop];
        }
      }
      return currentFilterObj;
    }

    function resetFilters() {
      service.model.selected = angular.copy(service.model.selectedTemplate);
      resetModel(); // reset view model bindings
      service.model.states = [];
      service.model.filtersApplied = false;
      service.model.filtersDefault = true;
      service.model.filtersValidCount = 0;
    }

    function resetPagination() {
      service.model.appliedFilter.pagination = {
        currentPage: 0,
        totalPages: 0,
        default: true,
        totalOpportunities: 0,
        totalStores: 0,
        roundedStores: 0,
        shouldReloadData: false
      };
    }

    function resetSort() {
      service.model.appliedFilter.sort.sortArr = [];
      service.model.appliedFilter.sort.sortArr.push(
        angular.copy(service.model.defaultSort));
    }

    function resetModel() {
      for (var prop in service.model) {
        if (service.model[prop] && service.model[prop].constructor !== Array && service.model[prop] === true && prop !== 'expanded') {
          service.model[prop] = false;
        }
      }
    }

    function depletionsTimePeriodFromName(name) {
      let flattenPeriods = [...service.model.depletionsTimePeriod.month, ...service.model.depletionsTimePeriod.year];
      let period = flattenPeriods.filter(timePeriod => {
        return timePeriod.name === name;
      });

      return (period && period.length > 0) ? period[0] : null;
    }

    function depletionsTimePeriodFromV3APICode(code) {
      let flattenPeriods = [...service.model.depletionsTimePeriod.month, ...service.model.depletionsTimePeriod.year];
      let period = flattenPeriods.filter(timePeriod => {
        return timePeriod.v3ApiCode === code;
      });

      return (period && period.length > 0) ? period[0] : null;
    }

    function distributionTimePeriodFromV3APICode(code) {
      let flattenPeriods = [...service.model.distributionTimePeriod.month, ...service.model.distributionTimePeriod.year];
      let period = flattenPeriods.filter(timePeriod => {
        return timePeriod.v3ApiCode === code;
      });

      return (period && period.length > 0) ? period[0] : null;
    }

    function getNewPaginationState(paginationState) {
      const _paginationState = Object.assign({}, paginationState);

      _paginationState.totalPages = Math.ceil(_paginationState.totalStores / 20) - 1;

      if (_paginationState.currentPage > _paginationState.totalPages) {
        _paginationState.currentPage = _paginationState.totalPages;
        _paginationState.shouldReloadData = true;
      }

      return _paginationState;
    }
  };
