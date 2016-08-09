'use strict';

function ExpandedTargetListController($scope, $state) {
  var vm = this;

  vm.pageName = $state.current.name;
  vm.ratio = ratio;
  vm.selector = selector;
  vm.buttonState = 'named';
  vm.sortBy = sortBy;

  // Variables for sorting
  vm.listChevron = true;
  vm.collaboratorsChevron = false;
  vm.lastUpdatedChevron = false;
  vm.closedOpportunitiesChevron = false;
  vm.totalOpportunitesChevron = true;
  vm.depletionsChevron = true;

  function selector(tab) {
    vm.buttonState = tab;
  };

  function ratio(closed, total) {
    var result = closed / total * 100;
    return result;
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
  }

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

}

module.exports =
  angular.module('orion.common.components.expanded', [])
  .component('expanded', {
    templateUrl: './app/shared/components/target-list-expanded/expanded.html',
    controller: ExpandedTargetListController,
    controllerAs: 'expanded'
  });
