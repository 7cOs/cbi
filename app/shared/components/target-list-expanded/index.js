'use strict';

function ExpandedTargetListController($scope, $state) {
  var vm = this;

  vm.pageName = $state.current.name;
  vm.ratio = ratio;
  vm.selector = selector;
  vm.buttonState = 'named';

  function selector(tab) {
    vm.buttonState = tab;
  };

  function ratio(closed, total) {
    var result = closed / total * 100;
    return result;
  };

  vm.namedFilters = [{
    'name': 'California - Whiskey Bars',
    'creator': 'Will Jay',
    'members': ['James Norton', 'Rebecca Norton', 'Eric Schiller'],
    'created': 'One Minute Ago',
    'closedOpportunities': 520,
    'opportunities': 2251
  }, {
    'name': 'California - Wine Shops',
    'creator': 'Pete Mitchell',
    'members': ['Scott Moffat', 'John Rozsnyai'],
    'created': 'One Minute Ago',
    'closedOpportunities': 320,
    'opportunities': 451
  }, {
    'name': 'California - Negroni Bars',
    'creator': 'Nick Bradsaw',
    'members': ['Elizabeth Stephenson', 'Pearl Kitty', 'Michael Phelps'],
    'created': 'One Year Ago',
    'closedOpportunities': 1989,
    'opportunities': 2251
  }, {
    'name': 'California - Beer Stores',
    'creator': 'RJ LaCount',
    'members': ['Jimmy Fallon', 'Seth Rogan', 'Papa Murphey', 'Neil Armstrong'],
    'created': 'One Minute Ago',
    'closedOpportunities': 587,
    'opportunities': 2251
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
