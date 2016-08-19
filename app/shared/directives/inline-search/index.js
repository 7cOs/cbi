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

    function InlineSearchController($scope, $timeout, searchService) {

      // ****************
      // CONTROLLER SETUP
      // ****************

      // Initial variables
      var vm = this;

      // Defaults
      vm.input = '';
      vm.showResults = false;
      vm.loading = false;

      // Expose public methods
      vm.action = action;
      vm.resultChosen = resultChosen;
      vm.close = close;

      // **************
      // PUBLIC METHODS
      // **************

      function action() {
        vm.results = [];
        vm.errorMessage = null;
        vm.loading = true;
        vm.showResults = true;

        searchService.getDistributors(vm.input).then(function(data) {
          vm.loading = false;
          vm.results = data;
        }, function(reason) {
          vm.loading = false;
          vm.errorMessage = reason;
        });
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
