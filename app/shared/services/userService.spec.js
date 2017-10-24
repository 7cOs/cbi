describe('[Services.userService - performance]', function() {
  let $httpBackend, userService, depletionPerformanceData, distributionPerformanceData, mockDistributionData, params;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

    inject(function(_$http_, _$httpBackend_, _userService_) {
      $httpBackend = _$httpBackend_;
      userService = _userService_;
    });

    depletionPerformanceData = {
      performance: [{
        measures: [{
          depletions: 300,
          depletionsBU: 50,
          depletionsBULastYear: 132439.3203,
          depletionsBUTrend: -10,
          depletionsGap: -0,
          depletionsLastYear: 50826.4906,
          depletionsTrend: -100,
          plan: 100,
          timeframe: 'MTD',
          vsPlan: 0,
          vsPlanPercent: NaN
        }, {
          depletions: 200,
          depletionsBU: 25,
          depletionsBULastYear: 12,
          depletionsBUTrend: -10,
          depletionsGap: -10,
          depletionsLastYear: 50,
          depletionsTrend: -1,
          plan: 622,
          timeframe: 'MTD',
          vsPlan: 0,
          vsPlanPercent: NaN
        }]
      }]
    };

    distributionPerformanceData = {
      performance: [{
        measures: [{
          planSimple: 60,
          planEffective: 100,
          distributionsSimple: 90,
          planDistirbutionSimpleTrend: 0,
          planDistirbutionEffectiveTrend: 0,
          distributionsEffective: 120
        }, {
          planSimple: 0,
          planEffective: 0,
          distributionsSimple: 90,
          planDistirbutionSimpleTrend: 0,
          planDistirbutionEffectiveTrend: 0,
          distributionsEffective: 120
        }]
      }]
    };

    mockDistributionData = {
      performance: [{
        id: '123456',
        name: 'Walgreens',
        premiseType: 'OFF PREMISE',
        measures: {
          performance: [{ measures: [distributionPerformanceData.performance[0].measures[0]] }]
        }
      }, {
        id: '999999',
        name: 'INDEPENDENT',
        premiseType: 'OFF PREMISE',
        measures: {
          performance: [{ measures: [distributionPerformanceData.performance[0].measures[0]] }]
        }
      }, {
        id: '999999',
        name: 'INDEPENDENT',
        premiseType: 'ON PREMISE',
        measures: {
          performance: [{ measures: [distributionPerformanceData.performance[0].measures[0]] }]
        }
      }, {
        id: '999999',
        name: 'INDEPENDENT',
        premiseType: 'NON RETAIL',
        measures: {
          performance: [{ measures: [distributionPerformanceData.performance[0].measures[0]] }]
        }
      }, {
        id: 'ALL OTHER',
        name: 'ALL OTHER',
        premiseType: 'OFF PREMISE',
        measures: {
          performance: [{ measures: [distributionPerformanceData.performance[0].measures[0]] }]
        }
      }, {
        id: 'ALL OTHER',
        name: 'ALL OTHER',
        premiseType: 'ON PREMISE',
        measures: {
          performance: [{ measures: [distributionPerformanceData.performance[0].measures[0]] }]
        }
      }, {
        id: 'ALL OTHER',
        name: 'ALL OTHER',
        premiseType: 'NON RETAIL',
        measures: {
          performance: [{ measures: [distributionPerformanceData.performance[0].measures[0]] }]
        }
      }]
    };

    params = {
      myAccountsOnly: true,
      premiseType: 'all',
      retailer: 'Chain'
    };
  });

  it('should be defined', function() {
    expect(userService).toBeDefined();
  });

  it('should return valid values', function() {
    let returnValue = userService.isValidValues(1);
    expect(returnValue).toEqual(true);

    returnValue = userService.isValidValues(NaN);
    expect(returnValue).toEqual(false);

    returnValue = userService.isValidValues('not a number');
    expect(returnValue).toEqual(false);

    returnValue = userService.isValidValues(null);
    expect(returnValue).toEqual(false);
  });

  it('should get performance depletion', function() {
        $httpBackend
        .expect('GET', '/v2/users/undefined/performance/depletionScorecard/')
        .respond(200, depletionPerformanceData);

      var returnedPromise = userService.getPerformanceDepletion();
      $httpBackend.flush();

      expect(returnedPromise.$$state.value[0].measures[0]).toEqual({
                    depletions: 300,
                    depletionsBU: 50,
                    depletionsBULastYear: 132439.3203,
                    depletionsBUTrend: -10,
                    depletionsGap: -300,
                    depletionsLastYear: 50826.4906,
                    depletionsTrend: -100,
                    plan: 100,
                    timeframe: 'MTD',
                    vsPlan: -200,
                    vsPlanPercent: -200
      });
      expect(returnedPromise.$$state.value[0].measures[1]).toEqual({
                    depletions: 200,
                    depletionsBU: 25,
                    depletionsBULastYear: 12,
                    depletionsBUTrend: -10,
                    depletionsGap: -2,
                    depletionsLastYear: 50,
                    depletionsTrend: -1,
                    plan: 622,
                    timeframe: 'MTD',
                    vsPlan: 422,
                    vsPlanPercent: 67.84565916398714
      });
      expect(returnedPromise.$$state.value[0].depletionTotal).toEqual(500);
      expect(returnedPromise.$$state.value[0].depletionBUTotal).toEqual(75);

      $httpBackend
      .expect('GET', '/v2/users/undefined/performance/depletionScorecard/')
      .respond(400);

      returnedPromise = userService.getPerformanceDepletion();
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(2);

      // test the branch where the HTTP call is not made
      depletionPerformanceData.performance[0].measures[0].depletions = 150;
      userService.model.depletion = depletionPerformanceData.performance;
      returnedPromise = userService.getPerformanceDepletion();
      expect(returnedPromise.$$state.value[0].measures[0]).toEqual({
          depletions: 150,
          depletionsBU: 50,
          depletionsBULastYear: 132439.3203,
          depletionsBUTrend: -10,
          depletionsGap: -0,
          depletionsLastYear: 50826.4906,
          depletionsTrend: -100,
          plan: 100,
          timeframe: 'MTD',
          vsPlan: 0,
          vsPlanPercent: NaN
      });
  });

  it('should update INDEPENDENT/ALL OTHER account/subaccount name with premise type', () => {
    const mockParams = {
      myAccountsOnly: true,
      premiseType: 'all',
      retailer: 'Chain',
      distributor: ['111111']
    };
    const mockType = {
      value: 2
    };

    $httpBackend
    .expect('GET', '/v2/users/undefined/performance/topBottomSnapshot/accounts?filter=myAccountsOnly%3Atrue%2Cdistributor%3A111111')
    .respond(200, mockDistributionData);

    const returnedMockData = userService.getTopBottomSnapshot(mockType, mockParams);
    $httpBackend.flush();
    const returnedAccounts = returnedMockData.$$state.value.performance;

    expect(returnedAccounts[0].name).toEqual('Walgreens');
    expect(returnedAccounts[1].name).toEqual('INDEPENDENT (OFF)');
    expect(returnedAccounts[2].name).toEqual('INDEPENDENT (ON)');
    expect(returnedAccounts[3].name).toEqual('INDEPENDENT (NON-RETAIL)');
    expect(returnedAccounts[4].name).toEqual('UNMANAGED CHAIN (OFF)');
    expect(returnedAccounts[5].name).toEqual('UNMANAGED CHAIN (ON)');
    expect(returnedAccounts[6].name).toEqual('UNMANAGED CHAIN (NON-RETAIL)');
  });

  it('get top bottom snapshot distribution', () => {
    const defaultParams = {
      myAccountsOnly: true,
      premiseType: 'all',
      retailer: 'Chain'
    };
    let params = {
      myAccountsOnly: true,
      premiseType: 'all',
      retailer: 'Chain'
    };
    const type = {
      value: 1
    };
    const defaultUrlBase = '/v2/users/undefined/performance/topBottomSnapshot/';
    const defaultUrlQuery = 'distributors?filter=myAccountsOnly%3Atrue%2C';
    let urlBase = defaultUrlBase;
    let urlQuery = defaultUrlQuery;

    $httpBackend
    .expect('GET', urlBase + urlQuery)
    .respond(200, distributionPerformanceData);

    let returnPromise = userService.getTopBottomSnapshot(type, params);
    $httpBackend.flush();

    expect(returnPromise.$$state.value.performance[0].measures[0]).toEqual({
      planSimple: 60,
      planEffective: 100,
      distributionsSimple: 90,
      planDistirbutionSimpleTrend: 50,
      planDistirbutionEffectiveTrend: -10,
      distributionsEffective: 120
    });

    expect(returnPromise.$$state.value.performance[0].measures[1]).toEqual({
      planSimple: 0,
      planEffective: 0,
      distributionsSimple: 90,
      planDistirbutionSimpleTrend: 0,
      planDistirbutionEffectiveTrend: 0,
      distributionsEffective: 120
    });

    type.value = 2;
    params['distributor'] = ['111111'];
    urlQuery = 'accounts?filter=myAccountsOnly%3Atrue%2Cdistributor%3A111111';

    $httpBackend
    .expect('GET', urlBase + urlQuery)
    .respond(200, distributionPerformanceData);

    returnPromise = userService.getTopBottomSnapshot(type, params);
    $httpBackend.flush();
    type.value = 3;
    params['account'] = ['222222'];
    urlQuery = 'subaccounts?filter=myAccountsOnly%3Atrue%2Cdistributor%3A111111%2Caccount%3A222222';

    $httpBackend
    .expect('GET', urlBase + urlQuery)
    .respond(200, distributionPerformanceData);

    returnPromise = userService.getTopBottomSnapshot(type, params);
    $httpBackend.flush();
    type.value = 4;
    params['subaccount'] = ['333333'];
    urlQuery = 'stores?filter=myAccountsOnly%3Atrue%2Cdistributor%3A111111%2Caccount%3A222222%2Csubaccount%3A333333';

    $httpBackend
    .expect('GET', urlBase + urlQuery)
    .respond(200, distributionPerformanceData);

    returnPromise = userService.getTopBottomSnapshot(type, params);
    $httpBackend.flush();
    type.value = 2;
    urlQuery = 'accounts?filter=myAccountsOnly%3Atrue%2Cdistributor%3A111111';
    params = defaultParams;
    params['distributor'] = ['111111'];

    $httpBackend
    .expect('GET', urlBase + urlQuery)
    .respond(400);

    returnPromise = userService.getTopBottomSnapshot(type, params);
    $httpBackend.flush();

    expect(returnPromise.$$state.status).toEqual(2);
  });

  it('get top bottom depletion', function() {

      var type = {
          value: 1
      };

      depletionPerformanceData.performance[0].measures[0].plan = 0;

       $httpBackend
        .expect('GET', '/v2/users/undefined/performance/topBottomSnapshot/distributors?filter=myAccountsOnly%3Atrue%2C')
        .respond(200, depletionPerformanceData);
      var returnPromise = userService.getTopBottomSnapshot(type, params);
      $httpBackend.flush();

      expect(returnPromise.$$state.value.performance[0].measures[0]).toEqual({
          depletions: 300,
          depletionsBU: 50,
          depletionsBULastYear: 132439.3203,
          depletionsBUTrend: -10,
          depletionsGap: -0,
          depletionsLastYear: 50826.4906,
          depletionsTrend: -100,
          plan: 0,
          timeframe: 'MTD',
          vsPlan: 0,
          vsPlanPercent: NaN,
          planDepletionTrend: '-'
      });
      expect(returnPromise.$$state.value.performance[0].measures[1]).toEqual({
          depletions: 200,
          depletionsBU: 25,
          depletionsBULastYear: 12,
          depletionsBUTrend: -10,
          depletionsGap: -10,
          depletionsLastYear: 50,
          depletionsTrend: -1,
          plan: 622,
          timeframe: 'MTD',
          vsPlan: 0,
          vsPlanPercent: NaN,
          planDepletionTrend: -67.84565916398714
      });
    });

    it('get performance brand', function() {
        $httpBackend
        .expect('GET', '/v2/users/undefined/performance/brandSnapshot?filter=myAccountsOnly%3Atrue%2CpremiseType%3Aall%2Cretailer%3AChain')
        .respond(200, depletionPerformanceData);
      var returnPromise = userService.getPerformanceBrand(params);
      $httpBackend.flush();

      expect(returnPromise.$$state.value.performance[0].measures[0]).toEqual({
          depletions: 300,
          depletionsBU: 50,
          depletionsBULastYear: 132439.3203,
          depletionsBUTrend: -10,
          depletionsGap: -0,
          depletionsLastYear: 50826.4906,
          depletionsTrend: -100,
          plan: 100,
          timeframe: 'MTD',
          vsPlan: 0,
          vsPlanPercent: NaN,
          planDepletionTrend: 200
      });

      $httpBackend
      .expect('GET', '/v2/users/undefined/performance/brandSnapshot?filter=myAccountsOnly%3Atrue%2CpremiseType%3Aall%2Cretailer%3AChain')
      .respond(400);
      returnPromise = userService.getPerformanceBrand(params);
      $httpBackend.flush();
      expect(returnPromise.$$state.status).toEqual(2);
    });

    it('get performance summary', function() {

        userService.model.currentUser.employeeID = '1234';
        var summaryData = {
            type: 'test',
            id: 'test-1'
        };

        $httpBackend
        .expect('GET', '/v2/users/1234/performance/summary')
        .respond(200, summaryData);
      var returnPromise = userService.getPerformanceSummary();
      $httpBackend.flush();

      expect(returnPromise.$$state.value).toEqual({
            type: 'test',
            id: 'test-1'
      });

      $httpBackend
      .expect('GET', '/v2/users/1234/performance/summary')
      .respond(400, depletionPerformanceData);
      returnPromise = userService.getPerformanceSummary();
      $httpBackend.flush();

    });

  it('get performance distribution', function() {

        userService.model.currentUser.employeeID = '1234';
        var distributionParam = {
            premiseType: 'off'
        };
        var distributionData = {
            performance: {
                type: 'test',
                id: 'test-1'
            }
        };

      $httpBackend
      .expect('GET', '/v2/users/1234/performance/distributionScorecard/?filter=premiseType%3Aoff')
      .respond(200, distributionData);
      var returnPromise = userService.getPerformanceDistribution(distributionParam);
      $httpBackend.flush();
      expect(returnPromise.$$state.value).toEqual(distributionData.performance);

      $httpBackend
      .expect('GET', '/v2/users/1234/performance/distributionScorecard/?filter=premiseType%3Aoff')
      .respond(400);
      returnPromise = userService.getPerformanceDistribution(distributionParam);
      $httpBackend.flush();

    });
});

