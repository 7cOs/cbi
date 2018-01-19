'use strict';

module.exports = /*  @ngInject */
  function opportunitiesController($rootScope, $scope, $state, $filter, $mdDialog, $mdSelect, opportunitiesService, opportunityFiltersService, chipsService, filtersService, userService, loaderService, toastService, title) {

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
    vm.applyFiltersOnLoad = $state.params.applyFiltersOnLoad;
    vm.updateReportError = false;
    vm.deleteReportError = false;

    // Set page title for head and nav
    title.setTitle($state.current.title);

    // Services
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.userService = userService;
    vm.opportunitiesService = opportunitiesService;
    vm.loaderService = loaderService;
    vm.toastService = toastService;

    // Expose public methods
    vm.applySavedFilter = applySavedFilter;
    vm.closeEditModal = closeEditModal;
    vm.closeModal = closeModal;
    vm.deleteSavedFilter = deleteSavedFilter;
    vm.duplicateNameCheck = duplicateNameCheck;
    vm.editFilterModal = editFilterModal;
    vm.placeholderSelect = placeholderSelect;
    vm.editReportName = editReportName;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function applySavedFilter(ev, filter) {
      var resetDefaultAuthorizationFlag = true;
      var currentChipModel = null, currentFilterModel = null;
      var filterDescription = IsJsonString(filter.description);

      vm.editedFilterName = filter.name;

      if (filterDescription) {
        currentChipModel = filterDescription.chipsModel;
        currentFilterModel = filterDescription.filterModel;
      }

      chipsService.resetChipsFilters(chipsService.model);
      vm.filtersService.model.appliedFilter.appliedFilter = filter.filterString;
      filtersService.updateSelectedFilterModel(currentFilterModel);

      if (ev && ev.srcElement.nodeName === 'SPAN') {
        ev.preventDefault();
      } else {
        var arr = decodeURIComponent(filter.filterString).split(',');
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].length > 0) {
            var prop = arr[i].split(':');
            if (filtersService.checkForAuthorizationFlag(prop[0])) {
              resetDefaultAuthorizationFlag = false;
            }
          }
        }
      }

      // By default the authorization flag is set on filtersService.model. We are just checking if there is a productType filter in the filter string. If not we need to reset productType array
      if (resetDefaultAuthorizationFlag) {
        filtersService.model.selected.productType = [];
        filtersService.model.productTypeAuthorized = false;
      }

      if (currentChipModel && currentChipModel.length > 0) {
        chipsService.addChipsArray(currentChipModel);
      }
      chipsService.applyFilters();
      filtersService.model.selected.currentFilter = filter.id;
    };

    function IsJsonString(str) {
      var chipsObj = [];
      try {
        chipsObj = JSON.parse(str);
      } catch (e) {
        chipsObj = null;
      }
      return chipsObj;
    }

    function closeModal() {
      $mdDialog.hide();
    }

    function closeEditModal() {
      vm.updateReportError = false;
      vm.deleteReportError = false;
      vm.currentFilter = {};

      closeModal();
    }

    function editFilterModal(filterId, ev) {
      var parentEl = angular.element(document.body);
      vm.currentFilter = $filter('filter')(userService.model.opportunityFilters, {id: filterId});
      vm.duplicateName = false;
      vm.editedFilterName = vm.currentFilter[0].name;
      vm.filtersService.model.appliedFilter.appliedFilter = vm.currentFilter[0].filterString;
      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        template: require('./modal-edit-filter.pug')
      });

      ev.stopPropagation();
      $mdSelect.hide();

    }

    function deleteSavedFilter(filterId) {
      opportunityFiltersService.deleteOpportunityFilter(filterId)
        .then(() => {
          vm.deleteReportError = false;
          angular.forEach(userService.model.opportunityFilters, (item, key) => {
            if (item.id === filterId) userService.model.opportunityFilters.splice(userService.model.opportunityFilters.indexOf(item), 1);
            closeModal();
          });
        })
        .catch(() => {
          vm.deleteReportError = true;
        });
        toastService.showToast('reportDeleted');
    }

    function placeholderSelect(data) {
      vm.hintTextPlaceholder = data;
    }

    function duplicateNameCheck() {
      vm.duplicateName = false;
      var keepGoing = true;

      angular.forEach(userService.model.opportunityFilters, function(value, key) {
        if (keepGoing) {
          if (vm.editedFilterName === value.name) {
            keepGoing = false;
            vm.duplicateName = true;
            return;
          }
        }
      });

      if (!vm.duplicateName) vm.editReportName();
    }

    function editReportName() {
      opportunityFiltersService.updateOpportunityFilter(vm.currentFilter[0].id, 'name', vm.editedFilterName)
        .then(() => {
          vm.updateReportError = false;
          vm.currentFilter[0].name = vm.editedFilterName;
          closeModal();
        })
        .catch(() => {
          vm.updateReportError = true;
        });
        toastService.showToast('reportSaved');
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    function init() {
      // get saved filters -- this should be passed from user data when its ready
      userService.getOpportunityFilters(userService.model.currentUser.employeeID).then(function(data) {
        userService.model.opportunityFilters = data;
      });

      // reset all chips and filters on page init
      if (vm.resetFiltersOnLoad) {
        chipsService.resetChipsFilters(chipsService.model);
      } else if (!vm.resetFiltersOnLoad && filtersService.model.selected.currentFilter) {
        applySavedFilter(filtersService.model.currentFilter.ev, filtersService.model.currentFilter);
      }

      // apply filters on init if requested
      if (vm.applyFiltersOnLoad) {
        if ($state.params.referrer === 'accounts') {
          delete $state.params.referrer;
        }

        chipsService.applyFilters();
      }

      // reset state params
      $state.params.applyFiltersOnLoad = false;
      $state.params.resetFiltersOnLoad = true;

      // closes filter box
      filtersService.model.expanded = false;

      // go to a specific opportunity on load and then set to null if specified
      if ($state.params.opportunityID && $state.params.opportunityID.length) {
        loaderService.openLoader(true);
        opportunitiesService.getAndUpdateStoreWithOpportunity($state.params.opportunityID).then(function(data) {
          loaderService.closeLoader();
        });
      }
    } // end init

  }; // end controller
