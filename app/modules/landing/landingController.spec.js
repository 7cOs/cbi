describe('Unit: landingController', function() {
  var scope, ctrl, $mdSelect, chipsService, filtersService, userService;

  beforeEach(function() {
    // Get Mock Modules
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.filters');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.modules.landing');

    inject(function($rootScope, $controller, _$mdSelect_, _chipsService_, _filtersService_, _userService_) {
      // Create scope
      scope = $rootScope.$new();

      // Get Required Services
      $mdSelect = _$mdSelect_;
      chipsService = _chipsService_;
      filtersService = _filtersService_;
      userService = _userService_;

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
      it('should return true if the data is positive', function() {
        var test = ctrl.isPositive(1);
        expect(test).toEqual('positive');
      });

      it('should return true if the data is 0', function() {
        var test = ctrl.isPositive(0);
        expect(test).toEqual('neutral');
      });

      it('should return false if the data is negative', function() {
        var test = ctrl.isPositive(-1);
        expect(test).toEqual('negative');
      });

      it('should evaluate correctly if a number in string format is passed in', function() {
        var test = ctrl.isPositive('1');
        expect(test).toEqual('positive');

        test = ctrl.isPositive('-1');
        expect(test).toEqual('negative');
      });

      it('should return false if data is NaN', function() {
        var test = ctrl.isPositive('string');
        expect(test).toEqual('negative');
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
