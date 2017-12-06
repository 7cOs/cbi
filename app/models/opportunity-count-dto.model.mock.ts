export function getOpportunityCountDTOMock() {
  return [{
    type: 'BRAND',
    label: '678',
    count: 75,
    items: [{
      type: 'SKU',
      label: '80024732',
      count: 25,
      items: [{
        type: 'OPPTYPE',
        label: 'NON_BUY',
        count: 25
      }]
    }, {
      type: 'SKU',
      label: '80014011',
      count: 50,
      items: [{
        type: 'OPPTYPE',
        label: 'NON_BUY',
        count: 20
      }, {
        type: 'OPPTYPE',
        label: 'LOW_VELOCITY',
        count: 30
      }]
    }]
  }, {
    type: 'BRAND',
    label: '471',
    count: 25,
    items: [{
      type: 'SKU',
      label: '80031989',
      count: 5,
      items: [{
        type: 'OPPTYPE',
        label: 'NON_BUY',
        count: 5
      }]
    }, {
      type: 'SKU',
      label: '80013972',
      count: 20,
      items: [{
        type: 'OPPTYPE',
        label: 'NON_BUY',
        count: 12
      }, {
        type: 'OPPTYPE',
        label: 'LOW_VELOCITY',
        count: 8
      }]
    }]
  }];
}
