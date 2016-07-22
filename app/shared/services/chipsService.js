'use strict';

module.exports =
  function chipsService(filtersService) {

    var model = [];

    return {
      model: model,
      addChip: addChip,
      addAutocompleteChip: addAutocompleteChip,
      removeChip: removeChip,
      updateChip: updateChip,
      removeFromFilterService: removeFromFilterService
    };

    /**
     * @name addChip
     * @desc add Chip to model
     * @params {Object} chip - chip object to be added
     * @params {String} type - type of chip
     * @params {Boolean} onlyOneAllowed - if only type is allowed
     * @returns null
     * @memberOf andromeda.common.services
     */
    function addChip(chip, type, onlyOneAllowed) {
      if (chip) {
        if (onlyOneAllowed) removeChip(type);

        // Add to Chip Model
        model.push({
          name: chip,
          type: type
        });
      }
    }

    /**
     * @name addAutocompleteChip
     * @desc add autocomplete chip to model
     * @params {Object} chip - chip object to be added
     * @params {String} filter - name of property in filter model
     * @returns null
     * @memberOf andromeda.common.services
     */
    function addAutocompleteChip(chip, filter) {
      if (chip) {

        // Add to Chip Model
        model.push({
          name: chip
        });

        // Empty Input
        if (filter) filtersService.model[filter] = '';
      }
    }

    /**
     * @name removeChip
     * @desc remove chip from model
     * @params {String} type - type of chip [type is only used to remove if onlyOneAllowed === true]
     * @returns null
     * @memberOf andromeda.common.services
     */
    function removeChip(type) {
      for (var i = 0; i < model.length; i++) {
        if (model[i].type === type) {
          model.splice(i, 1);
          break;
        }
      }
    }

    /**
     * @name updateChip
     * @desc add or remove chip from model when selected
     * @params {String} chipType - chip type
     * @params {String} displayName - display name of chip
     * @returns null
     * @memberOf andromeda.common.services
     */
    function updateChip(chipType, displayName) {
      filtersService.model.selected[chipType] === true ? removeChip(chipType) : addChip(displayName, chipType, true);
    }

    /**
     * @name removeFromFilterService
     * @desc remove the selected chip from the filter service model on click of x in chip
     * @params {Object} chip - Specific chip from model to be removed
     * @params {String} displayName - display name of chip
     * @returns null
     * @memberOf andromeda.common.services
     */
    function removeFromFilterService(chip) {
      if (chip.type) filtersService.model.selected[chip.type] = false;
    }

  };
