describe('Unit: list controller', function() {
  var scope, ctrl, q, filtersService, loaderService, opportunitiesService, targetListService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.list');
    // filtersService, loaderService, opportunitiesService, targetListService, storesService, userService, closedOpportunitiesService
    inject(function($rootScope, _$q_, $controller, _filtersService_, _loaderService_, _opportunitiesService_, _targetListService_) {
      scope = $rootScope.$new();
      q = _$q_;

      filtersService = _filtersService_;
      loaderService = _loaderService_;
      opportunitiesService = _opportunitiesService_;
      targetListService = _targetListService_;

      ctrl = $controller('listController', {$scope: scope});
    });
  });

  it('should have services defined', function() {
    expect(ctrl.filtersService).not.toBeUndefined();
    expect(typeof (ctrl.filtersService)).toEqual('object');
    expect(ctrl.opportunitiesService).not.toBeUndefined();
    expect(typeof (ctrl.opportunitiesService)).toEqual('object');
  });

  describe('sortBy method', function() {
    it('should exist', function() {
      expect(ctrl.sortBy).not.toBeUndefined();
      expect(typeof (ctrl.sortBy)).toEqual('function');
    });

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
      ctrl.sortBy('store');

      expect(filtersService.model.appliedFilter.sort.sortArr[0]).toEqual({str: 'store', asc: false});
    });

    it('should switch the sort string and set asc to true when a new sort is applied', function() {
      ctrl.sortBy('segmentation');

      expect(filtersService.model.appliedFilter.sort.sortArr[0]).toEqual({str: 'segmentation', asc: true});
    });

    it('should open loader when the sort is applied', function() {
      ctrl.sortBy('store');

      expect(loaderService.openLoader).toHaveBeenCalled();
    });

    it('should send request to get opportunities when sort is applied', function() {
      ctrl.sortBy('store');
      expect(opportunitiesService.getOpportunities).toHaveBeenCalled();
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

      spyOn(targetListService, 'addTargetListOpportunities').and.callFake(function() {
        var deferred = q.defer();
        return deferred.promise;
      });
    });

    afterEach(function() {
      ctrl.selected = [];
    });

    it('should add opprtunities to target list', function() {
      ctrl.toggleSelectAllStores();
      ctrl.addToTargetList(listId);
      expect(targetListService.addTargetListOpportunities).toHaveBeenCalled();
    });

    it('should not add to target service if opportunites are not selected', function() {
      ctrl.addToTargetList(listId);
      expect(targetListService.addTargetListOpportunities).not.toHaveBeenCalled();
    });

    it('should not add to target service if target list id is null', function() {
      listId = null;
      ctrl.toggleSelectAllStores();
      ctrl.addToTargetList(listId);
      expect(targetListService.addTargetListOpportunities).not.toHaveBeenCalled();
    });
  });

});
