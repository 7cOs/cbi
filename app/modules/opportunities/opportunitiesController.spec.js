describe('Unit: opportunitiesController', function() {
  var scope, q, ctrl, userService, chipsService, filtersService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.modules.opportunities');

    inject(function($rootScope, $controller, $q, opportunitiesService, _userService_, _chipsService_, _filtersService_) {
      scope = $rootScope.$new();
      q = $q;
      userService = _userService_;
      chipsService = _chipsService_;
      filtersService = _filtersService_;

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

  describe('Apply saved report functionality', function() {
    // By default opportunity type filter is added at the end
    beforeEach(function() {
      // chipsService.resetChipsFilters();
      // filtersService.resetFilters();
    });

    function matchElementsInTwoArraysByFilterName(arr1, filteredArr) {
      var results = arr1.filter(function(value) {
        if (filteredArr.indexOf(value.name) !== -1) {
          return true;
        }
      });
      return results;
    }

    it('Check if current filter is of type boolean', function() {
      var boolFilter = {
        'name': 'testFilter',
        'filterString': 'myAccountsOnly%3Atrue'
      };
      ctrl.applySavedFilter(null, boolFilter);
      var result = chipsService.model.filter(function(value) {
        return value.name === chipsService.filterToChipModel.myAccountsOnly.name;
      });
      expect(result[0]).not.toBeUndefined();
    });

    it('Check if boolean filter is not added if false', function() {
      var boolFilter = {
        'name': 'testFilter',
        'filterString': 'myAccountsOnly%3Afalse'
      };
      ctrl.applySavedFilter(null, boolFilter);
      var result = chipsService.model.filter(function(value) {
        return value.name === chipsService.filterToChipModel.myAccountsOnly.name;
      });
      expect(result[0]).toBeUndefined();
    });

    it('Check if text filters are added with correct names', function() {
      var filterNames = ['DENVER'];
      var textFilter = {
        'name': 'testFilter',
        'filterString': 'city%3ADENVER'
      };
      ctrl.applySavedFilter(null, textFilter);
      var results = matchElementsInTwoArraysByFilterName(chipsService.model, filterNames);
      expect(results.length).toEqual(filterNames.length);
    });

    it('Check if multiple text filters are added with correct names', function() {
      var filterNames = ['DENVER', 'AK', 'AL', 'AZ'];
      var textFilter = {
        'name': 'testFilter',
        'filterString': 'city%3ADENVER%2Cstate%3AAK%7CAL%7CAZ'
      };
      ctrl.applySavedFilter(null, textFilter);
      var results = matchElementsInTwoArraysByFilterName(chipsService.model, filterNames);
      expect(results.length).toEqual(filterNames.length);
    });

    it('Check if wrong text filters are not added', function() {
      var filterNames = ['DENVER', 'AK', 'AL', 'AZ', 'CO'];
      var textFilter = {
        'name': 'testFilter',
        'filterString': 'city%3ADENVER%2Cstate%3AAK%7CAL%7CAZ'
      };
      ctrl.applySavedFilter(null, textFilter);
      var results = matchElementsInTwoArraysByFilterName(chipsService.model, filterNames);
      expect(results.length).not.toEqual(filterNames.length);
    });

    it('Check if multi valued filters are added', function() {
      var filterNames = ['Grocery', 'Drug', 'Liquor', 'Recreation', 'Convenience', 'Mass Merchandiser', 'Military, off-premise', 'Other'];
      var multiValuedFilter = {
        'name': 'testFilter',
        'filterString': 'tradeChannel%3A05%7C03%7C02%7C53%7C07%7C08%7CMF%7C'
      };
      ctrl.applySavedFilter(null, multiValuedFilter);
      var results = matchElementsInTwoArraysByFilterName(chipsService.model, filterNames);
      expect(results.length).toEqual(filterNames.length);
    });

    it('Check if multi valued filters and boolean filters are added', function() {
      var filterNames = ['My Accounts Only', 'Grocery', 'Drug', 'Liquor', 'Recreation', 'Convenience', 'Mass Merchandiser', 'Military, off-premise', 'Other'];
      var multipleFilters = {
        'name': 'testFilter',
        'filterString': 'myAccountsOnly%3Atrue%2CtradeChannel%3A05%7C03%7C02%7C53%7C07%7C08%7CMF%7C'
      };
      ctrl.applySavedFilter(null, multipleFilters);
      var results = matchElementsInTwoArraysByFilterName(chipsService.model, filterNames);
      expect(results.length).toEqual(filterNames.length);
    });

    it('Check if multi valued filters,boolean filters and text filters are added', function() {
      var filterNames = ['My Accounts Only', 'Grocery', 'Drug', 'Liquor', 'Recreation', 'Convenience', 'Mass Merchandiser', 'Military, off-premise', 'Other', 'DENVER', 'AK', 'AL', 'AZ'];
      var multipleFilters = {
        'name': 'testFilter',
        'filterString': 'myAccountsOnly%3Atrue%2CtradeChannel%3A05%7C03%7C02%7C53%7C07%7C08%7CMF%7C%2Ccity%3ADENVER%2Cstate%3AAK%7CAL%7CAZ'
      };
      ctrl.applySavedFilter(null, multipleFilters);
      var results = matchElementsInTwoArraysByFilterName(chipsService.model, filterNames);
      expect(results.length).toEqual(filterNames.length);
    });
  });

});
