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

      if (!isNaN(salesData)) {
        if (salesData === 0) return 'neutral';
        if (salesData > 0) return 'positive';
      }

      return 'negative';
    };

    function findOpportunities() {
      $state.go('opportunities', {
        resetFiltersOnLoad: false,
        applyFiltersOnLoad: true
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
        // Set specific indexes to account for potential malformed data
        var sortedData = {'performance': [{}, {}, {}, {}, {}]};
        angular.forEach(data.performance, function(item, key) {
          if (item.type === 'Depletions CE') sortedData.performance[0] = item;
          if (item.type === 'Distribution Points - On Premise, Simple') sortedData.performance[1] = item;
          if (item.type === 'Distribution Points - On Premise, Effective') sortedData.performance[2] = item;
          if (item.type === 'Distribution Points - Off Premise, Simple') sortedData.performance[3] = item;
          if (item.type === 'Distribution Points - Off Premise, Effective') sortedData.performance[4] = item;
        });
        vm.performanceData = sortedData;
        console.log(vm.performanceData);

        // display on/off in column if needed
        if ((vm.performanceData.performance[1].measures || vm.performanceData.performance[2].measures) && (vm.performanceData.performance[3].measures || vm.performanceData.performance[4].measures)) {
          vm.performanceData.onPremiseColumn = 'on';
          vm.performanceData.offPremiseColumn = 'off';
        } else {
          vm.performanceData.onPremiseColumn = ' ';
          vm.performanceData.offPremiseColumn = ' ';
        }

        // display time frame for distribution if only on premise, or only off premise
        if ((!vm.performanceData.performance[1].measures || !vm.performanceData.performance[2].measures) && (vm.performanceData.performance[3].measures || vm.performanceData.performance[4].measures)) {
          vm.performanceData.timespan = 'Off Premise';
        } else if ((vm.performanceData.performance[1].measures || vm.performanceData.performance[2].measures) && (!vm.performanceData.performance[3].measures || !vm.performanceData.performance[4].measures)) {
          vm.performanceData.timespan = 'On Premise ';
        } else {
          vm.performanceData.timespan = '';
        }
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
