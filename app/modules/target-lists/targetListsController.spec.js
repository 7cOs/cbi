describe('Unit: targetListsController', function() {
  var scope, ctrl;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.modules.targetLists');

    inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('targetListsController', {$scope: scope});
    });
  });

  it('should have services defined', function() {
    expect(ctrl.chipsService).not.toBeUndefined();
    expect(typeof (ctrl.chipsService)).toEqual('object');
    expect(ctrl.filtersService).not.toBeUndefined();
    expect(typeof (ctrl.filtersService)).toEqual('object');
  });

});
