describe('[Services.apiHelperService]', function() {
  var APIHelper;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

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
    var resultExpectation = '?' + 'filter=masterSKU%3A112154%2CpremiseType%3Aon';
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
    var resultExpectation = url + '?' + 'filter=masterSKU%3A112154%2CpremiseType%3Aon';

    var result = APIHelper.request(url, mockObj);

    expect(result).toEqual(resultExpectation);
  });

  it('[request] it should return store specific formatting when type = store', function() {
    var mockObj = {
      'masterSKU': '112154',
      'premiseType': 'on',
      'type': 'store'
    };
    var url = 'http://localhost:3000/';
    var resultExpectation = url + '?' + 'filter=masterSKU%3A112154%2CpremiseType%3Aon%2C';

    var result = APIHelper.request(url, mockObj);

    expect(result).toEqual(resultExpectation);
  });

  it('[request] it should return opportunities specific formatting when type = opportunities', function() {
    var mockObj = {
      'masterSKU': '112154',
      'premiseType': 'on',
      'type': 'opportunities'
    };
    var url = 'http://localhost:3000/';
    var resultExpectation = url + '?limit=10&ignoreDismissed=true&sort=&offset=0&filter=masterSKU%3A112154%2CpremiseType%3Aon';

    var result = APIHelper.request(url, mockObj);

    expect(result).toEqual(resultExpectation);
  });

  it('[request] it should set archived=true for target lists', function() {
    var mockObj = {
      'type': 'targetLists'
    };
    var url = 'http://localhost:3000/';
    var resultExpectation = url + '?' + 'archived=true';

    var result = APIHelper.request(url, mockObj);

    expect(result).toEqual(resultExpectation);
  });
  it('[request] it should set query params for brandsnapshot', function() {
    var mockObj = {
      'type': 'brandSnapshot',
      'additionalParams': {type: 'brandSnapshot', myAccountsOnly: true, opportunityType: ['All Types'], premiseType: 'off', retailer: 'Chain', distributor: ['2225193']}
    };
    var url = 'http://localhost:3000/';
    var resultExpectation = url + '?' + 'type=brandSnapshot&myAccountsOnly=true&opportunityType=All%20Types&premiseType=off&retailer=Chain&distributor=2225193&filter=';

    var result = APIHelper.request(url, mockObj);

    expect(result).toEqual(resultExpectation);
  });
  it('[request] it should set additional params for topbottom', function() {
    var mockObj = {
      'type': 'topBottom',
      'additionalParams': {type: 'topBottom', myAccountsOnly: true, opportunityType: ['All Types'], premiseType: 'off', retailer: 'Chain', distributor: ['2225193']}
    };
    var url = 'http://localhost:3000/';
    var resultExpectation = url + '?' + 'type=topBottom&myAccountsOnly=true&opportunityType=All%20Types&premiseType=off&retailer=Chain&distributor=2225193&filter=';

    var result = APIHelper.request(url, mockObj);

    expect(result).toEqual(resultExpectation);
  });

  it('[request] should set query params for cbbd chain on opportunities', function() {
    var mockObj = {
      'type': 'opportunities',
      'additionalParams': ['cbbdChain']
    };
    var url = 'http://localhost:3000/';
    var resultExpectation = url + '?' + 'limit=10&ignoreDismissed=true&sort=&offset=0&filter=additionalParams%3AcbbdChain';

    var result = APIHelper.request(url, mockObj);

    expect(result).toEqual(resultExpectation);
  });

});
