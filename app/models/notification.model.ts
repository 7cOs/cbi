import { Moment } from 'moment';

import { NotificationObjectType, NotificationAction, NotificationStatus } from '../enums/notification.enum';
import { OpportunityType } from '../enums/list-opportunities/list-opportunity-type.enum';

export interface Notification {
  dateCreated: Moment;
  dateUpdated: Moment;
  id: string;
  objectType: NotificationObjectType;
  objectId: string;
  action: NotificationAction;
  salesforceUserNoteID: string;
  creator: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: NotificationStatus;
}

export interface TargetListNotification extends Notification {
  shortenedObject: {
    id: string;
    name: string;
    valid: boolean;
  };
}

export interface ListAddCollaboratorNotification extends Notification {
  shortenedObject: {
    id: string;
    name: string;
    valid: boolean;
  };
}

export interface ListTransferOwnershipNotification extends Notification {
  shortenedObject: {
    id: string;
    name: string;
    valid: boolean;
  };
}

export interface OpportunityNotification extends Notification {
  shortenedObject: {
    id: string;
    store: {
      tdlinx_number: number;
      store_name: string;
      store_number: number;
      address: string;
      city: string;
      state: string;
      valid: boolean;
    };
    product: {
      id: string;
      name: string;
      type: null;
      brand: string;
      brandCode: number;
    };
    type: OpportunityType;
    subType: string;
    valid: boolean;
  };
}

export interface StoreNotification extends Notification {
  shortenedObject: {
    tdlinx_number: number;
    store_name: string;
    store_number: number;
    address: string;
    city: string;
    state: string;
    valid: boolean;
  };
}

export interface AccountNotification extends Notification {
  shortenedObject: {
    id: string;
    name: string;
    value: boolean;
  };
}

export interface DistributorNotification extends Notification {
  shortenedObject: {
    id: string;
    name: string;
    value: boolean;
  };
}
