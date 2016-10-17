describe('Unit: targetListDetailController', function() {
  var scope, ctrl, $mdDialog, $q, targetListService, chipsService, filtersService, opportunitiesService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.filters');
    angular.mock.module('cf.modules.targetListDetail');

    inject(function($rootScope, $controller, _$mdDialog_, _$window_, _$q_, _targetListService_, _chipsService_, _filtersService_, _opportunitiesService_, _userService_) {
      scope = $rootScope.$new();
      ctrl = $controller('targetListDetailController', {$scope: scope});
      $mdDialog = _$mdDialog_;
      $q = _$q_;
      targetListService = _targetListService_;
      chipsService = _chipsService_;
      filtersService = _filtersService_;
      opportunitiesService = _opportunitiesService_;
    });
  });

  it('should expose public services', function() {
    expect(ctrl.targetListService).not.toBeUndefined();
    expect(typeof (ctrl.targetListService)).toEqual('object');

    expect(ctrl.userService).not.toBeUndefined();
    expect(typeof (ctrl.userService)).toEqual('object');
  });

  it('should not expose private services', function() {
    expect(ctrl.chipsService).toBeUndefined();
    expect(ctrl.filtersService).toBeUndefined();
    expect(ctrl.opportunitiesService).toBeUndefined();
  });

  it('should have access to private services', function() {
    expect(chipsService).not.toBeUndefined();
    expect(filtersService).not.toBeUndefined();
    expect(opportunitiesService).not.toBeUndefined();
  });

  it('should expose public methods', function() {
    expect(ctrl.addCollaborators).not.toBeUndefined();
    expect(typeof (ctrl.addCollaborators)).toEqual('function');

    expect(ctrl.addCollaboratorClick).not.toBeUndefined();
    expect(typeof (ctrl.addCollaboratorClick)).toEqual('function');

    expect(ctrl.changeCollaboratorLevel).not.toBeUndefined();
    expect(typeof (ctrl.changeCollaboratorLevel)).toEqual('function');

    expect(ctrl.closeModal).not.toBeUndefined();
    expect(typeof (ctrl.closeModal)).toEqual('function');

    expect(ctrl.deleteList).not.toBeUndefined();
    expect(typeof (ctrl.deleteList)).toEqual('function');

    expect(ctrl.footerToast).not.toBeUndefined();
    expect(typeof (ctrl.footerToast)).toEqual('function');

    expect(ctrl.initTargetLists).not.toBeUndefined();
    expect(typeof (ctrl.initTargetLists)).toEqual('function');

    expect(ctrl.listChanged).not.toBeUndefined();
    expect(typeof (ctrl.listChanged)).toEqual('function');

    expect(ctrl.manageCollaborators).not.toBeUndefined();
    expect(typeof (ctrl.manageCollaborators)).toEqual('function');

    expect(ctrl.makeOwner).not.toBeUndefined();
    expect(typeof (ctrl.makeOwner)).toEqual('function');

    expect(ctrl.modalManageCollaborators).not.toBeUndefined();
    expect(typeof (ctrl.modalManageCollaborators)).toEqual('function');

    expect(ctrl.modalManageTargetList).not.toBeUndefined();
    expect(typeof (ctrl.modalManageTargetList)).toEqual('function');

    expect(ctrl.navigateToTL).not.toBeUndefined();
    expect(typeof (ctrl.navigateToTL)).toEqual('function');

    expect(ctrl.removeCollaborator).not.toBeUndefined();
    expect(typeof (ctrl.removeCollaborator)).toEqual('function');

    expect(ctrl.removeFooterToast).not.toBeUndefined();
    expect(typeof (ctrl.removeFooterToast)).toEqual('function');

    expect(ctrl.updateList).not.toBeUndefined();
    expect(typeof (ctrl.updateList)).toEqual('function');
  });

  describe('Public Methods', function() {
    describe('[tld.addCollaborators]', function() {
      beforeEach(function() {
        spyOn(targetListService, 'addTargetListShares').and.callFake(function() {
          var deferred = $q.defer();
          return deferred.promise;
        });

        ctrl.addCollaborators();
      });

      it('should call the Target List Service', function() {
        expect(targetListService.addTargetListShares).toHaveBeenCalled();
      });
    });

    describe('[tld.addCollaboratorClick]', function() {
      var result;

      beforeEach(function() {
        result = {
          employeeId: '321'
        };

        ctrl.changed = false;
        ctrl.addCollaboratorClick(result);
      });

      afterEach(function() {
        ctrl.changed = false;
      });

      it('should add a collaborator to the targetListShares array', function() {
        expect(ctrl.targetListShares.length).toEqual(1);
        expect(ctrl.targetListShares[0].employeeId).toEqual('321');
      });

      it('should add the collaborator share object to the pendingShares array', function() {
        expect(ctrl.pendingShares.length).toEqual(1);
        expect(ctrl.pendingShares[0].permissionLevel).toEqual('Collaborate');
      });

      it('should update the changed boolean to true', function() {
        expect(ctrl.changed).toEqual(true);
      });
    });

    describe('[tld.changeCollaboratorLevel]', function() {
      beforeEach(function() {
        spyOn(targetListService, 'updateTargetListShares').and.callFake(function() {
          var deferred = $q.defer();
          return deferred.promise;
        });

        ctrl.changeCollaboratorLevel();
      });

      it('should call the targetListService', function() {
        expect(targetListService.updateTargetListShares).toHaveBeenCalled();
      });
    });

    describe('[tld.closeModal]', function() {
      beforeEach(function() {
        spyOn($mdDialog, 'hide').and.callThrough();
      });

      it('should close an open modal', function() {
        ctrl.closeModal();

        expect($mdDialog.hide).toHaveBeenCalled();
        expect($mdDialog.hide.calls.count()).toEqual(1);
      });
    });

    describe('[tld.modalManageCollaborators]', function() {
      beforeEach(function() {
        spyOn($mdDialog, 'show').and.callThrough();
      });

      it('should open the manage collaborators modal', function() {
        ctrl.modalManageCollaborators();

        expect($mdDialog.show).toHaveBeenCalled();
        expect($mdDialog.show.calls.count()).toEqual(1);
      });
    });

    describe('[tld.modalManageTargetList]', function() {
      beforeEach(function() {
        spyOn($mdDialog, 'show').and.callThrough();
      });

      it('should open the manage target list modal', function() {
        ctrl.modalManageTargetList();

        expect($mdDialog.show).toHaveBeenCalled();
        expect($mdDialog.show.calls.count()).toEqual(1);
      });
    });

    describe('[tld.listChanged]', function() {
      it('should change the "changed" value to true', function() {
        beforeEach(function() {
          ctrl.changed = false;
        });

        ctrl.listChanged();

        expect(ctrl.changed).toEqual(true);
      });
    });

  });

});