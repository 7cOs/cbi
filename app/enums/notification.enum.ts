export enum NotificationObjectType {
    'TARGET_LIST' = <any>'TARGET_LIST',
    'OPPORTUNITY' = <any>'OPPORTUNITY',
    'STORE' = <any>'STORE',
    'ACCOUNT' = <any>'ACCOUNT'
}

export enum NotificationAction {
  'SHARE_TARGET_LIST' = <any>'SHARE_TARGET_LIST',
  'SHARE_OPPORTUNITY' = <any>'SHARE_OPPORTUNITY',
  'ADDED_NOTE' = <any>'ADDED_NOTE',
  'ARCHIVE_TARGET_LIST' = <any>'ARCHIVE_TARGET_LIST'
}

export enum NotificationStatus {
  'SEEN' = <any>'SEEN',
  'READ' = <any>'READ'
}

export enum OpportunityType {
  'NON_BUY' = <any>'NON_BUY',
  'AT_RISK' = <any>'AT_RISK',
  'LOW_VELOCITY' = <any>'LOW_VELOCITY',
  'MANUAL' = <any>'MANUAL',
  'NEW_PLACEMENT_NO_REBUY' = <any>'NEW_PLACEMENT_NO_REBUY',
  'NEW_PLACEMENT_QUALITY' = <any>'NEW_PLACEMENT_QUALITY'
}
