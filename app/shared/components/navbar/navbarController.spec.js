describe('Unit: list controller', function() {
  var scope, $rootScope, ctrl, $q, $httpBackend, $state, $mdMenu, notificationsService, opportunitiesService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.navbar');
    angular.mock.module('angularMoment');

    inject(function(_$rootScope_, $controller, _$q_, _$httpBackend_, _$window_, _$state_, _$mdMenu_, _notificationsService_, _opportunitiesService_, _userService_, _versionService_) {
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      scope.analytics = {};

      ctrl = $controller('navbarController', {
        $scope: scope,
        $rootScope: scope
      });
      $q = _$q_;
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      $mdMenu = _$mdMenu_;
      notificationsService = _notificationsService_;
      opportunitiesService = _opportunitiesService_;
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

  describe('[nb.markRead]', function() {
    var notifications;
    beforeEach(function() {
      notifications = [
        {
          'id': '12345',
          'objectType': 'OPPORTUNITY',
          'shortenedObject': {
            'id': '54321'
          }
        },
        {
          'id': '555858',
          'objectType': 'TARGET_LIST',
          'shortenedObject': {
            'id': '888575'
          }
        },
        {
          'id': '923929',
          'objectType': 'ACCOUNT',
          'shortenedObject': {
            'id': '909088'
          }
        }
      ];
      $httpBackend.expectGET('/opportunities').respond(200);
      $httpBackend.expectGET('/target-list-detail/undefined').respond(200);
      $httpBackend.expectGET('/accounts').respond(200);
    });

    it('should trigger notificationsService', function() {
      var deferredMark = $q.defer(),
          deferredState = $q.defer();
      spyOn(notificationsService, 'markNotifications').and.callFake(function() {
        return deferredMark.promise;
      });
      spyOn($state, 'go').and.callFake(function() {
        return deferredState.promise;
      });
      ctrl.markRead(notifications[0]);
      expect(notificationsService.markNotifications).toHaveBeenCalled();
    });

    it('should navigate to the appropriate page based on notification\'s objectType', function() {
      var deferredState = $q.defer();
      spyOn($state, 'go').and.callFake(function() {
        return deferredState.promise;
      });

      ctrl.markRead(notifications[0]);
      expect($state.go).toHaveBeenCalledWith('opportunities', (opportunitiesService.model.opportunityId, opportunitiesService.model.filterApplied = false), {reload: true});

      ctrl.markRead(notifications[1]);
      expect($state.go).toHaveBeenCalledWith('target-list-detail', ({id: notifications[1].shortenedObject.id}));

      ctrl.markRead(notifications[2]);
      expect($state.go).toHaveBeenCalledWith('accounts');
    });

    it('should hide the menu', function() {
      var deferredState = $q.defer();
      spyOn($mdMenu, 'hide').and.callThrough();
      spyOn($state, 'go').and.callFake(function() {
        return deferredState.promise;
      });
      ctrl.markRead(notifications[0]);
      expect($mdMenu.hide).toHaveBeenCalled();
    });
  });

});
