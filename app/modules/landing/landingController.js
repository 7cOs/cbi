'use strict';
const DateRangeTimePeriod = require('../../enums/date-range-time-period.enum').DateRangeTimePeriod;

module.exports = /*  @ngInject */
  function landingController($rootScope, $state, $filter, $mdSelect, $window, filtersService, chipsService, myperformanceService, userService, title, $timeout) {

    // ****************
    // CONTROLLER SETUP
    // ****************

    // Initial variables
    const vm = this;
    const goToSavedFilterTimeoutLength = 500;

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

    vm.tooltip = {
      title: 'Premier "Fast Start" Dashboards',
      descriptions: [
        'Incentive Tracking',
        'Use this to get an at-a-glance view of whether your BU is meeting the incentive targets.',
        'GM/MDM Opportunities',
        'Use this to see Premier 2018 distribution vs CL in 2017 at the GM and MDM levels.  Also use this to see where we have CX placements (for a greater number of opportunities vs CL), but no Premier or where Premier has already been sold in.  Opportunities can be exported (see job aid) and used as a starting point for building a Target List in Compass.'],
      position: 'below'
    };

    vm.salesCompassCard = {
      image: 'product',
      title: 'Sales Priority Spotlight',
      mainActionName: 'GET MORE INFORMATION',
      webPage: 'https://constel1.sharepoint.com/sites/goldnetwork/SitePages/Learning%20and%20Development.aspx?'
    };

    vm.enhancementCompassCard = {
      image: 'tool',
      title: 'Compass Enhancements',
      mainActionName: 'View job aides',
      webPage: 'https://constel1.sharepoint.com/sites/goldnetwork/SitePages/General%20Information.aspx?RootFolder=%2Fsites%2Fgoldnetwork%2FGeneral%20Information%20Documents%2FCorona%20Premier%20Fast%20Start&FolderCTID=0x0120009A7F0B58AFC54C4F9822FBDA90FBAB61&View=%7BC8268790-72D5-453C-B2FB-27A6DFC93F7C%7D'
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

      $timeout(() => {
        $state.go('opportunities', {
          resetFiltersOnLoad: false
        });
      }, goToSavedFilterTimeoutLength);
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
