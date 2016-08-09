describe('[Services.notificationsService]', function() {
  var apiHelperService, notificationsService, $q, $httpBackend;

  beforeEach(function() {
    angular.mock.module('orion.common.services');

    inject(function(_apiHelperService_, _notificationsService_, _$q_, _$httpBackend_) {
      apiHelperService = _apiHelperService_;
      notificationsService = _notificationsService_;
      $q = _$q_;
      $httpBackend = _$httpBackend_;
    });
  });

  it('should exist', function() {
    expect(apiHelperService).toBeDefined();
    expect(notificationsService).toBeDefined();
    expect($q).toBeDefined();
    expect($httpBackend).toBeDefined();
  });

  it('it\'s methods should exist', function() {
    expect(notificationsService.markNotificationAsRead).toBeDefined();
  });

  it('should return a promise', function() {
    var result = notificationsService.markNotificationAsRead('/notifications/1');
    var promiseResult = $q.defer().promise;

    expect(result).toEqual(promiseResult);
  });

  it('should send a request and return status 200', function() {
    $httpBackend.expect('PATCH', '/api/notifications/1', {read: true}).respond(200, {
      status: 'success'
    });

    var result;
    notificationsService.markNotificationAsRead('1').then(function() {
      result = true;
    });

    $httpBackend.flush();

    expect(result).toBeTruthy();
  });

});
