describe('Unit: landingController', function() {
  var scope, ctrl, $mdSelect, chipsService, filtersService, userService, $state, $q, title, $timeout, $httpBackend;

  beforeEach(function() {
    // Get Mock Modules
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.filters');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.modules.landing');

    angular.mock.module(($provide) => {
      title = {
        setTitle: () => {}
      };
      $provide.value('title', title);
    });

    inject(function($rootScope, $controller, _$mdSelect_, _chipsService_, _filtersService_, _userService_, _$state_,
      _$q_, _$timeout_, _$httpBackend_) {

      // Create scope
      scope = $rootScope.$new();

      // Get Required Services
      $mdSelect = _$mdSelect_;
      chipsService = _chipsService_;
      filtersService = _filtersService_;
      userService = _userService_;
      $state = _$state_;
      $q = _$q_;
      $timeout = _$timeout_;
      $httpBackend = _$httpBackend_;

      // Create Controller
      ctrl = $controller('landingController', {$scope: scope});
    });
  });

  // Basic Assertions
  it('should expose public services', function() {
    expect(ctrl.chipsService).not.toBeUndefined();
    expect(typeof (ctrl.chipsService)).toEqual('object');
    expect(ctrl.filtersService).not.toBeUndefined();
    expect(typeof (ctrl.filtersService)).toEqual('object');
  });

  it('should not expose private services', function() {
    expect(ctrl.userService).toBeUndefined();
  });

  it('should have access to private services', function() {
    expect(chipsService).not.toBeUndefined();
    expect(filtersService).not.toBeUndefined();
    expect(userService).not.toBeUndefined();
  });

  it('should expose public methods', function() {
    expect(ctrl.appendDoneButton).not.toBeUndefined();
    expect(ctrl.closeDoneButton).not.toBeUndefined();
    expect(ctrl.closeSelect).not.toBeUndefined();
    expect(ctrl.isPositive).not.toBeUndefined();
    expect(ctrl.selectPremiseType).not.toBeUndefined();
  });

  describe('Public Methods', function() {
    describe('[list.appendDoneButton]', function() {
      beforeEach(function() {
        // Create spy for $mdSelect
        spyOn(angular, 'element').and.callThrough();
      });

      it('should make the done button a sibling of the md-select-menu', function() {
        // Run Function
        ctrl.appendDoneButton();

        // Assert spy was called and called only once
        expect(angular.element).toHaveBeenCalled();
        expect(angular.element.calls.count()).toEqual(1);
      });
    });

    describe('[list.closeDoneButton]', function() {
      beforeEach(function() {
        // Create spy for $mdSelect
        spyOn(angular, 'element').and.callThrough();
      });

      it('should remove the done button', function() {
        // Run Function
        ctrl.closeDoneButton();

        // Assert spy was called and called only once
        expect(angular.element).toHaveBeenCalled();
        expect(angular.element.calls.count()).toEqual(1);
      });
    });

    describe('[list.closeSelect]', function() {
      beforeEach(function() {
        // Create spy for angular.element
        spyOn($mdSelect, 'hide');
      });

      it('should close the select dropdown', function() {
        // Run Function
        ctrl.closeSelect();

        // Assert spy was called and called only once
        expect($mdSelect.hide).toHaveBeenCalled();
        expect($mdSelect.hide.calls.count()).toEqual(1);
      });
    });

    describe('[list.isPositive]', function() {
      it('should return positive if the data is positive', function() {
        var test = ctrl.isPositive(1);
        expect(test).toEqual('positive');
      });

      it('should return neutral if the data is 0', function() {
        var test = ctrl.isPositive(0);
        expect(test).toEqual('neutral');
      });

      it('should return negative if the data is negative', function() {
        var test = ctrl.isPositive(-1);
        expect(test).toEqual('negative');
      });

      it('should evaluate correctly if a number in string format is passed in', function() {
        var test = ctrl.isPositive('1');
        expect(test).toEqual('positive');

        test = ctrl.isPositive('-1');
        expect(test).toEqual('negative');
      });

      it('should return negative if data is NaN', function() {
        var test = ctrl.isPositive('string');
        expect(test).toEqual('negative');
      });
    });

    describe('[landing.selectPremiseType]', function() {
      it('should exist', function() {
        expect(typeof ctrl.selectPremiseType).toEqual('function');
      });
      it('should process data', function() {
        var testPerformanceData,
            testPerformanceDataOnPremise,
            testPerformanceDataOffPremise;

        testPerformanceData = {
          'performance': [{
            'type': 'Depletions CE',
            'id': null,
            'name': null,
            'measures': [{
              'timeframe': 'FYTD',
              'value': 36449586.2076,
              'percentChange': 2.6023321863903712
            }]
          }, {
            'type': 'Distribution Points - On Premise, Simple',
            'id': null,
            'name': null,
            'measures': [{
              'timeframe': 'L90',
              'value': 16709,
              'percentChange': 1.6300711635545282
            }]
          }, {
            'type': 'Distribution Points - On Premise, Effective',
            'id': null,
            'name': null,
            'measures': [{
              'timeframe': 'L90',
              'value': 23348,
              'percentChange': -2.635529608006672
            }]
          }, {
            'type': 'Distribution Points - Off Premise, Simple',
            'id': null,
            'name': null,
            'measures': [{
              'timeframe': 'L90',
              'value': 43105,
              'percentChange': -1.4562662886927895
            }]
          }, {
            'type': 'Distribution Points - Off Premise, Effective',
            'id': null,
            'name': null,
            'measures': [{
              'timeframe': 'L90',
              'value': 113935,
              'percentChange': 3.683784251094306
            }]
          }]
        };

        testPerformanceDataOnPremise = {
          'performance': [{
            'type': 'Depletions CE',
            'id': null,
            'name': null,
            'measures': [{
              'timeframe': 'FYTD',
              'value': 36449586.2076,
              'percentChange': 2.6023321863903712
            }]
          }, {
            'type': 'Distribution Points - On Premise, Simple',
            'id': null,
            'name': null,
            'measures': [{
              'timeframe': 'L90',
              'value': 16709,
              'percentChange': 1.6300711635545282
            }]
          }, {
            'type': 'Distribution Points - On Premise, Effective',
            'id': null,
            'name': null,
            'measures': [{
              'timeframe': 'L90',
              'value': 23348,
              'percentChange': -2.635529608006672
            }]
          }, {
          }, {
          }]
        };

        testPerformanceDataOffPremise = {
          'performance': [{
            'type': 'Depletions CE',
            'id': null,
            'name': null,
            'measures': [{
              'timeframe': 'FYTD',
              'value': 36449586.2076,
              'percentChange': 2.6023321863903712
            }]
          }, {
          }, {
          }, {
            'type': 'Distribution Points - Off Premise, Simple',
            'id': null,
            'name': null,
            'measures': [{
              'timeframe': 'L90',
              'value': 43105,
              'percentChange': -1.4562662886927895
            }]
          }, {
            'type': 'Distribution Points - Off Premise, Effective',
            'id': null,
            'name': null,
            'measures': [{
              'timeframe': 'L90',
              'value': 113935,
              'percentChange': 3.683784251094306
            }]
          }]
        };

        var result = ctrl.selectPremiseType(testPerformanceData);
        var resultOnPremise = ctrl.selectPremiseType(testPerformanceDataOnPremise);
        var resultOffPremise = ctrl.selectPremiseType(testPerformanceDataOffPremise);

        expect(result.distribution).toEqual('allPremise');
        expect(resultOnPremise.distribution).toEqual('onPremise');
        expect(resultOffPremise.distribution).toEqual('offPremise');
      });
    });

    describe('[landing.findOpportunities]', function() {
      it('should exist', function() {
        expect(typeof ctrl.findOpportunities).toEqual('function');
      });

      it('should call $state.go', function() {
        var deferredState = $q.defer();
        spyOn($state, 'go').and.callFake(function() {
          return deferredState.promise;
        });
        ctrl.findOpportunities();
        expect($state.go).toHaveBeenCalled();

      });
    });

    describe('[landing.goToSavedFilter]', () => {
      beforeEach(() => {
        spyOn($state, 'go').and.callFake(() => {
          const deferredState = $q.defer();
          return deferredState.promise;
        });
      });

      it('should exist', () => {
        expect(typeof ctrl.goToSavedFilter).toEqual('function');
      });

      it('should call $state.go', () => {
        ctrl.goToSavedFilter({}, { id: 23423 });

        $httpBackend.expectGET(/.*performance\/summary/).respond([]);
        $httpBackend.expectGET(/.*opportunityFilters\//).respond([]);
        $timeout.flush();

        expect($state.go).toHaveBeenCalled();
      });

      it('should set filter data', () => {
        ctrl.goToSavedFilter({event: 'mouse'}, {id: 23423});

        expect(filtersService.model.currentFilter).toEqual({id: 23423, ev: { event: 'mouse' }});
        expect(filtersService.model.selected.currentFilter).toEqual(23423);
      });
    });
  });

  describe('Private Methods', function() {
    describe('[list.greet]', function() {
      beforeEach(function() {
        // need a better way to test/mock dates
      });

      it('should greet the current user', function() {});
    });

    describe('[list.init]', function() {
      beforeEach(function() {});

      it('should init the controller', function() {});
    });
  });

});
