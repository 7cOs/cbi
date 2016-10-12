describe('Unit: zipcode Filter', function() {
  var filter;

  beforeEach(function() {
    angular.mock.module('cf.common.filters');

    inject(function(_zipcodeFilter_) {
      filter = _zipcodeFilter_;
    });
  });

  it('should exist', function() {
    expect(filter).toBeDefined();
  });

  it('should return and empty string is passed an empty string', function() {
    expect(filter('')).toEqual('');
  });

  it('should return a five digit zipcode if passed a five didgit code', function() {
    expect(filter('12345')).toEqual('12345');
  });

  it('should return a dashed zipcode with XXXXX-XXXX format', function() {
    expect(filter('123456789')).toEqual('12345-6789');
  });
});
