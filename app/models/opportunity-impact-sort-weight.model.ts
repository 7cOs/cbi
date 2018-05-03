import { OpportunityImpact } from '../enums/list-opportunities/list-opportunity-impact.enum';

export const opportunityImpactSortWeight = {
  [OpportunityImpact.high]: 1,
  [OpportunityImpact.medium]: 2,
  [OpportunityImpact.low]: 3,
  [OpportunityImpact.unknown]: 4
};
