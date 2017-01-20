'use strict';

module.exports = /*  @ngInject */
  function imageLoader() {
    return {
      restrict: 'EA',
      link: function(scope, elem, attrs) {
        angular.element(elem).find('img').on('load', function() {
          elem.addClass('loaded');
        });
      }
    };
  };
