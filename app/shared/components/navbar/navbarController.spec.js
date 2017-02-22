describe('Unit: list controller', function() {
  var scope, $rootScope, ctrl, $q, $httpBackend, $state, $mdMenu, $mdSelect, $mdDialog, notificationsService, opportunitiesService, targetListService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('angulartics');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.navbar');
    angular.mock.module('angularMoment');

    inject(function(_$rootScope_, $controller, _$q_, _$httpBackend_, _$window_, _$state_, _$mdMenu_, _$mdSelect_, _$mdDialog_, _notificationsService_, _opportunitiesService_, _userService_, _versionService_, _targetListService_) {
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
      $mdSelect = _$mdSelect_;
      $mdDialog = _$mdDialog_;
      notificationsService = _notificationsService_;
      opportunitiesService = _opportunitiesService_;
      targetListService = _targetListService_;
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

  describe('[nb.markSeen]', function() {
    it('should mark notifications as seen', function() {
      spyOn(notificationsService, 'markNotifications').and.callFake(function() {
        return {
          then: function(callback) { return callback({}); }
        };
      });
      var notifications = [{status: 'UNSEEN', id: '23093029'}];
      ctrl.notificationHelper = {};
      ctrl.markSeen(notifications);
      expect(notificationsService.markNotifications).toHaveBeenCalled;
      expect(ctrl.notificationHelper.showBadge).toEqual(false);
      expect(ctrl.notificationHelper.unseenNotifications).toEqual(0);
    });
  });
  describe('[nb.modalAddOpportunityForm]', function() {
    it('should open the dialog', function() {
      spyOn($mdDialog, 'show').and.callThrough();
      ctrl.modalAddOpportunityForm();
      expect($mdDialog.show).toHaveBeenCalled();
    });
    it('should copy the template', function() {
      ctrl.modalAddOpportunityForm();
      expect(ctrl.cacheInputs).toEqual(false);
      expect(ctrl.newOpportunity).toEqual(JSON.parse('{"properties":{"product":{"type":"sku"},"distributionType":{"type":"new"}}}'));
    });

    it('should set cacheInputs to true', function() {
      ctrl.modalAddOpportunityForm(true);
      expect(ctrl.cacheInputs).toEqual(true);
    });
  });
  describe('[nb.modalCustomOpportunityError]', function() {
    it('should open the dialog', function() {
      spyOn($mdDialog, 'show').and.callThrough();
      ctrl.modalCustomOpportunityError({status: 400, data: [{description: 'OPP107'}]});
      expect($mdDialog.show).toHaveBeenCalled();
    });

    it('should handle non-400 errors', function() {
      ctrl.modalCustomOpportunityError({status: 500, data: [{description: 'OPP107'}]});
      expect(ctrl.generalError).toEqual(true);
    });
    it('should handle the errors', function() {
      ctrl.duplicateOpportunity = {properties: {distributionType: {}}};
      ctrl.modalCustomOpportunityError({ status: 400, data: [{description: 'OPP107'}, {description: 'OPP108'}] });
      expect(ctrl.duplicateOpportunity.properties.distributionType.type).toEqual('New Distribution');
      expect(ctrl.duplicateError).toEqual(false);
      expect(ctrl.dismissedError).toEqual(true);
    });
    it('should handle the errors for less than two', function() {
      ctrl.duplicateOpportunity = {properties: {distributionType: {}}};
      ctrl.modalCustomOpportunityError({ status: 400, data: [{objectIdentifier: 'cheese', description: 'OPP101'}] });
      expect(ctrl.duplicateError).toEqual(true);
      expect(ctrl.duplicateOpportunityId).toEqual('cheese');
    });
  });
  describe('[nb.addDuplicateOpportunityId]', function() {
    beforeEach(function() {
      spyOn(targetListService, 'addTargetListOpportunities').and.callFake(function() {
        return {
          then: function(callback) { return callback([0, 1, 2]); }
        };
      });
    });
    it('should close the dialog', function() {
      spyOn($mdDialog, 'hide').and.callThrough();
      ctrl.addDuplicateOpportunityId();
      expect(ctrl.cachedTargetList).toEqual('');
      expect(ctrl.cachedTargetList).toEqual('');
      expect($mdDialog.hide).toHaveBeenCalled();
    });
    it('should close the dialog with an ID', function() {
      spyOn($mdDialog, 'hide').and.callThrough();
      ctrl.addDuplicateOpportunityId('990');
      expect(ctrl.cachedTargetList).toEqual('');
      expect(ctrl.currentOpportunityId).toEqual('');
      expect($mdDialog.hide).toHaveBeenCalled();
      expect(targetListService.addTargetListOpportunities).toHaveBeenCalled();
    });
  });
  describe('[nb.showImpact]', function() {
    it('should return High for H', function() {
      var response = ctrl.showImpact('H');
      expect(response).toEqual('High');
    });
    it('should return Medium for M', function() {
      var response = ctrl.showImpact('M');
      expect(response).toEqual('Medium');
    });
    it('should return low for everything else', function() {
      var response = ctrl.showImpact('R');
      expect(response).toEqual('Low');
    });
  });
  describe('[nb.getDismissedOpportunity]', function() {
    beforeEach(function() {
      spyOn(opportunitiesService, 'getOpportunities').and.callFake(function() {
        return {
          then: function(callback) { return callback([{dateUpdated: '05 October 2011 14:48 UTC'}]); }
        };
      });
    });
    it('should format the date', function() {
      expect(ctrl.dateUpdated).toBeUndefined;
      ctrl.getDismissedOpportunity();
      expect(ctrl.dateUpdated).toEqual('10/5/2011');
    });
  });
  describe('[nb.unDismissOpportunity]', function() {
    beforeEach(function() {
      spyOn($mdDialog, 'hide').and.callThrough();
      spyOn(opportunitiesService, 'deleteOpportunityFeedback').and.callFake(function() {
        return {
          then: function(callback) { return callback({}); }
        };
      });
    });
    it('should close the modal', function() {
      ctrl.unDismissOpportunity('23123');
      expect($mdDialog.hide).toHaveBeenCalled();
    });
  });
  describe('[nb.addOpportunity]', function() {
    beforeEach(function() {
      spyOn(opportunitiesService, 'deleteOpportunityFeedback').and.callFake(function() {
        return {
          then: function(callback) { return callback({}); }
        };
      });
    });
    it('should return false if the form is invalid', function() {
      var targetLists = JSON.parse('[{"id":"4b41c525-7bc7-4e3e-9b93-6a717b3f3c5c","name":"Paul Test 1234","description":"","opportunities":0,"archived":false,"deleted":false,"opportunitiesSummary":{"storesCount":0,"opportunitiesCount":0,"closedOpportunitiesCount":0,"totalClosedDepletions":0},"createdAt":"2017-02-20 17:23:54.599","updatedAt":"2017-02-20 17:23:55.098","permissionLevel":"author","dateOpportunitiesUpdated":"2017-02-20 17:23:54.599","collaboratorPermissionLevel":"collaborate","lastViewed":null,"collaborators":[{"user":{"id":"5648","employeeId":"1012132","firstName":"FRED","lastName":"BERRIOS","email":"FRED.BERRIOS@CBRANDS.COM"},"permissionLevel":"author","lastViewed":"2017-02-21T17:21:20.079"}],"targetListAuthor":"current user","$$hashKey":"object:75"}]');
      ctrl.userService.model.targetLists = {owned: targetLists};
      ctrl.addOpportunityForm = {$invalid: true};
      var opportunity = ctrl.addOpportunity({properties: {targetList: '4b41c525-7bc7-4e3e-9b93-6a717b3f3c5c'}});
      expect(opportunity).toEqual(false);
    });
    it('should save the opportunity', function() {
      spyOn($mdDialog, 'hide').and.callThrough();
      var targetLists = JSON.parse('[{"id":"4b41c525-7bc7-4e3e-9b93-6a717b3f3c5c","name":"Paul Test 1234","description":"","opportunities":0,"archived":false,"deleted":false,"opportunitiesSummary":{"storesCount":0,"opportunitiesCount":0,"closedOpportunitiesCount":0,"totalClosedDepletions":0},"createdAt":"2017-02-20 17:23:54.599","updatedAt":"2017-02-20 17:23:55.098","permissionLevel":"author","dateOpportunitiesUpdated":"2017-02-20 17:23:54.599","collaboratorPermissionLevel":"collaborate","lastViewed":null,"collaborators":[{"user":{"id":"5648","employeeId":"1012132","firstName":"FRED","lastName":"BERRIOS","email":"FRED.BERRIOS@CBRANDS.COM"},"permissionLevel":"author","lastViewed":"2017-02-21T17:21:20.079"}],"targetListAuthor":"current user","$$hashKey":"object:75"}]');
      ctrl.userService.model.targetLists = {owned: targetLists};
      ctrl.addOpportunityForm = {$invalid: false};
      ctrl.chosenStoreObject = {id: '23423'};
      ctrl.chosenProductObject = {properties: {store: {id: '32434'}, product: {type: 'testing'}, distribution: {type: ''}}};
      var opportunity = ctrl.addOpportunity({id: '4b41c525-7bc7-4e3e-9b93-6a717b3f3c5c', properties: {impact: {enum: ''}, rationale: {other: ''}, store: {id: '234234'}, distributionType: {type: ''}, product: {type: 'test'}, targetList: '4b41c525-7bc7-4e3e-9b93-6a717b3f3c5c'}});
      expect($mdDialog.hide).toHaveBeenCalled();
      expect(opportunity).toEqual(undefined);
      expect(ctrl.cachedOpportunity).toEqual(JSON.parse('{"properties":{"product":{"type":"sku"},"distributionType":{"type":"new"}}}'));

    });
  });
  describe('[nb.closeMenus]', function() {
    it('should save the opportunity', function() {
      spyOn($mdMenu, 'hide').and.callThrough();
      spyOn($mdSelect, 'hide').and.callThrough();
      ctrl.closeMenus({relatedTarget: null});
      expect($mdMenu.hide).toHaveBeenCalled();
      expect($mdSelect.hide).toHaveBeenCalled();
    });
  });
});
