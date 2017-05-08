/* describe('[Services.notificationsService]', function() {
  var apiHelperService, notificationsService, $q, $httpBackend;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

    inject(function(_apiHelperService_, _notificationsService_, _$q_, _$httpBackend_) {
      apiHelperService = _apiHelperService_;
      notificationsService = _notificationsService_;
      $q = _$q_;
      $httpBackend = _$httpBackend_;
    });
  });

  beforeEach(inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    var statuses = notificationsService.status;

    $httpBackend
      .whenPATCH('/v2/notifications')
      .respond(function(method, url, data, headers, params) {
        try {
          return JSON
            .parse(data)
            .reduce(function(result, input) {
              var status = input.status;

              if (!(statuses[status] === status)) {
                return [400];
              } else {
                return result;
              }
            }, [200]);
        } catch (e) {
          return [400];
        }
      });
  }));

  it('should exist', function() {
    expect(apiHelperService).toBeDefined();
    expect(notificationsService).toBeDefined();
    expect($q).toBeDefined();
    expect($httpBackend).toBeDefined();
  });

  it('it\'s methods should exist', function() {
    expect(notificationsService.markNotifications).toBeDefined();
  });

  it('should return a promise', function() {
    var result = notificationsService.markNotifications('1');
    var promiseResult = $q.defer().promise;

    expect(result).toEqual(promiseResult);
  });

  it('should resolve when status set to a valid value', function(done) {
    var payload = [{
      id: 'b928d31a-7eb7-41ac-ba94-3303d78cd44a',
      status: notificationsService.status.READ
    }];

    notificationsService
      .markNotifications(payload)
      .then(function(test) {
        expect(test.status).toBe(200);
        done();
      });

    $httpBackend.flush();
  });

  it('should reject when status set to an invalid value', function(done) {
    var payload = [{
      id: 'b928d31a-7eb7-41ac-ba94-3303d78cd44a',
      status: 'INVALID'
    }];

    notificationsService
      .markNotifications(payload)
      .catch(function(test) {
        expect(test.status).toBe(400);
        done();
      });

    $httpBackend.flush();
  });
}); */
