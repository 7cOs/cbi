'use strict';

function TargetListController($scope, $state, userService) {

  // ****************
  // CONTROLLER SETUP
  // ****************

  // Initial variables
  var vm = this;

  // Defaults
  vm.pageName = $state.current.name;

  // Temp data
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

  // Expose public methods
  vm.ratio = ratio;

  userService.getTargetLists('1').then(function(data) {
    vm.namedFilters = data.owned;
    console.log(vm.namedFilters);
    console.log('owned by me response', data.owned);

    vm.sharedFilters = data.sharedWithMe;
    console.log(vm.sharedFilters);
    console.log('shared with me response', data.sharedWithMe);
  });

  // **************
  // PUBLIC METHODS
  // **************

  function ratio(closed, total) {
    var result = closed / total * 100;
    return result;
  };
}

module.exports =
  angular.module('orion.common.components.target', [])
  .component('target', {
    templateUrl: './app/shared/components/target/target.html',
    controller: TargetListController,
    controllerAs: 'target'
  });
