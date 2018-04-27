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

  describe('[removeFromFilterService]', function() {
    var myAccountsOnlyChip = {
      applied: false,
      name: 'My Accounts Only',
      removable: true,
      type: 'myAccountsOnly'
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
      filtersService.resetFilters();
    });

    describe('disableFilters behavior', function() {
      beforeEach(function() {
        chipsService.model = angular.copy(chipsTemplate);
        spyOn(filtersService, 'disableFilters').and.callFake(function() {
          return true;
        });
      });

      it('should call disable filters if myAccountsOnly chip is removed from set of default chips', function() {
        expect(filtersService.disableFilters.calls.count()).toEqual(0);
        expect(filtersService.disableFilters).not.toHaveBeenCalled();

        chipsService.removeFromFilterService(myAccountsOnlyChip);

        expect(filtersService.disableFilters.calls.count()).toEqual(1);
        expect(filtersService.disableFilters).toHaveBeenCalledWith(false, false, false, false);
      });

      it('should call disable filters when a chip is removed', function() {
        var chip = {
          applied: false,
          name: 'Open',
          removable: true,
          search: true,
          tradeChannel: false,
          type: 'opportunityStatus'
        };

        chipsService.model.push(chip);

        expect(filtersService.disableFilters.calls.count()).toEqual(0);
        expect(filtersService.disableFilters).not.toHaveBeenCalled();

        chipsService.removeFromFilterService(chip);

        expect(filtersService.disableFilters.calls.count()).toEqual(1);
        expect(filtersService.disableFilters).toHaveBeenCalledWith(false, false, true, false);
      });
    });

    describe('handling different chip types', function() {
      it('should remove selected filter given "myAccountsOnly" chip', function() {
        expect(filtersService.model.selected['myAccountsOnly']).toEqual(true);

        chipsService.removeFromFilterService(myAccountsOnlyChip);

        expect(filtersService.model.selected['myAccountsOnly']).toEqual(false);
      });

      it('should remove selected filter given "simpleDistributionType" chip', function() {
        filtersService.model.selected.simpleDistributionType = true;

        chipsService.removeFromFilterService({type: 'simpleDistributionType', name: 'Simple'});

        expect(filtersService.model.selected.simpleDistributionType).toEqual(false);
      });

      it('should remove selected filter and update filter model given "salesStatus" chip', function() {
        filtersService.model.selected.salesStatus = ['Unsold', 'Sold'];
        filtersService.model.salesStatusSold = true;
        filtersService.model.salesStatusUnsold = true;

        chipsService.removeFromFilterService({type: 'salesStatus', name: 'Sold'});

        expect(filtersService.model.selected.salesStatus).toEqual(['Unsold']);
        expect(filtersService.model.salesStatusSold).toEqual(false);
        expect(filtersService.model.salesStatusUnsold).toEqual(true);
      });

      it('should remove selected filter and update filter model given "segmentation" chip', function() {
        filtersService.model.selected.segmentation = ['A', 'B'];
        filtersService.model.storeSegmentationA = true;
        filtersService.model.storeSegmentationB = true;

        chipsService.removeFromFilterService({type: 'segmentation', name: 'Segment A'});

        expect(filtersService.model.selected.segmentation).toEqual(['B']);
        expect(filtersService.model.storeSegmentationA).toEqual(false);
        expect(filtersService.model.storeSegmentationB).toEqual(true);
      });

      it('should remove selected filter and update filter model given "impact" chip', function() {
        filtersService.model.selected.impact = ['High', 'Low'];
        filtersService.model.predictedImpactHigh = true;
        filtersService.model.predictedImpactLow = true;

        chipsService.removeFromFilterService({type: 'impact', name: 'High Impact'});

        expect(filtersService.model.selected.impact).toEqual(['Low']);
        expect(filtersService.model.predictedImpactHigh).toEqual(false);
      });

      it('should remove selected filter and update filter model given "cbbdChain" chip', function() {
        filtersService.model.selected.cbbdChain = ['Cbbd', 'Independent'];
        filtersService.model.cbbdChainCbbd = true;
        filtersService.model.cbbdChainIndependent = true;

        chipsService.removeFromFilterService({type: 'cbbdChain', name: 'CBBD Chain'});

        expect(filtersService.model.selected.cbbdChain).toEqual(['Independent']);
        expect(filtersService.model.cbbdChainCbbd).toEqual(false);
        expect(filtersService.model.cbbdChainIndependent).toEqual(true);
      });

      it('should remove selected filter and update filter model given "opportunityStatus" chip', function() {
        filtersService.model.selected.opportunityStatus = ['Open', 'Targeted'];
        filtersService.model.opportunityStatusOpen = true;
        filtersService.model.opportunityStatusTargeted = true;

        chipsService.removeFromFilterService({type: 'opportunityStatus', name: 'Open'});

        expect(filtersService.model.selected.opportunityStatus).toEqual(['Targeted']);
        expect(filtersService.model.opportunityStatusOpen).toEqual(false);
        expect(filtersService.model.opportunityStatusTargeted).toEqual(true);
      });

      it('should remove selected filter and update filter model given "priorityPackage" chip', function() {
        filtersService.model.selected.priorityPackage = ['gaintain', 'impact', 'innovation', 'additional'];
        filtersService.model.priorityPackageGaintain = true;
        filtersService.model.priorityPackageImpact = true;
        filtersService.model.priorityPackageInnovation = true;
        filtersService.model.priorityPackageAdditional = true;

        chipsService.removeFromFilterService({type: 'priorityPackage', name: 'Impact'});

        expect(filtersService.model.selected.priorityPackage).toEqual(['gaintain', 'innovation', 'additional']);
        expect(filtersService.model.priorityPackageGaintain).toBeTruthy();
        expect(filtersService.model.priorityPackageImpact).toBeFalsy();
        expect(filtersService.model.priorityPackageInnovation).toBeTruthy();
        expect(filtersService.model.priorityPackageAdditional).toBeTruthy();
      });

      it('should remove selected filter and update filter model given "priorityPackage" chip, without case sensitivity', () => {
        filtersService.model.selected.priorityPackage = ['InNovatiON', 'aDditional cA'];
        filtersService.model.priorityPackageInnovation = true;
        filtersService.model.priorityPackageAdditional = true;

        chipsService.removeFromFilterService({type: 'priorityPackage', name: 'addiTional Ca'});

        expect(filtersService.model.selected.priorityPackage).toEqual(['InNovatiON']);
        expect(filtersService.model.priorityPackageInnovation).toBeTruthy();
        expect(filtersService.model.priorityPackageAdditional).toBeTruthy();
      });

      it('should remove selected filter and update filter model given "tradeChannel" chip', function() {
        filtersService.model.selected.tradeChannel = ['Drug', 'Mass Merchandiser', 'Grocery'];
        filtersService.model['tradeChannelDrug'] = true;
        filtersService.model['tradeChannelMass Merchandiser'] = true;
        filtersService.model['tradeChannelGrocery'] = true;

        chipsService.removeFromFilterService({type: 'tradeChannel', name: 'Mass Merchandiser'});
        chipsService.removeFromFilterService({type: 'tradeChannel', name: 'Drug'});

        expect(filtersService.model.selected.tradeChannel).toEqual(['Grocery']);
        expect(filtersService.model['tradeChannelDrug']).toEqual(false);
        expect(filtersService.model['tradeChannelMass Merchandiser']).toEqual(false);
        expect(filtersService.model['tradeChannelGrocery']).toEqual(true);
      });

      it('should remove selected filter given "city" chip', function() {
        filtersService.model.selected.city = ['CHICAGO', 'SAN JOSE', 'CHICAGO HEIGHTS'];

        chipsService.removeFromFilterService({type: 'city', name: 'San Jose'});

        expect(filtersService.model.selected.city).toEqual(['CHICAGO', 'CHICAGO HEIGHTS']);
      });

      it('should remove selected filter given "zipCode" chip', function() {
        filtersService.model.selected.zipCode = ['60601', '60602', '60603'];

        chipsService.removeFromFilterService({type: 'zipCode', name: '60602'});

        expect(filtersService.model.selected.zipCode).toEqual(['60601', '60603']);
      });

      it('should remove selected filter and decrement filtersValidCount given "distributor" chip', function() {
        // handle potential duplicate filters
        filtersService.model.selected.distributor = [{type: 'distributor', name: 'some distributor', id: '555111'},
                                                     {type: 'distributor', name: 'some distributor', id: '555222'},
                                                     {type: 'distributor', name: 'some distributor', id: '555222'},
                                                     {type: 'distributor', name: 'some distributor', id: '555333'}];
        filtersService.model.filtersValidCount = 4;

        chipsService.removeFromFilterService({type: 'distributor', name: 'some distributor', id: '555111'});
        expect(filtersService.model.selected.distributor[0].id).toEqual('555222');
        expect(filtersService.model.selected.distributor[1].id).toEqual('555333');
        expect(filtersService.model.filtersValidCount).toEqual(3);
      });

      it('should remove selected filter and decrement filtersValidCount given "account" chip', function() {
        // handle potential duplicate filters
        filtersService.model.selected.account = ['555111', '555111', '555222'];
        filtersService.model.filtersValidCount = 4;

        chipsService.removeFromFilterService({type: 'account', name: 'some account', id: '555111'});

        expect(filtersService.model.selected.account).toEqual(['555222']);
        expect(filtersService.model.filtersValidCount).toEqual(3);
      });

      it('should remove selected filter and decrement filtersValidCount given "subaccount" chip', function() {
        // handle potential duplicate filters
        filtersService.model.selected.subaccount = ['555111', '555111', '555222'];
        filtersService.model.filtersValidCount = 4;

        chipsService.removeFromFilterService({type: 'subaccount', name: 'some subaccount', id: '555111'});

        expect(filtersService.model.selected.subaccount).toEqual(['555222']);
        expect(filtersService.model.filtersValidCount).toEqual(3);
      });

      it('should remove selected filter and decrement filtersValidCount given "store" chip', function() {
        // handle potential duplicate filters
        filtersService.model.selected.store = ['555111', '555111', '555222'];
        filtersService.model.filtersValidCount = 4;

        chipsService.removeFromFilterService({type: 'store', name: 'some store', id: '555111'});

        expect(filtersService.model.selected.store).toEqual(['555222']);
        expect(filtersService.model.filtersValidCount).toEqual(3);
      });

      it('should remove selected filter given "contact" chip', function() {
        // handle potential duplicate filters
        filtersService.model.selected.contact = ['555111', '555111', '555222'];

        chipsService.removeFromFilterService({type: 'contact', name: 'some contact', id: '555111'});

        expect(filtersService.model.selected.contact).toEqual(['555222']);
      });

      it('should remove selected filter given "masterSKU" chip', function() {
        // handle potential duplicate filters
        filtersService.model.selected.masterSKU = ['555111', '555111', '555111', '555222'];

        chipsService.removeFromFilterService({type: 'masterSKU', name: 'some sku', id: '555111'});

        expect(filtersService.model.selected.masterSKU).toEqual(['555222']);
      });

      it('should remove selected filter given "brand" chip', function() {
        // handle potential duplicate filters
        filtersService.model.selected.brand = ['111', '222', '222', '333'];

        chipsService.removeFromFilterService({type: 'brand', name: 'some brand', id: '222'});

        expect(filtersService.model.selected.brand).toEqual(['111', '333']);
      });

      it('should remove selected filter given "opportunityType" chip', function() {
        filtersService.model.selected.opportunityType = ['Low Velocity', 'Non-Buy', 'At Risk'];

        chipsService.removeFromFilterService({type: 'opportunityType', name: 'Low Velocity'});

        expect(filtersService.model.selected.opportunityType).toEqual(['Non-Buy', 'At Risk']);
      });

      it('should remove selected filter and revert to "All Types" when no chips are left and simple distribution type is not selected, given "opportunityType" chip', function() {
        filtersService.model.selected.opportunityType = ['Low Velocity'];

        chipsService.removeFromFilterService({type: 'opportunityType', name: 'Low Velocity'});

        expect(filtersService.model.selected.opportunityType).toEqual(['All Types']);
      });

      it('should remove selected filter and revert to "Non-Buy" when no chips are left and simple distribution type is selected, given "opportunityType" chip', function() {
        filtersService.model.selected.opportunityType = ['At Risk'];
        filtersService.model.selected.simpleDistributionType = true;

        chipsService.removeFromFilterService({type: 'opportunityType', name: 'At Risk'});

        expect(filtersService.model.selected.opportunityType).toEqual(['Non-Buy']);
      });

      it('should remove selected filter given "state" chip', function() {
        chipsService.applyStatesFilter({}, ['WA', 'DC'], 'state');
        expect(filtersService.model.selected['state']).toEqual(['WA', 'DC']);

        chipsService.removeFromFilterService({type: 'state', name: 'WA'});

        expect(filtersService.model.selected['state']).toEqual(['DC']);
      });

      it('should reset the selected.storeFormat model and add an All Formats storeFormat chip when removing a storeFormat type chip', function() {
        chipsService.model = [];
        filtersService.model.selected.storeFormat = 'HISPANIC';
        chipsService.removeFromFilterService({type: 'storeFormat', name: 'Hispanic'});
        expect(filtersService.model.selected.storeFormat).toEqual('');
        expect(chipsService.model).toEqual([{
          name: 'All Formats',
          type: 'storeFormat',
          applied: false,
          removable: false
        }]);

        chipsService.model = [];
        filtersService.model.selected.storeFormat = 'GM';
        chipsService.removeFromFilterService({type: 'storeFormat', name: 'General Market'});
        expect(filtersService.model.selected.storeFormat).toEqual('');
        expect(chipsService.model).toEqual([{
          name: 'All Formats',
          type: 'storeFormat',
          applied: false,
          removable: false
        }]);
      });

      it('should remove my account only', () => {
        filtersService.model.selected = {
          'myAccountsOnly': true
        };

        chipsService.removeFromFilterService({type: 'myAccountsOnly'});

        expect(filtersService.model.selected).toEqual({
          'myAccountsOnly': false
        });
      });

      it('should remove the given feature type', () => {
        filtersService.model.selected = {
          featureType: [
            'Happy Hour',
            'Everyday Low Price'
          ]
        };

        chipsService.removeFromFilterService({
          type: 'featureType',
          name: 'Happy Hour'
        });

        expect(filtersService.model.selected).toEqual({
          featureType: [
            'Everyday Low Price'
          ]
        });
      });

      it('should remove the given item authorization type', () => {
        filtersService.model.selected = {
          itemAuthorizationType: [
            'Brand Mandate',
            'Authorized-Optional (Sell-In)'
          ]
        };

        chipsService.removeFromFilterService({
          type: 'itemAuthorizationType',
          name: 'Authorized-Optional (Sell-In)'
        });

        expect(filtersService.model.selected).toEqual({
          itemAuthorizationType: [
            'Brand Mandate'
          ]
        });
      });

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

      chipsService.applyFilterArr([], {address: '441 N KILBOURN AVE', city: 'CHICAGO', id: '2225231', name: 'CHICAGO BEV SYSTEMS - IL', state: 'IL', zipCode: '60624'}, 'distributor');

      expect(chipsService.model).toEqual([{name: 'Chicago Bev Systems - Il', id: '2225231', type: 'distributor', search: true, applied: false, removable: true, tradeChannel: false}]);
      expect(chipsService.model.length).toEqual(1);
    });

    it('should apply arr filters with a display name and verify no duplicate is added', function() {
      expect(chipsService.model).toEqual([]);

      // call method again with same info to create duplicates
      chipsService.applyFilterArr([], {address: '441 N KILBOURN AVE', city: 'CHICAGO', id: '2225231', name: 'CHICAGO BEV SYSTEMS - IL', state: 'IL', zipCode: '60624'}, 'distributor');
      chipsService.applyFilterArr([], {address: '441 N KILBOURN AVE', city: 'CHICAGO', id: '2225231', name: 'CHICAGO BEV SYSTEMS - IL', state: 'IL', zipCode: '60624'}, 'distributor');

      expect(chipsService.model).toEqual([{name: 'Chicago Bev Systems - Il', id: '2225231', type: 'distributor', search: true, applied: false, removable: true, tradeChannel: false}]);
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

      expect(chipsService.model).toEqual([{name: 'Corona Ex 12pk Can Promo', id: '80013438@228', type: 'masterSKU', search: true, applied: false, removable: true, tradeChannel: false}]);
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
  describe('[applyFilterMulti]', () => {
    describe('opportunityType cases', () => {
      it('should reset back to all types', function() {
        expect(chipsService.model.length).toEqual(0);

        chipsService.applyFilterMulti([[]], ['All Types'], 'opportunityType');

        expect(chipsService.model).toEqual([{name: 'All Opportunity Types', type: 'opportunityType', applied: false, removable: false}]);
      });

      it('should reset back to all types when there is no selection', function() {
        chipsService.applyFilterMulti([[]], [], 'opportunityType');
        expect(chipsService.model).toEqual([{name: 'All Opportunity Types', type: 'opportunityType', applied: false, removable: false}]);
      });

      it('should add the correct chips', function() {
        chipsService.applyFilterMulti([[]], ['Non-Buy', 'At Risk'], 'opportunityType');
        expect(chipsService.model).toEqual([{name: 'Non-Buy', type: 'opportunityType', applied: false, removable: true}, {name: 'At Risk', type: 'opportunityType', applied: false, removable: true}]);
        expect(filtersService.model.selected['opportunityType']).toEqual(['Non-Buy', 'At Risk']);
      });

      it('should not allow all types with other options', function() {
        chipsService.applyFilterMulti([[]], ['All Types', 'At Risk'], 'opportunityType');
        expect(chipsService.model[0].name).not.toEqual('All Types');
        expect(chipsService.model[0].name).toEqual('At Risk');
      });
    });

    describe('featureType cases', () => {
      it('should reset back to all types', () => {
        chipsService.model = [];
        chipsService.applyFilterMulti([[]], ['All Types'], 'featureType');

        expect(chipsService.model).toEqual([
          {
            name: 'All Feature Product Types',
            type: 'featureType',
            applied: false,
            removable: true
          }
        ]);
      });

      it('should stay to nothing when there is no selection', () => {
        chipsService.model = [];
        chipsService.applyFilterMulti([[]], [], 'featureType');

        expect(chipsService.model).toEqual([]);
      });

      it('should add the correct chips', () => {
        chipsService.applyFilterMulti([[]], ['Happy Hour', 'Limited Time Only'], 'featureType');
        expect(chipsService.model).toEqual([
          {
            name: 'Happy Hour',
            type: 'featureType',
            applied: false,
            removable: true
          },
          {
            name: 'Limited Time Only',
            type: 'featureType',
            applied: false,
            removable: true
          }
        ]);
      });

      it('should not allow all types with other options', () => {
        chipsService.applyFilterMulti([[]], ['All Types', 'Beer of the Month'], 'featureType');
        expect(chipsService.model).toEqual([
          {
            name: 'All Feature Product Types',
            type: 'featureType',
            applied: false,
            removable: true
          }
        ]);
      });
    });

    describe('itemAuthorizationType cases', () => {
      it('should reset back to all types', () => {
        chipsService.model = [];
        chipsService.applyFilterMulti([[]], ['All Types'], 'itemAuthorizationType');

        expect(chipsService.model).toEqual([
          {
            name: 'All Authorized Product Types',
            type: 'itemAuthorizationType',
            applied: false,
            removable: true
          }
        ]);
      });

      it('should stay to nothing when there is no selection', () => {
        chipsService.model = [];
        chipsService.applyFilterMulti([[]], [], 'itemAuthorizationType');

        expect(chipsService.model).toEqual([]);
      });

      it('should add the correct chips', () => {
        chipsService.applyFilterMulti([[]], ['Brand Mandate', 'Corporate Mandate'], 'itemAuthorizationType');
        expect(chipsService.model).toEqual([
          {
            name: 'Brand Mandate',
            type: 'itemAuthorizationType',
            applied: false,
            removable: true
          },
          {
            name: 'Corporate Mandate',
            type: 'itemAuthorizationType',
            applied: false,
            removable: true
          }
        ]);
      });

      it('should not allow all types with other options', () => {
        chipsService.applyFilterMulti([[]], ['All Types', 'Authorized-Select Planogram'], 'itemAuthorizationType');
        expect(chipsService.model).toEqual([
          {
            name: 'All Authorized Product Types',
            type: 'itemAuthorizationType',
            applied: false,
            removable: true
          }
        ]);
      });
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
