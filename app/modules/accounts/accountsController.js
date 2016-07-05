'use strict';

module.exports =
  function accountsController($scope) {
    $scope.testData = [
      {
        'SKU': 'Pacifico 12PK bottle',
        'distributionNum': 902,
        'distributionPercent': 7.6,
        'velocityNum': 902,
        'velocityPercent': 7.6,
        'depletionsNum': 902,
        'depletionsPercent': 7.6
      },
      {
        'SKU': 'Pacifico 6PK bottle',
        'distributionNum': 803,
        'distributionPercent': 2.7,
        'velocityNum': 803,
        'velocityPercent': 2.7,
        'depletionsNum': 803,
        'depletionsPercent': 2.7
      },
      {
        'SKU': 'Ballast Point 6PK bottle',
        'distributionNum': 306,
        'distributionPercent': 5.9,
        'velocityNum': 306,
        'velocityPercent': 5.9,
        'depletionsNum': 306,
        'depletionsPercent': 5.9
      }
    ];

    $scope.testStores = [
      {
        'storeName': 'Thriftway Morgan',
        'depletions': 47560
      },
      {
        'storeName': 'Town and Country',
        'depletions': 53465
      }
    ];

    $scope.testOpportunities =  [
      {
        'opportunityType': 'Non-buy',
        'SKU': {
          'brand': 'Corona LT',
          'pack': '12 PK - 12 oz'
        },
        'status': 'NEW',
        'rationale': 'This store has not purchased yet'
      },
      {
        'opportunityType': 'At risk',
        'SKU': {
          'brand': 'Ballast Point',
          'pack': '6 PK bottle'
        },
        'status': 'EXISTING',
        'rationale': 'Has not sold for 60 days'
      }
    ];
  };