describe('[Services.userService - targetlists]', function() {
  var $httpBackend, userService;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

    inject(function(_$http_, _$httpBackend_, _userService_) {
      $httpBackend = _$httpBackend_;
      userService = _userService_;
    });

    userService.model.currentUser = {
          employeeID: '1234'
      };
  });

  it('should be defined', function() {
      expect(userService).toBeDefined();
  });

  it('get target lists', function() {
      var responseObject = {
          owned: [{
              dateOpportunitiesUpdated: null,
              createdAt: '2017-02-15 21:49:46.175',
              archived: false
          }, {
              dateOpportunitiesUpdated: null,
              createdAt: '2022-03-15 21:49:46.175',
              archived: true
          }],
          sharedWithMe: [{
              dateOpportunitiesUpdated: null,
              createdAt: '2020-03-15 21:49:46.175',
              archived: false
          }, {
              dateOpportunitiesUpdated: null,
              createdAt: '2022-03-15 21:49:46.175',
              archived: true,
              collaborators: [{
                  lastViewed: null,
                  permissionLevel: 'author',
                  user: {
                      firstName: 'MR',
                      lastName: 'SIMPSON',
                      employeeId: '1234'
                  }
              }]
          }]
      };

      $httpBackend
      .expect('GET', '/v2/users/12345/targetLists/')
      .respond(200, responseObject);

      var returnObj = userService.getTargetLists('12345');
      $httpBackend.flush();

      expect(returnObj.$$state.value.owned).toEqual([{
          dateOpportunitiesUpdated: '2017-02-15 21:49:46.175',
          createdAt: '2017-02-15 21:49:46.175',
          archived: false
        }, {
            dateOpportunitiesUpdated: '2022-03-15 21:49:46.175',
            createdAt: '2022-03-15 21:49:46.175',
            archived: true
        }]);
        expect(returnObj.$$state.value.sharedWithMe).toEqual([{
            dateOpportunitiesUpdated: '2020-03-15 21:49:46.175',
            createdAt: '2020-03-15 21:49:46.175',
            archived: false,
            creator: undefined,
            newShare: undefined
        }, {
            dateOpportunitiesUpdated: '2022-03-15 21:49:46.175',
            createdAt: '2022-03-15 21:49:46.175',
            archived: true,
            collaborators: [{
                  lastViewed: null,
                  permissionLevel: 'author',
                  user: {
                      firstName: 'MR',
                      lastName: 'SIMPSON',
                      employeeId: '1234'
                  }}],
            creator: 'MR SIMPSON',
            newShare: true
        }]);
        expect(returnObj.$$state.value.ownedArchived).toEqual(1);
        expect(returnObj.$$state.value.ownedNotArchived).toEqual(1);
        expect(returnObj.$$state.value.sharedArchivedCount).toEqual(1);
        expect(returnObj.$$state.value.sharedNotArchivedCount).toEqual(1);

      $httpBackend
      .expect('GET', '/v2/users/12345/targetLists/')
      .respond(400);
      returnObj = userService.getTargetLists('12345');
      $httpBackend.flush();
      expect(returnObj.$$state.status).toEqual(2);
  });

  it('should return the target list model object if it exists', function() {
      userService.model.targetLists = {name: 'test obj'};
      var returnObj = userService.getTargetLists();
      expect(returnObj.$$state.value).toEqual({name: 'test obj'});
  });

  it('add target list', function() {
      var params = {
          name: 'test target list',
          description: 'test description',
          collaborateAndInvite: true
      };

      var responseObject = {
          dateCreated: '2020-02-17T23:28:02.23Z',
          name: 'new test target list',
          description: 'new test description'
      };

      userService.model.targetLists = {
          owned: [{
              dateCreated: '2015-02-17T23:28:02.23Z',
              name: 'old target list',
              description: 'old test description'
          }]
        };

      $httpBackend
      .expect('POST', '/v2/users/1234/targetLists/')
      .respond(200, responseObject);

      var returnedObject = userService.addTargetList(params);
      $httpBackend.flush();

      expect(returnedObject.$$state.value).toEqual({
          dateCreated: '2020-02-17T23:28:02.23Z',
          name: 'new test target list',
          description: 'new test description',
          createdAt: undefined,
          opportunitiesSummary: {
              closedOpportunitiesCount: 0,
              opportunitiesCount: 0,
              totalClosedDepletions: 0
            }
      });

      $httpBackend
      .expect('POST', '/v2/users/1234/targetLists/')
      .respond(200, responseObject);

      userService.model.targetLists.ownedNotArchivedTargetLists = [{
              dateCreated: '2015-03-17T23:28:02.23Z',
              name: 'old target list',
              description: 'old test description'
      }];
      responseObject.name = 'another new test target list';

      returnedObject = userService.addTargetList(params);
      $httpBackend.flush();

      expect(returnedObject.$$state.value).toEqual({
          dateCreated: '2020-02-17T23:28:02.23Z',
          name: 'another new test target list',
          description: 'new test description',
          createdAt: undefined,
          opportunitiesSummary: {
              closedOpportunitiesCount: 0,
              opportunitiesCount: 0,
              totalClosedDepletions: 0
            }
      });

      $httpBackend
      .expect('POST', '/v2/users/1234/targetLists/')
      .respond(400);
      returnedObject = userService.addTargetList(params);
      $httpBackend.flush();
      expect(returnedObject.$$state.status).toEqual(2);
  });
});

