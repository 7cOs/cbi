describe('[Services.chipsService]', function() {
  var chipsService, filtersService, titlecaseFilter;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('cf.common.services');
    angular.mock.module('cf.common.filters');

    inject(function(_chipsService_, _filtersService_, _titlecaseFilter_) {
      chipsService = _chipsService_;
      filtersService = _filtersService_;
      titlecaseFilter = _titlecaseFilter_;
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
  });
});
