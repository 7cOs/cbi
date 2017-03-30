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
                showAuthorization: 'Y',
                depletionSum: 0,
                brands: ['corona extra', 'corona extra', 'corona extra'],
                trend: NaN,
                groupedOpportunities: [{
                    depletionsCurrentYearToDate: 5,
                    depletionsCurrentYearToDateYA: 0,
                    depletionsCurrentYearToDateYAPercent: '+100%',
                    depletionsCurrentYearToDateYAPercentNegative: false,
                    store: {
                        depletionsCurrentYearToDate: 0,
                        depletionsCurrentYearToDateYA: 2886.8334,
                        depletionsCurrentYearToDateYAPercent: '-100%',
                        depletionsCurrentYearToDateYAPercentNegative: true,
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
                    showAuthorization: 'Y'
                }, {
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
                    },
                    showAuthorization: ''
                }, {
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
                    },
                    showAuthorization: ''
                }
    ]}]};
  });

    it('to be defined', function() {
        expect(opportunitiesService).toBeDefined();
        expect($httpBackend).toBeDefined();
        expect(filtersService).toBeDefined();
    });

    it('respond with opportunities properly formatted', function() {

        $httpBackend
        .expect('GET', '/api/opportunities/?limit=20&ignoreDismissed=true&sort=&offset=0&filter=myAccountsOnly%3Atrue%2CpremiseType%3Aoff%2C')
        .respond(200, opportunitiesResponseObject);

        opportunitiesService.getOpportunities();

        $httpBackend.flush();
        expect(opportunitiesService.model.opportunities).toEqual(expectedServiceModel.opportunities);
    });

   it('get opportunity headers', function() {

        $httpBackend
        .expect('HEAD', '/api/opportunities/?limit=20&ignoreDismissed=true&sort=&offset=0&filter=myAccountsOnly%3Atrue%2CpremiseType%3Aoff%2C')
        .respond(200, { data: 'value' }, {'opportunity-count': '28129', 'store-count': '31'});

        opportunitiesService.getOpportunitiesHeaders();

        $httpBackend.flush();
        expect(filtersService.model.appliedFilter.pagination).toEqual({
            currentPage: 0,
            totalPages: 2,
            default: true,
            totalOpportunities: '28129',
            totalStores: '31',
            roundedStores: 20
        });
    });

    it('create opportunity feedback', function() {

        var opportunityId = '1234';
        var opportunityData = {
            type: 'other',
            feedback: 'test feedback 1'
        };

        $httpBackend
        .expect('POST', '/api/opportunities/' + opportunityId + '/feedback/')
        .respond(200, { feedback: 'test feedback' });

        var returnedPromise = opportunitiesService.createOpportunityFeedback(opportunityId, opportunityData);
        $httpBackend.flush();
        expect(returnedPromise.$$state.value.data).toEqual({feedback: 'test feedback'});
        expect(returnedPromise.$$state.status).toEqual(1);

    });

    it('delete opportunity feedback', function() {

        var opportunityId = '1234';

        $httpBackend
        .expect('DELETE', '/api/opportunities/' + opportunityId + '/feedback/')
        .respond(200);

        var returnedPromise = opportunitiesService.deleteOpportunityFeedback(opportunityId);
        $httpBackend.flush();
        expect(returnedPromise.$$state.status).toEqual(1);
    });
});
