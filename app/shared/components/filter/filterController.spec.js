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

  describe('[method.appendDoneButton', function() {
    beforeEach(function() {
      spyOn(angular, 'element').and.callThrough();
    });

    it('should call angular.element', function() {
      expect(angular.element).not.toHaveBeenCalled();
      expect(angular.element.calls.count()).toEqual(0);

      ctrl.appendDoneButton();

      expect(angular.element).toHaveBeenCalledWith(document.getElementsByClassName('md-select-menu-container'));
      expect(angular.element.calls.count()).toEqual(1);
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
  });

  describe('[method.applyStates]', function() {
    beforeEach(function() {
      filtersService.model = {
        state: 'WA'
      };

      spyOn(chipsService, 'applyStatesFilter').and.callFake(function() {
        return true;
      });
    });

    it('should apply a state search', function() {

      ctrl.applyStates(filtersService.model.state);

      expect(chipsService.applyStatesFilter).toHaveBeenCalledWith('WA', 'WA', 'state');
    });
  });

  describe('[method.closeDoneButton]', function() {
    beforeEach(function() {
      spyOn(angular, 'element').and.callThrough();
    });

    it('should call angular.element', function() {
      expect(angular.element).not.toHaveBeenCalled();
      expect(angular.element.calls.count()).toEqual(0);

      ctrl.closeDoneButton();

      expect(angular.element).toHaveBeenCalledWith(document.getElementsByClassName('done-btn'));
      expect(angular.element.calls.count()).toEqual(1);
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

    it('should ensure the newServiceName is blank on open', function() {
      ctrl.filtersService.model.newServiceName = 'test';
      ctrl.modalSaveOpportunityFilter();
      expect(ctrl.filtersService.model.newServiceName).toEqual('');
    });
  });

  describe('[method.opportunityStatusSwitch]', function() {
    it('should return false if not "target-list-detail"', function() {
      var test = ctrl.opportunityStatusSwitch();
      expect(test).toEqual(false);
    });
  });

  describe('[method.placeholderSelect]', function() {
    it('should set hintTextPlaceholder', function() {
      expect(ctrl.hintTextPlaceholder).toEqual('Account or Subaccount Name');
      ctrl.placeholderSelect('Test 1');
      expect(ctrl.hintTextPlaceholder).toEqual('Test 1');
      ctrl.placeholderSelect('Test 10');
      expect(ctrl.hintTextPlaceholder).toEqual('Test 10');
    });
  });

  describe('[method.resetFilters]', function() {
    beforeEach(function() {
      spyOn(chipsService, 'resetChipsFilters').and.callFake(function() {
        return true;
      });
      spyOn(filtersService, 'resetFilters').and.callFake(function() {
        return true;
      });
      spyOn(ctrl, 'resetTradeChannels').and.callFake(function() {
        return true;
      });
    });

    it('should call services when initiated', function() {
      expect(chipsService.resetChipsFilters).not.toHaveBeenCalled();
      expect(chipsService.resetChipsFilters.calls.count()).toEqual(0);

      expect(filtersService.resetFilters).not.toHaveBeenCalled();
      expect(filtersService.resetFilters.calls.count()).toEqual(0);

      ctrl.resetFilters();

      expect(chipsService.resetChipsFilters).toHaveBeenCalled();
      expect(chipsService.resetChipsFilters.calls.count()).toEqual(1);

      expect(filtersService.resetFilters).toHaveBeenCalled();
      expect(filtersService.resetFilters.calls.count()).toEqual(1);
    });

    it('should call resetTradeChannels', function() {
      expect(ctrl.resetTradeChannels).not.toHaveBeenCalled();
      expect(ctrl.resetTradeChannels.calls.count()).toEqual(0);

      ctrl.resetTradeChannels();

      expect(ctrl.resetTradeChannels).toHaveBeenCalled();
      expect(ctrl.resetTradeChannels.calls.count()).toEqual(1);
    });
  });

  describe('[method.resetTradeChannels]', function() {
    it('should reset filtersService.model selected on channels if true and str="on"', function() {
      var model = {
        tradeChannelDining: true,
        tradeChannels: {
          on: [
            {label: 'Dining', name: 'Dining', value: '50'},
            {label: 'Bar / Nightclub', name: 'Bar', value: '51'},
            {label: 'Recreation', name: 'Recreation', value: '53'},
            {label: 'Lodging', name: 'Lodging', value: '52'},
            {label: 'Transportation', name: 'Transportation', value: '54'},
            {label: 'Military', name: 'Military', value: '57'},
            {label: 'Other', name: 'Other Trade Channel'}
          ],
          off: [
            {label: 'Grocery', name: 'Grocery', value: '05'},
            {label: 'Convenience', name: 'Convenience', value: '07'},
            {label: 'Drug', name: 'Drug', value: '03'},
            {label: 'Mass Merchandiser', name: 'Merchandiser', value: '08'},
            {label: 'Liquor', name: 'Liquor', value: '02'},
            {label: 'Military', name: 'Military', value: 'MF'},
            {label: 'Recreation', name: 'Recreation', value: '53'},
            {label: 'Other', name: 'Other Trade Channel'}
          ]
        },
        selected: {
          premiseType: 'on'
        }
      };

      filtersService.model = model;

      expect(filtersService.model).toEqual(model);

      ctrl.resetTradeChannels('on');

      expect(filtersService.model.tradeChannelDining).toEqual(false);
      expect(filtersService.model.tradeChannels).toEqual(model.tradeChannels);
      expect(filtersService.model.selected).toEqual(model.selected);
    });

    it('should reset filtersService.model selected on channels if true and no str is specified', function() {
      var model = {
        tradeChannelDining: true,
        tradeChannels: {
          on: [
            {label: 'Dining', name: 'Dining', value: '50'},
            {label: 'Bar / Nightclub', name: 'Bar', value: '51'},
            {label: 'Recreation', name: 'Recreation', value: '53'},
            {label: 'Lodging', name: 'Lodging', value: '52'},
            {label: 'Transportation', name: 'Transportation', value: '54'},
            {label: 'Military', name: 'Military', value: '57'},
            {label: 'Other', name: 'Other Trade Channel'}
          ],
          off: [
            {label: 'Grocery', name: 'Grocery', value: '05'},
            {label: 'Convenience', name: 'Convenience', value: '07'},
            {label: 'Drug', name: 'Drug', value: '03'},
            {label: 'Mass Merchandiser', name: 'Merchandiser', value: '08'},
            {label: 'Liquor', name: 'Liquor', value: '02'},
            {label: 'Military', name: 'Military', value: 'MF'},
            {label: 'Recreation', name: 'Recreation', value: '53'},
            {label: 'Other', name: 'Other Trade Channel'}
          ]
        },
        selected: {
          premiseType: 'on'
        }
      };

      filtersService.model = model;

      expect(filtersService.model).toEqual(model);

      ctrl.resetTradeChannels();

      expect(filtersService.model.tradeChannelDining).toEqual(false);
      expect(filtersService.model.tradeChannels).toEqual(model.tradeChannels);
      expect(filtersService.model.selected).toEqual(model.selected);
    });

    it('should reset filtersService.model selected on channels if true and str="off" is specified. str should also take precident over premiseType', function() {
      var model = {
        tradeChannelGrocery: true,
        tradeChannels: {
          on: [
            {label: 'Dining', name: 'Dining', value: '50'},
            {label: 'Bar / Nightclub', name: 'Bar', value: '51'},
            {label: 'Recreation', name: 'Recreation', value: '53'},
            {label: 'Lodging', name: 'Lodging', value: '52'},
            {label: 'Transportation', name: 'Transportation', value: '54'},
            {label: 'Military', name: 'Military', value: '57'},
            {label: 'Other', name: 'Other Trade Channel'}
          ],
          off: [
            {label: 'Grocery', name: 'Grocery', value: '05'},
            {label: 'Convenience', name: 'Convenience', value: '07'},
            {label: 'Drug', name: 'Drug', value: '03'},
            {label: 'Mass Merchandiser', name: 'Merchandiser', value: '08'},
            {label: 'Liquor', name: 'Liquor', value: '02'},
            {label: 'Military', name: 'Military', value: 'MF'},
            {label: 'Recreation', name: 'Recreation', value: '53'},
            {label: 'Other', name: 'Other Trade Channel'}
          ]
        },
        selected: {
          premiseType: 'on'
        }
      };

      filtersService.model = model;

      expect(filtersService.model).toEqual(model);

      ctrl.resetTradeChannels('off');

      expect(filtersService.model.tradeChannelGrocery).toEqual(false);
      expect(filtersService.model.tradeChannels).toEqual(model.tradeChannels);
      expect(filtersService.model.selected).toEqual(model.selected);
    });

    it('should empty filtersService.model.selected channels', function() {
      filtersService.model.selected = {
        tradeChannel: ['test 1']
      };

      expect(filtersService.model.selected.tradeChannel).toEqual(['test 1']);

      ctrl.resetTradeChannels('on');

      expect(filtersService.model.selected.tradeChannel).toEqual([]);
    });

    it('should reset the chips', function() {
      var model = [{
        'name': 'Merchandiser',
        'type': 'tradeChannel',
        'applied': false,
        'tradeChannel': true,
        'removable': false,
        'search': true
      }];
      chipsService.model = model;

      expect(chipsService.model).toEqual(model);

      ctrl.resetTradeChannels('on');

      expect(chipsService.model).toEqual([]);
    });
  });

  describe('[method.saveFilter]', function() {
    beforeEach(function() {
      spyOn(loaderService, 'openLoader').and.callFake(function() {
        return true;
      });
      spyOn(userService, 'saveOpportunityFilter').and.callFake(function() {
        var deferred = q.defer();
        return deferred.promise;
      });
    });

    it('should call loaderService.openLoader and userService.saveOpportunityFilter', function() {
      expect(loaderService.openLoader).not.toHaveBeenCalled();
      expect(loaderService.openLoader.calls.count()).toEqual(0);
      expect(userService.saveOpportunityFilter).not.toHaveBeenCalled();
      expect(userService.saveOpportunityFilter.calls.count()).toEqual(0);
      expect(ctrl.tempId).toEqual(0);

      ctrl.saveFilter();

      expect(loaderService.openLoader).toHaveBeenCalledWith(true);
      expect(loaderService.openLoader.calls.count()).toEqual(1);
      expect(userService.saveOpportunityFilter).toHaveBeenCalled();
      expect(userService.saveOpportunityFilter.calls.count()).toEqual(1);
      expect(ctrl.tempId).toEqual(1);
    });

    it('should call userService.saveOpportunityFilter', function() {});
  });

  describe('[method.updateFilter]', function() {
    beforeEach(function() {
      spyOn(loaderService, 'openLoader').and.callFake(function() {
        return true;
      });
      spyOn(opportunityFiltersService, 'updateOpportunityFilter').and.callFake(function() {
        var deferred = q.defer();
        return deferred.promise;
      });
    });

    it('should call loaderService.openLoader and opportunityFiltersService.updateOpportunityFilter', function() {
      userService.model.newServiceSelect = 'test 1';
      var chipsDescription = ctrl.getDescriptionForFilter(chipsService.model, filtersService.model);

      expect(loaderService.openLoader).not.toHaveBeenCalled();
      expect(loaderService.openLoader.calls.count()).toEqual(0);
      expect(opportunityFiltersService.updateOpportunityFilter).not.toHaveBeenCalled();
      expect(opportunityFiltersService.updateOpportunityFilter.calls.count()).toEqual(0);

      ctrl.updateFilter();

      expect(loaderService.openLoader).toHaveBeenCalledWith(true);
      expect(loaderService.openLoader.calls.count()).toEqual(1);
      expect(opportunityFiltersService.updateOpportunityFilter).toHaveBeenCalledWith('test 1', 'description', chipsDescription);
      expect(opportunityFiltersService.updateOpportunityFilter.calls.count()).toEqual(1);
    });

    it('should call userService.saveOpportunityFilter', function() {});
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

  describe('[method.opportunityStatusSwitch]', function() {
    it('should return true if "target-list-detail"', function() {
      var test = ctrl.opportunityStatusSwitch();
      expect(test).toEqual(true);
    });
  });
});
