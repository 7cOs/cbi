'use strict';

function ExpandedTargetListController($state, userService) {
  var vm = this;

  // Variables
  vm.buttonState = 'named';
  vm.closedOpportunitiesChevron = false;
  vm.collaboratorsChevron = false;
  vm.depletionsChevron = true;
  vm.pageName = $state.current.name;
  vm.lastUpdatedChevron = false;
  vm.listChevron = true;
  vm.totalOpportunitesChevron = true;

  // Scope Methods
  vm.ratio = ratio;
  vm.selector = selector;
  vm.sortBy = sortBy;

  // Services
  vm.userService = userService;

  // Init
  init();

  // Public Methods

  function ratio(closed, total) {
    var result = closed / total * 100;
    return result;
  };

  function selector(tab) {
    vm.buttonState = tab;
  };

  function sortBy(property) {
    vm.reverse = (vm.sortProperty === property) ? !vm.reverse : false;
    vm.sortProperty = property;

    vm.listChevron = (property === 'name') ? !vm.listChevron : vm.listChevron;
    vm.collaboratorsChevron = (property === 'members.length') ? !vm.collaboratorsChevron : vm.collaboratorsChevron;
    vm.lastUpdatedChevron = (property === 'created') ? !vm.lastUpdatedChevron : vm.lastUpdatedChevron;
    vm.closedOpportunitiesChevron = (property === 'closedOpportunities') ? !vm.closedOpportunitiesChevron : vm.closedOpportunitiesChevron;
    vm.totalOpportunitesChevron = (property === 'Opportunites') ? !vm.totalOpportunitesChevron : vm.totalOpportunitesChevron;
    vm.depletionsChevron = (property === 'depletions') ? !vm.depletionsChevron : vm.depletionsChevron;
  };

  vm.namedFilters = [{
    'name': 'California - Wine Shops',
    'creator': 'Will Jay',
    'members': ['James Norton', 'Rebecca Norton', 'Eric Schiller'],
    'created': 'One Minute Ago',
    'closedOpportunities': 520,
    'opportunities': 2251,
    'depletions': 1222
  }, {
    'name': 'Alabama - Beer Shops',
    'creator': 'RJ LaCount',
    'members': ['Scott Moffat', 'John Rozsnyai'],
    'created': 'One Minute Ago',
    'closedOpportunities': 320,
    'opportunities': 451,
    'depletions': 2256
  }, {
    'name': 'Florida - Negroni Bars',
    'creator': 'Nick Bradsaw',
    'members': ['Elizabeth Stephenson', 'Karen Wittekind', 'Michael Phelps'],
    'created': 'One Year Ago',
    'closedOpportunities': 1989,
    'opportunities': 2251,
    'depletions': 22879
  }, {
    'name': 'Oregon - Pinball Bars',
    'creator': 'RJ LaCount',
    'members': ['Jimmy Fallon', 'Seth Rogan', 'Papa Murphey', 'Neil Armstrong'],
    'created': 'One Minute Ago',
    'closedOpportunities': 587,
    'opportunities': 3251,
    'depletions': 22348
  }];
  vm.sharedFilters = [];
  vm.archivedFilters = [{
    'name': 'Umi Sake House',
    'creator': 'Ali Harkless',
    'members': ['David Ostler', 'Todd Alkema', 'Patti Horigan'],
    'created': 'One Day Ago',
    'closedOpportunities': 1984,
    'opportunities': 2251
  }, {
    'name': 'Tacoma Grocery',
    'creator': 'Lilli Marlene',
    'members': ['James Conrick', 'Tom Andersen', 'Paul Wagner', 'Trish LaPaglia'],
    'created': 'One Year Ago',
    'closedOpportunities': 490,
    'opportunities': 521
  }];

  // Private Methods
  function init() {
    /* targetListService.getTargetList('1323ss').then(function(data) {
      console.log(data);
    });*/
    userService.getTargetLists('1').then(function(data) {
      userService.model.targetLists = data;
      console.log(userService.model.targetLists);
    });
  }

}

module.exports =
  angular.module('orion.common.components.expanded', [])
  .component('expanded', {
    templateUrl: './app/shared/components/target-list-expanded/expanded.html',
    controller: ExpandedTargetListController,
    controllerAs: 'expanded'
  });
