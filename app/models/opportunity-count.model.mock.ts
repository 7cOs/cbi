import * as Chance from 'chance';

import { GroupedOpportunityCounts, OpportunityCount } from './opportunity-count.model';

const chance = new Chance();

export function getOpportunityCountMock(): OpportunityCount {
  return {
    name: chance.string(),
    count: chance.natural()
  };
}

export function getOpportunityCountMocks(): Array<OpportunityCount> {
  return Array(chance.natural({min: 1, max: 20})).fill('').map(() => getOpportunityCountMock());
}

export function getGroupedOpportunityCountsMock(): GroupedOpportunityCounts {
  return {
    [chance.string()]: {
      total: chance.natural()
    },
    [chance.string()]: {
      total: chance.natural()
    }
  };
}
