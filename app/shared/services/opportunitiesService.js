module.exports =
  function opportunitiesService($http, $q, productsService, distributorsService) {
    // Temporary Data - Old Data we're currently using in controllers
    var tempData = {
      opportunities: [{
        'id': '123',
        'store': {
          'id': 'dsd82',
          'name': 'Walmart',
          'address': '123 Elm St., San Jose, CA - 88779',
          'segmentation': 'A'
        },
        'impact': 3,
        'opCount': 4,
        'depletionsCYTD': 12657,
        'depletionTrendVsYA': 0.3
      }, {
        'id': '123',
        'store': {
          'id': 'dsd82',
          'name': 'Walgreens',
          'address': '9 Jones st., San Francisco, CA - 98989',
          'segmentation': 'A'
        },
        'impact': 5,
        'opCount': 9,
        'depletionsCYTD': 1002,
        'depletionTrendVsYA': -5
      }, {
        'id': '123',
        'store': {
          'id': 'dsd82',
          'name': 'Circle K',
          'address': '3524 Walden Dr, Santa Clara, CA - 89898',
          'segmentation': 'A'
        },
        'impact': 10,
        'opCount': 25,
        'depletionsCYTD': 78,
        'depletionTrendVsYA': 5
      }, {
        'id': '123',
        'store': {
          'id': 'dsd82',
          'name': 'Circle K',
          'address': '136 Route 4 Boca Raton, CA - 33428',
          'segmentation': 'B'
        },
        'impact': 3,
        'opCount': 8,
        'depletionsCYTD': 20,
        'depletionTrendVsYA': -5
      }, {
        'id': '123',
        'store': {
          'id': 'dsd82',
          'name': 'Redding',
          'address': '35 Chapel Stree Bayonne, CA - 07002',
          'segmentation': 'B'
        },
        'impact': 1,
        'opCount': 1,
        'depletionsCYTD': 10,
        'depletionTrendVsYA': 5
      }],
      products: [
        {id: 0, product: 'Corona LT', detail: '12 Pk -12 oz BT', type: 'At risk', rationale: 'Similar <class of trade> accounts, currently growing SKU at <X%>', status: 'new', predictedImpact: 'high', regionalStatus: 'featured'},
        {id: 1, product: 'Modelo', detail: '12 Pk -12 oz BT', type: 'At risk', rationale: 'Similar <class of trade> accounts, currently growing SKU at <X%>', status: 'new', predictedImpact: 'high', regionalStatus: 'mandatory'},
        {id: 2, product: 'Victoria', detail: '12 Pk -12 oz BT', type: 'Non-buy', rationale: 'Similar <class of trade> accounts, currently growing SKU at <X%>', status: 'new', predictedImpact: 'high', regionalStatus: 'both'},
        {id: 3, product: 'Pacifico', detail: '12 Pk -12 oz BT', type: 'Non-buy', rationale: 'Similar <class of trade> accounts, currently growing SKU at <X%>', status: 'new', predictedImpact: 'low'},
        {id: 4, product: 'N. Modelo', detail: '12 Pk -12 oz BT', type: 'Low Velocity', rationale: 'Similar <class of trade> accounts, currently growing SKU at <X%>', status: 'new', predictedImpact: 'medium'},
        {id: 5, product: 'Corona LT', detail: '12 Pk -12 oz BT', type: 'Low Velocity', rationale: 'Similar <class of trade> accounts, currently growing SKU at <X%>', status: 'new', predictedImpact: 'low'}
      ],
      opportunitiesTypes: [
        {name: 'All Types'},
        {name: 'Non-buy'},
        {name: 'At Risk'},
        {name: 'Low Velocity'},
        {name: 'New Placement (Quality)'},
        {name: 'New Placement (No Rebuy)'},
        {name: 'Manual'}
      ],
      opportunitiesStatus: [
        {name: 'Open'},
        {name: 'Targeted'}
      ],
      savedFilters: [
        {name: 'Wine Shops'},
        {name: 'Costco No Buy'},
        {name: 'Circle K - Fremont'}
      ],
      premises: [
        {name: 'On Premise'},
        {name: 'Off Premise'}
      ],
      // temporary placeholders, will move to more appropriate module soon
      placementType: [
        {name: 'Simple'},
        {name: 'Effective'}
      ],
      timePeriod: [
        {name: 'Current Month to Date'},
        {name: 'Last Closed Month'}
      ],
      brands: productsService.getProducts('http://jsonplaceholder.typicode.com/posts'),
      accounts: [
        {name: 'Walmart', subAccount: 'North East'},
        {name: 'Walmart', subAccount: 'West'},
        {name: 'Walmart', subAccount: 'South'},
        {name: 'Walmart', subAccount: 'East'}
      ],
      distributors: distributorsService.getDistributors('http://jsonplaceholder.typicode.com/posts')
    };

    var filter = {
      placementType: tempData.placementType,
      timePeriod: tempData.timePeriod,
      opportunitiesTypes: tempData.opportunitiesTypes,
      opportunitiesStatus: tempData.opportunitiesStatus,
      brands: tempData.brands,
      accounts: tempData.accounts,
      distributors: tempData.distributors,
      premises: tempData.premises,
      savedFilters: tempData.savedFilters,
      selected: {
        accountScope: false,
        opportunitiesTypes: ''
      },
      expanded: false
    };

    // Temporary Data - Data from API Spec
    var data = {
      opportunitiesGetResponse: {
        'count': 351,
        'storesCount': 42,
        'opportunities': [{
          'id': 'SbBGk',
          'product': {
            'id': '2234gg',
            'name': 'Corona',
            'type': 'package',
            'brand': 'Brand Name',
            'description': 'Product description Lorem ipsum sit dolor amet',
            'price': 12.11,
            'quantity': 233
          },
          'type': ['Non-Buy', 'At Risk', 'Low Velocity', 'New Placement (Quality)', 'New Placement (No Rebuy)', 'Manual'],
          'rank': 1,
          'impact': 'High',
          'status': 'Discussed',
          'rationale': 'Rationale 1',
          'store': {
            'id': 'dsd82',
            'name': 'Store 1',
            'address': '1221 11th St NE, City, ST 12345',
            'premise': true,
            'segmentation': 'A'
          },
          'itemAuthorization': {
            'id': 'jij23',
            'type': 'tbd',
            'subType': 'tbd'
          },
          'currentYTDStoreVolume': 54.11,
          'lastYTDStoreVolume': 29.12,
          'volumeTrend': 32.33,
          'storeVelocity': 50.50,
          'storeDistribution': 12.0,
          'last90DaysVolume': 33.11,
          'lastInvoiceDate': '2016-11-05T13:15:30Z'
        }, {
          'id': 'sdsd12',
          'product': {
            'id': '9878dj',
            'name': 'Budweiser',
            'type': 'package',
            'brand': 'Brand Name',
            'description': 'Product description Lorem ipsum sit dolor amet',
            'price': 12.11,
            'quantity': 233
          },
          'type': ['AtRisk', 'LowVelocity'],
          'rank': 2,
          'impact': 'Medium',
          'status': 'Discussed',
          'rationale': 'Rationale 1',
          'store': {
            'id': 'dsd82',
            'name': 'Store 1',
            'address': '1221 11th St NE, City, ST 12345',
            'premise': true,
            'segmentation': 'B'
          },
          'itemAuthorization': {
            'id': 'jij23',
            'type': 'tbd',
            'subType': 'tbd'
          },
          'currentYTDStoreVolume': 54.11,
          'lastYTDStoreVolume': 29.12,
          'volumeTrend': 32.33,
          'storeVelocity': 50.50,
          'storeDistribution': 12.0,
          'last90DaysVolume': 33.11,
          'lastInvoiceDate': '2016-11-05T13:15:30Z'
        }]
      },
      opportunityGetResponse: this.opportunityGetResponse.opportunities[0],
      opportunitiesPostPayload: {
        'type': 'object',
        '$schema': 'http://json-schema.org/draft-03/schema',
        'id': 'opportunitySchema',
        'required': true,
        'properties': {
          'product': {
            'type': 'string',
            'required': 'true',
            'description': 'Product ID'
          },
          'type': {
            'type': 'array',
            'items': {
              'enum': ['NonBuy', 'LowVelocity', 'AtRisk', 'Manual', 'Other']
            },
            'minItems': 1,
            'uniqueItems': true,
            'required': 'true',
            'description': 'List of types that apply to this opportunity.'
          },
          'rationale': {
            'type': 'string',
            'required': 'false',
            'description': 'Descriptions about why this opportunity is being presented to the user'
          },
          'store': {
            'type': 'string',
            'required': 'true',
            'description': 'Store ID'
          }
        }
      },
      opportunityPutPayload: this.opportunitiesPostPayload,
      opportunitiesPostResponse: this.opportunityGetResponse.opportunities[0],
      opportunityPutResponse: this.opportunityGetResponse.opportunities[0],
      feedbackGetResponse: {
        'id': 'SbBGk',
        'opportunity': '8798hbj',
        'message': 'Lorem ipsum sit dolor amet',
        'user': {
          'id': 'A1B2',
          'firstName': 'Joe',
          'lastName': 'Cerveza',
          'email': 'jCerveza@cbrands.com',
          'phone': '1234567890',
          'role': 'CBBD MDM',
          'accounts': ['Wal-mart', 'PCC']
        }
      },
      feedbackPostPayload: {
        'type': 'object',
        '$schema': 'http://json-schema.org/draft-03/schema',
        'required': 'true',
        'id': 'feedbackSchema',
        'properties': {
          'message': {
            'type': 'string',
            'required': 'true',
            'description': 'The user\'s reasoning for a negative feedback.'
          }
        }
      },
      feedbackPostResponse: {'status': 201},
      feedbackDeletePayload: {}, // Not specified
      feedbackDeleteResponse: {'status': 200}
    };

    return {
      all: function() {
        return tempData.opportunities;
      },
      get: function(id) {
        return tempData[id];
      },
      model: function() {
        return filter;
      },

      getOpportunities: getOpportunities,
      createOpportunity: createOpportunity,
      updateOpportunity: updateOpportunity,
      getOpportunitiyFeedback: getOpportunityFeedback,
      createOpportunityFeedback: createOpportunityFeedback,
      deleteOpportunityFeedback: deleteOpportunityFeedback
    };

    // Opportunities Methods
    /**
     * @name getOpportunities
     * @desc Get opportunities from API
     * @params {String} url - url to hit the api with [this could end up being static]
     * @params {String} opportunityID - ID of opportunity [optional]
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function getOpportunities(url, opportunityID) {
      var opportunitiesPromise = $q.defer();

      if (opportunityID && opportunityID !== '') url += encodeURIComponent('opportunityID:' + opportunityID);

      $http.get(url, {
        headers: {}
      })
      .then(getOpportunitiesSuccess)
      .catch(getOpportunitiesFail);

      function getOpportunitiesSuccess(response) {
        console.log('[opportunitiesService.getOpportunities] response: ', response);
        // opportunitiesPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        opportunitiesPromise.resolve(data.opportunitiesGetResponse);
      }

      function getOpportunitiesFail(error) {
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }

    /**
     * @name createOpportunity
     * @desc create an opportunity
     * @params {String} url - url to hit the api with [this could end up being static]
     * @params {Object} data - opportunity data
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function createOpportunity(url, data) {
      var opportunitiesPromise = $q.defer();
      var payload = data.opportunitiesPostPayload;

      $http.post(url, payload, {
        headers: {}
      })
      .then(createOpportunitiesSuccess)
      .catch(createOpportunitiesFail);

      function createOpportunitiesSuccess(response) {
        console.log('[opportunitiesService.createOpportunity] response: ', response);
        // opportunitiesPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        opportunitiesPromise.resolve(data.opportunitiesPostResponse);
      }

      function createOpportunitiesFail(error) {
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }

    /**
     * @name updateOpportunity
     * @desc updates an opportunity
     * @params {String} url - url to hit the api with [this could end up being static]
     * @params {String} opportunityID - opportunity id
     * @params {Object} data - opportunity data
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function updateOpportunity(url, opportunityID, data) {
      var opportunitiesPromise = $q.defer();
      var payload = data.opportunityPutPayload;

      $http.put(url, payload, {
        headers: {}
      })
      .then(updateOpportunitiesSuccess)
      .catch(updateOpportunitiesFail);

      function updateOpportunitiesSuccess(response) {
        console.log('[opportunitiesService.updateOpportunity] response: ', response);
        // opportunitiesPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        opportunitiesPromise.resolve(data.opportunityPutResponse);
      }

      function updateOpportunitiesFail(error) {
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }

    /**
     * /opportunities/{opportunityID}/feedback
     * @name getOpportunityFeedback
     * @desc Get opportunity feedback from API
     * @params {String} url - url to hit the api with [this could end up being static]
     * @params {String} opportunityID - ID of opportunity [required]
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function getOpportunityFeedback(url, opportunityID) {
      var opportunitiesPromise = $q.defer();

      $http.get(url, {
        headers: {}
      })
      .then(getOpportunitiesFeedbackSuccess)
      .catch(getOpportunitiesFeedbackFail);

      function getOpportunitiesFeedbackSuccess(response) {
        console.log('[opportunitiesService.getOpportunityFeedback] response: ', response);
        // opportunitiesPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        opportunitiesPromise.resolve(data.feedbackGetResponse);
      }

      function getOpportunitiesFeedbackFail(error) {
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }

    /**
     * /opportunities/{opportunityID}/feedback
     * @name createOpportunityFeedback
     * @desc Create opportunity feedback from API
     * @params {String} url - url to hit the api with [this could end up being static]
     * @params {String} opportunityID - ID of opportunity [required]
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function createOpportunityFeedback(url, opportunityID, data) {
      var opportunitiesPromise = $q.defer();
      var payload = data.feedbackPostPayload;

      $http.post(url, payload, {
        headers: {}
      })
      .then(getOpportunitiesFeedbackSuccess)
      .catch(getOpportunitiesFeedbackFail);

      function getOpportunitiesFeedbackSuccess(response) {
        console.log('[opportunitiesService.getOpportunityFeedback] response: ', response);
        // opportunitiesPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        opportunitiesPromise.resolve(data.feedbackPostResponse);
      }

      function getOpportunitiesFeedbackFail(error) {
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }

    /**
     * /opportunities/{opportunityID}/feedback/{feedbackId}
     * @name deleteOpportunityFeedback
     * @desc Delete opportunity feedback from API
     * @params {String} url - url to hit the api with [this could end up being static]
     * @params {String} opportunityID - ID of opportunity [required]
     * @params {String} feedbackID - ID of feedback [required]
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function deleteOpportunityFeedback(url, opportunityID, feedbackID) {
      var opportunitiesPromise = $q.defer();
      var payload = data.feedbackDeletePayload;

      $http.post(url, payload, {
        headers: {}
      })
      .then(deleteOpportunitiesFeedbackSuccess)
      .catch(deleteOpportunitiesFeedbackFail);

      function deleteOpportunitiesFeedbackSuccess(response) {
        console.log('[opportunitiesService.getOpportunityFeedback] response: ', response);
        // opportunitiesPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        opportunitiesPromise.resolve(data.feedbackDeleteResponse);
      }

      function deleteOpportunitiesFeedbackFail(error) {
        opportunitiesPromise.reject(error);
      }

      return opportunitiesPromise.promise;
    }
  };
