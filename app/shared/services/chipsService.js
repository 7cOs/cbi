'use strict';

module.exports = /*  @ngInject */
  function chipsService(filtersService, opportunitiesService) {

    var model = [];

    var service = {
      model: model,
      addAutocompleteChip: addAutocompleteChip,
      addChip: addChip,
      applyFilters: applyFilters,
      removeFromFilterService: removeFromFilterService,
      updateChip: updateChip,
      resetChipsFilters: resetChipsFilters
    };

    return service;

    /**
     * @name addAutocompleteChip
     * @desc add autocomplete chip to model
     * @params {Object} chip - chip object to be added
     * @params {String} filter - name of property in filter model
     * @returns null
     * @memberOf orion.common.services
     */
    function addAutocompleteChip(chip, filter) {
      if (chip) {
        // Add to Chip Model
        service.model.push({
          name: chip,
          applied: false
        });

        filtersService.model.filtersApplied = false;
        // opportunitiesService.model.filterApplied = false;

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
     * @memberOf orion.common.services
     */
    function addChip(chip, type, onlyOneAllowed) {
      if (chip) {
        if (onlyOneAllowed) removeChip(type);
        // Add to Chip Model
        service.model.push({
          name: chip,
          type: type,
          applied: false
        });

        filtersService.model.filtersApplied = false;
        // opportunitiesService.model.filterApplied = false;
      }
    }

    function applyFilters() {
      opportunitiesService.getOpportunities().then(function(data) {
        opportunitiesService.model.opportunities = data;

        for (var i = 0; i < service.model.length; i++) {
          service.model[i].applied = true;
        }

        filtersService.model.filtersApplied = true;
        opportunitiesService.model.filterApplied = true;

      });
    }

    /**
     * @name removeChip
     * @desc remove chip from model
     * @params {String} type - type of chip [type is only used to remove if onlyOneAllowed === true]
     * @returns null
     * @memberOf orion.common.services
     * @private
     */
    function removeChip(type) {
      for (var i = 0; i < service.model.length; i++) {
        if (service.model[i].type === type) {
          service.model.splice(i, 1);
          break;
        }
      }

      filtersService.model.filtersApplied = false;
      // opportunitiesService.model.filterApplied = false;
    }

    /**
     * @name removeFromFilterService
     * @desc remove the selected chip from the filter service model on click of x in chip
     * @params {Object} chip - Specific chip from model to be removed
     * @params {String} displayName - display name of chip
     * @returns null
     * @memberOf orion.common.services
     */
    function removeFromFilterService(chip) {
      if (chip.type) filtersService.model.selected[chip.type] = false;

      filtersService.model.filtersApplied = false;
      // opportunitiesService.model.filterApplied = false;
    }

    /**
     * @name updateChip
     * @desc add or remove chip from model when selected
     * @params {String} chipType - chip type
     * @params {String} displayName - display name of chip
     * @returns null
     * @memberOf orion.common.services
     */
    function updateChip(chipType, displayName) {
      filtersService.model.selected[chipType] === true ? removeChip(chipType) : addChip(displayName, chipType, true);
    }

    function resetChipsFilters(chips) {
      for (var i = 0; i < chips.length; i++) {
        removeFromFilterService(chips[i]);
      }
      return [];
    }

  };
