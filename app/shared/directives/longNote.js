'use strict';

module.exports = /*  @ngInject */
  function longNote() {
    return {
      restrict: 'EA',
      link: function(scope, elem, attrs) {
        angular.element(elem).ready(function() {
          var height = elem[0].offsetHeight;
          if (height >= 32) {
            angular.element(elem).parent().addClass('long-note');
          }
        });
      }
    };
  };
