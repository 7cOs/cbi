'use strict';

module.exports = /*  @ngInject */
  function ieHackService($timeout) {

    var userAgent = navigator.userAgent,
        isIE = (/Trident\/7\./g).test(userAgent),
        isEdge = (/(?:\bEdge\/)(\d+)/g).test(userAgent);

    var service = {
      isIE: isIE,
      isEdge: isEdge,
      forceRepaint: forceRepaint
    };

    return service;

    function forceRepaint() {
      if (isIE || isEdge) {
        $timeout(function() {
          angular.element(document).find('body').css('display', 'none');
          angular.element(document).find('body').css('display', 'block');
        });
      }
    }
  };
