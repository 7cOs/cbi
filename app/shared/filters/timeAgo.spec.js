describe('Unit: timeAgo Filter', function() {
  'use strict';

  require('angular-mocks/ngMock');
  // require('angular-ui-router');

  // var scope, ctrl;
  var filter;

  beforeEach(function() {
    angular.mock.module('andromeda.common.filters');

    inject(function($filter) {
      filter = $filter;
    });
  });

  /* beforeEach(function() {
    // angular.mock.module('ui.router');
    // angular.mock.module('andromeda.common.services');
    // angular.mock.module('andromeda.modules.opportunities');

    inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('opportunitiesController', {$scope: scope});
    });
  });*/

  it('should exist', function() {
    expect(filter).not.toBeUndefined();
    // expect(typeof (filter)).toEqual('object');
  });

});

