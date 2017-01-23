'use strict';

module.exports = /*  @ngInject */
  function apiHelperService($rootScope, $analytics, $location, $window) {

    return {
      trackPageViews: function() {
        $rootScope.$on('$stateChangeSuccess', function (event, currentState) {
          var url = $location.url(),
            props = {
              location: $location.absUrl(),
              title: currentState.title
            };

          if (currentState.analyticsData) {
            if (currentState.analyticsData.pageTitle) {
              props.title = currentState.analyticsData.pageTitle;
            }

            if (currentState.analyticsData.pageUrl) {
              url = currentState.analyticsData.pageUrl;
            }
          }

          $analytics.pageTrack(url, props);

          // set updated page info on GA tracker, so that events also use this info
          // (unfortunately angulartics doesn't expose a way to do this)
          $window.ga('set', angular.extend(props, {
            page: url
          }));
        });
      }
    };
  };
