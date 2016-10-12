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

  describe('[method.expandDropdown]', function() {
    it('shouldnt toggle ctrl.opportunities when state.current.name is "opportunities"', function() {
      expect(ctrl.opportunities).toEqual(false);
      ctrl.expandDropdown();
      expect(ctrl.opportunities).toEqual(false);
    });

    it('should toggle filtersService.model.expanded', function() {
      expect(filtersService.model.expanded).toEqual(false);
      ctrl.expandDropdown();
      expect(filtersService.model.expanded).toEqual(true);
      ctrl.expandDropdown();
      expect(filtersService.model.expanded).toEqual(false);
    });
  });

  describe('[method.hoverState]', function() {
    it('should toggle ctrl.isHoveringReset if icon equals "hover"', function() {
      expect(ctrl.isHoveringReset).toBeUndefined();
      ctrl.hoverState('reset');
      expect(ctrl.isHoveringReset).toEqual(true);
      ctrl.hoverState('reset');
      expect(ctrl.isHoveringReset).toEqual(false);
      ctrl.hoverState('reset');
      expect(ctrl.isHoveringReset).toEqual(true);
    });

    it('should toggle ctrl.isHoveringSave if icon doesnt equal "hover"', function() {
      expect(ctrl.isHoveringSave).toBeUndefined();
      ctrl.hoverState();
      expect(ctrl.isHoveringSave).toEqual(true);
      ctrl.hoverState();
      expect(ctrl.isHoveringSave).toEqual(false);
      ctrl.hoverState();
      expect(ctrl.isHoveringSave).toEqual(true);
    });
  });

  describe('[method.modalSaveOpportunityFilter]', function() {
    beforeEach(function() {
      spyOn(mdDialog, 'show').and.callFake(function() {
        return true;
      });
    });

    it('should open a dialog', function() {
      expect(mdDialog.show).not.toHaveBeenCalled();
      expect(mdDialog.show.calls.count()).toEqual(0);
      ctrl.modalSaveOpportunityFilter();
      expect(mdDialog.show).toHaveBeenCalled();
      expect(mdDialog.show.calls.count()).toEqual(1);
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

  describe('[method.expandDropdown]', function() {
    it('should toggle ctrl.opportunities when state.current.name is "target-list-detail"', function() {
      expect(ctrl.opportunities).toEqual(true);
      ctrl.expandDropdown();
      expect(ctrl.opportunities).toEqual(false);
      ctrl.expandDropdown();
      expect(ctrl.opportunities).toEqual(true);
    });
  });
});
