describe('[Services.productsService]', function() {
  var apiHelperService, productsService, $q, $httpBackend;

  beforeEach(function() {
    angular.mock.module('orion.common.services');

    inject(function(_apiHelperService_, _productsService_, _$q_, _$httpBackend_) {
      apiHelperService = _apiHelperService_;
      productsService = _productsService_;
      $q = _$q_;
      $httpBackend = _$httpBackend_;
    });
  });

  it('should exist', function() {
    expect(apiHelperService).toBeDefined();
    expect(productsService).toBeDefined();
    expect($q).toBeDefined();
    expect($httpBackend).toBeDefined();
  });

  it('it\'s methods should exist', function() {
    expect(productsService.getProducts).toBeDefined();
  });

  it('should return a promise', function() {
    var result = productsService.getProducts();
    var promiseResult = $q.defer().promise;

    expect(result).toEqual(promiseResult);
  });

  it('should send a request and return status 200', function() {
    $httpBackend
      .expectGET('/api/products/')
      .respond(200);

    var result;
    productsService.getProducts().then(function() {
      result = true;
    });

    $httpBackend.flush();
    expect(result).toBeTruthy();
  });

});
