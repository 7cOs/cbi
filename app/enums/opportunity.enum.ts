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
  'NEW_PLACEMENT_NO_REBUY' = 'New Placement (No Rebuy)',
  'NEW_PLACEMENT_QUALITY' = 'New Placement (Quality)'
}

export enum OpportunityStatus {
  active = 'active',
  closed = 'closed',
  open = 'open',
  unknown = 'unknown'
}

export enum OpportunityImpact {
  low = 'low',
  medium = 'medium',
  high = 'high',
  unknown = 'unknown'
}
