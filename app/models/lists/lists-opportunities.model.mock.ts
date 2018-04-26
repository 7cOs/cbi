import * as Chance from 'chance';
import { generateRandomSizedArray } from '../util.model';

import { ListsOpportunities } from './lists-opportunities.model';
import { getOpportunityImpactMock } from '../../enums/list-opportunities/list-opportunity-impact.enum.mock';
import { getOpportunityStatusMock } from '../../enums/list-opportunities/list-opportunity-status.enum.mock';
import { getOpportunityTypeMock } from '../../enums/list-opportunities/list-opportunity-type.enum.mock';

const chance = new Chance();

export function getListOpportunitiesMock(): ListsOpportunities[] {
  return generateRandomSizedArray().map(() => getListOpportunityMock());
}

export function getListOpportunityMock(): ListsOpportunities {
  return {
    id: chance.string(),
    brandCode: chance.string(),
    brandDescription: chance.string(),
    skuDescription: chance.string(),
    type: getOpportunityTypeMock(),
    status: getOpportunityStatusMock(),
    impact: getOpportunityImpactMock(),
    currentDepletions_CYTD: chance.natural(),
    yearAgoDepletions_CYTD: chance.natural(),
    lastDepletionDate: chance.string(),
    unversionedStoreId: chance.string()
  };
}
