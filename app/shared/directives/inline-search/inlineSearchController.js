'use strict';

module.exports = /*  @ngInject */
  function InlineSearchController($scope, $timeout, $filter, searchService, $location, $document) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Defaults
    if (vm.cacheInput !== true) {
      vm.input = '';
      vm.chosenResultObject = {};
    }
    vm.showResults = false;
    vm.loading = false;
    vm.type = '';
    vm.showSearchIcon = false;
    vm.showLengthError = false;

    // Expose public methods
    vm.action = action;
    vm.resultChosen = resultChosen;
    vm.clearModel = clearModel;
    vm.close = close;
    vm.onKeypress = onKeypress;
    vm.userDataFormat = userDataFormat;
    vm.inputFocused = inputFocused;
    vm.showX = vm.showX || false;

    $scope.$watch(function() { return searchService.model.searchActive; }, function(newVal) {
      if (!newVal) {
        close();
        searchService.setSearchActive(false);
      }
    }, true);

    // **************
    // PUBLIC METHODS
    // **************

    function inputFocused() {
      searchService.setSearchActive(false);
    }

    function action(type) {
      var method;

      if (vm.input.length < 3) {
        vm.showLengthError = true;
        return;
      }

      vm.results = [];
      vm.chosenResult = {};
      vm.errorMessage = null;
      vm.loading = true;
      vm.showResults = true;
      vm.type = type;
      vm.showSearchIcon = true;

      searchService.setSearchActive(true);

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
        } else if (vm.type === 'store') {
          var groupedByState = {};
          angular.forEach(data, function(value, key) {
            if (!groupedByState[value.state]) {
              groupedByState[value.state] = [];
            }
            groupedByState[value.state].push(value);
          });
          vm.results = Object.keys(groupedByState).sort().map(function(key) { return groupedByState[key]; });
        } else {
          vm.results = data;
        }
      }, function(reason) {
        vm.loading = false;
        vm.errorMessage = reason;
      });
    }

    function clearModel() {
      vm.chosenResult = null;
      vm.input = '';
      vm.onRemove();
      vm.showX = false;
    }

    function resultChosen(result, nav) {
      vm.showSearchIcon = false;

      switch (vm.type) {
        case 'user':
          vm.input = result.firstName + ' ' + result.lastName;
          break;
        case 'chain':
        case 'distributor':
        case 'product':
          result.name ? vm.input = result.name : vm.input = result.brand;
          break;
        case 'location':
        case 'store':
          vm.input = result.name;
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
      vm.showX = true;
      vm.chosenResult = result;
      vm.chosenResultObject = result;
      vm.variety === 'manage-collaborators' ? close(true) : close();
      clearPreviousSelection();
      $timeout(function() {
        vm.results = [];
      }, 1000);
    }

    /**
     * Close inline search if clicked anywhere outside the directive
     */
    function clearPreviousSelection() {
      if (typeof vm.multipleRecipients === 'boolean' && vm.multipleRecipients === true) {
        vm.input = '';
      }
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
      } else {
        vm.showLengthError = false;
        vm.showResults = false;
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

    /**
     * Close inline search if clicked anywhere outside the directive
     */
    function onDocumentClick() {
      if (vm.showResults === true) {
        // This $timeout trick is necessary to run the Angular digest cycle as we are using vanilla javascript on click events
        $timeout(function() {
          close();
        });
      }
    }

    function initListeners() {
      $document.on('click', onDocumentClick);
    }

    function activate() {
      initListeners();
    }

    activate();
  };
