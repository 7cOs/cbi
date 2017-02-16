describe('Unit: scorecardsController', function() {
  var scope, ctrl, $state, filtersService, userService;

  beforeEach(function() {
    // Get Mock Modules
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.modules.scorecards');

    inject(function($rootScope, $controller, _$state_, _filtersService_, _userService_) {
      // Create scope
      scope = $rootScope.$new();

      // Get Required Services
      $state = _$state_;
      filtersService = _filtersService_;
      userService = _userService_;

      // Create Controller
      ctrl = $controller('scorecardsController', {$scope: scope});
    });
  });

  describe('Init', function() {
    beforeEach(function () {
    });

    it('should expose public methods', function() {
      expect(ctrl.goToAccountDashboard).not.toBeUndefined();
    });
  });

  describe('[Method] checkValidity', function() {
    it('should check for validity', function() {
      var valid = ctrl.checkValidity(5, 2);
      expect(valid).toEqual('5.00');
    });

    it('should reject NaN', function() {
      var valid = ctrl.checkValidity('', 2);
      expect(valid).toEqual('-');
    });
  });

  describe('[Method] vsYAPercent', function() {
    it('should format the value', function() {
      var result = ctrl.vsYAPercent(34, 5, 7);
      expect(result).toEqual('7.0');
    });

    it('should reject null', function() {
      var result = ctrl.vsYAPercent(0, 0, null);
      expect(result).toEqual(0);
    });

    it('should reject null and ty greater than zero', function() {
      var result = ctrl.vsYAPercent(1, 0, null);
      expect(result).toEqual('100.0');
    });
  });

  describe('[Method] toggleSelected', function() {
    it('should set the list and index', function() {
      ctrl.toggleSelected(4, [0, 1]);
      expect(ctrl.selectedList).toEqual([0, 1]);
      expect(ctrl.selectedIndex).toEqual(4);
    });
  });

  describe('[Method] changePremise', function() {
    beforeEach(function() {
      spyOn(userService, 'getPerformanceDistribution').and.callFake(function() {
        return {
          then: function(callback) { return callback([0, 1, 2]); }
        };
      });
    });
    it('should update the distribution', function() {
      ctrl.changePremise();
      expect(userService.model.distribution).toEqual([0, 1, 2]);
    });

    it('should update the distribution with onPremise selected', function() {
      ctrl.distributionRadioOptions.selected.onOffPremise = 'on';
      ctrl.changePremise();
      // not sure if there is actually a way to test this difference. covers a few different lines of statement.
      expect(ctrl.distributionRadioOptions.selected.onOffPremise).toEqual('on');
      expect(userService.model.distribution).toEqual([0, 1, 2]);
    });
  });

  describe('[Method] isPositive', function() {
    it('should check for positivity', function() {
      var positiveCheck = ctrl.isPositive(5);
      expect(positiveCheck).toEqual(true);
    });
    it('should check for negativity', function() {
      var positiveCheck = ctrl.isPositive(-5);
      expect(positiveCheck).toEqual(false);
    });
  });

 describe('[Method] changeDepletionOption', function() {
   it('should update the distribution', function() {
     expect(ctrl.filtersService.lastEndingTimePeriod.depletionValue).toEqual({ name: 'FYTD', displayValue: 'FYTD', id: 6 });
     ctrl.changeDepletionOption('CYTD');
     expect(ctrl.filtersService.lastEndingTimePeriod.depletionValue).toEqual({ name: 'CYTD', displayValue: 'CYTD', id: 5 });
   });
 });

 describe('[Method] changeDepletionScorecard', function() {
   it('should update the depletion with false', function() {
     expect(ctrl.totalRow).toEqual(undefined);
     ctrl.changeDepletionScorecard(false);
     expect(ctrl.totalRow).toEqual({depletions: 0, depletionsLastYear: 0, depletionsBU: 0, depletionsBULastYear: 0, gap: 0, percentTrend: '', percentBUTrend: '', gapVsPlan: 0, percentGapVsPlan: 0, volumePercent: 100, volumeBU: 0, growthPercent: 100, growthBU: 0});
    });

    it('should update the depletion with true', function() {
     expect(ctrl.totalRow).toEqual(undefined);
     ctrl.depletionSelect = true;
     ctrl.depletionRadio = 0;
     ctrl.depletionSelectOptions = [[{name: 'test'}]];
     expect(ctrl.depletionSelect).toEqual(true);
     ctrl.changeDepletionScorecard(true);
     expect(ctrl.totalRow).toEqual({depletions: 0, depletionsLastYear: 0, depletionsBU: 0, depletionsBULastYear: 0, gap: 0, percentTrend: '', percentBUTrend: '', gapVsPlan: 0, percentGapVsPlan: 0, volumePercent: 100, volumeBU: 0, growthPercent: 100, growthBU: 0});
    });
  });

  describe('[Method] updateEndingTimePeriod', function() {
    beforeEach(function() {
      ctrl.filtersService.model.scorecardDistributionTimePeriod = {'year': [{'name': 'L90', 'displayValue': 'L90', 'id': 2, '$$hashKey': 'object:37'}], 'month': [{'name': 'L03', 'displayValue': 'L03', 'id': 4}]};
      ctrl.filtersService.model.depletionsTimePeriod = {month: [{'name': 'CMTH', 'displayValue': 'Clo Mth', 'id': 1}, { 'name': 'CYTM', 'displayValue': 'CYTM', 'id': 2 }, {'name': 'FYTM', 'displayValue': 'FYTM', 'id': 3}], year: [{'name': 'MTD', 'displayValue': 'MTD', 'id': 4, '$$hashKey': 'object:81 '}, {'name': 'CYTD', 'displayValue': 'CYTD', 'id': 5, '$$hashKey': 'object:82 '}, {'name': 'FYTD', 'displayValue': 'FYTD', 'id': 6}]};
    });
    it('should update the time period for year', function() {
      ctrl.filtersService.lastEndingTimePeriod.endingPeriodType = 'year';
      ctrl.updateEndingTimePeriod('year');

      expect(ctrl.distributionSelectOptions.selected).toEqual('L90');
      expect(ctrl.filtersService.model.depletionsTimePeriod['year'][2].name).toEqual('FYTD');
      expect(ctrl.filtersService.lastEndingTimePeriod.depletionValue).toEqual({name: 'FYTD', displayValue: 'FYTD', id: 6});
    });

      it('should update the time period for month', function() {
      ctrl.filtersService.lastEndingTimePeriod.endingPeriodType = 'month';
      ctrl.updateEndingTimePeriod('month');

      expect(ctrl.distributionSelectOptions.selected).toEqual('L03');
      expect(ctrl.filtersService.model.depletionsTimePeriod['month'][2].name).toEqual('FYTM');
      expect(ctrl.filtersService.lastEndingTimePeriod.timePeriodValue).toEqual({ name: 'L03', displayValue: 'L03', id: 4 });
    });
  });

  describe('[Method] changeDistributionTimePeriod', function() {
    it('should update the distribution time period', function() {
      ctrl.changeDistributionTimePeriod('L90');
      expect(ctrl.distributionSelectOptions.selected).toEqual('L90');
      expect(ctrl.filtersService.lastEndingTimePeriod.timePeriodValue).toEqual({ name: 'L90', displayValue: 'L90', id: 2 });
    });
  });
  describe('[Method] setDefaultFilterOptions', function() {
    it('should setup for off hier', function() {
      ctrl.userService.model.currentUser = {'personId': 5648, 'employeeID': '1012132', 'srcTypeCd': ['OFF_HIER']};
      ctrl.setDefaultFilterOptions();
      expect(ctrl.distributionRadioOptions.selected.onOffPremise).toEqual('off');
    });
    it('should setup for off hier', function() {
      ctrl.userService.model.currentUser = {'personId': 5648, 'employeeID': '1012132', 'srcTypeCd': ['ON_HIER']};
      ctrl.setDefaultFilterOptions();
      expect(ctrl.distributionRadioOptions.selected.onOffPremise).toEqual('on');
    });
  });

  describe('[Method] goToAccountDashboard', function() {
    var row = {};
    beforeEach(function() {
      row = {
        id: '226',
        name: 'Corona Extra',
        performance: []
      };
      ctrl.distributionRadioOptions.selected.onOffPremise = 'off';
      userService.model.currentUser.srcTypeCd = ['ON_HIER'];

      spyOn($state, 'go').and.callFake(function() {
        return true;
      });
    });

    it('should return false if disabled is true', function() {
      expect(ctrl.goToAccountDashboard(row, true)).toEqual(false);
    });

    it('should go to accounts with brand data when a brand is clicked (depletion)', function() {
      row.depletionTotal = 100000;

      expect($state.go.calls.count()).toEqual(0);

      ctrl.goToAccountDashboard(row, false);

      expect($state.go).toHaveBeenCalledWith('accounts', {
        resetFiltersOnLoad: false,
        applyFiltersOnLoad: true,
        pageData: {
          brandId: row.id,
          brandTitle: row.name,
          premiseType: 'all'
        }
      });
      expect($state.go.calls.count()).toEqual(1);

      expect(filtersService.model.selected.brand).toEqual([row.id]);
      expect(filtersService.model.selected.myAccountsOnly).toEqual(true);
      expect(filtersService.model.selected.opportunityType).toEqual(['All Types']);
      expect(filtersService.model.selected.retailer).toEqual('Chain');
    });

    it('should go to accounts with brand data when a brand is clicked (distribution)', function() {
      expect($state.go.calls.count()).toEqual(0);

      ctrl.goToAccountDashboard(row, false);

      expect($state.go).toHaveBeenCalledWith('accounts', {
        resetFiltersOnLoad: false,
        applyFiltersOnLoad: true,
        pageData: {
          brandId: row.id,
          brandTitle: row.name,
          premiseType: 'off'
        }
      });
      expect($state.go.calls.count()).toEqual(1);

      expect(filtersService.model.selected.brand).toEqual([row.id]);
      expect(filtersService.model.selected.myAccountsOnly).toEqual(true);
      expect(filtersService.model.selected.opportunityType).toEqual(['All Types']);
      expect(filtersService.model.selected.retailer).toEqual('Chain');
    });

    it('should go to accounts when brand total is clicked (distribution)', function() {
      expect($state.go.calls.count()).toEqual(0);

      ctrl.goToAccountDashboard(null, false);

      expect($state.go).toHaveBeenCalledWith('accounts', {
        resetFiltersOnLoad: false,
        applyFiltersOnLoad: true,
        pageData: {
          premiseType: 'off'
        }
      });
      expect($state.go.calls.count()).toEqual(1);

      expect(filtersService.model.selected.myAccountsOnly).toEqual(true);
    });
  });
});
