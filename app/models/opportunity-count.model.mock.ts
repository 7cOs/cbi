import * as Chance from 'chance';

import { OpportunitiesGroupedByBrandSkuPackageCode, OpportunityCount } from './opportunity-count.model';

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

export function getOpportunitiesGroupedByBrandSkuPackageCodeMock(): OpportunitiesGroupedByBrandSkuPackageCode {
  return {
    [chance.string()]: {
      brandSkuPackageOpportunityCountTotal: chance.natural(),
      opportunityCounts: getOpportunityCountMocks()
    },
    [chance.string()]: {
      brandSkuPackageOpportunityCountTotal: chance.natural(),
      opportunityCounts: getOpportunityCountMocks()
    }
  };
}
