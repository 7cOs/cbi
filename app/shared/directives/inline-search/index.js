'use strict';

module.exports =
  function inlineSearch() {
    var directive = {
      restrict: 'EA',
      scope: {
        placeholder: '@',
        results: '='
      },
      controller: InlineSearchController,
      controllerAs: 'is',
      templateUrl: 'app/shared/directives/inline-search/inline-search.html',
      bindToController: true,
      link: function(scope, elem, attrs) {}
    };

    function InlineSearchController($scope, $timeout) {

      // ****************
      // CONTROLLER SETUP
      // ****************

      // Initial variables
      var vm = this;

      // Defaults
      vm.input = '';
      vm.showResults = false;
      vm.loading = false;
      vm.results = [
        'Result one',
        'Result two',
        'Result three',
        'Result four',
        'Result five',
        'Result six'
      ];

      // Expose public methods
      vm.action = action;
      vm.resultChosen = resultChosen;
      vm.close = close;

      // **************
      // PUBLIC METHODS
      // **************

      function action() {
        vm.loading = true;
        vm.showResults = true;
        $timeout(function() {
          vm.loading = false;
        }, 2000);
      }

      function resultChosen(result) {
        vm.input = result;
        close();
      }

      function close() {
        vm.showResults = false;
      }
    }

    return directive;
  };
