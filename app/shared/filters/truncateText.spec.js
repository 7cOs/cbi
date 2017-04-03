describe('Unit: truncateText Filter', function() {
  var filter;
  var longSampleText  = 'Cash Rules Everything Around Me';
  var shortSampleText = 'Cash Rules';
  var filterLength    = 10;

  beforeEach(function() {
    angular.mock.module('cf.common.filters');

    inject(function(_truncateTextFilter_) {
      filter = _truncateTextFilter_;
    });
  });

  it('should exist', function() {
    expect(filter).toBeDefined();
  });

  it('should truncate text longer than the specified length', function() {
    expect(filter(longSampleText, filterLength)).toEqual('Cash Ru...');
  });

  it('should return the full text if less than specified limit', function() {
    expect(filter(shortSampleText, filterLength)).toEqual('Cash Rules');
  });

  it('should return an empty string if nothing is passed in', function() {
    expect(filter('')).toEqual('');
  });

});
