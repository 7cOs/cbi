describe('[Services.targetListService]', function() {
  var $http, $q, $httpBackend, targetListService, apiHelperService, opportunitiesService, filtersService;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

    inject(function(_$http_, _$q_, _$httpBackend_, _targetListService_, _apiHelperService_, _opportunitiesService_, _filtersService_) {
      $http = _$http_;
      $q = _$q_;
      $httpBackend = _$httpBackend_;
      targetListService = _targetListService_;
      apiHelperService = _apiHelperService_;
      opportunitiesService = _opportunitiesService_;
      filtersService = _filtersService_;
    });
  });

  it('should exist', function() {
    expect($http).toBeDefined();
    expect($q).toBeDefined();
    expect(targetListService).toBeDefined();
    expect(apiHelperService).toBeDefined();
    expect(opportunitiesService).toBeDefined();
    expect(filtersService).toBeDefined();
  });

  it('it\'s methods should exist', function() {
    expect(targetListService.model).toBeDefined();
    expect(targetListService.getTargetList).toBeDefined();
    expect(targetListService.updateTargetList).toBeDefined();
    expect(targetListService.deleteTargetList).toBeDefined();
    expect(targetListService.getAndUpdateTargetListStoresWithOpportunities).toBeDefined();
    expect(targetListService.addTargetListOpportunities).toBeDefined();
    expect(targetListService.deleteTargetListOpportunities).toBeDefined();
    expect(targetListService.getTargetListShares).toBeDefined();
    expect(targetListService.addTargetListShares).toBeDefined();
    expect(targetListService.updateTargetListShares).toBeDefined();
    expect(targetListService.deleteTargetListShares).toBeDefined();
    expect(apiHelperService.request).toBeDefined();
    expect(opportunitiesService.model).toBeDefined();
    expect(filtersService.model).toBeDefined();
    expect(filtersService.getAppliedFilters).toBeDefined();
  });

  describe('[getTargetList]', function() {
    it('get target list should return a promise', function() {
      var result = targetListService.getTargetList(1, {});
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should get target lists if id is passed', function() {
      $httpBackend.expect('GET', '/v2/targetLists/1').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.getTargetList('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[updateTargetList]', function() {
    it('update target list should return a promise', function() {
      var result = targetListService.updateTargetList(1, {});
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should update target lists if id is passed', function() {
      $httpBackend.expect('PATCH', '/v2/targetLists/1').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.updateTargetList('1', {}).then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[deleteTargetList]', function() {
    it('delete target list should return a promise', function() {
      var result = targetListService.deleteTargetList();
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should delete target list if id is passed', function() {
      $httpBackend.expect('DELETE', '/v2/targetLists/1').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.deleteTargetList('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[getAndUpdateTargetListStoresWithOpportunities]', function() {
    it('get target list opportunities should return a promise', function() {
      var result = targetListService.getAndUpdateTargetListStoresWithOpportunities(1, {});
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should get target list opportunities if id is passed', function() {
      var filterPayload = filtersService.getAppliedFilters('targetListOpportunities'),
          url = apiHelperService.request('/v2/targetLists/1/opportunities', filterPayload);

      $httpBackend.expect('GET', url).respond(200, {
        status: 'success',
        opportunities: []
      });

      var result;
      targetListService.getAndUpdateTargetListStoresWithOpportunities('1', filterPayload).then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[Services.targetListService - getAndUpdateTargetListStoresWithOpportunities]', function() {
  var $httpBackend, targetListService, params, returnedPromise, id, responseObject, expectedResponseObject;

  beforeEach(function() {
    inject(function(_$http_, _$httpBackend_, _targetListService_) {
      $httpBackend = _$httpBackend_;
      targetListService = _targetListService_;
    });

    params = undefined;
    id = '1234560009999';
    responseObject = {
            opportunities: [ {
                // test vsYAPercent +100
                depletionsCurrentYearToDate: 5,
                depletionsCurrentYearToDateYA: 0,
                depletionsCurrentYearToDateYAPercent: 0,
                depletionsCurrentYearToDateYAPercentNegative: true,
                store: {
                    // test vsYAPercent -100
                    depletionsCurrentYearToDate: 0,
                    depletionsCurrentYearToDateYA: 2886.8334,
                    depletionsCurrentYearToDateYAPercent: 0,
                    depletionsCurrentYearToDateYAPercentNegative: false,
                    unsold: false,
                    id: '1401904',
                    address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                },
                featureTypeCode: null,
                isChainMandate: 'N',
                isItemAuthorization: 'N',
                isOnFeature: 'N',
                // test chain mandate
                itemAuthorizationCode: 'CM',
                product: {
                    brand: 'CORONA EXTRA'
                }
            }, {
                // test vsYAPercent 0
                depletionsCurrentYearToDate: 0,
                depletionsCurrentYearToDateYA: 0,
                depletionsCurrentYearToDateYAPercent: 10,
                depletionsCurrentYearToDateYAPercentNegative: false,
                store: {
                    // test vsYAPercent >999
                    depletionsCurrentYearToDate: 100,
                    depletionsCurrentYearToDateYA: 0.1,
                    depletionsCurrentYearToDateYAPercent: 0,
                    depletionsCurrentYearToDateYAPercentNegative: true,
                    unsold: false,
                    id: '1401904',
                    address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                },
                featureTypeCode: 'OK',
                isChainMandate: 'N',
                isItemAuthorization: 'N',
                isOnFeature: 'Y',
                itemAuthorizationCode: null,
                product: {
                    brand: 'CORONA EXTRA'
                }
            }, {
                // test vsYAPercent < -999
                depletionsCurrentYearToDate: 100,
                depletionsCurrentYearToDateYA: -0.1,
                depletionsCurrentYearToDateYAPercent: 0,
                depletionsCurrentYearToDateYAPercentNegative: false,
                store: {
                    // test vsYAPercent standard case
                    depletionsCurrentYearToDate: 100,
                    depletionsCurrentYearToDateYA: -25,
                    depletionsCurrentYearToDateYAPercent: 0,
                    depletionsCurrentYearToDateYAPercentNegative: true,
                    unsold: false,
                    id: '1401904',
                    address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                },
                featureTypeCode: null,
                isChainMandate: 'N',
                isItemAuthorization: 'N',
                isOnFeature: 'N',
                itemAuthorizationCode: null,
                product: {
                    brand: 'CORONA EXTRA'
                }
            }
        ]};
    expectedResponseObject = {
        filterApplied: true,
        opportunityId: null,
        noOpportunitiesFound: false,
        opportunities: [
            {
                // test vsYAPercent +100%
                depletionsCurrentYearToDate: 5,
                depletionsCurrentYearToDateYA: 0,
                depletionsCurrentYearToDateYAPercent: '+100%',
                depletionsCurrentYearToDateYAPercentNegative: false,
                store: {
                    // test vsYAPercent -100%
                    depletionsCurrentYearToDate: 0,
                    depletionsCurrentYearToDateYA: 2886.8334,
                    depletionsCurrentYearToDateYAPercent: '-100%',
                    depletionsCurrentYearToDateYAPercentNegative: true,
                    unsold: false,
                    id: '1401904',
                    address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                },
                featureTypeCode: null,
                isChainMandate: 'Y',
                isItemAuthorization: 'Y',
                isOnFeature: 'N',
                itemAuthorizationCode: 'CM',
                product: {
                    brand: 'CORONA EXTRA'
                },
                brands: ['corona extra', 'corona extra', 'corona extra'],
                trend: NaN,
                groupedOpportunities: [{
                    depletionsCurrentYearToDate: 5,
                    depletionsCurrentYearToDateYA: 0,
                    depletionsCurrentYearToDateYAPercent: '+100%',
                    depletionsCurrentYearToDateYAPercentNegative: false,
                    store: {
                        depletionsCurrentYearToDate: 0,
                        depletionsCurrentYearToDateYA: 2886.8334,
                        depletionsCurrentYearToDateYAPercent: '-100%',
                        depletionsCurrentYearToDateYAPercentNegative: true,
                        unsold: false,
                        id: '1401904',
                        address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                    },
                    featureTypeCode: null,
                    isChainMandate: 'Y',
                    isItemAuthorization: 'Y',
                    isOnFeature: 'N',
                    itemAuthorizationCode: 'CM',
                    product: {
                        brand: 'CORONA EXTRA'
                      }
                    }, {
                    // test vs YAPercent = 0
                    depletionsCurrentYearToDate: 0,
                    depletionsCurrentYearToDateYA: 0,
                    depletionsCurrentYearToDateYAPercent: 0,
                    depletionsCurrentYearToDateYAPercentNegative: true,
                    store: {
                        // test vsYAPercent >999
                        depletionsCurrentYearToDate: 100,
                        depletionsCurrentYearToDateYA: 0.1,
                        depletionsCurrentYearToDateYAPercent: '+999%',
                        depletionsCurrentYearToDateYAPercentNegative: false,
                        unsold: false,
                        id: '1401904',
                        address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                    },
                    featureTypeCode: 'OK',
                    isChainMandate: 'N',
                    isItemAuthorization: 'N',
                    isOnFeature: 'Y',
                    itemAuthorizationCode: null,
                    product: {
                        brand: 'CORONA EXTRA'
                    }
                  }, {
                    // test vs YAPercent < -999
                    depletionsCurrentYearToDate: 100,
                    depletionsCurrentYearToDateYA: -0.1,
                    depletionsCurrentYearToDateYAPercent: '-999%',
                    depletionsCurrentYearToDateYAPercentNegative: true,
                    store: {
                        // test vsYAPercent standard case
                        depletionsCurrentYearToDate: 100,
                        depletionsCurrentYearToDateYA: -25,
                        depletionsCurrentYearToDateYAPercent: '-500.0%',
                        depletionsCurrentYearToDateYAPercentNegative: true,
                        unsold: false,
                        id: '1401904',
                        address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                    },
                    featureTypeCode: null,
                    isChainMandate: 'N',
                    isItemAuthorization: 'N',
                    isOnFeature: 'N',
                    itemAuthorizationCode: null,
                    product: {
                        brand: 'CORONA EXTRA'
                  }}]}]};
  });

  it('should manipulate opportunitiy data', () => {
      $httpBackend
        .expect('GET', '/v2/targetLists/' + id + '/opportunities')
        .respond(200, responseObject);

      returnedPromise = targetListService.getAndUpdateTargetListStoresWithOpportunities(id, params);
      $httpBackend.flush();
      expect(returnedPromise.$$state.value).toEqual(expectedResponseObject.opportunities);

    });
  });

  describe('[addTargetListOpportunities]', function() {
    it('add target list opportunities should return a promise', function() {
      var result = targetListService.addTargetListOpportunities();
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should add target list opportunities if id is passed', function() {
      $httpBackend.expect('POST', '/v2/targetLists/1/opportunities/').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.addTargetListOpportunities('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[deleteTargetListOpportunities]', function() {
    it('delete target list opportunities should return a promise', function() {
      var result = targetListService.deleteTargetListOpportunities();
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should delete target list opportunities if id is passed', function() {
      $httpBackend.expect('DELETE', '/v2/targetLists/1/opportunities/').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.deleteTargetListOpportunities('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[addTargetListShares]', function() {
    it('add target list shares should return a promise', function() {
      var result = targetListService.addTargetListShares();
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should add target list shares if id is passed', function() {
      $httpBackend.expect('POST', '/v2/targetLists/1/shares').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.addTargetListShares('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[updateTargetListShares]', function() {
    it('update target list shares should return a promise', function() {
      var result = targetListService.updateTargetListShares();
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should update target list shares if id is passed', function() {
      $httpBackend.expect('PATCH', '/v2/targetLists/1/shares').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.updateTargetListShares('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[deleteTargetListShares]', function() {
    it('delete target list shares should return a promise', function() {
      var result = targetListService.deleteTargetListShares();
      var promiseResult = $q.defer().promise;
      expect(result).toEqual(promiseResult);
    });

    it('should delete target list shares if id is passed', function() {
      $httpBackend.expect('DELETE', '/v2/targetLists/1/shares').respond(200, {
        status: 'success'
      });

      var result;
      targetListService.deleteTargetListShares('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

});
