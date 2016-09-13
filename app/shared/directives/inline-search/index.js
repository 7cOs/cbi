'use strict';

module.exports =
  function inlineSearch() {
    var directive = {
      restrict: 'EA',
      bindToController: {
        type: '@',
        placeholder: '@',
        input: '=chosenResult',
        callback: '&',
        nav: '@',
        variety: '@',
        isRequired: '@'
      },
      controller: InlineSearchController,
      controllerAs: 'is',
      templateUrl: 'app/shared/directives/inline-search/inline-search.html',
      scope: {},
      link: function(scope, elem, attrs) {}
    };

    /*  @ngInject */
    function InlineSearchController($scope, $timeout, $filter, searchService, $location) {

      // ****************
      // CONTROLLER SETUP
      // ****************

      // Initial variables
      var vm = this;

      // Defaults
      vm.input = '';
      vm.showResults = false;
      vm.loading = false;
      vm.type = '';

      // Expose public methods
      vm.action = action;
      vm.resultChosen = resultChosen;
      vm.close = close;
      vm.onKeypress = onKeypress;

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
        vm.type = type;

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
          if (vm.type === 'product') {
            var products = [];
            angular.forEach(data, function(value, key) {
              if (value.type === vm.variety) {
                products.push(value);
              }
            });
            vm.results = products;
          } else {
            vm.results = data;
          };
        }, function(reason) {
          vm.loading = false;
          vm.errorMessage = reason;
        });
      }

      function resultChosen(result, nav) {
        if (vm.type === 'user') {
          vm.input = $filter('titlecase')(result.firstName) + ' ' + $filter('titlecase')(result.lastName);
        } else { vm.input = result; };

        if (nav) {
          // We'll need to pass result for filtering once Accounts is integrated
          $location.url('/accounts');
        }
        vm.callback({result: result});
        vm.chosenResult = result;
        close();
      }

      function close(clear) {
        if (clear) {
          vm.input = '';
        }
        vm.showResults = false;
      }

      function onKeypress(event) {
        // If enter key, submit search
        if (event.charCode == 13) {
          vm.action(vm.type);
        }
      }
    }

    return directive;
  };
