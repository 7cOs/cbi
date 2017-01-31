describe('[Services.myperformanceService]', function() {
  var myperformanceService, filtersService;
  // , $filter

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.filters');

    // _$filter_,
    inject(function(_myperformanceService_, _filtersService_) {
      myperformanceService = _myperformanceService_;
      // $filter = _$filter_;
      filtersService = _filtersService_;
    });
  });

  it('should exist', function() {
    expect(myperformanceService).toBeDefined();
    expect(filtersService).toBeDefined();
  });

  it('should check if valid number', function() {
    var isValid = myperformanceService.isValidValues('-');
    expect(isValid).toEqual(false);

    isValid = myperformanceService.isValidValues('12368');
    expect(isValid).toEqual(false);

    var num = 12368;
    isValid = myperformanceService.isValidValues(num);
    expect(isValid).toEqual(true);

    num = null;
    isValid = myperformanceService.isValidValues(num);
    expect(isValid).toEqual(false);

    var undefinedVal;
    isValid = myperformanceService.isValidValues(undefinedVal);
    expect(isValid).toEqual(false);
  });

  it('dashboard init values distributor', function() {
    var filterToApply = {id: ['2225231'], name: 'CHICAGO BEV SYSTEMS - IL', noteId: 'a2Xm0000000I7diEAC', type: 'DISTRIBUTOR'};
    var currentTopBottomFilters = {distributors: {address: '', city: undefined}, id: ['2225231'], name: 'CHICAGO BEV SYSTEMS - IL', state: undefined, type: 'distributors', zipCode: undefined, accounts: '', subAccounts: '', stores: ''};
    var levelToNavigate = myperformanceService.setAcctDashboardFiltersOnInit(filterToApply, currentTopBottomFilters);
    expect(levelToNavigate.name).toEqual('Distributors');
    expect(levelToNavigate.value).toEqual(1);
  });

    it('dashboard init values store', function() {
    var filterToApply = {id: ['5024219'], name: 'BERNIES', noteId: 'a2Xm0000000I7N3EAK', type: 'STORE'};
    var currentTopBottomFilters = {stores: {address: '', city: undefined}, id: ['5024219'], name: 'BERNIES', state: undefined, type: 'stores', zipCode: undefined, accounts: '', subAccounts: '', distributors: ''};
    var levelToNavigate = myperformanceService.setAcctDashboardFiltersOnInit(filterToApply, currentTopBottomFilters);
    expect(levelToNavigate.name).toEqual('Stores');
    expect(levelToNavigate.value).toEqual(4);
  });
});
