'use strict';

module.exports =
  function storesService($http, $q) {
    var data = [{
      'account': 'Walmart',
      'sub_account': 'Walmart Northwest',
      'tdlinx_number': '2063528',
      'store_name': 'PITTSFIELD RESTAURANT',
      'store_number': 'UNKNOWN',
      'address': '55 E WASHINGTON ST',
      'city': 'CHICAGO',
      'state': 'IL',
      'postal_cd': '606022103',
      'phone_no': '3126411806',
      'latitude': 41.8831,
      'longitude': -87.6259,
      'last_update': 201512,
      'high_impact': 'N',
      'unsold_account': 'N',
      'premise_type': 'ON PREMISE',
      'trade_classification': 'CASUAL DINING',
      'planning_group': 'REGIONAL',
      'store_rank_wine': {
        'rank': 3,
        'delta': -21.3576,
        'depl_fytd': 1.496,
        'depl_pts_fytd': 8.976,
        'depl_l12_mth_ty': 1.496,
        'depl_pts_fytd_1ya': 30.3336
      }
    }, {
      'account': 'Aramark',
      'sub_account': 'Aramark Midwest',
      'tdlinx_number': '2716566',
      'store_name': 'ARAMARK HARRIS BANK',
      'store_number': '1525',
      'address': '111 W MONROE ST',
      'city': 'CHICAGO',
      'state': 'IL',
      'postal_cd': '606034096',
      'phone_no': '13122936006',
      'latitude': 41.8807,
      'longitude': -87.6311,
      'last_update': 201512,
      'high_impact': 'N',
      'unsold_account': 'N',
      'premise_type': 'ON PREMISE',
      'trade_classification': 'CATERER',
      'planning_group': 'OPSA',
      'store_rank_wine': {
        'rank': 3,
        'delta': -297.32,
        'depl_fytd': 0,
        'depl_pts_fytd': 0,
        'depl_l12_mth_ty': 0,
        'depl_pts_fytd_1ya': 297.32
      }
    }];

    var dataOpp = {
      'storeID': '5110665',
      'opportunities': {
        'MVP': {
          'Beer': [
            {
              'rank': 1,
              'USKUDescription': 'CORONA LIGHT KEG',
              'totalSales': 523.556396,
              'totalSalesYAG': 454.667389,
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
            },
            {
              'rank': 2,
              'USKUDescription': 'TSINGTAO 12 OZ BOTTLE',
              'totalSales': 488,
              'totalSalesYAG': 644,
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
            },
            {
              'rank': 3,
              'USKUDescription': 'CORONA EXTRA 7 OZ BOTTLE',
              'totalSales': 266,
              'totalSalesYAG': 388,
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
            },
            {
              'rank': 4,
              'USKUDescription': 'NEGRA MODELO 12 OZ BOTTLE',
              'totalSales': 241,
              'totalSalesYAG': 254,
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
            },
            {
              'rank': 5,
              'USKUDescription': 'MODELO ESPECIAL 12 OZ BOTTLE',
              'totalSales': 195,
              'totalSalesYAG': 161,

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
            }
          ],
          'Spirits': [
            {
              'rank': 1,
              'highImpact': 'Y',
              'UPC': '061776811117',
              'USKUDescription': 'SVEDKA VODKA 1.75L'
            },
            {
              'rank': 2,
              'highImpact': 'N',
              'UPC': '008810013451',
              'USKUDescription': 'BLACK VELVET WHISKEY 1.75L'
            },
            {
              'rank': 3,
              'highImpact': 'N',
              'UPC': '061776811110',
              'USKUDescription': 'SVEDKA VODKA 1L'
            },
            {
              'rank': 4,
              'highImpact': 'N',
              'UPC': '061776811375',
              'USKUDescription': 'SVEDKA VODKA 375ML'
            },
            {
              'rank': 5,
              'highImpact': 'N',
              'UPC': '002129600606',
              'USKUDescription': 'PAUL MASSON GRAND AMBER BRANDY VS BRANDY 375ML'
            }
          ],
          'Wine': [
            {
              'rank': 1,
              'highImpact': 'N',
              'UPC': '008600387388',
              'USKUDescription': 'WOODBRIDGE BY ROBERT MONDAVI CHARD 1.5L'
            },
            {
              'rank': 2,
              'highImpact': 'N',
              'UPC': '008308590308',
              'USKUDescription': 'RUFFINO RISERVA DUCALE 750ML'
            },
            {
              'rank': 3,
              'highImpact': 'Y',
              'UPC': '068935200961',
              'USKUDescription': 'KIM CRAWFORD SAUVIGNON BLANC 750ML'
            },
            {
              'rank': 4,
              'highImpact': 'N',
              'UPC': '008600381385',
              'USKUDescription': 'WOODBRIDGE BY ROBERT MONDAVI CAB SAUV 1.5L'
            },
            {
              'rank': 5,
              'highImpact': 'N',
              'UPC': '008143450015',
              'USKUDescription': 'BLACKSTONE MERLOT 750ML'
            },
            {
              'rank': 6,
              'highImpact': 'Y',
              'UPC': '008841578405',
              'USKUDescription': 'SIMI SONOMA COUNTY CHARD 750ML'
            },
            {
              'rank': 7,
              'highImpact': 'Y',
              'UPC': '008143400003',
              'USKUDescription': 'BLACK BOX CAB SAUV 3L BOX'
            },
            {
              'rank': 9,
              'highImpact': 'N',
              'UPC': '008600390418',
              'USKUDescription': 'SAVED RED WINE 750ML'
            },
            {
              'rank': 10,
              'highImpact': 'N',
              'UPC': '008600300050',
              'USKUDescription': 'WOODBRIDGE BY ROBERT MONDAVI MERLOT 1.5L'
            },
            {
              'rank': 13,
              'highImpact': 'N',
              'UPC': '008308590303',
              'USKUDescription': 'RUFFINO CHIANTI 1.5L'
            },
            {
              'rank': 14,
              'highImpact': 'N',
              'UPC': '008841578055',
              'USKUDescription': 'SIMI ALEXANDER VALLEY CAB SAUV 750ML'
            },
            {
              'rank': 15,
              'highImpact': 'N',
              'UPC': '008600386386',
              'USKUDescription': 'WOODBRIDGE BY ROBERT MONDAVI SAUVIGNON BLANC 1.5L'
            },
            {
              'rank': 17,
              'highImpact': 'N',
              'UPC': '008600384385',
              'USKUDescription': 'WOODBRIDGE BY ROBERT MONDAVI WHITE ZINFANDEL 1.5L'
            },
            {
              'rank': 18,
              'highImpact': 'N',
              'UPC': '008841578701',
              'USKUDescription': 'SIMI SONOMA COUNTY MERLOT 750ML'
            },
            {
              'rank': 19,
              'highImpact': 'N',
              'UPC': '008600300160',
              'USKUDescription': 'ROBERT MONDAVI PRIVATE SELECTION CAB SAUV 1.5L'
            },
            {
              'rank': 21,
              'highImpact': 'N',
              'UPC': '008600390406',
              'USKUDescription': 'ROBERT MONDAVI PRIVATE SELECTION HERITAGE RED 750ML'
            },
            {
              'rank': 22,
              'highImpact': 'N',
              'UPC': '008600300340',
              'USKUDescription': 'WOODBRIDGE BY ROBERT MONDAVI PINOT NOIR 1.5L'
            },
            {
              'rank': 23,
              'highImpact': 'N',
              'UPC': '008735651013',
              'USKUDescription': 'CLOS DU BOIS CHARD 1.5L'
            },
            {
              'rank': 24,
              'highImpact': 'Y',
              'UPC': '008600300165',
              'USKUDescription': 'WOODBRIDGE BY ROBERT MONDAVI PINOT GRIGIO 1.5L'
            },
            {
              'rank': 25,
              'highImpact': 'N',
              'UPC': '008894000002',
              'USKUDescription': 'TAYLOR PORT 1.5L'
            }
          ]
        }
      },
      'AuthorizationVoids': {}
    };

    return {
      getStores: getStores,
      getStoreOpportunities: getStoreOpportunities
    };

    /**
     * @name getStores
     * @desc Get stores from API
     * @params {String} url - url to hit the api with [this could end up being static]
     * @params {String} tdlinxNumber - store id [optional]
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function getStores(url, tdlinxNumber) {
      var storesPromise = $q.defer();

      $http.get(url, {
        headers: {}
      })
      .then(getStoresSuccess)
      .catch(getStoresFail);

      function getStoresSuccess(response) {
        console.log('[storesService.getStores] response: ', response);
        // storesPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        storesPromise.resolve(data);
      }

      function getStoresFail(error) {
        storesPromise.resolve(error);
      }

      return storesPromise.promise;
    }

    /**
     * @name getStoreOpportunities
     * @desc Get store opportunities from API
     * @params {String} url - url to hit the api with [this could end up being static]
     * @params {String} tdlinxNumber - store id [required]
     * @returns {Object}
     * @memberOf andromeda.common.services
     */
    function getStoreOpportunities(url, tdlinxNumber) {
      var storesOpportunitiesPromise = $q.defer();

      $http.get(url, {
        headers: {}
      })
      .then(getStoreOpportunitiesSuccess)
      .catch(getStoreOpportunitiesFail);

      function getStoreOpportunitiesSuccess(response) {
        console.log('[storesService.getStoreOpportunities] response: ', response);
        // storesOpportunitiesPromise.resolve(response.data);
        // uncomment above and remove below when services are ready
        storesOpportunitiesPromise.resolve(dataOpp);
      }

      function getStoreOpportunitiesFail(error) {
        storesOpportunitiesPromise.resolve(error);
      }

      return storesOpportunitiesPromise.promise;
    }
  };
