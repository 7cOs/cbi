describe('Unit: list controller', function() {
  var scope, ctrl, q, httpBackend, mdDialog, state, closedOpportunitiesService, filtersService, loaderService, opportunitiesService, storesService, targetListService, toastService, userService, filter;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('angulartics');
    angular.mock.module('cf.common.filters');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.list');

    inject(function($rootScope, _$q_, _$httpBackend_, _$mdDialog_, _$state_, $controller, _$filter_, _closedOpportunitiesService_, _filtersService_, _loaderService_, _opportunitiesService_, _storesService_, _targetListService_, _toastService_, _userService_) {
      scope = $rootScope.$new();
      q = _$q_;
      mdDialog = _$mdDialog_;
      state = _$state_;
      httpBackend = _$httpBackend_;
      filter = _$filter_;

      closedOpportunitiesService = _closedOpportunitiesService_;
      filtersService = _filtersService_;
      loaderService = _loaderService_;
      opportunitiesService = _opportunitiesService_;
      storesService = _storesService_;
      targetListService = _targetListService_;
      toastService = _toastService_;
      userService = _userService_;

      userService.model.currentUser.employeeID = 1;

      ctrl = $controller('listController', {$scope: scope});
    });
  });

  it('should expose public services', function() {
    expect(ctrl.filtersService).not.toBeUndefined();
    expect(typeof (ctrl.filtersService)).toEqual('object');

    expect(ctrl.opportunitiesService).not.toBeUndefined();
    expect(typeof (ctrl.opportunitiesService)).toEqual('object');

    expect(ctrl.userService).not.toBeUndefined();
    expect(typeof (ctrl.userService)).toEqual('object');
  });

  it('should expose public methods', function() {
    expect(ctrl.addCollaborator).not.toBeUndefined();
    expect(typeof (ctrl.addCollaborator)).toEqual('function');

    expect(ctrl.addToSharedCollaborators).not.toBeUndefined();
    expect(typeof (ctrl.addToSharedCollaborators)).toEqual('function');

    expect(ctrl.addToTargetList).not.toBeUndefined();
    expect(typeof (ctrl.addToTargetList)).toEqual('function');

    expect(ctrl.allOpportunitiesExpanded).not.toBeUndefined();
    expect(typeof (ctrl.allOpportunitiesExpanded)).toEqual('function');

    expect(ctrl.closeCreateTargetListModal).not.toBeUndefined();
    expect(typeof (ctrl.closeCreateTargetListModal)).toEqual('function');

    expect(ctrl.closeModal).not.toBeUndefined();
    expect(typeof (ctrl.closeModal)).toEqual('function');

    expect(ctrl.closeOrDismissOpportunity).not.toBeUndefined();
    expect(typeof (ctrl.closeOrDismissOpportunity)).toEqual('function');

    expect(ctrl.collapseCallback).not.toBeUndefined();
    expect(typeof (ctrl.collapseCallback)).toEqual('function');

    expect(ctrl.createNewList).not.toBeUndefined();
    expect(typeof (ctrl.createNewList)).toEqual('function');

    expect(ctrl.depletionsVsYaPercent).not.toBeUndefined();
    expect(typeof (ctrl.depletionsVsYaPercent)).toEqual('function');

    expect(ctrl.displayBrandIcon).not.toBeUndefined();
    expect(typeof (ctrl.displayBrandIcon)).toEqual('function');

    expect(ctrl.expandCallback).not.toBeUndefined();
    expect(typeof (ctrl.expandCallback)).toEqual('function');

    expect(ctrl.flattenOpportunity).not.toBeUndefined();
    expect(typeof (ctrl.flattenOpportunity)).toEqual('function');

    expect(ctrl.getDate).not.toBeUndefined();
    expect(typeof (ctrl.getDate)).toEqual('function');

    expect(ctrl.getMemos).not.toBeUndefined();
    expect(typeof (ctrl.getMemos)).toEqual('function');

    expect(ctrl.getTargetLists).not.toBeUndefined();
    expect(typeof (ctrl.getTargetLists)).toEqual('function');

    expect(ctrl.impactSort).not.toBeUndefined();
    expect(typeof (ctrl.impactSort)).toEqual('function');

    expect(ctrl.noOpportunitiesExpanded).not.toBeUndefined();
    expect(typeof (ctrl.noOpportunitiesExpanded)).toEqual('function');

    expect(ctrl.hasOpportunities).not.toBeUndefined();
    expect(typeof (ctrl.hasOpportunities)).toEqual('function');

    expect(ctrl.openDismissModal).not.toBeUndefined();
    expect(typeof (ctrl.openDismissModal)).toEqual('function');

    expect(ctrl.openShareModal).not.toBeUndefined();
    expect(typeof (ctrl.openShareModal)).toEqual('function');

    expect(ctrl.opportunityTypeOrSubtype).not.toBeUndefined();
    expect(typeof (ctrl.opportunityTypeOrSubtype)).toEqual('function');

    expect(ctrl.pageName).not.toBeUndefined();
    expect(typeof (ctrl.pageName)).toEqual('function');

    expect(ctrl.pickMemo).not.toBeUndefined();
    expect(typeof (ctrl.pickMemo)).toEqual('function');

    expect(ctrl.removeOpportunity).not.toBeUndefined();
    expect(typeof (ctrl.removeOpportunity)).toEqual('function');

    expect(ctrl.removeSharedCollaborator).not.toBeUndefined();
    expect(typeof (ctrl.removeSharedCollaborator)).toEqual('function');

    expect(ctrl.saveNewList).not.toBeUndefined();
    expect(typeof (ctrl.saveNewList)).toEqual('function');

    expect(ctrl.selectOpportunity).not.toBeUndefined();
    expect(typeof (ctrl.selectOpportunity)).toEqual('function');

    expect(ctrl.shareOpportunity).not.toBeUndefined();
    expect(typeof (ctrl.shareOpportunity)).toEqual('function');

    expect(ctrl.showDisabled).not.toBeUndefined();
    expect(typeof (ctrl.showDisabled)).toEqual('function');

    expect(ctrl.showItemAuthorizationFlag).not.toBeUndefined();
    expect(typeof (ctrl.showItemAuthorizationFlag)).toEqual('function');

    expect(ctrl.showOpportunityMemoModal).not.toBeUndefined();
    expect(typeof (ctrl.showOpportunityMemoModal)).toEqual('function');

    expect(ctrl.sortBy).not.toBeUndefined();
    expect(typeof (ctrl.sortBy)).toEqual('function');

    expect(ctrl.submitFeedback).not.toBeUndefined();
    expect(typeof (ctrl.submitFeedback)).toEqual('function');

    expect(ctrl.toggleOpportunitiesInStores).not.toBeUndefined();
    expect(typeof (ctrl.toggleOpportunitiesInStores)).toEqual('function');

    expect(ctrl.toggleSelectAllStores).not.toBeUndefined();
    expect(typeof (ctrl.toggleSelectAllStores)).toEqual('function');

    expect(ctrl.updateOpportunityModel).not.toBeUndefined();
    expect(typeof (ctrl.updateOpportunityModel)).toEqual('function');

    expect(ctrl.vsYAGrowthPercent).not.toBeUndefined();
    expect(typeof (ctrl.vsYAGrowthPercent)).toEqual('function');
  });

  describe('[list.addCollaborator] method', function() {
    var collaborator = {
      'employeeId': '12345'
    };

    it('should add a new collaborator object to the collaborators array in a new list', function() {
      expect(ctrl.newList.collaborators.length).toEqual(0);
      ctrl.addCollaborator(collaborator);
      expect(ctrl.newList.collaborators.length).toEqual(1);
    });

    it('should add a share object to the target list shares array in a new list', function() {
      expect(ctrl.newList.targetListShares.length).toEqual(0);
      ctrl.addCollaborator(collaborator);
      expect(ctrl.newList.targetListShares.length).toEqual(1);
      expect(ctrl.newList.targetListShares[0].employeeId).toEqual('12345');
    });

    afterEach(function() {
      ctrl.newList.collaborators = [];
      ctrl.newList.targetListShares = [];
    });
  });

  describe('[list.allOpportunitiesExpanded] method', function() {
    it('should return false if expandedOpportunities and opportunitiesService.model.opportunities are different lengths', function() {
      ctrl.expandedOpportunities = 1;
      ctrl.opportunitiesService.model.opportunities = [{'opportunity': 1}, {'otherOpportunity': 2}];
      expect(ctrl.allOpportunitiesExpanded()).toBeFalsy();
    });

    it('should return true if expandedOpportunities and opportunitiesService.model.opportunities are the same lengths', function() {
      ctrl.expandedOpportunities = 1;
      ctrl.opportunitiesService.model.opportunities = [{'opportunity': 1}];
      expect(ctrl.allOpportunitiesExpanded()).toBeTruthy();
    });
  });

  describe('[list.closeCreateTargetListModal] method', function() {
    beforeEach(function() {
      spyOn(mdDialog, 'hide').and.callThrough();
    });

    it('should close create target list modal', function() {
      ctrl.closeCreateTargetListModal();
      expect(mdDialog.hide).toHaveBeenCalled();
      expect(mdDialog.hide.calls.count()).toEqual(1);
    });

    it('should reset the new list object to blank', function() {
      ctrl.newList = {'name': 'New List', 'description': 'A List.'};
      ctrl.closeCreateTargetListModal();
      expect(ctrl.newList.name).toEqual('');
      expect(ctrl.newList.description).toEqual('');
    });
  });

  describe('[list.closeModal] method', function() {
    beforeEach(function() {
      spyOn(mdDialog, 'hide').and.callThrough();
    });

    it('should close a material design modal', function() {
      ctrl.closeModal();
      expect(mdDialog.hide).toHaveBeenCalled();
      expect(mdDialog.hide.calls.count()).toEqual(1);
    });
  });

  describe('[list.closeOrDismissOpportunity] method', function() {
    var runTimeout = inject(function($timeout) {
        $timeout.flush(4000);
      });

    beforeEach(function() {
      httpBackend.expectGET('/api/users/1/targetLists/').respond(200);

      spyOn(opportunitiesService, 'createOpportunityFeedback').and.callFake(function() {
        var feedbackDeferred = q.defer();
        return feedbackDeferred.promise;
      });

      spyOn(closedOpportunitiesService, 'closeOpportunity').and.callFake(function() {
        var closeDeferred = q.defer();
        return closeDeferred.promise;
      });

      ctrl.undoClicked = false;
    });

    it('should call the createOpportunityFeedback method if dismiss is true', function() {
      ctrl.closeOrDismissOpportunity('123', {'feedback': 'send feedback'}, true);
      runTimeout();
      expect(opportunitiesService.createOpportunityFeedback).toHaveBeenCalled();
    });

    it('should call the closeOpportunity method if dismiss is false', function() {
      ctrl.closeOrDismissOpportunity('123', {}, false);
      runTimeout();
      expect(closedOpportunitiesService.closeOpportunity).toHaveBeenCalled();
    });

    it('should not run either method if undo clicked', function() {
      ctrl.undoClicked = true;

      ctrl.closeOrDismissOpportunity('1', {}, false);
      runTimeout();
      expect(closedOpportunitiesService.closeOpportunity).not.toHaveBeenCalled();

      ctrl.closeOrDismissOpportunity('1', {}, true);
      runTimeout();
      expect(opportunitiesService.createOpportunityFeedback).not.toHaveBeenCalled();
    });

    it('should update booleans and variables', function() {
      ctrl.opportunityDismissTrigger = false;
      ctrl.currentOpportunityId = '1';
      ctrl.filtersService.model.appliedFilter.pagination.totalOpportunities = 3;
      ctrl.closeOrDismissOpportunity('2', {}, false);
      expect(ctrl.opportunityDismissTrigger).toBeTruthy();
      expect(ctrl.currentOpportunityId).toEqual('2');

      runTimeout();
      expect(ctrl.opportunityDismissTrigger).toBeFalsy();
      expect(ctrl.currentOpportunityId).toEqual('');
      expect(ctrl.filtersService.model.appliedFilter.pagination.totalOpportunities).toEqual(2);
    });
  });

  describe('[list.collapseCallback] method', function() {
    it('should decrease the expanded opportunities count', function() {
      ctrl.expandedOpportunities = 2;
      ctrl.collapseCallback();
      expect(ctrl.expandedOpportunities).toEqual(1);
    });
  });

  describe('[list.createNewList] method', function() {
    beforeEach(function() {
      spyOn(mdDialog, 'show').and.callThrough();
    });

    it('should open the create target list modal', function() {
      ctrl.createNewList();
      expect(mdDialog.show).toHaveBeenCalled();
      expect(mdDialog.show.calls.count()).toEqual(1);
    });
  });

  describe('[list.displayBrandIcon] method', function() {
    it('should return true if brand name is in brands array', function() {
      var brandsArray = ['corona', 'modelo'];
      expect(ctrl.displayBrandIcon(brandsArray, 'corona')).toBeTruthy();
      expect(ctrl.displayBrandIcon(brandsArray, 'victoria')).toBeFalsy();
    });
  });

  describe('[list.expandCallback] method', function() {
    it('should increase the expanded opportunities count', function() {
      ctrl.expandedOpportunities = 0;
      ctrl.expandCallback();
      expect(ctrl.expandedOpportunities).toEqual(1);
    });
  });

  describe('[list.flattenOpportunity] method', function() {
    var object = [{
      'id': '0129597___80013986___20160929',
      'product': {
        'id': '80013986',
        'name': 'MODELO NEGRA 12PK BT',
        'type': 'sku',
        'brand': 'MODELO NEGRA',
        'brandCode': '437'
      },
      'type': 'NON_BUY',
      'subType': null,
      'impact': 'L',
      'impactDescription': 'LOW',
      'status': 'TARGETED',
      'rationale': 'Recommended SKU performing at 0.0% at similar stores (L90 vs. YA trend)',
      'store': {
        'id': '0129597',
        'name': 'CARNICERIA LA BARATA ETHNIC',
        'address': '214 N 4TH AVE, PASCO, WA 993015323',
        'segmentation': 'A',
        'latitude': 46.2318,
        'longitude': -119.0929,
        'storeNumber': null,
        'distributionL90Simple': 6,
        'distributionL90SimpleYA': 7,
        'distributionL90Effective': 30,
        'distributionL90EffectiveYA': 29,
        'velocity': 0,
        'velocityYA': 0,
        'depletionsCurrentYearToDate': 7015,
        'depletionsCurrentYearToDateYA': 7902,
        'opportunityCount': 7,
        'highImpactOpportunityCount': 0,
        'distributors': ['COHO DIST LLC - WA (KENNEWICK)'],
        'streetAddress': '214 N 4TH AVE',
        'city': 'PASCO',
        'state': 'WA',
        'zip': '99301',
        'onPremise': false,
        'cbbdChain': false,
        'rationale': 'because'
      }
    }];

    it('should create a csvItem for each selected opportunity, and add it to the data array', function() {
      expect(ctrl.flattenOpportunity(object)).toEqual([{
        'storeDistributor': object[0].store.distributors[0],
        'TDLinx': object[0].store.id,
        'storeName': object[0].store.name,
        'storeAddress': object[0].store.streetAddress,
        'storeCity': object[0].store.city,
        'storeZip': object[0].store.zip,
        'storeDepletionsCTD': object[0].store.depletionsCurrentYearToDate,
        'storeDepletionsCTDYA': object[0].store.depletionsCurrentYearToDateYA,
        'storeDepletionsCTDYAPercent': object[0].store.depletionsCurrentYearToDateYAPercent,
        'storeSegmentation': object[0].store.segmentation,
        'opportunityType': filter('formatOpportunitiesType')(ctrl.opportunityTypeOrSubtype(object[0])),
        'productName': object[0].product.name,
        'itemAuthorization': object[0].isItemAuthorization,
        'chainMandate': object[0].isChainMandate,
        'onFeature': object[0].isOnFeature,
        'opportunityStatus': object[0].status,
        'impactPredicted': object[0].impactDescription
      }]);
    });

    it('should add a rationale when provided as input', function() {
      expect(ctrl.flattenOpportunity(object, true)).toEqual([{
        'storeDistributor': object[0].store.distributors[0],
        'TDLinx': object[0].store.id,
        'storeName': object[0].store.name,
        'storeAddress': object[0].store.streetAddress,
        'storeCity': object[0].store.city,
        'storeZip': object[0].store.zip,
        'storeDepletionsCTD': object[0].store.depletionsCurrentYearToDate,
        'storeDepletionsCTDYA': object[0].store.depletionsCurrentYearToDateYA,
        'storeDepletionsCTDYAPercent': object[0].store.depletionsCurrentYearToDateYAPercent,
        'storeSegmentation': object[0].store.segmentation,
        'opportunityType': filter('formatOpportunitiesType')(ctrl.opportunityTypeOrSubtype(object[0])),
        'productName': object[0].product.name,
        'itemAuthorization': object[0].isItemAuthorization,
        'chainMandate': object[0].isChainMandate,
        'onFeature': object[0].isOnFeature,
        'opportunityStatus': object[0].status,
        'impactPredicted': object[0].impactDescription,
        'rationale': object[0].rationale
      }]);
    });
  });

  describe('[list.getDate] method', function() {
    it('should return a new date object', function() {
      expect(ctrl.getDate()).toEqual(jasmine.any(Object));
    });
  });

  describe('[list.getMemos] method', function() {
    beforeEach(function() {
      spyOn(storesService, 'getItemAuthorizations').and.callFake(function() {
        var authDeferred = q.defer();
        return authDeferred.promise;
      });

      spyOn(storesService, 'getFeatures').and.callFake(function() {
        var featureDeferred = q.defer();
        return featureDeferred.promise;
      });
    });

    it('should call the item authorizations method if type is item auth', function() {
      ctrl.getMemos('1', '12', 'Item Authorization');
      expect(storesService.getItemAuthorizations).toHaveBeenCalled();
      expect(storesService.getFeatures).not.toHaveBeenCalled();
    });

    it('should call the features method if type isn\'t item auth', function() {
      ctrl.getMemos('1', '12', 'Feature');
      expect(storesService.getFeatures).toHaveBeenCalled();
      expect(storesService.getItemAuthorizations).not.toHaveBeenCalled();
    });
  });

  describe('[list.impactSort] method', function() {
    it('should return 0 for input of H', function() {
      var item = {
        'impact': 'H'
      };
      expect(ctrl.impactSort(item)).toEqual(0);
    });

    it('should return 1 for input of M', function() {
      var item = {
        'impact': 'M'
      };
      expect(ctrl.impactSort(item)).toEqual(1);
    });

    it('should return 2 for input of L', function() {
      var item = {
        'impact': 'L'
      };
      expect(ctrl.impactSort(item)).toEqual(2);
    });
  });

  describe('[list.noOpportunitiesExpanded] method', function() {
    it('should return false if expandedOpportunities doesn\'t equal 0', function() {
      ctrl.expandedOpportunities = 1;
      expect(ctrl.noOpportunitiesExpanded()).toBeFalsy();
    });

    it('should return true if expandedOpportunities equals 0', function() {
      ctrl.expandedOpportunities = 0;
      expect(ctrl.noOpportunitiesExpanded()).toBeTruthy();
    });
  });

  describe('[list.hasOpportunities] method', function() {
    it('should return false if opportunitiesService.model.opportunities length equal 0', function() {
      ctrl.opportunitiesService.model.opportunities = [];
      expect(ctrl.hasOpportunities()).toBeFalsy();
    });

    it('should return true if opportunitiesService.model.opportunities lengths is greater than 0', function() {
      ctrl.opportunitiesService.model.opportunities = [{'opportunity': 1}, {'otherOpportunity': 2}];
      expect(ctrl.hasOpportunities()).toBeTruthy();
    });
  });

  describe('[list.openDismissModal] method', function() {
    beforeEach(function() {
      spyOn(mdDialog, 'show').and.callThrough();
    });

    it('should open the dismiss opportunity modal', function() {
      ctrl.openDismissModal();
      expect(mdDialog.show).toHaveBeenCalled();
      expect(mdDialog.show.calls.count()).toEqual(1);
    });

    it('should assign variables and booleans', function() {
      ctrl.currentOpportunityId = '';
      ctrl.opportunityShared = true;
      ctrl.shareOpportunityFail = true;
      ctrl.opportunityDismissTrigger = true;
      ctrl.undoClicked = true;

      ctrl.openDismissModal('123');

      expect(ctrl.currentOpportunityId).toEqual('123');
      expect(ctrl.opportunityShared).toBeFalsy();
      expect(ctrl.shareOpportunityFail).toBeFalsy();
      expect(ctrl.opportunityDismissTrigger).toBeFalsy();
      expect(ctrl.undoClicked).toBeFalsy();
    });
  });

  describe('[list.openShareModal] method', function() {
    beforeEach(function() {
      spyOn(mdDialog, 'show').and.callThrough();
    });

    it('should open the share opportunity modal', function() {
      ctrl.openShareModal();
      expect(mdDialog.show).toHaveBeenCalled();
      expect(mdDialog.show.calls.count()).toEqual(1);
    });

    it('should assign variables and booleans', function() {
      ctrl.currentOpportunityId = '';
      ctrl.sharedCollaborators = [1, 2, 5];
      ctrl.opportunityShared = true;
      ctrl.shareOpportunityFail = true;

      ctrl.openShareModal('123');

      expect(ctrl.currentOpportunityId).toEqual('123');
      expect(ctrl.sharedCollaborators).toEqual([]);
      expect(ctrl.opportunityShared).toBeFalsy();
      expect(ctrl.shareOpportunityFail).toBeFalsy();
    });
  });

  describe('[list.opportunityTypeOrSubtype] method', function() {
    it('should return the subtype value for custom opportunities', function() {
      var opp = {
        'type': 'CUSTOM',
        'subType': 'New Distribution'
      };

      expect(ctrl.opportunityTypeOrSubtype(opp)).toEqual('New Distribution');
    });

    it('should return the type value for non-custom opportunities', function() {
      var opp = {
        'type': 'D001',
        'subType': 'New Distribution'
      };

      expect(ctrl.opportunityTypeOrSubtype(opp)).toEqual('D001');
    });
  });

  describe('[list.pageName] method', function() {
    it('should return true if page name in argument doesn\'t match current page name', function() {
      var input = ['target-lists'];
      state.current.name = 'opportunities';
      expect(ctrl.pageName(input)).toBeTruthy();
    });

    it('should return false if page name in argument list matches current page name', function() {
      var input = ['target-lists'];
      state.current.name = 'target-lists';
      expect(ctrl.pageName(input)).toBeFalsy();
    });
  });

  describe('[list.saveNewList] method', function() {
    beforeEach(function() {
      spyOn(userService, 'addTargetList').and.callFake(function() {
        var deferred = q.defer();
        return deferred.promise;
      });
      spyOn(ctrl, 'closeModal').and.callThrough();

      ctrl.newList = {
        name: 'List',
        description: 'List description',
        opportunities: [],
        collaborators: [],
        targetListShares: [],
        collaborateAndInvite: false
      };
    });

    it('should call the userService create a target list', function() {
      ctrl.saveNewList(ctrl.newList);
      expect(userService.addTargetList).toHaveBeenCalled();
    });
  });

  describe('[list.showDisabled] method', function() {
    it('should assign the disabled message object to equal the passed in object from function', function() {
      var newMessage = {'name': 'message'};
      ctrl.disabledMessage = {};
      ctrl.showDisabled(newMessage);
      expect(ctrl.disabledMessage).toEqual(newMessage);

    });
  });

  describe('[list.showOpportunityMemoModal] method', function() {
    beforeEach(function() {
      spyOn(mdDialog, 'show').and.callThrough();
    });

    it('should open the opportunity memos modal', function() {
      ctrl.showOpportunityMemoModal();
      expect(mdDialog.show).toHaveBeenCalled();
      expect(mdDialog.show.calls.count()).toEqual(1);
    });

    it('should clear the memoData variable', function() {
      ctrl.memoData = {'name': 'Corporate Mandate'};
      ctrl.showOpportunityMemoModal();
      expect(ctrl.memoData).toEqual({});
    });
  });

  describe('[list.showItemAuthorizationFlag] method', function() {
    it('should return true if item authCode is CM or SP', function() {
      expect(ctrl.showItemAuthorizationFlag('CM')).toBeTruthy();
      expect(ctrl.showItemAuthorizationFlag('SP')).toBeTruthy();
    });

    it('should return false if authCode is BM and depletions are > 0', function() {
      expect(ctrl.showItemAuthorizationFlag('BM', 500)).toBeFalsy();
    });

    it('should return true if authCode is BM and depletions are <= 0', function() {
      expect(ctrl.showItemAuthorizationFlag('BM', -40)).toBeTruthy();
    });

    it('should return false if authCode not acceptable', function() {
      expect(ctrl.showItemAuthorizationFlag('COW')).toBeFalsy();
      expect(ctrl.showItemAuthorizationFlag('BM', 1)).toBeFalsy();
    });
  });

  describe('[list.sortBy] method', function() {
    it('should have default sort settings applied (store ascending)', function() {
      expect(filtersService.model.appliedFilter.sort.sortArr[0].str).toEqual('store');
      expect(filtersService.model.appliedFilter.sort.sortArr[0].asc).toEqual(true);
    });

    beforeEach(function() {
      filtersService.model.appliedFilter.sort.sortArr[0] = {str: 'store', asc: true};

      // Spies
      spyOn(loaderService, 'openLoader').and.callFake(function() {
        return true;
      });
      spyOn(opportunitiesService, 'getOpportunities').and.callFake(function() {
        var deferred = q.defer();
        return deferred.promise;
      });
    });

    it('should toggle asc when the same sort is applied', function() {
      state.current.name = 'opportunities';
      ctrl.sortBy('store');

      expect(filtersService.model.appliedFilter.sort.sortArr[0]).toEqual({str: 'store', asc: false});
    });

    it('should switch the sort string and set asc to true when a new sort is applied', function() {
      state.current.name = 'opportunities';
      ctrl.sortBy('segmentation');

      expect(filtersService.model.appliedFilter.sort.sortArr[0]).toEqual({str: 'segmentation', asc: true});
    });

    it('should open loader when the sort is applied', function() {
      ctrl.sortBy('store');

      expect(loaderService.openLoader).toHaveBeenCalled();
    });

    it('should send request to get opportunities when sort is applied', function() {
      state.current.name = 'opportunities';
      ctrl.sortBy('store');
      expect(opportunitiesService.getOpportunities).toHaveBeenCalled();
    });

    it('should toggle the boolean ascending on function call', function() {
      state.current.name = 'target-list-detail';
      expect(ctrl.ascending).toEqual(true);
      ctrl.sortBy();
      expect(ctrl.ascending).toEqual(false);
    });

    it('should assign ascending orderBy for store, depletions and segmentation when each is provided as param and ascending is true', function() {
      state.current.name = 'target-list-detail';

      ctrl.ascending = false;
      ctrl.sortBy('store');
      expect(ctrl.orderName).toEqual(['store.name']);

      ctrl.ascending = false;
      ctrl.sortBy('opportunity');
      expect(ctrl.orderName).toEqual(['-groupedOpportunities.length']);

      ctrl.ascending = false;
      ctrl.sortBy('depletions');
      expect(ctrl.orderName).toEqual(['store.depletionsCurrentYearToDate']);

      ctrl.ascending = false;
      ctrl.sortBy('segmentation');
      expect(ctrl.orderName).toEqual(['store.segmentation']);
    });

    it('should assign descending orderBy for store, depletions and segmentation when each is provided as param and ascending is false', function() {
      state.current.name = 'target-list-detail';

      ctrl.ascending = true;
      ctrl.sortBy('store');
      expect(ctrl.orderName).toEqual(['-store.name']);

      ctrl.ascending = true;
      ctrl.sortBy('opportunity');
      expect(ctrl.orderName).toEqual(['-groupedOpportunities.length']);

      ctrl.ascending = true;
      ctrl.sortBy('depletions');
      expect(ctrl.orderName).toEqual(['-store.depletionsCurrentYearToDate']);

      ctrl.ascending = true;
      ctrl.sortBy('segmentation');
      expect(ctrl.orderName).toEqual(['-store.segmentation']);
    });
  });

  describe('[list.submitFeedback] method', function() {
    var data;

    beforeEach(function() {
      ctrl.opportunity = {
        'feedback': 'feedback'
      };
    });

    it('should send feedback as \'other\' if not provided', function() {
      data = {
        'type': 'other',
        'feedback': ''
      };
      expect(data.type).toEqual('other');
      expect(data.feedback).toEqual('');
      ctrl.submitFeedback({'opp': 1}, data);
      expect(data.feedback).toEqual('other');
    });

    it('should call the closeOrDismissOpportunity method', function() {
      var deferred = q.defer();
      spyOn(ctrl, 'closeOrDismissOpportunity').and.callFake(function() {
        return deferred.promise;
      });
    });

    it('should set trigger to true and opportunity feedback to empty string', function() {
      expect(ctrl.opportunityDismissTrigger).toBeFalsy();
      expect(ctrl.opportunity.feedback).toEqual('feedback');
      ctrl.submitFeedback({'opp': 1}, data);
      expect(ctrl.opportunityDismissTrigger).toBeTruthy();
      expect(ctrl.opportunity.feedback).toEqual('');
    });
  });

  describe('[list.updateOpportunityModel] method', function() {
    var opportunities,
        selected = [
          {
            'id': '0129597___80013469___20160929'
          }
        ];

    beforeEach(function() {
      opportunities = [{
        'id': '0129597___80013986___20160929',
        'brands': ['modelo negra', 'corona light', 'modelo especial', 'corona light', 'victoria', 'corona light', 'corona light'],
        'groupedOpportunities': [{
          'id': '0129597___80013986___20160929'
        }, {
          'id': '0129597___80013469___20160929'
        }, {
          'id': '0129597___80018933___20160929'
        }]
      }];

    });

    it('Should process properly formatted data', function() {
      expect(opportunities[0].groupedOpportunities.length).toEqual(3);
      expect(selected[0].id).toEqual('0129597___80013469___20160929');
      expect(opportunities[0].groupedOpportunities[1].id).toEqual('0129597___80013469___20160929');
      ctrl.updateOpportunityModel(opportunities, selected);
      expect(opportunities[0].groupedOpportunities.length).toEqual(2);
    });

    it('should remove store if last opportunity dismissed', function() {
      var singleOpp = [{
        'id': '0129597___80013469___20160929',
        'brands': ['modelo negra', 'corona light'],
        'groupedOpportunities': [{
          'id': '0129597___80013469___20160929'
        }]
      }];

      expect(singleOpp[0].groupedOpportunities.length).toEqual(1);
      ctrl.updateOpportunityModel(singleOpp, selected);
      expect(singleOpp.length).toEqual(0);
    });
  });

  describe('[list.vsYAGrowthPercent] method', function() {
    it('should return 100 if this year is positive and last year is 0', function() {
      expect(ctrl.vsYAGrowthPercent(356, 0)).toEqual(100);
    });

    it('should return -100 if this year is 0, and last year is positive', function() {
      expect(ctrl.vsYAGrowthPercent(0, 420)).toEqual(-100);
    });

    it('should return 0 if both this and last year are 0', function() {
      expect(ctrl.vsYAGrowthPercent(0, 0)).toEqual(0);
    });

    it('should return a percentage if no 0 values present', function() {
      expect(ctrl.vsYAGrowthPercent(75, 150)).toEqual(-50);
    });
  });

  describe('selectAll functionality', function() {
    beforeEach(function() {
      opportunitiesService.model.opportunities = [
        {
          'id': '1430039___80014014___20160929',
          'product': {
            'id': '80014014',
            'name': 'CORONA EX 24OZ CAN LSE',
            'type': 'sku',
            'brand': 'CORONA EXTRA',
            'brandCode': '228'
          },
          'type': 'NON_BUY',
          'subType': null,
          'impact': 'M',
          'impactDescription': 'MEDIUM',
          'status': 'OPEN',
          'rationale': 'Recommended SKU performing at 50.0% at similar stores (L90 vs. YA trend)',
          'store': {
            'id': '1430039',
            'name': '102ND STREET MARKET',
            'address': '4646 NE 102ND AVE, PORTLAND, OR 972203336',
            'segmentation': 'C',
            'latitude': 45.5567,
            'longitude': -122.5576,
            'storeNumber': null,
            'distributionL90Simple': 5,
            'distributionL90SimpleYA': 5,
            'distributionL90Effective': 16,
            'distributionL90EffectiveYA': 16,
            'velocity': 0,
            'velocityYA': 3,
            'depletionsCurrentYearToDate': 2716,
            'depletionsCurrentYearToDateYA': 3599,
            'opportunityCount': 1,
            'distributors': [
              'GENERAL DIST CO - OR (OREGON CITY)'
            ],
            'onPremise': false,
            'cbbdChain': false
          },
          'trend': null,
          'selectedOpportunities': 0,
          'groupedOpportunities': [
            {
              'id': '1430039___80014014___20160929',
              'product': {
                'id': '80014014',
                'name': 'CORONA EX 24OZ CAN LSE',
                'type': 'sku',
                'brand': 'CORONA EXTRA',
                'brandCode': '228'
              },
              'type': 'NON_BUY',
              'subType': null,
              'impact': 'M',
              'impactDescription': 'MEDIUM',
              'status': 'OPEN',
              'rationale': 'Recommended SKU performing at 50.0% at similar stores (L90 vs. YA trend)',
              'store': {
                'id': '1430039',
                'name': '102ND STREET MARKET',
                'distributors': [
                  'GENERAL DIST CO - OR (OREGON CITY)'
                ],
                'onPremise': false,
                'cbbdChain': false
              },
              'itemAuthorizationCode': null,
              'depletionsCurrentYearToDate': 3,
              'depletionsCurrentYearToDateYA': 6,
              'lastDepletionDate': '2016-05-04T00:00:00Z',
              'dismissed': true,
              'itemAuthorizationDesc': null,
              'featureTypeCode': null,
              'featureTypeDesc': null,
              'priorityPackageFlag': 'Y',
              '$$hashKey': 'object:4161',
              'selected': true
            }
          ]
        },
        {
          'id': '0080993___80013466___20160929',
          'product': {
            'id': '80013466',
            'name': 'CORONA LT 12PK CAN',
            'type': 'sku',
            'brand': 'CORONA LIGHT',
            'brandCode': '229'
          },
          'brands': [
            'corona light'
          ],
          'trend': null,
          'selectedOpportunities': 0,
          'groupedOpportunities': [
            {
              'id': '0080993___80013466___20160929',
              'product': {
                'id': '80013466',
                'name': 'CORONA LT 12PK CAN',
                'type': 'sku',
                'brand': 'CORONA LIGHT',
                'brandCode': '229'
              },
              'type': 'NON_BUY',
              'subType': null,
              'impact': 'L',
              'impactDescription': 'LOW',
              'status': 'OPEN',
              'rationale': 'Recommended SKU performing at -40.0% at similar stores (L90 vs. YA trend)',
              'store': {
                'id': '0080993',
                'name': '3 GS CONVENIENCE CENTER',
                'address': '357 S 24TH ST W, BILLINGS, MT 591025601',
                'opportunityCount': 1,
                'distributors': [
                  'BRIGGS DIST CO INC - MT'
                ],
                'onPremise': false,
                'cbbdChain': false
              },
              'itemAuthorizationCode': null,
              'depletionsCurrentYearToDate': 0,
              'depletionsCurrentYearToDateYA': 12,
              'lastDepletionDate': '2015-07-10T00:00:00Z',
              'dismissed': false,
              'itemAuthorizationDesc': null,
              'featureTypeCode': null,
              'featureTypeDesc': null,
              'priorityPackageFlag': 'Y',
              '$$hashKey': 'object:2038',
              'selected': true
            }
          ]
        }
      ];
    });

    afterEach(function() {
      ctrl.selected = [];
    });

    it('should return the store that has been selected', function() {
      var storeToBeAdded = opportunitiesService.model.opportunities[0];
      ctrl.toggleOpportunitiesInStores(storeToBeAdded, ctrl.selected);
      expect(ctrl.selected[0].id).toEqual(storeToBeAdded.id);
    });

    it('should remove the store from the selection', function() {
      var storeToBeAdded = opportunitiesService.model.opportunities[0];
      ctrl.toggleOpportunitiesInStores(storeToBeAdded, ctrl.selected);
      ctrl.toggleOpportunitiesInStores(storeToBeAdded, ctrl.selected);
      expect(ctrl.selected[0]).toBeUndefined();
    });

    it('should add all stores in the page to the selection', function() {
      ctrl.toggleSelectAllStores();
      expect(ctrl.selected.length).toEqual(2);
    });

    it('should remove all the stores in the page that are selected', function() {
      ctrl.toggleSelectAllStores();
      ctrl.toggleSelectAllStores();
      expect(ctrl.selected.length).toEqual(0);
    });

    it('should toggle select all option', function() {
      ctrl.isSelectAllActivated = false;
      ctrl.toggleSelectAllStores();
      ctrl.toggleSelectAllStores();
      expect(ctrl.isSelectAllActivated).toBeFalsy();
    });

    it('should select all opportunities inside a store', function() {
      var storeToBeAdded = opportunitiesService.model.opportunities[0];
      ctrl.toggleOpportunitiesInStores(storeToBeAdded, ctrl.selected);
      expect(storeToBeAdded.selectedOpportunities).toEqual(storeToBeAdded.groupedOpportunities.length);
    });

    it('should deselect all opportunities inside a store', function() {
      var storeToBeAdded = opportunitiesService.model.opportunities[0];
      ctrl.toggleOpportunitiesInStores(storeToBeAdded, ctrl.selected);
      ctrl.toggleOpportunitiesInStores(storeToBeAdded, ctrl.selected);
      expect(storeToBeAdded.selectedOpportunities).toEqual(0);
    });
  });

  describe('Collaborators functionality', function() {
    var collaboratorsArr = [];

    beforeEach(function() {
      collaboratorsArr = [
        {
          'id': '634',
          'employeeId': 'X004243',
          'firstName': 'JOE',
          'lastName': 'DURBIN',
          'email': 'JOE.DURBIN@NORTHFLORIDASALES.COM',
          'roles': [],
          'accounts': []
        },
        {
          'id': '258',
          'employeeId': 'X003984',
          'firstName': 'DALE',
          'lastName': 'ADKINS',
          'email': 'DALE@CHAMPAGNEBEVERAGE.COM',
          'roles': [],
          'accounts': []
        }
      ];
    });

    afterEach(function() {
      ctrl.sharedCollaborators = [];
    });

    it('should add a person only once to list of collaborators', function() {
      ctrl.addToSharedCollaborators(collaboratorsArr[0]);
      ctrl.addToSharedCollaborators(collaboratorsArr[0]);
      expect(ctrl.sharedCollaborators.length).toEqual(1);
    });

    it('should add distinct person objects to list of collaborators', function() {
      ctrl.addToSharedCollaborators(collaboratorsArr[0]);
      ctrl.addToSharedCollaborators(collaboratorsArr[1]);
      expect(ctrl.sharedCollaborators.length).toEqual(2);
    });

    it('should remove a person from the list of collaborators', function() {
      ctrl.addToSharedCollaborators(collaboratorsArr[0]);
      ctrl.addToSharedCollaborators(collaboratorsArr[1]);
      ctrl.removeSharedCollaborator(collaboratorsArr[1]);
      expect(ctrl.sharedCollaborators.length).toEqual(1);
    });

    it('should remove the correct person from the list of collaborators', function() {
      ctrl.addToSharedCollaborators(collaboratorsArr[0]);
      ctrl.addToSharedCollaborators(collaboratorsArr[1]);
      ctrl.removeSharedCollaborator(collaboratorsArr[0]);
      expect(ctrl.sharedCollaborators[0]).toEqual(collaboratorsArr[1]);
    });
  });

  describe('Depletions vs YA %', function() {
    var opportunityArr = [];

    beforeEach(function() {
      opportunityArr = [
        {
          'store': {
            'depletionsCurrentYearToDate': 5150,
            'depletionsCurrentYearToDateYA': 2575
          }
        },
        {
          'store': {
            'depletionsCurrentYearToDate': 2575,
            'depletionsCurrentYearToDateYA': 5150
          }
        },
        {
          'store': {
            'depletionsCurrentYearToDate': 5150,
            'depletionsCurrentYearToDateYA': 0
          }
        },
        {
          'store': {
            'depletionsCurrentYearToDate': 0,
            'depletionsCurrentYearToDateYA': 5150
          }
        },
        {
          'store': {
            'depletionsCurrentYearToDate': 0,
            'depletionsCurrentYearToDateYA': 0
          }
        },
        {
          'store': {
            'depletionsCurrentYearToDate': 5150,
            'depletionsCurrentYearToDateYA': 5
          }
        }
      ];
    });

    it('should return a positive value', function() {
      expect(ctrl.depletionsVsYaPercent(opportunityArr[0])).toEqual(100);
    });
    it('should return a negative value', function() {
      expect(ctrl.depletionsVsYaPercent(opportunityArr[1])).toEqual(-50);
    });
    it('should return 100 percent', function() {
      expect(ctrl.depletionsVsYaPercent(opportunityArr[2])).toEqual(100);
    });
    it('should return -100 percent', function() {
      expect(ctrl.depletionsVsYaPercent(opportunityArr[3])).toEqual(-100);
    });
    it('should return - percent', function() {
      expect(ctrl.depletionsVsYaPercent(opportunityArr[4])).toEqual(0);
    });
    it('should return 999 percent', function() {
      expect(ctrl.depletionsVsYaPercent(opportunityArr[5])).toEqual(999);
    });
  });

  describe('Add to target list functionality', function() {
    var listId = 'fc1a0734-a16e-4953-97da-bba51c4690f6';

    beforeEach(function() {
      opportunitiesService.model.opportunities = [
        {
          'id': '1430039___80014014___20160929',
          'product': {
            'id': '80014014',
            'name': 'CORONA EX 24OZ CAN LSE',
            'type': 'sku',
            'brand': 'CORONA EXTRA',
            'brandCode': '228'
          },
          'type': 'NON_BUY',
          'subType': null,
          'impact': 'M',
          'impactDescription': 'MEDIUM',
          'status': 'OPEN',
          'rationale': 'Recommended SKU performing at 50.0% at similar stores (L90 vs. YA trend)',
          'store': {
            'id': '1430039',
            'name': '102ND STREET MARKET',
            'address': '4646 NE 102ND AVE, PORTLAND, OR 972203336',
            'segmentation': 'C',
            'latitude': 45.5567,
            'longitude': -122.5576,
            'storeNumber': null,
            'distributionL90Simple': 5,
            'distributionL90SimpleYA': 5,
            'distributionL90Effective': 16,
            'distributionL90EffectiveYA': 16,
            'velocity': 0,
            'velocityYA': 3,
            'depletionsCurrentYearToDate': 2716,
            'depletionsCurrentYearToDateYA': 3599,
            'opportunityCount': 1,
            'distributors': [
              'GENERAL DIST CO - OR (OREGON CITY)'
            ],
            'onPremise': false,
            'cbbdChain': false
          },
          'trend': null,
          'selectedOpportunities': 0,
          'groupedOpportunities': [
            {
              'id': '1430039___80014014___20160929',
              'product': {
                'id': '80014014',
                'name': 'CORONA EX 24OZ CAN LSE',
                'type': 'sku',
                'brand': 'CORONA EXTRA',
                'brandCode': '228'
              },
              'type': 'NON_BUY',
              'subType': null,
              'impact': 'M',
              'impactDescription': 'MEDIUM',
              'status': 'OPEN',
              'rationale': 'Recommended SKU performing at 50.0% at similar stores (L90 vs. YA trend)',
              'store': {
                'id': '1430039',
                'name': '102ND STREET MARKET',
                'distributors': [
                  'GENERAL DIST CO - OR (OREGON CITY)'
                ],
                'onPremise': false,
                'cbbdChain': false,
                'highImpactOpportunityCount': 1
              },
              'itemAuthorizationCode': null,
              'depletionsCurrentYearToDate': 3,
              'depletionsCurrentYearToDateYA': 6,
              'lastDepletionDate': '2016-05-04T00:00:00Z',
              'dismissed': true,
              'itemAuthorizationDesc': null,
              'featureTypeCode': null,
              'featureTypeDesc': null,
              'priorityPackageFlag': 'Y',
              '$$hashKey': 'object:4161',
              'selected': false
            }
          ]
        },
        {
          'id': '0080993___80013466___20160929',
          'product': {
            'id': '80013466',
            'name': 'CORONA LT 12PK CAN',
            'type': 'sku',
            'brand': 'CORONA LIGHT',
            'brandCode': '229'
          },
          'brands': [
            'corona light'
          ],
          'trend': null,
          'selectedOpportunities': 0,
          'groupedOpportunities': [
            {
              'id': '0080993___80013466___20160929',
              'product': {
                'id': '80013466',
                'name': 'CORONA LT 12PK CAN',
                'type': 'sku',
                'brand': 'CORONA LIGHT',
                'brandCode': '229'
              },
              'type': 'NON_BUY',
              'subType': null,
              'impact': 'L',
              'impactDescription': 'LOW',
              'status': 'OPEN',
              'rationale': 'Recommended SKU performing at -40.0% at similar stores (L90 vs. YA trend)',
              'store': {
                'id': '0080993',
                'name': '3 GS CONVENIENCE CENTER',
                'address': '357 S 24TH ST W, BILLINGS, MT 591025601',
                'opportunityCount': 1,
                'distributors': [
                  'BRIGGS DIST CO INC - MT'
                ],
                'onPremise': false,
                'cbbdChain': false,
                'highImpactOpportunityCount': 0
              },
              'itemAuthorizationCode': null,
              'depletionsCurrentYearToDate': 0,
              'depletionsCurrentYearToDateYA': 12,
              'lastDepletionDate': '2015-07-10T00:00:00Z',
              'dismissed': false,
              'itemAuthorizationDesc': null,
              'featureTypeCode': null,
              'featureTypeDesc': null,
              'priorityPackageFlag': 'Y',
              '$$hashKey': 'object:2038',
              'selected': true
            }
          ],
          'store': {
            'id': '0080993',
            'name': '3 GS CONVENIENCE CENTER',
            'address': '357 S 24TH ST W, BILLINGS, MT 591025601',
            'opportunityCount': 1,
            'distributors': [
              'BRIGGS DIST CO INC - MT'
            ],
            'onPremise': false,
            'cbbdChain': false,
            'highImpactOpportunityCount': 0
          }
        }
      ];

      httpBackend.expectGET('/api/users/1/targetLists/').respond(200);
    });

    afterEach(function() {
      ctrl.selected = [];
      listId = 'fc1a0734-a16e-4953-97da-bba51c4690f6';
    });

    it('should add opprtunities to target list', function() {
      var deferred = q.defer();
      spyOn(targetListService, 'addTargetListOpportunities').and.callFake(function() {
        return deferred.promise;
      });

      ctrl.toggleSelectAllStores();
      ctrl.addToTargetList(listId);
      expect(targetListService.addTargetListOpportunities).toHaveBeenCalled();
    });

    it('should not call addToTargetService if opportunites are not selected', function() {
      var deferred = q.defer();
      spyOn(targetListService, 'addTargetListOpportunities').and.callFake(function() {
        return deferred.promise;
      });

      ctrl.addToTargetList(listId);
      expect(targetListService.addTargetListOpportunities).not.toHaveBeenCalled();
    });

    it('should not call addToTargetService if target list id is null', function() {
      var deferred = q.defer();
      spyOn(targetListService, 'addTargetListOpportunities').and.callFake(function() {
        return deferred.promise;
      });
      listId = null;
      ctrl.toggleSelectAllStores();
      ctrl.addToTargetList(listId);
      expect(targetListService.addTargetListOpportunities).not.toHaveBeenCalled();
    });

    it('should change the selected opportunities from open to targeted when they are changed from open to targeted and opportunityStatus is targeted', function() {
      // scaffold
      ctrl.selected = [angular.copy(opportunitiesService.model.opportunities[1].groupedOpportunities[0])];
      var deferred = q.defer();
      spyOn(targetListService, 'addTargetListOpportunities').and.callFake(function() {
        return deferred.promise;
      });
      spyOn(toastService, 'showToast').and.callFake(function() {
        return true;
      });
      filtersService.model.opportunityStatusTargeted = true;
      filtersService.model.selected.opportunityStatus = ['TARGETED'];

      // assert init
      expect(opportunitiesService.model.opportunities.length).toEqual(2);
      expect(ctrl.selected.length).toEqual(1);
      expect(targetListService.addTargetListOpportunities.calls.count()).toEqual(0);
      expect(toastService.showToast.calls.count()).toEqual(0);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(1);

      // run test
      ctrl.addToTargetList(listId);
      deferred.resolve();
      scope.$digest();

      // assert
      expect(targetListService.addTargetListOpportunities).toHaveBeenCalledWith(listId, ['0080993___80013466___20160929']);
      expect(ctrl.selected.length).toEqual(0);
      expect(targetListService.addTargetListOpportunities.calls.count()).toEqual(1);
      expect(toastService.showToast.calls.count()).toEqual(1);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(1);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities[0].status).toEqual('TARGETED');

      // reset
      filtersService.model.opportunityStatusTargeted = false;
      filtersService.model.selected.opportunityStatus = [];
      opportunitiesService.model.opportunities[0].groupedOpportunities[0].status = 'OPEN';
    });

    it('should change the selected opportunities from open to targeted when they are changed from open to targeted and open opportunityStatus is not specified', function() {
      // scaffold
      ctrl.selected = [angular.copy(opportunitiesService.model.opportunities[1].groupedOpportunities[0])];
      var deferred = q.defer();
      spyOn(targetListService, 'addTargetListOpportunities').and.callFake(function() {
        return deferred.promise;
      });
      spyOn(toastService, 'showToast').and.callFake(function() {
        return true;
      });
      filtersService.model.selected.opportunityStatus = [];

      // assert init
      expect(opportunitiesService.model.opportunities.length).toEqual(2);
      expect(ctrl.selected.length).toEqual(1);
      expect(targetListService.addTargetListOpportunities.calls.count()).toEqual(0);
      expect(toastService.showToast.calls.count()).toEqual(0);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(1);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities[0].status).toEqual('OPEN');

      // run test
      ctrl.addToTargetList(listId);
      deferred.resolve();
      scope.$digest();

      // assert
      expect(targetListService.addTargetListOpportunities).toHaveBeenCalledWith(listId, ['0080993___80013466___20160929']);
      expect(ctrl.selected.length).toEqual(0);
      expect(targetListService.addTargetListOpportunities.calls.count()).toEqual(1);
      expect(toastService.showToast.calls.count()).toEqual(1);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(1);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities[0].status).toEqual('TARGETED');

      // reset
      opportunitiesService.model.opportunities[0].groupedOpportunities[0].status = 'OPEN';
    });

    it('should remove the selected opportunities from view when they are changed from open to targeted and open opportunityStatus is open - remove store from view if last opp', function() {
      // scaffold
      ctrl.selected = [angular.copy(opportunitiesService.model.opportunities[1].groupedOpportunities[0])];
      var deferred = q.defer();
      spyOn(targetListService, 'addTargetListOpportunities').and.callFake(function() {
        return deferred.promise;
      });
      spyOn(toastService, 'showToast').and.callFake(function() {
        return true;
      });
      filtersService.model.opportunityStatusOpen = true;
      filtersService.model.selected.opportunityStatus = ['OPEN'];

      // assert init
      expect(opportunitiesService.model.opportunities.length).toEqual(2);
      expect(ctrl.selected.length).toEqual(1);
      expect(targetListService.addTargetListOpportunities.calls.count()).toEqual(0);
      expect(toastService.showToast.calls.count()).toEqual(0);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(1);

      // run test
      ctrl.addToTargetList(listId);
      deferred.resolve();
      scope.$digest();

      // assert
      expect(targetListService.addTargetListOpportunities).toHaveBeenCalledWith(listId, ['0080993___80013466___20160929']);
      expect(ctrl.selected.length).toEqual(0);
      expect(targetListService.addTargetListOpportunities.calls.count()).toEqual(1);
      expect(toastService.showToast.calls.count()).toEqual(1);
      expect(opportunitiesService.model.opportunities.length).toEqual(1);

      // reset
      filtersService.model.opportunityStatusOpen = false;
      filtersService.model.selected.opportunityStatus = [];
      opportunitiesService.model.opportunities.push = {
        'id': '0080993___80013466___20160929',
        'product': {
          'id': '80013466',
          'name': 'CORONA LT 12PK CAN',
          'type': 'sku',
          'brand': 'CORONA LIGHT',
          'brandCode': '229'
        },
        'brands': [
          'corona light'
        ],
        'trend': null,
        'selectedOpportunities': 0,
        'groupedOpportunities': [
          {
            'id': '0080993___80013466___20160929',
            'product': {
              'id': '80013466',
              'name': 'CORONA LT 12PK CAN',
              'type': 'sku',
              'brand': 'CORONA LIGHT',
              'brandCode': '229'
            },
            'type': 'NON_BUY',
            'subType': null,
            'impact': 'L',
            'impactDescription': 'LOW',
            'status': 'OPEN',
            'rationale': 'Recommended SKU performing at -40.0% at similar stores (L90 vs. YA trend)',
            'store': {
              'id': '0080993',
              'name': '3 GS CONVENIENCE CENTER',
              'address': '357 S 24TH ST W, BILLINGS, MT 591025601',
              'opportunityCount': 1,
              'distributors': [
                'BRIGGS DIST CO INC - MT'
              ],
              'onPremise': false,
              'cbbdChain': false
            },
            'itemAuthorizationCode': null,
            'depletionsCurrentYearToDate': 0,
            'depletionsCurrentYearToDateYA': 12,
            'lastDepletionDate': '2015-07-10T00:00:00Z',
            'dismissed': false,
            'itemAuthorizationDesc': null,
            'featureTypeCode': null,
            'featureTypeDesc': null,
            'priorityPackageFlag': 'Y',
            '$$hashKey': 'object:2038',
            'selected': true
          }
        ]
      };
    });

    it('should remove the selected opportunity, and if grouped opportunities is empty, it should remove the store from the view - keep store if grouped opp length > 0', function() {
      // scaffold
      ctrl.selected = [angular.copy(opportunitiesService.model.opportunities[1].groupedOpportunities[0])];
      var deferred = q.defer();
      spyOn(targetListService, 'addTargetListOpportunities').and.callFake(function() {
        return deferred.promise;
      });
      spyOn(toastService, 'showToast').and.callFake(function() {
        return true;
      });
      filtersService.model.opportunityStatusOpen = true;
      filtersService.model.selected.opportunityStatus = ['OPEN'];
      opportunitiesService.model.opportunities[1].groupedOpportunities.push({
        'id': '5231788___228-102___1474493257763',
        'product': {
          'id': '228-102',
          'name': 'CORONA EXTRA-KEG',
          'type': 'package',
          'brand': 'CORONA EXTRA',
          'brandCode': '228'
        },
        'type': 'CUSTOM',
        'subType': null,
        'impact': 'H',
        'impactDescription': 'HIGH',
        'status': 'OPEN',
        'rationale': 'Want to make big sales!!',
        'store': {
          'id': '5231788',
          'name': 'OUTBACK STEAKHOUSE',
          'address': '20630 VALLEY GREEN DR, CUPERTINO, CA 950141702',
          'city': 'CUPERTINO',
          'state': 'CA',
          'segmentation': 'C',
          'latitude': 37.332,
          'longitude': -122.0336,
          'storeNumber': 514,
          'distributionL90Simple': 2,
          'distributionL90SimpleYA': 1,
          'distributionL90Effective': 2,
          'distributionL90EffectiveYA': 1,
          'velocity': 1,
          'velocityYA': 0,
          'depletionsCurrentYearToDate': 39,
          'depletionsCurrentYearToDateYA': 54,
          'opportunityCount': 29,
          'highImpactOpportunityCount': 1,
          'distributors': [
            'DBI BEV INC - CA (SAN JOSE 2)'
          ],
          'streetAddress': '20630 VALLEY GREEN DR',
          'zip': '95014',
          'cbbdChain': true,
          'onPremise': true
        },
        'itemAuthorizationCode': null,
        'depletionsCurrentYearToDate': 0,
        'depletionsCurrentYearToDateYA': 0,
        'lastDepletionDate': null,
        'dismissed': false,
        'itemAuthorizationDesc': null,
        'featureTypeCode': null,
        'featureTypeDesc': null,
        'priorityPackageFlag': null
      });
      opportunitiesService.model.opportunities[1].store.highImpactOpportunityCount = 1;

      // assert init
      expect(opportunitiesService.model.opportunities.length).toEqual(2);
      expect(ctrl.selected.length).toEqual(1);
      expect(targetListService.addTargetListOpportunities.calls.count()).toEqual(0);
      expect(toastService.showToast.calls.count()).toEqual(0);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(2);
      expect(opportunitiesService.model.opportunities[1].store.highImpactOpportunityCount).toEqual(1);

      // run test
      ctrl.addToTargetList(listId);
      deferred.resolve();
      scope.$digest();

      // assert
      expect(targetListService.addTargetListOpportunities).toHaveBeenCalledWith(listId, ['0080993___80013466___20160929']);
      expect(ctrl.selected.length).toEqual(0);
      expect(targetListService.addTargetListOpportunities.calls.count()).toEqual(1);
      expect(toastService.showToast.calls.count()).toEqual(1);
      expect(opportunitiesService.model.opportunities.length).toEqual(2);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(1);
      expect(opportunitiesService.model.opportunities[1].store.highImpactOpportunityCount).toEqual(1);
    });

    it('should update count of high opportunities if one is removed', function() {
      // scaffold
      var deferred = q.defer();
      spyOn(targetListService, 'addTargetListOpportunities').and.callFake(function() {
        return deferred.promise;
      });
      spyOn(toastService, 'showToast').and.callFake(function() {
        return true;
      });
      filtersService.model.opportunityStatusOpen = true;
      filtersService.model.selected.opportunityStatus = ['OPEN'];
      opportunitiesService.model.opportunities[1].groupedOpportunities.push({
        'id': '5231788___228-102___1474493257763',
        'product': {
          'id': '228-102',
          'name': 'CORONA EXTRA-KEG',
          'type': 'package',
          'brand': 'CORONA EXTRA',
          'brandCode': '228'
        },
        'type': 'CUSTOM',
        'subType': null,
        'impact': 'H',
        'impactDescription': 'HIGH',
        'status': 'OPEN',
        'rationale': 'Want to make big sales!!',
        'store': {
          'id': '5231788',
          'name': 'OUTBACK STEAKHOUSE',
          'address': '20630 VALLEY GREEN DR, CUPERTINO, CA 950141702',
          'city': 'CUPERTINO',
          'state': 'CA',
          'segmentation': 'C',
          'latitude': 37.332,
          'longitude': -122.0336,
          'storeNumber': 514,
          'distributionL90Simple': 2,
          'distributionL90SimpleYA': 1,
          'distributionL90Effective': 2,
          'distributionL90EffectiveYA': 1,
          'velocity': 1,
          'velocityYA': 0,
          'depletionsCurrentYearToDate': 39,
          'depletionsCurrentYearToDateYA': 54,
          'opportunityCount': 29,
          'highImpactOpportunityCount': 1,
          'distributors': [
            'DBI BEV INC - CA (SAN JOSE 2)'
          ],
          'streetAddress': '20630 VALLEY GREEN DR',
          'zip': '95014',
          'cbbdChain': true,
          'onPremise': true
        },
        'itemAuthorizationCode': null,
        'depletionsCurrentYearToDate': 0,
        'depletionsCurrentYearToDateYA': 0,
        'lastDepletionDate': null,
        'dismissed': false,
        'itemAuthorizationDesc': null,
        'featureTypeCode': null,
        'featureTypeDesc': null,
        'priorityPackageFlag': null
      });
      ctrl.selected = [angular.copy(opportunitiesService.model.opportunities[1].groupedOpportunities[1])];
      opportunitiesService.model.opportunities[1].store.highImpactOpportunityCount = 1;

      // assert init
      expect(opportunitiesService.model.opportunities.length).toEqual(2);
      expect(opportunitiesService.model.opportunities[1].store.highImpactOpportunityCount).toEqual(1);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(2);
      expect(ctrl.selected.length).toEqual(1);

      // run test
      ctrl.addToTargetList(listId);
      deferred.resolve();
      scope.$digest();

      // assert
      expect(targetListService.addTargetListOpportunities).toHaveBeenCalledWith(listId, ['5231788___228-102___1474493257763']);
      expect(ctrl.selected.length).toEqual(0);
      expect(opportunitiesService.model.opportunities.length).toEqual(2);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(1);
      expect(opportunitiesService.model.opportunities[1].store.highImpactOpportunityCount).toEqual(0);
    });
  });
});
