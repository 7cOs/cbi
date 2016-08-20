'use strict';

module.exports =
  function inlineSearch() {
    var directive = {
      restrict: 'EA',
      scope: {
        type: '@',
        placeholder: '@',
        chosenResult: '='
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

      function action(type) {
        var method;
        vm.results = [];
        vm.chosenResult = {};
        vm.errorMessage = null;
        vm.loading = true;
        vm.showResults = true;

        switch (type) {
          case 'user':
            method = 'getUsers';
            break;
          case 'product':
            method = 'getProducts';
            break;
          case 'store':
            method = 'getStores';
            break;
          case 'distributor':
            method = 'getDistributors';
            break;
          case 'chain': // This should probably be an endpoint, waiting for answer from API
            method = 'getStores';
            break;
          default:
            console.log('Please specify a search type');
            break;
        }

        searchService[method](vm.input).then(function(data) {
          vm.loading = false;
          vm.results = data;
        }, function(reason) {
          vm.loading = false;
          vm.errorMessage = reason;
        });
      }

      function resultChosen(result) {
        vm.input = result;
        vm.chosenResult = result;
        close();
      }

      function close() {
        vm.showResults = false;
      }
    }

    return directive;
  };
