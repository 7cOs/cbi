module.exports =
  function opportunitiesService(productsService, distributorsService) {
    var data = {
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
      opportunitiesTypes: data.opportunitiesTypes,
      opportunitiesStatus: data.opportunitiesStatus,
      brands: data.brands,
      accounts: data.accounts,
      distributors: data.distributors,
      premises: data.premises,
      savedFilters: data.savedFilters,
      selected: {
        accountScope: false,
        opportunitiesTypes: ''
      },
      expanded: false
    };

    return {
      all: function() {
        return data.opportunities;
      },
      get: function(id) {
        return data[id];
      },
      model: function() {
        return filter;
      }
    };
  };
