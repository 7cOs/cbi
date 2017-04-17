describe('Unit: hispanicMarketTypeFormat Filter', function() {
  var filter;

  beforeEach(function() {
    angular.mock.module('cf.common.filters');

    inject(function(_hispanicMarketTypeFormatFilter_) {
      filter = _hispanicMarketTypeFormatFilter_;
    });
  });

  it('should exist', function() {
    expect(filter).toBeDefined();
  });

  it('should format GM correctly', function() {
    expect(filter('GM')).toEqual('General Market');
  });

  it('shouldnt convert a string that doesnt match', function() {
    expect(filter('OTHER')).toEqual('OTHER');
  });

});
