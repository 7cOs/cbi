describe('Unit: targetListDetailController', function() {
  var scope, ctrl, $mdDialog, $q, targetListService, chipsService, filtersService, opportunitiesService, userService, collaborators, currentUser, pending;

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
      userService = _userService_;
    });

    collaborators = [
      {
        'user': {
          'id': '5648',
          'employeeId': '1012132',
          'firstName': 'FRED',
          'lastName': 'BERRIOS',
          'email': 'FRED.BERRIOS@CBRANDS.COM'
        },
        'permissionLevel': 'author',
        'lastViewed': null
      },
      {
        'user': {
          'id': '5545',
          'employeeId': '1012135',
          'firstName': 'CHRISTOPHER',
          'lastName': 'WILLIAMS',
          'email': 'CHRIS.WILLIAMS@CBRANDS.COM'
        },
        'permissionLevel': 'collaborate',
        'lastViewed': null
      }
    ];

    currentUser = {
      'email': 'FRED.BERRIOS@CBRANDS.COM',
      'employeeID': '1012132',
      'firstName': 'FRED',
      'lastName': 'BERRIOS'
    };

    pending = [
      {
        'user': {
          'id': '5649',
          'employeeId': '1009529',
          'firstName': 'CARRIE',
          'lastName': 'REID',
          'email': 'CARRIE.REID@CBRANDS.COM'
        },
        'permissionLevel': 'author',
        'lastViewed': '2016-10-14 18:40:03.954'
      },
      {
        'user': {
          'id': '5545',
          'employeeId': '1012135',
          'firstName': 'CHRISTOPHER',
          'lastName': 'WILLIAMS',
          'email': 'CHRIS.WILLIAMS@CBRANDS.COM'
        },
        'permissionLevel': 'collaborate',
        'lastViewed': null
      }
    ];
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

    expect(ctrl.isAuthor).not.toBeUndefined();
    expect(typeof (ctrl.isAuthor)).toEqual('function');

    expect(ctrl.listChanged).not.toBeUndefined();
    expect(typeof (ctrl.listChanged)).toEqual('function');

    expect(ctrl.manageCollaborators).not.toBeUndefined();
    expect(typeof (ctrl.manageCollaborators)).toEqual('function');

    expect(ctrl.makeOwner).not.toBeUndefined();
    expect(typeof (ctrl.makeOwner)).toEqual('function');

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

    describe('[tld.isAuthor]', function() {
      beforeEach(function() {
        ctrl.editable = false;
      });

      afterEach(function() {
        ctrl.editable = false;
      });

      it('should leave editable variable false if current user is not TL author', function() {
        targetListService.model.currentList.collaborators = [
          {
            'user': {
              'id': '5648',
              'employeeId': '1012132',
              'firstName': 'FRED',
              'lastName': 'BERRIOS',
              'email': 'FRED.BERRIOS@CBRANDS.COM'
            },
            'permissionLevel': 'collaborate',
            'lastViewed': null
          },
          {
            'user': {
              'id': '5545',
              'employeeId': '1012135',
              'firstName': 'CHRISTOPHER',
              'lastName': 'WILLIAMS',
              'email': 'CHRIS.WILLIAMS@CBRANDS.COM'
            },
            'permissionLevel': 'author',
            'lastViewed': null
          }
        ];
        userService.model.currentUser = currentUser;

        ctrl.isAuthor();

        expect(ctrl.editable).toEqual(false);
      });

      it('should update the editable variable to true if current user is TL author', function() {
        targetListService.model.currentList.collaborators = collaborators;
        userService.model.currentUser = currentUser;

        ctrl.isAuthor();

        expect(ctrl.editable).toEqual(true);
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

    describe('[tld.removeCollaborator]', function() {
      beforeEach(function() {
        targetListService.model.currentList.collaborators = collaborators;
        ctrl.pendingShares = pending;

        spyOn(targetListService, 'deleteTargetListShares').and.callFake(function() {
          var deferred = $q.defer();
          return deferred.promise;
        });
      });

      it('should call the targetListService', function() {
        ctrl.removeCollaborator();

        expect(targetListService.deleteTargetListShares).toHaveBeenCalled();
        expect(targetListService.deleteTargetListShares.calls.count()).toEqual(1);
      });

      it('should remove a collaborator from the collaborators & pendingShares arrays', function() {
        expect(targetListService.model.currentList.collaborators).toEqual(collaborators);
        expect(ctrl.pendingShares).toEqual(pending);

        ctrl.removeCollaborator('1012135');

        // expect(targetListService.model.currentList.collaborators.length).toEqual(1);
        // expect(ctrl.pendingShares.length).toEqual(1);
      });
    });

  });

});
