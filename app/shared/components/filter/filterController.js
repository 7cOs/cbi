'use strict';

module.exports = /*  @ngInject */
  function filterController($state, $scope, $mdDialog, $mdSelect, loaderService, chipsService, filtersService, opportunityFiltersService, userService, usStatesService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;
    vm.opportunities = true;
    vm.hintTextPlaceholder = 'Account or Subaccount Name';

    // Expose Needed Services
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.userService = userService;

    // Expose Methods
    vm.appendDoneButton = appendDoneButton;
    vm.applyFilterArr = chipsService.applyFilterArr;
    vm.applyFilterMulti = chipsService.applyFilterMulti;
    vm.applyLocations = applyLocations;
    vm.applyStates = applyStates;
    vm.closeDoneButton = closeDoneButton;
    vm.closeModal = closeModal;
    vm.closeSelect = closeSelect;
    vm.expandDropdown = expandDropdown;
    vm.hoverState = hoverState;
    vm.modalSaveOpportunityFilter = modalSaveOpportunityFilter;
    vm.opportunityStatusSwitch = opportunityStatusSwitch;
    vm.placeholderSelect = placeholderSelect;
    vm.resetFilters = resetFilters;
    vm.resetTradeChannels = resetTradeChannels;
    vm.saveFilter = saveFilter;
    vm.updateFilter = updateFilter;
    vm.states = usStatesService;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function appendDoneButton() {
      // We have to do this so the done button is a sibling of md-select-menu
      angular.element(document.getElementsByClassName('md-select-menu-container'))
        .append('<div class="done-btn">Done</div>').bind('click', function(e) {
          $mdSelect.hide();
        });
    }

    function applyLocations(result) {
      if (result.type === 'zipcode') {
        chipsService.applyFilterArr(filtersService.model.selected.zipCode, result.name, 'zipCode');
      } else if (result.type === 'city') {
        chipsService.applyFilterArr(filtersService.model.selected.city, result.name, 'city');
      }

      filtersService.model.location = '';
    }

    function applyStates(result) {
      chipsService.applyStatesFilter(filtersService.model.state, result, 'state');
    }

    function closeDoneButton() {
      angular.element(document.getElementsByClassName('done-btn')).remove();
    }

    function closeModal() {
      $mdDialog.hide();
    }

    function closeSelect() {
      $mdSelect.hide();
    }

    function expandDropdown() {
      if ($state.current.name === 'target-list-detail') {
        vm.opportunities ? vm.opportunities = false : vm.opportunities = true;
      }

      filtersService.model.expanded ? filtersService.model.expanded = false : filtersService.model.expanded = true;
    }

    function hoverState(icon) {
      if (icon === 'reset') {
        vm.isHoveringReset = !vm.isHoveringReset;
      } else {
        vm.isHoveringSave = !vm.isHoveringSave;
      }
    }

    function modalSaveOpportunityFilter(ev) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/shared/components/filter/modal.html'
      });
    }

    function opportunityStatusSwitch() {
      if ($state.current.name === 'target-list-detail') {
        return true;
      } else {
        return false;
      }
    }

    function placeholderSelect(data) {
      vm.hintTextPlaceholder = data;
    }

    function resetFilters() {
      // reset all chips and filters
      chipsService.resetChipsFilters(chipsService.model);

      filtersService.resetFilters();

      resetTradeChannels('on');
      resetTradeChannels('off');
    }

    function resetTradeChannels(str) {
      var arr = filtersService.model.tradeChannels[str || filtersService.model.selected.premiseType];
      for (var i = 0; i < arr.length; i++) {
        var name =  'tradeChannel' + arr[i].name;
        filtersService.model[name] = false;
      }
      filtersService.model.selected.tradeChannel = [];

      // reset chips
      for (i = 0; i < chipsService.model.length; i++) {
        if (chipsService.model[i].tradeChannel === true) {
          chipsService.model.splice(i, 1);
          i--;
        }
      }
    }

    function saveFilter() {
      loaderService.openLoader(true);
      userService.saveOpportunityFilter().then(function(data) {
        // push new filter to filter dropdown
        console.log('QueryParams1' + filtersService.model.appliedFilter);
        console.log('QueryParams' + filtersService.model.appliedFilter.appliedFilter);
        userService.model.opportunityFilters.unshift({
          filterString: encodeURIComponent(filtersService.model.appliedFilter.appliedFilter),
          name: filtersService.model.newServiceName
        });

        // reset new service name
        filtersService.model.newServiceName = null;

        filtersService.disableFilters(true, false, true, false);

        loaderService.closeLoader();

        // close modal
        closeModal();
      }, function(err) {
        console.warn(err);
        loaderService.closeLoader();
      });
    }

    function updateFilter() {
      var currentFilter = userService.model.newServiceSelect;

      loaderService.openLoader(true);
      // userService.updateOpportunityFilter(filterPayload, currentFilter).then(function(data) {
      opportunityFiltersService.updateOpportunityFilter(currentFilter).then(function(data) {
        filtersService.disableFilters(true, false, true, false);
        loaderService.closeLoader();
        closeModal();
      }, function(err) {
        console.warn(err);
        loaderService.closeLoader();
      });
    }

    $scope.$watch('filter.chipsService.model', function(newVal, oldVal) {
      console.log('Model change');
      console.log(newVal);
    }, true);

    // **************
    // PRIVATE METHODS
    // **************

    function init() {
      if ($state.current.name === 'target-list-detail') {
        vm.opportunities = true;
      } else {
        vm.opportunities = false;
      }
    }
  };
