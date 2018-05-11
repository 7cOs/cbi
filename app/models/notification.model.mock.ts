import * as Chance from 'chance';
import * as moment from 'moment';
import { NotificationAction, NotificationObjectType, NotificationStatus } from '../enums/notification.enum';
import { AccountNotification,
  DistributorNotification,
  ListAddCollaboratorNotification,
  ListTransferOwnershipNotification,
  OpportunityNotification,
  StoreNotification } from './notification.model';
import { OpportunityType } from '../enums/list-opportunities/list-opportunity-type.enum';

let chance = new Chance();

export function getTargetListNotificationNotificationMock(): any {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: NotificationObjectType.TARGET_LIST,
    objectId: chance.string(),
    action: NotificationAction.SHARE_TARGET_LIST,
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
    status: NotificationStatus.SEEN
  };
}
export function getListAddCollaboratorNotificationMock(): ListAddCollaboratorNotification {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: NotificationObjectType.LIST,
    objectId: chance.string(),
    action: NotificationAction.LIST_COLLABORATOR_ADDED,
    salesforceUserNoteID: null,
    creator: {
      id: chance.integer(),
      firstName: chance.string(),
      lastName: chance.string(),
      email: chance.string()
    },
    shortenedObject: {
      id: chance.string(),
      name: chance.string(),
      valid: chance.bool()
    },
    status: NotificationStatus.SEEN
  };
}

export function getListTransferOwnershipNotificationMock(): ListTransferOwnershipNotification {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: NotificationObjectType.LIST,
    objectId: chance.string(),
    action: NotificationAction.LIST_OWNER_CHANGED,
    salesforceUserNoteID: null,
    creator: {
      id: chance.integer(),
      firstName: chance.string(),
      lastName: chance.string(),
      email: chance.string()
    },
    shortenedObject: {
      id: chance.string(),
      name: chance.string(),
      valid: chance.bool()
    },
    status: NotificationStatus.SEEN
  };
}

export function getOpportunityNotificationMock(): OpportunityNotification {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: NotificationObjectType.OPPORTUNITY,
    objectId: chance.string(),
    action: NotificationAction.SHARE_OPPORTUNITY,
    salesforceUserNoteID: null,
    creator: {
      id: chance.integer(),
      firstName: chance.string(),
      lastName: chance.string(),
      email: chance.string()
    },
    shortenedObject: {
      id: chance.string(),
      store: {
        tdlinx_number: chance.integer(),
        store_name: chance.string(),
        store_number: chance.integer(),
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
        brandCode: chance.integer()
      },
      type: OpportunityType.MANUAL,
      subType: 'ND_001',
      valid: chance.bool()
    },
    status: NotificationStatus.SEEN
  };
}

export function getStoreNotificationMock(): StoreNotification {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: NotificationObjectType.STORE,
    objectId: chance.string(),
    action: NotificationAction.ADDED_NOTE,
    salesforceUserNoteID: chance.string(),
    creator: {
      id: chance.integer(),
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
    status: NotificationStatus.SEEN
  };
}

export function getAccountNotificationMock(): AccountNotification {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: NotificationObjectType.ACCOUNT,
    objectId: chance.string(),
    action: NotificationAction.ADDED_NOTE,
    salesforceUserNoteID: chance.string(),
    creator: {
      id: chance.integer(),
      firstName: chance.string(),
      lastName: chance.string(),
      email: chance.string()
    },
    shortenedObject: {
      id: chance.string(),
      name: chance.string(),
      value: chance.bool()
    },
    status: NotificationStatus.SEEN
  };
}

export function getDistributorNotificationMock(): DistributorNotification {
  return {
    dateCreated: moment(),
    dateUpdated: moment(),
    id: chance.string(),
    objectType: NotificationObjectType.DISTRIBUTOR,
    objectId: chance.string(),
    action: NotificationAction.ADDED_NOTE,
    salesforceUserNoteID: chance.string(),
    creator: {
      id: chance.integer(),
      firstName: chance.string(),
      lastName: chance.string(),
      email: chance.string()
    },
    shortenedObject: {
      id: chance.string(),
      name: chance.string(),
      value: chance.bool()
    },
    status: NotificationStatus.SEEN
  };
}
