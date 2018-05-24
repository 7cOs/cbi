import * as Chance from 'chance';
import { generateRandomSizedArray } from '../util.model';
import * as moment from 'moment';

import { ListsOpportunities } from './lists-opportunities.model';
import { getOpportunityImpactMock } from '../../enums/list-opportunities/list-opportunity-impact.enum.mock';
import { getOpportunityStatusMock } from '../../enums/list-opportunities/list-opportunity-status.enum.mock';
import { getOpportunityTypeMock } from '../../enums/list-opportunities/list-opportunity-type.enum.mock';
import { getListOpportunityFeatureTypeMock } from './lists-opportunities-feature-type.model.mock';
import { getListOpportunityItemAuthorizationMock } from './lists-opportunities-item-authorization.model.mock';

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
    lastDepletionDate: moment().format('YYYYMMDD'),
    unversionedStoreId: chance.string(),
    isSimpleDistribution: chance.bool(),
    rationale: chance.string(),
    featureType: getListOpportunityFeatureTypeMock(),
  itemAuthorization: getListOpportunityItemAuthorizationMock()
  };
}
