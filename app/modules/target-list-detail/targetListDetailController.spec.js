describe('Unit: targetListDetailController', function() {
  var scope, ctrl, $mdDialog, $q, $httpBackend, targetListService, chipsService, filtersService, opportunitiesService, userService, collaborators, currentUser, pending, ownedTargetLists, deferred, deleteTLDeferred, $state, analyticsService, title, compassModalService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.filters');
    angular.mock.module('cf.modules.targetListDetail');
    angular.mock.module(($provide) => {
      title = {
        setTitle: () => {}
      };
      $provide.value('title', title);
    });

    angular.mock.module(($provide) => {
      analyticsService = {
        trackEvent: () => {}
      };
      $provide.value('analyticsService', analyticsService);
    });

    angular.mock.module(($provide) => {
      compassModalService = {
        showAlertModalDialog: () => {}
      };
      $provide.value('compassModalService', compassModalService);
    });

    inject(function($rootScope, $controller, _$mdDialog_, _$window_, _$q_, _$httpBackend_, _targetListService_, _chipsService_, _filtersService_, _opportunitiesService_, _userService_, _$state_) {
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
      $state = _$state_;
    });

    deferred = $q.defer();
    deleteTLDeferred = $q.defer();

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
      },
      {
        'user': {
          'id': '1234',
          'employeeId': '112233',
          'firstName': 'SAM',
          'lastName': 'ADAMS',
          'email': 'SAM.ADAMS@CBRANDS.COM'
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
      },
      {
        'employee': {
          'id': '8585',
          'employeeId': '200',
          'firstName': 'FRANCIS SCOTT',
          'lastName': 'KEY',
          'email': 'FRANCIS.KEY@CBRANDS.COM'
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
          'permissionLevel': 'collaborate',
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
    expect(ctrl.addCollaborators).toBeUndefined();
  });

  it('should have access to private services', function() {
    expect(chipsService).not.toBeUndefined();
    expect(filtersService).not.toBeUndefined();
    expect(opportunitiesService).not.toBeUndefined();
  });

  it('should expose public methods', function() {
    expect(ctrl.addCollaboratorClick).not.toBeUndefined();
    expect(typeof (ctrl.addCollaboratorClick)).toEqual('function');

    expect(ctrl.changePermissionClick).not.toBeUndefined();
    expect(typeof (ctrl.changePermissionClick)).toEqual('function');

    expect(ctrl.closeModal).not.toBeUndefined();
    expect(typeof (ctrl.closeModal)).toEqual('function');

    expect(ctrl.deleteList).not.toBeUndefined();
    expect(typeof (ctrl.deleteList)).toEqual('function');

    expect(ctrl.enableButton).not.toBeUndefined();
    expect(typeof (ctrl.enableButton)).toEqual('function');

    expect(ctrl.findTargetListAuthor).not.toBeUndefined();
    expect(typeof (ctrl.findTargetListAuthor)).toEqual('function');

    expect(ctrl.footerToast).not.toBeUndefined();
    expect(typeof (ctrl.footerToast)).toEqual('function');

    expect(ctrl.initTargetLists).not.toBeUndefined();
    expect(typeof (ctrl.initTargetLists)).toEqual('function');

    expect(ctrl.isAuthor).not.toBeUndefined();
    expect(typeof (ctrl.isAuthor)).toEqual('function');

    expect(ctrl.listChanged).not.toBeUndefined();
    expect(typeof (ctrl.listChanged)).toEqual('function');

    expect(ctrl.makeOwner).not.toBeUndefined();
    expect(typeof (ctrl.makeOwner)).toEqual('function');

    expect(ctrl.modalManageTargetList).not.toBeUndefined();
    expect(typeof (ctrl.modalManageTargetList)).toEqual('function');

    expect(ctrl.navigateToTL).not.toBeUndefined();
    expect(typeof (ctrl.navigateToTL)).toEqual('function');

    expect(ctrl.pendingCheck).not.toBeUndefined();
    expect(typeof (ctrl.pendingCheck)).toEqual('function');

    expect(ctrl.permissionLabel).not.toBeUndefined();
    expect(typeof (ctrl.permissionLabel)).toEqual('function');

    expect(ctrl.removeCollaborator).not.toBeUndefined();
    expect(typeof (ctrl.removeCollaborator)).toEqual('function');

    expect(ctrl.removeCollaboratorClick).not.toBeUndefined();
    expect(typeof (ctrl.removeCollaboratorClick)).toEqual('function');

    expect(ctrl.removeFooterToast).not.toBeUndefined();
    expect(typeof (ctrl.removeFooterToast)).toEqual('function');

    expect(ctrl.updateList).not.toBeUndefined();
    expect(typeof (ctrl.updateList)).toEqual('function');

    expect(ctrl.sendGoogleAnalytics).not.toBeUndefined();
    expect(typeof (ctrl.sendGoogleAnalytics)).toEqual('function');
  });

  describe('Public Methods', function() {
    describe('[tld.addCollaboratorClick]', function() {
      var result;

      beforeEach(function() {
        result = {
          'id': '5649',
          'employeeId': '1009529',
          'firstName': 'CARRIE',
          'lastName': 'REID',
          'email': 'CARRIE.REID@CBRANDS.COM'
        };

        ctrl.changed = false;
        ctrl.addCollaboratorClick(result);
      });

      afterEach(function() {
        ctrl.changed = false;
      });

      it('should add a collaborator to the pendingShares array', function() {
        expect(ctrl.pendingShares.length).toEqual(1);
        expect(ctrl.pendingShares[0].employee.employeeId).toEqual('1009529');
      });

      it('should update the changed boolean to true', function() {
        expect(ctrl.changed).toEqual(true);
      });
    });

    describe('[tld.changePermissionClick]', function() {
      beforeEach(function() {
        ctrl.changed = false;
      });

      it('should return true if current list\'s permission level is "collaborateandinvite"', function() {
        targetListService.model.currentList.collaboratorPermissionLevel = 'collaborateandinvite';
        expect(ctrl.changePermissionClick()).toEqual(true);
      });

      it('should return false if current list\'s permission level is not "collaborateandinvite"', function() {
        targetListService.model.currentList.collaboratorPermissionLevel = 'collaborate';
        expect(ctrl.changePermissionClick()).toEqual(false);
      });

      it('should update the changed boolean to true', function() {
        expect(ctrl.changed).toEqual(false);
        ctrl.changePermissionClick();
        expect(ctrl.changed).toEqual(true);
      });
    });

    describe('[tld.closeModal]', function() {
      beforeEach(function() {
        spyOn($mdDialog, 'hide').and.callThrough();
        spyOn(ctrl, 'navigateToTL').and.callFake(function() {
          return true;
        });
        targetListService.model.currentList.name = 'Updated Name';
        targetListService.model.currentList.description = 'Updated Description';
        ctrl.originalList.name = 'Original Name';
        ctrl.originalList.description = 'Original Description';
        userService.model.currentUser = currentUser;
        targetListService.model.currentList.collaborators = collaborators;
      });

      afterEach(function() {
        targetListService.model.currentList.name = 'Updated Name';
        targetListService.model.currentList.description = 'Updated Description';
        ctrl.originalList.name = 'Original Name';
        ctrl.originalList.description = 'Original Description';
      });

      it('should close an open modal & stay on current page if user is still a collaborator', function() {
        expect(ctrl.stayOnPage).toEqual(true);
        ctrl.closeModal();

        expect(ctrl.stayOnPage).toEqual(true);
        expect($mdDialog.hide).toHaveBeenCalled();
        expect($mdDialog.hide.calls.count()).toEqual(1);
      });

      it('should close an open modal and navigateToTL if user is no longer a collaborator', function() {
        expect(ctrl.stayOnPage).toEqual(true);
        userService.model.currentUser.employeeID = '12345';
        ctrl.closeModal();

        expect(ctrl.stayOnPage).toEqual(false);
        expect(ctrl.navigateToTL).toHaveBeenCalled();
        expect(ctrl.navigateToTL.calls.count()).toEqual(1);
      });

      it('should revert the list name and description if passed true parameter', function() {
        ctrl.closeModal(true);

        expect(targetListService.model.currentList.name).toEqual('Original Name');
        expect(targetListService.model.currentList.description).toEqual('Original Description');
      });

      it('should retain the updates to the current list if true is not passed', function() {
        ctrl.closeModal();
        expect(targetListService.model.currentList.name).toEqual('Updated Name');
        expect(targetListService.model.currentList.description).toEqual('Updated Description');
      });

      it('should update the changed boolean to false', function() {
        ctrl.changed = true;
        ctrl.closeModal();
        expect(ctrl.changed).toEqual(false);
      });
    });

    describe('[tld.enableButton]', function() {
      it('should update closeButton to true if permissionLevel is collaborate', function() {
        targetListService.model.currentList.permissionLevel = 'collaborate';
        ctrl.enableButton();
        expect(ctrl.closeButton).toEqual(true);
        expect(ctrl.saveButton).toEqual(false);
      });

      it('should update saveButton to true if permissionLevel is not collaborate', function() {
        targetListService.model.currentList.permissionLevel = 'author';
        ctrl.enableButton();
        expect(ctrl.saveButton).toEqual(true);
        expect(ctrl.closeButton).toEqual(false);
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

    describe('[tld.findTargetListAuthor]', function() {
      it('should find the author', function() {
        var collaboratorsTest = [
          {
            permissionLevel: 'collaborator',
            user: {
              firstName: 'CHARLIE',
              lastName: 'BLACKWOOD'
            }
          },
          {
            permissionLevel: 'author',
            user: {
              firstName: 'RICK',
              lastName: 'NEVEN'
            }
          }
        ];

        expect(ctrl.findTargetListAuthor(collaboratorsTest)).toEqual('RICK NEVEN');
      });
    });

    describe('[tld.makeOwner]', function() {
      beforeEach(function() {
        targetListService.model.currentList.collaborators = collaborators;
        targetListService.model.currentList.id = 1;
        userService.model.currentUser.employeeID = currentUser.employeeID;
        userService.model.targetLists = ownedTargetLists;

        // init stuff that we dont care about - we dont need one for /v2/targetLists/1 because real service is never actually called
        $httpBackend.expectGET('/v2/targetLists/undefined').respond(200);
        $httpBackend.expectGET('/v2/targetLists/undefined/opportunities?limit=20&sort=segmentation:ascending&offset=0').respond(200);
        $httpBackend.expectPATCH('/v2/targetLists/undefined/shares').respond(200);
      });

      it('should call the service and run .then()', function() {
        $state.current.name = 'target-list-detail';
        expect($state.current.name).toEqual('target-list-detail');
        // create promise and spy on service.method
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
        ctrl.makeOwner(currentUser.employeeID);
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
        ctrl.pendingShares = [1, 2, 3];
        ctrl.pendingRemovals = [3, 2, 1];
        ctrl.originalList = {};
        targetListService.model.currentList = ownedTargetLists.owned[0];
      });

      afterEach(function() {
        ctrl.pendingShares = [1, 2, 3];
        ctrl.pendingRemovals = [3, 2, 1];
        ctrl.originalList = {};
        targetListService.model.currentList = ownedTargetLists.owned[0];
      });

      it('should open the manage target list modal', function() {
        ctrl.modalManageTargetList();
        expect($mdDialog.show).toHaveBeenCalled();
        expect($mdDialog.show.calls.count()).toEqual(1);
      });

      it('should update target list shares', () => {
        spyOn(targetListService, 'getTargetList').and.callFake(() => ({
            then: (callback) => { callback({archived: 'cheese, it is the best'}); }
          })
        );
        spyOn(targetListService, 'updateTargetListShares');
        ctrl.modalManageTargetList();
        expect(targetListService.updateTargetListShares).toHaveBeenCalled();
      });

      it('should reset pending shares & pending removals arrays', function() {
        ctrl.modalManageTargetList();
        expect(ctrl.pendingShares.length).toEqual(0);
        expect(ctrl.pendingRemovals.length).toEqual(0);
      });

      it('should set the original list object to that of the current target list', function() {
        expect(ctrl.originalList).toEqual({});
        ctrl.modalManageTargetList();
        expect(ctrl.originalList.name).toEqual('No....this james archived list');
      });
    });

    describe('[tld.isAuthor]', function() {
      beforeEach(function() {
        ctrl.editable = false;
      });

      afterEach(function() {
        ctrl.editable = false;
      });

      it('should leave editable variable false if list\'s permission level is not author', function() {
        targetListService.model.currentList = ownedTargetLists.owned[1];
        ctrl.isAuthor();
        expect(ctrl.editable).toEqual(false);
      });

      it('should update the editable variable to true if current list\'s permission level is author', function() {
        targetListService.model.currentList = ownedTargetLists.owned[0];
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

    describe('[tld.pendingCheck]', function() {

      beforeEach(function() {
        $httpBackend.expectGET('/v2/targetLists/undefined').respond(200);
        $httpBackend.expectGET('/v2/targetLists/undefined/opportunities?limit=20&sort=segmentation:ascending&offset=0').respond(200);
        $httpBackend.expectPATCH('/v2/targetLists/undefined/shares').respond(200);
        $httpBackend.expectDELETE('/v2/targetLists/undefined').respond(200);
      });

      it('should run removeCollaborator if there are pendingRemovals', function() {
        var deferredRemoveCollab = $q.defer();
        spyOn(ctrl, 'removeCollaborator').and.callFake(function() {
          return deferredRemoveCollab.promise;
        });
        ctrl.pendingRemovals = pending;
        ctrl.pendingCheck();
        deferredRemoveCollab.resolve();
        scope.$digest();
        expect(ctrl.removeCollaborator).toHaveBeenCalled();
      });

      it('should run deleteList if there are no pendingRemovals', function() {
        var deferredDeleteList = $q.defer();
        spyOn(ctrl, 'deleteList').and.callFake(function() {
          return deferredDeleteList.promise;
        });
        ctrl.pendingRemovals = [];
        ctrl.pendingCheck();
        deferredDeleteList.resolve();
        scope.$digest();
        expect(ctrl.deleteList).toHaveBeenCalled();
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
        ctrl.pendingRemovals = ['1012135', '112233'];

        // init stuff that we dont care about - we dont need one for /v2/targetLists/1 because real service is never actually called
        $httpBackend.expectGET('/v2/targetLists/undefined').respond(200);
        $httpBackend.expectGET('/v2/targetLists/undefined/opportunities?limit=20&sort=segmentation:ascending&offset=0').respond(200);
        $httpBackend.expectPATCH('/v2/targetLists/undefined/shares').respond(200);
        $httpBackend.expectDELETE('/v2/targetLists/undefined').respond(200);

        // create promise and spy on service.method
        spyOn(targetListService, 'deleteTargetListShares').and.callFake(function() {
          return deferred.promise;
        });
        spyOn(targetListService, 'deleteTargetList').and.callFake(function() {
          return deleteTLDeferred.promise;
        });
      });

      it('should call the service and run the script in .then()', function() {
        // make sure everything is how we want it on start
        expect(targetListService.deleteTargetListShares).not.toHaveBeenCalled();
        expect(targetListService.model.currentList.collaborators.length).toEqual(3);
        expect(ctrl.pendingRemovals.length).toEqual(2);
        expect(targetListService.deleteTargetList).not.toHaveBeenCalled();

        // run method
        ctrl.removeCollaborator(ctrl.pendingRemovals);

        // resolve promise so we can trigger then
        deferred.resolve();
        deleteTLDeferred.resolve();
        // trigger promise resolution
        scope.$digest();

        // assert that everything we wanted to happen has happened, and things we didnt want to happen havent happened
        expect(targetListService.deleteTargetListShares).toHaveBeenCalledWith(1, '1012135');
        expect(targetListService.deleteTargetListShares).toHaveBeenCalledWith(1, '112233');
        expect(targetListService.model.currentList.collaborators.length).toEqual(1);
      });

      it('should update the pendingShares array length', function() {
        expect(ctrl.pendingShares.length).toEqual(3);
        ctrl.removeCollaborator(ctrl.pendingRemovals);
        deferred.resolve();
        scope.$digest();
        expect(ctrl.pendingShares.length).toEqual(2);
      });

      it('should update the pendingRemovals array length', function() {
        expect(ctrl.pendingRemovals.length).toEqual(2);
        ctrl.removeCollaborator(ctrl.pendingRemovals);
        deferred.resolve();
        scope.$digest();
        expect(ctrl.pendingRemovals.length).toEqual(0);
      });

      it('should enable the close button if collaborator being removed is current user', function() {
        expect(ctrl.closeButton).toEqual(false);
        userService.model.currentUser.employeeID = '200';
        ctrl.removeCollaborator(['200']);
        deferred.resolve();
        scope.$digest();
        expect(ctrl.closeButton).toEqual(true);
      });

      it('should call the listChanged function', function() {
        spyOn(ctrl, 'listChanged').and.callThrough();
        ctrl.removeCollaborator(['200']);
        expect(ctrl.listChanged).toHaveBeenCalled();
      });

      afterEach(function() {
        // reset stuff we changed
        targetListService.model.currentList.collaborators = collaborators;
        ctrl.pendingShares = pending;
        ctrl.pendingRemovals = ['1012135', '112233'];
        ctrl.closeButton = false;
      });
    });

    describe('[tld.removeCollaboratorClick]', function() {
      var removeResult;

      beforeEach(function() {
        removeResult = '112233';
        targetListService.model.currentList.collaborators = collaborators;

        ctrl.changed = false;
      });

      afterEach(function() {
        ctrl.changed = false;
        targetListService.model.currentList.collaborators = collaborators;
      });

      it('should add a collaborator to the pendingRemovals array', function() {
        expect(ctrl.pendingRemovals.length).toEqual(0);
        ctrl.removeCollaboratorClick(removeResult);
        expect(ctrl.pendingRemovals.length).toEqual(1);
      });

      it('should update the current list\'s collaborator array to reflect pending change in UI', function() {
        expect(targetListService.model.currentList.collaborators.length).toEqual(3);
        ctrl.removeCollaboratorClick(removeResult);
        expect(targetListService.model.currentList.collaborators.length).toEqual(2);
      });

      it('should update the changed boolean to true', function() {
        ctrl.removeCollaboratorClick(removeResult);
        expect(ctrl.changed).toEqual(true);
      });
    });
    describe('[tld.deleteList]', function() {
      beforeEach(function() {
        spyOn(targetListService, 'deleteTargetList').and.callFake(function(callback) {
          return {
            then: function(callback) { return callback([0, 1, 2]); }
          };
        });
      });
      it('should open the toast', function() {
        ctrl.deleteList();
        expect(ctrl.confirmToast).toEqual(true);
      });
    });
    describe('[tld.initTargetLists]', function() {
      beforeEach(function() {
      });
      it('should init the list for author', function() {
         spyOn(targetListService, 'getTargetList').and.callFake(function(callback) {
          return {
            then: function(callback) { return callback({permissionLevel: 'author'}); }
          };
        });
        ctrl.initTargetLists();
        expect(ctrl.targetListAuthor).toEqual('current user');
      });
      it('should init the list for non-author', function() {
         spyOn(targetListService, 'getTargetList').and.callFake(function(callback) {
          return {
            then: function(callback) { return callback({archived: 'cheese, it is the best'}); }
          };
        });
        ctrl.initTargetLists();
        expect(ctrl.targetListAuthor).toEqual(undefined);
        expect(targetListService.model.currentList.archived).toEqual('cheese, it is the best');
      });
      it('should update target list shares', () => {
        spyOn(targetListService, 'getTargetList').and.callFake(() => ({
            then: (callback) => { callback({archived: 'cheese, it is the best'}); }
          })
        );
        spyOn(targetListService, 'updateTargetListShares');
        ctrl.initTargetLists();
        expect(targetListService.updateTargetListShares).toHaveBeenCalled();
      });
    });

    describe('[tld.modalUnauthorizedAccess]', function() {
      beforeEach(function() {
        spyOn($mdDialog, 'show').and.callThrough();
      });
      it('should show the dialog', function() {
        ctrl.modalUnauthorizedAccess();
        expect($mdDialog.show).toHaveBeenCalled();
      });
    });

    describe('[tld.updateList]', function() {
      describe('when the list author is the current user', function() {
        beforeEach(function() {
          ctrl.targetListAuthor = 'current user';
          targetListService.model.currentList.id = 1;

          $httpBackend.expectGET('/v2/targetLists/undefined').respond(200);
          $httpBackend.expectGET('/v2/targetLists/undefined/opportunities?limit=20&sort=segmentation:ascending&offset=0').respond(200);
          $httpBackend.expectPATCH('/v2/targetLists/undefined/shares').respond(200);

          spyOn(targetListService, 'updateTargetList').and.callFake(function() {
            return deferred.promise;
          });

          spyOn(ctrl, 'closeModal').and.callFake(function() {
            return true;
          });

          spyOn(ctrl, 'sendGoogleAnalytics').and.callFake(function() {
            return true;
          });

        });

        it('should call the update function in the service', function() {
          expect(targetListService.updateTargetList).not.toHaveBeenCalled();
          ctrl.updateList();
          deferred.resolve();
          scope.$digest();
          expect(targetListService.updateTargetList).toHaveBeenCalled();
        });

        it('should set the current list in the model to equal the api response data from the updateTargetList call', function() {
          targetListService.model.currentList = [];
          ctrl.updateList();
          deferred.resolve();
          scope.$digest();
          expect(targetListService.model.currentList).toEqual(deferred.resolve());
        });

        it('should call the changePermissionClick function', function() {
          spyOn(ctrl, 'changePermissionClick').and.callThrough();
          ctrl.updateList();
          expect(ctrl.changePermissionClick).toHaveBeenCalled();
        });

        it('should call the removeCollaborator function if there are pending removals', function() {
          var anotherDeferred = $q.defer();
          spyOn(ctrl, 'removeCollaborator').and.callFake(function() {
            return anotherDeferred.promise;
          });
          ctrl.pendingRemovals = pending;
          ctrl.updateList();
          deferred.resolve();
          anotherDeferred.resolve();
          scope.$digest();
          expect(ctrl.removeCollaborator).toHaveBeenCalled();
        });

        it('should call the removeFooterToast function', function() {
          spyOn(ctrl, 'removeFooterToast').and.callThrough();
          ctrl.updateList();
          deferred.resolve();
          scope.$digest();
          expect(ctrl.removeFooterToast).toHaveBeenCalled();
          expect(ctrl.removeFooterToast.calls.count()).toEqual(1);
        });

        it('should call the closeModal function', function() {
          ctrl.updateList();
          deferred.resolve();
          scope.$digest();
          expect(ctrl.closeModal).toHaveBeenCalled();
          expect(ctrl.closeModal.calls.count()).toEqual(1);
        });

        it('check if targetlist archive is recorded', () => {
          ctrl.updateList('Archive');
          deferred.resolve();
          scope.$digest();
          expect(ctrl.sendGoogleAnalytics).toHaveBeenCalled();
        });
      });

      describe('should record targelist GA event', () => {
        beforeEach(function () {
          spyOn(analyticsService, 'trackEvent');
        });

        it('check if targetlist archive is recorded', () => {
          ctrl.listID = '111';

          ctrl.sendGoogleAnalytics('Archive');
          expect(analyticsService.trackEvent).toHaveBeenCalledWith(
            'Target Lists - My Target Lists',
            'Archive Target List',
            '111'
          );
        });
      });

      describe('when the list author is not the current user', function() {
        beforeEach(function () {
          ctrl.targetListAuthor = 'other user';
          targetListService.model.currentList.id = 1;

          $httpBackend.expectGET('/v2/targetLists/undefined').respond(200);
          $httpBackend.expectGET('/v2/targetLists/undefined/opportunities?limit=20&sort=segmentation:ascending&offset=0').respond(200);
          $httpBackend.expectPATCH('/v2/targetLists/undefined/shares').respond(200);

          spyOn(targetListService, 'updateTargetList').and.callFake(function () {
            return deferred.promise;
          });

          spyOn(ctrl, 'closeModal').and.callFake(function () {
            return true;
          });
        });

        it('should not call the update function', function () {
          expect(targetListService.updateTargetList).not.toHaveBeenCalled();
          ctrl.updateList();
          deferred.resolve();
          scope.$digest();
          expect(targetListService.updateTargetList).not.toHaveBeenCalled();
        });

        it('should not call the removeCollaborator function even if there are pending removals', function() {
          var anotherDeferred = $q.defer();
          spyOn(ctrl, 'removeCollaborator').and.callFake(function() {
            return anotherDeferred.promise;
          });
          ctrl.pendingRemovals = pending;
          ctrl.updateList();
          deferred.resolve();
          anotherDeferred.resolve();
          scope.$digest();
          expect(ctrl.removeCollaborator).not.toHaveBeenCalled();
        });

        it('should call the removeFooterToast function', function() {
          spyOn(ctrl, 'removeFooterToast').and.callThrough();
          ctrl.updateList();
          deferred.resolve();
          scope.$digest();
          expect(ctrl.removeFooterToast).toHaveBeenCalled();
          expect(ctrl.removeFooterToast.calls.count()).toEqual(1);
        });

        it('should call the closeModal function', function() {
          ctrl.updateList();
          deferred.resolve();
          scope.$digest();
          expect(ctrl.closeModal).toHaveBeenCalled();
          expect(ctrl.closeModal.calls.count()).toEqual(1);
        });
      });

    });

  });
});

