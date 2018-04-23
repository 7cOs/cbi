import { sample } from 'lodash';

import { OpportunityImpact, OpportunityStatus, OpportunityType, OpportunityTypeLabel } from './opportunity.enum';

const opportunityTypeValues = Object.keys(OpportunityType).map(key => OpportunityType[key]);
const opportunityStatusValues = Object.keys(OpportunityStatus).map(key => OpportunityStatus[key]);
const opportunityImpactValues = Object.keys(OpportunityImpact).map(key => OpportunityImpact[key]);
const opportunityTypeLabelValues = Object.keys(OpportunityTypeLabel).map(key => OpportunityTypeLabel[key]);

export function getOpportunityTypeMock(): OpportunityType {
  return sample(opportunityTypeValues);
}

export function getOpportunityStatusMock(): OpportunityStatus {
  return sample(opportunityStatusValues);
}

export function getOpportunityImpactMock(): OpportunityImpact {
  return sample(opportunityImpactValues);
}

export function getOpportunityTypeLabelMock(): OpportunityTypeLabel {
  return sample(opportunityTypeLabelValues);
}
