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
