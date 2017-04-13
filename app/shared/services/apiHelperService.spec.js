describe('[Services.apiHelperService]', function() {
  var APIHelper, filtersService;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

    inject(function(apiHelperService, _filtersService_) {
      filtersService = _filtersService_;
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
    var resultExpectation = url + '?limit=20&ignoreDismissed=true&sort=&offset=0&filter=masterSKU%3A112154%2CpremiseType%3Aon';

    var result = APIHelper.request(url, mockObj);

    expect(result).toEqual(resultExpectation);
  });

  it('[request] it should return opportunities specific formatting when type = opportunities and simple distribution is selected', function() {
    var mockObj = {
      'masterSKU': '112154',
      'opportunityType': ['At Risk'],
      'premiseType': 'on',
      'simpleDistributionType': true,
      'type': 'opportunities'
    };
    var url = 'http://localhost:3000/';
    var resultExpectation = url + '?limit=20&ignoreDismissed=true&sort=&offset=0&brandOpportunityType=true&filter=masterSKU%3A112154%2CopportunityType%3AAT_RISK%2CpremiseType%3Aon%2C';

    var result = APIHelper.request(url, mockObj);

    expect(result).toEqual(resultExpectation);
  });

  it('[request] it should return opportunities specific formatting when type = opportunities and unsoldstore is selected', function() {
    var mockObj = {
      'masterSKU': '112154',
      'storeStatus': ['UnSold'],
      'premiseType': 'on',
      'type': 'opportunities'
    };
    var url = 'http://localhost:3000/';
    var resultExpectation = url + '?limit=20&ignoreDismissed=true&sort=&offset=0&unsold=true&filter=masterSKU%3A112154%2CopportunityType%3AAT_RISK%2CpremiseType%3Aon%2C';

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
    var resultExpectation = url + '?' + 'limit=20&ignoreDismissed=true&sort=&offset=0&filter=additionalParams%3AcbbdChain';

    var result = APIHelper.request(url, mockObj);

    expect(result).toEqual(resultExpectation);
  });

  describe('[parseAppliedFilters]', function() {
    beforeEach(function() {
    });

    it('should construct for cbbdChain', function() {
      var opportunityData = JSON.parse('{"type":"opportunities","myAccountsOnly":true,"cbbdChain":["Cbbd"],"distributor":["2225538"],"opportunityType":["All Types"],"premiseType":"off","retailer":"Chain"}');
      var result = APIHelper.formatQueryString(opportunityData);
      expect(result).toEqual('?limit=20&ignoreDismissed=true&sort=&offset=0&filter=myAccountsOnly%3Atrue%2CcbbdChain%3Atrue%2Cdistributor%3A2225538%2CpremiseType%3Aoff%2C');
    });

    it('should construct for Independent', function() {
      var opportunityData = JSON.parse('{"type":"opportunities","myAccountsOnly":true,"cbbdChain":["Independent"],"distributor":["2225538"],"opportunityType":["All Types"],"premiseType":"off","retailer":"Chain"}');
      var result = APIHelper.formatQueryString(opportunityData);
      expect(result).toEqual('?limit=20&ignoreDismissed=true&sort=&offset=0&filter=myAccountsOnly%3Atrue%2CcbbdChain%3Afalse%2Cdistributor%3A2225538%2CpremiseType%3Aoff%2C');
    });
    it('should construct for OT custom', function() {
      var opportunityData = JSON.parse('{"type":"opportunities","myAccountsOnly":true,"distributor":["2225538"],"opportunityType":["Custom"],"premiseType":"off","retailer":"Chain"}');
      var result = APIHelper.formatQueryString(opportunityData);
      expect(result).toEqual('?limit=20&ignoreDismissed=true&sort=&offset=0&filter=myAccountsOnly%3Atrue%2Cdistributor%3A2225538%2CopportunityType%3AMANUAL%2CpremiseType%3Aoff%2C');
    });
    it('should construct for OT *other*', function() {
      var opportunityData = JSON.parse('{"type":"opportunities","myAccountsOnly":true,"distributor":["2225538"],"opportunityType":["Non-Buy"],"premiseType":"off","retailer":"Chain"}');
      var result = APIHelper.formatQueryString(opportunityData);
      expect(result).toEqual('?limit=20&ignoreDismissed=true&sort=&offset=0&filter=myAccountsOnly%3Atrue%2Cdistributor%3A2225538%2CopportunityType%3ANON_BUY%2CpremiseType%3Aoff%2C');
    });
    it('should construct for impact and opportunity status', function() {
      var opportunityData = JSON.parse('{"type":"opportunities","myAccountsOnly":true,"distributor":["2225538","2225538"],"impact":["High"],"opportunityStatus":["Open"],"opportunityType":["All Types"],"premiseType":"off","retailer":"Chain"}');
      var result = APIHelper.formatQueryString(opportunityData);
      expect(result).toEqual('?limit=20&ignoreDismissed=true&sort=&offset=0&filter=myAccountsOnly%3Atrue%2Cdistributor%3A2225538%7C2225538%2Cimpact%3AH%2CopportunityStatus%3Aopen%2CpremiseType%3Aoff%2C');
    });
    it('should construct for opportunity status closed and 2 trade channels', function() {
      var opportunityData = JSON.parse('{"type":"opportunities","myAccountsOnly":true,"distributor":["2225538"],"opportunityStatus":["closed"],"opportunityType":["All Types"],"premiseType":"off","retailer":"Chain","tradeChannel":["Grocery","Drug"]}');
      filtersService.model.selected = {premiseType: 'off'};
      var result = APIHelper.formatQueryString(opportunityData);
      expect(result).toEqual('?limit=20&ignoreDismissed=true&sort=&offset=0&filter=myAccountsOnly%3Atrue%2Cdistributor%3A2225538%2CopportunityStatus%3Atargeted%2CpremiseType%3Aoff%2CtradeChannel%3A05%7C03');
    });
  });
});
