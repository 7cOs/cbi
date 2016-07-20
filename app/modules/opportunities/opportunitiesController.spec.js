describe('Unit: opportunitesController', function() {
  require('angular-mocks/ngMock');
  require('angular-ui-router');

  var scope, ctrl;

  beforeEach(module('angular-ui-router'));
  angular.mock.module('andromeda.modules.opportunities');

  beforeEach(function() {
    inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller('opportunitesController', {$scope: scope});
      scope.$digest();
    });
  });

  it('should have logic', function(ctrl) {
    expect(true).toBeTruthy();
  });

});

