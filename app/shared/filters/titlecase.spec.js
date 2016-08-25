describe('Unit: titlecase Filter', function() {
  var filter;

  beforeEach(function() {
    angular.mock.module('cf.common.filters');

    inject(function(_titlecaseFilter_) {
      filter = _titlecaseFilter_;
    });
  });

  it('should exist', function() {
    expect(filter).toBeDefined();
  });

  it('should all uppercase or all lowercase strings to title case', function() {
    expect(filter('MOON PIE')).toEqual('Moon Pie');
    expect(filter('moon pie')).toEqual('Moon Pie');
  });

  it('should convert strings of any amounts of words to title case', function() {
    expect(filter('moon')).toEqual('Moon');
    expect(filter('moon pies')).toEqual('Moon Pies');
    expect(filter('moon pies are')).toEqual('Moon Pies Are');
    expect(filter('moon pies are good')).toEqual('Moon Pies Are Good');
  });

  it('shouldnt error out when a number or character is passed in', function() {
    expect(filter('moon 4 pies')).toEqual('Moon 4 Pies');
    expect(filter('moon ;. pies')).toEqual('Moon ;. Pies');
  });

  it('should return an empty string if nothing is passed in', function() {
    expect(filter('')).toEqual('');
  });

});
