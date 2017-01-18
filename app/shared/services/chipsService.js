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

    function applyFilters() {
      var isTargetList = false;
      filtersService.resetSort();
      if ($state.current.name === 'target-list-detail') isTargetList = true;
      filtersService.model.appliedFilter.pagination.currentPage = 0;
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
      if (chip.search || chip.type === 'opportunityType' || chip.type === 'state') {
        var arr = filtersService.model.selected[chip.type];
        var i = arr.length;
        while (i--) {
          if (chip.type === 'segmentation' && arr[i] === chip.name.split('Segment ')[1]) {
            arr.splice(i, 1);
            filtersService.model['storeSegmentation' + chip.name.split('Segment ')[1]] = false;
            break;
          } else if (chip.type === 'impact' && arr[i] === chip.name.split(' Impact')[0]) {
            arr.splice(i, 1);
            // update model
            filtersService.model['predictedImpact' + chip.name.split(' Impact')[0]] = false;
            break;
          } else if ((chip.type === 'masterSKU' || chip.type === 'brand') && chip.id === arr[i]) {
            arr.splice(i, 1);
            break;
          } else if (chip.type === 'cbbdChain') {
            arr.splice(i, 1);
            filtersService.model['cbbdChain' + $filter('titlecase')(chip.name.split(' ')[0])] = false;
            break;
          } else if ($filter('titlecase')(arr[i]) === chip.name.split(' ')[0] && chip.type !== 'opportunityType') {
            arr.splice(i, 1);
            // update model
            if (chip.type === 'productType') filtersService.model['productType' + chip.name.split(' ')[0]] = false;
            if (chip.type === 'tradeChannel') filtersService.model['tradeChannel' + chip.name] = false;
            if (chip.type === 'opportunityStatus') filtersService.model['opportunityStatus' + chip.name] = false;
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
      } /* else if (typeof chip.type === 'boolean') { // dont think this is used. leaving it in just in case i breaked something
        console.log('pls no');
        filtersService.model.selected[chip.type] = false;
      } */

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
            if (result.ids) result.id = result.ids.join('|');
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
      if (service.model.length === defaultFilterArrayLength && isDefault(service.model)) {
        filtersService.disableFilters(false, false, false, false);
      } else {
        filtersService.disableFilters(false, false, true, false);
      }
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

    /**
     * @name removeTopBottomChips
     * @desc Removes chips of type account, subaccount,store, distributor
     * @params {Array} chips - List of chips
     * @returns null
     * @memberOf cf.common.services
     */
    function removeTopBottomChips(chips) {
      removeChip('store');
      removeChip('account');
      removeChip('subaccount');
      removeChip('distributor');
    }
  };
