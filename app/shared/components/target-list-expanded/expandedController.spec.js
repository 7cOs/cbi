const listsApiServiceMock = require('../../../services/api/v3/lists-api.service.mock').listApiServiceMock;
const listsTransformerServiceMock = require('../../../services/lists-transformer.service.mock').listsTransformerServiceMock;

describe('Unit: expanded target list controller', function() {
  let ctrl, state, scope, mdDialog, httpBackend, provide, userService, q, analyticsService, compassModalService, listsApiService, listsTransformerService;

  beforeEach(angular.mock.module(function(_$provide_) {
    provide = _$provide_;
  }));

  beforeEach(function() {
    listsApiService = listsApiServiceMock;
    listsTransformerService = listsTransformerServiceMock;

    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.expanded');

    angular.mock.module(($provide) => {
      analyticsService = {
        trackEvent: () => {}
      };
      compassModalService = {
        showAlertModalDialog: () => {}
      };
      $provide.value('analyticsService', analyticsService);
      $provide.value('compassModalService', compassModalService);
      $provide.value('listsApiService', listsApiService);
      $provide.value('listsTransformerService', listsTransformerService);
    });

    inject(function($controller, $rootScope, _$mdDialog_, _$q_, _$http_, _$httpBackend_, _$timeout_, _userService_, _toastService_, _listsApiService_, _listsTransformerService_) {
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
      listsApiService = _listsApiService_;
      listsTransformerService = _listsTransformerService_;
      mdDialog = _$mdDialog_;
      httpBackend = _$httpBackend_;
      userService = _userService_;
      q = _$q_;

      ctrl = $controller('expandedController', {$scope: scope, $state: state});
    });
  });

  it('should expose public services', function() {
    expect(ctrl.userService).not.toBeUndefined();
    expect(typeof (ctrl.userService)).toEqual('object');

    expect(ctrl.loaderService).not.toBeUndefined();
    expect(typeof (ctrl.loaderService)).toEqual('object');
  });

  it('should expose public methods', function() {
    expect(ctrl.addCollaborator).not.toBeUndefined();
    expect(typeof (ctrl.addCollaborator)).toEqual('function');

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

    expect(ctrl.findTargetListAuthor).not.toBeUndefined();
    expect(typeof (ctrl.findTargetListAuthor)).toEqual('function');

    expect(ctrl.isChecked).not.toBeUndefined();
    expect(typeof (ctrl.isChecked)).toEqual('function');

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

    expect(ctrl.toggleAll).not.toBeUndefined();
    expect(typeof (ctrl.toggleAll)).toEqual('function');
  });

  describe('Public Methods', function() {
    describe('[expanded.addCollaborator]', function() {
      var user = {
        'id': '5648',
        'employeeId': '1012132',
        'firstName': 'FRED',
        'lastName': 'BERRIOS',
        'email': 'FRED.BERRIOS@CBRANDS.COM'
      };

      it('should add collaborators to the newList object', function() {
        expect(ctrl.newList.collaborators.length).toEqual(0);
        ctrl.addCollaborator(user);
        expect(ctrl.newList.collaborators.length).toEqual(1);
      });

      it('should add a share object to the targetListShares array', function() {
        expect(ctrl.newList.targetListShares.length).toEqual(0);
        ctrl.addCollaborator(user);
        expect(ctrl.newList.targetListShares.length).toEqual(1);
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

    describe('[expanded.selector]', function() {
      it('should should reset selected and button state', function() {
        ctrl.selected = ['testing'];
        ctrl.buttonState = 'testing';
        expect(ctrl.selected).toEqual(['testing']);

        ctrl.selector('madeUp');
        expect(ctrl.selected).toEqual([]);
        expect(ctrl.buttonState).toEqual('madeUp');

      });
    });

    describe('[expanded.sortBy]', function() {
      it('should set the sort property to name', function() {
        ctrl.sortProperty = '';
        ctrl.listChevron = false;
        ctrl.collaboratorsChevron = false;
        ctrl.lastUpdatedChevron = false;
        ctrl.closedOpportunitiesChevron = false;
        ctrl.totalOpportunitesChevron = false;
        ctrl.depletionsChevron = false;
        expect(ctrl.sortProperty).toEqual('');
        expect(ctrl.listChevron).toEqual(false);
        expect(ctrl.collaboratorsChevron).toEqual(false);
        expect(ctrl.lastUpdatedChevron).toEqual(false);
        expect(ctrl.closedOpportunitiesChevron).toEqual(false);
        expect(ctrl.totalOpportunitesChevron).toEqual(false);
        expect(ctrl.depletionsChevron).toEqual(false);

        ctrl.sortBy('name');
        expect(ctrl.sortProperty).toEqual('name');
        expect(ctrl.listChevron).toEqual(true);
        expect(ctrl.collaboratorsChevron).toEqual(false);
        expect(ctrl.lastUpdatedChevron).toEqual(false);
        expect(ctrl.closedOpportunitiesChevron).toEqual(false);
        expect(ctrl.totalOpportunitesChevron).toEqual(false);
        expect(ctrl.depletionsChevron).toEqual(false);
      });

      it('should reverse the current property', function() {
        ctrl.sortProperty = 'name';
        ctrl.reverse = false;
        expect(ctrl.sortProperty).toEqual('name');
        expect(ctrl.reverse).toEqual(false);

        ctrl.sortBy('name');
        expect(ctrl.reverse).toEqual(true);
        expect(ctrl.sortProperty).toEqual('name');
      });
    });

    describe('[expanded.toggleAll]', function() {
      it('should toggle all (remove) for named', function() {
        ctrl.selected = [0, 1, 2, 3];
        ctrl.userService.model.targetLists = {ownedNotArchivedTargetLists: [0, 1, 2, 3]};
        expect(ctrl.selected.length).toEqual(4);

        ctrl.toggleAll('named');

        expect(ctrl.selected.length).toEqual(0);

      });

      it('should toggle all for named where selected length is zero', function() {
        ctrl.selected = [];
        ctrl.userService.model.targetLists = {ownedNotArchivedTargetLists: [0]};
        expect(ctrl.selected.length).toEqual(0);

        ctrl.toggleAll('named');

        expect(ctrl.selected.length).toEqual(1);
      });
      it('should toggle all (remove) for archived', function() {
        ctrl.selected = [0, 1, 2, 3];
        ctrl.userService.model.targetLists = {archived: [0, 1, 2, 3]};
        expect(ctrl.selected.length).toEqual(4);

        ctrl.toggleAll('archived');

        expect(ctrl.selected.length).toEqual(0);

      });

      it('should toggle all for archived where selected length is zero', function() {
        ctrl.selected = [];
        ctrl.userService.model.targetLists = {archived: [0]};
        expect(ctrl.selected.length).toEqual(0);

        ctrl.toggleAll('archived');

        expect(ctrl.selected.length).toEqual(1);
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

    describe('[expanded.exists]', function() {
      var sampleList = [0, 1, 2, 3];
      it('should return true if the item exists', function() {
        var existResult = ctrl.exists(0, sampleList);
        expect(existResult).toEqual(true);
      });

      it('should return false if the item does not exist', function() {
        var existResult = ctrl.exists(4, sampleList);
        expect(existResult).toEqual(false);
      });
    });
    describe('[expanded.ratio]', function() {
      it('should return the calculated ratio', function() {
        var ratioResult = ctrl.ratio(15, 15);
        expect(ratioResult).toEqual(100);
      });
    });
    describe('[expanded.searchOpportunities]', function() {
      // fill in
    });

    describe('[expanded.toggle]', function() {
      it('should add the item to the list', function() {
        var list = [0, 1, 2];
        var item = 3;
        ctrl.toggle(item, list);
        var listResult = [0, 1, 2, 3];
        expect(list).toEqual(listResult);
      });
      it('should remove the item from the list', function() {
        var list = [0, 1, 2];
        var item = 2;
        ctrl.toggle(item, list);
        var listResult = [0, 1];
        expect(list).toEqual(listResult);
      });
    });
    describe('[expanded.isChecked]', function() {
      it('should return false if targetLists is empty', function() {
        expect(ctrl.userService.model.targetLists).toEqual(null);
        var checked = ctrl.isChecked();
        expect(checked).toEqual(false);
      });

      it('should return true if targetLists is populated', function() {
        ctrl.userService.model.targetLists = {};
        ctrl.userService.model.targetLists.ownedNotArchivedTargetLists = [0, 1, 2];
        ctrl.selected = [0, 1, 2];

        var checked = ctrl.isChecked();
        expect(checked).toEqual(true);
      });
    });
    describe('[expanded.isCheckedArchived]', function() {
      it('should return false if targetLists is not populated', function() {
        expect(ctrl.userService.model.targetLists).toEqual(null);
        var archived = ctrl.isCheckedArchived();
        expect(archived).toEqual(false);
      });

      it('should return true if targetLists is populated', function() {
        ctrl.userService.model.targetLists = {archived: [0, 1]};
        ctrl.selected = [0, 1];
        var archived = ctrl.isCheckedArchived();
        expect(archived).toEqual(true);
      });
    });

    describe('[expanded.saveNewList]', function() {
      beforeEach(() => {
        const deferred = q.defer();
        deferred.resolve({id: '998877'});
        spyOn(listsApiService, 'createListPromise').and.returnValue(deferred.promise);
      });

      it('should return null if character length is greater than fourty', function() {
        ctrl.newList.name = 'This name is way way too long to be saved';
        expect(ctrl.newList.name.length).toBeGreaterThan(39);
        var newList = ctrl.saveNewList();
        expect(newList).toBe(undefined);
      });

      it('should save new list and send analytics event', function(done) {
        ctrl.newList = {
          name: 'Standard Name',
          description: '',
          opportunities: [],
          collaborators: [
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
            }]
        };

        userService.model.targetLists = {
         ownedNotArchivedTargetLists: [{
         archived: false,
         collaborators: [],
         id: '4567'
        }]};

        expect(ctrl.newList.name.length).toBeLessThan(40);

        spyOn(analyticsService, 'trackEvent');

        ctrl.saveNewList();
        scope.$apply();

        expect(listsApiService.createListPromise).toHaveBeenCalled();
        expect(analyticsService.trackEvent).toHaveBeenCalledWith('Lists - My Lists', 'Create List', '998877');
        expect(ctrl.buttonDisabled).toEqual(false);
        done();
    });
    });

    describe('[expanded.deleteTargetList]', function() {
      var singleCollaborator;
      beforeEach(function() {
        provide.decorator('$timeout', function($delegate) {
          return jasmine.createSpy($delegate);
        });

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
        spyOn(compassModalService, 'showAlertModalDialog').and.callFake(() => {});
        httpBackend.expectGET('/v2/targetLists').respond(200);

        spyOn(analyticsService, 'trackEvent').and.callFake(() => {});
        spyOn(listsApiService, 'deleteListPromise').and.callFake(() => {});
      });

      it('deletes a list', function() {
        ctrl.selected = singleCollaborator;
        ctrl.deleteTargetList();
        expect(listsApiService.deleteListPromise).toHaveBeenCalled();
      });

      it('should return proper authors for each target list', function() {
        var collaboratorsTest = [
          {
            permissionLevel: 'collaborator',
            user: {
              firstName: 'NICK',
              lastName: 'BRADSHAW'
            }
          },
          {
            permissionLevel: 'author',
            user: {
              firstName: 'PETE',
              lastName: 'MITCHELL'
            }
          }
        ];

        expect(ctrl.findTargetListAuthor(collaboratorsTest)).toEqual('PETE MITCHELL');
      });
    });
  });
  describe('[unarchiveTargetList]', function() {
    it('should unarchive', function() {

     spyOn(analyticsService, 'trackEvent').and.callFake(() => {});
     spyOn(listsApiService, 'updateListPromise').and.callFake(() => {
        const defer = q.defer();
        defer.resolve();
        return defer.promise;
      });

      spyOn(listsApiService, 'getListsPromise').and.callFake(() => {
        return;
      });

      ctrl.selected = [{
        archived: true,
        collaborators: [],
        id: '1234',
        owner: {employeeId: 1234}
      }];
      userService.model.currentUser.employeeID = 1234;
      userService.model.targetLists = {};
      userService.model.targetLists = {
        archived: [{
          archived: true,
          collaborators: [],
          id: '1234',
          owner: { employeeId: 1234 }
         }],
        ownedArchived: 10,
        ownedNotArchived: 60,
        ownedNotArchivedTargetLists: []};
      ctrl.unarchiveTargetList();
      scope.$apply();

      expect(userService.model.targetLists.ownedArchived).toEqual(9);
      expect(userService.model.targetLists.ownedNotArchived).toEqual(61);
      expect(userService.model.targetLists.ownedNotArchivedTargetLists).toEqual([{ archived: false, collaborators: [  ], id: '1234', owner: { employeeId: 1234 } }]);
      expect(userService.model.targetLists.archived).toEqual([]);
      expect(ctrl.selected).toEqual([]);
      expect(analyticsService.trackEvent).toHaveBeenCalled();
    });
  });
});
