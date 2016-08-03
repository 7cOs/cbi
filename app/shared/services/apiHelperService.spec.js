describe('Unit: Services', function() {
  require('angular-mocks/ngMock');

  var APIHelper;

  // beforeEach(angular.mock.module('andromeda.common.services'));
  beforeEach(function() { angular.mock.module('andromeda.common.services'); });

  beforeEach(inject(function(_apiHelperServiceService_) {
    APIHelper = _apiHelperServiceService_;
  }));

  it('should exist', function() {
    expect(APIHelper).toBeDefined();
  });

});
