'use strict';

module.exports = /*  @ngInject */
  function opportunitiesController($rootScope, $scope, $state, $mdDialog, opportunitiesService, chipsService, filtersService, userService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Services
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;
    vm.userService = userService;
    vm.opportunitiesService = opportunitiesService;

    // Expose public methods
    vm.applyFilter = applyFilter;
    vm.closeModal = closeModal;
    vm.modalSaveOpportunityFilter = modalSaveOpportunityFilter;
    vm.saveFilter = saveFilter;

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function applyFilter(filterStr) {
      console.log('add filter');
    }

    function closeModal() {
      $mdDialog.hide();
    }

    function modalSaveOpportunityFilter(ev) {
      var parentEl = angular.element(document.body);
      $mdDialog.show({
        clickOutsideToClose: false,
        parent: parentEl,
        scope: $scope.$new(),
        targetEvent: ev,
        templateUrl: './app/modules/opportunities/modal.html'
      });
    }

    function saveFilter() {
      // get applied filters
      var filterPayload = filtersService.getAppliedFilters('opportunities');

      userService.saveOpportunityFilter(filterPayload).then(function(data) {
        // push new filter to filter dropdown
        userService.model.opportunityFilters.push(data.dataContent);

        // close modal
        closeModal();
      });
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    // Add chip for inline search value watchers
    function addInlineSearchChip(val) {
      if (typeof val === 'string' && val !== '') {
        vm.chipsService.addAutocompleteChip(val, 'searchText');
      }
    }

    // Watch for inline search value changes
    $scope.$watch('o.filtersService.model.brand', function (val) { addInlineSearchChip(val); });
    $scope.$watch('o.filtersService.model.store', function (val) { addInlineSearchChip(val); });
    $scope.$watch('o.filtersService.model.chain', function (val) { addInlineSearchChip(val); });

    function init() {
      // get saved filters -- this should be passed from user data when its ready
      userService.getOpportunityFilters(userService.model.currentUser.personID).then(function(data) {
        userService.model.opportunityFilters = data;
      });

      // reset all chips and filters on page init
      chipsService.model = chipsService.resetChipsFilters(chipsService.model);
    }
  };
