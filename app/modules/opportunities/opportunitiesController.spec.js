describe('Unit: opportunitiesController', function() {
  require('angular-mocks/ngMock');
  require('angular-ui-router');

  var scope, ctrl;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('andromeda.common.services')
    angular.mock.module('andromeda.modules.opportunities');

    inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('opportunitiesController', {$scope: scope});
    });
  });

  it('should have logic', function() {
    expect(true).toBeTruthy();
  });

  it('should not have logic', function() {
    expect(false).toBeFalsy();
  });

  it('should have services defined', function() {
    expect(ctrl.chipsService).not.toBeUndefined();
    expect(typeof(ctrl.chipsService)).toEqual('object');
    expect(ctrl.filtersService).not.toBeUndefined();
    expect(typeof(ctrl.filtersService)).toEqual('object');
    expect(ctrl.userService).not.toBeUndefined();
    expect(typeof(ctrl.userService)).toEqual('object');
  });

});

