'use strict';

function ListController($scope, $state, opportunitiesService, storesService, $mdDialog) {

  // ****************
  // CONTROLLER SETUP
  // ****************

  // Initial variables
  var vm = this;

  // Services
  vm.opportunitiesService = opportunitiesService;
  // vm.storesService = storesService;

  // Defaults
  vm.pageName = $state.current.name;
  vm.depletionsChevron = false;
  vm.expandedOpportunities = [];
  vm.opportunitiesChevron = false;
  vm.reverse = false;
  vm.segmentationChevron = false;
  vm.selected = [];
  vm.stores = [];
  // sortProperty is set to default sort on page load
  vm.sortProperty = 'store.name';
  vm.storeChevron = true;

  // Expose public methods
  vm.actionOverlay = actionOverlay;
  vm.displayBrandIcon = displayBrandIcon;
  vm.exists = exists;
  vm.isChecked = isChecked;
  vm.sortBy = sortBy;
  vm.toggle = toggle;
  vm.toggleAll = toggleAll;
  vm.showCorporateMemoModal = showCorporateMemoModal;
  vm.closeCorporateMemoModal = closeCorporateMemoModal;

  // Mock Data for memo modal
  vm.limitedTime = {
    title: 'Limited Time Only',
    startDate: '07/09/16',
    endDate: '08/31/16',
    resetStart: 'None',
    resetEnd: 'None',
    price: 12.99,
    onMenu: 'Yes',
    notes: 'A Home brew from a miller light starts reminiscing about a lost buzz, because a childlike bottle learns a hard lesson from a Sierra Nevada Pale Ale. When you see some Sam Adams for a spudgun, it means that a bill behind the Hops Alligator Ale daydreams. The Long Trail Ale around a broken bottle seeks an Amarillo Pale Ale over a sake bomb.',
    mandateIcon: 'featured'
  };

  init();

  // **************
  // PUBLIC METHODS
  // **************

  // Show corporate memo modal

  function showCorporateMemoModal(ev) {
    var parentEl = angular.element(document.body);
    $mdDialog.show({
      clickOutsideToClose: true,
      parent: parentEl,
      scope: $scope.$new(),
      targetEvent: ev,
      templateUrl: './app/shared/components/list/modal-corporate-memo.html'
    });
  };

  function closeCorporateMemoModal() {
    $mdDialog.hide();
  }

  // Overlay Controls
  function actionOverlay(opportunity, state) {
    if (state === 'fail') { opportunity.failState = true; } else { opportunity.failState = false; }
    opportunity.toggled = !opportunity.toggled;
  };

  function displayBrandIcon(haystack, needle) {
    return haystack.indexOf(needle) !== -1;
  }

  // Check if list item exists and is selected
  function exists(item, list) {
    return list.indexOf(item) > -1;
  };

  // Check if all items are selected
  function isChecked() {
    // return vm.selected.length === vm.opportunities.length;
    return vm.selected.length === vm.opportunitiesService.model.opportunities.length;
  };

  // Select or deselect all list items
  function toggleAll() {
    // if (vm.selected.length === vm.opportunities.length) {
    if (vm.selected.length === vm.opportunitiesService.model.opportunities.length) {
      vm.selected = [];
    } else if (vm.selected.length === 0 || vm.selected.length > 0) {
      // vm.selected = vm.opportunities.slice(0);
      vm.selected = vm.opportunitiesService.model.opportunities.slice(0);
    }
  };

  // Select or deselect individual list item
  function toggle(item, list) {
    var idx = list.indexOf(item);
    if (idx > -1) {
      list.splice(idx, 1);
    } else {
      list.push(item);
    }
  };

  // Sort by selected property
  function sortBy(property) {
    vm.reverse = (vm.sortProperty === property) ? !vm.reverse : false;
    vm.sortProperty = property;

    vm.storeChevron = (property === 'store.name') ? !vm.storeChevron : vm.storeChevron;
    vm.opportunitiesChevron = (property === 'opCount') ? !vm.opportunitiesChevron : vm.opportunitiesChevron;
    vm.depletionsChevron = (property === 'depletionsCYTD') ? !vm.depletionsChevron : vm.depletionsChevron;
    vm.segmentationChevron = (property === 'segmentation') ? !vm.segmentationChevron : vm.storeChevron;
  }

  function init() {
    // Get opportunities and products data
    /* opportunitiesService.getOpportunities().then(function(data) {
      opportunitiesService.model.opportunities = data;
    });*/
  }

  // Set positive or negative label for trend values
  /* Should be handled in factory
  vm.opportunities.forEach(function(item) {
  });*/
}

module.exports =
  angular.module('orion.common.components.list', [])
  .component('list', {
    templateUrl: './app/shared/components/list/list.html',
    controller: ListController,
    controllerAs: 'list'
  });
