describe('Unit: opportunitiesService - get opportunities', function() {
  var $httpBackend, opportunitiesService, filtersService, opportunitiesResponseObject, expectedServiceModel;

  beforeEach(function() {
    angular.mock.module('ui.router');
    angular.mock.module('ngMaterial');
    angular.mock.module('cf.common.services');

    inject(function(_$httpBackend_, _opportunitiesService_, _filtersService_) {
      $httpBackend = _$httpBackend_;
      opportunitiesService = _opportunitiesService_;
      filtersService = _filtersService_;
    });

    opportunitiesResponseObject = {
            opportunities: [ {
                id: '0516096_80013460_20170131',
                // test vsYAPercent +100
                depletionsCurrentYearToDate: 5,
                depletionsCurrentYearToDateYA: 0,
                depletionsCurrentYearToDateYAPercent: 0,
                depletionsCurrentYearToDateYAPercentNegative: true,
                store: {
                    // test vsYAPercent -100
                    depletionsCurrentYearToDate: 0,
                    depletionsCurrentYearToDateYA: 2886.8334,
                    depletionsCurrentYearToDateYAPercent: 0,
                    depletionsCurrentYearToDateYAPercentNegative: false,
                    unsold: false,
                    id: '1401904',
                    address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                },
                featureTypeCode: null,
                isChainMandate: 'N',
                isItemAuthorization: 'N',
                isOnFeature: 'N',
                // test chain mandate
                itemAuthorizationCode: 'CM',
                product: {
                    brand: 'CORONA EXTRA'
                }
            }, {
                id: '0516096_80013972_20170131',
                // test vsYAPercent 0
                depletionsCurrentYearToDate: 0,
                depletionsCurrentYearToDateYA: 0,
                depletionsCurrentYearToDateYAPercent: 10,
                depletionsCurrentYearToDateYAPercentNegative: false,
                store: {
                    // test vsYAPercent >999
                    depletionsCurrentYearToDate: 100,
                    depletionsCurrentYearToDateYA: 0.1,
                    depletionsCurrentYearToDateYAPercent: 0,
                    depletionsCurrentYearToDateYAPercentNegative: true,
                    unsold: false,
                    id: '1401904',
                    address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                },
                featureTypeCode: 'OK',
                isChainMandate: 'N',
                isItemAuthorization: 'N',
                isOnFeature: 'Y',
                itemAuthorizationCode: null,
                product: {
                    brand: 'CORONA EXTRA'
                }
            }, {
                id: '0516096_80013981_20170131',
                // test vsYAPercent < -999
                depletionsCurrentYearToDate: 100,
                depletionsCurrentYearToDateYA: -0.1,
                depletionsCurrentYearToDateYAPercent: 0,
                depletionsCurrentYearToDateYAPercentNegative: false,
                store: {
                    // test vsYAPercent standard case
                    depletionsCurrentYearToDate: 100,
                    depletionsCurrentYearToDateYA: -25,
                    depletionsCurrentYearToDateYAPercent: 0,
                    depletionsCurrentYearToDateYAPercentNegative: true,
                    unsold: false,
                    id: '1401904',
                    address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                },
                featureTypeCode: null,
                isChainMandate: 'N',
                isItemAuthorization: 'N',
                isOnFeature: 'N',
                itemAuthorizationCode: null,
                product: {
                    brand: 'CORONA EXTRA'
                }
            }
        ]};
    filtersService.model.selected = {
                myAccountsOnly: true,
                account: [],
                subaccount: [],
                brand: [],
                masterSKU: [],
                cbbdChain: [],
                contact: [],
                city: [],
                currentFilter: '',
                distributor: [],
                impact: [],
                opportunityStatus: [],
                opportunityType: ['All Types'],
                premiseType: 'off',
                productType: [],
                store: [],
                retailer: 'Chain',
                brandSearchText: '',
                storeSearchText: '',
                distributorSearchText: '',
                segmentation: [],
                state: [],
                tradeChannel: [],
                trend: '',
                valuesVsTrend: '',
                zipCode: []
            };
    expectedServiceModel = {
        filterApplied: true,
        opportunityId: null,
        noOpportunitiesFound: false,
        opportunities: [
            {
                id: '0516096_80013460_20170131',
                // test vsYAPercent +100%
                depletionsCurrentYearToDate: 5,
                depletionsCurrentYearToDateYA: 0,
                depletionsCurrentYearToDateYAPercent: '+100%',
                depletionsCurrentYearToDateYAPercentNegative: false,
                store: {
                    // test vsYAPercent -100%
                    depletionsCurrentYearToDate: 0,
                    depletionsCurrentYearToDateYA: 2886.8334,
                    depletionsCurrentYearToDateYAPercent: '-100%',
                    depletionsCurrentYearToDateYAPercentNegative: true,
                    unsold: false,
                    id: '1401904',
                    address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                },
                featureTypeCode: null,
                isChainMandate: 'Y',
                isItemAuthorization: 'Y',
                isOnFeature: 'N',
                itemAuthorizationCode: 'CM',
                product: {
                    brand: 'CORONA EXTRA'
                },
                brands: ['corona extra', 'corona extra', 'corona extra'],
                trend: NaN,
                groupedOpportunities: [{
                    id: '0516096_80013460_20170131',
                    depletionsCurrentYearToDate: 5,
                    depletionsCurrentYearToDateYA: 0,
                    depletionsCurrentYearToDateYAPercent: '+100%',
                    depletionsCurrentYearToDateYAPercentNegative: false,
                    store: {
                        depletionsCurrentYearToDate: 0,
                        depletionsCurrentYearToDateYA: 2886.8334,
                        depletionsCurrentYearToDateYAPercent: '-100%',
                        depletionsCurrentYearToDateYAPercentNegative: true,
                        unsold: false,
                        id: '1401904',
                        address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                    },
                    featureTypeCode: null,
                    isChainMandate: 'Y',
                    isItemAuthorization: 'Y',
                    isOnFeature: 'N',
                    itemAuthorizationCode: 'CM',
                    product: {
                        brand: 'CORONA EXTRA'
                    }
                }, {
                    id: '0516096_80013972_20170131',
                    // test vs YAPercent = 0
                    depletionsCurrentYearToDate: 0,
                    depletionsCurrentYearToDateYA: 0,
                    depletionsCurrentYearToDateYAPercent: 0,
                    depletionsCurrentYearToDateYAPercentNegative: true,
                    store: {
                        // test vsYAPercent >999
                        depletionsCurrentYearToDate: 100,
                        depletionsCurrentYearToDateYA: 0.1,
                        depletionsCurrentYearToDateYAPercent: '+999%',
                        depletionsCurrentYearToDateYAPercentNegative: false,
                        unsold: false,
                        id: '1401904',
                        address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                    },
                    featureTypeCode: 'OK',
                    isChainMandate: 'N',
                    isItemAuthorization: 'N',
                    isOnFeature: 'Y',
                    itemAuthorizationCode: null,
                    product: {
                        brand: 'CORONA EXTRA'
                    }
                }, {
                    id: '0516096_80013981_20170131',
                    // test vs YAPercent < -999
                    depletionsCurrentYearToDate: 100,
                    depletionsCurrentYearToDateYA: -0.1,
                    depletionsCurrentYearToDateYAPercent: '-999%',
                    depletionsCurrentYearToDateYAPercentNegative: true,
                    store: {
                        // test vsYAPercent standard case
                        depletionsCurrentYearToDate: 100,
                        depletionsCurrentYearToDateYA: -25,
                        depletionsCurrentYearToDateYAPercent: '-500.0%',
                        depletionsCurrentYearToDateYAPercentNegative: true,
                        unsold: false,
                        id: '1401904',
                        address: '515 N WESTERN AVE, CHICAGO, IL 606121421'
                    },
                    featureTypeCode: null,
                    isChainMandate: 'N',
                    isItemAuthorization: 'N',
                    isOnFeature: 'N',
                    itemAuthorizationCode: null,
                    product: {
                        brand: 'CORONA EXTRA'
                    }
                }
    ]}]};
  });

  it('to be defined', function() {
      expect(opportunitiesService).toBeDefined();
      expect($httpBackend).toBeDefined();
      expect(filtersService).toBeDefined();
  });

 it('get opportunity headers', function() {

      $httpBackend
      .expect('HEAD', '/v2/opportunities/?limit=20&ignoreDismissed=true&sort=&offset=0&filter=myAccountsOnly%3Atrue%2CpremiseType%3Aoff%2C')
      .respond(200, { data: 'value' }, {'opportunity-count': '28129', 'store-count': '31'});

      opportunitiesService.getOpportunitiesHeaders();

      $httpBackend.flush();
      expect(filtersService.model.appliedFilter.pagination).toEqual({
          currentPage: 0,
          totalPages: 1,
          default: true,
          totalOpportunities: 28129,
          totalStores: '31',
          roundedStores: 40,
          shouldReloadData: false
      });
  });

  it('create opportunity feedback', function() {

      var opportunityId = '1234';
      var opportunityData = {
          type: 'other',
          feedback: 'test feedback 1'
      };

      $httpBackend
      .expect('POST', '/v2/opportunities/' + opportunityId + '/feedback/')
      .respond(200, { feedback: 'test feedback' });

      var returnedPromise = opportunitiesService.createOpportunityFeedback(opportunityId, opportunityData);
      $httpBackend.flush();
      expect(returnedPromise.$$state.value.data).toEqual({feedback: 'test feedback'});
      expect(returnedPromise.$$state.status).toEqual(1);

  });

  it('delete opportunity feedback', function() {

      var opportunityId = '1234';

      $httpBackend
      .expect('DELETE', '/v2/opportunities/' + opportunityId + '/feedback/')
      .respond(200);

      var returnedPromise = opportunitiesService.deleteOpportunityFeedback(opportunityId);
      $httpBackend.flush();
      expect(returnedPromise.$$state.status).toEqual(1);
  });

  it('clearOpportunitiesModel', function() {
    expect(opportunitiesService.clearOpportunitiesModel).toBeDefined();
    opportunitiesService.model = expectedServiceModel;
    expect(opportunitiesService.model.opportunities).toEqual(expectedServiceModel.opportunities);
    opportunitiesService.clearOpportunitiesModel();
    expect(opportunitiesService.model).toEqual({
      noOpportunitiesFound: false,
      opportunities: [],
      filterApplied: false,
      opportunityId: null
    });
  });

  describe('getOpportunities', () => {
    it('get opportunities', () => {
       $httpBackend
         .expect('GET', '/v2/opportunities/?limit=20&sort=&offset=0&ignoreDismissed=true&filter=myAccountsOnly%3Atrue%2CpremiseType%3Aoff%2C')
         .respond(200, opportunitiesResponseObject);

       let opportunities;
       opportunitiesService.getOpportunities().then((opps) => {
         opportunities = opps;
       });

       $httpBackend.flush();
       expect(opportunities).toEqual(opportunitiesResponseObject.opportunities);
    });
  });

  describe('getAndUpdateStoreWithOpportunity', () => {
    it('updates with opportunity properly formatted', () => {
        $httpBackend
          .expect('GET', '/v2/opportunities/' + opportunitiesResponseObject.opportunities[0].id)
          .respond(200, opportunitiesResponseObject.opportunities[0]);

        opportunitiesService.getAndUpdateStoreWithOpportunity(opportunitiesResponseObject.opportunities[0].id);

        $httpBackend.flush();

        expectedServiceModel.opportunities = expectedServiceModel.opportunities.filter(elem => elem.store.id === opportunitiesResponseObject.opportunities[0].store.id);
        expectedServiceModel.opportunities[0].groupedOpportunities = expectedServiceModel.opportunities[0].groupedOpportunities.filter(opportunity => opportunity.id === opportunitiesResponseObject.opportunities[0].id);

        // Removing the extra brands pushed, this "brands" array should have been a set.
        expectedServiceModel.opportunities[0].brands = [expectedServiceModel.opportunities[0].brands[0]];

        expect(opportunitiesService.model.opportunities).toEqual(expectedServiceModel.opportunities);
    });
  });

  describe('getFormattedSingleOpportunity', () => {
    it('get opportunities', () => {
       $httpBackend
         .expect('GET', '/v2/opportunities/123')
         .respond(200, opportunitiesResponseObject.opportunities[0]);

       let opportunity;
       opportunitiesService.getFormattedSingleOpportunity('123').then((opp) => {
         opportunity = opp;
       });

       $httpBackend.flush();
       expect(opportunity).toEqual({
         depletionsCurrentYearToDate: 5,
         depletionsCurrentYearToDateYA: 0,
         depletionsCurrentYearToDateYAPercent: '+100%',
         depletionsCurrentYearToDateYAPercentNegative: false,
         featureTypeCode: null,
         id: '0516096_80013460_20170131',
         isChainMandate: 'Y',
         isItemAuthorization: 'Y',
         isOnFeature: 'N',
         itemAuthorizationCode: 'CM',
         product: {
           brand: 'CORONA EXTRA'
         },
         store: {
           address: '515 N WESTERN AVE, CHICAGO, IL 606121421',
           depletionsCurrentYearToDate: 0,
           depletionsCurrentYearToDateYA: 2886.8334,
           depletionsCurrentYearToDateYAPercent: '-100%',
           depletionsCurrentYearToDateYAPercentNegative: true,
           id: '1401904',
           unsold: false
         }
       });
    });
  });

  describe('getAndUpdateStoresWithOpportunities', () => {
    it('updates with opportunities properly formatted', () => {
        $httpBackend
          .expect('GET', '/v2/opportunities/?limit=20&ignoreDismissed=true&sort=&offset=0&filter=myAccountsOnly%3Atrue%2CpremiseType%3Aoff%2C')
          .respond(200, opportunitiesResponseObject);

        opportunitiesService.getAndUpdateStoresWithOpportunities();

        $httpBackend.flush();
        expect(opportunitiesService.model.opportunities).toEqual(expectedServiceModel.opportunities);
    });
  });

  describe('getFormattedStoresWithOpportunities', () => {
    it('responds with opportunities properly formatted', () => {
        $httpBackend
          .expect('GET', '/v2/opportunities/?limit=20&ignoreDismissed=true&sort=&offset=0&filter=myAccountsOnly%3Atrue%2CpremiseType%3Aoff%2C')
          .respond(200, opportunitiesResponseObject);

        const opportunitiesPromises = opportunitiesService.getFormattedStoresWithOpportunities();

        $httpBackend.flush();
        expect(opportunitiesPromises.$$state.value).toEqual(expectedServiceModel.opportunities);
        expect(opportunitiesService.model.opportunities).toEqual([]);
    });
    it('responds correctly when no opportunities are returned', () => {
        $httpBackend
          .expect('GET', '/v2/opportunities/?limit=20&ignoreDismissed=true&sort=&offset=0&filter=myAccountsOnly%3Atrue%2CpremiseType%3Aoff%2C')
          .respond(200, { opportunities: [] });

        const opportunitiesPromises = opportunitiesService.getFormattedStoresWithOpportunities();

        $httpBackend.flush();
        expect(opportunitiesPromises.$$state.value).toEqual([]);
        expect(opportunitiesService.model.noOpportunitiesFound).toBe(true);
        expect(opportunitiesService.model.opportunities).toEqual([]);
    });
  });

  describe('getFormattedOpportunities', () => {
    it('responds with opportunities properly formatted', () => {
       $httpBackend
         .expect('GET', '/v2/opportunities/?limit=20&sort=&offset=0&ignoreDismissed=true&filter=myAccountsOnly%3Atrue%2CpremiseType%3Aoff%2C')
         .respond(200, opportunitiesResponseObject);

       let opportunities;
       opportunitiesService.getFormattedOpportunities().then((opps) => {
         opportunities = opps;
       });

       $httpBackend.flush();
       expect(opportunities[0]).toEqual(
         {
           depletionsCurrentYearToDate: 5,
           depletionsCurrentYearToDateYA: 0,
           depletionsCurrentYearToDateYAPercent: '+100%',
           depletionsCurrentYearToDateYAPercentNegative: false,
           featureTypeCode: null,
           id: '0516096_80013460_20170131',
           isChainMandate: 'Y',
           isItemAuthorization: 'Y',
           isOnFeature: 'N',
           itemAuthorizationCode: 'CM',
           product: { brand: 'CORONA EXTRA' },
           store: {
              address: '515 N WESTERN AVE, CHICAGO, IL 606121421',
              depletionsCurrentYearToDate: 0,
              depletionsCurrentYearToDateYA: 2886.8334,
              depletionsCurrentYearToDateYAPercent: '-100%',
              depletionsCurrentYearToDateYAPercentNegative: true,
              id: '1401904',
              unsold: false
            }
          }
        );
    });
  });
});
