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
  });

  describe('when no analytics-if condition is specified', () => {
    beforeEach(() => {
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

  describe('when analytics-if condition is specified, and evaluates to true', () => {
    beforeEach(() => {
      inject(($compile, $rootScope) => {
        const scope = $rootScope.$new();
        element = angular.element('<div analytics-event-on="click" analytics-if="{{ (1===1) }}" category="myCat" action="myAction" label="myLabel"></div>');
        compiledElement = $compile(element)(scope);
      });
    });

    it('should call trackEvent when clicked', () => {
      compiledElement.triggerHandler('click');
      expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('myCat', 'myAction', 'myLabel');
    });
  });

  describe('when analytics-if condition is specified, and scope variable evaluates to true', () => {
    beforeEach(() => {
      inject(($compile, $rootScope) => {
        const scope = $rootScope.$new();
        scope.sendEvent = true;
        element = angular.element('<div analytics-event-on="click" analytics-if="{{sendEvent}}" category="myCat" action="myAction" label="myLabel"></div>');
        compiledElement = $compile(element)(scope);
      });
    });

    it('should call trackEvent when clicked', () => {
      compiledElement.triggerHandler('click');
      expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('myCat', 'myAction', 'myLabel');
    });
  });

  describe('when analytics-if condition is specified, and is literally true', () => {
    beforeEach(() => {
      inject(($compile, $rootScope) => {
        const scope = $rootScope.$new();
        element = angular.element('<div analytics-event-on="click" analytics-if="true" category="myCat" action="myAction" label="myLabel"></div>');
        compiledElement = $compile(element)(scope);
      });
    });

    it('should call trackEvent when clicked', () => {
      compiledElement.triggerHandler('click');
      expect(mockAnalyticsService.trackEvent).toHaveBeenCalledWith('myCat', 'myAction', 'myLabel');
    });
  });

  describe('when analytics-if condition is specified, and evaluates to false', () => {
    beforeEach(() => {
      inject(($compile, $rootScope) => {
        const scope = $rootScope.$new();
        element = angular.element('<div analytics-event-on="click" analytics-if="{{ (1===2) }}" category="myCat" action="myAction" label="myLabel"></div>');
        compiledElement = $compile(element)(scope);
      });
    });

    it('should not call trackEvent when clicked', () => {
      compiledElement.triggerHandler('click');
      expect(mockAnalyticsService.trackEvent).not.toHaveBeenCalled();
    });
  });

  describe('when analytics-if condition is specified, and scope variable evaluates to false', () => {
    beforeEach(() => {
      inject(($compile, $rootScope) => {
        const scope = $rootScope.$new();
        scope.sendEvent = false;
        element = angular.element('<div analytics-event-on="click" analytics-if="{{sendEvent}}" category="myCat" action="myAction" label="myLabel"></div>');
        compiledElement = $compile(element)(scope);
      });
    });

    it('should not call trackEvent when clicked', () => {
      compiledElement.triggerHandler('click');
      expect(mockAnalyticsService.trackEvent).not.toHaveBeenCalled();
    });
  });

  describe('when analytics-if condition is specified, and is literally false', () => {
    beforeEach(() => {
      inject(($compile, $rootScope) => {
        const scope = $rootScope.$new();
        scope.sendEvent = false;
        element = angular.element('<div analytics-event-on="click" analytics-if="false" category="myCat" action="myAction" label="myLabel"></div>');
        compiledElement = $compile(element)(scope);
      });
    });

    it('should not call trackEvent when clicked', () => {
      compiledElement.triggerHandler('click');
      expect(mockAnalyticsService.trackEvent).not.toHaveBeenCalled();
    });
  });
});
