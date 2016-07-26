'use strict';

module.exports =
  function landingController($rootScope, $state, filtersService, myperformanceService, userService) {
    var vm = this;

    // Map public methods to scope
    vm.isNegative = isNegative;
    vm.isPositive = isPositive;
    vm.ratio = ratio;

    vm.filter = filtersService.model;
    vm.performanceData = myperformanceService.model();
    vm.namedFilters = [{
      'name': 'California - Whiskey Bars',
      'creator': 'Will Jay',
      'members': ['James Norton', 'RJ LaCount', 'Eric Schiller'],
      'created': 'One Minute Ago',
      'closedOpportunites': 520,
      'opportunities': 2251
    }, {
      'name': 'California - Wine Shops',
      'creator': 'Pete Mitchell',
      'members': ['James Norton', 'Eric Schiller'],
      'created': 'One Minute Ago',
      'closedOpportunites': 320,
      'opportunities': 451
    }, {
      'name': 'California - Negroni Bars',
      'creator': 'Nick Bradsaw',
      'members': ['James Norton', 'RJ LaCount', 'Eric Schiller', 'Holly Perkins'],
      'created': 'One Year Ago',
      'closedOpportunites': 1989,
      'opportunities': 2251
    }, {
      'name': 'California - Beer Stores',
      'creator': 'RJ LaCount',
      'members': ['James Norton', 'Adwait Nerlikar', 'RJ LaCount', 'Eric Schiller'],
      'created': 'One Minute Ago',
      'closedOpportunites': 587,
      'opportunities': 2251
    }];
    vm.sharedFilters = [{
      'name': 'Whidbey Island Restaurants',
      'creator': 'Sam Carvey',
      'members': ['David Ostler', 'Todd Alkema'],
      'created': 'One Hour Ago',
      'closedOpportunites': 20,
      'opportunities': 251
    }, {
      'name': 'West Seattle C-Stores',
      'creator': 'Patti Horigan',
      'members': ['James Conrick', 'Tom Andersen', 'Paul Wagner'],
      'created': 'One Week Ago',
      'closedOpportunites': 390,
      'opportunities': 551
    }];

    // Broadcast current page name for other scopes
    $rootScope.$broadcast('page:loaded', $state.current.name);

    userService.getTargetLists('A1B2C3').then(function(data) {
      // vm.namedFilters = data.owned;
      /* console.log(vm.namedFilters);
      console.log('shared with me response', data.owned);

      // vm.sharedFilters = data.sharedWithMe;
      console.log(vm.sharedFilters);
      console.log('shared with me response', data.sharedWithMe); */
    });

    function isNegative(salesData) {
      if (salesData >= 0) {
        return false;
      }
      return true;
    };

    function isPositive(salesData) {
      if (salesData >= 0) {
        return true;
      }
      return false;
    };

    function ratio(closed, total) {
      var result = closed / total * 100;
      return result;
    };
  };
