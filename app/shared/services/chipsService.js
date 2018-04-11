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
        'name': 'All Opportunity Types',
        'type': 'opportunityType',
        'applied': false,
        'removable': false
      },
      {
        name: 'All Formats',
        type: 'storeFormat',
        applied: false,
        removable: false
      }
    ];
    var model = [];

    var defaultFilterArrayLength = 3;

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
      addChipsArray: addChipsArray,
      isDefault: isDefault,
      removeTopBottomChips: removeTopBottomChips
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
        if (id && id.length < 5) filter = 'brand';
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
        if (service.model.length === defaultFilterArrayLength && isDefault(service.model)) {
          filtersService.disableFilters(false, false, false, false);
        } else {
          filtersService.disableFilters(false, false, true, false);
        }
      }
    }

    function addChipsArray(chipsCollection) {
      service.model = [];
      angular.forEach(chipsCollection, function (val, key) {
        service.model.push(val);
      });
    }

    function applyFilters(isTargetList) {
      isTargetList = isTargetList || $state.current.name === 'target-list-detail';
      filtersService.resetSort();
      filtersService.model.appliedFilter.pagination.currentPage = 0;
      loaderService.openLoader(true);

      if (isTargetList) {
        targetListService.getAndUpdateTargetListStoresWithOpportunities(targetListService.model.currentList.id, {type: 'targetListOpportunities'}).then(function(data) {
          loaderService.closeLoader();
          finishGet(data);
        }, reason => {
          console.log('Error: ' + reason);
          loaderService.closeLoader();
        });
      } else {
        $q.all([opportunitiesService.getAndUpdateStoresWithOpportunities(), opportunitiesService.getOpportunitiesHeaders()]).then(function(data) {
          loaderService.closeLoader();
          finishGet(data[0]);
        }, reason => {
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

    /**
     * @name removeChip
     * @desc remove chip from model
     * @params {String} type - type of chip [type is only used to remove if onlyOneAllowed === true]
     * @returns null
     * @memberOf cf.common.services
     * @private
     */
    function removeChip(type) {
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
      if (chip.type === 'myAccountsOnly') {
        filtersService.model.selected['myAccountsOnly'] = false;
      } else if (chip.type === 'simpleDistributionType') {
        filtersService.model.selected['simpleDistributionType'] = false;
      } else if (chip.type === 'storeFormat') {
        addChip('All Formats', 'storeFormat', true, false);
        filtersService.model.selected.storeFormat = '';
      } else {
        var arr = filtersService.model.selected[chip.type];
        var i = arr.length;
        while (i--) {
          if (chip.type === 'segmentation' && arr[i] === chip.name.split('Segment ')[1]) {
            arr.splice(i, 1);
            filtersService.model['storeSegmentation' + chip.name.split('Segment ')[1]] = false;
            break;
          } else if (chip.type === 'impact' && arr[i] === chip.name.split(' Impact')[0]) {
            arr.splice(i, 1);
            filtersService.model['predictedImpact' + chip.name.split(' Impact')[0]] = false;
            break;
          } else if (chip.type === 'salesStatus' && arr[i] === chip.name.split(' ')[0]) {
            arr.splice(i, 1);
            filtersService.model['salesStatus' + chip.name.split(' ')[0]] = false;
            break;
          } else if (chip.type === 'cbbdChain' && arr[i] === $filter('titlecase')(chip.name.split(' ')[0])) {
            arr.splice(i, 1);
            filtersService.model['cbbdChain' + $filter('titlecase')(chip.name.split(' ')[0])] = false;
            break;
          } else if (chip.type === 'opportunityStatus' && $filter('titlecase')(arr[i]) === chip.name) {
            arr.splice(i, 1);
            filtersService.model['opportunityStatus' + chip.name] = false;
            break;
          } else if (chip.type === 'tradeChannel' && $filter('titlecase')(arr[i]) === chip.name) {
            arr.splice(i, 1);
            filtersService.model['tradeChannel' + chip.name] = false;
            break;
          } else if (chip.type === 'priorityPackage' && arr[i].toUpperCase() === chip.name.toUpperCase()) {
            arr.splice(i, 1);
            filtersService.model['priorityPackage' + chip.name] = false;
            break;
          } else if (chip.type === 'city' && arr[i] === chip.name.toUpperCase()) {
            arr.splice(i, 1);
            break;
           } else if (chip.type === 'zipCode' && arr[i] === chip.name) {
            arr.splice(i, 1);
            break;
          } else if (chip.type === 'distributor' || chip.type === 'account' || chip.type === 'subaccount' || chip.type === 'store' ||
              chip.type === 'contact' || chip.type === 'masterSKU' || chip.type === 'brand') {
            // handle duplicate values for these fields, which may have been stored in a saved report
            var unique = arr.filter(function(elem, index, self) {
              return index === self.indexOf(elem);
            });
            var index = unique.indexOf(chip.id);
            unique.splice(index, 1);
            filtersService.model.selected[chip.type] = unique;
            if (chip.type !== 'contact' && chip.type !== 'brand' && chip.type !== 'masterSKU') {
              filtersService.model.filtersValidCount--;
            }
            break;
          } else if (chip.type === 'opportunityType') {
            index = arr.indexOf(chip.name);
            arr.splice(index, 1);
            if (arr.length === 0) {
              if (filtersService.model.selected.simpleDistributionType) {
                addChip('Non-Buy', 'opportunityType', false, false);
                filtersService.model.selected.opportunityType = ['Non-Buy'];
              } else {
                addChip('All Opportunity Types', 'opportunityType', false, false);
                filtersService.model.selected.opportunityType = ['All Types'];
              }
            }
            break;
          } else if (chip.type === 'state') {
            index = arr.indexOf(chip.name);
            arr.splice(index, 1);
            filtersService.model.states.splice(index, 1);
            break;
          } else if (chip.type === 'featureType') {
            if (chip.name === 'All Feature Product Types') {
              filtersService.model.selected.featureType = [];
            } else {
              index = arr.indexOf(chip.name);
              arr.splice(index, 1);
              filtersService.model.selected.featureType = arr;
            }
            break;
          } else if (chip.type === 'itemAuthorizationType') {
            if (chip.name === 'All Authorized Product Types') {
              filtersService.model.selected.itemAuthorizationType = [];
            } else {
              index = arr.indexOf(chip.name);
              arr.splice(index, 1);
              filtersService.model.selected.itemAuthorizationType = arr;
            }
            break;
          }
        }
      }

      if (service.model.length === defaultFilterArrayLength && isDefault(service.model)) {
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

      if (model.length !== defaultFilterArrayLength) {
        checkForDefaultFilters = false;
        return checkForDefaultFilters;
      }

      for (var j = 0; j < model.length; j++) {

        if (model[j].name === 'My Accounts Only' || model[j].name === 'Off-Premise' ||  model[j].name === 'Authorized' ||  model[j].name === 'All Types') {
          count++;
        }

        if (count === defaultFilterArrayLength) {
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

    function resetChipsFilters() {
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
      if (displayName !== 'CBBD Chain' && displayName !== 'Additional CA') {
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
          case 'subaccounts':
          case 'account':
          case 'distributor':
            if (result.ids) result.id = result.ids.join('|');
            addAutocompleteChip(displayName, filter, null, result.id);
            if (service.model.indexOf(result.id) === -1) pushUniqueValue(result, model);
            filtersService.model.chain = '';
            filtersService.model.store = '';
            filtersService.model.filtersValidCount++;
            break;
          case 'store':
            if (result.ids) result.id = result.ids.join('|');
            addAutocompleteChip(displayName, filter, null, result.id);
            if (service.model.indexOf(result.id) === -1) pushUniqueValue(result.id, model);
            filtersService.model.chain = '';
            filtersService.model.store = '';
            filtersService.model.filtersValidCount++;
            break;
          case 'contact':
            addAutocompleteChip(displayName, filter, null, result.employeeId);
            if (service.model.indexOf(result.id) === -1) pushUniqueValue(result.id, model);
            break;
          case 'masterSKU':
            if (result.id === null || result.id === undefined) {
              addAutocompleteChip($filter('titlecase')(result.brand), 'brand', null, result.brandCode);
              filtersService.model.selected.brand = filtersService.model.selected.brand || [];
              if (filtersService.model.selected.brand.indexOf(result.brandCode) === -1) filtersService.model.selected.brand.push(result.brandCode);
            } else if (result.id !== null) {
              addAutocompleteChip($filter('titlecase')(result.name), filter, null, result.id);
              if (service.model.indexOf(result.id) === -1) pushUniqueValue(result.id, model);
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
      if (service.model.length === defaultFilterArrayLength && isDefault(service.model)) {
        filtersService.disableFilters(false, false, false, false);
      } else {
        filtersService.disableFilters(false, false, true, false);
      }

      if (result.premiseType && result.premiseType === 'OFF PREMISE') {
        addChip('Off-Premise', 'premiseType', true, false);
        filtersService.model.selected.premiseType = 'off';
      } else if (result.premiseType && result.premiseType === 'ON PREMISE') {
        addChip('On-Premise', 'premiseType', true, false);
        filtersService.model.selected.premiseType = 'on';
      }
    }

   /**
    * @name pushUniqueValue
    * @desc check for duplicates and make sure not to add to model object
    * @params {Variable} id - id to be included
    * @params {Object} arr - array from filters service model
    * @returns null
    * @memberOf cf.common.services
    */
    function pushUniqueValue(id, arr) {
      if (arr && arr.indexOf(id) === -1) arr.push(id);
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
      removeChip(filter);

      switch (filter) {
        case 'opportunityType':
          if (result.length === 0 || (result.length <= 1 && result[0] === 'All Types')) {
            addChip('All Opportunity Types', filter, false, false);
            filtersService.model.selected[filter] = ['All Types'];
          } else {
            var results = [];
            angular.forEach(result, function(value, key) {
              if (value !== 'All Types') {
                addChip(value, filter, false);
                results.push(value);
              }
            });
            filtersService.model.selected[filter] = results;
            filtersService.disableFilters(false, false, true, false);
          }
          break;

          case 'featureType':
            if (result.length > 0 && result[0] === 'All Types') {
              addChip('All Feature Product Types', filter, false, true);
            } else {
              for (let type of result) {
                addChip(type, filter, false);
              }
            }
            break;

          case 'itemAuthorizationType':
            if (result.length > 0 && result[0] === 'All Types') {
              addChip('All Authorized Product Types', filter, false, true);
            } else {
              for (let type of result) {
                addChip(type, filter, false);
              }
            }
            break;

        default:
          break;
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

    /**
     * @name removeTopBottomChips
     * @desc Removes chips of type account, subaccount,store, distributor
     * @params {String} levelToResetBeyond - Optional, only remove chips 'below' specified level
     * @returns null
     * @memberOf cf.common.services
     */
    function removeTopBottomChips(levelToResetBeyond) {
      levelToResetBeyond = levelToResetBeyond || {value: -1}; // default to no level limit

      switch (levelToResetBeyond.value) {
        case filtersService.accountFilters.accountTypesEnums.distributors:
          removeChip('store');
          removeChip('account');
          removeChip('subaccount');
          break;
        case filtersService.accountFilters.accountTypesEnums.accounts:
          removeChip('store');
          removeChip('subaccount');
          break;
        default:
          removeChip('store');
          removeChip('account');
          removeChip('subaccount');
          removeChip('distributor');
          break;
      }
    }
  };
