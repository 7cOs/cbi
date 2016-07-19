describe('Unit: opportunitesController', function() {
  require('angular-mocks/ngMock');
  require('angular-ui-router');

  var scope, ctrl;

  beforeEach(module('ui.router'));
  beforeEach(function() {
    angular.mock.module('andromeda.modules.opportunities');
    inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      ctrl = $controller('opportunitesController', { $scope: scope });
      scope.$digest();
    });
  });

  it('should have logic', function(ctrl) {
    expect(true).toBeTruthy();
  });

});

