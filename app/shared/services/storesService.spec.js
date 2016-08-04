describe('[Services.storesService]', function() {
  var apiHelperService, storesService, $q, $httpBackend;

  beforeEach(function() {
    angular.mock.module('andromeda.common.services');

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

    it('should get mulitple store data if no store id is passed', function() {
      $httpBackend.expect('GET', '/stores/').respond(200, {
        status: 'success'
      });

      var result;
      storesService.getStores().then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
    });

    it('should get one stores data if a store id is passed', function() {
      $httpBackend.expect('GET', '/stores/1').respond(200, {
        status: 'success'
      });

      var result;
      storesService.getStores('1').then(function() {
        result = true;
      });

      $httpBackend.flush();

      expect(result).toBeTruthy();
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

});
