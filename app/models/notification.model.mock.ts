import * as Chance from 'chance';
import * as moment from 'moment';

let chance = new Chance();

export function targetListNotificationNotificationMock(): any {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: 'TARGET_LIST',
    objectId: chance.string(),
    action: 'SHARE_TARGET_LIST',
    salesforceUserNoteID: null,
    creator: {
      id: chance.string(),
      firstName: chance.string(),
      lastName: chance.string(),
      email: chance.string()
    },
    shortenedObject: {
      id: chance.string(),
      name: chance.string(),
      valid: chance.bool()
    },
    status: 'SEEN'
  };
}

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
        valid: chance.bool()
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
      valid: chance.bool()
    },
    status: 'SEEN'
  };
}

export function storeNotificationMock(): any {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: 'STORE',
    objectId: chance.string(),
    action: 'ADDED_NOTE',
    salesforceUserNoteID: null,
    creator: {
      id: chance.string(),
      firstName: chance.string(),
      lastName: chance.string(),
      email: chance.string()
    },
    shortenedObject: {
      tdlinx_number: chance.integer(),
      store_name: chance.string(),
      store_number: chance.integer(),
      address: chance.string(),
      city: chance.string(),
      state: chance.string(),
      valid: chance.bool(),
    },
    status: 'SEEN'
  };
}

export function accountNotificationMock(): any {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: 'ACCOUNT',
    objectId: chance.string(),
    action: 'ADDED_NOTE',
    salesforceUserNoteID: null,
    creator: {
      id: chance.string(),
      firstName: chance.string(),
      lastName: chance.string(),
      email: chance.string()
    },
    shortenedObject: {
      id: chance.string(),
      name: chance.string(),
      value: chance.bool()
    },
    status: 'SEEN'
  };
}
