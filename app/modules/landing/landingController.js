'use strict';

module.exports = /*  @ngInject */
  function landingController($rootScope, $state, $filter, $mdSelect, filtersService, chipsService, myperformanceService, userService) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    var vm = this;

    // Set page title for head and nav
    $rootScope.pageTitle = $state.current.title;

    // Expose services to view
    vm.chipsService = chipsService;
    vm.filtersService = filtersService;

    // Expose public methods
    vm.applyFilterArr = chipsService.applyFilterArr;
    vm.applyFilterMulti = chipsService.applyFilterMulti;
    vm.appendDoneButton = appendDoneButton;
    vm.closeDoneButton = closeDoneButton;
    vm.closeSelect = closeSelect;
    vm.isPositive = isPositive;
    vm.findOpportunities = findOpportunities;
    vm.goToSavedFilter = goToSavedFilter;

    // Set values
    vm.greeting = getGreeting();

    init();

    // **************
    // PUBLIC METHODS
    // **************

    function appendDoneButton() {
      // We have to do this so the done button is a sibling of md-select-menu
      angular.element(document.getElementsByClassName('md-select-menu-container'))
        .append('<div class="done-btn">Done</div>').bind('click', function(e) {
          $mdSelect.hide();
        });
    }

    function closeDoneButton() {
      angular.element(document.getElementsByClassName('done-btn')).remove();
    }

    function closeSelect() {
      $mdSelect.hide();
    }

    function isPositive(salesData) {
      if (salesData && typeof salesData === 'string') salesData = Number(salesData);

      if (salesData >= 0 && !isNaN(salesData)) return true;

      return false;
    };

    function findOpportunities() {
      $state.go('opportunities', {
        resetFiltersOnLoad: false
      });
    }

    function goToSavedFilter(ev, filter) {
      filtersService.model.currentFilter = filter;
      filtersService.model.currentFilter.ev = ev;
      filtersService.model.selected.currentFilter = filter.id;

      $state.go('opportunities', {
        resetFiltersOnLoad: false
      });
    }

    // ***************
    // PRIVATE METHODS
    // ***************

    function getGreeting() {
      var myDate = new Date(),
          hrs = myDate.getHours(),
          greet;

      if (hrs < 12) {
        greet = 'Good morning';
      } else if (hrs >= 12 && hrs <= 17) {
        greet = 'Good afternoon';
      } else if (hrs >= 17 && hrs <= 24) {
        greet = 'Good evening';
      }

      var person = $filter('titlecase')(userService.model.currentUser.firstName);

      return greet + ', ' + person + '!';
    }

    function init() {
      userService.getPerformanceSummary(userService.model.currentUser.employeeID).then(function(data) {
        console.log(data);
        vm.performanceData = data;
      });

      userService
        .getOpportunityFilters(userService.model.currentUser.employeeID)
        .then(function(res) {
          vm.savedFilters = res;
        });

      // Set default filters for opportunities widget
      chipsService.resetChipsFilters(chipsService.model);
    }
  };
