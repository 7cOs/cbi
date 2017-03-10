'use strict';

module.exports =
  function inlineSearch() {
    var directive = {
      restrict: 'EA',
      bindToController: {
        type: '@',
        placeholder: '@',
        input: '=chosenResult',
        chosenResultObject: '=?',
        callback: '&',
        nav: '@',
        variety: '@',
        isRequired: '@',
        showAddress: '@',
        multipleRecipients: '=?',
        cacheInput: '=?',
        removable: '@',
        onRemove: '&',
        showX: '=?showX'
      },
      controller: 'InlineSearchController',
      controllerAs: 'is',
      template: require('./inline-search.pug'),
      scope: {
      },
      link: function(scope, elem, attrs) {
        elem.on('click', function(event) {
          event.stopPropagation();
        });
      }
    };
    return directive;
  };
