'use strict';

module.exports = /*  @ngInject */
  function apiHelperService($rootScope, $analytics, $location, $window, notesService, userService, $transitions) {

    return {
      createTracker: createTracker,
      trackPageViews: trackPageViews,
      setCustomDimensions: setCustomDimensions
    };

    /**
     * @name createTracker
     * @desc Create the Google Analytics tracker object using the global 'ga' function
     * defined by the Google Analytics universal loader script in template head.
     * @params {String} analyticsId - Google Analytics ID
     * @params {String} userId - employeeID (federation/SSO) of current user
     * @returns null
     * @memberOf cf.common.services
     */
    function createTracker(analyticsId, userId) {
      $window.ga('create', analyticsId, 'auto', {
        userId: userId || 'undefined'
      });
    }

    /**
     * @name trackPageViews
     * @desc Track 'virtual' page views by subscribing to state change success. Ensures
     * custom page title / URL are used if defined for state, and ensures these are set
     * in the Google Analytics tracker for future events occurring on the current page.
     * @returns null
     * @memberOf cf.common.services
     */
    function trackPageViews() {
      $transitions.onSuccess({}, (transition) => {
        const toState = transition.to();
        const props = {
          location: $location.absUrl(),
          title: toState.title
        };
        let url = $location.url();

        if (toState.analyticsData) {
          if (toState.analyticsData.pageTitle) {
            props.title = toState.analyticsData.pageTitle;
          }

          if (toState.analyticsData.pageUrl) {
            url = toState.analyticsData.pageUrl;
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

    /**
     * @name setCustomDimensions
     * @desc Fetch additional user info from SFDC and set as custom dimensions on
     * the Google Analytics tracker. These dimensions are defined with 'session' scope
     * in Google Analytics admin console, and can be set at any time during a session, so
     * his function is asynchronous. It also ignores any errors that may occur.
     * @returns null
     * @memberOf cf.common.services
     */
    function setCustomDimensions() {
      notesService.userInfo().then(sfdcUser => {
        $analytics.setUserProperties({
          dimension1: 'Constellation Brands',     // 'User Type', static
          dimension2: sfdcUser.CompanyName,       // 'Company'
          dimension3: sfdcUser.Division,          // 'Division'
          dimension4: sfdcUser.Role__c,           // 'Role'
          dimension5: sfdcUser.Supervisory__c,    // 'Supervisory'
          dimension6: sfdcUser.CBI_Department__c, // 'Department'
          dimension7: userService.model.currentUser.employeeID, // 'User Id'
          dimension8: new Date().getTime()        // 'Time Stamp'
        });
      });
    }
  };
