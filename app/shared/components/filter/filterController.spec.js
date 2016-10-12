describe('Unit: filter controller (opportunities)', function() {
  var scope, ctrl, mdDialog, mdSelect, q, state, chipsService, loaderService, filtersService, opportunityFiltersService, userService;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.filter');

    inject(function($controller, _$mdDialog_, _$mdSelect_, _$q_, $rootScope, _chipsService_, _filtersService_, _loaderService_, _opportunityFiltersService_, _userService_) {
      scope = $rootScope.$new();
      q = _$q_;
      state = {
        current: {
          name: 'opportunities'
        }
      };

      mdDialog = _$mdDialog_;
      mdSelect = _$mdSelect_;

      chipsService = _chipsService_;
      filtersService = _filtersService_;
      loaderService = _loaderService_;
      opportunityFiltersService = _opportunityFiltersService_;
      userService = _userService_;

      ctrl = $controller('filterController', {$scope: scope, $state: state});
    });
  });

  it('should expose needed services', function() {
    expect(ctrl.chipsService).not.toBeUndefined();
    expect(typeof (ctrl.chipsService)).toEqual('object');

    expect(ctrl.filtersService).not.toBeUndefined();
    expect(typeof (ctrl.filtersService)).toEqual('object');

    expect(ctrl.userService).not.toBeUndefined();
    expect(typeof (ctrl.userService)).toEqual('object');
  });

  it('should not expose unneeded services', function() {
    expect(ctrl.loaderService).toBeUndefined();
    expect(ctrl.opportunityFiltersService).toBeUndefined();
  });

  it('should set default vars', function() {
    expect(ctrl.hintTextPlaceholder).toEqual('Account or Subaccount Name');
  });

  describe('init opportunities filter (state = opportunities)', function() {
    it('should set opportunities to false if state is not "target-list-detail"', function() {
      expect(ctrl.opportunities).toEqual(false);
    });
  });

  describe('[method.applyLocations]', function() {
    beforeEach(function() {
      filtersService.model = {
        selected: {
          city: 'Denver',
          state: 'CO',
          zipCode: 80202
        },
        location: 'test'
      };

      spyOn(chipsService, 'applyFilterArr').and.callFake(function() {
        return true;
      });
    });

    it('should call apply locations with zip', function() {
      // set up
      var result = {
        name: 'test',
        type: 'zipcode'
      };

      // execute
      ctrl.applyLocations(result);

      // assert
      expect(chipsService.applyFilterArr).toHaveBeenCalledWith(80202, 'test', 'zipCode');
    });

    it('should call apply locations with city', function() {
      var result = {
        name: 'test',
        type: 'city'
      };

      ctrl.applyLocations(result);

      expect(chipsService.applyFilterArr).toHaveBeenCalledWith('Denver', 'test', 'city');
    });

    it('should call apply locations with state', function() {
      var result = {
        name: 'test',
        type: 'state'
      };

      ctrl.applyLocations(result);

      expect(chipsService.applyFilterArr).toHaveBeenCalledWith('CO', 'test', 'state');
    });

    it('should reset filter.model.location', function() {
      var result = {
        name: 'test',
        type: 'state'
      };

      ctrl.applyLocations(result);

      expect(filtersService.model.location).toEqual('');
    });
  });

  describe('[method.closeModal]', function() {
    beforeEach(function() {
      spyOn(mdDialog, 'hide').and.callFake(function() {
        return true;
      });
    });

    it('should call mdDialog.hide', function() {
      ctrl.closeModal();

      expect(mdDialog.hide).toHaveBeenCalled();
      expect(mdDialog.hide.calls.count()).toEqual(1);
    });
  });

  describe('[method.closeSelect]', function() {
    beforeEach(function() {
      spyOn(mdSelect, 'hide').and.callFake(function() {
        return true;
      });
    });

    it('should call mdSelect.hide', function() {
      ctrl.closeSelect();

      expect(mdSelect.hide).toHaveBeenCalled();
      expect(mdSelect.hide.calls.count()).toEqual(1);
    });
  });

});

describe('Unit: filter controller (state = target-list-detail)', function() {
  var scope, ctrl, state;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.components.filter');

    inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      state = {
        current: {
          name: 'target-list-detail'
        }
      };

      ctrl = $controller('filterController', {$scope: scope, $state: state});
    });
  });

  describe('init target list details filter', function() {
    it('should set opportunities to true if state is "target-list-detail"', function() {
      expect(ctrl.opportunities).toEqual(true);
    });
  });
});
