describe('[Services.apiHelperService]', function() {
  var APIHelper;

  beforeEach(function() {
    angular.mock.module('andromeda.common.services');

    inject(function(apiHelperService) {
      APIHelper = apiHelperService;
    });
  });

  it('should exist', function() {
    expect(APIHelper).toBeDefined();
  });

  it('it\'s methods should exist', function() {
    expect(APIHelper.formatQueryString).toBeDefined();
    expect(APIHelper.request).toBeDefined();
  });

  it('[formatQueryString] it should take an object and format it into a query string for consumption', function() {
    // set up
    var mockObj = {
      'masterSKU': '112154',
      'premiseType': 'on'
    };
    var resultExpectation = '?' + encodeURIComponent('filter=masterSKU:112154,premiseType:on');

    // execute
    var result = APIHelper.formatQueryString(mockObj);

    // assert
    expect(result).toEqual(resultExpectation);
  });

  it('[request] it should return base url if there is no query param', function() {
    var url = 'http://localhost:3000/';
    var resultExpectation = 'http://localhost:3000/';

    var result = APIHelper.request(url);

    expect(result).toEqual(resultExpectation);
  });

  it('[request] it should return base url plus query params when a query param obj is passed in', function() {
    var mockObj = {
      'masterSKU': '112154',
      'premiseType': 'on'
    };
    var url = 'http://localhost:3000/';
    var resultExpectation = url + '?' + encodeURIComponent('filter=masterSKU:112154,premiseType:on');

    var result = APIHelper.request(url, mockObj);

    expect(result).toEqual(resultExpectation);
  });

});
