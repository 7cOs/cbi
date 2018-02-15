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

  describe('[request]', function() {
    it('it should return base url if there is no query param', function() {
      const url = 'http://localhost:3000/';
      const resultExpectation = 'http://localhost:3000/';

      const result = APIHelper.request(url);

      expect(result).toEqual(resultExpectation);
    });

    it('it should return base url plus query params when a query param obj is passed in', function() {
      const mockObject = {
        'masterSKU': '112154',
        'premiseType': 'on'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?' + 'filter=masterSKU%3A112154%2CpremiseType%3Aon';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('it should return store specific formatting when type = store', function() {
      const mockObject = {
        'masterSKU': '112154',
        'premiseType': 'on',
        'type': 'store'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?' + 'filter=masterSKU%3A112154%2CpremiseType%3Aon%2C';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('it should return opportunities specific formatting when type = opportunities', function() {
      const mockObject = {
        'masterSKU': '112154',
        'premiseType': 'on',
        'type': 'opportunities'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&filter=masterSKU%3A112154%2CpremiseType%3Aon';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('it should return opportunities specific formatting when type = opportunities and simple distribution is selected', function() {
      const mockObject = {
        'opportunityType': ['At Risk'],
        'premiseType': 'on',
        'simpleDistributionType': true,
        'type': 'opportunities'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&brandOpportunityType=true&filter=opportunityType%3AAT_RISK%2CpremiseType%3Aon%2C';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('should return opportunities with brands when type is opportunities, simple distribution is selected and sku is selected', function() {
      const mockObject = {
        'myAccountsOnly': true,
        'masterSKU': ['80014006@228'],
        'opportunityType': ['At Risk'],
        'premiseType': 'on',
        'simpleDistributionType': true,
        'type': 'opportunities'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&brandOpportunityType=true&filter=myAccountsOnly%3Atrue%2CopportunityType%3AAT_RISK%2CpremiseType%3Aon%2Cbrand%3A228';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('should return opportunities with sku when type is opportunities, sku is selected', function() {
      const mockObject = {
        'myAccountsOnly': true,
        'masterSKU': '80014006@228',
        'premiseType': 'on',
        'type': 'opportunities'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&filter=myAccountsOnly%3Atrue%2CmasterSKU%3A80014006%40228%2CpremiseType%3Aon';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('it should return opportunities specific formatting when type = opportunities and unsold store is selected', function() {
      const mockObject = {
        type: 'opportunities',
        salesStatus: ['Unsold']
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&unsoldStore=true&filter=';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('it should return opportunities specific formatting when type = opportunities and sold store is selected', function() {
      const mockObject = {
        type: 'opportunities',
        salesStatus: ['Sold']
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&unsoldStore=false&filter=';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('it should return opportunities specific formatting when type = opportunities and both sold & unsold store is selected', function() {
      const mockObject = {
        type: 'opportunities',
        salesStatus: ['Unsold', 'Sold']
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&filter=';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('should return opportunities specific formatting when store format of hispanic is selected', function() {
      const mockObject = {
        opportunityType: ['At Risk'],
        premiseType: 'on',
        type: 'opportunities',
        storeFormat: 'HISPANIC'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&hispanicMarketType=HISPANIC&filter=opportunityType%3AAT_RISK%2CpremiseType%3Aon%2C';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('should return opportunities specific formatting when store format of general market is selected', function() {
      const mockObject = {
        masterSKU: ['112154@234'],
        opportunityType: ['At Risk'],
        premiseType: 'on',
        simpleDistributionType: true,
        type: 'opportunities',
        storeFormat: 'GM'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&brandOpportunityType=true&hispanicMarketType=GM&filter=opportunityType%3AAT_RISK%2CpremiseType%3Aon%2Cbrand%3A234';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('should return opportunities specific formatting when ALL feature types is selected', function() {
      const mockObject = {
        masterSKU: ['112154@234'],
        featureType: ['All Types', 'Happy Hour'],
        premiseType: 'on',
        simpleDistributionType: true,
        type: 'opportunities',
        storeFormat: 'GM'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&brandOpportunityType=true&hispanicMarketType=GM&filter=featureType%3AHH%2CpremiseType%3Aon%2Cbrand%3A234';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('should return opportunities specific formatting when some feature types is selected', function() {
      const mockObject = {
        masterSKU: ['112154@234'],
        featureType: ['Happy Hour', 'Beer of the Month'],
        premiseType: 'on',
        simpleDistributionType: true,
        type: 'opportunities',
        storeFormat: 'GM'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&brandOpportunityType=true&hispanicMarketType=GM&filter=featureType%3AHH%7CBE%2CpremiseType%3Aon%2Cbrand%3A234';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('should return opportunities specific formatting when ALL item authorization types is selected', function() {
      const mockObject = {
        masterSKU: ['112154@234'],
        itemAuthorizationType: ['All Types', 'Authorized-Select Planogram', 'Authorized-Optional (Sell-In)'],
        premiseType: 'on',
        simpleDistributionType: true,
        type: 'opportunities',
        storeFormat: 'GM'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&brandOpportunityType=true&hispanicMarketType=GM&filter=itemAuthorizationType%3ASP%7COS%2CpremiseType%3Aon%2Cbrand%3A234';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('should return opportunities specific formatting when item authorization types is selected', function() {
      const mockObject = {
        brand: '215',
        itemAuthorizationType: ['Authorized-Select Planogram', 'Authorized-Optional (Sell-In)'],
        premiseType: 'on',
        type: 'opportunities',
        storeFormat: 'GM'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&hispanicMarketType=GM&filter=brand%3A215%2CitemAuthorizationType%3ASP%7COS%2CpremiseType%3Aon%2C';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('should return opportunities specific formatting when priority package is selected', function() {
      const mockObject = {
        masterSKU: ['112154@234'],
        priorityPackage: ['Gaintain'],
        premiseType: 'on',
        simpleDistributionType: true,
        type: 'opportunities',
        storeFormat: 'GM'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?limit=20&sort=&offset=0&ignoreDismissed=true&brandOpportunityType=true&hispanicMarketType=GM&priorityPackageGroups=GAINTAIN&filter=premiseType%3Aon%2Cbrand%3A234';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('it should set archived=true for target lists', function() {
      const mockObject = {
        'type': 'targetLists'
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?' + 'archived=true';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('it should set query params for brandsnapshot', function() {
      const mockObject = {
        'type': 'brandSnapshot',
        'additionalParams': {type: 'brandSnapshot', myAccountsOnly: true, opportunityType: ['All Types'], premiseType: 'off', retailer: 'Chain', distributor: ['2225193']}
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?' + 'type=brandSnapshot&myAccountsOnly=true&opportunityType=All%20Types&premiseType=off&retailer=Chain&distributor=2225193&filter=';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('it should set additional params for topbottom', function() {
      const mockObject = {
        'type': 'topBottom',
        'additionalParams': {type: 'topBottom', myAccountsOnly: true, opportunityType: ['All Types'], premiseType: 'off', retailer: 'Chain', distributor: ['2225193']}
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?' + 'type=topBottom&myAccountsOnly=true&opportunityType=All%20Types&premiseType=off&retailer=Chain&distributor=2225193&filter=';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('should set query params for cbbd chain on opportunities', function() {
      const mockObject = {
        'type': 'opportunities',
        'additionalParams': ['cbbdChain']
      };
      const url = 'http://localhost:3000/';
      const resultExpectation = url + '?' + 'limit=20&sort=&offset=0&ignoreDismissed=true&filter=additionalParams%3AcbbdChain';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });

    it('should return a bulk query when requested', function() {
      APIHelper.model.bulkQuery = true;

      const mockObject = {
        type: 'opportunities',
        storeFormat: 'HISPANIC'
      };
      const url = 'http://localhost:3000/';

      const resultExpectation = url + '?limit=1000&ignoreDismissed=true&hispanicMarketType=HISPANIC&filter=';

      const result = APIHelper.request(url, mockObject);

      expect(result).toEqual(resultExpectation);
    });
  });

  describe('[formatQueryString]', function() {
    it('should construct for cbbdChain', function() {
      var opportunityData = JSON.parse('{"type":"opportunities","myAccountsOnly":true,"cbbdChain":["Cbbd"],"distributor":["2225538"],"opportunityType":["All Types"],"premiseType":"off","retailer":"Chain"}');
      const result = APIHelper.formatQueryString(opportunityData);
      expect(result).toEqual('?limit=20&sort=&offset=0&ignoreDismissed=true&filter=myAccountsOnly%3Atrue%2CcbbdChain%3Atrue%2Cdistributor%3A2225538%2CpremiseType%3Aoff%2C');
    });

    it('should construct for Independent', function() {
      var opportunityData = JSON.parse('{"type":"opportunities","myAccountsOnly":true,"cbbdChain":["Independent"],"distributor":["2225538"],"opportunityType":["All Types"],"premiseType":"off","retailer":"Chain"}');
      const result = APIHelper.formatQueryString(opportunityData);
      expect(result).toEqual('?limit=20&sort=&offset=0&ignoreDismissed=true&filter=myAccountsOnly%3Atrue%2CcbbdChain%3Afalse%2Cdistributor%3A2225538%2CpremiseType%3Aoff%2C');
    });

    it('should construct for OT custom', function() {
      var opportunityData = JSON.parse('{"type":"opportunities","myAccountsOnly":true,"distributor":["2225538"],"opportunityType":["Custom"],"premiseType":"off","retailer":"Chain"}');
      const result = APIHelper.formatQueryString(opportunityData);
      expect(result).toEqual('?limit=20&sort=&offset=0&ignoreDismissed=true&filter=myAccountsOnly%3Atrue%2Cdistributor%3A2225538%2CopportunityType%3AMANUAL%2CpremiseType%3Aoff%2C');
    });

    it('should construct for OT *other*', function() {
      var opportunityData = JSON.parse('{"type":"opportunities","myAccountsOnly":true,"distributor":["2225538"],"opportunityType":["Non-Buy"],"premiseType":"off","retailer":"Chain"}');
      const result = APIHelper.formatQueryString(opportunityData);
      expect(result).toEqual('?limit=20&sort=&offset=0&ignoreDismissed=true&filter=myAccountsOnly%3Atrue%2Cdistributor%3A2225538%2CopportunityType%3ANON_BUY%2CpremiseType%3Aoff%2C');
    });

    it('should construct for impact and opportunity status', function() {
      var opportunityData = JSON.parse('{"type":"opportunities","myAccountsOnly":true,"distributor":["2225538","2225538"],"impact":["High"],"opportunityStatus":["Open"],"opportunityType":["All Types"],"premiseType":"off","retailer":"Chain"}');
      const result = APIHelper.formatQueryString(opportunityData);
      expect(result).toEqual('?limit=20&sort=&offset=0&ignoreDismissed=true&filter=myAccountsOnly%3Atrue%2Cdistributor%3A2225538%7C2225538%2Cimpact%3AH%2CopportunityStatus%3Aopen%2CpremiseType%3Aoff%2C');
    });

    it('should construct for opportunity status closed and 2 trade channels', function() {
      var opportunityData = JSON.parse('{"type":"opportunities","myAccountsOnly":true,"distributor":["2225538"],"opportunityStatus":["closed"],"opportunityType":["All Types"],"premiseType":"off","retailer":"Chain","tradeChannel":["Grocery","Drug"]}');
      filtersService.model.selected = {premiseType: 'off'};
      const result = APIHelper.formatQueryString(opportunityData);
      expect(result).toEqual('?limit=20&sort=&offset=0&ignoreDismissed=true&filter=myAccountsOnly%3Atrue%2Cdistributor%3A2225538%2CopportunityStatus%3Atargeted%2CpremiseType%3Aoff%2CtradeChannel%3A05%7C03');
    });

    it('should construct for opportunity status closed and 3 priority packages', function() {
      var opportunityData = JSON.parse('{"type":"opportunities","myAccountsOnly":true,"distributor":["2225538"],"opportunityStatus":["closed"],"opportunityType":["All Types"],"premiseType":"off","retailer":"Chain","priorityPackage":["Gaintain","Impact","Additional CA"]}');
      const result = APIHelper.formatQueryString(opportunityData);
      expect(result).toEqual('?limit=20&sort=&offset=0&ignoreDismissed=true&priorityPackageGroups=GAINTAIN|IMPACT|ADDITIONAL_CA_PRIORITY_PACKS&filter=myAccountsOnly%3Atrue%2Cdistributor%3A2225538%2CopportunityStatus%3Atargeted%2CpremiseType%3Aoff%2C');
    });

    it('it should take an object and format it into a query string for consumption', function() {
      // set up
      const mockObject = {
        'masterSKU': '112154',
        'premiseType': 'on'
      };
      const resultExpectation = '?' + 'filter=masterSKU%3A112154%2CpremiseType%3Aon';
      // execute
      const result = APIHelper.formatQueryString(mockObject);

      // assert
      expect(result).toEqual(resultExpectation);
    });
  });
});
