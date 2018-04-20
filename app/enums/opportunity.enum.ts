export enum OpportunityType {
  'NON_BUY' = 'NON_BUY',
  'AT_RISK' = 'AT_RISK',
  'LOW_VELOCITY' = 'LOW_VELOCITY',
  'MANUAL' = 'MANUAL',
  'NEW_PLACEMENT_NO_REBUY' = 'NEW_PLACEMENT_NO_REBUY',
  'NEW_PLACEMENT_QUALITY' = 'NEW_PLACEMENT_QUALITY'
}

export enum OpportunityTypeLabel {
  'NON_BUY' = 'Non-Buy',
  'AT_RISK' = 'At Risk',
  'LOW_VELOCITY' = 'Low Velocity',
  'MANUAL' = 'Manual',
  'NEW_PLACEMENT_NO_REBUY' = 'New Placement (Quality)',
  'NEW_PLACEMENT_QUALITY' = 'New Placement (No Rebuy)'
}

export enum OpportunityStatus {
  Active = 'active',
  Closed = 'closed',
  Open = 'open',
  Unknown = 'unknown'
}

export enum OpportunityImpact {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Unknown = 'unknown'
}
