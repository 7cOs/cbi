'use strict';

module.exports = /*  @ngInject */
  function chipsService($filter, $state, $q, loaderService, filtersService, opportunitiesService, targetListService) {

    var chipsTemplate = [
      {
        'name': 'My Accounts Only',
        'type': 'myAccountsOnly',
        'applied': false,
        'removable': false
      },
      {
        'name': 'Off-Premise',
        'type': 'premiseType',
        'applied': false,
        'removable': false
      },
      {
        'name': 'All Types',
        'type': 'opportunityType',
        'applied': false,
        'removable': false
      }
    ];
    var filterToChipModel = {
      'premiseType': {
        'on': {
          'name': 'On-Premise',
          'type': 'premiseType',
          'applied': false,
          'removable': false
        },
        'off': {
          'name': 'Off-Premise',
          'type': 'premiseType',
          'applied': false,
          'removable': false
        }
      },
      'myAccountsOnly': {
        'name': 'My Accounts Only',
        'type': 'myAccountsOnly',
        'applied': false,
        'removable': false
      },
      'opportunityStatus': {
        'open': {
          'name': 'Open',
          'type': 'opportunityStatus',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': false
        },
        'targeted': {
          'name': 'Targeted',
          'type': 'opportunityStatus',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': false
        }
      },
      'opportunityType': {
        'ALL_TYPES': {
          'name': 'All Types',
          'type': 'opportunityType',
          'applied': false,
          'removable': false
        },
        'NON_BUY': {
          'name': 'Non-Buy',
          'type': 'opportunityType',
          'applied': false,
          'removable': true
        },
        'AT_RISK': {
          'name': 'At Risk',
          'type': 'opportunityType',
          'applied': false,
          'removable': true
        },
        'LOW_VELOCITY': {
          'name': 'Low Velocity',
          'type': 'opportunityType',
          'applied': false,
          'removable': true
        },
        'MANUAL': {
          'name': 'Manual',
          'type': 'opportunityType',
          'applied': false,
          'removable': true
        },
        'NEW_PLACEMENT_NO_REBUY': {
          'name': 'New Placement (No Rebuy)',
          'type': 'opportunityType',
          'applied': false,
          'removable': true
        },
        'NEW_PLACEMENT_QUALITY': {
          'name': 'New Placement (Quality)',
          'type': 'opportunityType',
          'applied': false,
          'removable': true
        }
      },
      'impact': {
        'H': {
          'name': 'High Impact',
          'type': 'impact',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': false
        },
        'M': {
          'name': 'Medium Impact',
          'type': 'impact',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': false
        },
        'L': {
          'name': 'Low Impact',
          'type': 'impact',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': false
        }
      },
      'segmentation': {
        'A': {
          'name': 'Segment A',
          'type': 'segmentation',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': false
        },
        'B': {
          'name': 'Segment B',
          'type': 'segmentation',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': false
        },
        'C': {
          'name': 'Segment C',
          'type': 'segmentation',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': false
        }
      },
      'tradeChannel': {
        '07': {
          'name': 'Convenience',
          'type': 'tradeChannel',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': true
        },
        '02': {
          'name': 'Liquor',
          'type': 'tradeChannel',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': true
        },
        '05': {
          'name': 'Grocery',
          'type': 'tradeChannel',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': true
        },
        '53': {
          'name': 'Recreation',
          'type': 'tradeChannel',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': true
        },
        '57': {
          'name': 'Military, on-premise',
          'type': 'tradeChannel',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': true
        },
        'MF': {
          'name': 'Military, off-premise',
          'type': 'tradeChannel',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': true
        },
        '08': {
          'name': 'Mass Merchandiser',
          'type': 'tradeChannel',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': true
        },
        '03': {
          'name': 'Drug',
          'type': 'tradeChannel',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': true
        },
        '50': {
          'name': 'Dining',
          'type': 'tradeChannel',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': true
        },
        '54': {
          'name': 'Transportation',
          'type': 'tradeChannel',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': true
        },
        '51': {
          'name': 'Bar/Nightclub',
          'type': 'tradeChannel',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': true
        },
        '52': {
          'name': 'Lodging',
          'type': 'tradeChannel',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': true
        },
        '': {
          'name': 'Other',
          'type': 'tradeChannel',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': true
        }
      },
      'productType': {
        'featured': {
          'name': 'Featured',
          'type': 'productType',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': false
        },
        'priority': {
          'name': 'Priority Packages',
          'type': 'productType',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': false
        },
        'authorized': {
          'name': 'Authorized',
          'type': 'productType',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': false
        }
      },
      'state': {
        'chip': {
          'name': 'CO',
          'type': 'state',
          'applied': false,
          'removable': true
        },
        set: function(val) {
          this.chip.name = val.toUpperCase();
        }
      },
      'city': {
        'chip': {
          'name': 'Denver',
          'type': 'city',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': false
        },
        set: function(val) {
          this.chip.name = val;
        }
      },
      'zipCode': {
        'chip': {
          'name': '80203',
          'type': 'zipCode',
          'search': true,
          'applied': false,
          'removable': true,
          'tradeChannel': false
        },
        set: function(val) {
          this.chip.name = val;
        }
      }
    };
    var model = [];

    // Enums for filter types
    var filterTypeEnum = {
      booleanFilter: 1,
      multiValuedFilter: 2,
      textFilter: 3,
      idBasedFilters: 4
    };

    // All filters which have values seperated by '|' are added to this array
    var multiValuedFilters =
    ['opportunityType', 'premiseType', 'impact', 'opportunityStatus', 'segmentation', 'productType', 'tradeChannel'];

    // All filters which have a chip model and just need the name property in the chip replaced are placed here
    var textSearchFilters = ['state', 'city', 'zipCode'];

    var service = {
      model: model,
      addAutocompleteChip: addAutocompleteChip,
      addChip: addChip,
      removeChip: removeChip,
      applyFilters: applyFilters,
      removeFromFilterService: removeFromFilterService,
      updateChip: updateChip,
      resetChipsFilters: resetChipsFilters,
      applyFilterArr: applyFilterArr,
      applyFilterMulti: applyFilterMulti,
      applyStatesFilter: applyStatesFilter,
      getTypeOfFilter: getTypeOfFilter,
      addChipsArray: addChipsArray,
      filterTypeEnum: filterTypeEnum,
      getChipsAssociatedWithFilter: getChipsAssociatedWithFilter,
      checkForOpportunityTypeFilter: checkForOpportunityTypeFilter,
      getDefaultOpportunityTypeFilter: getDefaultOpportunityTypeFilter,
      filterToChipModel: filterToChipModel,
      isDefault: isDefault
    };

    return service;

    /**
     * @name addAutocompleteChip
     * @desc add autocomplete chip to model
     * @params {Object} chip - chip object to be added
     * @params {String} filter - name of property in filter model
     * @params {Boolean} tradeChannel - if is specific to a tradeChannel [optional]
     * @returns null
     * @memberOf cf.common.services
     */
    function addAutocompleteChip(chip, filter, tradeChannel, id) {
      if (chip) {
        // Add to Chip Model
        if (id && id.length < 5) filter === 'brand';
        var tempChip = {
          name: chip,
          id: id,
          type: filter,
          search: true,
          applied: false,
          removable: true,
          tradeChannel: tradeChannel || false
        };
        if ($filter('filter')(service.model, {name: tempChip.name}, true).length !== 1 && $filter('filter')(service.model, {id: tempChip.id}, true).length !== 1) {
          service.model.push(tempChip);
        }

        filtersService.disableFilters(false, false, true, true);

        // Empty Input
        if (filter) filtersService.model[filter] = '';
      }
    }

    /**
     * @name addChip
     * @desc add Chip to model
     * @params {Object} chip - chip object to be added
     * @params {String} type - type of chip
     * @params {Boolean} onlyOneAllowed - if only type is allowed
     * @returns null
     * @memberOf cf.common.services
     */
    function addChip(chip, type, onlyOneAllowed, removable) {
      if (chip) {
        if (onlyOneAllowed) removeChip(type);
        if (removable === undefined) removable = true;
        service.model.push({
          name: chip,
          type: type,
          applied: false,
          removable: removable
        });
        filtersService.disableFilters(false, false, true, false);
      }
    }

    function addChipsArray(chipsCollection) {
      service.model = [];
      angular.forEach(chipsCollection, function (val, key) {
        service.model.push(val);
      });
    }

    function applyFilters() {
      var isTargetList = false;
      filtersService.resetSort();
      if ($state.current.name === 'target-list-detail') isTargetList = true;

      loaderService.openLoader(true);

      if (!isTargetList) {
        $q.all([opportunitiesService.getOpportunities(), opportunitiesService.getOpportunitiesHeaders()]).then(function(data) {
          loaderService.closeLoader();
          finishGet(data[0]);
        }, function(reason) {
          console.log('Error: ' + reason);
          loaderService.closeLoader();
        });
      } else if (isTargetList) {
        targetListService.getTargetListOpportunities(targetListService.model.currentList.id, {type: 'opportunities'}).then(function(data) {
          loaderService.closeLoader();
          finishGet(data);
        }, function(reason) {
          console.log('Error: ' + reason);
          loaderService.closeLoader();
        });
      }

      function finishGet(data) {
        for (var i = 0; i < service.model.length; i++) {
          service.model[i].applied = true;
        }
        opportunitiesService.model.filterApplied = true;
        filtersService.disableFilters(true, false, true, true);
      }
    }

    // Filter model to Chips model functionality
    /**
     * Check if the current filter is of type 'opportunityType'
     * @param {String} propName Name of the filter
     * @returns {Boolean} Returns true or false
     */

    function checkForOpportunityTypeFilter(propName) {
      return propName === 'opportunityType';
    }

    /**
     * Check if the current filter is a Boolean filter ex accountOnly
     * @param {String} filterName Name of the filter
     * @param {String} filterValue Value of the filter sent from the query string
     * @returns {Boolean} Returns true or false
     */
    function isBooleanFilter(filterName, filterValue) {
      return filterValue === 'true' ||  filterValue === 'false';
    }

    /**
     * This function returns a chip object if the value of the boolean filter is true
     * @param {String} filterName Name of the filter
     * @param {String} filterValue Value of the filter sent from the query string
     * @returns {Object} Returns a chip object for the filter
     */
    function returnChipForBooleanFilter(filterName, filterValue) {
      var chip = null;
      if (isPropertyInObject(filterToChipModel, filterName) && filterValue === 'true') {
        chip = angular.copy(filterToChipModel[filterName]);
      }
      return chip;
    }

    /**
     * This function checks if the filtervalues are seperated by '|'. Check multiValuedFilters array for filters under this category
     * @param {String} filterName Name of the filter
     * @returns {Boolean} Returns true or false
     */
    function isMultipleValuedFilter(filterName) {
      return multiValuedFilters.indexOf(filterName) !== -1 && isPropertyInObject(filterToChipModel, filterName);
    }

    /**
     * This function returns chips objects for all the values seperated by |
     * @param {String} filterName Name of the filter
     * @param {String} filterValue Value of the filter sent from the query string
     * @returns {Object} Returns a chip object for the filter
     */
    function returnChipForMultipleValuedFilter(filterName, filterValue) {
      var chips = [];
      var arrFilterValues = filterValue.split('|');
      angular.forEach(arrFilterValues, function(val, key) {
        if (isPropertyInObject(filterToChipModel[filterName], val)) {
          chips.push(angular.copy(filterToChipModel[filterName][val]));
        }
      });
      return chips;
    }

    /**
     *  Check textSearchFilter array for filters under this category. These filters just have their name replaced in the the matching chip in filterToChipModel
     * @param {String} filterName Name of the filter
     * @param {String} filterValue Value of the filter sent from the query string
     * @returns {Object} Returns a chip object for the filter
     */
    function isTextSearchFilter(filterName) {
      return textSearchFilters.indexOf(filterName) !== -1 && isPropertyInObject(filterToChipModel, filterName);
    }

    /**
     * This function returns a chip object for filters in
     * @param {String} filterName Name of the filter
     * @param {String} filterValue Value of the filter sent from the query string
     * @returns {Object} Returns a chip object for the filter
     */
    function returnChipForTextSearchFilter(filterName, filterValue) {
      var chips = [];
      var arrFilterValues = filterValue.split('|');
      angular.forEach(arrFilterValues, function(val, key) {
        filterToChipModel[filterName].set(val);
        chips.push(angular.copy(filterToChipModel[filterName].chip));
      });
      return chips;
    }

    /**
     * Identifies the type of Filter. filterTypeEnum has hardcoded values for specific filter types
     * @param {String} filterName Name of the filter
     * @param {String} filterValue Value of the filter sent from the query string
     * @returns {Object} Returns a value indicating the type of filter.
     */
    function getTypeOfFilter(filterName, filterValue) {
      if (isBooleanFilter(filterName, filterValue)) {
        return filterTypeEnum.booleanFilter;
      } else if (isMultipleValuedFilter(filterName)) {
        return filterTypeEnum.multiValuedFilter;
      } else if (isTextSearchFilter(filterName)) {
        return filterTypeEnum.textFilter;
      } else {
        return filterTypeEnum.idBasedFilters;
      }
    }

    /**
     * This function returns the matching chip for the filter 'All Types'
     * @returns {Object} Returns the chip for opportunity type 'All Types'
     */
    function getDefaultOpportunityTypeFilter() {
      return angular.copy(filterToChipModel.opportunityType.ALL_TYPES);
    }

    /**
     * Given a filter property. This function takes care of identifying the filter type and returning the matching chip if found
     * @returns {Array} matchedChips An array of muliple chips or one chip matching the filter property
     */
    function getChipsAssociatedWithFilter(filterProp) {
      var matchedChips = [];
      var filterType = getTypeOfFilter(filterProp[0], filterProp[1]);

      switch (filterType) {
        case filterTypeEnum.booleanFilter:
          var chipObj = returnChipForBooleanFilter(filterProp[0], filterProp[1]);
          if (chipObj) {
            matchedChips.push(chipObj);
          }
          break;
        case filterTypeEnum.multiValuedFilter:
          matchedChips = returnChipForMultipleValuedFilter(filterProp[0], filterProp[1]);
          break;
        case filterTypeEnum.textFilter:
          matchedChips = returnChipForTextSearchFilter(filterProp[0], filterProp[1]);
          break;
        case filterTypeEnum.idBasedFilters:
        // TODO all filters that require an api call are implemented here
          break;
      }
      return matchedChips;
    }

    /** TODO We need to create a Utility service for these functions
     * @desc Function returns true if property exists inside the object
     * @params {Array} filterArr - Array containing filters and their values
     * @returns {Boolean}
     */
    function isPropertyInObject(obj, propertyName) {
      return obj.hasOwnProperty(propertyName);
    }
    // End of chips functionality

    /**
     * @name removeChip
     * @desc remove chip from model
     * @params {String} type - type of chip [type is only used to remove if onlyOneAllowed === true]
     * @returns null
     * @memberOf cf.common.services
     * @private
     */
    function removeChip(type) {
      console.log(service.model);
      var i = service.model.length;
      while (i--) {
        if (service.model[i].type === type) {
          service.model.splice(i, 1);
        }
      }

      filtersService.disableFilters(false, false, true, false);
    }

    /**
     * @name removeFromFilterService
     * @desc remove the selected chip from the filter service model on click of x in chip
     * @params {Object} chip - Specific chip from model to be removed
     * @params {String} displayName - display name of chip
     * @returns null
     * @memberOf cf.common.services
     */
    function removeFromFilterService(chip) {

      if (chip.search || chip.type === 'opportunityType' || chip.type === 'state') {
        var arr = filtersService.model.selected[chip.type];
        var i = arr.length;

        while (i--) {
          if (chip.type === 'segmentation' && arr[i] === chip.name.split(' Segmentation')[0]) {
            arr.splice(i, 1);
            filtersService.model['storeSegmentation' + chip.name.split(' Segmentation')[0]] = false;
            break;
          } else if (chip.type === 'impact' && arr[i] === chip.name.split(' Impact')[0]) {
            arr.splice(i, 1);
            // update model
            filtersService.model['predictedImpact' + chip.name.split(' Impact')[0]] = false;
            break;
          } else if ((chip.type === 'masterSKU' || chip.type === 'brand') && chip.id === arr[i]) {
            arr.splice(i, 1);
            break;
          } else if ($filter('titlecase')(arr[i]) === chip.name.split(' ')[0]) {
            arr.splice(i, 1);

            // update model
            if (chip.type === 'productType') filtersService.model['productType' + chip.name.split(' ')[0]] = false;
            if (chip.type === 'tradeChannel') filtersService.model['tradeChannel' + chip.name] = false;
            if (chip.type === 'opportunityStatus') filtersService.model['opportunityStatus' + chip.name] = false;
            if (chip.type === 'cbbdChain') filtersService.model['cbbdChain' + chip.name.split(' ')[0]] = false;
            break;
          } else if (chip.type === 'distributor' || chip.type === 'account' || chip.type === 'subaccount' || chip.type === 'store' || chip.type === 'contact') {
            var index = arr.indexOf(chip.id);
            arr.splice(index, 1);
            if (chip.type !== 'contact') filtersService.model.filtersValidCount--;
            break;
          } else if (chip.type === 'opportunityType') {
            index = arr.indexOf(chip.name);
            arr.splice(index, 1);
            if (arr.length === 0) {
              addChip('All Types', 'opportunityType', false, false);
              filtersService.model.selected.opportunityType = ['All Types'];
              filtersService.model.opportunityType = ['All Types'];
            }
            break;
          } else if (chip.type === 'state') {
            index = arr.indexOf(chip.name);
            arr.splice(index, 1);
            filtersService.model.states.splice(index, 1);
            break;
          };
        }
      } else if (typeof chip.type === 'string') {
        filtersService.model.selected[chip.type] = '';
      } else if (typeof chip.type === 'boolean') {
        filtersService.model.selected[chip.type] = false;
      }

      if (service.model.length === 4 && isDefault(service.model)) {
        filtersService.disableFilters(false, false, false, false);
      } else {
        filtersService.disableFilters(false, false, true, false);
      }
    }

    /**
     * @name isDefault
     * @desc check to see if filters are at the default values
     * @params {Object} service.model
     * @returns boolean
     * @memberOf cf.common.services
     */

    function isDefault(model) {
      var checkForDefaultFilters = false,
          count = 0;

      for (var j = 0; j < service.model.length; j++) {

        if (service.model[j].name === 'My Accounts Only' || service.model[j].name === 'Off-Premise' ||  service.model[j].name === 'Authorized' ||  service.model[j].name === 'All Types') {
          count++;
        }

        if (count === 4) {
          checkForDefaultFilters = true;
        };
      }
      return checkForDefaultFilters;
    }

    /**
     * @name updateChip
     * @desc add or remove chip from model when selected
     * @params {String} chipType - chip type
     * @params {String} displayName - display name of chip
     * @returns null
     * @memberOf cf.common.services
     */
    function updateChip(chipType, displayName) {
      filtersService.model.selected[chipType] === true ? removeChip(chipType) : addChip(displayName, chipType, true);
    }

    function resetChipsFilters(chips) {
      filtersService.resetFilters();
      angular.copy(chipsTemplate, service.model);
    }

    /**
     * @name applyFilterArr
     * @desc takes Object and creates chips and adds the info to the provided model, intented for inline-search
     * @params {Array} model - filters model to recieve result
     * @params {Object} result - selected search result
     * @params {String} filter - the relevant filter
     * @returns null
     * @memberOf cf.common.services
     */

    function applyFilterArr(model, result, filter, displayName) {
      //  fall back to result if displayName is undefined
      if (!displayName) {
        if (result.brand) {
          displayName = result.brand;
        } else if (result.name) {
          displayName = result.name;
        } else {
          displayName = result;
        }
      }
      if (displayName !== 'CBBD Chain') {
        displayName = $filter('titlecase')(displayName);
      }

      if (model.indexOf(result) > -1) {
        // deleting
        var index = service.model.map(function(e) { return e.name; }).indexOf(displayName);
        service.model.splice(index, 1);
        model.splice(model.indexOf(result), 1);
      } else {
        // adding
        switch (filter) {
          case 'subaccount':
          case 'account':
          case 'distributor':
          case 'store':
            addAutocompleteChip(displayName, filter, null, result.id);
            if (service.model.indexOf(result.id) === -1) model.push(result.id);
            filtersService.model.chain = '';
            filtersService.model.store = '';
            filtersService.model.filtersValidCount++;
            break;
          case 'contact':
            addAutocompleteChip(displayName, filter, null, result.employeeId);
            if (service.model.indexOf(result.id) === -1) model.push(result.id);
            break;
          case 'masterSKU':
            if (result.id === null) {
              addAutocompleteChip($filter('titlecase')(result.brand), 'brand', null, result.brandCode);
              if (filtersService.model.selected.brand.indexOf(result.brandCode) === -1) filtersService.model.selected.brand.push(result.brandCode);
            } else if (result.id !== null) {
              addAutocompleteChip($filter('titlecase')(result.name), filter, null, result.id);
              if (service.model.indexOf(result.id) === -1) model.push(result.id);
            }
            break;
          case 'tradeChannel':
            addAutocompleteChip(displayName, filter, true);
            if (service.model.indexOf(result) === -1) model.push(result);
            break;
          default:
            addAutocompleteChip(displayName, filter);
            if (service.model.indexOf(result) === -1) model.push(result);
        }
      }
      filtersService.model[filter] = '';
      filtersService.disableFilters(false, false, true, false);
    }

    /**
     * @name applyFilterMulti
     * @desc takes array and creates chips and adds the info to the provided model, intended for multi-selects
     * @params {Array} model - filters model to recieve result
     * @params {Array} result - array of filters to be applied
     * @params {String} filter - the relevant filter
     * @returns null
     * @memberOf cf.common.services
     */

    function applyFilterMulti(model, result, filter) {
      removeChip('opportunityType');
      if (result.length === 0 || (result.length <= 1 && result[0] === 'All Types')) {
        addChip('All Types', 'opportunityType', false, false);
        filtersService.model.selected[filter] = ['All Types'];
        filtersService.model.opportunityType = ['All Types'];
      } else {
        var results = [];
        angular.forEach(result, function(value, key) {
          if (value === 'All Types') {
          } else {
            addChip(value, 'opportunityType', false);
            results.push(value);
          }
        });
        filtersService.model.selected[filter] = results;
        filtersService.disableFilters(false, false, true, false);
      }
    }

    /**
     * @name applyStatesFilter
     * @desc takes array and creates chips and adds the info to the provided model, intended for multi-selects
     * @params {Array} model - filters model to recieve result
     * @params {Array} result - array of filters to be applied
     * @returns null
     * @memberOf cf.common.services
     */

    function applyStatesFilter(model, result, filter) {

      angular.forEach(result, function(value, key) {
        var matched = false;

        for (var i = 0; i < service.model.length; i++) {

          if (value === service.model[i].name) {
            matched = true;
          }
        }

        if (matched === false) {
          addChip(value, 'state', false);
          filtersService.model.selected[filter].push(value);
        }
      });
      filtersService.disableFilters(false, false, true, false);
    }
  };
