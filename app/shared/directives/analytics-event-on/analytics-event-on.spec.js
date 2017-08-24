describe('analytics-event-on directive', () => {

  let mockAnalyticsService;
  let element;
  let compiledElement;

  beforeEach(() => {
    angular.mock.module('cf.common.directives');

    angular.mock.module(($provide) => {
      mockAnalyticsService = {
        trackEvent: jasmine.createSpy('trackEvent')
      };

      $provide.value('analyticsService', mockAnalyticsService);
    });

    inject(($compile, $rootScope) => {
      const scope = $rootScope.$new();
      element = angular.element('<div analytics-event-on="click" category="myCat" action="myAction" label="myLabel"></div>');
      compiledElement = $compile(element)(scope);
    });
  });

  it('should call trackEvent when clicked', () => {
    compiledElement.triggerHandler('click');
    expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('myCat', 'myAction', 'myLabel');
  });
});
