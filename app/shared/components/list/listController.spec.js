import * as Chance from 'chance';
import { getV3ListMock } from '../../../models/lists/lists.model.mock';
import { generateRandomSizedArray } from '../../../models/util.model';

const ListSelectionType = require('../../../enums/lists/list-selection-type.enum').ListSelectionType;
const listsApiServiceMock = require('../../../services/api/v3/lists-api.service.mock').listApiServiceMock;
const listsTransformerServiceMock = require('../../../services/lists-transformer.service.mock').listsTransformerServiceMock;

const chance = new Chance();

describe('Unit: list controller', function() {
  let scope, ctrl, q, httpBackend, mdDialog, closedOpportunitiesService, filtersService, loaderService, opportunitiesService, storesService, targetListService, toastService, userService, filter, analyticsService, $state, listsApiService, listsTransformerService, compassModalService;
  let bindings = {showAddToTargetList: true, showRemoveButton: false, selectAllAvailable: true, pageName: 'MyTestPage'};

  beforeEach(function() {
    listsApiService = listsApiServiceMock;
    listsTransformerService = listsTransformerServiceMock;

    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.filters');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.list');

    angular.mock.module(($provide) => {
      analyticsService = {
        trackEvent: () => {}
      };
      $provide.value('analyticsService', analyticsService);
      $provide.value('listsApiService', listsApiService);
      $provide.value('listsTransformerService', listsTransformerService);
      $provide.value('compassModalService', {
        showActionModalDialog: jasmine.createSpy('showActionModalDialog').and.returnValue({modalInstance: null}),
        modalActionBtnContainerEvent: jasmine.createSpy('modalActionBtnContainerEvent').and.callFake(() => {
          const defer = q.defer();
          defer.resolve();
          return defer.promise;
        })
      });
    });

    spyOn(listsApiService, 'getListsPromise').and.callFake(() => {
      const defer = q.defer();
      defer.resolve();
      return defer.promise;
    });

    inject(function($rootScope, _$q_, _$httpBackend_, _$mdDialog_, $controller, _$filter_, _$state_, _closedOpportunitiesService_, _filtersService_, _loaderService_, _opportunitiesService_, _storesService_, _targetListService_, _toastService_, _userService_, _listsApiService_, _listsTransformerService_, _compassModalService_) {
      scope = $rootScope.$new();
      q = _$q_;
      mdDialog = _$mdDialog_;
      httpBackend = _$httpBackend_;
      filter = _$filter_;
      $state = _$state_;

      closedOpportunitiesService = _closedOpportunitiesService_;
      filtersService = _filtersService_;
      loaderService = _loaderService_;
      opportunitiesService = _opportunitiesService_;
      storesService = _storesService_;
      targetListService = _targetListService_;
      toastService = _toastService_;
      userService = _userService_;
      listsApiService = _listsApiService_;
      listsTransformerService = _listsTransformerService_;
      compassModalService = _compassModalService_;

      userService.model.currentUser.employeeID = 1;

      ctrl = $controller('listController', {$scope: scope}, bindings);
    });
  });

  it('should expose public services', function() {
    expect(ctrl.filtersService).not.toBeUndefined();
    expect(typeof (ctrl.filtersService)).toEqual('object');

    expect(ctrl.opportunitiesService).not.toBeUndefined();
    expect(typeof (ctrl.opportunitiesService)).toEqual('object');

    expect(ctrl.userService).not.toBeUndefined();
    expect(typeof (ctrl.userService)).toEqual('object');

    expect(ctrl.csvDownloadOption).not.toBeUndefined();
    expect(typeof (ctrl.csvDownloadOption)).toEqual('string');
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

    expect(ctrl.getCSVData).not.toBeUndefined();
    expect(typeof (ctrl.getCSVData)).toEqual('function');

    expect(ctrl.getCSVHeader).not.toBeUndefined();
    expect(typeof (ctrl.getCSVHeader)).toEqual('function');

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

    expect(ctrl.toggleOpportunitiesInStore).not.toBeUndefined();
    expect(typeof (ctrl.toggleOpportunitiesInStore)).toEqual('function');

    expect(ctrl.selectAllOpportunities).not.toBeUndefined();
    expect(typeof (ctrl.selectAllOpportunities)).toEqual('function');

    expect(ctrl.toggleSelectAllStores).not.toBeUndefined();
    expect(typeof (ctrl.toggleSelectAllStores)).toEqual('function');

    expect(ctrl.updateOpportunityModel).not.toBeUndefined();
    expect(typeof (ctrl.updateOpportunityModel)).toEqual('function');

    expect(ctrl.vsYAGrowthPercent).not.toBeUndefined();
    expect(typeof (ctrl.vsYAGrowthPercent)).toEqual('function');

    expect(ctrl.remainingOpportunitySpots).not.toBeUndefined();
    expect(typeof (ctrl.remainingOpportunitySpots)).toEqual('function');

    expect(ctrl.handleAddToTargetList).not.toBeUndefined();
    expect(typeof (ctrl.handleAddToTargetList)).toEqual('function');

    expect(ctrl.isTotalOpportunitiesWithinMaxLimit).not.toBeUndefined();
    expect(typeof (ctrl.isTotalOpportunitiesWithinMaxLimit)).toEqual('function');

    expect(ctrl.retrieveStoreCountForSelectedOpportunities).not.toBeUndefined();
    expect(typeof (ctrl.retrieveStoreCountForSelectedOpportunities)).toEqual('function');
  });

  describe('Bindings', function() {
    it('should popoulate the bindings', function() {
      expect(ctrl.showAddToTargetList).toBeTruthy();
      expect(ctrl.showCopyToTargetList).toBeUndefined();
      expect(ctrl.showRemoveButton).toBeFalsy();
      expect(ctrl.pageName).toEqual(bindings.pageName);
    });
  });

  describe('[list.remainingOpportunitySpots]', function() {
    it('returns the number of available opportunities when current opportunities is less than max', function() {
      const currentOpps = 999;
      expect(ctrl.remainingOpportunitySpots(currentOpps)).toEqual(1);
    });

    it('returns the number of available opportunities when current opportunities is equal to max', function() {
      const currentOpps = 1000;
      expect(ctrl.remainingOpportunitySpots(currentOpps)).toEqual(0);
    });

    it('returns the number of available opportunities when current opportunities exceeds max', function() {
      const currentOpps = 1001;
      expect(ctrl.remainingOpportunitySpots(currentOpps)).toEqual(0);
    });
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
    let feedbackDeferred;
    let closeDeferred;

    beforeEach(function() {
      httpBackend.expectGET('/v2/users/1/targetLists/').respond(200);

      spyOn(opportunitiesService, 'createOpportunityFeedback').and.callFake(function() {
        feedbackDeferred = q.defer();
        return feedbackDeferred.promise;
      });

      spyOn(closedOpportunitiesService, 'closeOpportunity').and.callFake(function() {
        closeDeferred = q.defer();
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

    it('should log a GA event on closeOpportunity method call with dismiss false', () => {
      spyOn(analyticsService, 'trackEvent');
      opportunitiesService.model.opportunities = [{
        store: {id: '1699829'},
        groupedOpportunities: [{
          id: '0080123___80013466___20170820'
        }]
      }];

      ctrl.closeOrDismissOpportunity('0080123___80013466___20170820', {}, false);
      runTimeout();
      closeDeferred.resolve();
      scope.$apply();

      expect(analyticsService.trackEvent).toHaveBeenCalledWith(
        'Opportunities',
        'Close Opportunity',
        '0080123___80013466___20170820'
      );
    });

    it('should not run either method if undo clicked', function() {
      ctrl.undoClicked = true;

      ctrl.closeOrDismissOpportunity('1', {}, false);
      runTimeout();
      expect(closedOpportunitiesService.closeOpportunity).not.toHaveBeenCalled();

      ctrl.undoClicked = true;

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

  describe('[list.onPageChange] method', function() {
    it('should reset expandedOpportunities for current current page', function () {
      ctrl.expandedOpportunities = 2;
      ctrl.resetOpportunitiesExpanded();
      expect(ctrl.expandedOpportunities).toEqual(0);
      expect(ctrl.noOpportunitiesExpanded()).toBeTruthy();
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

  describe('[list.getCSVData] method', () => {
    let opportunityArrayMock;
    let distributorID = chance.string();
    beforeEach(() => {
      opportunityArrayMock = [{
        id: chance.string(),
        product: {
          id: chance.string(),
          name: chance.string(),
          type: chance.string(),
          brand: chance.string(),
          brandCode: chance.string()
        },
        type: chance.string(),
        subType: chance.string(),
        impact: chance.string(),
        impactDescription: chance.string(),
        status: chance.string(),
        rationale: chance.string(),
        store: {
          id: chance.string(),
          name: chance.string(),
          address: chance.string(),
          segmentation: chance.string(),
          latitude: chance.integer(),
          longitude: chance.integer(),
          storeNumber: chance.natural(),
          distributionL90Simple: chance.natural(),
          distributionL90SimpleYA: chance.natural(),
          distributionL90Effective: chance.natural(),
          distributionL90EffectiveYA: chance.natural(),
          velocity: chance.natural(),
          velocityYA: chance.natural(),
          depletionsCurrentYearToDate: chance.natural(),
          depletionsCurrentYearToDateYA: chance.natural(),
          opportunityCount: chance.natural(),
          highImpactOpportunityCount: chance.natural(),
          distributors: [chance.string()],
          streetAddress: chance.string(),
          city: chance.string(),
          state: chance.string(),
          zip: chance.string(),
          onPremise: chance.bool(),
          cbbdChain: chance.bool(),
          rationale: chance.string(),
          distributorsSalesInfo: [{
            distributorCd: chance.string(),
            distributorCustomerCd: chance.string(),
            primaryFlag: 'Y',
            salespersonName: chance.string()
          }, {
            distributorCd: distributorID,
            distributorCustomerCd: chance.string(),
            primaryFlag: 'N',
            salespersonName: chance.string()
          }]
        }
      }, {
        id: chance.string(),
        product: {
          id: chance.string(),
          name: chance.string(),
          type: chance.string(),
          brand: chance.string(),
          brandCode: chance.string()
        },
        type: chance.string(),
        subType: chance.string(),
        impact: chance.string(),
        impactDescription: chance.string(),
        status: chance.string(),
        rationale: chance.string(),
        store: {
          id: chance.string(),
          name: chance.string(),
          address: chance.string(),
          segmentation: chance.string(),
          latitude: chance.integer(),
          longitude: chance.integer(),
          storeNumber: chance.natural(),
          distributionL90Simple: chance.natural(),
          distributionL90SimpleYA: chance.natural(),
          distributionL90Effective: chance.natural(),
          distributionL90EffectiveYA: chance.natural(),
          velocity: chance.natural(),
          velocityYA: chance.natural(),
          depletionsCurrentYearToDate: chance.natural(),
          depletionsCurrentYearToDateYA: chance.natural(),
          opportunityCount: chance.natural(),
          highImpactOpportunityCount: chance.natural(),
          distributors: [chance.string()],
          streetAddress: chance.string(),
          city: chance.string(),
          state: chance.string(),
          zip: chance.string(),
          onPremise: chance.bool(),
          cbbdChain: chance.bool(),
          rationale: chance.string(),
          distributorsSalesInfo: [{
            distributorCd: chance.string(),
            distributorCustomerCd: chance.string(),
            primaryFlag: 'Y',
            salespersonName: chance.string()
          }, {
            distributorCd: distributorID,
            distributorCustomerCd: chance.string(),
            primaryFlag: 'N',
            salespersonName: chance.string()
          }]
        }
      }];

      ctrl.selected = opportunityArrayMock;
    });

    describe('when downloading opportunity data with rationales', () => {
      beforeEach(() => {
        ctrl.csvDownloadOption = 'WithRationales';

        filtersService.model.selected.distributor = [];
        filtersService.model.selected.distributor[0] = { name: 'SELECTEDDIST', id: distributorID };
      });

      it('should return a csvItem item for each selected opportunity with rationales', () => {
        ctrl.csvDownloadOption = 'WithRationales';

        const dataPromise = ctrl.getCSVData(ctrl.csvDownloadOption);
        const csvHeader = ctrl.getCSVHeader();

        dataPromise.$$state.value.forEach((csvData, index) => {
          expect(csvData).toEqual({
            storeDistributor: filtersService.model.selected.distributor[0].name,
            TDLinx: opportunityArrayMock[index].store.id,
            distributorCustomerCode: opportunityArrayMock[index].store.distributorsSalesInfo[1].distributorCustomerCd,
            primaryDistributorSalesRoute: opportunityArrayMock[index].store.distributorsSalesInfo[1].salespersonName,
            storeName: opportunityArrayMock[index].store.name,
            storeNumber: opportunityArrayMock[index].store.storeNumber,
            storeAddress: opportunityArrayMock[index].store.streetAddress,
            storeCity: opportunityArrayMock[index].store.city,
            storeZip: opportunityArrayMock[index].store.zip,
            storeDepletionsCTD: opportunityArrayMock[index].store.depletionsCurrentYearToDate,
            storeDepletionsCTDYA: opportunityArrayMock[index].store.depletionsCurrentYearToDateYA,
            storeDepletionsCTDYAPercent: opportunityArrayMock[index].store.depletionsCurrentYearToDateYAPercent,
            storeSegmentation: opportunityArrayMock[index].store.segmentation,
            opportunityType: filter('formatOpportunitiesType')(ctrl.opportunityTypeOrSubtype(opportunityArrayMock[index])),
            productBrand: opportunityArrayMock[index].product.brand,
            productSku: opportunityArrayMock[index].product.name,
            itemAuthorization: opportunityArrayMock[index].isItemAuthorization,
            chainMandate: opportunityArrayMock[index].isChainMandate,
            onFeature: opportunityArrayMock[index].isOnFeature,
            opportunityStatus: opportunityArrayMock[index].status,
            impactPredicted: opportunityArrayMock[index].impactDescription,
            rationale: opportunityArrayMock[index].rationale
          });
        });
        expect(csvHeader).toEqual([
          'Distributor',
          'TDLinx',
          'Distributor Customer Code',
          'Distributor Sales Route (Primary)',
          'Store Name',
          'Store Number',
          'Address',
          'City',
          'ZIP',
          'Current YTD Store Volume',
          'Last YTD Store Volume',
          'Volume Trend for Store CYTD vs CYTD Last Year',
          'Segmentation',
          'Opportunity Type',
          'Product Brand',
          'Product Sku',
          'Item Authorization',
          'Chain Mandate',
          'On Feature',
          'Opportunity Status',
          'Opportunity Predicted Impact',
          'Rationale'
        ]);
      });

      it('should return `Any` for productSku when the opportunity product has no name', () => {
        opportunityArrayMock.forEach((opportunity) => {
          opportunity.product.name = undefined;
        });

        const dataPromise = ctrl.getCSVData(ctrl.csvDownloadOption);

        dataPromise.$$state.value.forEach((csvData) => {
          expect(csvData.productSku).toBe('Any');
        });
      });
    });

    describe('when downloading opportunity data without rationales', () => {
      beforeEach(() => {
        ctrl.csvDownloadOption = 'WithoutRationales';
        filtersService.model.selected.distributor = [];
        filtersService.model.selected.distributor[0] = {name: 'SELECTEDDIST', id: distributorID};
      });

      it('should return a csvItem item for each selected opportunity with rationales', () => {
        ctrl.csvDownloadOption = 'WithoutRationales';

        const dataPromise = ctrl.getCSVData(ctrl.csvDownloadOption);
        const csvHeader = ctrl.getCSVHeader();

        dataPromise.$$state.value.forEach((csvData, index) => {
          expect(csvData).toEqual({
            storeDistributor: filtersService.model.selected.distributor[0].name,
            TDLinx: opportunityArrayMock[index].store.id,
            distributorCustomerCode: opportunityArrayMock[index].store.distributorsSalesInfo[1].distributorCustomerCd,
            primaryDistributorSalesRoute: opportunityArrayMock[index].store.distributorsSalesInfo[1].salespersonName,
            storeName: opportunityArrayMock[index].store.name,
            storeNumber: opportunityArrayMock[index].store.storeNumber,
            storeAddress: opportunityArrayMock[index].store.streetAddress,
            storeCity: opportunityArrayMock[index].store.city,
            storeZip: opportunityArrayMock[index].store.zip,
            storeDepletionsCTD: opportunityArrayMock[index].store.depletionsCurrentYearToDate,
            storeDepletionsCTDYA: opportunityArrayMock[index].store.depletionsCurrentYearToDateYA,
            storeDepletionsCTDYAPercent: opportunityArrayMock[index].store.depletionsCurrentYearToDateYAPercent,
            storeSegmentation: opportunityArrayMock[index].store.segmentation,
            opportunityType: filter('formatOpportunitiesType')(ctrl.opportunityTypeOrSubtype(opportunityArrayMock[index])),
            productBrand: opportunityArrayMock[index].product.brand,
            productSku: opportunityArrayMock[index].product.name,
            itemAuthorization: opportunityArrayMock[index].isItemAuthorization,
            chainMandate: opportunityArrayMock[index].isChainMandate,
            onFeature: opportunityArrayMock[index].isOnFeature,
            opportunityStatus: opportunityArrayMock[index].status,
            impactPredicted: opportunityArrayMock[index].impactDescription
          });
        });
        expect(csvHeader).toEqual([
          'Distributor',
          'TDLinx',
          'Distributor Customer Code',
          'Distributor Sales Route (Primary)',
          'Store Name',
          'Store Number',
          'Address',
          'City',
          'ZIP',
          'Current YTD Store Volume',
          'Last YTD Store Volume',
          'Volume Trend for Store CYTD vs CYTD Last Year',
          'Segmentation',
          'Opportunity Type',
          'Product Brand',
          'Product Sku',
          'Item Authorization',
          'Chain Mandate',
          'On Feature',
          'Opportunity Status',
          'Opportunity Predicted Impact'
        ]);
      });

      it('should return `Any` for productSku when downloading data without rationales and the product has no name', () => {
        opportunityArrayMock.forEach((opportunity) => {
          opportunity.product.name = undefined;
        });

        const dataPromise = ctrl.getCSVData(ctrl.csvDownloadOption);

        dataPromise.$$state.value.forEach((csvData) => {
          expect(csvData.productSku).toBe('Any');
        });
      });

      it('should return `Any` for productSku when the opportunity product has no name', () => {
        opportunityArrayMock.forEach((opportunity) => {
          opportunity.product.name = undefined;
        });

        const dataPromise = ctrl.getCSVData(ctrl.csvDownloadOption);

        dataPromise.$$state.value.forEach((csvData) => {
          expect(csvData.productSku).toBe('Any');
        });
      });
    });

    describe('when downloading opportunity data with store data only', () => {
      beforeEach(() => {
        ctrl.csvDownloadOption = 'Stores';
        filtersService.model.selected.distributor = [];
        filtersService.model.selected.distributor[0] = {name: 'SELECTEDDIST', id: distributorID};
      });

      it('should return csvItems with store only data', () => {
        const dataPromise = ctrl.getCSVData(ctrl.csvDownloadOption);
        const csvHeader = ctrl.getCSVHeader();

        dataPromise.$$state.value.forEach((csvData, index) => {
          expect(csvData).toEqual({
            storeDistributor: filtersService.model.selected.distributor[0].name,
            TDLinx: opportunityArrayMock[index].store.id,
            distributorCustomerCode: opportunityArrayMock[index].store.distributorsSalesInfo[1].distributorCustomerCd,
            primaryDistributorSalesRoute: opportunityArrayMock[index].store.distributorsSalesInfo[1].salespersonName,
            storeName: opportunityArrayMock[index].store.name,
            storeNumber: opportunityArrayMock[index].store.storeNumber,
            storeAddress: opportunityArrayMock[index].store.streetAddress,
            storeCity: opportunityArrayMock[index].store.city,
            storeZip: opportunityArrayMock[index].store.zip,
            storeDepletionsCTD: opportunityArrayMock[index].store.depletionsCurrentYearToDate,
            storeDepletionsCTDYA: opportunityArrayMock[index].store.depletionsCurrentYearToDateYA,
            storeDepletionsCTDYAPercent: opportunityArrayMock[index].store.depletionsCurrentYearToDateYAPercent,
            storeSegmentation: opportunityArrayMock[index].store.segmentation
          });
        });
        expect(csvHeader).toEqual([
          'Distributor',
          'TDLinx',
          'Distributor Customer Code',
          'Distributor Sales Route (Primary)',
          'Store Name',
          'Store Number',
          'Address',
          'City',
          'ZIP',
          'Current YTD Store Volume',
          'Last YTD Store Volume',
          'Volume Trend for Store CYTD vs CYTD Last Year',
          'Segmentation'
        ]);
      });

      it('should contain only one field per unique store based on store TDLINX ids', () => {
        opportunityArrayMock.push(opportunityArrayMock[0]);
        opportunityArrayMock.push(opportunityArrayMock[1]);

        const dataPromise = ctrl.getCSVData(ctrl.csvDownloadOption);

        expect(dataPromise.$$state.value.length).toBe(2);

        dataPromise.$$state.value.forEach((csvData, index) => {
          expect(csvData).toEqual({
            storeDistributor: filtersService.model.selected.distributor[0].name,
            TDLinx: opportunityArrayMock[index].store.id,
            distributorCustomerCode: opportunityArrayMock[index].store.distributorsSalesInfo[1].distributorCustomerCd,
            primaryDistributorSalesRoute: opportunityArrayMock[index].store.distributorsSalesInfo[1].salespersonName,
            storeName: opportunityArrayMock[index].store.name,
            storeNumber: opportunityArrayMock[index].store.storeNumber,
            storeAddress: opportunityArrayMock[index].store.streetAddress,
            storeCity: opportunityArrayMock[index].store.city,
            storeZip: opportunityArrayMock[index].store.zip,
            storeDepletionsCTD: opportunityArrayMock[index].store.depletionsCurrentYearToDate,
            storeDepletionsCTDYA: opportunityArrayMock[index].store.depletionsCurrentYearToDateYA,
            storeDepletionsCTDYAPercent: opportunityArrayMock[index].store.depletionsCurrentYearToDateYAPercent,
            storeSegmentation: opportunityArrayMock[index].store.segmentation
          });
        });
      });
    });

    describe('when downloading any opportunity data', () => {
      beforeEach(() => {
        filtersService.model.selected.distributor = [];
      });
      it('should return `` for storeDistributor when the store has no distributors and no distributor is selected', () => {
        filtersService.model.selected.distributor = [];
        opportunityArrayMock.forEach((opportunity) => {
          opportunity.store.distributors = undefined;
        });

        const dataPromise = ctrl.getCSVData(ctrl.csvDownloadOption);

        dataPromise.$$state.value.forEach((csvData) => {
          expect(csvData.storeDistributor).toBe('');
        });
      });

      it('should return `Unkown` for primaryDistributorSalesRoute when there is no salespersonName present', () => {
        opportunityArrayMock.forEach((opportunity) => {
          opportunity.store.distributorsSalesInfo.forEach((salesInfo) => {
            salesInfo.salespersonName = '';
          });
        });

        const dataPromise = ctrl.getCSVData(ctrl.csvDownloadOption);

        dataPromise.$$state.value.forEach((csvData) => {
          expect(csvData.primaryDistributorSalesRoute).toBe('Unknown');
        });
      });
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

  describe('[list.resetOpportunitiesExpanded] method', () => {
    it('should reset the count of opportunities expanded', () => {
      ctrl.expandedOpportunities = 1;
      ctrl.resetOpportunitiesExpanded();
      expect(ctrl.expandedOpportunities).toBe(0);
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

  describe('save new list functionality', () => {
    let listSelectionType;
    let listOptions;

    beforeEach(() => {
      listSelectionType = chance.bool() ? ListSelectionType.Stores : ListSelectionType.Opportunities;
      listOptions = {
        listSelectionType: listSelectionType,
        selectedStoreIds: [],
        opportunities: []
      };
    });

    describe('[list.saveNewList] method', function() {

      beforeEach(function() {
        spyOn(listsApiService, 'createListPromise').and.callFake(() => {
          const defer = q.defer();
          defer.resolve(getV3ListMock);
          return defer.promise;
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

      it('should call the listsApiService to create a list', function() {
        ctrl.saveNewList(ctrl.newList, listOptions);
        expect(listsApiService.createListPromise).toHaveBeenCalled();
      });
    });

    describe('list.saveNewList GA Event', () => {
      const createListResponseMockId = chance.string();
      const createListResponseMock = {id: createListResponseMockId};

      it('should log a GA event on create target list success', () => {
        spyOn(listsApiService, 'createListPromise').and.callFake(() => {
          const defer = q.defer();
          defer.resolve(createListResponseMock);
          return defer.promise;
        });
        spyOn(analyticsService, 'trackEvent');

        ctrl.saveNewList(null, listOptions);
        scope.$apply();

        expect(listsApiService.createListPromise).toHaveBeenCalled();
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(
          'Lists - My Lists',
          'Create List',
          createListResponseMockId
        );
      });

      it('should NOT log a GA event on listsApiService.createList error', () => {
        spyOn(listsApiService, 'createListPromise').and.callFake(() => {
          const defer = q.defer();
          defer.reject();
          return defer.promise;
        });
        spyOn(analyticsService, 'trackEvent').and.callFake(() => {});
        spyOn(console, 'error');

        ctrl.saveNewList();
        scope.$apply();

        expect(listsApiService.createListPromise).toHaveBeenCalled();
        expect(analyticsService.trackEvent).not.toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
      });
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
      spyOn(opportunitiesService, 'getAndUpdateStoresWithOpportunities').and.callFake(function() {
        var deferred = q.defer();
        return deferred.promise;
      });
      spyOn(targetListService, 'getAndUpdateTargetListStoresWithOpportunities').and.callFake(() => {
        let deferred = q.defer();
        return deferred.promise;
      });
    });

    it('should toggle asc when the same sort is applied', function() {
      ctrl.pageName = 'opportunities';
      ctrl.sortBy('store');

      expect(filtersService.model.appliedFilter.sort.sortArr[0]).toEqual({str: 'store', asc: false});
    });

    it('should switch the sort string and set asc to true when a new sort is applied', function() {
      ctrl.pageName = 'opportunities';
      ctrl.sortBy('segmentation');

      expect(filtersService.model.appliedFilter.sort.sortArr[0]).toEqual({str: 'segmentation', asc: true});
    });

    it('should open loader when the sort is applied', function() {
      ctrl.sortBy('store');
      expect(ctrl.loadingList).toBeTruthy();
    });

    it('should send request to get opportunities when sort is applied', function() {
      ctrl.pageName = 'opportunities';
      ctrl.sortBy('store');
      expect(opportunitiesService.getAndUpdateStoresWithOpportunities).toHaveBeenCalled();
    });

    it('should toggle the boolean ascending on function call', function() {
      ctrl.pageName = 'target-list-detail';
      expect(ctrl.ascending).toEqual(true);
      ctrl.sortBy();
      expect(ctrl.ascending).toEqual(false);
    });

    it('should assign ascending orderBy for store, depletions and segmentation when each is provided as param and ascending is true', function() {
      ctrl.pageName = 'target-list-detail';

      ctrl.ascending = false;
      ctrl.sortBy('store');
      expect(targetListService.getAndUpdateTargetListStoresWithOpportunities).toHaveBeenCalled();

      ctrl.ascending = false;
      ctrl.sortBy('opportunity');
      expect(targetListService.getAndUpdateTargetListStoresWithOpportunities).toHaveBeenCalled();

      ctrl.ascending = false;
      ctrl.sortBy('depletions');
      expect(targetListService.getAndUpdateTargetListStoresWithOpportunities).toHaveBeenCalled();

      ctrl.ascending = false;
      ctrl.sortBy('segmentation');
      expect(targetListService.getAndUpdateTargetListStoresWithOpportunities).toHaveBeenCalled();
    });

    it('should assign descending orderBy for store, depletions and segmentation when each is provided as param and ascending is false', function() {
      ctrl.pageName = 'target-list-detail';

      ctrl.ascending = true;
      ctrl.sortBy('store');
      expect(targetListService.getAndUpdateTargetListStoresWithOpportunities).toHaveBeenCalled();

      ctrl.ascending = true;
      ctrl.sortBy('opportunity');
      expect(targetListService.getAndUpdateTargetListStoresWithOpportunities).toHaveBeenCalled();

      ctrl.ascending = true;
      ctrl.sortBy('depletions');
      expect(targetListService.getAndUpdateTargetListStoresWithOpportunities).toHaveBeenCalled();

      ctrl.ascending = true;
      ctrl.sortBy('segmentation');
      expect(targetListService.getAndUpdateTargetListStoresWithOpportunities).toHaveBeenCalled();
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
      ctrl.updateOpportunityModel(opportunities, selected.map(selected => selected.id));
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
      ctrl.updateOpportunityModel(singleOpp, selected.map(selected => selected.id));
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
      ctrl.toggleOpportunitiesInStore(storeToBeAdded, ctrl.selected);
      expect(ctrl.selected[0].id).toEqual(storeToBeAdded.id);
    });

    it('should remove the store from the selection', function() {
      var storeToBeAdded = opportunitiesService.model.opportunities[0];
      ctrl.toggleOpportunitiesInStore(storeToBeAdded, ctrl.selected);
      ctrl.toggleOpportunitiesInStore(storeToBeAdded, ctrl.selected);
      expect(ctrl.selected[0]).toBeUndefined();
    });

    it('should add all stores in the page to the selection', function() {
      ctrl.toggleSelectAllStores();
      expect(ctrl.selected.length).toEqual(2);
    });

    it('should display the toast to select all the opportunities when selecting all the stores', function() {
      ctrl.selectAllToastVisible = false;
      ctrl.toggleSelectAllStores();
      expect(ctrl.selectAllToastVisible).toBeTruthy();
    });

    it('should not display the toast to select all the opportunities when unselecting all the stores', function() {
      ctrl.selectAllToastVisible = true;
      ctrl.toggleSelectAllStores(false);
      expect(ctrl.selectAllToastVisible).toBeFalsy();
    });

    it('should display the toast to select all the opportunities when selecting the last store', function() {
      ctrl.selectAllToastVisible = false;
      ctrl.toggleSelectAllStores();
      const storeToToggle = opportunitiesService.model.opportunities[0];
      ctrl.toggleOpportunitiesInStore(storeToToggle, ctrl.selected);
      expect(ctrl.selectAllToastVisible).toBeFalsy();
      ctrl.toggleOpportunitiesInStore(storeToToggle, ctrl.selected);
      expect(ctrl.selectAllToastVisible).toBeTruthy();
    });

    it('should display the toast to select all the opportunities when selecting the last opportunity', function() {
      ctrl.selectAllToastVisible = false;

      const fakeEvent = {
        stopPropagation: () => {}
      };

      ctrl.toggleSelectAllStores();
      const storeToToggle = opportunitiesService.model.opportunities[0];
      const opportunityToToggle = storeToToggle.groupedOpportunities[0];
      ctrl.selectOpportunity(fakeEvent, storeToToggle, opportunityToToggle, ctrl.selected);
      expect(ctrl.selectAllToastVisible).toBeFalsy();
      ctrl.selectOpportunity(fakeEvent, storeToToggle, opportunityToToggle, ctrl.selected);
      expect(ctrl.selectAllToastVisible).toBeTruthy();
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
      var store = opportunitiesService.model.opportunities[0];

      ctrl.toggleOpportunitiesInStore(store, ctrl.selected);
      expect(store.selectedOpportunities).toEqual(store.groupedOpportunities.length);
    });

    it('should deselect all opportunities inside a store', function() {
      var store = opportunitiesService.model.opportunities[0];
      store.groupedOpportunities[0].selected = true;

      ctrl.toggleOpportunitiesInStore(store, ctrl.selected);
      ctrl.toggleOpportunitiesInStore(store, ctrl.selected);
      expect(store.selectedOpportunities).toEqual(0);
      expect(store.groupedOpportunities[0].selected).toBeFalsy();
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

    beforeEach(() => {
      ctrl.userService = {
        model: {
          targetLists: {
            owned: [{
              opportunitiesSummary: {
                opportunitiesCount: 300
              },
              id: 'fakeID',
              name: chance.string()
            }, {
              opportunitiesSummary: {
                opportunitiesCount: chance.string()
              },
              id: listId,
              name: chance.string()
            }]
          }
        }
      };

      spyOn(ctrl, 'opportunitiesToCopy').and.callFake(() => {
        const defer = q.defer();
        defer.resolve([{id: chance.string(), store: {id: chance.string}}, {id: chance.string(), store: {id: chance.string}}]);
        return defer.promise;
      });

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

      httpBackend.expectGET('/v2/users/1/targetLists/').respond(200);
    });

    afterEach(function() {
      ctrl.selected = [];
      listId = 'fc1a0734-a16e-4953-97da-bba51c4690f6';
    });

    describe('add to list modal', () => {
      let allActiveLists;

      beforeEach(() => {
        allActiveLists = [
          {
            opportunitiesSummary: {
              opportunitiesCount: 300
            },
            id: chance.string(),
            name: chance.string()
          }, {
            opportunitiesSummary: {
              opportunitiesCount: chance.string()
            },
            id: chance.string(),
            name: chance.string()
          }
        ];
      });

      describe('when user launches the Add to List modal', () => {
        it('should send the proper inputs to compassModalService#showActionModalDialog', () => {
          compassModalService.modalActionBtnContainerEvent.and.callFake(() => {
            const modalEventResponse = {
              radioOptionSelected: ListSelectionType.Stores,
              dropdownOptionSelected: allActiveLists[0].id
            };
            const defer = q.defer();
            defer.resolve(modalEventResponse);
            return defer.promise;
          });

          const expectedRadioOptions = [{
            display: ListSelectionType.Stores,
            value: ListSelectionType.Stores
          }, {
            display: ListSelectionType.Opportunities,
            value: ListSelectionType.Opportunities
          }];

          const expectedDropdownMenu = [{
            display: 'Choose a List',
            value: 'Choose a List'
          }, {
            display: 'Create New List',
            value: 'Create New List'
          }, {
            display: allActiveLists[0].name,
            value: allActiveLists[0].id
          }, {
            display: allActiveLists[1].name,
            value: allActiveLists[1].id
          }];

          const expectedBodyText = '<div class=\'modal-body-inner-title\'>CURRENT SELECTION</div><b>1 opportunity</b> selected across 1 store';

          const expectedInputs = {
            title: 'Add to List',
            bodyText: expectedBodyText,
            radioInputModel: {
              radioOptions: expectedRadioOptions,
              selected: expectedRadioOptions[0].value,
              title: 'OPTIONS',
              stacked: false
            },
            dropdownInputModel: {
              selected: expectedDropdownMenu[0].value,
              dropdownOptions: expectedDropdownMenu,
              title: 'LIST'
            },
            acceptLabel: 'Add to List',
            rejectLabel: 'Cancel'
          };

          const selected = [angular.copy(opportunitiesService.model.opportunities[0].groupedOpportunities[0])];

          ctrl.launchAddToListModal(selected, allActiveLists);
          scope.$apply();
          expect(compassModalService.showActionModalDialog.calls.argsFor(0)).toEqual([expectedInputs, null]);
        });
      });

      describe('when the user selects STORES and a list to add to in the add-to-list modal', () => {
        let selected;

        beforeEach(() => {
          compassModalService.modalActionBtnContainerEvent.and.callFake(() => {
            const modalEventResponse = {
              radioOptionSelected: ListSelectionType.Stores,
              dropdownOptionSelected: allActiveLists[0].id
            };
            const defer = q.defer();
            defer.resolve(modalEventResponse);
            return defer.promise;
          });
          spyOn(listsApiService, 'addStoresToListPromise');
          selected = generateRandomSizedArray(1, 5).map(() => {
            return { store: { id: chance.string() } };
          });
          spyOn(ctrl, 'toggleSelectAllStores');
          spyOn(loaderService, 'closeLoader');
          spyOn(toastService, 'showToast');
          spyOn(ctrl, 'getTargetLists');
        });

        it('should call the listsApiService#addStoreToListPromise with the storeSourceCode for each unique store', () => {
          ctrl.launchAddToListModal(selected, allActiveLists);
          scope.$apply();
          selected.forEach(selection => {
            expect(listsApiService.addStoresToListPromise).toHaveBeenCalledWith(allActiveLists[0].id, {storeSourceCode: selection.store.id});
          });
        });

        describe('when calls to listApiService#addStoreToListPromise return successfully', () => {
          beforeEach(() => {
            listsApiService.addStoresToListPromise.and.callFake(() => {
              const defer = q.defer();
              defer.resolve();
              return defer.promise;
            });
            ctrl.launchAddToListModal(selected, allActiveLists);
            scope.$apply();
          });

          it('should call toggleSelectAllStores', () => {
            expect(ctrl.toggleSelectAllStores).toHaveBeenCalledWith(false);
          });

          it('should close the loader', () => {
            expect(loaderService.closeLoader).toHaveBeenCalled();
          });

          it('should call toastService#showToast to show the added toast', () => {
            expect(toastService.showToast).toHaveBeenCalledWith('added');
          });

          it('should call getTargetLists to refetch the users lists', () => {
            expect(ctrl.getTargetLists).toHaveBeenCalled();
          });
        });

        describe('when calls to listApiService#addStoreToListPromise returns with an error', () => {
          beforeEach(() => {
            listsApiService.addStoresToListPromise.and.callFake(() => {
              const defer = q.defer();
              defer.reject();
              return defer.promise;
            });
            ctrl.launchAddToListModal(selected, allActiveLists);
            scope.$apply();
          });

          it('should call toggleSelectAllStores', () => {
            expect(ctrl.toggleSelectAllStores).toHaveBeenCalledWith(false);
          });

          it('should close the loader', () => {
            expect(loaderService.closeLoader).toHaveBeenCalled();
          });

          it('should call toastService#showToast to show the addedError toast', () => {
            expect(toastService.showToast).toHaveBeenCalledWith('addedError');
          });

          it('should call getTargetLists to refetch the users lists', () => {
            expect(ctrl.getTargetLists).toHaveBeenCalled();
          });
        });
      });

      describe('when the user selects STORES AND OPPORTUNITIES and a list to add to in the add-to-list modal', () => {
        let selected;

        beforeEach(() => {
          spyOn(listsApiService, 'addOpportunitiesToListPromise').and.callFake(() => {
            const defer = q.defer();
            defer.resolve();
            return defer.promise;
          });
          spyOn(ctrl, 'toggleSelectAllStores');
          spyOn(loaderService, 'closeLoader');
          spyOn(toastService, 'showToast');
          spyOn(ctrl, 'getTargetLists');

          compassModalService.modalActionBtnContainerEvent.and.callFake(() => {
            const modalEventResponse = {
              radioOptionSelected: ListSelectionType.Opportunities,
              dropdownOptionSelected: allActiveLists[0].id
            };
            const defer = q.defer();
            defer.resolve(modalEventResponse);
            return defer.promise;
          });

          selected = generateRandomSizedArray(1, 5).map(() => {
            return { id: chance.string(), store: { id: chance.string() } };
          });
        });

        it('should call the listsApiService#addOpportunitiesToListPromise with a collection of all selected opportunities', () => {
          const expectedOpportunityIds = selected.map((opportunity) => {
            return {
              opportunityId: opportunity.id
            };
          });

          ctrl.launchAddToListModal(selected, allActiveLists);
          scope.$apply();
          expect(listsApiService.addOpportunitiesToListPromise).toHaveBeenCalledWith(allActiveLists[0].id, expectedOpportunityIds);
        });

        describe('when calls to listApiService#addOpportunitiesToListPromise return successfully', () => {
          beforeEach(() => {
            listsApiService.addOpportunitiesToListPromise.and.callFake(() => {
              const defer = q.defer();
              defer.resolve();
              return defer.promise;
            });
            ctrl.launchAddToListModal(selected, allActiveLists);
            scope.$apply();
          });

          it('should call toggleSelectAllStores', () => {
            expect(ctrl.toggleSelectAllStores).toHaveBeenCalledWith(false);
          });

          it('should close the loader', () => {
            expect(loaderService.closeLoader).toHaveBeenCalled();
          });

          it('should call toastService#showToast to show the added toast', () => {
            expect(toastService.showToast).toHaveBeenCalledWith('added');
          });

          it('should call getTargetLists to refetch the users lists', () => {
            expect(ctrl.getTargetLists).toHaveBeenCalled();
          });
        });

        describe('when calls to listApiService#addOpportunitiesToListPromise returns with an error', () => {
          beforeEach(() => {
            listsApiService.addOpportunitiesToListPromise.and.callFake(() => {
              const defer = q.defer();
              defer.reject();
              return defer.promise;
            });
            ctrl.launchAddToListModal(selected, allActiveLists);
            scope.$apply();
          });

          it('should call toggleSelectAllStores', () => {
            expect(ctrl.toggleSelectAllStores).toHaveBeenCalledWith(false);
          });

          it('should close the loader', () => {
            expect(loaderService.closeLoader).toHaveBeenCalled();
          });

          it('should call toastService#showToast to show the addedError toast', () => {
            expect(toastService.showToast).toHaveBeenCalledWith('addedError');
          });

          it('should call getTargetLists to refetch the users lists', () => {
            expect(ctrl.getTargetLists).toHaveBeenCalled();
          });
        });
      });
    });

    it('should add opportunities to list', () => {
      spyOn(listsApiService, 'addOpportunitiesToListPromise').and.callFake(() => {
        const defer = q.defer();
        defer.resolve();
        return defer.promise;
      });

      ctrl.toggleSelectAllStores();
      ctrl.addToTargetList(listId);

      scope.$apply();

      expect(listsApiService.addOpportunitiesToListPromise).toHaveBeenCalled();
    });

    it('should request the IDs of all the opportunities without limit when selectAllOpportunities is true', () => {
      ctrl.isAllOpportunitiesSelected = true;
      const opportunitiesDeferred = q.defer();

      spyOn(listsApiService, 'addOpportunitiesToListPromise').and.callFake(() => {
        const defer = q.defer();
        defer.resolve();
        return defer.promise;
      });

      spyOn(opportunitiesService, 'getOpportunities').and.callFake(() => {
        return opportunitiesDeferred.promise;
      });

      ctrl.toggleSelectAllStores();
      ctrl.addToTargetList(listId);

      opportunitiesDeferred.resolve(['fake1', 'fake2']);
      scope.$digest();

      expect(listsApiService.addOpportunitiesToListPromise).toHaveBeenCalled();
      expect(opportunitiesService.getOpportunities).toHaveBeenCalled();
    });

    it('should not call addOpportunitiesToList if opportunites are not selected', function() {
      spyOn(listsApiService, 'addOpportunitiesToListPromise').and.callFake(() => {
        const defer = q.defer();
        defer.resolve();
        return defer.promise;
      });

      ctrl.addToTargetList(listId);
      expect(listsApiService.addOpportunitiesToListPromise).not.toHaveBeenCalled();
    });

    it('should not call addOpportunitiesToList if list id is null', function() {
      spyOn(listsApiService, 'addOpportunitiesToListPromise').and.callFake(() => {
        const defer = q.defer();
        defer.resolve();
        return defer.promise;
      });
      listId = null;
      ctrl.toggleSelectAllStores();
      ctrl.addToTargetList(listId);
      expect(listsApiService.addOpportunitiesToListPromise).not.toHaveBeenCalled();
    });

    it('should change the selected opportunities from open to targeted when they are changed from open to targeted and opportunityStatus is targeted', function() {
      // scaffold
      ctrl.selected = [angular.copy(opportunitiesService.model.opportunities[1].groupedOpportunities[0])];

      spyOn(listsApiService, 'addOpportunitiesToListPromise').and.callFake(() => {
        const defer = q.defer();
        defer.resolve();
        return defer.promise;
      });
      spyOn(toastService, 'showToast').and.callFake(() => true);

      filtersService.model.opportunityStatusTargeted = true;
      filtersService.model.selected.opportunityStatus = ['TARGETED'];

      // assert init
      expect(opportunitiesService.model.opportunities.length).toEqual(2);
      expect(ctrl.selected.length).toEqual(1);
      expect(listsApiService.addOpportunitiesToListPromise.calls.count()).toEqual(0);
      expect(toastService.showToast.calls.count()).toEqual(0);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(1);

      // run test
      ctrl.addToTargetList(listId);
      scope.$digest();

      // assert
      expect(listsApiService.addOpportunitiesToListPromise).toHaveBeenCalledWith(listId, [{opportunityId: '0080993___80013466___20160929'}]);
      expect(ctrl.selected.length).toEqual(0);
      expect(listsApiService.addOpportunitiesToListPromise.calls.count()).toEqual(1);
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

      spyOn(listsApiService, 'addOpportunitiesToListPromise').and.callFake(() => {
        const defer = q.defer();
        defer.resolve();
        return defer.promise;
      });
      spyOn(toastService, 'showToast').and.callFake(() => true);

      filtersService.model.selected.opportunityStatus = [];

      // assert init
      expect(opportunitiesService.model.opportunities.length).toEqual(2);
      expect(ctrl.selected.length).toEqual(1);
      expect(listsApiService.addOpportunitiesToListPromise.calls.count()).toEqual(0);
      expect(toastService.showToast.calls.count()).toEqual(0);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(1);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities[0].status).toEqual('OPEN');

      // run test
      ctrl.addToTargetList(listId);
      scope.$digest();

      // assert
      expect(listsApiService.addOpportunitiesToListPromise).toHaveBeenCalledWith(listId, [{opportunityId: '0080993___80013466___20160929'}]);
      expect(ctrl.selected.length).toEqual(0);
      expect(listsApiService.addOpportunitiesToListPromise.calls.count()).toEqual(1);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(1);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities[0].status).toEqual('TARGETED');

      // reset
      opportunitiesService.model.opportunities[0].groupedOpportunities[0].status = 'OPEN';
    });

    it('should remove the selected opportunities from view when they are changed from open to targeted and open opportunityStatus is open - remove store from view if last opp', function() {
      // scaffold
      ctrl.selected = [angular.copy(opportunitiesService.model.opportunities[1].groupedOpportunities[0])];

      spyOn(listsApiService, 'addOpportunitiesToListPromise').and.callFake(() => {
        const defer = q.defer();
        defer.resolve();
        return defer.promise;
      });
      spyOn(toastService, 'showToast').and.callFake(() => true);

      filtersService.model.opportunityStatusOpen = true;
      filtersService.model.selected.opportunityStatus = ['OPEN'];

      // assert init
      expect(opportunitiesService.model.opportunities.length).toEqual(2);
      expect(ctrl.selected.length).toEqual(1);
      expect(listsApiService.addOpportunitiesToListPromise.calls.count()).toEqual(0);
      expect(toastService.showToast.calls.count()).toEqual(0);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(1);

      // run test
      ctrl.addToTargetList(listId);
      scope.$digest();

      // assert
      expect(listsApiService.addOpportunitiesToListPromise).toHaveBeenCalledWith(listId, [{opportunityId: '0080993___80013466___20160929'}]);
      expect(ctrl.selected.length).toEqual(0);
      expect(listsApiService.addOpportunitiesToListPromise.calls.count()).toEqual(1);
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

      spyOn(listsApiService, 'addOpportunitiesToListPromise').and.callFake(() => {
        const defer = q.defer();
        defer.resolve();
        return defer.promise;
      });
      spyOn(toastService, 'showToast').and.callFake(() => true);

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
      expect(listsApiService.addOpportunitiesToListPromise.calls.count()).toEqual(0);
      expect(toastService.showToast.calls.count()).toEqual(0);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(2);
      expect(opportunitiesService.model.opportunities[1].store.highImpactOpportunityCount).toEqual(1);

      // run test
      ctrl.addToTargetList(listId);
      scope.$digest();

      // assert
      expect(listsApiService.addOpportunitiesToListPromise).toHaveBeenCalledWith(listId, [{opportunityId: '0080993___80013466___20160929'}]);
      expect(ctrl.selected.length).toEqual(0);
      expect(listsApiService.addOpportunitiesToListPromise.calls.count()).toEqual(1);
      expect(opportunitiesService.model.opportunities.length).toEqual(2);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(1);
      expect(opportunitiesService.model.opportunities[1].store.highImpactOpportunityCount).toEqual(1);
    });

    it('should update count of high opportunities if one is removed', function() {
      // scaffold
      spyOn(listsApiService, 'addOpportunitiesToListPromise').and.callFake(() => {
        const defer = q.defer();
        defer.resolve();
        return defer.promise;
      });
      spyOn(toastService, 'showToast').and.callFake(() => true);

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
      scope.$digest();

      // assert
      expect(listsApiService.addOpportunitiesToListPromise).toHaveBeenCalledWith(listId, [{opportunityId: '5231788___228-102___1474493257763'}]);
      expect(ctrl.selected.length).toEqual(0);
      expect(opportunitiesService.model.opportunities.length).toEqual(2);
      expect(opportunitiesService.model.opportunities[1].groupedOpportunities.length).toEqual(1);
      expect(opportunitiesService.model.opportunities[1].store.highImpactOpportunityCount).toEqual(0);
    });

    describe('when there are enough opportunities spots remaining to add to target list', () => {
      let addToTargetListPromise;
      let opportunityIDsPromise;
      let analyticsCategoryMock;
      let permissionLevelMock;
      let selectedListMock;
      let archivedMock;
      const destTargetListMock = {
        opportunitiesSummary: {
          opportunitiesCount: 300
        },
        id: 'fakeID'
      };

      beforeEach(() => {
        addToTargetListPromise = q.defer();
        opportunityIDsPromise = q.defer();
        analyticsCategoryMock = chance.string();
        permissionLevelMock = chance.string();
        selectedListMock = chance.string();
        archivedMock = chance.string();

        targetListService.model.currentList.permissionLevel = permissionLevelMock;
        targetListService.model.currentList.id = selectedListMock;
        targetListService.model.currentList.archived = archivedMock;
        spyOn(analyticsService, 'trackEvent');
        spyOn(targetListService, 'getAnalyticsCategory').and.callFake((permLvl, arch) => {
          if (permLvl === permissionLevelMock && arch === archivedMock) {
            return analyticsCategoryMock;
          }
        });
        spyOn(ctrl, 'addToTargetList').and.callThrough();
        spyOn(listsApiService, 'addOpportunitiesToListPromise').and.callFake(() => {
          const defer = q.defer();
          defer.resolve();
          return defer.promise;
        });
      });

      it('should add to target list and send analytics event for "add" action', () => {
        ctrl.selected = [{id: 'fake1'}];

        filtersService.model.appliedFilter.pagination.totalOpportunities = 5000;

        const fakeEvent = {
          stopPropagation: () => {}
        };

        ctrl.handleAddToTargetList(fakeEvent, destTargetListMock, 0, true);
        opportunityIDsPromise.resolve(['fake1']);
        addToTargetListPromise.resolve(true);

        scope.$digest();
        expect(ctrl.addToTargetList).toHaveBeenCalledWith(destTargetListMock.id);
        expect(ctrl.userService.model.targetLists.owned[0].opportunitiesSummary.opportunitiesCount).toEqual(301);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(analyticsCategoryMock, 'Add to List', destTargetListMock.id);
      });

      it('should add to target list and send analytics event for "copy" action', () => {
        ctrl.selected = [{id: 'fake1'}];

        filtersService.model.appliedFilter.pagination.totalOpportunities = 5000;

        const fakeEvent = {
          stopPropagation: () => {}
        };

        ctrl.handleAddToTargetList(fakeEvent, destTargetListMock, 0, false);
        opportunityIDsPromise.resolve(['fake1']);
        addToTargetListPromise.resolve(true);

        scope.$digest();

        expect(ctrl.addToTargetList).toHaveBeenCalledWith(destTargetListMock.id);
        expect(ctrl.userService.model.targetLists.owned[0].opportunitiesSummary.opportunitiesCount).toEqual(301);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith(analyticsCategoryMock, 'Copy to List', selectedListMock);
      });
    });

    describe('When we are on the opportunities page and we add to the list', () => {
      const destTargetListMock = {
        opportunitiesSummary: {
          opportunitiesCount: 300
        },
        id: 'fakeID'
      };

      let selectedListMock;

      beforeEach(() => {
        selectedListMock = chance.string();
        targetListService.model.currentList.id = selectedListMock;
      });

      it('should add to list and send analytics category of opportunity Add to List', () => {
        $state.current.name = 'opportunities';
        expect($state.current.name).toEqual('opportunities');
        spyOn(analyticsService, 'trackEvent');

        ctrl.selected = [{id: 'fake1'}];

        filtersService.model.appliedFilter.pagination.totalOpportunities = 5000;

        const fakeEvent = {
          stopPropagation: () => {}
        };

        ctrl.handleAddToTargetList(fakeEvent, destTargetListMock, 0, true);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith('Opportunities', 'Add to List', destTargetListMock.id);

      });

      it('should add to list and send analytics category of opportunity Copy to List', () => {
        $state.current.name = 'opportunities';
        expect($state.current.name).toEqual('opportunities');
        spyOn(analyticsService, 'trackEvent');
        ctrl.selected = [{id: 'fake1'}];

        filtersService.model.appliedFilter.pagination.totalOpportunities = 5000;

        const fakeEvent = {
          stopPropagation: () => {}
        };

        ctrl.handleAddToTargetList(fakeEvent, destTargetListMock, 0, false);
        expect(analyticsService.trackEvent).toHaveBeenCalledWith('Opportunities', 'Copy to List', selectedListMock);

      });
    });

    describe('when there are NOT enough opportunities spots remaining to add to target list', () => {
      let addToTargetListPromise;
      let analyticsCategoryMock;
      let permissionLevelMock;
      const destTargetListMock = {
        opportunitiesSummary: {
          opportunitiesCount: 1000
        },
        id: 'fakeID'
      };

      beforeEach(() => {
        addToTargetListPromise = q.defer();
        analyticsCategoryMock = chance.string();
        permissionLevelMock = chance.string();

        ctrl.userService.model.targetLists.owned[0].opportunitiesSummary.opportunitiesCount = 1000;
        targetListService.model.currentList.permissionLevel = permissionLevelMock;
        spyOn(analyticsService, 'trackEvent');
        spyOn(targetListService, 'getAnalyticsCategory').and.callFake((permLvl) => {
          if (permLvl === permissionLevelMock) {
            return analyticsCategoryMock;
          }
        });
        spyOn(ctrl, 'addToTargetList').and.callThrough();
        spyOn(targetListService, 'addTargetListOpportunities').and.callFake(() => {
          return addToTargetListPromise.promise;
        });
        spyOn(mdDialog, 'show');
      });

      it('should not add to target list or send analytics event, and should open modal', () => {
        ctrl.selected = ['fake1'];

        filtersService.model.appliedFilter.pagination.totalOpportunities = 5000;

        const fakeEvent = {
          stopPropagation: () => {}
        };

        ctrl.handleAddToTargetList(fakeEvent, destTargetListMock, 0, true);

        scope.$digest();

        expect(ctrl.addToTargetList).not.toHaveBeenCalled();
        expect(ctrl.userService.model.targetLists.owned[0].opportunitiesSummary.opportunitiesCount).toEqual(1000);
        expect(analyticsService.trackEvent).not.toHaveBeenCalled();

        expect(mdDialog.show).toHaveBeenCalled();
      });
    });
  });

  describe('selectAllOpportunities', () => {
    it('should toggle the flag to true', () => {
      ctrl.isAllOpportunitiesSelected = false;
      ctrl.selectAllOpportunities();
      expect(ctrl.isAllOpportunitiesSelected).toBeTruthy();
    });
  });

  describe('isTotalOpportunitiesWithinMaxLimit', () => {
    it('should return true when the given number is smaller or equal to then max', () => {
      filtersService.model.appliedFilter.pagination.totalOpportunities = 0;
      expect(ctrl.isTotalOpportunitiesWithinMaxLimit()).toBeTruthy();

      filtersService.model.appliedFilter.pagination.totalOpportunities = 999;
      expect(ctrl.isTotalOpportunitiesWithinMaxLimit()).toBeTruthy();

      filtersService.model.appliedFilter.pagination.totalOpportunities = 1000;
      expect(ctrl.isTotalOpportunitiesWithinMaxLimit()).toBeTruthy();
    });

    it('should return false when the given number is bigger than then max', () => {
      filtersService.model.appliedFilter.pagination.totalOpportunities = 1001;
      expect(ctrl.isTotalOpportunitiesWithinMaxLimit()).toBeFalsy();
    });
  });

  describe('sendDownloadEvent GA events', () => {
    let analyticsCategoryMock;
    let permissionLevelMock;
    let selectedListMock;
    let archivedMock;

    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent');

      analyticsCategoryMock = chance.string();
      permissionLevelMock = chance.string();
      selectedListMock = chance.string();
      archivedMock = chance.string();
      targetListService.model.currentList.permissionLevel = permissionLevelMock;
      targetListService.model.currentList.id = selectedListMock;
      targetListService.model.currentList.archived = archivedMock;

      spyOn(targetListService, 'getAnalyticsCategory').and.callFake((permLvl, arch) => {
        if (permLvl === permissionLevelMock && arch === archivedMock) {
          return analyticsCategoryMock;
        }
      });
    });

    describe('when page is opportunities', () => {
      beforeEach(() => {
        ctrl.pageName = 'opportunities';
      });

      it('should record GA event when csvDownloadOption is With Rationales', () => {
        ctrl.csvDownloadOption = filtersService.csvDownloadOptions[0].value;
        ctrl.sendDownloadEvent();

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(
          'Opportunities',
          'Download Opportunities - With Rationales',
          'Opportunity Result Set');
      });

      it('should record GA event when csvDownloadOption is Without Rationales', () => {
        ctrl.csvDownloadOption = filtersService.csvDownloadOptions[1].value;
        ctrl.sendDownloadEvent();

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(
          'Opportunities',
          'Download Opportunities - Without Rationales',
          'Opportunity Result Set');
      });

      it('should record GA event when csvDownloadOption is Stores', () => {
        ctrl.csvDownloadOption = filtersService.csvDownloadOptions[2].value;
        ctrl.sendDownloadEvent();

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(
          'Opportunities',
          'Download Opportunities - Stores Only',
          'Opportunity Result Set');
      });
    });

    describe('when page is target list details', () => {
      beforeEach(() => {
        ctrl.pageName = 'target-list-detail';
      });

      it('should record GA event when csvDownloadOption is With Rationales', () => {
        ctrl.csvDownloadOption = filtersService.csvDownloadOptions[0].value;
        ctrl.sendDownloadEvent();

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(
          analyticsCategoryMock,
          'Download List - With Rationales',
          selectedListMock);
      });

      it('should record GA event when csvDownloadOption is Without Rationales', () => {
        ctrl.csvDownloadOption = filtersService.csvDownloadOptions[1].value;
        ctrl.sendDownloadEvent();

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(
          analyticsCategoryMock,
          'Download List - Without Rationales',
          selectedListMock);
      });

      it('should record GA event when csvDownloadOption is Stores', () => {
        ctrl.csvDownloadOption = filtersService.csvDownloadOptions[2].value;
        ctrl.sendDownloadEvent();

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(
          analyticsCategoryMock,
          'Download List - Stores Only',
          selectedListMock);
      });
    });

    describe('list.retrieveStoreCountForSelectedOpportunities', () => {
      beforeEach(() => {
        ctrl.isAllOpportunitiesSelected = false;
      });

      it('should return the count of all items if isAllOpportunitiesSelected is true', () => {
        ctrl.isAllOpportunitiesSelected = true;
        filtersService.model.appliedFilter.pagination.totalStores = 2;
        let selectedList = [
          {
            'id': '1'
          },
          {
            'id': '2'
          }];
        let storeCount = ctrl.retrieveStoreCountForSelectedOpportunities(selectedList);

        expect(storeCount).toEqual(filtersService.model.appliedFilter.pagination.totalStores);
      });

      it('should return 0 if the list is empty', () => {
        filtersService.model.appliedFilter.pagination.totalStores = 0;
        let selectedList = [];
        let storeCount = ctrl.retrieveStoreCountForSelectedOpportunities(selectedList);

        expect(storeCount).toEqual(filtersService.model.appliedFilter.pagination.totalStores);
      });

      it('should return 0 if the list is null', () => {
        filtersService.model.appliedFilter.pagination.totalStores = 0;
        let selectedList = null;
        let storeCount = ctrl.retrieveStoreCountForSelectedOpportunities(selectedList);

        expect(storeCount).toEqual(filtersService.model.appliedFilter.pagination.totalStores);
      });

      it('should return number of unique stores from multiple opportunities from same store', () => {
        let selectedList = [{
          'id': '1',
          'store': {
            'id': '1'
          }
        },
        {
          'id': '2',
          'store': {
            'id': '1'
          }
        },
        {
          'id': '3',
          'store': {
            'id': '1'
          }
        }];
        let expectedStoreCount = 1;
        let storeCount = ctrl.retrieveStoreCountForSelectedOpportunities(selectedList);

        expect(storeCount).toEqual(expectedStoreCount);
      });

      it('should return number of unique stores from multiple opportunities all from different stores', () => {
        let selectedList = [{
          'id': '1',
          'store': {
            'id': '1'
          }
        },
        {
          'id': '2',
          'store': {
            'id': '2'
          }
        },
        {
          'id': '3',
          'store': {
            'id': '3'
          }
        }];
        let expectedStoreCount = 3;
        let storeCount = ctrl.retrieveStoreCountForSelectedOpportunities(selectedList);

        expect(storeCount).toEqual(expectedStoreCount);
      });

      it('should return number of unique stores from mix of multiple opportunities from same store and different store', () => {
        let selectedList = [{
          'id': '1',
          'store': {
            'id': '1'
          }
        },
        {
          'id': '2',
          'store': {
            'id': '1'
          }
        },
        {
          'id': '3',
          'store': {
            'id': '2'
          }
        }];
        let expectedStoreCount = 2;
        let storeCount = ctrl.retrieveStoreCountForSelectedOpportunities(selectedList);

        expect(storeCount).toEqual(expectedStoreCount);
      });
    });

    describe('list.retrieveOpportunityCountFromSelection', () => {
      beforeEach(() => {
        ctrl.isAllOpportunitiesSelected = false;
      });

      it('should return the count of all items if isAllOpportunitiesSelected is true', () => {
        ctrl.isAllOpportunitiesSelected = true;
        filtersService.model.appliedFilter.pagination.totalOpportunities = 2;
        let selectedList = [
          {
            'id': '1'
          },
          {
            'id': '2'
          }];
        let opportunityCount = ctrl.retrieveOpportunityCountFromSelection(selectedList);

        expect(opportunityCount).toEqual(filtersService.model.appliedFilter.pagination.totalOpportunities);
      });

      it('should return 0 if the list is empty', () => {
        filtersService.model.appliedFilter.pagination.totalOpportunities = 0;
        let selectedList = [];
        let opportunityCount = ctrl.retrieveOpportunityCountFromSelection(selectedList);

        expect(opportunityCount).toEqual(filtersService.model.appliedFilter.pagination.totalOpportunities);
      });

      it('should return 0 if the list is null', () => {
        let selectedList = null;
        let opportunityCount = ctrl.retrieveOpportunityCountFromSelection(selectedList);

        expect(opportunityCount).toEqual(0);
      });

      it('should return number of opportunities selected, not totalOpportunities', () => {
        let selectedList = [{
          'id': '1',
          'store': {
            'id': '1'
          }
        },
        {
          'id': '2',
          'store': {
            'id': '1'
          }
        },
        {
          'id': '3',
          'store': {
            'id': '1'
          }
        }];
        let expectedOpportunityCount = 3;
        filtersService.model.appliedFilter.pagination.totalOpportunities = 10;
        let opportunityCount = ctrl.retrieveOpportunityCountFromSelection(selectedList);

        expect(opportunityCount).toEqual(expectedOpportunityCount);
        expect(opportunityCount).not.toEqual(filtersService.model.appliedFilter.pagination.totalOpportunities);
      });
    });
  });
});
