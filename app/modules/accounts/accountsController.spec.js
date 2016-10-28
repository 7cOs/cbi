describe('Unit: accountsController', function() {
  var scope, ctrl, $state, $q, chipsService, filtersService, userService;
  // function accountsController($rootScope, $scope, $state, $log, $q, $window, $filter, chipsService, filtersService, userService) {

  beforeEach(function() {
    // Get Mock Modules
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.modules.accounts');

    inject(function($rootScope, $controller, _$state_, _$q_, _chipsService_, _filtersService_, _userService_) {
      // Create scope
      scope = $rootScope.$new();

      // Get Required Services
      $state = _$state_;
      $q = _$q_;
      chipsService = _chipsService_;
      filtersService = _filtersService_;
      userService = _userService_;

      // Create Controller
      ctrl = $controller('accountsController', {$scope: scope});
    });
  });

  describe('On Init', function() {
    it('Should expose the needed services', function() {
      expect(ctrl.chipsService).not.toBeUndefined();
      expect(typeof (ctrl.chipsService)).toEqual('object');
      expect(ctrl.filtersService).not.toBeUndefined();
      expect(typeof (ctrl.filtersService)).toEqual('object');
      expect(ctrl.userService).not.toBeUndefined();
      expect(typeof (ctrl.userService)).toEqual('object');
    });

    it('Should create a filterModel', function() {
      expect(ctrl.filterModel).toEqual({
        trend: filtersService.model.trend[0].name,
        endingTimePeriod: filtersService.model.timePeriod[0].name,
        depletionsTimePeriod: filtersService.model.depletionsTimePeriod.month[0].name,
        distributionTimePeriod: filtersService.model.distributionTimePeriod[0].name,
        myAccountsOnly: true,
        premiseType: filtersService.model.premises[1].value,
        distributor: '',
        storeTypeCBBD: false,
        storeTypeIndependent: false,
        retailer: '',
        retailType: '',
        brand: ''
      });
    });

    it('Should set default tab info', function() {
      expect(ctrl.selected).toEqual(null);
      expect(ctrl.previous).toEqual(null);
      expect(ctrl.brandSelectedIndex).toEqual(0);
      expect(ctrl.marketSelectedIndex).toEqual(0);
    });

    it('Should set default controller variables', function() {
      expect(ctrl.accountTypesDefault).toEqual('Distributors');
      expect(ctrl.brandWidgetTitleDefault).toEqual('All Brands');
      expect(ctrl.brandWidgetTitle).toEqual(ctrl.brandWidgetTitleDefault);
      expect(ctrl.filtersService.model.accountSelected.accountBrands).toEqual('Distribution (simple)');
      expect(ctrl.filtersService.model.accountSelected.accountMarkets).toEqual('Depletions');
      expect(ctrl.selectOpen).toEqual(false);
      expect(ctrl.disableAnimation).toEqual(false);
      expect(ctrl.marketStoresView).toEqual(false);
      expect(ctrl.marketIdSelected).toEqual(false);
      expect(ctrl.selectedStore).toEqual(null);
      expect(ctrl.hintTextPlaceholder).toEqual('Account or Subaccount Name');
      expect(ctrl.overviewOpen).toEqual(false);
      expect(ctrl.idSelected).toEqual(null);
      expect(ctrl.brandIdSelected).toEqual(null);
      expect(ctrl.loadingBrandSnapshot).toEqual(true);
    });

    it('Should expose controller methods', function() {
      expect(ctrl.brandTotal).not.toBeUndefined();
      expect(typeof (ctrl.brandTotal)).toEqual('function');

      expect(ctrl.displayBrandValue).not.toBeUndefined();
      expect(typeof (ctrl.displayBrandValue)).toEqual('function');

      expect(ctrl.goToOpportunities).not.toBeUndefined();
      expect(typeof (ctrl.goToOpportunities)).toEqual('function');

      expect(ctrl.isPositive).not.toBeUndefined();
      expect(typeof (ctrl.isPositive)).toEqual('function');

      expect(ctrl.openSelect).not.toBeUndefined();
      expect(typeof (ctrl.openSelect)).toEqual('function');

      expect(ctrl.setMarketTab).not.toBeUndefined();
      expect(typeof (ctrl.setMarketTab)).toEqual('function');

      expect(ctrl.selectItem).not.toBeUndefined();
      expect(typeof (ctrl.selectItem)).toEqual('function');

      expect(ctrl.prevTab).not.toBeUndefined();
      expect(typeof (ctrl.prevTab)).toEqual('function');

      expect(ctrl.openNotes).not.toBeUndefined();
      expect(typeof (ctrl.openNotes)).toEqual('function');

      expect(ctrl.placeholderSelect).not.toBeUndefined();
      expect(typeof (ctrl.placeholderSelect)).toEqual('function');

      expect(ctrl.resetFilters).not.toBeUndefined();
      expect(typeof (ctrl.resetFilters)).toEqual('function');

      expect(ctrl.updateBrandSnapshot).not.toBeUndefined();
      expect(typeof (ctrl.updateBrandSnapshot)).toEqual('function');

      expect(ctrl.updateTopBottom).not.toBeUndefined();
      expect(typeof (ctrl.updateTopBottom)).toEqual('function');
    });
  });

  describe('[Method] brandTotal', function() {
    beforeEach(function() {
      ctrl.brandTabs = [];
    });

    it('Should get totals for depletions', function() {});

    it('Should get totals for distributions', function() {});

    it('Should get totals for velocity', function() {});
  });

  describe('[Method] goToOpportunities', function() {
    beforeEach(function() {
      spyOn(filtersService, 'resetFilters').and.callThrough();
      spyOn($state, 'go').and.callFake(function() {
        return true;
      });
    });

    it('Should reset filters service selected model', function() {
      ctrl.filterModel.distributor = '111111';
      ctrl.filterModel.myAccountsOnly = false;
      ctrl.filterModel.storeTypeIndependent = true;

      ctrl.goToOpportunities();

      expect(filtersService.model.selected.distributor).toEqual(['111111']);
      expect(filtersService.model.selected.myAccountsOnly).toEqual(false);
      expect(filtersService.model.selected.cbbdChain).toEqual(['Independent']);

      expect(filtersService.model.selected.brand).toEqual([]);
      expect(filtersService.model.selected.premiseType).toEqual('off');
    });

    it('Should update filters service model selected after reset', function() {});

    it('Should go to opportunities page with params', function() {
      expect($state.go).not.toHaveBeenCalled();
      expect($state.go.calls.count()).toEqual(0);

      ctrl.goToOpportunities();

      expect($state.go).toHaveBeenCalledWith('opportunities', {
        resetFiltersOnLoad: false,
        getDataOnLoad: true
      });
      expect($state.go.calls.count()).toEqual(1);
    });
  });
});
