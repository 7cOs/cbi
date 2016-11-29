'use strict';

module.exports = /*  @ngInject */
  function filtersService($filter) {
    var paramsNotIncludedInSaveFilter = ['opportunityType', 'opportunitiesType', 'placementType', 'premises', 'retailer', 'depletionsTimePeriod', 'distributionTimePeriod', 'accountSelected', 'selectedTemplate', 'timePeriod', 'tradeChannels', 'trend', 'defaultSort', 'appliedFilter', 'topBottomSnapshotTypes'];
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
          hintText: 'Name, Address, TDLinx, or Store#'
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
          {label: 'Other', name: 'Other Trade Channel'}
        ],
        off: [
          {label: 'Grocery', name: 'Grocery', value: '05'},
          {label: 'Convenience', name: 'Convenience', value: '07'},
          {label: 'Drug', name: 'Drug', value: '03'},
          {label: 'Mass Merchandiser', name: 'Mass Merchandiser', value: '08'},
          {label: 'Liquor', name: 'Liquor', value: '02'},
          {label: 'Military', name: 'Military', value: 'MF'},
          {label: 'Recreation', name: 'Recreation', value: '53'},
          {label: 'Other', name: 'Other Trade Channel'}
        ]
      },
      trend: [
        {
          name: 'vs YA',
          value: 1
        },
        {
          name: 'vs ABP',
          value: 2
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
      premises: [{
        name: 'All'
      }, {
        name: 'Off-Premise'
      }, {
        name: 'On-Premise'
      }],
      accountBrands: [{
        name: 'Distribution (simple)',
        depletionTableHeaderText: 'Distribution(s)',
        value: 1
      }, {
        name: 'Distribution (effective)',
        depletionTableHeaderText: 'Distribution(e)',
        value: 2
      }, {
        name: 'Velocity',
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
        name: 'Top 10 (Values)',
        value: 1
      }, {
        name: 'Top 10 (Trend)',
        value: 2
      }, {
        name: 'Bottom 10 (Values)',
        value: 3
      }, {
        name: 'Bottom 10 (Trend)',
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
      topBottomSortTypeEnum: {
        'topValues': 1,
        'topTrends': 2,
        'bottomValues': 3,
        'bottomTrends': 4
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
      getFilteredTopBottomData: getFilteredTopBottomData,
      getTopBottomDataSorted: getTopBottomDataSorted
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
          if (Array.isArray(propVal)) {
            if (propVal.length !== 0) {
              filterPayload[key] = service.model.selected[key];
            }
          } else {
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

    function getTopBottomDataSorted(topBottomData, planType, categoryType) {
      var sortedList = {
            topValues: [],
            bottomValues: [],
            topTrends: [],
            bottomTrends: []
          }, queryLimit = 10, valuesArr, trendsArr;
      valuesArr = $filter('orderBy')(topBottomData, categoryType.propertyName);
      var len = valuesArr.length;
      if (len > queryLimit) {
        sortedList.topValues = valuesArr.splice(0, queryLimit - 1);
        sortedList.bottomValues = valuesArr.splice(len - queryLimit, len - 1);
      } else {
        sortedList.topValues = valuesArr;
        sortedList.bottomValues = valuesArr;
      }
      trendsArr = $filter('orderBy')(topBottomData, trendPropertyNames[categoryType.propertyName][planType.value - 1]);
      if (len > queryLimit) {
        sortedList.topTrends = valuesArr.splice(0, queryLimit - 1);
        sortedList.topTrends = valuesArr.splice(len - queryLimit, len - 1);
      } else {
        sortedList.topTrends = trendsArr;
        sortedList.topTrends = trendsArr;
      }
    }

    /**
      * Gets an array of data matching the distirubution or depletion time period
      * @param {Object} topBottomData Package or Brand
      * @param {String} categoryType depletions or Distribution
      * @param {String} depletionOption L90, L120 etc
      * @returns {Object} currentTrendVal Returns the trend display value as string and the actual float value
      */
    function getFilteredTopBottomData(topBottomData, categoryType, depletionOption, distirbutionOption) {
      console.log('FilteredData', topBottomData, categoryType, distirbutionOption, depletionOption);
      var data, filteredData = [], matchedMeasure = null;
      switch (categoryType.value) {
        case accountFilters.accountMarketsEnums.depletions:
          for (var i = 0, len = topBottomData.length; i < len; i++) {
            data = topBottomData[i];
            matchedMeasure = data.measures.filter(function (measure) {
              return measure.timeframe === depletionOption.name;
            });
            if (matchedMeasure[0]) {
              var depletionObj = {
                name: data.name,
                type: data.type,
                measure: matchedMeasure[0]
              };
              filteredData.push(depletionObj);
            }
          }
          break;
        default:
          for (var j = 0, length = topBottomData.length; j < length; j++) {
            data = topBottomData[i];
            matchedMeasure = data.measures.filter(function (measure) {
              return measure.timeframe === distirbutionOption.name;
            });
            if (matchedMeasure[0]) {
              var distirbutionObj = {
                name: data.name,
                type: data.type,
                measure: matchedMeasure[0]
              };
              filteredData.push(distirbutionObj);
            }
          }
          break;
      }
      var copyTest = angular.copy(filteredData);
      filteredData = filteredData.concat(copyTest);
      filteredData = filteredData.concat(copyTest);
      return filteredData;
    }
  };
