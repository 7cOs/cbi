import * as Chance from 'chance';
let chance = new Chance();
import * as moment from 'moment';

export function opportunityNotificationMock(): any {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: 'OPPORTUNITY',
    objectId: chance.string(),
    action: 'SHARE_OPPORTUNITY',
    salesforceUserNoteID: null,
    creator: {
      id: chance.string(),
      firstName: chance.string(),
      lastName: chance.string(),
      email: chance.string()
    },
    shortenedObject: {
      id: chance.string(),
      store: {
        tdlinx_number: chance.string(),
        store_name: chance.string(),
        store_number: chance.string(),
        address: chance.string(),
        city: chance.string(),
        state: chance.string(),
        valid: true
      },
      product: {
        id: chance.string(),
        name: chance.string(),
        type: null,
        brand: chance.string(),
        brandCode: chance.string()
      },
      type: 'MANUAL',
      subType: 'ND_001',
      valid: true
    },
    status: 'SEEN'
  };
}
