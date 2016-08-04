'use strict';

function TargetListController($scope) {
  var vm = this;

  vm.namedFilters = [{
    'name': 'California - Whiskey Bars',
    'creator': 'Will Jay',
    'members': ['James Norton', 'RJ LaCount', 'Eric Schiller'],
    'created': 'One Minute Ago',
    'closedOpportunities': 520,
    'opportunities': 2251
  }, {
    'name': 'California - Wine Shops',
    'creator': 'Pete Mitchell',
    'members': ['James Norton', 'Eric Schiller'],
    'created': 'One Minute Ago',
    'closedOpportunities': 320,
    'opportunities': 451
  }, {
    'name': 'California - Negroni Bars',
    'creator': 'Nick Bradsaw',
    'members': ['James Norton', 'RJ LaCount', 'Eric Schiller', 'Holly Perkins'],
    'created': 'One Year Ago',
    'closedOpportunities': 1989,
    'opportunities': 2251
  }, {
    'name': 'California - Beer Stores',
    'creator': 'RJ LaCount',
    'members': ['James Norton', 'Adwait Nerlikar', 'RJ LaCount', 'Eric Schiller'],
    'created': 'One Minute Ago',
    'closedOpportunities': 587,
    'opportunities': 2251
  }];
  vm.sharedFilters = [{
    'name': 'Whidbey Island Restaurants',
    'creator': 'Sam Carvey',
    'members': ['David Ostler', 'Todd Alkema'],
    'created': 'One Hour Ago',
    'closedOpportunities': 20,
    'opportunities': 2251
  }, {
    'name': 'West Seattle C-Stores',
    'creator': 'Patti Horigan',
    'members': ['James Conrick', 'Tom Andersen', 'Paul Wagner'],
    'created': 'One Week Ago',
    'closedOpportunities': 4390,
    'opportunities': 5251
  }];

}

module.exports =
  angular.module('andromeda.common.components.target', [])
  .component('target', {
    templateUrl: './app/shared/components/target/target.html',
    controller: TargetListController,
    controllerAs: 'target'
  });
