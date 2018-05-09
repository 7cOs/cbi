'use strict';
const DateRangeTimePeriod = require('../../enums/date-range-time-period.enum').DateRangeTimePeriod;

module.exports = /*  @ngInject */
  function landingController($rootScope, $state, $filter, $mdSelect, $window, filtersService, chipsService, myperformanceService, userService, title, $timeout) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    const vm = this;

    // Set page title for head and nav
    title.setTitle($state.current.title);

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
    vm.selectPremiseType = selectPremiseType;
    vm.openWebPage = openWebPage;

    // Set values
    vm.greetingName = userService.model.currentUser.firstName;
    vm.fytdDateRange = DateRangeTimePeriod.FYTDBDL;
    vm.l90DateRange = DateRangeTimePeriod.L90BDL;
    vm.savedReportsOpen = false;

    vm.offPremiseLink = 'http://iqweb.cbrands.com:80/MicroStrategy/servlet/mstrWeb?evt=3140&src=mstrWeb.3140&documentID=26B10CE111E83F2B6DCB0080EF35C448&Server=CBIGDC-PMSTK801&Project=Beer%20Analytics&Port=0&share=1';
    vm.onPremiseLink = 'http://iqweb.cbrands.com:80/MicroStrategy/servlet/mstrWeb?evt=3140&src=mstrWeb.3140&documentID=3CBD85BA11E83F3300000080EFF52A6E&Server=CBIGDC-PMSTK801&Project=Beer%20Analytics&Port=0&share=1';
    vm.seBULink = 'http://iqweb.cbrands.com/MicroStrategy/servlet/mstrWeb?evt=3140&src=mstrWeb.3140&documentID=5963EF3511E839BF839E0080EF75A4F5&Server=CBIGDC-PMSTK801&Project=Beer%20Analytics&Port=0&share=1';
    vm.otherBULink = 'http://iqweb.cbrands.com/MicroStrategy/servlet/mstrWeb?evt=3140&src=mstrWeb.3140&documentID=C09BCE9711E70FE151AE0080EF659C93&Server=CBIGDC-PMSTK801&Project=Beer%20Analytics&Port=0&share=1';

    vm.salesCompassCard = {
      image: 'product',
      title: 'Sales Priority Spotlight'
    };
    vm.enhancementCompassCard = {
      image: 'tool',
      title: 'Compass Enhancements',
      mainActionName: 'View job aides',
      webPage: 'https://constel1.sharepoint.com/sites/goldnetwork/SitePages/Learning%20and%20Development.aspx?'
    };

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
      vm.savedReportsOpen = false;
      filtersService.model.currentFilter = filter;
      filtersService.model.currentFilter.ev = ev;
      filtersService.model.selected.currentFilter = filter.id;

      $state.go('opportunities', {
        resetFiltersOnLoad: false
      });
    }

    function selectPremiseType(data) {
      if ((!data.performance[1].measures || !data.performance[2].measures) && (data.performance[3].measures || data.performance[4].measures)) {
        data.timespan = 'Off Premise';
        data.distribution = 'offPremise';
        data.offPremiseColumn = ' ';

      } else if ((data.performance[1].measures || data.performance[2].measures) && (!data.performance[3].measures || !data.performance[4].measures)) {
        data.timespan = 'On Premise ';
        data.distribution = 'onPremise';
        data.onPremiseColumn = ' ';

      } else {
        data.timespan = '';
        data.distribution = 'allPremise';
        data.onPremiseColumn = 'on';
        data.offPremiseColumn = 'off';
      }
      return data;
    }

    function openWebPage(webLink) {
      $window.open(webLink, '_blank');
    }

    // ***************
    // PRIVATE METHODS
    // ***************

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

        vm.performanceData = selectPremiseType(sortedData);
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
