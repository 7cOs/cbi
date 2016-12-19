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
});
