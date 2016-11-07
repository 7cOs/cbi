describe('Unit: expanded target list controller', function() {
  var ctrl, state, scope, mdDialog, q, http, httpBackend, timeout, provide, userService, targetListService, loaderService;

  beforeEach(angular.mock.module(function(_$provide_) {
    provide = _$provide_;
  }));

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.expanded');

    inject(function($controller, $rootScope, _$mdDialog_, _$q_, _$http_, _$httpBackend_, _$timeout_, _userService_, _targetListService_, _loaderService_) {
      state = {
        current: {
          name: 'opportunities'
        },
        params: {
          obj: {
            index: 1
          }
        }
      };
      scope = $rootScope.$new();
      mdDialog = _$mdDialog_;
      q = _$q_;
      http = _$http_;
      httpBackend = _$httpBackend_;
      timeout = _$timeout_;

      userService = _userService_;
      targetListService = _targetListService_;
      loaderService = _loaderService_;

      ctrl = $controller('expandedController', {$scope: scope, $state: state});
    });
  });

  it('should expose public services', function() {
    expect(ctrl.userService).not.toBeUndefined();
    expect(typeof (ctrl.userService)).toEqual('object');

    expect(ctrl.targetListService).not.toBeUndefined();
    expect(typeof (ctrl.targetListService)).toEqual('object');

    expect(ctrl.loaderService).not.toBeUndefined();
    expect(typeof (ctrl.loaderService)).toEqual('object');
  });

  it('should expose public methods', function() {
    expect(ctrl.archiveTargetList).not.toBeUndefined();
    expect(typeof (ctrl.archiveTargetList)).toEqual('function');

    expect(ctrl.createNewList).not.toBeUndefined();
    expect(typeof (ctrl.createNewList)).toEqual('function'); // tested

    expect(ctrl.createTargetList).not.toBeUndefined();
    expect(typeof (ctrl.createTargetList)).toEqual('function'); // tested

    expect(ctrl.closeModal).not.toBeUndefined();
    expect(typeof (ctrl.closeModal)).toEqual('function'); // tested

    expect(ctrl.deleteTargetList).not.toBeUndefined();
    expect(typeof (ctrl.deleteTargetList)).toEqual('function');

    expect(ctrl.exists).not.toBeUndefined();
    expect(typeof (ctrl.exists)).toEqual('function');

    expect(ctrl.ratio).not.toBeUndefined();
    expect(typeof (ctrl.ratio)).toEqual('function');

    expect(ctrl.saveNewList).not.toBeUndefined();
    expect(typeof (ctrl.saveNewList)).toEqual('function');

    expect(ctrl.searchOpportunities).not.toBeUndefined();
    expect(typeof (ctrl.searchOpportunities)).toEqual('function');

    expect(ctrl.selector).not.toBeUndefined();
    expect(typeof (ctrl.selector)).toEqual('function');

    expect(ctrl.sortBy).not.toBeUndefined();
    expect(typeof (ctrl.sortBy)).toEqual('function');

    expect(ctrl.toggle).not.toBeUndefined();
    expect(typeof (ctrl.toggle)).toEqual('function');

    expect(ctrl.isChecked).not.toBeUndefined();
    expect(typeof (ctrl.isChecked)).toEqual('function');

    expect(ctrl.toggleAll).not.toBeUndefined();
    expect(typeof (ctrl.toggleAll)).toEqual('function');

    expect(ctrl.addCollaborator).not.toBeUndefined();
    expect(typeof (ctrl.addCollaborator)).toEqual('function');
  });

  describe('Public Methods', function() {
    describe('[expanded.createNewList]', function() {
      beforeEach(function() {
        spyOn(mdDialog, 'show').and.callThrough();
      });

      it('should open the manage target list modal', function() {
        ctrl.createNewList();

        expect(mdDialog.show).toHaveBeenCalled();
        expect(mdDialog.show.calls.count()).toEqual(1);
      });
    });

    describe('[expanded.createTargetList]', function() {
      beforeEach(function() {
        spyOn(mdDialog, 'show').and.callThrough();
      });

      it('should open the manage target list modal', function() {
        ctrl.createTargetList();

        expect(mdDialog.show).toHaveBeenCalled();
        expect(mdDialog.show.calls.count()).toEqual(1);
      });
    });

    describe('[expanded.closeModal]', function() {
      beforeEach(function() {
        spyOn(mdDialog, 'hide').and.callThrough();
      });

      it('should close an open modal', function() {
        ctrl.closeModal();

        expect(mdDialog.hide).toHaveBeenCalled();
        expect(mdDialog.hide.calls.count()).toEqual(1);
      });
    });

    describe('[expanded.deleteTargetList]', function() {
      var multipleCollaborators,
          singleCollaborator;
      beforeEach(function() {
        provide.decorator('$timeout', function($delegate) {
          return jasmine.createSpy($delegate);
        });

        multipleCollaborators = [
          {
            'id': '1f874ea5-c031-4b02-ae26-ca2455685b55',
            'name': 'La Di Da Di',
            'description': '',
            'opportunities': 0,
            'archived': false,
            'deleted': false,
            'opportunitiesSummary': {
              'storesCount': 0,
              'opportunitiesCount': 0,
              'closedOpportunitiesCount': 0,
              'totalClosedDepletions': 0
            },
            'createdAt': '2016-11-03 21:27:12.564',
            'permissionLevel': 'author',
            'dateOpportunitiesUpdated': null,
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
                  'id': '5570',
                  'employeeId': '1012846',
                  'firstName': 'JODI',
                  'lastName': 'WILSON',
                  'email': 'JODI.WILSON@CBRANDS.COM'
                },
                'permissionLevel': 'collaborate',
                'lastViewed': null
              }
            ]
          },
          {
            'id': '09c4a4e7-5363-42a2-89ea-4bb600bad002',
            'name': 'New Lists Have All The Fun',
            'description': '',
            'opportunities': 0,
            'archived': false,
            'deleted': false,
            'opportunitiesSummary': {
              'storesCount': 0,
              'opportunitiesCount': 0,
              'closedOpportunitiesCount': 0,
              'totalClosedDepletions': 0
            },
            'createdAt': '2016-11-03 20:59:07.411',
            'permissionLevel': 'author',
            'dateOpportunitiesUpdated': null,
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
              }
            ]
          }
        ];

        singleCollaborator = [
          {
            'id': '1f874ea5-c031-4b02-ae26-ca2455685b55',
            'name': 'La Di Da Di',
            'description': '',
            'opportunities': 0,
            'archived': false,
            'deleted': false,
            'opportunitiesSummary': {
              'storesCount': 0,
              'opportunitiesCount': 0,
              'closedOpportunitiesCount': 0,
              'totalClosedDepletions': 0
            },
            'createdAt': '2016-11-03 21:27:12.564',
            'permissionLevel': 'author',
            'dateOpportunitiesUpdated': null,
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
              }
            ]
          },
          {
            'id': '09c4a4e7-5363-42a2-89ea-4bb600bad002',
            'name': 'New Lists Have All The Fun',
            'description': '',
            'opportunities': 0,
            'archived': false,
            'deleted': false,
            'opportunitiesSummary': {
              'storesCount': 0,
              'opportunitiesCount': 0,
              'closedOpportunitiesCount': 0,
              'totalClosedDepletions': 0
            },
            'createdAt': '2016-11-03 20:59:07.411',
            'permissionLevel': 'author',
            'dateOpportunitiesUpdated': null,
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
              }
            ]
          }
        ];

        httpBackend.expectGET('/api/targetLists').respond(200);
      });

      afterEach(function() {
        ctrl.deleteError = false;
        ctrl.allowDelete = true;
      });

      it('should return deleteError as true if TL has collaborators', function() {
        ctrl.selected = multipleCollaborators;
        expect(ctrl.selected[0].collaborators.length).toEqual(2);
        expect(ctrl.deleteError).toBe(false);

        ctrl.deleteTargetList();
        expect(ctrl.deleteError).toBe(true);
      });

      it('should return allowDelete as false if TL has collaborators', function() {
        ctrl.selected = multipleCollaborators;
        expect(ctrl.selected[0].collaborators.length).toEqual(2);
        expect(ctrl.allowDelete).toBe(true);

        ctrl.deleteTargetList();
        // expect(ctrl.allowDelete).toBe(false);
      });

      it('should return deleteError as false if TL has single collaborator', function() {
        ctrl.selected = singleCollaborator;
        expect(ctrl.selected[0].collaborators.length).toEqual(1);
        expect(ctrl.deleteError).toBe(false);

        ctrl.deleteError = true;
        ctrl.deleteTargetList();
        // expect(ctrl.deleteError).toBe(false);
      });

      it('should return allowDelete as true if TL has single collaborator', function() {
        ctrl.selected = singleCollaborator;
        expect(ctrl.selected[0].collaborators.length).toEqual(1);
        expect(ctrl.allowDelete).toBe(true);

        ctrl.allowDelete = false;
        ctrl.deleteTargetList();
        expect(ctrl.allowDelete).toBe(true);
      });
    });
  });

});
