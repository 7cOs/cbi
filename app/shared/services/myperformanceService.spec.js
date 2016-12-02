describe('[Services.myperformanceService]', function() {
  var myperformanceService, $filter, filtersService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.filters');

    inject(function(_myperformanceService_, _$filter_, _filtersService_) {
      myperformanceService = _myperformanceService_;
      $filter = _$filter_;
      filtersService = _filtersService_;
    });
  });

  fit('should exist', function() {
    expect(myperformanceService).toBeDefined();
    expect(filtersService).toBeDefined();
  });
});
