import { Moment } from 'moment';

export interface Notification {
  dateCreated: Moment;
  dateUpdated: Moment;
  id: string;
  objectType: NotificationObject;
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

export type NotificationObject = 'TARGET_LIST' | 'OPPORTUNITY' | 'STORE' | 'ACCOUNT';

export type NotificationAction = 'SHARE_TARGET_LIST' | 'SHARE_OPPORTUNITY' | 'ADDED_NOTE' | 'ARCHIVE_TARGET_LIST';

export type NotificationStatus = 'SEEN' | 'READ';

export type OpportunityType = 'NON_BUY' | 'AT_RISK' | 'LOW_VELOCITY' | 'MANUAL' | 'NEW_PLACEMENT_NO_REBUY' | 'NEW_PLACEMENT_QUALITY';
