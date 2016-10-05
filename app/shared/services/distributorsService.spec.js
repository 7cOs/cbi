/* describe('[Services.distributorsService]', function() {
  var apiHelperService, distributorsService, $q, $httpBackend;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

    inject(function(_apiHelperService_, _distributorsService_, _$q_, _$httpBackend_) {
      apiHelperService = _apiHelperService_;
      distributorsService = _distributorsService_;
      $q = _$q_;
      $httpBackend = _$httpBackend_;
    });
  });

  it('should exist', function() {
    expect(apiHelperService).toBeDefined();
    expect(distributorsService).toBeDefined();
    expect($q).toBeDefined();
    expect($httpBackend).toBeDefined();
  });

  it('it\'s methods should exist', function() {
    expect(distributorsService.getDistributors).toBeDefined();
  });

  it('should return a promise', function() {
    var result = distributorsService.getDistributors();
    var promiseResult = $q.defer().promise;

    expect(result).toEqual(promiseResult);
  });

  it('should send a request and return status 200', function() {
    $httpBackend
      .expectGET('/api/distributors/')
      .respond(200);

    var result;
    distributorsService.getDistributors().then(function() {
      result = true;
    });

    $httpBackend.flush();
    expect(result).toBeTruthy();
  });

});
*/
