describe('[Services.toastService]', function() {
  var $timeout, toastService;

  beforeEach(function() {
    angular.mock.module('cf.common.services');

    inject(function(_$timeout_, _toastService_) {
      $timeout = _$timeout_;
      toastService = _toastService_;
    });
  });

  it('should exist', function() {
    expect($timeout).toBeDefined();
    expect(toastService).toBeDefined();
  });

  it('it\'s methods should exist', function() {
    expect(toastService.model).toBeDefined();
    expect(toastService.showToast).toBeDefined();
  });
});
