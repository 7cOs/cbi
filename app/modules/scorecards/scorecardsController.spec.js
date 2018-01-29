import { getDateRangeMock } from '../../models/date-range.model.mock';
import { Observable } from 'rxjs';

describe('Unit: scorecardsController', function() {
  var scope, ctrl, $state, filtersService, userService, title;
  let remodeledDepletion, remodeledDistribution;

  const mockDateRangeService = {
    getDateRanges: () => Observable.of(getDateRangeMock())
  };

  beforeEach(function() {
    // Get Mock Modules
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.modules.scorecards');
    angular.mock.module(($provide) => {
      title = {
        setTitle: () => {}
      };
      $provide.value('title', title);
    });

    inject(function($rootScope, $controller, _$state_, _filtersService_, _userService_) {
      // Create scope
      scope = $rootScope.$new();

      // Get Required Services
      $state = _$state_;
      filtersService = _filtersService_;
      userService = _userService_;

      // Create Controller
      ctrl = $controller('scorecardsController', {$scope: scope, dateRangeService: mockDateRangeService});

      ctrl.depletionSort = {
        sortDescending: false,
        query: 'name'
      };

      ctrl.distributionSort = {
        sortDescending: false,
        query: 'name'
      };

      ctrl.totalDistributions = [{
        timeframe: 'L90',
        distributionsSimple: 46416,
        distributionsSimpleLastYear: 46675,
        distributionsSimpleTrend: -0.5549009105516872,
        distributionsSimpleBU: 102046,
        distributionsSimpleBULastYear: 96405,
        distributionsSimpleBUTrend: 5.851356257455526,
        distributionsEffective: 110453,
        distributionsEffectiveLastYear: 102932,
        distributionsEffectiveTrend: 7.306765631679167,
        distributionsEffectiveBU: 250428,
        distributionsEffectiveBULastYear: 225343,
        distributionsEffectiveBUTrend: 11.131918896970395,
        velocity: null,
        velocityLastYear: null,
        velocityTrend: null,
        planSimple: null,
        planEffective: null,
        timeFrameTotal: {
          simple: '46,416',
          effective: '110,453'
        },
        vsYa: {
          simple: '-259',
          effective: '7,521'
        },
        vsYaPercent: {
          simple: '-0.6',
          effective: '7.3'
        },
        buVsYaPercent: {
          simple: '5.9',
          effective: '11.1'
        },
        percentTotal: {
          simple: '100.0',
          effective: '100.0'
        },
        percentBuTotal: {
          simple: '100.0',
          effective: '100.0'
        }
      }];
    });

    remodeledDepletion = [{
      type: 'Brand',
      name: 'CORONA EXTRA',
      measures: [{
        timeframe: 'MTD',
        depletions: 428034.5903,
        depletionsLastYear: 412412.1286,
        depletionsTrend: 3.788070383146337,
        depletionsBU: 1164684.7138,
        depletionsBULastYear: 1003931.0192,
        depletionsBUTrend: 16.01242431258867,
        plan: null,
        depletionsGap: 16214.251544776063,
        vsPlan: -428034.5903,
        vsPlanPercent: null,
        timeFrameTotal: '428,035',
        vsYa: '15,622',
        vsYaPercent: '3.8',
        buVsYaPercent: '16.0',
        percentTotal: '22.5',
        percentBuTotal: '25.0'
      }, {
        timeframe: 'CYTD',
        depletions: 2129747.4115,
        depletionsLastYear: 2211298.2289,
        depletionsTrend: -3.6879158285477907,
        depletionsBU: 5596694.0338,
        depletionsBULastYear: 5447913.0042,
        depletionsBUTrend: 2.730972933769301,
        plan: null,
        depletionsGap: -78543.29189679534,
        vsPlan: -2129747.4115,
        vsPlanPercent: null,
        timeFrameTotal: '2,129,747',
        vsYa: '-81,551',
        vsYaPercent: '-3.7',
        buVsYaPercent: '2.7',
        percentTotal: '111.8',
        percentBuTotal: '120.3'
      }],
      depletionTotal: 6795723.7303,
      depletionBUTotal: 17703488.646,
      MTD: {
        timeframe: 'MTD',
        depletions: 428034.5903,
        depletionsLastYear: 412412.1286,
        depletionsTrend: 3.788070383146337,
        depletionsBU: 1164684.7138,
        depletionsBULastYear: 1003931.0192,
        depletionsBUTrend: 16.01242431258867,
        plan: null,
        depletionsGap: 16214.251544776063,
        vsPlan: -428034.5903,
        vsPlanPercent: null,
        timeFrameTotal: '428,035',
        vsYa: '15,622',
        vsYaPercent: '3.8',
        buVsYaPercent: '16.0',
        percentTotal: '22.5',
        percentBuTotal: '25.0'
      },
      CYTD: {
        timeframe: 'CYTD',
        depletions: 2129747.4115,
        depletionsLastYear: 2211298.2289,
        depletionsTrend: -3.6879158285477907,
        depletionsBU: 5596694.0338,
        depletionsBULastYear: 5447913.0042,
        depletionsBUTrend: 2.730972933769301,
        plan: null,
        depletionsGap: -78543.29189679534,
        vsPlan: -2129747.4115,
        vsPlanPercent: null,
        timeFrameTotal: '2,129,747',
        vsYa: '-81,551',
        vsYaPercent: '-3.7',
        buVsYaPercent: '2.7',
        percentTotal: '111.8',
        percentBuTotal: '120.3'
      }
    }];

    remodeledDistribution = [{
      type: 'Brand',
      name: 'CORONA EXTRA',
      measures: [{
        timeframe: 'L60',
        distributionsSimple: 10077,
        distributionsSimpleLastYear: 10182,
        distributionsSimpleTrend: -1.0312315851502651,
        distributionsSimpleBU: 25867,
        distributionsSimpleBULastYear: 25754,
        distributionsSimpleBUTrend: 0.43876679350780456,
        distributionsEffective: 39963,
        distributionsEffectiveLastYear: 38021,
        distributionsEffectiveTrend: 5.107703637463508,
        distributionsEffectiveBU: 100879,
        distributionsEffectiveBULastYear: 93655,
        distributionsEffectiveBUTrend: 7.71341626181197,
        velocity: null,
        velocityLastYear: null,
        velocityTrend: null,
        planSimple: null,
        planEffective: null,
        timeFrameTotal: {
          simple: '10,077',
          effective: '39,963'
        },
        vsYa: {
          simple: '-105',
          effective: '1,942'
        },
        vsYaPercent: {
          simple: '-1.0',
          effective: '5.1'
        },
        buVsYaPercent: {
          simple: '0.4',
          effective: '7.7'
        },
        percentTotal: {
          simple: '21.7',
          effective: '36.2'
        },
        percentBuTotal: {
          simple: '25.3',
          effective: '40.3'
        }
      }, {
        timeframe: 'L90',
        distributionsSimple: 10265,
        distributionsSimpleLastYear: 10351,
        distributionsSimpleTrend: -0.8308376002318617,
        distributionsSimpleBU: 26394,
        distributionsSimpleBULastYear: 26219,
        distributionsSimpleBUTrend: 0.6674548991189595,
        distributionsEffective: 42572,
        distributionsEffectiveLastYear: 40583,
        distributionsEffectiveTrend: 4.901066949215189,
        distributionsEffectiveBU: 107545,
        distributionsEffectiveBULastYear: 99820,
        distributionsEffectiveBUTrend: 7.738930074133441,
        velocity: null,
        velocityLastYear: null,
        velocityTrend: null,
        planSimple: null,
        planEffective: null,
        timeFrameTotal: {
          simple: '10,265',
          effective: '42,572'
        },
        vsYa: {
          simple: '-86',
          effective: '1,989'
        },
        vsYaPercent: {
          simple: '-0.8',
          effective: '4.9'
        },
        buVsYaPercent: {
          simple: '0.7',
          effective: '7.7'
        },
        percentTotal: {
          simple: '22.1',
          effective: '38.5'
        },
        percentBuTotal: {
          simple: '25.9',
          effective: '42.9'
        }
      }],
      L60: {
        timeframe: 'L60',
        distributionsSimple: 10077,
        distributionsSimpleLastYear: 10182,
        distributionsSimpleTrend: -1.0312315851502651,
        distributionsSimpleBU: 25867,
        distributionsSimpleBULastYear: 25754,
        distributionsSimpleBUTrend: 0.43876679350780456,
        distributionsEffective: 39963,
        distributionsEffectiveLastYear: 38021,
        distributionsEffectiveTrend: 5.107703637463508,
        distributionsEffectiveBU: 100879,
        distributionsEffectiveBULastYear: 93655,
        distributionsEffectiveBUTrend: 7.71341626181197,
        velocity: null,
        velocityLastYear: null,
        velocityTrend: null,
        planSimple: null,
        planEffective: null,
        timeFrameTotal: {
          simple: '10,077',
          effective: '39,963'
        },
        vsYa: {
          simple: '-105',
          effective: '1,942'
        },
        vsYaPercent: {
          simple: '-1.0',
          effective: '5.1'
        },
        buVsYaPercent: {
          simple: '0.4',
          effective: '7.7'
        },
        percentTotal: {
          simple: '21.7',
          effective: '36.2'
        },
        percentBuTotal: {
          simple: '25.3',
          effective: '40.3'
        }
      },
      L90: {
        timeframe: 'L90',
        distributionsSimple: 10265,
        distributionsSimpleLastYear: 10351,
        distributionsSimpleTrend: -0.8308376002318617,
        distributionsSimpleBU: 26394,
        distributionsSimpleBULastYear: 26219,
        distributionsSimpleBUTrend: 0.6674548991189595,
        distributionsEffective: 42572,
        distributionsEffectiveLastYear: 40583,
        distributionsEffectiveTrend: 4.901066949215189,
        distributionsEffectiveBU: 107545,
        distributionsEffectiveBULastYear: 99820,
        distributionsEffectiveBUTrend: 7.738930074133441,
        velocity: null,
        velocityLastYear: null,
        velocityTrend: null,
        planSimple: null,
        planEffective: null,
        timeFrameTotal: {
          simple: '10,265',
          effective: '42,572'
        },
        vsYa: {
          simple: '-86',
          effective: '1,989'
        },
        vsYaPercent: {
          simple: '-0.8',
          effective: '4.9'
        },
        buVsYaPercent: {
          simple: '0.7',
          effective: '7.7'
        },
        percentTotal: {
          simple: '22.1',
          effective: '38.5'
        },
        percentBuTotal: {
          simple: '25.9',
          effective: '42.9'
        }
      }
    }];

    spyOn(mockDateRangeService, 'getDateRanges').and.callThrough();
  });

  describe('Init', function() {
    it('should expose public methods', function() {
      expect(ctrl.goToAccountDashboard).not.toBeUndefined();
    });
  });

  describe('[Method] getValidValue', function() {
    it('should check for validity', function() {
      var valid = ctrl.getValidValue(5, 2);
      expect(valid).toEqual('5.00');
    });

    it('should reject NaN', function() {
      var valid = ctrl.getValidValue('', 2);
      expect(valid).toEqual('-');
    });
  });

  describe('[Method] vsYAPercent', function() {
    it('should format the value', function() {
      var result = ctrl.vsYAPercent(34, 5, 7);
      expect(result).toEqual('7.0');
    });

    it('should reject null', function() {
      var result = ctrl.vsYAPercent(0, 0, null);
      expect(result).toEqual(0);
    });

    it('should reject null and ty greater than zero', function() {
      var result = ctrl.vsYAPercent(1, 0, null);
      expect(result).toEqual('100.0');
    });
  });

  describe('[Method] toggleSelected', function() {
    it('should set the list and index', function() {
      ctrl.toggleSelected(4, [0, 1]);
      expect(ctrl.selectedList).toEqual([0, 1]);
      expect(ctrl.selectedIndex).toEqual(4);
    });
  });

  describe('[Method] changePremise', function() {
    beforeEach(function() {
      spyOn(userService, 'getPerformanceDistribution').and.callFake(function() {
        return {
          then: function(callback) { return callback(remodeledDistribution); }
        };
      });
    });

    it('should update the distribution', function() {
      ctrl.changePremise();
      expect(userService.model.distribution).toEqual(remodeledDistribution);
    });

    it('should update the distribution with onPremise selected', function() {
      ctrl.distributionRadioOptions.selected.onOffPremise = 'on';
      ctrl.changePremise();
      // not sure if there is actually a way to test this difference. covers a few different lines of statement.
      expect(ctrl.distributionRadioOptions.selected.onOffPremise).toEqual('on');
      expect(userService.model.distribution).toEqual(remodeledDistribution);
    });
  });

  describe('[Method] isPositive', function() {
    it('should check for positivity', function() {
      var positiveCheck = ctrl.isPositive(5);
      expect(positiveCheck).toEqual(true);
    });
    it('should check for negativity', function() {
      var positiveCheck = ctrl.isPositive(-5);
      expect(positiveCheck).toEqual(false);
    });
  });

 describe('[Method] changeDepletionOption', function() {
   it('should update the distribution', function() {
     expect(ctrl.filtersService.lastEndingTimePeriod.depletionValue).toEqual({ name: 'FYTD', displayValue: 'FYTD', v3ApiCode: 'FYTDBDL', id: 6, type: 'year' });
     ctrl.changeDepletionOption('CYTD');
     expect(ctrl.filtersService.lastEndingTimePeriod.depletionValue).toEqual({ name: 'CYTD', displayValue: 'CYTD', v3ApiCode: 'CYTDBDL', id: 5, type: 'year' });
   });
 });

 describe('[Method] changeDepletionScorecard', function() {
   it('should update the depletion with false', function() {
     expect(ctrl.totalRow).toEqual(undefined);
     ctrl.changeDepletionScorecard(false);
     expect(ctrl.totalRow).toEqual({depletions: 0, depletionsLastYear: 0, depletionsBU: 0, depletionsBULastYear: 0, gap: 0, percentTrend: '', percentBUTrend: '', gapVsPlan: 0, percentGapVsPlan: 0, volumePercent: 100, volumeBU: 0, growthPercent: 100, growthBU: 0});
    });

    it('should update the depletion with true', function() {
     expect(ctrl.totalRow).toEqual(undefined);
     ctrl.depletionSelect = true;
     ctrl.depletionRadio = 0;
     ctrl.depletionSelectOptions = [[{name: 'test'}]];
     expect(ctrl.depletionSelect).toEqual(true);
     ctrl.changeDepletionScorecard(true);
     expect(ctrl.totalRow).toEqual({depletions: 0, depletionsLastYear: 0, depletionsBU: 0, depletionsBULastYear: 0, gap: 0, percentTrend: '', percentBUTrend: '', gapVsPlan: 0, percentGapVsPlan: 0, volumePercent: 100, volumeBU: 0, growthPercent: 100, growthBU: 0});
    });
  });

  describe('[Method] updateEndingTimePeriod', function() {
    beforeEach(function() {
      ctrl.filtersService.model.scorecardDistributionTimePeriod = {'year': [{'name': 'L90', 'displayValue': 'L90', displayCode: 'L90 Days', v3ApiCode: 'L90BDL', 'id': 2, '$$hashKey': 'object:37'}], 'month': [{'name': 'L03', 'displayValue': 'L03', displayCode: 'L03 Mth', v3ApiCode: 'L3CM', 'id': 4}]};
      ctrl.filtersService.model.depletionsTimePeriod = {month: [{'name': 'CMTH', 'displayValue': 'Clo Mth', v3ApiCode: 'LCM', 'id': 1, type: 'month'}, { 'name': 'CYTM', 'displayValue': 'CYTM', v3ApiCode: 'CYTM', 'id': 2, type: 'month' }, {'name': 'FYTM', 'displayValue': 'FYTM', v3ApiCode: 'FYTM', 'id': 3, type: 'month'}], year: [{'name': 'MTD', 'displayValue': 'MTD', v3ApiCode: 'CMIPBDL', 'id': 4, type: 'year', '$$hashKey': 'object:81 '}, {'name': 'CYTD', 'displayValue': 'CYTD', v3ApiCode: 'CYTDBDL', 'id': 5, type: 'year', '$$hashKey': 'object:82 '}, {'name': 'FYTD', 'displayValue': 'FYTD', v3ApiCode: 'FYTDBDL', 'id': 6, type: 'year'}]};
    });
    it('should update the time period for year', function() {
      ctrl.filtersService.lastEndingTimePeriod.endingPeriodType = 'year';
      ctrl.updateEndingTimePeriod('year');

      expect(ctrl.distributionSelectOptions.selected).toEqual('L90');
      expect(ctrl.filtersService.model.depletionsTimePeriod['year'][2].name).toEqual('FYTD');
      expect(ctrl.filtersService.lastEndingTimePeriod.depletionValue).toEqual({name: 'FYTD', displayValue: 'FYTD', v3ApiCode: 'FYTDBDL', id: 6, type: 'year'});
    });

      it('should update the time period for month', function() {
      ctrl.filtersService.lastEndingTimePeriod.endingPeriodType = 'month';
      ctrl.updateEndingTimePeriod('month');

      expect(ctrl.distributionSelectOptions.selected).toEqual('L03');
      expect(ctrl.filtersService.model.depletionsTimePeriod['month'][2].name).toEqual('FYTM');
      expect(ctrl.filtersService.lastEndingTimePeriod.timePeriodValue).toEqual({ displayCode: 'L03 Mth', name: 'L03', displayValue: 'L03', v3ApiCode: 'L3CM', id: 4, type: 'month' });
    });
  });

  describe('[Method] updatedSelectionValuesInFilter', function () {
    beforeEach(function() {
      ctrl.filtersService.model.scorecardDistributionTimePeriod = {
        'year': [
          {'name': 'L90', 'displayValue': 'L90', displayCode: 'L90 Days', v3ApiCode: 'L90BDL', 'id': 2, '$$hashKey': 'object:37'}],
        'month': [{'name': 'L03', 'displayValue': 'L03', displayCode: 'L03 Mth', v3ApiCode: 'L3CM', 'id': 4}]};
      ctrl.filtersService.model.depletionsTimePeriod = {
        month: [
          {'name': 'CMTH', 'displayValue': 'Clo Mth', v3ApiCode: 'LCM', 'id': 1, type: 'month'},
          {'name': 'CYTM', 'displayValue': 'CYTM', v3ApiCode: 'CYTM', 'id': 2, type: 'month'},
          {'name': 'FYTM', 'displayValue': 'FYTM', v3ApiCode: 'FYTM', 'id': 3, type: 'month'}],
        year: [
          {'name': 'MTD', 'displayValue': 'MTD', v3ApiCode: 'CMIPBDL', 'id': 4, type: 'year', '$$hashKey': 'object:81 '},
          {'name': 'CYTD', 'displayValue': 'CYTD', v3ApiCode: 'CYTDBDL', 'id': 5, type: 'year', '$$hashKey': 'object:82 '},
          {'name': 'FYTD', 'displayValue': 'FYTD', v3ApiCode: 'FYTDBDL', 'id': 6, type: 'year'},
          {'name': 'CCQTD', 'displayValue': 'Clo Cal Qtr', v3ApiCode: 'CCQTD', 'id': 7, type: 'year'}
        ]};
      ctrl.initialized = true;
      ctrl.depletionSelect = 'FYTD';
      ctrl.depletionSelectDisplayName = 'FYTD';
    });

    it('should update to new selected filter value CCQTD', function() {
      expect(ctrl.depletionSelectDisplayName).toEqual(ctrl.filtersService.model.depletionsTimePeriod['year'][2].displayValue);

      ctrl.updatedSelectionValuesInFilter('year', 'CCQTD', 'L90');

      expect(ctrl.depletionSelectDisplayName).toEqual(ctrl.filtersService.model.depletionsTimePeriod['year'][3].displayValue);
    });
  });

  describe('[Method] changeDistributionTimePeriod', function() {
    it('should update the distribution time period', function() {
      ctrl.changeDistributionTimePeriod('L90');
      expect(ctrl.distributionSelectOptions.selected).toEqual('L90');
      expect(ctrl.filtersService.lastEndingTimePeriod.timePeriodValue).toEqual({ name: 'L90', displayValue: 'L90', displayCode: 'L90 Days', v3ApiCode: 'L90BDL', id: 2, type: 'year' });
    });
  });
  describe('[Method] setDefaultFilterOptions', function() {
    it('should setup for off hier', function() {
      ctrl.userService.model.currentUser = {'personId': 5648, 'employeeID': '1012132', 'srcTypeCd': ['OFF_HIER']};
      ctrl.setDefaultFilterOptions();
      expect(ctrl.distributionRadioOptions.selected.onOffPremise).toEqual('off');
    });
    it('should setup for off hier', function() {
      ctrl.userService.model.currentUser = {'personId': 5648, 'employeeID': '1012132', 'srcTypeCd': ['ON_HIER']};
      ctrl.setDefaultFilterOptions();
      expect(ctrl.distributionRadioOptions.selected.onOffPremise).toEqual('on');
    });
  });

  describe('[Method] goToAccountDashboard', function() {
    var row = {};
    beforeEach(function() {
      row = {
        id: '226',
        name: 'Corona Extra',
        performance: []
      };
      ctrl.distributionRadioOptions.selected.onOffPremise = 'off';
      userService.model.currentUser.srcTypeCd = ['ON_HIER'];

      spyOn($state, 'go').and.callFake(function() {
        return true;
      });
    });

    it('should return false if disabled is true', function() {
      expect(ctrl.goToAccountDashboard(row, true)).toEqual(false);
    });

    it('should go to accounts with brand data when a brand is clicked (depletion)', function() {
      row.depletionTotal = 100000;

      expect($state.go.calls.count()).toEqual(0);

      ctrl.goToAccountDashboard(row, false);

      expect($state.go).toHaveBeenCalledWith('accounts', {
        resetFiltersOnLoad: false,
        applyFiltersOnLoad: true,
        pageData: {
          brandId: row.id,
          brandTitle: row.name,
          premiseType: 'off'
        }
      });
      expect($state.go.calls.count()).toEqual(1);

      expect(filtersService.model.selected.brand).toEqual([row.id]);
      expect(filtersService.model.selected.myAccountsOnly).toEqual(true);
      expect(filtersService.model.selected.opportunityType).toEqual(['All Types']);
      expect(filtersService.model.selected.retailer).toEqual('Chain');
    });

    it('should go to accounts with brand data when a brand is clicked (distribution)', function() {
      expect($state.go.calls.count()).toEqual(0);

      ctrl.goToAccountDashboard(row, false);

      expect($state.go).toHaveBeenCalledWith('accounts', {
        resetFiltersOnLoad: false,
        applyFiltersOnLoad: true,
        pageData: {
          brandId: row.id,
          brandTitle: row.name,
          premiseType: 'off'
        }
      });
      expect($state.go.calls.count()).toEqual(1);

      expect(filtersService.model.selected.brand).toEqual([row.id]);
      expect(filtersService.model.selected.myAccountsOnly).toEqual(true);
      expect(filtersService.model.selected.opportunityType).toEqual(['All Types']);
      expect(filtersService.model.selected.retailer).toEqual('Chain');
    });

    it('should go to accounts when brand total is clicked (distribution)', function() {
      expect($state.go.calls.count()).toEqual(0);

      ctrl.goToAccountDashboard(null, false);

      expect($state.go).toHaveBeenCalledWith('accounts', {
        resetFiltersOnLoad: false,
        applyFiltersOnLoad: true,
        pageData: {
          premiseType: 'off'
        }
      });
      expect($state.go.calls.count()).toEqual(1);

      expect(filtersService.model.selected.myAccountsOnly).toEqual(true);
    });
  });

  describe('[setSortQuery] should update specified table sort query and update the sort order', function() {

    it('should update the sort query for the specified table', function() {
      ctrl.setSortQuery('distributionSort', 'vsYa');
      expect(ctrl.distributionSort).toEqual({
        sortDescending: false,
        query: 'vsYa'
      });
    });

    it('should set the inverse for sortDescending if the new query equals the current one', function() {
      ctrl.setSortQuery('depletionSort', 'name');
      expect(ctrl.depletionSort).toEqual({
        sortDescending: true,
        query: 'name'
      });
    });
  });

  describe('[getFilteredValue] should return the correct values from the current depletion/distribution object', function() {

    it('should return the correct value from the distribution model', function() {
      ctrl.initialized = true;
      ctrl.distributionRadioOptions.selected.placementType = 'simple';
      ctrl.distributionSelectOptions.selected = 'L60';
      const filteredValue1 = ctrl.getFilteredValue('percentTotal', remodeledDistribution[0], 'distribution');
      expect(filteredValue1).toEqual('21.7');
    });

    it('should return the correct value from the depletion model', function() {
      ctrl.initialized = true;
      ctrl.depletionSelect = 'MTD';
      const filteredValue2 = ctrl.getFilteredValue('percentTotal', remodeledDepletion[0], 'depletion');
      expect(filteredValue2).toEqual('22.5');
    });

    it('should return an emptu string when the controller is not done initializing', function() {
      ctrl.initialized = false;
      ctrl.depletionSelect = 'MTD';
      const filteredValue2 = ctrl.getFilteredValue('percentTotal', remodeledDepletion[0], 'depletion');
      expect(filteredValue2).toEqual('');
    });
  });

  describe('[scorecardsFilter] should filter out unnecessary scorecard rows', function() {
    beforeEach(function() {
      ctrl.initialized = true;
      ctrl.depletionSelect = 'FYTD';
    });

    it('should return a callback function', function() {
      expect(ctrl.scorecardsFilter).toEqual(jasmine.any(Function));
    });

    it('should return false given a row of type `Total`', function() {
      const invalidRow = {
        type: 'Total',
        FYTD: { timeFrameTotal: '1,000', vsYa: '1,000' }
      };
      const callback = ctrl.scorecardsFilter('depletion');

      expect(callback(invalidRow)).toEqual(false);
    });

    it('should return false when `timeFrameTotal` and `vsYa` are both equal to `0`', function() {
      const invalidRow = {
        type: 'Brand',
        FYTD: { timeFrameTotal: '0', vsYa: '0' }
      };
      const callback = ctrl.scorecardsFilter('depletion');

      expect(callback(invalidRow)).toEqual(false);
    });

    it('should return false when the `timeFrameTotal` equals `-` and `vsYa` equals `0`', function() {
      const invalidRow = {
        type: 'Brand',
        FYTD: { timeFrameTotal: '-', vsYa: '0' }
      };
      const callback = ctrl.scorecardsFilter('depletion');

      expect(callback(invalidRow)).toEqual(false);
    });

    it('should return true when given a valid row', function() {
      const validRow = {
        type: 'Brand',
        FYTD: { timeFrameTotal: '1,000', vsYa: '1,000' }
      };
      const callback = ctrl.scorecardsFilter('depletion');

      expect(callback(validRow)).toEqual(true);
    });

    it('should return true when given a valid row with vsYa=0', () => {
      const validRow = {
        type: 'Brand',
        FYTD: { timeFrameTotal: '1,000', vsYa: '0' }
      };
      const callback = ctrl.scorecardsFilter('depletion');

      expect(callback(validRow)).toEqual(true);
    });

    it('should return true when given a valid row with timeFrameTotal=0', () => {
      const validRow = {
        type: 'Brand',
        FYTD: { timeFrameTotal: '0', vsYa: '1,000' }
      };
      const callback = ctrl.scorecardsFilter('depletion');

      expect(callback(validRow)).toEqual(true);
    });
  });
});
