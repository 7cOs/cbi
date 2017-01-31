describe('[Services.chipsService]', function() {
  var chipsService, filtersService, $state;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.filters');

    inject(function(_chipsService_, _filtersService_, _$state_) {
      chipsService = _chipsService_;
      filtersService = _filtersService_;
      $state = _$state_;
    });
  });

  var testServiceModelShort = [
    {
      'name': 'My Accounts Only'
    }
  ];

  var testServiceModelZero = [];

  var testServiceModelLong = [
    {
      'name': 'My Accounts Only'
    },
    {
      'name': 'Off-Premise'
    },
    // {
    //   'name': 'Authorized'
    // },
    {
      'name': 'All Types'
    },
    {
      'name': 'restaurant'
    }
  ];

  var testServiceModel = [
    {
      'name': 'My Accounts Only'
    },
    {
      'name': 'Off-Premise'
    },
    // {
    //   'name': 'Authorized'
    // },
    {
      'name': 'All Types'
    }
  ];

  var shuffledServiceModel = [
    {
      'name': 'Off-Premise'
    },
    {
      'name': 'All Types'
    },
    {
      'name': 'My Accounts Only'
    }
    // {
    //   'name': 'Authorized'
    // }
  ];

  it('should exist', function() {
    expect(chipsService).toBeDefined();
  });

  it('it\'s methods should exist', function() {
    expect(chipsService.isDefault).toBeDefined();
    expect(chipsService.addAutocompleteChip).toBeDefined();
    expect(chipsService.addChip).toBeDefined();
    expect(chipsService.addChipsArray).toBeDefined();
    expect(chipsService.applyFilters).toBeDefined();
    expect(chipsService.removeChip).toBeDefined();
    expect(chipsService.removeFromFilterService).toBeDefined();
    expect(chipsService.isDefault).toBeDefined();
    expect(chipsService.updateChip).toBeDefined();
    expect(chipsService.applyFilterArr).toBeDefined();
    expect(chipsService.applyFilterMulti).toBeDefined();
    expect(chipsService.applyStatesFilter).toBeDefined();
  });

  it('should reject a model that does not have 4 chips', function() {
    expect(chipsService.isDefault(testServiceModelShort)).toEqual(false);
    expect(chipsService.isDefault(testServiceModelLong)).toEqual(false);
    expect(chipsService.isDefault(testServiceModelZero)).toEqual(false);

  });

  it('should accept a model with the default order of chips', function() {
    expect(chipsService.isDefault(testServiceModel)).toEqual(true);
  });

  it('should accept a model with a shuffled order of chips', function() {
    expect(chipsService.isDefault(shuffledServiceModel)).toEqual(true);
  });

  describe('method.removeFromFilterService', function() {
    var stateChip = {
      applied: false,
      name: 'WA',
      removable: true,
      type: 'state'
    };
    var myAccountsOnlyChip = {
      applied: false,
      name: 'My Accounts Only',
      removable: true,
      type: 'myAccountsOnly'
    };
    var opportunityStatusChip = {
      applied: false,
      name: 'Open',
      removable: true,
      search: true,
      tradeChannel: false,
      type: 'opportunityStatus'
    };
    var chipsTemplate = [
      {
        'name': 'My Accounts Only',
        'type': 'myAccountsOnly',
        'applied': false,
        'removable': false
      },
      {
        'name': 'Off-Premise',
        'type': 'premiseType',
        'applied': false,
        'removable': false
      },
      {
        'name': 'All Types',
        'type': 'opportunityType',
        'applied': false,
        'removable': false
      }
    ];

    beforeEach(function() {
      chipsService.model = angular.copy(chipsTemplate);
      filtersService.resetFilters();
      spyOn(filtersService, 'disableFilters').and.callFake(function() {
        return true;
      });
    });

    it('should call disable filters if myAccountsOnly chip is removed with default chips', function() {
      expect(filtersService.disableFilters.calls.count()).toEqual(0);
      expect(filtersService.disableFilters).not.toHaveBeenCalled();

      chipsService.removeFromFilterService(myAccountsOnlyChip);

      expect(filtersService.disableFilters.calls.count()).toEqual(1);
      expect(filtersService.disableFilters).toHaveBeenCalledWith(false, false, false, false);
    });

    it('should call disable filters if a new chip is added and then removed', function() {
      expect(filtersService.disableFilters.calls.count()).toEqual(0);
      expect(filtersService.disableFilters).not.toHaveBeenCalled();

      chipsService.model.push(opportunityStatusChip);

      chipsService.removeFromFilterService(opportunityStatusChip);

      expect(filtersService.disableFilters.calls.count()).toEqual(1);
      expect(filtersService.disableFilters).toHaveBeenCalledWith(false, false, true, false);
    });

    it('should reset filtersService model if chip.type is string', function() {
      // my accounts only is the only string
      expect(filtersService.model.selected['myAccountsOnly']).toEqual(true);
      chipsService.removeFromFilterService(myAccountsOnlyChip);
      expect(filtersService.model.selected['myAccountsOnly']).toEqual('');
    });

    it('should reset filtersService model if chip.type is state', function() {
      chipsService.applyStatesFilter({}, ['WA'], 'state');
      expect(filtersService.model.selected['state']).toEqual(['WA']);

      chipsService.removeFromFilterService(stateChip);
      expect(filtersService.model.selected['state']).toEqual([]);
    });

    it('should remove from filterService.model and chipsService.model if chip.type === "segmentation"', function() {
      // scaffold
      var segmentationChip = {
        applied: false,
        name: 'Segment A',
        removable: true,
        search: true,
        tradeChannel: false,
        type: 'segmentation'
      };
      chipsService.model.push(segmentationChip);
      filtersService.model.selected.segmentation = ['A'];
      filtersService.model.storeSegmentationA = true;

      // assert initial conditions
      expect(chipsService.model.length).toEqual(4);
      expect(filtersService.model.selected.segmentation.length).toEqual(1);
      expect(filtersService.model.storeSegmentationA).toEqual(true);

      // run method
      chipsService.removeFromFilterService(segmentationChip);
      // manually remove as this is handled by md
      chipsService.model.splice(3, 1);

      // assert everything is correct
      expect(chipsService.model.length).toEqual(3);
      expect(chipsService.model).toEqual(chipsTemplate);
      expect(filtersService.model.selected.segmentation.length).toEqual(0);
      expect(filtersService.model.storeSegmentationA).toEqual(false);
    });

    it('should remove from filterService.model and chipsService.model if chip.type === "impact"', function() {
      // scaffold
      var impactChip = {
        applied: false,
        name: 'High Impact',
        removable: true,
        search: true,
        tradeChannel: false,
        type: 'impact'
      };
      chipsService.model.push(impactChip);
      filtersService.model.selected.impact = ['High'];
      filtersService.model.predictedImpactHigh = true;

      // assert initial conditions
      expect(chipsService.model.length).toEqual(4);
      expect(filtersService.model.selected.impact.length).toEqual(1);
      expect(filtersService.model.predictedImpactHigh).toEqual(true);

      // run method
      chipsService.removeFromFilterService(impactChip);
      // manually remove as this is handled by md
      chipsService.model.splice(3, 1);

      // assert everything is correct
      expect(chipsService.model.length).toEqual(3);
      expect(chipsService.model).toEqual(chipsTemplate);
      expect(filtersService.model.selected.impact.length).toEqual(0);
      expect(filtersService.model.predictedImpactHigh).toEqual(false);
    });

    it('should remove from filterService.model and chipsService.model if chip.type === "cbbdChain"', function() {
      // scaffold
      var cbbdChip = {
        applied: false,
        name: 'CBBD Chain',
        removable: true,
        search: true,
        tradeChannel: false,
        type: 'cbbdChain'
      };
      var independentChip = {
        applied: false,
        name: 'Independent',
        removable: true,
        search: true,
        tradeChannel: false,
        type: 'cbbdChain'
      };

      chipsService.model.push(cbbdChip);
      chipsService.model.push(independentChip);
      filtersService.model.selected.cbbdChain = ['Cbbd', 'Independent'];
      filtersService.model.cbbdChainCbbd = true;
      filtersService.model.cbbdChainIndependent = true;
      chipsTemplate.push(independentChip);

      // assert initial conditions
      expect(chipsService.model.length).toEqual(5);
      expect(filtersService.model.selected.cbbdChain.length).toEqual(2);
      expect(filtersService.model.cbbdChainCbbd).toEqual(true);
      expect(filtersService.model.cbbdChainIndependent).toEqual(true);

      // run method
      chipsService.removeFromFilterService(cbbdChip);
      // manually remove as this is handled by md
      chipsService.model.splice(3, 1);

      // assert everything is correct
      expect(chipsService.model.length).toEqual(4);
      expect(chipsService.model).toEqual(chipsTemplate);
      expect(filtersService.model.selected.cbbdChain.length).toEqual(1);
      expect(filtersService.model.cbbdChainCbbd).toEqual(false);
      expect(filtersService.model.cbbdChainIndependent).toEqual(true);

      // remove independent
      chipsService.model.splice(3, 1);
    });
    it('should remove a productType chip', function() {
      var productTypeChip = opportunityStatusChip;
      productTypeChip.type = 'productType';
      productTypeChip.search = true;

      chipsService.model.push(productTypeChip);

      chipsService.removeFromFilterService(productTypeChip);

      expect(filtersService.disableFilters.calls.count()).toEqual(1);
      expect(filtersService.disableFilters).toHaveBeenCalledWith(false, false, true, false);
    });
  });

  describe('[addChip]', function() {

    it('should add a chip', function() {
      expect(chipsService.model.length).toEqual(0);
      expect(chipsService.model).toEqual([]);

      chipsService.addChip('On-Premise', 'premiseType', true, false);

      expect(chipsService.model.length).toEqual(1);
      expect(chipsService.model).toEqual([{name: 'On-Premise', type: 'premiseType', applied: false, removable: false}]);
    });

   it('should not add a one-allowed chip', function() {
     chipsService.model = [{name: 'On-Premise', type: 'premiseType', applied: false, removable: false}];
      expect(chipsService.model.length).toEqual(1);
      expect(chipsService.model).toEqual([{name: 'On-Premise', type: 'premiseType', applied: false, removable: false}]);

      chipsService.addChip('On-Premise', 'premiseType', true, false);

      expect(chipsService.model.length).toEqual(1);
      expect(chipsService.model).toEqual([{name: 'On-Premise', type: 'premiseType', applied: false, removable: false}]);
    });

  });
  describe('[applyFilters]', function() {

    it('should reset the page number', function() {
      filtersService.model.appliedFilter.pagination.currentPage = 5;
      expect(filtersService.model.appliedFilter.pagination.currentPage).toEqual(5);
      chipsService.applyFilters();

      expect(filtersService.model.appliedFilter.pagination.currentPage).toEqual(0);
    });

    it('should reset the page number for a target list', function() {
      $state.current.name = 'target-list-detail';
      expect($state.current.name).toEqual('target-list-detail');

      filtersService.model.appliedFilter.pagination.currentPage = 5;
      expect(filtersService.model.appliedFilter.pagination.currentPage).toEqual(5);
      chipsService.applyFilters();

      expect(filtersService.model.appliedFilter.pagination.currentPage).toEqual(0);
    });
  });

  describe('[applyFilterArr]', function() {

    it('should apply arr filters with no display name', function() {
      expect(chipsService.model).toEqual([]);

      chipsService.applyFilterArr(['2225193'], {address: '989 E 149TH ST', id: '2225193', name: 'MANHATTAN BEER DIST LLC - NY (BRONX - S)'});

      expect(chipsService.model).toEqual([{ name: 'Manhattan Beer Dist Llc - Ny (bronx - S)', id: undefined, type: undefined, search: true, applied: false, removable: true, tradeChannel: false }]);
      expect(chipsService.model.length).toEqual(1);
    });

    it('should apply arr filters with a display name', function() {
      expect(chipsService.model).toEqual([]);

      chipsService.applyFilterArr(['2225193'], {address: '989 E 149TH ST', id: '2225193', name: 'MANHATTAN BEER DIST LLC - NY (BRONX - S)'}, 'distributor');

      expect(chipsService.model).toEqual([{name: 'Manhattan Beer Dist Llc - Ny (bronx - S)', id: '2225193', type: 'distributor', search: true, applied: false, removable: true, tradeChannel: false}]);
      expect(chipsService.model.length).toEqual(1);
    });
    it('should apply arr filters for a brand with no display name', function() {
      expect(chipsService.model).toEqual([]);

      chipsService.applyFilterArr([], {brand: 'CORONA EXTRA', brandCode: '228', id: null, name: null, type: 'brand'}, 'brand');

      expect(chipsService.model).toEqual([{ name: 'Corona Extra', id: undefined, type: 'brand', search: true, applied: false, removable: true, tradeChannel: false }]);
      expect(chipsService.model.length).toEqual(1);
    });
    it('should apply arr filters for a MASTER SKU with an ID', function() {
      expect(chipsService.model).toEqual([]);

      chipsService.applyFilterArr([], {brand: 'CORONA EXTRA', brandCode: '228', id: '80013438', name: 'CORONA EX 12PK CAN PROMO', type: 'sku'}, 'masterSKU');

      expect(chipsService.model).toEqual([{name: 'Corona Ex 12pk Can Promo', id: '80013438', type: 'masterSKU', search: true, applied: false, removable: true, tradeChannel: false}]);
      expect(chipsService.model.length).toEqual(1);
    });

    it('should apply arr filters for a MASTER SKU with no ID', function() {
      expect(chipsService.model).toEqual([]);
      filtersService.model.selected = {brand: []};

      chipsService.applyFilterArr([], {brand: 'CORONA EXTRA', brandCode: '228', name: 'CORONA EX 12PK CAN PROMO', type: 'sku'}, 'masterSKU');

      expect(chipsService.model).toEqual([{ name: 'Corona Extra', id: '228', type: 'brand', search: true, applied: false, removable: true, tradeChannel: false }]);
      expect(chipsService.model.length).toEqual(1);
    });

    it('should apply arr filters for a contact', function() {
      expect(chipsService.model).toEqual([]);

      chipsService.applyFilterArr([], {id: '5516', employeeId: '1011729', firstName: 'VINCENT', lastName: 'DANDRAIA', email: 'VINCE.DANDRAIA@CBRANDS.COM'}, 'contact', 'VINCENT DANDRAIA');

      expect(chipsService.model).toEqual([{ name: 'Vincent Dandraia', id: '1011729', type: 'contact', search: true, applied: false, removable: true, tradeChannel: false }]);
      expect(chipsService.model.length).toEqual(1);
    });

    it('should apply arr filters for a tradeChannel', function() {
      expect(chipsService.model).toEqual([]);

      chipsService.applyFilterArr([], 'Grocery', 'tradeChannel');

      expect(chipsService.model).toEqual([{ name: 'Grocery', id: undefined, type: 'tradeChannel', search: true, applied: false, removable: true, tradeChannel: true }]);
      expect(chipsService.model.length).toEqual(1);
    });

    it('should  delete a chip', function() {
      chipsService.model = ['Grocery'];
      expect(chipsService.model).toEqual(['Grocery']);

      chipsService.applyFilterArr(chipsService.model, 'Grocery', 'tradeChannel');

      expect(chipsService.model).toEqual([]);
      expect(chipsService.model.length).toEqual(0);
    });
  });

  describe('[addChipsArray]', function() {
    var sampleArray = [
      {name: 'Off-Premise', type: 'premiseType', applied: true, removable: false},
      {name: 'Targeted', type: 'opportunityStatus', search: true, applied: true, removable: true, tradeChannel: false}
    ];

    it('should add the chips to the service model', function() {
      expect(chipsService.model.length).toEqual(0);

      chipsService.addChipsArray(sampleArray);

      expect(chipsService.model.length).toEqual(2);
      var  correctResult = [{name: 'Off-Premise', type: 'premiseType', applied: true, removable: false}, {name: 'Targeted', type: 'opportunityStatus', search: true, applied: true, removable: true, tradeChannel: false}];
      expect(chipsService.model).toEqual(correctResult);
      expect(chipsService.model.length).toEqual(2);
    });

     it('should remove previous chips', function() {
      var fakeArray = ['array', 'of', 'nothing'];
      chipsService.model = fakeArray;
      chipsService.addChipsArray(sampleArray);
      expect(chipsService.model).not.toEqual(fakeArray);
      expect(chipsService.model.length).toEqual(2);
    });
  });
  describe('[applyFilterMulti]', function() {

    it('should reset back to all types', function() {
      expect(chipsService.model.length).toEqual(0);

      chipsService.applyFilterMulti([[]], ['All Types'], 'opportunityType');

      expect(chipsService.model).toEqual([{name: 'All Types', type: 'opportunityType', applied: false, removable: false}]);
    });

    it('should reset back to all types when there is no selection', function() {
      chipsService.applyFilterMulti([[]], [], 'opportunityType');
      expect(chipsService.model).toEqual([{name: 'All Types', type: 'opportunityType', applied: false, removable: false}]);
    });

    it('should add the correct chips', function() {
      chipsService.applyFilterMulti([[]], ['Non-Buy', 'At Risk'], 'opportunityType');
      expect(chipsService.model).toEqual([{name: 'Non-Buy', type: 'opportunityType', applied: false, removable: true}, {name: 'At Risk', type: 'opportunityType', applied: false, removable: true}]);
      expect(filtersService.model.selected['opportunityType']).toEqual(['Non-Buy', 'At Risk']);
    });

    it('should should not allow all types with other options', function() {
      chipsService.applyFilterMulti([[]], ['All Types', 'At Risk'], 'opportunityType');
      expect(chipsService.model[0].name).not.toEqual('All Types');
    });
  });

  describe('[applyStatesFilter]', function() {

    it('should add states to the selected array', function() {
      filtersService.model.selected.state = [];
      expect(filtersService.model.selected.state.length).toEqual(0);
      expect(filtersService.model.selected.state).toEqual([]);

      chipsService.applyStatesFilter({}, ['AZ', 'CA'], 'state');

      expect(filtersService.model.selected.state.length).toEqual(2);
      expect(filtersService.model.selected.state).toEqual(['AZ', 'CA']);
    });

    it('should add states to the selected array with existing states', function() {
      filtersService.model.selected.state = ['AZ', 'CA'];
      expect(filtersService.model.selected.state.length).toEqual(2);
      expect(filtersService.model.selected.state).toEqual(['AZ', 'CA']);

      chipsService.applyStatesFilter({}, ['WA', 'OR'], 'state');

      expect(filtersService.model.selected.state.length).toEqual(4);
      expect(filtersService.model.selected.state).toEqual(['AZ', 'CA', 'WA', 'OR']);
    });

    it('should add states to the selected array and avoid duplicates', function() {
      filtersService.model.selected.state = [];
      expect(filtersService.model.selected.state.length).toEqual(0);
      expect(filtersService.model.selected.state).toEqual([]);

      chipsService.applyStatesFilter({}, ['CA', 'AZ', 'CA'], 'state');

      expect(filtersService.model.selected.state.length).toEqual(2);
      expect(filtersService.model.selected.state).toEqual(['CA', 'AZ']);
    });

  });
});
