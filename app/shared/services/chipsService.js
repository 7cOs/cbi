'use strict';

module.exports = /*  @ngInject */
  function chipsService(filtersService, opportunitiesService, targetListService, $filter) {

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
        'type': 'opportunitiesTypes',
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
     * @returns null
     * @memberOf cf.common.services
     */
    function addAutocompleteChip(chip, filter) {
      if (chip) {
        // Add to Chip Model
        service.model.push({
          name: chip,
          type: filter,
          search: true,
          applied: false,
          removable: true
        });

        filtersService.model.filtersApplied = false;
        filtersService.model.filtersDefault = false;

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
        filtersService.model.filtersApplied = false;
        filtersService.model.filtersDefault = false;
      }
    }

    function applyFilters(isTargetList) {
      if (!isTargetList) {
        opportunitiesService.getOpportunities().then(function(data) {
          finishGet(data);
        });
      } else if (isTargetList) {
        targetListService.getTargetListOpportunities(targetListService.model.currentList.id, {type: 'opportunities'}).then(function(data) {
          finishGet(data);
        });
      }

      function finishGet(data) {
        for (var i = 0; i < service.model.length; i++) {
          service.model[i].applied = true;
        }

        filtersService.model.filtersApplied = true;
        opportunitiesService.model.filterApplied = true;
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

      filtersService.model.filtersApplied = false;
      filtersService.model.filtersDefault = false;
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
          if (arr[i] === chip.name) {
            arr.splice(i, 1);
          }
        }
      } else if (typeof chip.type === 'string') {
        filtersService.model.selected[chip.type] = '';
      } else if (typeof chip.type === 'boolean') {
        filtersService.model.selected[chip.type] = false;
      }
      filtersService.model.filtersApplied = false;
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
      angular.copy(chipsTemplate, model);
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
    function applyFilterArr(model, result, filter) {
      if (model.indexOf(result) > -1) {
        filtersService.model[filter] = '';
      } else {
        filtersService.model[filter] = '';
        if (filter === 'store') {
          addAutocompleteChip(result.store_name, filter);
          model.push(result.tdlinx_number);
        } else if (filter === 'cbbdContact') {
          addAutocompleteChip($filter('titlecase')(result.firstName + ' ' + result.lastName), filter);
          model.push(result.id);
        } else if (filter === 'subaccount' || filter === 'account') {
          filtersService.model.chain = '';
          addAutocompleteChip($filter('titlecase')(result.name), filter);
          model.push(result.id);
        } else if (filter === 'distributor' || filter === 'brands') {
          addAutocompleteChip($filter('titlecase')(result.name), filter);
          model.push(result.id);
        } else {
          addAutocompleteChip(result, filter);
          model.push(result);
        }
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
      removeChip('opportunitiesType');
      if (result.length === 0) {
        addChip('All Types', 'opportunitiesType', false);
        filtersService.model.selected[filter] = ['All Types'];
        filtersService.model.opportunityType = ['All Types'];
      } else {
        for (var i = 0; i < result.length; i++) {
          if (result[i] === 'All Types') {
            result.splice(result.indexOf('All Types'), 1);
          } else {
            addChip(result[i], 'opportunitiesType', false);
          }
        }
        filtersService.model.selected[filter] = result;
      }
    }

  };