describe('[Services.userService - opportunities]', function() {
  var $httpBackend, userService, filtersService;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

    inject(function(_$http_, _$httpBackend_, _userService_, _filtersService_) {
      $httpBackend = _$httpBackend_;
      userService = _userService_;
      filtersService = _filtersService_;
    });
  });

  it('should send opportunity', function() {
      $httpBackend
      .expect('POST', '/v2/users/1234/sharedOpportunities/', ['5678'])
      .respond(201);

      var returnedPromise = userService.sendOpportunity('1234', '5678');
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(1);

       $httpBackend
      .expect('POST', '/v2/users/1234/sharedOpportunities/', ['5678'])
      .respond(400);

      returnedPromise = userService.sendOpportunity('1234', '5678');
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(2);
  });

  it('should get opportunity filters', function() {
      var responseObject = [{
          id: 'A57K3',
          name: 'Corona in PNW',
          filterString: 'productname%3Acorona%2Cregion%3Apacificnorthwest',
          description: 'Something'
        }];

      $httpBackend
      .expect('GET', '/v2/users/1234/opportunityFilters/')
      .respond(200, responseObject);

      var returnedPromise = userService.getOpportunityFilters('1234');
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(1);
      expect(returnedPromise.$$state.value).toEqual([{
          id: 'A57K3',
          name: 'Corona in PNW',
          filterString: 'productname%3Acorona%2Cregion%3Apacificnorthwest',
          description: 'Something'
      }]);

       $httpBackend
      .expect('GET', '/v2/users/1234/opportunityFilters/')
      .respond(400);

      returnedPromise = userService.getOpportunityFilters('1234');
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(2);
  });

  it('should filter out opportunities with no description', function() {
      var responseObject = [{
        id: 'ABCD1',
        name: 'Corona in CHI',
        filterString: 'productname%3Acorona%2Cregion%3Apacificnorthwest',
        description: null
      },
      {
        id: 'ABCD2',
        name: 'Corona in PNW',
        filterString: 'productname%3Acorona%2Cregion%3Apacificnorthwest',
        description: 'Something'
      }];

      $httpBackend
      .expect('GET', '/v2/users/1234/opportunityFilters/')
      .respond(200, responseObject);

      var returnedPromise = userService.getOpportunityFilters('1234');
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(1);
      expect(returnedPromise.$$state.value).toEqual([{
        id: 'ABCD2',
        name: 'Corona in PNW',
        filterString: 'productname%3Acorona%2Cregion%3Apacificnorthwest',
        description: 'Something'
      }]);
  });

  it('should save opportunity filter', function() {
      var responseObject = [{
          id: 'A57K3',
          name: 'Corona in PNW',
          filterString: 'productname%3Acorona%2Cregion%3Apacificnorthwest'
        }];

       filtersService.model.newServiceName = 'new service';
       filtersService.model.appliedFilter.appliedFilter = responseObject.filterString;
       userService.model.currentUser.employeeID = '1234';

      $httpBackend
      .expect('POST', '/v2/users/1234/opportunityFilters/')
      .respond(200, responseObject);

      var returnedPromise = userService.saveOpportunityFilter('filter description');
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(1);
      expect(returnedPromise.$$state.value).toEqual([{
          id: 'A57K3',
          name: 'Corona in PNW',
          filterString: 'productname%3Acorona%2Cregion%3Apacificnorthwest'
      }]);

       $httpBackend
      .expect('POST', '/v2/users/1234/opportunityFilters/')
      .respond(400);

      returnedPromise = userService.saveOpportunityFilter('filter description');
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(2);
  });
});

