module.exports =
  function myperformanceService() {
    var performanceData = {
      'performance': [{
        'type': 'Depletions CE',
        'measures': [{
          'timeframe': 'L30',
          'value': 273400,
          'percentChange': -7.5
        }, {
          'timeframe': 'L60',
          'value': 273400,
          'percentChange': 7.5
        }, {
          'timeframe': 'L90',
          'value': 273400,
          'percentChange': 7.5
        }, {
          'timeframe': 'L120',
          'value': 273400,
          'percentChange': 7.5
        }, {
          'timeframe': 'FYTD',
          'value': 499999,
          'percentChange': 13.5
        }]
      }, {
        'type': 'Distribution Points - Off Premise, Simple',
        'measures': [{
          'timeframe': 'L30',
          'value': 3017,
          'percentChange': 7.5
        }, {
          'timeframe': 'L60',
          'value': 3017,
          'percentChange': -7.5
        }, {
          'timeframe': 'L90',
          'value': 812,
          'percentChange': -9.5
        }, {
          'timeframe': 'L120',
          'value': 3017,
          'percentChange': -7.5
        }]
      }, {
        'type': 'Distribution Points - Off Premise, Effective',
        'measures': [{
          'timeframe': 'L30',
          'value': 8256,
          'percentChange': 9.9
        }, {
          'timeframe': 'L60',
          'value': 8256,
          'percentChange': 9.9
        }, {
          'timeframe': 'L90',
          'value': 316,
          'percentChange': 19.9
        }, {
          'timeframe': 'L120',
          'value': 8256,
          'percentChange': 9.9
        }]
      }, {
        'type': 'Distribution Points - On Premise, Simple',
        'measures': [{
          'timeframe': 'L30',
          'value': 548,
          'percentChange': -3.2
        }, {
          'timeframe': 'L60',
          'value': 548,
          'percentChange': -3.2
        }, {
          'timeframe': 'L90',
          'value': 5150,
          'percentChange': -3.2
        }, {
          'timeframe': 'L120',
          'value': 548,
          'percentChange': -3.2
        }]
      }, {
        'type': 'Distribution Points - On Premise, Effective',
        'measures': [{
          'timeframe': 'L30',
          'value': 5876,
          'percentChange': 8.7
        }, {
          'timeframe': 'L60',
          'value': 5876,
          'percentChange': 8.7
        }, {
          'timeframe': 'L90',
          'value': 5876,
          'percentChange': 8.7
        }, {
          'timeframe': 'L120',
          'value': 5876,
          'percentChange': 8.7
        }]
      }]
    };

    var depletionData = {
      'performance': [{
        'type': 'Brand',
        'name': 'Corona',
        'measures': {
          'timeframe': 'L30',
          'depletions': 273400,
          'yearAgoGap': 1532,
          'yearAgoTrend': 7.5,
          'yearAgoBuTrend': 1,
          'vsPlanNumber': 1532,
          'vsPlanPercent': 4,
          'volumeContribution': 100,
          'volumeContributionBu': 50,
          'growthContribution': 99,
          'growthContributionBu': 32
        }
      }, {
        'type': 'Brand',
        'name': 'Ballast Point',
        'measures': {
          'timeframe': 'L30',
          'depletions': 2300,
          'yearAgoGap': 132,
          'yearAgoTrend': -7.5,
          'yearAgoBuTrend': 11,
          'vsPlanNumber': 152,
          'vsPlanPercent': 34,
          'volumeContribution': 100,
          'volumeContributionBu': 80,
          'growthContribution': 88,
          'growthContributionBu': 53
        }
      }]
    };

    var distributionData = {
      'performance': [{
        'type': 'Brand',
        'name': 'Barrilito',
        'measures': {
          'timeframe': 'L30',
          'distributions': 273400,
          'yearAgoGap': 827,
          'yearAgoTrend': 7.5,
          'yearAgoBuTrend': 1,
          'vsPlanNumber': 829,
          'vsPlanPercent': 4,
          'velocityNumber': 827,
          'velocityPercent': 5,
          'volumeContribution': 100,
          'volumeContributionBu': 50,
          'growthContribution': 99,
          'growthContributionBu': 32
        }
      }, {
        'type': 'Brand',
        'name': 'Corona Extra',
        'measures': {
          'timeframe': 'L30',
          'distributions': 2300,
          'yearAgoGap': 132,
          'yearAgoTrend': -7.5,
          'yearAgoBuTrend': 11,
          'vsPlanNumber': 152,
          'vsPlanPercent': 34,
          'velocityNumber': 482,
          'velocityPercent': 3,
          'volumeContribution': 100,
          'volumeContributionBu': 80,
          'growthContribution': 88,
          'growthContributionBu': 53
        }
      }, {
        'type': 'Brand',
        'name': 'Corona Light',
        'measures': {
          'timeframe': 'L30',
          'distributions': 2300,
          'yearAgoGap': 130,
          'yearAgoTrend': 5,
          'yearAgoBuTrend': 11,
          'vsPlanNumber': 135,
          'vsPlanPercent': 32,
          'velocityNumber': 482,
          'velocityPercent': 3,
          'volumeContribution': 100,
          'volumeContributionBu': 80,
          'growthContribution': 88,
          'growthContributionBu': 53
        }
      }, {
        'type': 'Brand',
        'name': 'Leon',
        'measures': {
          'timeframe': 'L30',
          'distributions': 2300,
          'yearAgoGap': 125,
          'yearAgoTrend': -6,
          'yearAgoBuTrend': 11,
          'vsPlanNumber': 135,
          'vsPlanPercent': 12,
          'velocityNumber': 482,
          'velocityPercent': 3,
          'volumeContribution': 100,
          'volumeContributionBu': 80,
          'growthContribution': 88,
          'growthContributionBu': 53
        }
      }]
    };

    var brandSkus = [
      {
        'name': '1/2 Bl Keg',
        'measures': {
          'yearAgoGap': 125,
          'yearAgoTrend': -6,
          'vsPlanNumber': 135,
          'vsPlanPercent': 12,
          'velocityNumber': 482,
          'velocityPercent': 3
        }
      }, {
        'name': '1/4 Bl Keg',
        'measures': {
          'yearAgoGap': 125,
          'yearAgoTrend': 2,
          'vsPlanNumber': 135,
          'vsPlanPercent': 3,
          'velocityNumber': 482,
          'velocityPercent': -1
        }
      }, {
        'name': '12 Pk Bt',
        'measures': {
          'yearAgoGap': 110,
          'yearAgoTrend': 10,
          'vsPlanNumber': 125,
          'vsPlanPercent': -4,
          'velocityNumber': 134,
          'velocityPercent': 8
        }
      }, {
        'name': '12 Pk BT',
        'measures': {
          'yearAgoGap': 90,
          'yearAgoTrend': 5,
          'vsPlanNumber': 120,
          'vsPlanPercent': -6,
          'velocityNumber': 134,
          'velocityPercent': 3
        }
      }, {
        'name': '16oz - 6 Pk Can',
        'measures': {
          'yearAgoGap': 95,
          'yearAgoTrend': 10,
          'vsPlanNumber': 115,
          'vsPlanPercent': -4,
          'velocityNumber': 134,
          'velocityPercent': 8
        }
      }
    ];

    var filters = {
      placementType: [{
        name: 'Simple'
      }, {
        name: 'Effective'
      }],
      timePeriod: [{
        name: 'Current Month to Date'
      }, {
        name: 'Last Closed Month'
      }],
      trend: [{
        name: 'vs YA'
      }, {
        name: 'va Plan'
      }],
      premises: [{
        name: 'All'
      }, {
        name: 'On Premise'
      }, {
        name: 'Off Premise'
      }],
      depletionsTimePeriod: [{
        name: 'MTD July 1 - July 31'
      }, {
        name: 'CYTD Jan 1 - July 21'
      }, {
        name: 'FYTD May 1, 2016 - July 21, 2016'
      }],
      distributionTimePeriod: [{
        name: 'L30 Days June 21 - July 21'
      }, {
        name: 'L60 May 21, 2016 - July 21, 2016'
      }, {
        name: 'L90 Days April 22, 2016 - July 21, 2016'
      }],
      accountBrands: [{
        name: 'Distributions (simple)'
      }, {
        name: 'Velocity'
      }],
      accountMarkets: [{
        name: 'Depletions'
      }, {
        name: 'Distribution (simple)'
      }, {
        name: 'Distribution (effective)'
      }, {
        name: 'Velocity'
      }],
      valuesVsTrend: [{
        name: 'Top 10 (Values)'
      }, {
        name: 'Top 10 (Trend)'
      }, {
        name: 'Bottom 10 (Values)'
      }, {
        name: 'Bottom 10 (Trend)'
      }],
      accountTypes: [{
        name: 'Distributors'
      }, {
        name: 'Accounts'
      }, {
        name: 'Sub-Accounts'
      }, {
        name: 'Stores'
      }],
      storeTypes: [{
        name: 'Chain'
      }, {
        name: 'Independent'
      }]
    };

    var marketData = {
      'distributors': [
        {
          'label': 'Walmed & Feller',
          'value': 15,
          'title': 'Walmed & Feller',
          'depletions': 47560,
          'distSimple': 28344,
          'distEffective': 48832,
          'velocity': 28383
        }, {
          'label': 'Ajax Dist Co - Tn',
          'value': -4,
          'title': 'Ajax Dist Co - Tn',
          'depletions': 65879,
          'distSimple': 98237,
          'distEffective': 23894,
          'velocity': 2834
        }, {
          'label': 'General Wholesale Co - GA (Atlanta)',
          'value': 9,
          'title': 'General Wholesale Co - GA (Atlanta)',
          'depletions': 45500,
          'distSimple': 29387,
          'distEffective': 4983,
          'velocity': 9283
        }, {
          'label': 'Carlson Dist Co Inc - Ut',
          'value': 4,
          'title': 'Carlson Dist Co Inc - Ut',
          'depletions': 64329,
          'distSimple': 28947,
          'distEffective': 82748,
          'velocity': 78673
        }, {
          'label': 'Southern Arizona Dist - Az',
          'value': -10,
          'title': 'Southern Arizona Dist - Az',
          'depletions': 42943,
          'distSimple': 20937,
          'distEffective': 82374,
          'velocity': 29374
        }, {
          'label': 'Marty\'s Distributing - Ut',
          'value': -1,
          'title': 'Marty\'s Distributing - Ut',
          'depletions': 51211,
          'distSimple': 89744,
          'distEffective': 93784,
          'velocity': 81273
        }, {
          'label': 'Msp',
          'value': -3,
          'title': 'Msp',
          'depletions': 71200,
          'distSimple': 27387,
          'distEffective': 82737,
          'velocity': 92744
        }, {
          'label': 'Everbrite Electric Signs',
          'value': 11,
          'title': 'Everbrite Electric Signs',
          'depletions': 61193,
          'distSimple': 62733,
          'distEffective': 84763,
          'velocity': 72633
        }, {
          'label': 'Communikay Graphics',
          'value': 2,
          'title': 'Communikay Graphics',
          'depletions': 55342,
          'distSimple': 67263,
          'distEffective': 7263,
          'velocity': 2452
        }
      ],
      'accounts': [
        {
          'label': 'Walmart',
          'value': 10,
          'title': 'Walmart',
          'depletions': 47560,
          'distSimple': 28344,
          'distEffective': 48832,
          'velocity': 28383
        }, {
          'label': 'Food Town',
          'value': 5,
          'title': 'Food Town',
          'depletions': 65879,
          'distSimple': 98237,
          'distEffective': 23894,
          'velocity': 2834
        }, {
          'label': 'Fred Meyer',
          'value': -8,
          'title': 'Fred Meyer',
          'depletions': 45500,
          'distSimple': 29387,
          'distEffective': 4983,
          'velocity': 9283
        }, {
          'label': 'Target',
          'value': 9,
          'title': 'Target',
          'depletions': 64329,
          'distSimple': 28947,
          'distEffective': 82748,
          'velocity': 78673
        }, {
          'label': 'Circle K',
          'value': -3,
          'title': 'Circle K',
          'depletions': 42943,
          'distSimple': 20937,
          'distEffective': 82374,
          'velocity': 29374
        }, {
          'label': 'Sears Holding Corp',
          'value': -2,
          'title': 'Sears Holding Corp',
          'depletions': 51211,
          'distSimple': 89744,
          'distEffective': 93784,
          'velocity': 81273
        }, {
          'label': 'Albertsons Safeway',
          'value': 5,
          'title': 'Albertsons Safeway',
          'depletions': 71200,
          'distSimple': 27387,
          'distEffective': 82737,
          'velocity': 92744
        }, {
          'label': 'Rite Aid',
          'value': 8,
          'title': 'Rite Aid',
          'depletions': 61193,
          'distSimple': 62733,
          'distEffective': 84763,
          'velocity': 72633
        }, {
          'label': 'Stripes',
          'value': 2,
          'title': 'Stripes',
          'depletions': 55342,
          'distSimple': 67263,
          'distEffective': 7263,
          'velocity': 2452
        }
      ],
      'subAccounts': [
        {
          'label': 'Mid Atlantic / Northeast',
          'value': 15,
          'title': 'Mid Atlantic / Northeast',
          'depletions': 47560,
          'distSimple': 28344,
          'distEffective': 48832,
          'velocity': 28383
        }, {
          'label': 'North Central',
          'value': -4,
          'title': 'North Central',
          'depletions': 65879,
          'distSimple': 98237,
          'distEffective': 23894,
          'velocity': 2834
        }, {
          'label': 'South Central',
          'value': 9,
          'title': 'South Central',
          'depletions': 45500,
          'distSimple': 29387,
          'distEffective': 4983,
          'velocity': 9283
        }, {
          'label': 'Southeast',
          'value': 4,
          'title': 'Southeast',
          'depletions': 64329,
          'distSimple': 28947,
          'distEffective': 82748,
          'velocity': 78673
        }, {
          'label': 'West',
          'value': -10,
          'title': 'West',
          'depletions': 42943,
          'distSimple': 20937,
          'distEffective': 82374,
          'velocity': 29374
        }, {
          'label': 'Southwest',
          'value': -1,
          'title': 'Southwest',
          'depletions': 51211,
          'distSimple': 89744,
          'distEffective': 93784,
          'velocity': 81273
        }, {
          'label': 'Northeast',
          'value': -3,
          'title': 'Northeast',
          'depletions': 71200,
          'distSimple': 27387,
          'distEffective': 82737,
          'velocity': 92744
        }, {
          'label': 'Northwest',
          'value': 11,
          'title': 'Northwest',
          'depletions': 61193,
          'distSimple': 62733,
          'distEffective': 84763,
          'velocity': 72633
        }, {
          'label': 'Central',
          'value': 2,
          'title': 'Central',
          'depletions': 55342,
          'distSimple': 67263,
          'distEffective': 7263,
          'velocity': 2452
        }
      ],
      'stores': [
        {
          'label': 'Walmart #1167',
          'value': 12,
          'title': 'Walmart',
          'address': '3500 Brumb... Kenosha, WA',
          'storeNum': 1167,
          'depletions': 47560,
          'distSimple': 28344,
          'distEffective': 48832,
          'velocity': 28383
        }, {
          'label': 'Walmart #2872',
          'value': -4,
          'title': 'Walmart',
          'address': '10562 Bell... , Belleville, MI',
          'storeNum': 2872,
          'depletions': 65879,
          'distSimple': 98237,
          'distEffective': 23894,
          'velocity': 2834
        }, {
          'label': 'Walmart #166',
          'value': 7,
          'title': 'Walmart',
          'address': '1433 S Sam... , Houston, MO',
          'storeNum': 166,
          'depletions': 45500,
          'distSimple': 29387,
          'distEffective': 4983,
          'velocity': 9283
        }, {
          'label': 'Walmart #3395',
          'value': -2,
          'title': 'Walmart',
          'address': '3501 S Loc... , Grand Island, NE',
          'storeNum': 3395,
          'depletions': 64329,
          'distSimple': 28947,
          'distEffective': 82748,
          'velocity': 78673
        }, {
          'label': 'Walmart #1471',
          'value': -8,
          'title': 'Walmart',
          'address': '1717 N Sha... , New London, WI',
          'storeNum': 1471,
          'depletions': 42943,
          'distSimple': 20937,
          'distEffective': 82374,
          'velocity': 29374
        }, {
          'label': 'Walmart #1685',
          'value': -1,
          'title': 'Walmart',
          'address': '1730 N Gar... , Pierre, SD',
          'storeNum': 1685,
          'depletions': 51211,
          'distSimple': 89744,
          'distEffective': 93784,
          'velocity': 81273
        }, {
          'label': 'Walmart #2738',
          'value': -4,
          'title': 'Walmart',
          'address': '400 Juncti... , Glen Carbon, IL',
          'storeNum': 2738,
          'depletions': 71200,
          'distSimple': 27387,
          'distEffective': 82737,
          'velocity': 92744
        }, {
          'label': 'Walmart #2089',
          'value': 5,
          'title': 'Walmart',
          'address': '3001 W Bro... , Coumbia, MO',
          'storeNum': 2089,
          'depletions': 61193,
          'distSimple': 62733,
          'distEffective': 84763,
          'velocity': 72633
        }, {
          'label': 'Walmart #1198',
          'value': 2,
          'title': 'Walmart',
          'address': 'W159S6530... , Muskego, WI',
          'storeNum': 1198,
          'depletions': 55342,
          'distSimple': 67263,
          'distEffective': 7263,
          'velocity': 2452
        }
      ]
    };

    return {

      model: function() {
        return performanceData;
      },
      depletionModel: function() {
        return depletionData;
      },
      filter: function() {
        return filters;
      },
      marketData: function() {
        return marketData;
      },
      brandSkus: function() {
        return brandSkus;
      },
      distributionModel: function() {
        return distributionData;
      },
      get: function() {
        return {
          id: 0
        };
      }
    };
  };
