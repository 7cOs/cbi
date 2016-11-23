describe('Unit: list controller', function() {
  var scope, $rootScope, ctrl;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.navbar');

    inject(function(_$rootScope_, $controller, _$window_, _notificationsService_, _userService_, _versionService_) {
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      scope.analytics = {};

      ctrl = $controller('navbarController', {
        $scope: scope,
        $rootScope: scope
      });

    });

  });

  it('should expose public services', function() {
    expect(ctrl.notificationsService).not.toBeUndefined();
    expect(typeof (ctrl.notificationsService)).toEqual('object');

    expect(ctrl.userService).not.toBeUndefined();
    expect(typeof (ctrl.userService)).toEqual('object');

    expect(ctrl.versionService).not.toBeUndefined();
    expect(typeof (ctrl.versionService)).toEqual('object');
  });

  it('should expose public methods', function() {
    expect(ctrl.addAnotherOpportunity).not.toBeUndefined();
    expect(typeof (ctrl.addAnotherOpportunity)).toEqual('function');

    expect(ctrl.addOpportunity).not.toBeUndefined();
    expect(typeof (ctrl.addOpportunity)).toEqual('function');

    expect(ctrl.addToTargetList).not.toBeUndefined();
    expect(typeof (ctrl.addToTargetList)).toEqual('function');

    expect(ctrl.closeMenus).not.toBeUndefined();
    expect(typeof (ctrl.closeMenus)).toEqual('function');

    expect(ctrl.closeModal).not.toBeUndefined();
    expect(typeof (ctrl.closeModal)).toEqual('function');

    expect(ctrl.getTargetLists).not.toBeUndefined();
    expect(typeof (ctrl.getTargetLists)).toEqual('function');

    expect(ctrl.markRead).not.toBeUndefined();
    expect(typeof (ctrl.markRead)).toEqual('function');

    expect(ctrl.markSeen).not.toBeUndefined();
    expect(typeof (ctrl.markSeen)).toEqual('function');

    expect(ctrl.modalAddOpportunityForm).not.toBeUndefined();
    expect(typeof (ctrl.modalAddOpportunityForm)).toEqual('function');

    expect(ctrl.showNewRationaleInput).not.toBeUndefined();
    expect(typeof (ctrl.showNewRationaleInput)).toEqual('function');
  });

});
