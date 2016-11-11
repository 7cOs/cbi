describe('Unit: targetListDetailController', function() {
  var scope, ctrl, $mdDialog, $q, $httpBackend, targetListService, chipsService, filtersService, opportunitiesService, userService, collaborators, currentUser, pending, ownedTargetLists;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.filters');
    angular.mock.module('cf.modules.targetListDetail');

    inject(function($rootScope, $controller, _$mdDialog_, _$window_, _$q_, _$httpBackend_, _targetListService_, _chipsService_, _filtersService_, _opportunitiesService_, _userService_) {
      scope = $rootScope.$new();
      ctrl = $controller('targetListDetailController', {$scope: scope});
      $mdDialog = _$mdDialog_;
      $q = _$q_;
      $httpBackend = _$httpBackend_;
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
        'employee': {
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
        'employee': {
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

    ownedTargetLists = {
      'owned': [
        {
          'id': '1',
          'name': 'No....this james archived list',
          'description': '',
          'opportunities': 27,
          'archived': false,
          'deleted': false,
          'opportunitiesSummary': {
            'storesCount': 1,
            'opportunitiesCount': 27,
            'closedOpportunitiesCount': 0,
            'totalClosedDepletions': 0
          },
          'createdAt': '2016-11-10 23:39:17.063',
          'permissionLevel': 'author',
          'dateOpportunitiesUpdated': '2016-11-10 23:39:34.848',
          'collaborators': [
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
          ]
        },
        {
          'id': '53bd39e4-d834-4d0e-87f3-e00f90001b27',
          'name': 'James Archived List Test',
          'description': 'Selling beer is hard work, but the samples are great.',
          'opportunities': 0,
          'archived': false,
          'deleted': false,
          'opportunitiesSummary': {
            'storesCount': 0,
            'opportunitiesCount': 0,
            'closedOpportunitiesCount': 0,
            'totalClosedDepletions': 0
          },
          'createdAt': '2016-11-10 22:44:28.709',
          'permissionLevel': 'author',
          'dateOpportunitiesUpdated': null,
          'collaborators': [
            {
              'user': {
                'id': '5660',
                'employeeId': '1010332',
                'firstName': 'JONES SHANNON',
                'lastName': 'TILLEY',
                'email': 'SHANNON.TILLEYJONES@CBRANDS.COM'
              },
              'permissionLevel': 'collaborate',
              'lastViewed': null
            },
            {
              'user': {
                'id': '5648',
                'employeeId': '1012132',
                'firstName': 'FRED',
                'lastName': 'BERRIOS',
                'email': 'FRED.BERRIOS@CBRANDS.COM'
              },
              'permissionLevel': 'author',
              'lastViewed': '2016-11-10 23:37:54.639'
            }
          ]
        }
      ]
    };
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

    expect(ctrl.permissionLabel).not.toBeUndefined();
    expect(typeof (ctrl.permissionLabel)).toEqual('function');

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

    describe('[tld.footerToast]', function() {
      beforeEach(function() {
        ctrl.showToast = ctrl.deleting = ctrl.archiving = ctrl.leave = false;
      });

      it('should update showToast to true', function() {
        ctrl.footerToast();
        expect(ctrl.showToast).toBe(true);
      });

      it('should update deleting boolean to true', function() {
        ctrl.footerToast('delete');
        expect(ctrl.deleting).toBe(true);
      });

      it('should not update deleting boolean when not given as parameter', function() {
        ctrl.footerToast('archive');
        expect(ctrl.deleting).toBe(false);
      });

      it('should update archiving boolean to true', function() {
        ctrl.footerToast('archive');
        expect(ctrl.archiving).toBe(true);
      });

      it('should not update archiving boolean when not given as parameter', function() {
        ctrl.footerToast('delete');
        expect(ctrl.archiving).toBe(false);
      });

      it('should update leave boolean to true', function() {
        ctrl.footerToast('leave');
        expect(ctrl.leave).toBe(true);
      });

      it('should not update leave boolean when not given as parameter', function() {
        ctrl.footerToast('archive');
        expect(ctrl.leave).toBe(false);
      });
    });

    describe('[tld.makeOwner]', function() {
      beforeEach(function() {
        targetListService.model.currentList.collaborators = collaborators;
        targetListService.model.currentList.id = 1;
        userService.model.currentUser.employeeID = '1012132';
        userService.model.targetLists = ownedTargetLists;

        // init stuff that we dont care about - we dont need one for /api/targetLists/1 because real service is never actually called
        $httpBackend.expectGET('/api/targetLists/undefined').respond(200);
        $httpBackend.expectGET('/api/targetLists/undefined/opportunities').respond(200);
      });

      it('should call the service and run .then()', function() {
        // create promise and spy on service.method
        var deferred = $q.defer();
        spyOn(targetListService, 'updateTargetList').and.callFake(function() {
          return deferred.promise;
        });

        expect(targetListService.updateTargetList).not.toHaveBeenCalled();
        expect(targetListService.model.currentList.collaborators[0].permissionLevel).toEqual('author');
        expect(targetListService.model.currentList.collaborators[1].permissionLevel).toEqual('collaborate');

        ctrl.makeOwner('1012135');

        // resolve promise so we can trigger then
        deferred.resolve();
        // trigger promise resolution
        scope.$digest();

        expect(targetListService.updateTargetList).toHaveBeenCalledWith(1, {'newOwnerUserId': '1012135'});
        expect(targetListService.model.currentList.collaborators[0].permissionLevel).toEqual('collaborate');
        expect(targetListService.model.currentList.collaborators[1].permissionLevel).toEqual('author');
      });

      it('should clear the selectedCollaboratorId', function() {
        ctrl.selectedCollaboratorId = '1234';
        ctrl.makeOwner('1012135');
        expect(ctrl.selectedCollaboratorId).toEqual('');
      });

      afterEach(function() {
        // reset stuff we changed
        targetListService.model.currentList.collaborators = collaborators;
        userService.model.targetLists = ownedTargetLists;
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

    describe('[tld.permissionLabel]', function() {
      it('should return "owner" if the permissionLevel is "author"', function() {
        expect(ctrl.permissionLabel('author')).toEqual('owner');
      });

      it('should return "collaborator" if the permissionLevel is "collaborate"', function() {
        expect(ctrl.permissionLabel('collaborate')).toEqual('collaborator');
      });

      it('should return "collaborator" if the permissionLevel is "collaborateandinvite"', function() {
        expect(ctrl.permissionLabel('collaborateandinvite')).toEqual('collaborator');
      });

      it('should return "collaborator" if the permissionLevel is null', function() {
        expect(ctrl.permissionLabel(null)).toEqual('collaborator');
      });
    });

    describe('[tld.removeCollaborator]', function() {
      beforeEach(function() {
        targetListService.model.currentList.collaborators = collaborators;
        targetListService.model.currentList.id = 1;

        ctrl.pendingShares = pending;
        ctrl.leave = false;

        // init stuff that we dont care about - we dont need one for /api/targetLists/1 because real service is never actually called
        $httpBackend.expectGET('/api/targetLists/undefined').respond(200);
        $httpBackend.expectGET('/api/targetLists/undefined/opportunities').respond(200);
      });

      it('should call the service and run the script in .then()', function() {
        // create promise and spy on service.method
        var deferred = $q.defer();
        spyOn(targetListService, 'deleteTargetListShares').and.callFake(function() {
          return deferred.promise;
        });

        // make sure everything is how we want it on start
        expect(targetListService.deleteTargetListShares).not.toHaveBeenCalled();
        expect(targetListService.model.currentList.collaborators.length).toEqual(2);
        expect(ctrl.pendingShares.length).toEqual(2);

        // run method
        ctrl.removeCollaborator('1012135');

        // resolve promise so we can trigger then
        deferred.resolve();
        // trigger promise resolution
        scope.$digest();

        // assert that everything we wanted to happen has happened, and things we didnt want to happen havent happened
        expect(targetListService.deleteTargetListShares).toHaveBeenCalledWith(1, '1012135');
        expect(targetListService.model.currentList.collaborators.length).toEqual(1);
        expect(ctrl.pendingShares.length).toEqual(1);
        expect(ctrl.leave).toBe(true);
      });

      afterEach(function() {
        // reset stuff we changed
        targetListService.model.currentList.collaborators = collaborators;
        ctrl.pendingShares = pending;
      });
    });

  });

});
