import { sample } from 'lodash';

import { OpportunityImpact } from './list-opportunity-impact.enum';

const opportunityImpactValues = Object.keys(OpportunityImpact).map(key => OpportunityImpact[key]);

export function getOpportunityImpactMock(): OpportunityImpact {
  return sample(opportunityImpactValues);
}
