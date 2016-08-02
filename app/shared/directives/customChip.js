'use strict';

module.exports =
  function customChip() {
    return {
      restrict: 'EA',
      link: function(scope, elem, attrs) {
        var myChip = elem.parent().parent();
        myChip.addClass('_active');

        scope.$watch(function() {
          return !scope.$chip.applied;
        }, function(newVal) {
          if (newVal) {
            myChip.addClass('_active');
          } else {
            myChip.removeClass('_active');
          }
        });

      }
    };
  };
