describe('[Services.storesService]', function() {
  var apiHelperService, storesService, $q, $httpBackend;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

    inject(function(_apiHelperService_, _storesService_, _$q_, _$httpBackend_) {
      apiHelperService = _apiHelperService_;
      storesService = _storesService_;
      $q = _$q_;
      $httpBackend = _$httpBackend_;
    });
  });

  it('should exist', function() {
    expect(apiHelperService).toBeDefined();
    expect(storesService).toBeDefined();
    expect($q).toBeDefined();
    expect($httpBackend).toBeDefined();
  });

  it('it\'s methods should exist', function() {
    expect(storesService.getStores).toBeDefined();
    expect(storesService.getStoreOpportunities).toBeDefined();
  });

  describe('[getStores]', function() {
    it('get stores should return a promise', function() {
      var result = storesService.getStores();
      var promiseResult = $q.defer().promise;

      expect(result).toEqual(promiseResult);
    });

    it('should get one stores data if a store id is passed', function() {
      $httpBackend.expect('GET', '/api/stores/1').respond(200, [0, 1, 2, 3]);

      var result;
      storesService.getStores('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });

    it('should format the store accordingly', () => {
      var responseObject = {
        tdlinx_number: '123',
        store_name: 'testStore',
        store_number: '456',
        premise_type: 'OFF PREMISE'
      };

      $httpBackend.expect('GET', '/api/stores/789').respond(200, responseObject);

      const returnedPromise = storesService.getStores('789');
      $httpBackend.flush();

      expect(returnedPromise.$$state.value).toEqual({
        tdlinx_number: '123',
        store_name: 'testStore',
        store_number: '456',
        premise_type: 'OFF PREMISE',
        id: '123',
        name: 'testStore',
        storeNumber: '456',
        premiseTypeDesc: 'off'
      });

    });
  });

  describe('[getStoreOpportunities]', function() {
    it('get store opportunities should return a promise', function() {
      var result = storesService.getStoreOpportunities();
      var promiseResult = $q.defer().promise;

      expect(result).toEqual(promiseResult);
    });

    it('should get all store opportunities for a store when an id is passed', function() {
      $httpBackend.expect('GET', '/stores/1/opportunities').respond(200, {
        status: 'success'
      });

      var result;
      storesService.getStoreOpportunities('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });
  });

  describe('[getItemAuthorizations]', function() {
    it('get item authorizations should return a promise', function() {
      var result = storesService.getItemAuthorizations('90234923');
      var promiseResult = $q.defer().promise;

      expect(result).toEqual(promiseResult);
    });
    it('should get the authorizations', function() {
      $httpBackend.expect('GET', '/api/stores/90234923/itemAuthorizations').respond(200, {
        status: 'success'
      });
      var result;
      storesService.getItemAuthorizations('90234923').then(function() {
        result = true;
      });

      $httpBackend.flush();
      expect(result).toBeTruthy();
    });
  });

  describe('[getFeatures]', function() {
    it('get get features should return a promise', function() {
      var result = storesService.getFeatures('90234923');
      var promiseResult = $q.defer().promise;

      expect(result).toEqual(promiseResult);
    });
    it('should get the features', function() {
      $httpBackend.expect('GET', '/api/stores/90234923/features').respond(200, {
        status: 'success'
      });
      var result;
      storesService.getFeatures('90234923').then(function() {
        result = true;
      });

      $httpBackend.flush();
      expect(result).toBeTruthy();
    });
  });
});
