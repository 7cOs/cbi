import { sample } from 'lodash';

import { OpportunityTypeLabel } from './list-opportunity-type-label.enum';

const opportunityTypeLabelValues = Object.keys(OpportunityTypeLabel).map(key => OpportunityTypeLabel[key]);

const opportunitySubTypeValues = [
  'Mixed',
  'ND001',
  'ND_001',
  'AT_RISK',
  'NON_BUY',
  'NEW_PLACEMENT_NO_REBUY',
  'NEW_PLACEMENT_QUALITY',
  'LOW_VELOCITY'
];

export function getOpportunityTypeLabelMock(): OpportunityTypeLabel {
  return sample(opportunityTypeLabelValues);
}

export function getOpportunitySubTypeValueMock(): string {
  return sample(opportunitySubTypeValues);
}
