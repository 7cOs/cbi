import * as Chance from 'chance';

const chance = new Chance();

describe('Unit: opportunitiesController', function() {
  var scope, q, ctrl, userService, filtersService, opportunityFiltersService, $mdDialog, title;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.modules.opportunities');

    angular.mock.module(($provide) => {
      title = {
        setTitle: () => {}
      };
      $provide.value('title', title);
    });

    inject(function($rootScope, $controller, $q, opportunitiesService, _userService_, _chipsService_, _filtersService_, _opportunityFiltersService_, _$mdDialog_) {
      scope = $rootScope.$new();
      q = $q;
      userService = _userService_;
      filtersService = _filtersService_;
      opportunityFiltersService = _opportunityFiltersService_;
      $mdDialog = _$mdDialog_;
      // Currently not required but will be in future test cases
      // filtersService = _filtersService_;

      spyOn(userService, 'getOpportunityFilters').and.callFake(function() {
        var deferred = q.defer();
        return deferred.promise;
      });
      ctrl = $controller('opportunitiesController', {$scope: scope});
    });
  });

  it('should have services defined', function() {
    expect(ctrl.chipsService).not.toBeUndefined();
    expect(typeof (ctrl.chipsService)).toEqual('object');
    expect(ctrl.filtersService).not.toBeUndefined();
    expect(typeof (ctrl.filtersService)).toEqual('object');
    expect(ctrl.userService).not.toBeUndefined();
    expect(typeof (ctrl.userService)).toEqual('object');
    expect(ctrl.opportunitiesService).not.toBeUndefined();
    expect(typeof (ctrl.opportunitiesService)).toEqual('object');
  });

  it('apply saved filter', function() {
    var filter = {
      description: '{"filterModel":{"expanded":true,"disableReset":true,"filtersApplied":true,"filtersDefault":false,"disableSaveFilter":true,"filtersValidCount":1,"selected":{"myAccountsOnly":false,"account":[],"subaccount":[],"accountTypes":"","brand":[],"masterSKU":[],"cbbdChain":[],"contact":[],"city":[],"currentFilter":"b712c687-4849-4e26-b59f-81f8f98bc1bd","distributor":["2225024"],"impact":[],"opportunityStatus":["Targeted"],"opportunityType":["All Types"],"premiseType":"off","productType":[],"store":[],"retailer":"Chain","brandSearchText":"","storeSearchText":"","distributorSearchText":"","segmentation":["A","B","C"],"state":[],"tradeChannel":[],"trend":"","valuesVsTrend":"","zipCode":[]},"storeSegmentationA":true,"storeSegmentationB":true,"storeSegmentationC":true,"productTypeAuthorized":false,"tradeChannelGrocery":false,"tradeChannelConvenience":false,"tradeChannelDrug":false,"tradeChannelMass Merchandiser":false,"tradeChannelLiquor":false,"tradeChannelMilitary":false,"tradeChannelRecreation":false,"tradeChannelOther Trade Channel":false,"tradeChannelDining":false,"tradeChannelBar":false,"tradeChannelLodging":false,"tradeChannelTransportation":false,"currentFilter":{"dateCreated":"2016-11-15T23:29:29.988Z","dateUpdated":"2016-11-15T23:29:29.988Z","name":"Coastal Bev Co-Nc","filterString":"myAccountsOnly%3Afalse%2Cdistributor%3A2224951%2CpremiseType%3Aoff%2C","description": "YYYYYYY","id":"b712c687-4849-4e26-b59f-81f8f98bc1bd","ev":{"isTrusted":true}},"opportunityStatusTargeted":true},"chipsModel":[{"name":"Off-Premise","type":"premiseType","applied":true,"removable":false},{"name":"All Types","type":"opportunityType","applied":true,"removable":false},{"name":"Williams Dist Corp-ma","id":"2225024","type":"distributor","search":true,"applied":true,"removable":true,"tradeChannel":false},{"name":"Targeted","type":"opportunityStatus","search":true,"applied":true,"removable":true,"tradeChannel":false},{"name":"Segment A","type":"segmentation","search":true,"applied":true,"removable":true,"tradeChannel":false},{"name":"Segment B","type":"segmentation","search":true,"applied":true,"removable":true,"tradeChannel":false},{"name":"Segment C","type":"segmentation","search":true,"applied":true,"removable":true,"tradeChannel":false}]}',
      name: 'filter name',
      filterString: 'myAccountsOnly%3Afalse%2CcurrentFilter%3Ab712c687-4849-4e26-b59f-81f8f98bc1bd%2Cdistributor%3A2225024%2CopportunityStatus%3Atargeted%2CpremiseType%3Aoff%2Csegmentation%3AA%7CB%7CC%2C',
      id: '123666667'
    };
    expect(ctrl.chipsService.model).toEqual([]);
    ctrl.applySavedFilter(null, filter);
    expect(ctrl.chipsService.model).toEqual([{
      name: 'Off-Premise',
      type: 'premiseType',
      applied: true,
      removable: false
    }, {
      name: 'All Types',
      type: 'opportunityType',
      applied: true,
      removable: false
    }, {
      name: 'Williams Dist Corp-ma',
      id: '2225024',
      type: 'distributor',
      search: true,
      applied: true,
      removable: true,
      tradeChannel: false
    }, {
      name: 'Targeted',
      type: 'opportunityStatus',
      search: true,
      applied: true,
      removable: true,
      tradeChannel: false
    }, {
      name: 'Segment A',
      type: 'segmentation',
      search: true,
      applied: true,
      removable: true,
      tradeChannel: false
    }, {
      name: 'Segment B',
      type: 'segmentation',
      search: true,
      applied: true,
      removable: true,
      tradeChannel: false
    }, {
      name: 'Segment C',
      type: 'segmentation',
      search: true,
      applied: true,
      removable: true,
      tradeChannel: false }]);
    expect(ctrl.editedFilterName).toEqual('filter name');
    expect(filtersService.model.appliedFilter.appliedFilter).toEqual('myAccountsOnly:false,currentFilter:b712c687-4849-4e26-b59f-81f8f98bc1bd,distributor:2225024,opportunityStatus:targeted,premiseType:off,segmentation:A|B|C');
    expect(filtersService.model.productTypeAuthorized).toEqual(false);
    expect(filtersService.model.selected.productType).toEqual([]);
  });

  it('delete saved fitler', function() {
    userService.model.opportunityFilters = [{
      id: '45678'
    }, {
      id: '1234'
    }, {
      id: '99999'
    }];
    scope.$digest();

    spyOn(opportunityFiltersService, 'deleteOpportunityFilter').and.callFake(() => {
      const defer = q.defer();
      defer.resolve();
      return defer.promise;
    });

    ctrl.deleteSavedFilter('1234');
    scope.$digest();
    expect(userService.model.opportunityFilters).toEqual([{
      id: '45678'
    }, {
      id: '99999'
    }]);
  });

  it('should check for duplicate names', function() {
    spyOn(ctrl, 'editReportName').and.callFake(function() {
      return {
        then: function(callback) { return callback({}); }
      };
    });
    ctrl.editedFilterName = 'not a duplicate';
    userService.model.opportunityFilters = [{
      name: 'maybe a duplicate'
    }, {
      name: 'definitely a duplicate'
    }, {
      name: 'probably not a duplicate'
    }];
    ctrl.duplicateName = true;

    ctrl.duplicateNameCheck();
    expect(ctrl.duplicateName).toEqual(false);

    ctrl.editedFilterName = 'definitely a duplicate';
    ctrl.duplicateNameCheck();
    expect(ctrl.duplicateName).toEqual(true);
  });

  it('edit filter modal', function() {
    spyOn($mdDialog, 'show').and.callThrough();
    userService.model.opportunityFilters = [{id: '1234'}];

    expect(ctrl.duplicateName).toEqual(undefined);
    expect(ctrl.currentFilter).toEqual({});
    ctrl.editFilterModal('1234', {});
    expect(ctrl.duplicateName).toEqual(false);
    expect(ctrl.currentFilter).toEqual([{id: '1234'}]);
  });

  describe('editReportName', () => {
    let updateOpportunityFilterPromise;
    let currentFilterMock;
    let newReportNameMock;

    beforeEach(() => {
      updateOpportunityFilterPromise = q.defer();
      currentFilterMock = [{
        id: chance.natural(),
        name: chance.string()
      }];
      newReportNameMock = chance.string();

      ctrl.currentFilter = currentFilterMock;
      ctrl.editedFilterName = newReportNameMock;

      spyOn(opportunityFiltersService, 'updateOpportunityFilter').and.callFake(() => {
        return updateOpportunityFilterPromise.promise;
      });
    });

    it('should call opportunityFilterService.updateOpportunityFilter', () => {
      ctrl.editReportName();
      updateOpportunityFilterPromise.resolve();

      expect(opportunityFiltersService.updateOpportunityFilter.calls.count()).toEqual(1);
      expect(opportunityFiltersService.updateOpportunityFilter).toHaveBeenCalledWith(currentFilterMock[0].id, 'name', newReportNameMock);
    });

    it('should update the name of the saved report after opportunityFilterService.updateOpportunityFilter is successful', () => {
      ctrl.editReportName();
      updateOpportunityFilterPromise.resolve();
      scope.$digest();

      expect(ctrl.currentFilter[0].name).toBe(newReportNameMock);
    });

    it('should set the update report error flag to false when updating the report is successful', () => {
      ctrl.updateReportError = false;
      ctrl.editReportName();
      updateOpportunityFilterPromise.resolve();
      scope.$digest();

      expect(ctrl.updateReportError).toBe(false);

      ctrl.updateReportError = true;
      ctrl.editReportName();
      updateOpportunityFilterPromise.resolve();
      scope.$digest();

      expect(ctrl.updateReportError).toBe(false);
    });

    it('should NOT opportunistically update the name of the saved when opportunityFilterService.updateOpportunityFilter fails', () => {
      ctrl.editReportName();
      updateOpportunityFilterPromise.reject(chance.string());
      scope.$digest();

      expect(ctrl.currentFilter[0].name).not.toBe(newReportNameMock);
      expect(ctrl.currentFilter[0].name).toBe(currentFilterMock[0].name);
    });

    it('should set the update report error flag to true when updating the report is un-successful', () => {
      ctrl.updateReportError = false;
      ctrl.editReportName();
      updateOpportunityFilterPromise.reject();
      scope.$digest();

      expect(ctrl.updateReportError).toBe(true);

      ctrl.updateReportError = true;
      ctrl.editReportName();
      updateOpportunityFilterPromise.reject();
      scope.$digest();

      expect(ctrl.updateReportError).toBe(true);
    });
  });

  describe('deleteSavedFilter', () => {
    let deleteOpportunityFilterPromise;

    beforeEach(() => {
      deleteOpportunityFilterPromise = q.defer();

      spyOn(opportunityFiltersService, 'deleteOpportunityFilter').and.callFake(() => {
        return deleteOpportunityFilterPromise.promise;
      });
    });

    it('should set the delete report error flag to false when updating the report is successful', () => {
      ctrl.deleteReportError = false;
      ctrl.deleteSavedFilter();
      deleteOpportunityFilterPromise.resolve();
      scope.$digest();

      expect(ctrl.deleteReportError).toBe(false);

      ctrl.deleteReportError = false;
      ctrl.deleteSavedFilter();
      deleteOpportunityFilterPromise.resolve();
      scope.$digest();

      expect(ctrl.deleteReportError).toBe(false);
    });

    it('should set the delete report error flag to true when updating the report is un-successful', () => {
      ctrl.deleteReportError = false;
      ctrl.deleteSavedFilter();
      deleteOpportunityFilterPromise.reject();
      scope.$digest();

      expect(ctrl.deleteReportError).toBe(true);

      ctrl.deleteReportError = true;
      ctrl.deleteSavedFilter();
      deleteOpportunityFilterPromise.reject();
      scope.$digest();

      expect(ctrl.deleteReportError).toBe(true);
    });
  });

  describe('closeEditModal', () => {
    it('should set error flags for editing and deleting reports to false', () => {
      ctrl.deleteReportError = false;
      ctrl.updateReportError = false;
      ctrl.closeEditModal();
      scope.$digest();

      expect(ctrl.deleteReportError).toBe(false);
      expect(ctrl.updateReportError).toBe(false);

      ctrl.deleteReportError = true;
      ctrl.updateReportError = true;
      ctrl.closeEditModal();
      scope.$digest();

      expect(ctrl.deleteReportError).toBe(false);
      expect(ctrl.updateReportError).toBe(false);
    });
  });
});
