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
        isRequired: '@',
        showAddress: '@'
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
      vm.userDataFormat = userDataFormat;

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
          case 'chain':
            method = 'getChains';
            break;
          case 'location':
            method = 'getLocations';
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
              if (vm.variety === 'sku') {
                if (value.type !== 'package') {
                  products.push(value);
                }
              } else if (vm.variety === 'package') {
                if (value.type !== 'sku') {
                  products.push(value);
                }
              } else if (vm.variety === 'non-brand') {
                if (value.type !== 'brand') {
                  products.push(value);
                }
              } else {
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
        switch (vm.type) {
          case 'user':
            vm.input = $filter('titlecase')(result.firstName) + ' ' + $filter('titlecase')(result.lastName);
            break;
          case 'chain':
          case 'distributor':
          case 'product':
          case 'location':
            vm.input = result.name;
            break;
          case 'store':
            vm.input = result.account;
            break;
          default:
            vm.input = result;
            break;
        }

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
        if (event.charCode === 13) {
          event.preventDefault();
          vm.action(vm.type);
        }
      }

      function userDataFormat(user) {
        if (user) {
          if (user.roles.length > 0) {
            return $filter('titlecase')(user.roles[0]) + ' | ' + $filter('lowercase')(user.email);
          } else {
            return $filter('lowercase')(user.email);
          }
        }
      }
    }

    return directive;
  };
