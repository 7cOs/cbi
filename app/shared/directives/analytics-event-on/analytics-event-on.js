'use strict';

module.exports = /*  @ngInject */
  function analyticsEventOn(analyticsService) {
    return {
      restrict: 'A',
      link: function ($scope, $element, $attrs) {
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
