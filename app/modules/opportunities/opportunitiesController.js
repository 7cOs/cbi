'use strict';

module.exports = /*  @ngInject */
  function opportunitiesController($rootScope, $scope, $state, $filter, $mdDialog, $mdSelect, opportunitiesService, opportunityFiltersService, chipsService, filtersService, userService, loaderService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;
    vm.currentFilter = {};
    vm.hintTextPlaceholder = 'Account or Subaccount Name';
    vm.isHoveringSave = false;
    vm.isHoveringReset = false;
    vm.resetFiltersOnLoad = $state.params.resetFiltersOnLoad;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Services
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.userService = userService;
    vm.opportunitiesService = opportunitiesService;
    vm.loaderService = loaderService;

    // Expose public methods
    vm.applySavedFilter = applySavedFilter;
    vm.closeEditModal = closeEditModal;
    vm.closeModal = closeModal;
    vm.deleteSavedFilter = deleteSavedFilter;
    vm.editFilterModal = editFilterModal;
    vm.placeholderSelect = placeholderSelect;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function applySavedFilter(ev, filter) {
      var resetDefaultAuthorizationFlag = true;
      var chipsMappedFromFilter = [];
      chipsService.resetChipsFilters(chipsService.model);
      if (ev.srcElement.nodeName === 'SPAN') {
        ev.preventDefault();
      } else {
        // set filters based on query string
        var arr = decodeURIComponent(filter.filterString).split(',');
        chipsService.initFilterToChipModel();

        for (var i = 0; i < arr.length; i++) {
          if (arr[i].length > 0) {
            var prop = arr[i].split(':');
            filtersService.model.selected[prop[0]] = prop[1];
            if (prop[0] === 'productType') {
              resetDefaultAuthorizationFlag = false;
            }
            var matchedChips = getChipsAssociatedWithFilter(prop);
            if (matchedChips) {
              Array.prototype.push.apply(chipsMappedFromFilter, matchedChips);
            }
          }
        }
        console.log('Overall MATCHED CHIPS');
        console.log(chipsMappedFromFilter);
        // By default the authorization flag is set on filtersService.model. We are just checking if there is a productType filter in the filter string. If not we need to reset productType array
        if (resetDefaultAuthorizationFlag) {
          filtersService.model.selected.productType = [];
        }
        chipsService.addChipsArray(chipsMappedFromFilter);
        chipsService.applyFilters();
        filtersService.model.selected.currentFilter = filter.id;
      }
    }

    function getChipsAssociatedWithFilter(prop) {
      console.log('current property');
      console.log(prop);
      var matchedChips = [];
      var isBooleanFilter = chipsService.isBooleanFilter(prop[0], prop[1]);
      if (isBooleanFilter) {
        var chipObj = chipsService.returnChipForBooleanFilter(prop[0], prop[1]);
        if (chipObj) {
          matchedChips.push(chipObj);
        }
      } else {
        var isMultipleValuedFilter = chipsService.isMultipleValuedFilter(prop[0]);
        if (isMultipleValuedFilter) {
          var chipsMatched = chipsService.returnChipForMultipleValuedFilter(prop[0], prop[1]);
          if (chipsMatched) {
            Array.prototype.push.apply(matchedChips, chipsMatched);
          }
        } else {
          var isTextSearchFilter = chipsService.isTextSearchFilter(prop[0]);
          if (isTextSearchFilter) {
            var chips = chipsService.returnChipForTextSearchFilter(prop[0], prop[1]);
            if (chips) {
              Array.prototype.push.apply(matchedChips, chips);
            }
          }
        }
      }
      console.log('Matched chips');
      console.log(matchedChips);
      return matchedChips;
    }

    function closeModal() {
      $mdDialog.hide();
    }

    function closeEditModal() {
      vm.currentFilter = {};
      closeModal();
    }

    function editFilterModal(filterId, ev) {
      vm.currentFilter = $filter('filter')(userService.model.opportunityFilters, {id: filterId});

      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: true,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/modules/opportunities/modal-edit-filter.html'
      });
    }

    function deleteSavedFilter(filterId) {
      opportunityFiltersService.deleteOpportunityFilter(filterId).then(function(data) {
        // remove from user model and UI
        angular.forEach(userService.model.opportunityFilters, function(item, key) {
          if (item.id === filterId) userService.model.opportunityFilters.splice(userService.model.opportunityFilters.indexOf(item), 1);
        });

        closeModal();
      });
    }

    function placeholderSelect(data) {
      vm.hintTextPlaceholder = data;
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    function init() {
      // get saved filters -- this should be passed from user data when its ready
      userService.getOpportunityFilters(userService.model.currentUser.employeeID).then(function(data) {
        userService.model.opportunityFilters = data;
        console.log('Filters');
        console.log(userService.model.opportunityFilters);
      });

      // reset all chips and filters on page init
      if (vm.resetFiltersOnLoad) {
        chipsService.resetChipsFilters(chipsService.model);
      } else {
        if (filtersService.model.selected.currentFilter) {
          applySavedFilter(filtersService.model.currentFilter.ev, filtersService.model.currentFilter);
        }
      }
      $state.params.resetFiltersOnLoad = true;

      // closes filter box
      filtersService.model.expanded = false;

      // Set this to have a list load with the page
      // chipsService.applyFilters();

      // go to a specific opportunity on load and then set to null if specified
      if (opportunitiesService.model.opportunityId !== null) {
        opportunitiesService.getOpportunities(opportunitiesService.model.opportunityId).then(function(data) {
          opportunitiesService.model.opportunities = data;
          opportunitiesService.model.opportunityId = null;
        });
      }
    } // end init

  }; // end controller
