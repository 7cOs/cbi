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
        'name': 'Victoria',
        'measures': {
          'timeframe': 'L30',
          'distributions': 273400,
          'yearAgoGap': 1532,
          'yearAgoTrend': 7.5,
          'yearAgoBuTrend': 1,
          'vsPlanNumber': 1532,
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
        'name': 'Modelo',
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
      }]
    };

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
      premises: [{
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
      }]
    };

    var chartData = [
      {
        'values': [
          {
            'label': 'Walmart #1167',
            'value': 15,
            'title': 'Walmart',
            'address': '3500 Brumb... Kenosha, WA',
            'storeNum': 1167,
            'depletions': 47560
          }, {
            'label': 'Walmart #2872',
            'value': -4,
            'title': 'Walmart',
            'address': '10562 Bell... , Belleville, MI',
            'storeNum': 2872,
            'depletions': 65879
          }, {
            'label': 'Walmart #166',
            'value': 9,
            'title': 'Walmart',
            'address': '1433 S Sam... , Houston, MO',
            'storeNum': 166,
            'depletions': 45500
          }, {
            'label': 'Walmart #3395',
            'value': 4,
            'title': 'Walmart',
            'address': '3501 S Loc... , Grand Island, NE',
            'storeNum': 3395,
            'depletions': 64329
          }, {
            'label': 'Walmart #1471',
            'value': -10,
            'title': 'Walmart',
            'address': '1717 N Sha... , New London, WI',
            'storeNum': 1471,
            'depletions': 42943
          }, {
            'label': 'Walmart #1685',
            'value': -1,
            'title': 'Walmart',
            'address': '1730 N Gar... , Pierre, SD',
            'storeNum': 1685,
            'depletions': 51211
          }, {
            'label': 'Walmart #2738',
            'value': -3,
            'title': 'Walmart',
            'address': '400 Juncti... , Glen Carbon, IL',
            'storeNum': 2738,
            'depletions': 71200
          }, {
            'label': 'Walmart #2089',
            'value': 11,
            'title': 'Walmart',
            'address': '3001 W Bro... , Coumbia, MO',
            'storeNum': 2089,
            'depletions': 61193
          }, {
            'label': 'Walmart #1198',
            'value': 2,
            'title': 'Walmart',
            'address': 'W159S6530... , Muskego, WI',
            'storeNum': 1198,
            'depletions': 55342
          }
        ]
      }
    ];

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
      chartData: function() {
        return chartData;
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
