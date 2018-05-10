import * as Chance from 'chance';
import * as moment from 'moment';

let chance = new Chance();

export function getTargetListNotificationNotificationMock(): any {
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
export function getListAddCollaboratorNotificationMock(): any {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: 'LIST',
    objectId: chance.string(),
    action: 'LIST_COLLABORATOR_ADDED',
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

export function getListTransferOwnershipNotificationMock(): any {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: 'LIST',
    objectId: chance.string(),
    action: 'LIST_OWNER_CHANGED',
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

export function getOpportunityNotificationMock(): any {
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

export function getStoreNotificationMock(): any {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: 'STORE',
    objectId: chance.string(),
    action: 'ADDED_NOTE',
    salesforceUserNoteID: chance.string(),
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

export function getAccountNotificationMock(): any {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: 'ACCOUNT',
    objectId: chance.string(),
    action: 'ADDED_NOTE',
    salesforceUserNoteID: chance.string(),
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

export function getDistributorNotificationMock(): any {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: 'DISTRIBUTOR',
    objectId: chance.string(),
    action: 'ADDED_NOTE',
    salesforceUserNoteID: chance.string(),
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
