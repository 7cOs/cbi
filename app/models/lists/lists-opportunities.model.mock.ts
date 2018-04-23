import * as Chance from 'chance';
import { generateRandomSizedArray } from '../util.model';

import { ListsOpportunities } from './lists-opportunities.model';
import { getOpportunityImpactMock, getOpportunityStatusMock, getOpportunityTypeMock } from '../../enums/opportunity.enum.mock';

let chance = new Chance();

export function getListOpportunitiesMock(): ListsOpportunities[] {
    return generateRandomSizedArray(1, 3).map(() => getListOpportunityMock());
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
