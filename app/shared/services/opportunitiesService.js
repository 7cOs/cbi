module.exports =
  function opportunitiesService() {
    var data = {
      opportunities: [
        {id: 0, store: 'Walmart', address: '123 Elm St., San Jose, CA - 88779', opCount: 4, depletionsCYTD: 12657, depletionTrendVsYA: 0.3, segmentation: 'A'},
        {id: 1, store: 'Walgreens', address: '9 Jones st., San Francisco, CA - 98989', opCount: 9, depletionsCYTD: 1002, depletionTrendVsYA: -5, segmentation: 'A'},
        {id: 2, store: 'Circle K', address: '3524 Walden Dr, Santa Clara, CA - 89898', opCount: 25, depletionsCYTD: 78, depletionTrendVsYA: 5, segmentation: 'A'},
        {id: 3, store: 'Circle K', address: '136 Route 4 Boca Raton, CA - 33428', opCount: 8, depletionsCYTD: 20, depletionTrendVsYA: -5, segmentation: 'B'},
        {id: 4, store: 'Redding', address: '35 Chapel Stree Bayonne, CA - 07002', opCount: 1, depletionsCYTD: 10, depletionTrendVsYA: 5, segmentation: 'B'}
      ],
      products: [
        {id: 0, product: 'Corona LT', detail: '12 Pk -12 oz BT', type: 'At risk', rationale: 'Similar <class of trade> accounts, currently growing SKU at <X%>', status: 'new', predictedImpact: 'high'},
        {id: 1, product: 'Modelo', detail: '12 Pk -12 oz BT', type: 'At risk', rationale: 'Similar <class of trade> accounts, currently growing SKU at <X%>', status: 'new', predictedImpact: 'high'},
        {id: 2, product: 'Victoria', detail: '12 Pk -12 oz BT', type: 'Non-buy', rationale: 'Similar <class of trade> accounts, currently growing SKU at <X%>', status: 'new', predictedImpact: 'high'},
        {id: 3, product: 'Pacifico', detail: '12 Pk -12 oz BT', type: 'Non-buy', rationale: 'Similar <class of trade> accounts, currently growing SKU at <X%>', status: 'new', predictedImpact: 'low'},
        {id: 4, product: 'Negra Modelo', detail: '12 Pk -12 oz BT', type: 'Low Velocity', rationale: 'Similar <class of trade> accounts, currently growing SKU at <X%>', status: 'new', predictedImpact: 'medium'},
        {id: 5, product: 'Corona LT', detail: '12 Pk -12 oz BT', type: 'Low Velocity', rationale: 'Similar <class of trade> accounts, currently growing SKU at <X%>', status: 'new', predictedImpact: 'low'}
      ]
    };

    return {
      all: function() {
        return data.opportunities;
      },
      get: function(id) {
        return data.products;
      }
    };
  };

