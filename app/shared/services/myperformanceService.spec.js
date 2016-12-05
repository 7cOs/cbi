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
});
