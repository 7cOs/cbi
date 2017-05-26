interface Notification {
  dateCreated: string;
  dateUpdated: string;
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

interface TargetListNotification extends Notification {
  shortenedObject: {
    id: string;
    name: string;
    valid: boolean;
  };
}

interface OpportunityNotification extends Notification {
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

interface StoreNotification extends Notification {
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

type NotificationObjectType = 'TARGET_LIST' | 'OPPORTUNITY' | 'STORE';

type NotificationAction = 'SHARE_TARGET_LIST' | 'SHARE_OPPORTUNITY' | 'ADDED_NOTE';

type NotificationStatus = 'SEEN' | 'READ';

type OpportunityType = 'NON_BUY' | 'AT_RISK' | 'LOW_VELOCITY' | 'MANUAL' | 'NEW_PLACEMENT_NO_REBUY' | 'NEW_PLACEMENT_QUALITY';
