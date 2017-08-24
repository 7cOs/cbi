'use strict';

module.exports = /*  @ngInject */
  function analyticsEventOn($injector, $timeout) {
    return {
      restrict: 'A',
      link: ($scope, $element, $attrs) => {
        // workaround for circular injection dependencies when
        // this directive is used inside an upgraded component
        let analyticsService;
        $timeout(() => {
          analyticsService = $injector.get('analyticsService');
        }, 0);

        const eventType = $attrs.analyticsEvent || 'click';

        angular.element($element[0]).bind(eventType, () => {
          if ($attrs.analyticsIf && !$scope.$eval($attrs.analyticsIf)) {
            return; // cancel this event when analytics-if attribute is present but falsey
          }

          analyticsService.trackEvent($attrs.category, $attrs.action, $attrs.label);
        });
      }
    };
  };