describe('[Services.userService - notifications]', function() {
  var $httpBackend, userService;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

    inject(function(_$http_, _$httpBackend_, _userService_) {
      $httpBackend = _$httpBackend_;
      userService = _userService_;
    });
  });

  it('get notifications', function() {
      var responseObject = [{
          id: 'A68YR',
          action: 'SHARE_TARGET_LIST',
          dateCreated: '2016-08-10 15:26:17.448',
          status: 'UNSEEN'
        }];

      $httpBackend
      .expect('GET', '/v2/users/1234/notifications/?after=2107-01-21')
      .respond(200, responseObject);

      var returnedPromise = userService.getNotifications('1234', '2107-01-21');
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(1);
      expect(returnedPromise.$$state.value).toEqual([{
          id: 'A68YR',
          action: 'SHARE_TARGET_LIST',
          dateCreated: '2016-08-10 15:26:17.448',
          status: 'UNSEEN'
      }]);

       $httpBackend
      .expect('GET', '/v2/users/1234/notifications/?after=2107-01-21')
      .respond(400);

      returnedPromise = userService.getNotifications('1234', '2107-01-21');
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(2);
  });

    it('create notifications', function() {
      var params = {
          creator: '1234',
          action: 'SHARE_TARGET_LIST',
          objectType: 'test_obj_type',
          objectID: 'test_object_id',
          salesforceUserNoteID: '999873UU542'
        };
      var payloadObject = {
          creator: '1234',
          action: 'SHARE_TARGET_LIST',
          objectType: 'test_obj_type',
          objectID: 'test_object_id',
          salesforceUserNoteID: '999873UU542'
        };

      $httpBackend
      .expect('POST', '/v2/sfdcNotifications/', payloadObject)
      .respond(200);

      var returnedPromise = userService.createNotification('1234', params);
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(1);

       $httpBackend
      .expect('POST', '/v2/sfdcNotifications/', payloadObject)
      .respond(400);

      returnedPromise = userService.createNotification('1234', params);
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(2);
  });
});
