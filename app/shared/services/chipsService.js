'use strict';

module.exports = /*  @ngInject */
  function chipsService($filter, $q, loaderService, filtersService, opportunitiesService, targetListService) {

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
        'name': 'Authorized',
        'type': 'productTypeAuthorized',
        'applied': false,
        'removable': false
      },
      {
        'name': 'All Types',
        'type': 'opportunitiesType',
        'applied': false,
        'removable': false
      }
    ];

    var model = [];

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
      applyFilterMulti: applyFilterMulti
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
        service.model.push({
          name: chip,
          id: id,
          type: filter,
          search: true,
          applied: false,
          removable: true,
          tradeChannel: tradeChannel || false
        });

        filtersService.disableFilters(false, false, true);

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
        filtersService.disableFilters(false, false, true);
      }
    }

    function applyFilters(isTargetList) {
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

      filtersService.disableFilters(false, false, true);
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
      if (chip.search || chip.type === 'opportunitiesTypes') {
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
          } else if (chip.type === 'distributor' || chip.type === 'account' || chip.type === 'subaccount' || chip.type === 'store' || chip.type === 'cbbdContact') {
            var index = arr.indexOf(chip.id);
            arr.splice(index, 1);
            break;
          }
        }
      } else if (typeof chip.type === 'string') {
        filtersService.model.selected[chip.type] = '';
      } else if (typeof chip.type === 'boolean') {
        filtersService.model.selected[chip.type] = false;
      }
      filtersService.disableFilters(false, false, true);
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
        } else {
          displayName = result;
        }
      }
      displayName = $filter('titlecase')(displayName);

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
          case 'store':
          case 'distributor':
          case 'cbbdContact':
            addAutocompleteChip(displayName, filter, null, result.id);
            model.push(result.id);
            filtersService.model.chain = '';
            filtersService.model.store = '';
            break;
          case 'masterSKU':
            if (result.id === null) {
              addAutocompleteChip($filter('titlecase')(result.brand), 'brand', null, result.brandCode);
              filtersService.model.selected.brand.push(result.brandCode);
            } else if (result.id !== null) {
              addAutocompleteChip($filter('titlecase')(result.name), filter, null, result.id);
              model.push(result.id);
            }
            break;
          case 'tradeChannel':
            addAutocompleteChip(displayName, filter, true);
            model.push(result);
            break;
          default:
            addAutocompleteChip(displayName, filter);
            model.push(result);
        }
      }
      filtersService.model[filter] = '';
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
      removeChip('opportunitiesType');
      if (result.length === 0) {
        addChip('All Types', 'opportunitiesType', false);
        filtersService.model.selected[filter] = ['All Types'];
        filtersService.model.opportunityType = ['All Types'];
      } else {
        var results = [];
        angular.forEach(result, function(value, key) {
          if (value === 'All Types') {
          } else {
            addChip(value, 'opportunitiesType', false);
            results.push(value);
          }
        });
        filtersService.model.selected[filter] = results;
      }
    }

  };
